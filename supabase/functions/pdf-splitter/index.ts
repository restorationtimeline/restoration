import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { sourceId, filePath, force = false } = await req.json()
    console.log(`Processing PDF split for source ${sourceId} at path ${filePath}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the PDF file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('source_files')
      .download(filePath)

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError)
      throw downloadError
    }

    // Load the PDF document
    const pdfBytes = await fileData.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const numberOfPages = pdfDoc.getPageCount()
    console.log(`PDF has ${numberOfPages} pages`)

    // Create pages subfolder path using the sourceId
    const pagesPath = `${sourceId}/pages`
    
    // Create the pages folder with a .keep file
    const { error: folderError } = await supabase
      .storage
      .from('source_files')
      .upload(`${pagesPath}/.keep`, new Blob(['']))

    if (folderError && !folderError.message.includes('The resource already exists')) {
      console.error('Error creating pages folder:', folderError)
      throw folderError
    }

    // Add pages to the queue
    for (let i = 0; i < numberOfPages; i++) {
      const { error: queueError } = await supabase
        .from('pdf_page_queue')
        .upsert({
          source_id: sourceId,
          page_number: i + 1,
          status: 'pending',
          attempts: 0,
          processed_at: null,
          error: null
        }, {
          onConflict: 'source_id,page_number'
        })

      if (queueError) {
        console.error(`Error queueing page ${i + 1}:`, queueError)
        throw queueError
      }
    }

    // Update the content source with metadata about the total pages
    const { error: updateError } = await supabase
      .from('content_sources')
      .update({
        metadata: {
          total_pages: numberOfPages,
          pages_folder: pagesPath
        }
      })
      .eq('id', sourceId)

    if (updateError) {
      console.error('Error updating content source:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({
        message: 'PDF pages queued successfully',
        numberOfPages,
        pagesPath
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing PDF:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

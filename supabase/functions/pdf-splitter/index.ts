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
    const { sourceId, filePath } = await req.json()
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

    // Split each page into a separate PDF
    for (let i = 0; i < numberOfPages; i++) {
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(pdfDoc, [i])
      newPdf.addPage(page)
      
      const newPdfBytes = await newPdf.save()
      const pageFilePath = `${pagesPath}/page-${i + 1}.pdf`

      // Upload the single page PDF
      const { error: uploadError } = await supabase
        .storage
        .from('source_files')
        .upload(pageFilePath, newPdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (uploadError) {
        console.error(`Error uploading page ${i + 1}:`, uploadError)
        throw uploadError
      }

      console.log(`Successfully uploaded page ${i + 1}`)
    }

    // Update the content source with metadata about the split pages
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
        message: 'PDF split successfully',
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

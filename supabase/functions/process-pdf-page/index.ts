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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the next pending page from the queue
    const { data: queueItem, error: queueError } = await supabase
      .from('pdf_page_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (queueError) {
      if (queueError.code === 'PGRST116') {
        // No pending items
        return new Response(
          JSON.stringify({ message: 'No pending pages to process' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      throw queueError
    }

    // Update status to processing
    await supabase
      .from('pdf_page_queue')
      .update({
        status: 'processing',
        attempts: queueItem.attempts + 1
      })
      .eq('id', queueItem.id)

    // Get the source file path
    const { data: source, error: sourceError } = await supabase
      .from('content_sources')
      .select('file_path')
      .eq('id', queueItem.source_id)
      .single()

    if (sourceError) throw sourceError

    // Download the PDF file
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('source_files')
      .download(source.file_path)

    if (downloadError) throw downloadError

    // Load the PDF and extract the page
    const pdfBytes = await fileData.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const newPdf = await PDFDocument.create()
    const [page] = await newPdf.copyPages(pdfDoc, [queueItem.page_number - 1])
    newPdf.addPage(page)
    
    const newPdfBytes = await newPdf.save()
    const pageFilePath = `${queueItem.source_id}/pages/page-${queueItem.page_number}.pdf`

    // Upload the single page PDF
    const { error: uploadError } = await supabase
      .storage
      .from('source_files')
      .upload(pageFilePath, newPdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Update queue item status to completed
    await supabase
      .from('pdf_page_queue')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', queueItem.id)

    return new Response(
      JSON.stringify({
        message: 'Page processed successfully',
        pageNumber: queueItem.page_number
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing PDF page:', error)

    // If we have a queue item, update its status
    if (error.queueItemId) {
      await supabase
        .from('pdf_page_queue')
        .update({
          status: 'failed',
          error: error.message
        })
        .eq('id', error.queueItemId)
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
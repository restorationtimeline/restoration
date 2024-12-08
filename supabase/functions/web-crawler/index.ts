import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12';
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceId } = await req.json();
    console.log(`Processing source: ${sourceId}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get source details
    const { data: source, error: sourceError } = await supabase
      .from('content_sources')
      .select('*')
      .eq('id', sourceId)
      .single();

    if (sourceError) throw sourceError;
    if (!source?.url) throw new Error('No URL provided');

    console.log(`Fetching URL: ${source.url}`);

    // Create website record
    const domain = new URL(source.url).hostname;
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .insert({
        source_id: sourceId,
        domain,
        status: 'active'
      })
      .select()
      .single();

    if (websiteError) throw websiteError;

    // Fetch and process the page
    const response = await fetch(source.url);
    const html = await response.text();
    
    // Parse HTML
    const $ = cheerio.load(html);
    const title = $('title').text();
    const content = $('body').text();
    
    // Generate content hash
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const contentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create page record
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        website_id: website.id,
        url: source.url,
        title,
        content,
        last_hash: contentHash,
        last_crawled_at: new Date().toISOString(),
        status: 'published'
      })
      .select()
      .single();

    if (pageError) throw pageError;

    // Create page version
    const { error: versionError } = await supabase
      .from('page_versions')
      .insert({
        page_id: page.id,
        content_hash: contentHash,
        content,
        normalized_content: content,
        metadata: {
          title,
          crawl_date: new Date().toISOString()
        }
      });

    if (versionError) throw versionError;

    // Update source status
    const { error: updateError } = await supabase
      .from('content_sources')
      .update({
        status: 'published',
        page_title: title,
        page_content: content,
        last_crawled_at: new Date().toISOString()
      })
      .eq('id', sourceId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, message: 'Page crawled successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in web-crawler function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
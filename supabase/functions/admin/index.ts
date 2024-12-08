import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('Not authenticated')
    }

    // Create a Supabase client with the user's JWT
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Verify the user exists and get their data
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (userError || !user) {
      console.error('User verification failed:', userError)
      throw new Error('Not authenticated')
    }

    console.log('User authenticated:', user.id)

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch failed:', profileError)
      throw new Error('Not authorized')
    }

    if (profile?.role !== 'admin') {
      console.error('User is not an admin:', user.id)
      throw new Error('Not authorized')
    }

    console.log('Admin access verified for user:', user.id)

    // Parse the request
    const { action, ...params } = await req.json()
    console.log('Processing admin action:', action, 'with params:', params)

    switch (action) {
      case 'listUsers': {
        const { data: users, error } = await adminClient.auth.admin.listUsers()
        if (error) {
          console.error('Failed to list users:', error)
          throw error
        }

        const { data: profiles } = await adminClient
          .from('profiles')
          .select('id, display_name, role, full_name, profile_photo_url')

        const profilesMap = new Map(profiles?.map(p => [p.id, p]))
        const enrichedUsers = users.users.map(user => ({
          ...user,
          profile: profilesMap.get(user.id),
        }))

        return new Response(
          JSON.stringify({ users: enrichedUsers }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        console.error('Invalid action requested:', action)
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Admin function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Not authenticated' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Verify the request is from an admin
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const supabase = createClient(supabaseUrl, authHeader.replace('Bearer ', ''))
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Not authenticated' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return new Response(
      JSON.stringify({ error: 'Not authorized' }),
      { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Parse the request
  const { action, ...params } = await req.json()

  try {
    switch (action) {
      case 'listUsers': {
        const { data: users, error } = await adminClient.auth.admin.listUsers()
        if (error) throw error

        const { data: profiles } = await adminClient
          .from('profiles')
          .select('id, display_name, role')

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

      case 'inviteUser': {
        const { email } = params
        const { error } = await adminClient.auth.admin.inviteUserByEmail(email)
        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'updateUserRole': {
        const { userId, role } = params
        const { error } = await adminClient
          .from('profiles')
          .update({ role })
          .eq('id', userId)
        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Admin function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
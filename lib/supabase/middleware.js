import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

/**
 * Refreshes the user's session token and updates cookies.
 * This is designed to be invoked by the main Next.js middleware.
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session token by fetching the user.
  // This is required to keep sessions alive across page transitions.
  await supabase.auth.getUser()

  return supabaseResponse
}

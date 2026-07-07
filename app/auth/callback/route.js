import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Endpoint to exchange GitHub OAuth code for a Supabase session.
 * Standard Next.js Route Handler for Supabase Auth redirect.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('OAuth code exchange failed:', error.message);
  }

  // On failure or cancellation, redirect back to landing page
  return NextResponse.redirect(`${origin}/`);
}

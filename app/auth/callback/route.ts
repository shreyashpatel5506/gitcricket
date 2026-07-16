import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upsertProfile } from '@/services/profile';

/**
 * Endpoint to exchange GitHub OAuth code for a Supabase session
 * and automatically upsert/create the user profile.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (!code) {
    console.error('Callback error: Missing code parameter');
    return NextResponse.redirect(`${origin}/?error=missing_auth_code`);
  }

  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('OAuth code exchange failed:', exchangeError.message);
      return NextResponse.redirect(`${origin}/?error=auth_exchange_failed&message=${encodeURIComponent(exchangeError.message)}`);
    }

    // Retrieve the authenticated user's details
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Failed to retrieve user after login:', userError?.message || 'No user data');
      return NextResponse.redirect(`${origin}/?error=user_retrieval_failed`);
    }

    // Extract user metadata parameters
    const id = user.id;
    const email = user.email ?? null;
    const github_username = user.user_metadata?.user_name ?? null;
    const full_name = user.user_metadata?.full_name ?? null;
    const avatar_url = user.user_metadata?.avatar_url ?? null;
    
    // Extract provider (defaults to 'github' or extracts from metadata)
    const provider = user.app_metadata?.provider ?? user.identities?.[0]?.provider ?? 'github';

    // Automatic user profile creation / update in `profiles` table
    await upsertProfile(supabase, {
      id,
      github_username,
      full_name,
      email,
      avatar_url,
      provider,
    });

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error: any) {
    console.error('Unhandled callback exception:', error);
    const errorMessage = error?.message || 'Internal Server Error';
    return NextResponse.redirect(`${origin}/?error=callback_exception&message=${encodeURIComponent(errorMessage)}`);
  }
}

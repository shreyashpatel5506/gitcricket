import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardContent from './DashboardContent';

export const revalidate = 0; // Disable caching on the dashboard route to pull real-time bookmarks

export default async function Page() {
  const supabase = await createClient();

  // 1. Authenticate user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/');
  }

  // 2. Hydrate dashboard data in parallel
  const [profileResult, bookmarksResult, historyResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),

    supabase
      .from('user_saved_cards')
      .select(`
        id,
        created_at,
        generated_cards (
          id,
          overall,
          player_role,
          theme,
          github_profile_cache (
            github_username,
            name,
            avatar_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    supabase
      .from('user_search_history')
      .select('*')
      .eq('user_id', user.id)
      .order('searched_at', { ascending: false })
      .limit(8)
  ]);

  const profile = profileResult.data;
  const savedCards = bookmarksResult.data || [];
  const searchHistory = historyResult.data || [];

  if (!profile) {
    // Session is active but database trigger hasn't finished writing profile, redirect to home
    redirect('/');
  }

  // 3. Fetch user's own card if it exists
  let ownCard = null;
  if (profile.github_username) {
    const { data: cachedProfile } = await supabase
      .from('github_profile_cache')
      .select('id')
      .eq('github_username', profile.github_username.toLowerCase())
      .maybeSingle();

    if (cachedProfile) {
      const { data: card } = await supabase
        .from('generated_cards')
        .select('*')
        .eq('github_profile_id', cachedProfile.id)
        .eq('theme', 'dark')
        .maybeSingle();

      ownCard = card;
    }
  }

  return (
    <DashboardContent
      profile={profile}
      ownCard={ownCard}
      savedCards={savedCards}
      searchHistory={searchHistory}
    />
  );
}
export const metadata = {
  title: "Dashboard Locker Room — GitCric",
  description: "Manage your generated cricket player cards, unlock achievements, and review your search history."
};

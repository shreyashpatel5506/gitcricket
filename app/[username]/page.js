import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/connect';
import { fetchGitHubUserData } from '@/services/github';
import { transformGitHubData } from '@/features/scanner/utils/transformer';
import { syncGamification } from '@/services/gamification';
import CardShowcase from './CardShowcase';

export const revalidate = 0; // Disable path generation caching to allow fresh scans

const RESERVED_ROUTES = [
  'api',
  'auth',
  'card',
  'dashboard',
  'favicon.ico',
  'globals.css',
  'robots.txt',
  'sitemap.xml',
  'public',
  'images',
  'assets'
];

/**
 * Server page component for the dynamic player card route.
 * Note: params is a Promise in Next.js 15+ and must be awaited.
 */
export default async function Page({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams.username?.trim().toLowerCase();

  if (!username || RESERVED_ROUTES.includes(username)) {
    return notFound();
  }

  // 1. Query database cache
  const { data: cachedProfile, error: selectError } = await supabase
    .from('github_profile_cache')
    .select('*')
    .eq('github_username', username)
    .maybeSingle();

  const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;
  let profile = cachedProfile;
  let card = null;

  const isFresh = cachedProfile && (Date.now() - new Date(cachedProfile.cached_at).getTime()) < CACHE_EXPIRY_MS;

  if (isFresh) {
    // Cache is fresh, fetch associated default theme card
    const { data: cachedCard } = await supabase
      .from('generated_cards')
      .select('*')
      .eq('github_profile_id', cachedProfile.id)
      .eq('theme', 'dark')
      .maybeSingle();

    card = cachedCard;
  }

  // 2. Fetch from GitHub API and transform if stale or not cached
  if (!profile || !card) {
    try {
      console.log(`[Server] Scraping profile details from GitHub for user "${username}"...`);
      const rawUserData = await fetchGitHubUserData(username);
      const transformed = transformGitHubData(rawUserData);

      let profileCacheId;

      if (profile) {
        profileCacheId = profile.id;
        // Update stale cache record
        const { error: updateError } = await supabase
          .from('github_profile_cache')
          .update({
            name: transformed.profileCache.name,
            avatar_url: transformed.profileCache.avatar_url,
            bio: transformed.profileCache.bio,
            country: transformed.profileCache.country,
            city: transformed.profileCache.city,
            state: transformed.profileCache.state,
            company: transformed.profileCache.company,
            college: transformed.profileCache.college,
            primary_language: transformed.profileCache.primary_language,
            followers: transformed.profileCache.followers,
            following: transformed.profileCache.following,
            public_repos: transformed.profileCache.public_repos,
            total_stars: transformed.profileCache.total_stars,
            total_forks: transformed.profileCache.total_forks,
            contribution_count: transformed.profileCache.contribution_count,
            current_streak: transformed.profileCache.current_streak,
            longest_streak: transformed.profileCache.longest_streak,
            raw_graphql: transformed.profileCache.raw_graphql,
            cached_at: transformed.profileCache.cached_at
          })
          .eq('id', profileCacheId);

        if (updateError) throw new Error(updateError.message);
        
        // Merge values
        profile = { ...profile, ...transformed.profileCache };
      } else {
        // Insert new cache record
        const { data: insertedProfile, error: insertError } = await supabase
          .from('github_profile_cache')
          .insert({
            github_username: transformed.profileCache.github_username,
            github_id: transformed.profileCache.github_id,
            name: transformed.profileCache.name,
            avatar_url: transformed.profileCache.avatar_url,
            bio: transformed.profileCache.bio,
            country: transformed.profileCache.country,
            city: transformed.profileCache.city,
            state: transformed.profileCache.state,
            company: transformed.profileCache.company,
            college: transformed.profileCache.college,
            primary_language: transformed.profileCache.primary_language,
            followers: transformed.profileCache.followers,
            following: transformed.profileCache.following,
            public_repos: transformed.profileCache.public_repos,
            total_stars: transformed.profileCache.total_stars,
            total_forks: transformed.profileCache.total_forks,
            contribution_count: transformed.profileCache.contribution_count,
            current_streak: transformed.profileCache.current_streak,
            longest_streak: transformed.profileCache.longest_streak,
            account_created_at: transformed.profileCache.account_created_at,
            raw_graphql: transformed.profileCache.raw_graphql,
            cached_at: transformed.profileCache.cached_at
          })
          .select('id')
          .single();

        if (insertError) throw new Error(insertError.message);
        profileCacheId = insertedProfile.id;
        profile = { id: profileCacheId, ...transformed.profileCache };
      }

      // Sync achievements & badges
      try {
        await syncGamification(supabase, profileCacheId, transformed.profileCache);
      } catch (gamificationErr) {
        console.warn('[Server] Gamification sync failed:', gamificationErr.message);
      }

      // 3. Upsert default card configuration
      const { data: existingCard, error: cardSelectError } = await supabase
        .from('generated_cards')
        .select('*')
        .eq('github_profile_id', profileCacheId)
        .eq('theme', 'dark')
        .maybeSingle();

      if (cardSelectError) throw new Error(cardSelectError.message);

      if (existingCard) {
        const { data: updatedCard, error: cardUpdateError } = await supabase
          .from('generated_cards')
          .update({
            overall: transformed.cardRatings.overall,
            batting: transformed.cardRatings.batting,
            bowling: transformed.cardRatings.bowling,
            fielding: transformed.cardRatings.fielding,
            fitness: transformed.cardRatings.fitness,
            technique: transformed.cardRatings.technique,
            experience: transformed.cardRatings.experience,
            player_role: transformed.cardRatings.player_role,
            created_at: new Date().toISOString()
          })
          .eq('id', existingCard.id)
          .select()
          .single();

        if (cardUpdateError) throw new Error(cardUpdateError.message);
        card = updatedCard;
      } else {
        const { data: insertedCard, error: cardInsertError } = await supabase
          .from('generated_cards')
          .insert({
            github_profile_id: profileCacheId,
            overall: transformed.cardRatings.overall,
            batting: transformed.cardRatings.batting,
            bowling: transformed.cardRatings.bowling,
            fielding: transformed.cardRatings.fielding,
            fitness: transformed.cardRatings.fitness,
            technique: transformed.cardRatings.technique,
            experience: transformed.cardRatings.experience,
            player_role: transformed.cardRatings.player_role,
            theme: 'dark',
            public_slug: `${username}-dark`
          })
          .select()
          .single();

        if (cardInsertError) throw new Error(cardInsertError.message);
        card = insertedCard;
      }

    } catch (err) {
      console.error(`[Server] Error processing player card for "${username}":`, err.message);
      
      // Render clean error fallback boundaries
      return (
        <div className="min-h-screen bg-bg-void text-text-primary flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-panel p-8 rounded-2xl max-w-md flex flex-col items-center gap-4 border border-error/20">
            <span className="text-4xl">🌧️</span>
            <h2 className="text-xl font-bold uppercase tracking-wider text-error">Rain Stopped Play</h2>
            <p className="text-sm text-text-secondary">
              {err.message.includes('not found') 
                ? `The profile for "${username}" does not exist on GitHub.`
                : 'Connection to GitHub timed out or rate limits hit. Please check spelling or retry.'}
            </p>
            <a href="/" className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-green-core px-5 text-xs font-semibold text-bg-void hover:bg-green-core/90 active:scale-95 transition-all">
              Try Another Username
            </a>
          </div>
        </div>
      );
    }
  }

  // 4. Return client display dashboard with populated server attributes
  let countryRank = 1;
  try {
    const { data: countryCountData, error: rankError } = await supabase
      .from('generated_cards')
      .select('id, github_profile_cache!inner(country)')
      .eq('theme', 'dark')
      .eq('github_profile_cache.country', profile.country || 'India')
      .gt('overall', card.overall);

    if (rankError) throw rankError;
    countryRank = (countryCountData?.length || 0) + 1;
  } catch (rankErr) {
    console.warn('Failed to calculate country rank on server:', rankErr.message);
  }

  // 5. Query active league enrollment for the public profile being viewed
  let activeEnrollment = null;
  let leagueRank = null;

  try {
    const { data: profileUser } = await supabase
      .from('profiles')
      .select('id')
      .ilike('github_username', username)
      .maybeSingle();

    if (profileUser) {
      const { data: enrollment } = await supabase
        .from('league_enrollments')
        .select(`
          role,
          season_id,
          league_id,
          leagues (name, code),
          teams (name, short_name)
        `)
        .eq('user_id', profileUser.id)
        .maybeSingle();

      if (enrollment && card) {
        activeEnrollment = {
          role: enrollment.role,
          leagueName: enrollment.leagues?.name || '',
          leagueCode: enrollment.leagues?.code || '',
          teamName: enrollment.teams?.name || 'Country Representative',
          teamShort: enrollment.teams?.short_name || null
        };

        // Query the rank of the player card within this season
        const { data: countData } = await supabase
          .from('generated_cards')
          .select('id')
          .eq('season_id', enrollment.season_id)
          .eq('theme', 'dark')
          .gt('overall', card.overall);

        leagueRank = (countData?.length || 0) + 1;
      }
    }
  } catch (enrollErr) {
    console.warn('Failed to fetch league enrollment for profile card:', enrollErr.message);
  }

  const profileWithRank = {
    ...profile,
    country: profile.country || 'India',
    rank: countryRank
  };

  return (
    <CardShowcase 
      profile={profileWithRank} 
      card={card} 
      activeEnrollment={activeEnrollment}
      leagueRank={leagueRank}
    />
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams.username?.trim().toLowerCase();

  if (!username || RESERVED_ROUTES.includes(username)) {
    return {};
  }

  let title = `@${username}'s Cricket Player Card — GitCric`;
  let description = `Inspect @${username}'s coding stats mapped directly as batting, bowling, technique and fitness ratings.`;
  let avatarUrl = '';

  try {
    const { data: cachedProfile } = await supabase
      .from('github_profile_cache')
      .select('id, avatar_url, name')
      .eq('github_username', username)
      .maybeSingle();

    if (cachedProfile) {
      avatarUrl = cachedProfile.avatar_url;
      const { data: cachedCard } = await supabase
        .from('generated_cards')
        .select('overall, player_role')
        .eq('github_profile_id', cachedProfile.id)
        .eq('theme', 'dark')
        .maybeSingle();

      if (cachedCard) {
        const displayName = cachedProfile.name || username;
        title = `🏏 ${displayName} (${cachedCard.overall} OVR | ${cachedCard.player_role}) — GitCric`;
        description = `Check out @${username}'s 3D cricket player card! Overall: ${cachedCard.overall} | Role: ${cachedCard.player_role}. GitCric transforms GitHub metrics into interactive sports sports player cards.`;
      }
    }
  } catch (err) {
    console.warn('Metadata fetch failed:', err);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gitcric.me';
  const ogImageUrl = `${siteUrl}/api/og?username=${username}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'profile',
      username: username,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    }
  };
}

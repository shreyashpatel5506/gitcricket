import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/connect';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { fetchGitHubUserData } from '@/services/github';
import { transformGitHubData } from '@/features/scanner/utils/transformer';

// Cache expiry duration in milliseconds: 24 Hours
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;

// Validator for GitHub usernames
const usernameSchema = z.string()
  .min(1, 'Username is required')
  .max(39, 'Username is too long')
  .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, 'Invalid GitHub username format');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usernameParam = searchParams.get('username')?.trim();

    // 1. Validate query input
    const validationResult = usernameSchema.safeParse(usernameParam);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: validationResult.error.errors[0].message
      }, { status: 400 });
    }

    const username = validationResult.data.toLowerCase();

    // Log to search history if authenticated
    try {
      const serverClient = await createServerClient();
      const { data: { user } } = await serverClient.auth.getUser();
      if (user) {
        await supabase
          .from('user_search_history')
          .insert({
            user_id: user.id,
            github_username: username,
            searched_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.warn('Failed to log search history:', err.message);
    }

    // 2. Query Supabase Cache
    const { data: cachedProfile, error: selectError } = await supabase
      .from('github_profile_cache')
      .select('*')
      .eq('github_username', username)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({
        success: false,
        error: `Database select error: ${selectError.message}`
      }, { status: 500 });
    }

    // 3. Cache Freshness Check
    if (cachedProfile) {
      const cacheAge = Date.now() - new Date(cachedProfile.cached_at).getTime();
      const isFresh = cacheAge < CACHE_EXPIRY_MS;

      if (isFresh) {
        // Cache is fresh, fetch associated card
        const { data: cachedCard, error: cardError } = await supabase
          .from('generated_cards')
          .select('*')
          .eq('github_profile_id', cachedProfile.id)
          .eq('theme', 'dark') // retrieve the default theme card
          .maybeSingle();

        if (cardError) {
          return NextResponse.json({
            success: false,
            error: `Database card error: ${cardError.message}`
          }, { status: 500 });
        }

        // Calculate country rank
        let countryRank = 1;
        try {
          const { count: higherRankedCount } = await supabase
            .from('generated_cards')
            .select('id, github_profile_cache!inner(country)', { count: 'exact', head: true })
            .eq('theme', 'dark')
            .eq('github_profile_cache.country', cachedProfile.country || 'India')
            .gt('overall', cachedCard?.overall || 30);
          countryRank = (higherRankedCount || 0) + 1;
        } catch (rankErr) {
          console.warn('Failed to calculate country rank:', rankErr.message);
        }

        return NextResponse.json({
          success: true,
          profile: {
            id: cachedProfile.id,
            github_username: cachedProfile.github_username,
            name: cachedProfile.name,
            avatar_url: cachedProfile.avatar_url,
            bio: cachedProfile.bio,
            country: cachedProfile.country || 'India',
            followers: cachedProfile.followers,
            following: cachedProfile.following,
            public_repos: cachedProfile.public_repos,
            total_stars: cachedProfile.total_stars,
            total_forks: cachedProfile.total_forks,
            contribution_count: cachedProfile.contribution_count,
            current_streak: cachedProfile.current_streak,
            longest_streak: cachedProfile.longest_streak,
            account_created_at: cachedProfile.account_created_at,
            cached_at: cachedProfile.cached_at,
            rank: countryRank
          },
          card: cachedCard,
          from_cache: true
        });
      }
    }

    // 4. Cache stale or not found, fetch fresh from GitHub
    console.log(`Cache miss or stale for "${username}". Fetching fresh GitHub data...`);
    
    let oauthToken = null;
    try {
      const serverClient = await createServerClient();
      const { data: { session } } = await serverClient.auth.getSession();
      const loggedInUsername = session?.user?.user_metadata?.preferred_username?.toLowerCase();
      
      if (loggedInUsername === username && session?.provider_token) {
        console.log(`[Server] Requester @${username} is scanning themselves. Passing provider_token for private data scraping.`);
        oauthToken = session.provider_token;
      }
    } catch (sessionErr) {
      console.warn('Session provider token parse warning:', sessionErr.message);
    }

    const rawUserData = await fetchGitHubUserData(username, oauthToken);
    const { profileCache, cardRatings } = transformGitHubData(rawUserData);

    // 5. Database Transaction: Update or Insert Profile Cache
    let profileCacheId;
    if (cachedProfile) {
      profileCacheId = cachedProfile.id;
      const { error: updateError } = await supabase
        .from('github_profile_cache')
        .update({
          name: profileCache.name,
          avatar_url: profileCache.avatar_url,
          bio: profileCache.bio,
          country: profileCache.country,
          followers: profileCache.followers,
          following: profileCache.following,
          public_repos: profileCache.public_repos,
          total_stars: profileCache.total_stars,
          total_forks: profileCache.total_forks,
          contribution_count: profileCache.contribution_count,
          current_streak: profileCache.current_streak,
          longest_streak: profileCache.longest_streak,
          raw_graphql: profileCache.raw_graphql,
          cached_at: profileCache.cached_at
        })
        .eq('id', profileCacheId);

      if (updateError) {
        return NextResponse.json({
          success: false,
          error: `Error updating cache: ${updateError.message}`
        }, { status: 500 });
      }
    } else {
      const { data: insertedProfile, error: insertError } = await supabase
        .from('github_profile_cache')
        .insert({
          github_username: profileCache.github_username,
          github_id: profileCache.github_id,
          name: profileCache.name,
          avatar_url: profileCache.avatar_url,
          bio: profileCache.bio,
          country: profileCache.country,
          followers: profileCache.followers,
          following: profileCache.following,
          public_repos: profileCache.public_repos,
          total_stars: profileCache.total_stars,
          total_forks: profileCache.total_forks,
          contribution_count: profileCache.contribution_count,
          current_streak: profileCache.current_streak,
          longest_streak: profileCache.longest_streak,
          account_created_at: profileCache.account_created_at,
          raw_graphql: profileCache.raw_graphql,
          cached_at: profileCache.cached_at
        })
        .select('id')
        .single();

      if (insertError) {
        return NextResponse.json({
          success: false,
          error: `Error inserting cache: ${insertError.message}`
        }, { status: 500 });
      }
      profileCacheId = insertedProfile.id;
    }

    // 6. Database Transaction: Update or Insert generated default card
    const { data: existingCard, error: existingCardError } = await supabase
      .from('generated_cards')
      .select('*')
      .eq('github_profile_id', profileCacheId)
      .eq('theme', 'dark')
      .maybeSingle();

    if (existingCardError) {
      return NextResponse.json({
        success: false,
        error: `Error looking up card: ${existingCardError.message}`
      }, { status: 500 });
    }

    let finalCard;
    if (existingCard) {
      const { data: updatedCard, error: updateCardError } = await supabase
        .from('generated_cards')
        .update({
          overall: cardRatings.overall,
          batting: cardRatings.batting,
          bowling: cardRatings.bowling,
          fielding: cardRatings.fielding,
          fitness: cardRatings.fitness,
          technique: cardRatings.technique,
          experience: cardRatings.experience,
          player_role: cardRatings.player_role,
          created_at: new Date().toISOString()
        })
        .eq('id', existingCard.id)
        .select()
        .single();

      if (updateCardError) {
        return NextResponse.json({
          success: false,
          error: `Error updating card: ${updateCardError.message}`
        }, { status: 500 });
      }
      finalCard = updatedCard;
    } else {
      const { data: insertedCard, error: insertCardError } = await supabase
        .from('generated_cards')
        .insert({
          github_profile_id: profileCacheId,
          overall: cardRatings.overall,
          batting: cardRatings.batting,
          bowling: cardRatings.bowling,
          fielding: cardRatings.fielding,
          fitness: cardRatings.fitness,
          technique: cardRatings.technique,
          experience: cardRatings.experience,
          player_role: cardRatings.player_role,
          theme: 'dark',
          public_slug: `${profileCache.github_username.toLowerCase()}-dark`
        })
        .select()
        .single();

      if (insertCardError) {
        return NextResponse.json({
          success: false,
          error: `Error creating card: ${insertCardError.message}`
        }, { status: 500 });
      }
      finalCard = insertedCard;
    }

    // Calculate country rank
    let countryRank = 1;
    try {
      const { count: higherRankedCount } = await supabase
        .from('generated_cards')
        .select('id, github_profile_cache!inner(country)', { count: 'exact', head: true })
        .eq('theme', 'dark')
        .eq('github_profile_cache.country', profileCache.country || 'India')
        .gt('overall', finalCard.overall);
      countryRank = (higherRankedCount || 0) + 1;
    } catch (rankErr) {
      console.warn('Failed to calculate country rank:', rankErr.message);
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profileCacheId,
        github_username: profileCache.github_username,
        name: profileCache.name,
        avatar_url: profileCache.avatar_url,
        bio: profileCache.bio,
        country: profileCache.country || 'India',
        followers: profileCache.followers,
        following: profileCache.following,
        public_repos: profileCache.public_repos,
        total_stars: profileCache.total_stars,
        total_forks: profileCache.total_forks,
        contribution_count: profileCache.contribution_count,
        current_streak: profileCache.current_streak,
        longest_streak: profileCache.longest_streak,
        account_created_at: profileCache.account_created_at,
        cached_at: profileCache.cached_at,
        rank: countryRank
      },
      card: finalCard,
      from_cache: false
    });

  } catch (error) {
    console.error('Core Scan API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

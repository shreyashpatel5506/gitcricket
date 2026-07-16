import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/connect';

// Cache results for 60 seconds (ISR style) to prevent db execution floods
export const revalidate = 60;
export const dynamic = 'force-dynamic';

/**
 * API Route to fetch dynamic, filtered leaderboard rankings.
 * Supports filters: global, country, state, city, language, company, college
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'global';
    const value = searchParams.get('value')?.trim() || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)));
    const offset = (page - 1) * limit;

    // 1. Build base query joining cards and profile cache
    let query = supabase
      .from('generated_cards')
      .select(`
        id,
        overall,
        player_role,
        theme,
        github_profile_cache!inner (
          github_username,
          name,
          avatar_url,
          country,
          city,
          state,
          company,
          college,
          primary_language
        )
      `, { count: 'exact' })
      .eq('theme', 'dark'); // Ranks are computed on the baseline card theme

    // 2. Parse category filters
    if (type === 'country' && value) {
      query = query.ilike('github_profile_cache.country', value);
    } else if (type === 'city' && value) {
      query = query.ilike('github_profile_cache.city', value);
    } else if (type === 'state' && value) {
      query = query.ilike('github_profile_cache.state', value);
    } else if (type === 'language' && value) {
      query = query.ilike('github_profile_cache.primary_language', value);
    } else if (type === 'company' && value) {
      query = query.ilike('github_profile_cache.company', value);
    } else if (type === 'college' && value) {
      query = query.ilike('github_profile_cache.college', value);
    }

    // 3. Execute sorted, paginated range queries
    const { data, count, error } = await query
      .order('overall', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[Leaderboard API] Database query failed:', error.message);
      return NextResponse.json({
        success: false,
        error: `Database fetch failed: ${error.message}`
      }, { status: 500 });
    }

    // 4. Transform payload to flat layout
    const rankings = (data || []).map((card: any, index: number) => {
      const profile = card.github_profile_cache;
      return {
        rank: offset + index + 1,
        card_id: card.id,
        overall: card.overall,
        player_role: card.player_role,
        github_username: profile.github_username,
        name: profile.name,
        avatar_url: profile.avatar_url,
        country: profile.country,
        city: profile.city,
        state: profile.state,
        company: profile.company,
        college: profile.college,
        primary_language: profile.primary_language
      };
    });

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      rankings,
      pagination: {
        current_page: page,
        limit,
        total_items: totalCount,
        total_pages: totalPages,
        has_more: page < totalPages
      }
    });

  } catch (error: any) {
    console.error('[Leaderboard API] System exception:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

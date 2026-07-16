import { NextResponse, NextRequest } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/connect';

export const dynamic = 'force-dynamic';

/**
 * POST Endpoint to enroll a user in a League for the active season.
 * Body: { leagueId, teamId, role }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const serverClient = await createServerClient();
    const { data: { user }, error: authError } = await serverClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please log in first.' }, { status: 401 });
    }

    // 2. Validate input parameters
    const { leagueId, teamId, role } = await request.json();

    if (!leagueId || !teamId || !role) {
      return NextResponse.json({ success: false, error: 'Missing required parameters: leagueId, teamId, or role' }, { status: 400 });
    }

    const validRoles = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'captain'];
    const normalizedRole = role.toLowerCase().trim();

    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json({ success: false, error: `Invalid role choice. Must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    // 3. Look up active season for the league
    const { data: activeSeason, error: seasonError } = await supabase
      .from('seasons')
      .select('id')
      .eq('league_id', leagueId)
      .eq('is_active', true)
      .maybeSingle();

    if (seasonError || !activeSeason) {
      return NextResponse.json({ success: false, error: 'Enrollment failed: No active season found for this league.' }, { status: 400 });
    }

    // 4. Verify user is not already enrolled in this season
    const { data: existingEnrollment } = await supabase
      .from('league_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('season_id', activeSeason.id)
      .maybeSingle();

    if (existingEnrollment) {
      return NextResponse.json({ success: false, error: 'You are already enrolled in this league for the active season.' }, { status: 409 });
    }

    // 5. Insert enrollment mapping in database
    const { data: enrollment, error: insertError } = await supabase
      .from('league_enrollments')
      .insert({
        user_id: user.id,
        league_id: leagueId,
        season_id: activeSeason.id,
        team_id: teamId,
        role: normalizedRole
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Enrollment API] Insert failed:', insertError.message);
      return NextResponse.json({ success: false, error: `Database insert failed: ${insertError.message}` }, { status: 500 });
    }

    // 6. Update user's generated default card to associate with the team and active season
    const { data: profile } = await supabase
      .from('profiles')
      .select('github_username')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.github_username) {
      const { data: cacheProfile } = await supabase
        .from('github_profile_cache')
        .select('id')
        .eq('github_username', profile.github_username.toLowerCase())
        .maybeSingle();

      if (cacheProfile) {
        const { error: cardUpdateError } = await supabase
          .from('generated_cards')
          .update({
            season_id: activeSeason.id,
            team_id: teamId
          })
          .eq('github_profile_id', cacheProfile.id)
          .eq('theme', 'dark');

        if (cardUpdateError) {
          console.warn('[Enrollment API] Failed to bind generated cards to season:', cardUpdateError.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in league!',
      enrollment
    });

  } catch (error: any) {
    console.error('[Enrollment API] Systems failure:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}

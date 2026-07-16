import { SupabaseClient } from '@supabase/supabase-js';

export interface GamificationSyncResult {
  unlockedAchievements: string[];
  unlockedBadges: string[];
}

/**
 * Evaluates and synchronizes developer achievements and badges.
 * Run this function server-side after profile data has been scraped and cached.
 *
 * @param supabase - The Supabase client (service role client recommended)
 * @param profileId - The UUID from the `github_profile_cache` table
 * @param profileData - The mapped attributes of the profile (e.g. contribution_count, primary_language)
 */
export async function syncGamification(
  supabase: SupabaseClient,
  profileId: string,
  profileData: any
): Promise<GamificationSyncResult> {
  const unlockedAchievements: string[] = [];
  const unlockedBadges: string[] = [];

  try {
    // 1. Fetch all configured achievements
    const { data: achievements, error: achError } = await supabase
      .from('achievements')
      .select('*');

    if (achError) {
      console.error('[syncGamification] Error fetching achievements configurations:', achError.message);
    } else if (achievements) {
      for (const ach of achievements) {
        const userMetricValue = profileData[ach.metric_field];

        if (userMetricValue !== undefined && userMetricValue >= ach.threshold) {
          // Record achievement unlock (using INSERT with unique indexes preventing double-unlocking)
          const { error: insertError } = await supabase
            .from('user_achievements')
            .insert({
              github_profile_id: profileId,
              achievement_id: ach.id,
              unlocked_at: new Date().toISOString()
            });

          if (!insertError) {
            unlockedAchievements.push(ach.title);
          }
        }
      }
    }

    // 2. Fetch all configured badges
    const { data: badges, error: badgeError } = await supabase
      .from('badges')
      .select('*');

    if (badgeError) {
      console.error('[syncGamification] Error fetching badge configurations:', badgeError.message);
    } else if (badges) {
      for (const badge of badges) {
        const criteria = badge.criteria_json;
        let isEligible = true;

        if (criteria && typeof criteria === 'object') {
          for (const [field, requiredValue] of Object.entries(criteria)) {
            const userVal = profileData[field];

            if (typeof requiredValue === 'string') {
              if (userVal !== requiredValue) {
                isEligible = false;
                break;
              }
            } else if (typeof requiredValue === 'number') {
              if (userVal === undefined || userVal < requiredValue) {
                isEligible = false;
                break;
              }
            } else {
              isEligible = false;
              break;
            }
          }
        } else {
          isEligible = false;
        }

        if (isEligible) {
          const { error: insertError } = await supabase
            .from('user_badges')
            .insert({
              github_profile_id: profileId,
              badge_id: badge.id,
              unlocked_at: new Date().toISOString()
            });

          if (!insertError) {
            unlockedBadges.push(badge.name);
          }
        }
      }
    }

  } catch (err: any) {
    console.error('[syncGamification] System failure during evaluation:', err.message || err);
  }

  return { unlockedAchievements, unlockedBadges };
}

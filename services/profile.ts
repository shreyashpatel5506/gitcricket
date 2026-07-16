import { SupabaseClient } from '@supabase/supabase-js';

export interface ProfileUpsertInput {
  id: string;
  github_username: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  provider: string | null;
}

/**
 * Upserts a user's profile in the `profiles` table.
 * 
 * If the profile exists, it updates:
 * - github_username
 * - full_name
 * - email
 * - avatar_url
 * - provider
 * - updated_at
 * 
 * It prevents duplicate entries by matching on the primary key `id` via `onConflict`.
 *
 * @param supabase - The Supabase client instance (server or browser-based)
 * @param data - The profile information extracted from OAuth user metadata
 */
export async function upsertProfile(supabase: SupabaseClient, data: ProfileUpsertInput): Promise<void> {
  if (!data.id) {
    throw new Error('User ID is required to upsert a profile.');
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: data.id,
        github_username: data.github_username,
        full_name: data.full_name,
        email: data.email,
        avatar_url: data.avatar_url,
        provider: data.provider,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    );

  if (error) {
    console.error('[upsertProfile] Error writing to profiles table:', error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

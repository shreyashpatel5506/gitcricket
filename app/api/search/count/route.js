import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/connect';

export const revalidate = 0; // Bypass endpoint static caching to get live row counts

/**
 * Route Handler to return the count of scanned GitHub profiles in our database.
 */
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('github_profile_cache')
      .select('id', { count: 'exact', head: true });

    if (error) {
      console.error('Count API Database Error:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: count || 0 });

  } catch (error) {
    console.error('Count API Server Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

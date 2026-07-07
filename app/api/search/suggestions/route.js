import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/connect';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    // Suggestions require a minimum of 2 characters to filter indexes efficiently
    if (query.length < 2) {
      return NextResponse.json({ success: true, suggestions: [] });
    }

    // Lookup matching usernames in database cache
    const { data: suggestions, error } = await supabase
      .from('github_profile_cache')
      .select('github_username, name, avatar_url')
      .ilike('github_username', `%${query}%`)
      .limit(5);

    if (error) {
      console.error('Database suggestions error:', error.message);
      return NextResponse.json({ 
        success: false, 
        error: `Database query error: ${error.message}` 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      suggestions: suggestions || []
    });

  } catch (error) {
    console.error('Suggestions API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

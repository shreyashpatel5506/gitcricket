import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/connect';

/**
 * Check if a card is bookmarked by the logged-in user.
 */
export async function GET(request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: true, bookmarked: false });
    }

    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json({ success: false, error: 'cardId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_saved_cards')
      .select('id')
      .eq('user_id', user.id)
      .eq('card_id', cardId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookmarked: !!data });

  } catch (error) {
    console.error('Bookmark GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Save/Bookmark a card.
 */
export async function POST(request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { cardId } = await request.json();

    if (!cardId) {
      return NextResponse.json({ success: false, error: 'cardId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_saved_cards')
      .insert({
        user_id: user.id,
        card_id: cardId
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique index violation (already bookmarked)
        return NextResponse.json({ success: true, message: 'Already bookmarked' });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: data });

  } catch (error) {
    console.error('Bookmark POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Remove/Unbookmark a card.
 */
export async function DELETE(request) {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get('cardId');

    if (!cardId) {
      return NextResponse.json({ success: false, error: 'cardId is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_saved_cards')
      .delete()
      .eq('user_id', user.id)
      .eq('card_id', cardId);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Bookmark removed successfully' });

  } catch (error) {
    console.error('Bookmark DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

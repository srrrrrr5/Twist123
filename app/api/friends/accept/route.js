import { NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabase/clerk-client';

// POST /api/friends/accept - Accept friend request
export async function POST(request) {
  try {
    const supabase = await createClerkSupabaseClient();
    const body = await request.json();
    const { friendship_id } = body;

    if (!friendship_id) {
      return NextResponse.json(
        { error: 'friendship_id is required' },
        { status: 400 }
      );
    }

    // Update friendship status to accepted
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendship_id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ friendship: data }, { status: 200 });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return NextResponse.json(
      { error: 'Failed to accept friend request', details: error.message },
      { status: 500 }
    );
  }
}

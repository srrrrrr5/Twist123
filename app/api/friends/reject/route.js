import { NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabase/clerk-client';

// POST /api/friends/reject - Reject friend request
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

    // Update friendship status to rejected (or delete it)
    // Option 1: Delete the request
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendship_id);

    // Option 2: Update status to rejected
    // const { error } = await supabase
    //   .from('friendships')
    //   .update({ status: 'rejected' })
    //   .eq('id', friendship_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Friend request rejected' }, { status: 200 });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return NextResponse.json(
      { error: 'Failed to reject friend request', details: error.message },
      { status: 500 }
    );
  }
}

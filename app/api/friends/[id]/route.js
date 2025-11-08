import { NextResponse } from 'next/server';
import { createClerkSupabaseClient } from '@/lib/supabase/clerk-client';

// DELETE /api/friends/[id] - Unfriend / Remove friend
export async function DELETE(request, { params }) {
  try {
    const supabase = await createClerkSupabaseClient();
    const { id } = await params;

    // Delete friendship
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Friend removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json(
      { error: 'Failed to remove friend', details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { createClerkSupabaseClient, getClerkUserId } from '@/lib/supabase/clerk-client';

// GET /api/friends - Get user's friends list
export async function GET() {
  try {
    const clerkUserId = await getClerkUserId();
    const supabase = await createClerkSupabaseClient();

    // Get current user's profile ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all accepted friendships where user is either requester or addressee
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select(`
        id,
        requester_id,
        addressee_id,
        created_at,
        requester:profiles!friendships_requester_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          is_verified
        ),
        addressee:profiles!friendships_addressee_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          is_verified
        )
      `)
      .eq('status', 'accepted')
      .or(`requester_id.eq.${profile.id},addressee_id.eq.${profile.id}`);

    if (error) {
      throw error;
    }

    // Transform data to return friend info
    const friends = (friendships || []).map((friendship) => {
      const friend =
        friendship.requester_id === profile.id
          ? friendship.addressee
          : friendship.requester;

      return {
        friendship_id: friendship.id,
        friend_id: friend.id,
        username: friend.username,
        display_name: friend.display_name,
        avatar_url: friend.avatar_url,
        is_verified: friend.is_verified,
        friends_since: friendship.created_at,
      };
    });

    return NextResponse.json({ friends }, { status: 200 });
  } catch (error) {
    console.error('Error fetching friends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friends', details: error.message },
      { status: 500 }
    );
  }
}

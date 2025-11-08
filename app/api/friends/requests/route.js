import { NextResponse } from 'next/server';
import { createClerkSupabaseClient, getClerkUserId } from '@/lib/supabase/clerk-client';

// GET /api/friends/requests - Get pending friend requests
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

    // Get pending requests where user is the addressee
    const { data: requests, error } = await supabase
      .from('friendships')
      .select(`
        id,
        requester_id,
        created_at,
        requester:profiles!friendships_requester_id_fkey (
          id,
          username,
          display_name,
          avatar_url,
          bio,
          is_verified
        )
      `)
      .eq('addressee_id', profile.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ requests: requests || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friend requests', details: error.message },
      { status: 500 }
    );
  }
}

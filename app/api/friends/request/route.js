import { NextResponse } from 'next/server';
import { createClerkSupabaseClient, getClerkUserId } from '@/lib/supabase/clerk-client';

// POST /api/friends/request - Send friend request
export async function POST(request) {
  try {
    const clerkUserId = await getClerkUserId();
    const supabase = await createClerkSupabaseClient();
    const body = await request.json();
    const { addressee_id } = body;

    if (!addressee_id) {
      return NextResponse.json(
        { error: 'addressee_id is required' },
        { status: 400 }
      );
    }

    // Get current user's profile ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friendships')
      .select('id, status')
      .or(
        `and(requester_id.eq.${profile.id},addressee_id.eq.${addressee_id}),` +
        `and(requester_id.eq.${addressee_id},addressee_id.eq.${profile.id})`
      )
      .maybeSingle();

    if (existing) {
      if (existing.status === 'accepted') {
        return NextResponse.json(
          { error: 'Already friends' },
          { status: 409 }
        );
      }
      if (existing.status === 'pending') {
        return NextResponse.json(
          { error: 'Friend request already sent' },
          { status: 409 }
        );
      }
    }

    // Create friend request
    const { data, error } = await supabase
      .from('friendships')
      .insert([{
        requester_id: profile.id,
        addressee_id,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ friendship: data }, { status: 201 });
  } catch (error) {
    console.error('Error sending friend request:', error);
    return NextResponse.json(
      { error: 'Failed to send friend request', details: error.message },
      { status: 500 }
    );
  }
}

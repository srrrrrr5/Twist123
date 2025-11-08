-- TWIST Social Media Platform - Friendships/Follow System
-- Add this to your existing schema

-- ============================================================================
-- TABLE: friendships
-- Purpose: Track friend requests and connections between users
-- ============================================================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique friendship (no duplicates)
  CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id),
  -- Prevent self-friendship
  CONSTRAINT no_self_friendship CHECK (requester_id != addressee_id)
);

-- Indexes for friendships
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_created_at ON friendships(created_at DESC);

-- Apply updated_at trigger to friendships
DROP TRIGGER IF EXISTS update_friendships_updated_at ON friendships;
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FRIENDSHIPS TABLE RLS POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can see friendships where they are either requester or addressee
DROP POLICY IF EXISTS "friendships_select_policy" ON friendships;
CREATE POLICY "friendships_select_policy" ON friendships
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.clerk_user_id = auth.jwt() ->> 'sub'
      AND (profiles.id = friendships.requester_id OR profiles.id = friendships.addressee_id)
    )
  );

-- INSERT: Users can create friend requests where they are the requester
DROP POLICY IF EXISTS "friendships_insert_policy" ON friendships;
CREATE POLICY "friendships_insert_policy" ON friendships
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = requester_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- UPDATE: Users can update friendships where they are the addressee (accept/reject)
DROP POLICY IF EXISTS "friendships_update_policy" ON friendships;
CREATE POLICY "friendships_update_policy" ON friendships
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = addressee_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = addressee_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- DELETE: Users can delete friendships where they are either requester or addressee
DROP POLICY IF EXISTS "friendships_delete_policy" ON friendships;
CREATE POLICY "friendships_delete_policy" ON friendships
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.clerk_user_id = auth.jwt() ->> 'sub'
      AND (profiles.id = friendships.requester_id OR profiles.id = friendships.addressee_id)
    )
  );

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: Get user's friends (accepted friendships)
CREATE OR REPLACE VIEW user_friends AS
SELECT 
  f.id as friendship_id,
  f.requester_id,
  f.addressee_id,
  f.created_at as friends_since,
  CASE 
    WHEN f.requester_id = p1.id THEN p2.id
    ELSE p1.id
  END as friend_id,
  CASE 
    WHEN f.requester_id = p1.id THEN p2.username
    ELSE p1.username
  END as friend_username,
  CASE 
    WHEN f.requester_id = p1.id THEN p2.display_name
    ELSE p1.display_name
  END as friend_display_name,
  CASE 
    WHEN f.requester_id = p1.id THEN p2.avatar_url
    ELSE p1.avatar_url
  END as friend_avatar_url,
  CASE 
    WHEN f.requester_id = p1.id THEN p2.is_verified
    ELSE p1.is_verified
  END as friend_is_verified
FROM friendships f
JOIN profiles p1 ON f.requester_id = p1.id
JOIN profiles p2 ON f.addressee_id = p2.id
WHERE f.status = 'accepted';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Verify friendships table created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name = 'friendships';

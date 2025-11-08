-- TWIST Social Media Platform - Database Schema
-- Phase 1: MVP Tables (Profiles & Posts)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- TABLE: profiles
-- Purpose: Store user profile information linked to Clerk accounts
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- Links to Clerk user ID (this is the bridge)
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  website_url TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================================================
-- TABLE: posts
-- Purpose: User-generated content posts with text and media
-- ============================================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  media_urls TEXT[] DEFAULT '{}',
  media_types TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_public ON posts(is_public);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to posts
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES TABLE RLS POLICIES
-- ============================================================================

-- SELECT: All authenticated users can view all profiles (public directory)
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- INSERT: Users can only insert a profile where clerk_user_id matches their JWT sub claim
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'sub' = clerk_user_id
  );

-- UPDATE: Users can only update their own profile
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE
  USING (
    auth.jwt() ->> 'sub' = clerk_user_id
  )
  WITH CHECK (
    auth.jwt() ->> 'sub' = clerk_user_id
  );

-- DELETE: Users can only delete their own profile
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE
  USING (
    auth.jwt() ->> 'sub' = clerk_user_id
  );

-- ============================================================================
-- POSTS TABLE RLS POLICIES
-- ============================================================================

-- SELECT: Users can see all public posts OR their own posts regardless of visibility
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
CREATE POLICY "posts_select_policy" ON posts
  FOR SELECT
  USING (
    is_public = TRUE
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = posts.author_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- INSERT: Users can only create posts where author_id references their own profile
DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = author_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- UPDATE: Users can only update their own posts
DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = posts.author_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = posts.author_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- DELETE: Users can only delete their own posts
DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = posts.author_id
      AND profiles.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: Posts with author information and like counts (for future)
CREATE OR REPLACE VIEW posts_with_details AS
SELECT 
  p.*,
  prof.username,
  prof.display_name,
  prof.avatar_url,
  prof.is_verified
FROM posts p
JOIN profiles prof ON p.author_id = prof.id;

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================

-- Verify tables created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN ('profiles', 'posts')
ORDER BY table_name;

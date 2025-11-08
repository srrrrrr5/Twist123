# TWIST Social Media Platform - Setup Guide

## 🚀 Quick Start

### Step 1: Run Database Schema

1. Go to your Supabase project: https://gvtatgpxlxulrppilhoe.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `/app/supabase/schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify success: You should see "Query Success" and a table showing profiles and posts

### Step 2: Configure Clerk JWT Template (CRITICAL)

This step is **ESSENTIAL** - without it, the Clerk + Supabase integration won't work!

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Select your application: "grateful-glowworm-5"
3. Navigate to **JWT Templates** (in left sidebar under Configure)
4. Click **New Template** → **Supabase**
5. Configure the template:
   - **Name**: `supabase` (exactly this - it's hardcoded in the client)
   - **Token Lifetime**: 60 seconds (default is fine)
   
6. Under **Claims**, ensure these are present:
   ```json
   {
     "aud": "authenticated",
     "exp": {{token.exp}},
     "iat": {{token.iat}},
     "iss": "https://gvtatgpxlxulrppilhoe.supabase.co/auth/v1",
     "sub": "{{user.id}}",
     "email": "{{user.primary_email_address}}",
     "role": "authenticated"
   }
   ```
   
7. **CRITICAL**: In the **Signing Key** section:
   - Select **Custom signing key**
   - Paste your Supabase JWT Secret: `FN6/hxDyEo2A55TR3rju1+WmXHriVH3VFNz3i0+4NhqZd3ZHlnUG5GuKAsQ8sVhJrIDULCqGIP8NQXeiCKYWew==`
   - Algorithm: HS256

8. Click **Save**

### Step 3: Verify Environment Variables

Check `/app/.env` has all these variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Z3JhdGVmdWwtZ2xvd3dvcm0tNS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_WE8gcSoxUoaVWqZfLLOMS8pIzOgxNKiugl8yaF7nNB

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gvtatgpxlxulrppilhoe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=FN6/hxDyEo2A55TR3rju1+WmXHriVH3VFNz3i0+4NhqZd3ZHlnUG5GuKAsQ8sVhJrIDULCqGIP8NQXeiCKYWew==
```

### Step 4: Test the Integration

1. Start the development server (should already be running)
2. Visit http://localhost:3000
3. Sign up with a new account
4. After signup, you should be redirected to create your profile
5. Create your profile → You should see it saved in Supabase

## 🔍 Troubleshooting

### "Failed to get Supabase token from Clerk"
- **Cause**: Clerk JWT template not configured or named incorrectly
- **Fix**: Ensure JWT template is named exactly `supabase` (lowercase)

### "RLS policies preventing access"
- **Cause**: JWT token not containing correct claims
- **Fix**: Verify JWT template has `sub: {{user.id}}` and is signed with Supabase JWT secret

### "Cannot insert profile"
- **Cause**: clerk_user_id in database doesn't match JWT sub claim
- **Fix**: Check that Clerk user ID is being passed correctly

## 📊 Verify Database Setup

Run this query in Supabase SQL Editor to verify everything:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'posts');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'posts');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'posts');
```

## 🎯 Next Steps

Once setup is complete:
1. Test user signup/login flow
2. Create a profile
3. Create posts
4. View posts feed

## 🔐 Security Notes

- Never commit `.env` file to version control
- Service role key bypasses RLS - use only server-side
- All user data access goes through RLS policies
- JWT tokens expire after 60 seconds and auto-refresh

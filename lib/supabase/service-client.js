import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with service role privileges
 * This client BYPASSES Row Level Security (RLS) policies
 * 
 * WARNING: Only use this for admin operations and system tasks
 * Examples: creating notifications, cleanup jobs, system operations
 * NEVER expose this to client-side code
 */
export function createServiceSupabaseClient() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return supabase;
}

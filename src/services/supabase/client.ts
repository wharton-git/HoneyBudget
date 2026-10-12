import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  (import.meta.env.PUBLIC_SUPABASE_URL as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://wafomlkuziievkcdgwys.supabase.co';

export const SUPABASE_ANON_KEY =
  (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'sb_publishable_FucaTZc7T7joCaULGn_hBg_GJko5uEc';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabase } from './client';

export interface AuthState {
  user: User | null;
  session: Session | null;
}

export const signUpWithEmail = async (email: string, password: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async (): Promise<Session | null> => {
  if (typeof window === 'undefined') return null;
  const supabase = getSupabase();
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  if (typeof window === 'undefined') return null;
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const subscribeToAuthChanges = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  if (typeof window === 'undefined') return { unsubscribe: () => {} };
  const supabase = getSupabase();
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return subscription;
};

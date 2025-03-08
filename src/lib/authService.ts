
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  return { user: data.user, error: null };
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<{ session: Session | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { session: null, error: { message: error.message } };
  }

  return { session: data.session, error: null };
};

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
};

// Get current session
export const getCurrentSession = async (): Promise<{ session: Session | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: { message: error.message } };
  }

  return { session: data.session, error: null };
};

// Get current user
export const getCurrentUser = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: { message: error.message } };
  }

  return { user: data.user, error: null };
};

// Reset password
export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
};

// Update password
export const updatePassword = async (password: string): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { error: null };
};

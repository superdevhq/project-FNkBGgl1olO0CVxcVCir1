
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Function to fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // Create a default profile if one doesn't exist
        await createDefaultProfile(userId);
        return;
      }

      if (!data) {
        console.log('No profile found, creating default profile');
        // Create a default profile if one doesn't exist
        await createDefaultProfile(userId);
        return;
      }

      console.log('Profile found:', data);
      setProfile(data);
      setIsLoading(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('Error in profile fetch process:', error);
      // Set a minimal profile to prevent loading spinner
      setProfile({
        id: userId,
        full_name: user?.user_metadata?.full_name || 'User',
      });
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  // Function to refresh the user profile
  const refreshProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await fetchProfile(user.id);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setIsLoading(false);
    }
  };

  // Function to create a default profile
  const createDefaultProfile = async (userId: string) => {
    try {
      console.log('Creating default profile for user:', userId);
      
      // Get user details to create a basic profile
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const defaultProfile: Partial<UserProfile> = {
        id: userId,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
      };
      
      console.log('Default profile data:', defaultProfile);
      
      // Insert the default profile
      const { error } = await supabase
        .from('profiles')
        .insert(defaultProfile);
      
      if (error) {
        console.error('Error inserting default profile:', error);
        throw error;
      }
      
      // Set the profile in state
      setProfile(defaultProfile as UserProfile);
      setIsLoading(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('Error creating default profile:', error);
      // Set a minimal profile to prevent loading spinner
      setProfile({
        id: userId,
        full_name: user?.user_metadata?.full_name || 'User',
      });
      setIsLoading(false);
      setAuthChecked(true);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          setAuthChecked(true);
          return;
        }
        
        const currentSession = data.session;
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          await fetchProfile(currentSession.user.id);
        } else {
          // No active session
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Force auth check to complete after a timeout to prevent infinite loading
  useEffect(() => {
    if (!authChecked && isLoading) {
      const timer = setTimeout(() => {
        console.log('Auth check timeout reached, forcing completion');
        setIsLoading(false);
        setAuthChecked(true);
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [authChecked, isLoading]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      
      console.log('Signing up user:', email);
      
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
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful:', data);
      
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      console.log('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.id);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      console.log('Signing out user');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      console.log('Sign out successful');
      
      // Clear state
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      console.log('Resetting password for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      console.log('Password reset email sent');
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      
      console.log('Updating password');
      
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Update password error:', error);
        throw error;
      }

      console.log('Password updated successfully');
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Update password error:', error);
      
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log('Updating profile for user:', user.id);
      
      // Check if profile exists first
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking profile existence:', checkError);
        throw checkError;
      }

      let updateError;
      
      if (existingProfile) {
        console.log('Updating existing profile');
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
        
        updateError = error;
      } else {
        console.log('Creating new profile');
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({ ...profileData, id: user.id });
        
        updateError = error;
      }

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully');
      
      // Refresh profile data
      await fetchProfile(user.id);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

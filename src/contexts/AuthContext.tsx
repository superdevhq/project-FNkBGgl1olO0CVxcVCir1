
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the shape of our user profile
export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the shape of our auth context
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

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile from Supabase
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
        return null;
      }

      if (!data) {
        console.log('No profile found, will create default');
        return null;
      }

      console.log('Profile found:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in profile fetch process:', error);
      return null;
    }
  };

  // Function to create a default profile
  const createDefaultProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Creating default profile for user:', userId);
      
      // Get current user details
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      
      if (!currentUser) {
        console.error('User not found when creating default profile');
        return null;
      }
      
      const defaultProfile: UserProfile = {
        id: userId,
        full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Default profile data:', defaultProfile);
      
      // Insert the default profile
      const { error, data } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select();
      
      if (error) {
        console.error('Error inserting default profile:', error);
        return null;
      }
      
      console.log('Default profile created:', data);
      return data[0] as UserProfile;
    } catch (error) {
      console.error('Error creating default profile:', error);
      return null;
    }
  };

  // Function to ensure a user has a profile
  const ensureProfile = async (userId: string): Promise<UserProfile | null> => {
    const existingProfile = await fetchProfile(userId);
    
    if (existingProfile) {
      return existingProfile;
    }
    
    return await createDefaultProfile(userId);
  };

  // Function to refresh the user profile
  const refreshProfile = async () => {
    if (!user) {
      console.log('Cannot refresh profile: No user logged in');
      return;
    }
    
    try {
      console.log('Refreshing profile for user:', user.id);
      const updatedProfile = await ensureProfile(user.id);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('Initializing auth state');
    setIsLoading(true);
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        const currentSession = data.session;
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log('User is authenticated:', currentSession.user.id);
          setUser(currentSession.user);
          
          // Ensure user has a profile
          const userProfile = await ensureProfile(currentSession.user.id);
          setProfile(userProfile);
        } else {
          console.log('No active session');
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        // Update session state
        setSession(currentSession);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setUser(null);
          setProfile(null);
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (currentSession?.user) {
            console.log('User signed in:', currentSession.user.id);
            setUser(currentSession.user);
            
            // Ensure user has a profile
            const userProfile = await ensureProfile(currentSession.user.id);
            setProfile(userProfile);
          }
        }
      }
    );

    // Cleanup subscription
    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Sign up function
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

  // Sign in function
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
      
      // Explicitly set user and session
      setUser(data.user);
      setSession(data.session);
      
      // Ensure user has a profile
      if (data.user) {
        const userProfile = await ensureProfile(data.user.id);
        setProfile(userProfile);
      }
      
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

  // Sign out function
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

  // Reset password function
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

  // Update password function
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

  // Update profile function
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log('Updating profile for user:', user.id);
      console.log('Profile data to update:', profileData);
      
      // Add updated_at timestamp
      const dataToUpdate = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };
      
      // Check if profile exists
      const existingProfile = await fetchProfile(user.id);
      
      let result;
      
      if (existingProfile) {
        console.log('Updating existing profile');
        result = await supabase
          .from('profiles')
          .update(dataToUpdate)
          .eq('id', user.id)
          .select();
      } else {
        console.log('Creating new profile');
        result = await supabase
          .from('profiles')
          .insert({ ...dataToUpdate, id: user.id })
          .select();
      }
      
      if (result.error) {
        console.error('Profile update error:', result.error);
        throw result.error;
      }

      console.log('Profile update successful:', result.data);
      
      // Update profile state
      if (result.data && result.data.length > 0) {
        setProfile(result.data[0] as UserProfile);
      } else {
        // Refresh profile if no data returned
        await refreshProfile();
      }
      
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
    }
  };

  // Provide the auth context value
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

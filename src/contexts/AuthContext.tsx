import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../Integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  credits: number;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateCredits: (newCredits: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('🔐 AuthProvider initializing...');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0);

  const fetchUserCredits = async (userId: string) => {
    console.log('=== FETCHING USER CREDITS ===');
    console.log('Fetching credits for user ID:', userId);
    
    try {
      // Use secure profile access - will only return data if user owns profile or is admin
      const { data, error } = await supabase
        .from('profiles')
        .select('credits, first_name, user_id')
        .eq('user_id', userId)
        .single();
      
      console.log('Profile query result:', { data, error });
      console.log('Expected user_id:', userId);
      console.log('Returned user_id:', data?.user_id);
      console.log('Profile first_name:', data?.first_name);
      
      if (!error && data) {
        console.log('Setting credits to:', data.credits);
        setCredits(data.credits);
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log('Profile not found, creating new profile for user:', userId);
        await createUserProfile(userId);
        setCredits(50); // Set default credits for new users
      } else {
        console.error('Error fetching credits or no data:', error);
      }
    } catch (error) {
      console.error('Exception fetching user credits:', error);
    }
  };

  const createUserProfile = async (userId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const userData = user?.user;
      
      const profileData = {
        user_id: userId,
        credits: 50,
        first_name: userData?.user_metadata?.first_name || '',
        last_name: userData?.user_metadata?.last_name || '',
        phone_number: userData?.user_metadata?.phone_number || null,
        phone_verified: userData?.user_metadata?.phone_verified || false,
        user_type: 'normal',
        approval_status: 'pending'
      };

      const { error } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (error) {
        console.error('Error creating profile:', error);
      } else {
        console.log('Profile created successfully for user:', userId);
      }
    } catch (error) {
      console.error('Exception creating user profile:', error);
    }
  };

  // useEffect(() => {
  //   console.log('=== AUTH CONTEXT INITIALIZATION ===');
    
  //   // Set up auth state listener first
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange(
  //     (event, session) => {
  //       console.log('=== AUTH STATE CHANGE EVENT ===');
  //       console.log('Event type:', event);
  //       console.log('Session user email:', session?.user?.email || 'No user');
  //       console.log('Session user ID:', session?.user?.id || 'No ID');
  //       console.log('Previous user email:', user?.email || 'No previous user');
  //       console.log('Event details:', event, session?.user?.email);
        
  //       setSession(session);
  //       setUser(session?.user ?? null);
  //       setLoading(false);
        
  //       // Fetch credits when user signs in
  //       if (session?.user) {
  //         console.log('Fetching credits for user:', session.user.email);
  //         setTimeout(() => {
  //           fetchUserCredits(session.user.id);
  //         }, 0);
  //       } else {
  //         setCredits(0);
  //       }
  //     }
  //   );

  //   // Then check for existing session
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     console.log('=== INITIAL SESSION CHECK ===');
  //     console.log('Initial session user email:', session?.user?.email || 'No user');
  //     console.log('Initial session user ID:', session?.user?.id || 'No ID');
      
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     setLoading(false);
      
  //     // Fetch credits for existing session
  //     if (session?.user) {
  //       console.log('Fetching initial credits for user:', session.user.email);
  //       fetchUserCredits(session.user.id);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    console.log("AuthContext signUp called with:", { email, firstName, lastName });
    
    try {
      // First try to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      console.log("Supabase signUp result:", { data, error });
      
      if (error) {
        return { error };
      }
      
      // If user is created and confirmed immediately (no email verification)
      if (data.user && data.session) {
        console.log("User created and session established");
        return { error: null };
      }
      
      // If user is created but needs email confirmation, try immediate sign in
      if (data.user && !data.session) {
        console.log("User created but no session, attempting immediate sign in...");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.log("Immediate sign in failed:", signInError);
          return { error: signInError };
        }
        
        console.log("Immediate sign in successful");
        return { error: null };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Exception during signup:", error);
      return { error: { message: "An unexpected error occurred during signup." } };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 AuthContext signIn called for:', email);
    
    try {
      // Use standard Supabase client-side authentication  
      console.log('🔐 Attempting direct signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('🔐 SignIn response:', { user: data.user?.email, session: !!data.session, error });

      if (error) {
        console.error('🚨 Sign in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          return { error: { message: "Incorrect email or password. Please try again." } };
        }
        
        return { error: { message: error.message || "Failed to sign in. Please try again." } };
      }

      if (!data.user || !data.session) {
        console.error('🚨 No user or session returned');
        return { error: { message: "Authentication failed. Please try again." } };
      }

      console.log('✅ Login successful for:', data.user.email);
      
      // Session is automatically handled by onAuthStateChange listener
      return { error: null };

    } catch (error) {
      console.error('🚨 Sign in exception:', error);
      return { error: { message: "An unexpected error occurred. Please try again." } };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Logout error:', error);
      }
      setCredits(0);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Exception during logout:', error);
      // Clear local state even if API call fails
      setCredits(0);
      setUser(null);
      setSession(null);
    }
  };

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  const value = {
    user,
    session,
    credits,
    signUp,
    signIn,
    signOut,
    loading,
    updateCredits,
  };

  console.log('🔐 AuthProvider render, user:', user?.email || 'none', 'loading:', loading);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
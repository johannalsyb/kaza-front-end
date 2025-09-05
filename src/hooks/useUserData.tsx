import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../Integrations/supabase/client';

interface UserData {
  isAdmin: boolean;
  isApproved: boolean;
  hasCompletedOnboarding: boolean;
  credits: number;
  avatarUrl: string | null;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    isAdmin: true,
    isApproved: true,
    hasCompletedOnboarding: false,
    credits: 0,
    avatarUrl: null,
  });
  const [loading, setLoading] = useState(true); // Start with true to prevent flash

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setUserData({
        isAdmin: false,
        isApproved: false,
        hasCompletedOnboarding: false,
        credits: 0,
        avatarUrl: null,
      });
      setLoading(false);
      return;
    }

    setLoading(true); // Ensure we show loading when fetching
    try {
      // Single query to get all profile data - secure access for own profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, approval_status, credits, first_name, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
        setLoading(false);
        return;
      }

      // Single query to check onboarding status (has properties)
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (propertyError) {
        console.error('Error checking onboarding status:', propertyError);
      }

        setUserData({
          isAdmin: profileData?.user_type === 'admin',
          isApproved: profileData?.approval_status === 'approved',
          hasCompletedOnboarding: !!(propertyData && propertyData.length > 0),
          credits: profileData?.credits || 0,
          avatarUrl: profileData?.avatar_url || null,
        });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();

    // Set up real-time subscription for profile changes
    if (user) {
      const channel = supabase
        .channel('profile-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Refresh user data when profile is updated
            fetchUserData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchUserData]);

  // Memoize individual values to prevent unnecessary re-renders
  const memoizedValues = useMemo(() => ({
    isAdmin: userData.isAdmin,
    isApproved: userData.isApproved,
    hasCompletedOnboarding: userData.hasCompletedOnboarding,
    credits: userData.credits,
    avatarUrl: userData.avatarUrl,
    loading,
    refresh: fetchUserData,
  }), [userData, loading, fetchUserData]);

  return memoizedValues;
};
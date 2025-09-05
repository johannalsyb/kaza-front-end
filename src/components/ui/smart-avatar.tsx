import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from './skeleton';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../Integrations/supabase/client';

interface SmartAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  onClick?: () => void;
}

export const SmartAvatar = ({ 
  src, 
  alt = "Avatar", 
  fallback = "U", 
  className,
  onClick 
}: SmartAvatarProps) => {
  const { user } = useAuth();
  const { avatarUrl, loading } = useUserData();
  const location = useLocation();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Check if user is on profile page
  const isOnProfilePage = location.pathname === '/profile';

  // Build proper avatar URL
  const buildAvatarUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // If it's already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative path, build the full Supabase URL
    const supabaseUrl = "https://elweutkgdoftooxpakyj.supabase.co";
    if (url.startsWith('avatars/') || !url.startsWith('/')) {
      return `${supabaseUrl}/storage/v1/object/public/avatars/${url}`;
    }
    
    return url;
  };

  // Use avatarUrl from hook first, then provided src as fallback
  const rawAvatarSrc = avatarUrl || src;
  const avatarSrc = buildAvatarUrl(rawAvatarSrc!);
  const hasAvatar = !!avatarSrc && !imageError;

  // Reset loading state when avatarSrc changes
  useEffect(() => {
    if (avatarSrc) {
      setImageLoading(true);
      setImageError(false);
      setRetryCount(0);
    } else {
      setImageLoading(false);
      setImageError(false);
    }
  }, [avatarSrc]);

  // Retry logic for failed image loads
  useEffect(() => {
    if (imageError && retryCount < 3 && avatarSrc) {
      const timer = setTimeout(() => {
        setImageError(false);
        setImageLoading(true);
        setRetryCount(prev => prev + 1);
      }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [imageError, retryCount, avatarSrc]);
  
  // Debug logging for avatar issues
  useEffect(() => {
    if (user?.email === 'johann.bremont@gmail.com') {
      console.log('🖼️ SmartAvatar debug:', {
        src,
        avatarUrl,
        avatarSrc,
        hasAvatar,
        imageLoading,
        imageError,
        loading,
        location: location.pathname
      });
    }
  }, [src, avatarUrl, avatarSrc, hasAvatar, imageLoading, imageError, loading, location.pathname, user?.email]);
  
  // Get user initials for fallback
  const getUserInitials = () => {
    if (!user?.user_metadata) return fallback;
    
    const firstName = user.user_metadata.first_name || '';
    const lastName = user.user_metadata.last_name || '';
    
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return fallback;
  };

  // Show skeleton while user data is loading
  if (loading) {
    return (
      <Skeleton className={cn("rounded-full", className)} />
    );
  }

  // Show skeleton while image is loading (if we have an avatar URL)
  if (hasAvatar && imageLoading) {
    return (
      <Skeleton className={cn("rounded-full", className)} />
    );
  }
  
  return (
    <Avatar 
      className={cn(
        className, 
        onClick && "cursor-pointer hover:shadow-xl transition-shadow",
        isOnProfilePage && "ring-2 ring-kaza-yellow"
      )}
      onClick={onClick}
    >
      {hasAvatar && (
        <AvatarImage 
          src={`${avatarSrc}${retryCount > 0 ? `?retry=${retryCount}&t=${Date.now()}` : ''}`}
          alt={alt}
          className="transition-opacity duration-300 opacity-100"
          onLoad={() => {
            setImageLoading(false);
            setImageError(false);
            if (user?.email === 'johann.bremont@gmail.com') {
              console.log('✅ Avatar loaded successfully:', avatarSrc);
            }
          }}
          onError={(e) => {
            console.error('Failed to load avatar:', avatarSrc);
            if (user?.email === 'johann.bremont@gmail.com') {
              console.log('❌ Avatar failed to load:', avatarSrc, 'Retry count:', retryCount);
            }
            setImageError(true);
            setImageLoading(false);
            // Hide broken image
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
      )}
      <AvatarFallback className="bg-kaza-yellow text-kaza-yellow-foreground font-semibold">
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
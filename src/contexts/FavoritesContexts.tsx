import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../Integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '../hooks/use-toast';

export interface FavoriteProperty {
  id: string;
  title: string;
  location: string;
  dates: string;
  images: string[];
  hostName: string;
  hostAvatar?: string;
  city?: string;
  country?: string;
  created_at?: string;
}

interface FavoritesContextType {
  favorites: FavoriteProperty[];
  favoritesCount: number;
  addToFavorites: (property: FavoriteProperty) => Promise<void>;
  removeFromFavorites: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load favorites from database
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      // Get user's favorite property IDs
      const { data: favoriteIds } = await supabase
        .from('user_favorites' as any)
        .select('property_id, created_at')
        .eq('user_id', user.id);

      if (!favoriteIds || favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Get full property details for favorites with user profiles
      const propertyIds = favoriteIds.map((fav: any) => fav.property_id);
      
      const { data: properties } = await supabase
        .from('properties_public')
        .select(`
          *,
          profiles!properties_user_id_fkey (
            first_name,
            avatar_url
          )
        `)
        .in('id', propertyIds);

      // Also get property images for each favorite
      const { data: propertyImages } = await supabase
        .from('property_images')
        .select('property_id, image_url, is_main')
        .in('property_id', propertyIds)
        .order('is_main', { ascending: false }); // Main images first

      if (properties) {
        const transformedFavorites: FavoriteProperty[] = properties.map(prop => {
          const favoriteRecord = favoriteIds.find((fav: any) => fav.property_id === prop.id);
          
          // Get images for this property
          const propImages = propertyImages?.filter(img => img.property_id === prop.id) || [];
          const imageUrls = propImages.map(img => img.image_url);
          
          // Fallback to main_image_url if no property_images found
          const images = imageUrls.length > 0 ? imageUrls : (prop.main_image_url ? [prop.main_image_url] : []);
          
          return {
            id: prop.id!,
            title: prop.title || 'Untitled Property',
            location: prop.city && prop.country ? `${prop.city}, ${prop.country}` : prop.city || prop.country || 'Unknown Location',
            city: prop.city || undefined,
            country: prop.country || undefined,
            dates: 'Available dates',
            images: images,
            hostName: (prop as any).profiles?.first_name || 'Host',
            hostAvatar: (prop as any).profiles?.avatar_url || undefined,
            created_at: favoriteRecord ? (favoriteRecord as any).created_at : undefined
          };
        });
        setFavorites(transformedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const addToFavorites = async (property: FavoriteProperty) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites' as any)
        .insert({
          user_id: user.id,
          property_id: property.id
        });

      if (error) {
        if (error.code === '23505') {
          // Already exists - this is fine, just update UI
          if (!isFavorite(property.id)) {
            setFavorites(prev => [...prev, property]);
          }
          return;
        }
        throw error;
      }

      // Add to local state
      setFavorites(prev => {
        if (prev.some(fav => fav.id === property.id)) {
          return prev; // Already exists
        }
        return [...prev, property];
      });

      toast({
        title: "Added to favorites",
        description: `${property.title} has been saved to your favorites`,
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Error",
        description: "Failed to add to favorites",
        variant: "destructive"
      });
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_favorites' as any)
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      // Remove from local state
      setFavorites(prev => prev.filter(fav => fav.id !== propertyId));

      const property = favorites.find(fav => fav.id === propertyId);
      toast({
        title: "Removed from favorites",
        description: `${property?.title || 'Property'} has been removed from your favorites`,
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive"
      });
    }
  };

  const isFavorite = (propertyId: string) => {
    return favorites.some(fav => fav.id === propertyId);
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoritesCount: favorites.length,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      loading,
      refreshFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
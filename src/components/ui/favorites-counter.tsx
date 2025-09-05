import React from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useFavorites } from '../../contexts/FavoritesContexts';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface FavoritesCounterProps {
  variant?: 'button' | 'icon' | 'badge';
  showZero?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoritesCounter: React.FC<FavoritesCounterProps> = ({
  variant = 'icon',
  showZero = false,
  className,
  size = 'md'
}) => {
  const { user } = useAuth();
  const { favoritesCount, loading } = useFavorites();
  const navigate = useNavigate();

  if (!user) return null;

  const handleClick = () => {
    navigate('/favorites');
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { icon: 'w-4 h-4', button: 'h-8 px-2 text-xs', badge: 'text-xs px-1' };
      case 'lg':
        return { icon: 'w-6 h-6', button: 'h-12 px-4 text-base', badge: 'text-sm px-2' };
      case 'md':
      default:
        return { icon: 'w-5 h-5', button: 'h-10 px-3 text-sm', badge: 'text-xs px-1.5' };
    }
  };

  const sizeClasses = getSizeClasses();

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        onClick={handleClick}
        className={cn("relative", sizeClasses.button, className)}
        disabled={loading}
      >
        <Heart className={cn(sizeClasses.icon, "mr-2", favoritesCount > 0 && "fill-current text-red-500")} />
        <span>Favorites</span>
        {(favoritesCount > 0 || showZero) && (
          <Badge 
            variant="secondary" 
            className={cn("ml-2", sizeClasses.badge)}
          >
            {loading ? '...' : favoritesCount}
          </Badge>
        )}
      </Button>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={cn("relative inline-flex items-center", className)} onClick={handleClick}>
        <Badge 
          variant={favoritesCount > 0 ? "default" : "secondary"}
          className={cn("cursor-pointer hover:scale-105 transition-transform", sizeClasses.badge)}
        >
          <Heart className={cn(sizeClasses.icon, "mr-1", favoritesCount > 0 && "fill-current")} />
          {loading ? '...' : favoritesCount}
        </Badge>
      </div>
    );
  }

  // Default icon variant
  return (
    <div className={cn("relative inline-flex items-center cursor-pointer", className)} onClick={handleClick}>
      <Heart 
        className={cn(
          sizeClasses.icon, 
          "transition-colors hover:text-red-500",
          favoritesCount > 0 ? "fill-current text-red-500" : "text-gray-600"
        )} 
      />
    </div>
  );
};
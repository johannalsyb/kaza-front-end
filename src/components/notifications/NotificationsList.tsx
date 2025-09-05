import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { CheckCircle, RefreshCw, MessageSquare, Calendar, X, Bell, Check, MessageCircle, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { supabase } from "../../Integrations/supabase/client";
import { useToast } from "../../hooks/use-toast";
// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: any;
  read_at: string | null;
  created_at: string;
}

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
}

// Component to fetch and display user avatar
const NotificationAvatar = ({ userId }: { userId: string }) => {
  const [profileData, setProfileData] = useState<{ avatar_url: string | null; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('user_id', userId)
          .single();

        if (data) {
          setProfileData({ avatar_url: data.avatar_url });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
  }

  if (!profileData?.avatar_url) {
    // Show default user initials as fallback
    return (
      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
        <User className="h-4 w-4" />
      </div>
    );
  }

  return (
    <img
      src={profileData.avatar_url}
      alt="Profile"
      className="w-8 h-8 rounded-full object-cover border border-border"
      onError={(e) => {
        // Replace with fallback on error
        const fallback = document.createElement('div');
        fallback.className = 'w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium';
        fallback.innerHTML = '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
        e.currentTarget.parentNode?.replaceChild(fallback, e.currentTarget);
      }}
    />
  );
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'swap_request':
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'swap_accepted':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'swap_declined':
      return <X className="h-4 w-4 text-red-500" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-500" />;
  }
};

const getNotificationColor = (type: string, read_at: string | null) => {
  if (read_at) return "bg-background";
  
  switch (type) {
    case 'swap_request':
      return "bg-blue-50 hover:bg-blue-100";
    case 'swap_accepted':
      return "bg-green-50 hover:bg-green-100";
    case 'swap_declined':
      return "bg-red-50 hover:bg-red-100";
    default:
      return "bg-gray-50 hover:bg-gray-100";
  }
};

export const NotificationsList = ({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefresh
}: NotificationsListProps) => {
  const unreadCount = notifications.filter(n => !n.read_at).length;
  const { toast } = useToast();
//   const navigate = useNavigate();

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read_at) {
      onMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === 'swap_request') {
    //   navigate('/swap-history?tab=pending');
    } else if (notification.type === 'swap_accepted') {
      // Navigate to chat with the guest
      if (notification.data?.guest_id) {
        // navigate(`/chat?with=${notification.data.guest_id}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Notifications List */}
      <ScrollArea className={cn(
        notifications.length === 0 ? "h-32" : "h-screen"
      )}>
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "py-4 px-6 mx-4 cursor-pointer transition-colors rounded-[28px] mb-3 bg-[#FFE361]"
                  )}
                style={{ height: '80px' }}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <NotificationAvatar userId={notification.data?.guest_id} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={cn(
                        "text-[13px] leading-[13px] font-medium tracking-[-0.5px] truncate text-foreground",
                        !notification.read_at && "font-semibold"
                      )}>
                        {notification.title}
                      </h4>
                      <p className="text-[10px] leading-[13px] font-medium tracking-[-0.5px] text-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {notification.body}
                    </p>
                    
                     {/* Additional context for swap requests */}
                     {notification.type === 'swap_request' && notification.data && (
                       <div className="mt-2 pt-2 border-t border-gray-200">
                         <div className="flex items-center gap-2 text-xs text-gray-600">
                           <span>Property: {notification.data.property_title}</span>
                           <Separator orientation="vertical" className="h-3" />
                           <span>Type: {notification.data.request_type}</span>
                         </div>
                         <p className="text-xs text-gray-500 mt-1">
                           Click to review and respond
                         </p>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
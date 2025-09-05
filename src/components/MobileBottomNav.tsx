import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Badge } from './ui/badge';
import { SmartAvatar } from './ui/smart-avatar';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { useUserData } from '../hooks/useUserData';
// import defaultAvatar from "../assets/userpick.png";

const MobileBottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuth();
    const { avatarUrl } = useUserData();
    const { unreadCount } = useNotifications();

    const navItems = [
        {
            id: 'home',
            label: 'Home',
            iconSrc: '/lovable-uploads/7b497c32-1929-48cc-86c4-bbe7511d9c8c.png',
            path: '/',
            requiresAuth: false,
        },
        {
            id: 'chat',
            label: 'Chat',
            iconSrc: '/lovable-uploads/094aace1-f83b-459f-b0cc-beecc03665e9.png',
            path: '/chat',
            requiresAuth: true,
        },
        {
            id: 'notifications',
            label: 'Alerts',
            iconSrc: '/lovable-uploads/02363c50-e14a-4530-98e1-9845aab65d10.png',
            path: '/notifications',
            requiresAuth: true,
        },
        {
            id: 'favorites',
            label: 'Saved',
            iconSrc: '/lovable-uploads/6ec47070-bd79-4c0c-9c76-1b0b00ff66f6.png',
            path: '/favorites',
            requiresAuth: true,
        },
        {
            id: 'profile',
            label: 'Profile',
            path: user ? '/profile' : '/signin',
            requiresAuth: false,
        },
    ];

    const handleNavClick = (item: typeof navItems[0]) => {
        // Handle authentication requirements
        if (item.requiresAuth && !user) {
            // navigation.navigate('login');
            return;
        }

        // Add haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }

        navigation.navigate(item.path as never); // use screen name instead of path
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return route.name === '/';
        }
        return route.name.startsWith(path);
    };

    // Hide navigation bar on edit pages
    const isEditPage = location.pathname.includes('/edit');

    if (isEditPage) {
        return null;
    }

    return (
        <>
            {/* Bottom Navigation Bar */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
                style={{
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                }}
            >
                {/* Navigation Container */}
                <div className="flex justify-center">
                    {user ? (
                        // Authenticated user - show full navigation menu
                        <div
                            className="bg-black shadow-2xl w-full flex items-center justify-between px-6 py-3"
                            style={{
                                height: '83px',
                                borderRadius: '40px 40px 0 0',
                                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15), 0 -2px 10px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            {navItems.map((item, index) => {
                                const active = isActive(item.path);

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item)}
                                        className={`
                      relative flex flex-col items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30
                      ${active ? 'bg-white' : ''}
                    `}
                                        style={{
                                            width: '52px',
                                            height: '52px',
                                            flexShrink: 0,
                                            backgroundColor: item.id === 'profile' ? 'transparent' : (active ? 'white' : '#232527'),
                                        }}
                                        aria-label={item.label}
                                    >
                                        {/* Icon */}
                                        <div className="relative">
                                            {item.id === 'profile' ? (
                                                <SmartAvatar
                                                    src={avatarUrl}
                                                    alt="Profile"
                                                    fallback={'U'}
                                                    className="w-[52px] h-[52px] transition-transform duration-200"
                                                />
                                            ) : (
                                                <img
                                                    src={item.iconSrc}
                                                    alt={item.label}
                                                    className="w-6 h-6 transition-transform duration-200"
                                                    style={{
                                                        filter: active ? 'brightness(0) saturate(100%) invert(0%)' : 'brightness(0) saturate(100%) invert(100%)'
                                                    }}
                                                />
                                            )}

                                            {/* Notification Badge */}
                                            {item.id === 'notifications' && unreadCount > 0 && (
                                                <div
                                                    className="absolute -top-2 right-0 bg-[#FF784E] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    {unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </nav>
        </>
    );
};

export default MobileBottomNav;
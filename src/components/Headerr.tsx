import { Bell, MessageCircle, User, Search, Heart, Settings, MapPin, History, LogOut, Shield, Coins } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SmartAvatar } from "./ui/smart-avatar";
import { Badge } from "./ui/badge";
import { FavoritesCounter } from "./ui/favorites-counter";
// import kazaLogoHD from "@/assets/kaza-logo-hd.png";
// import exploreIcon from "@/assets/explore-icon.png";
import { useState, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUserData } from "../hooks/useUserData";
import { motion } from "framer-motion";
import { useTranslation } from "../contexts/TranslationContext";
import { useModalContext } from "../contexts/ModalContext";
import { AuthModal } from "./ui/auth-modal";
// import defaultAvatar from "@/assets/userpick.png";
import { NotificationBell } from "./notifications/NotificationBell";
import { useToast } from "../hooks/use-toast";
const Header = () => {
    //   const navigate = useNavigate();
    //   const location = useLocation();
    const {
        user,
        signOut
    } = useAuth();
    const {
        isAdmin,
        credits,
        avatarUrl
    } = useUserData();
    const {
        t
    } = useTranslation();
    const {
        isModalOpen
    } = useModalContext();
    const {
        toast
    } = useToast();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [activeTab, setActiveTab] = useState(location.pathname === '/favorites' ? 'favourites' : 'explore');
    const [pushNotifications, setPushNotifications] = useState(true);
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
        opacity: 0
    });
    const navItems = [{
        id: 'explore',
        label: t('explore'),
        icon: 'image',
        path: '/'
    }, {
        id: 'favourites',
        label: t('favourites'),
        icon: 'favourites-image',
        path: '/favorites'
    }, {
        id: 'chat',
        label: t('chat'),
        icon: 'chat-image',
        path: '/chat'
    }];
    const handleNavClick = (item: typeof navItems[0]) => {
        // Check if user is trying to access protected routes without authentication
        if (!user && (item.id === 'favourites' || item.id === 'chat')) {
            setShowAuthModal(true);
            return;
        }
        setActiveTab(item.id);
        // navigate(item.path);
    };
    const handleMenuItemClick = (path: string) => {
        // navigate(path);
    };
    const handleLogout = async () => {
        try {
            await signOut();
            //   navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Force navigation even if logout fails
            //   navigate('/');
        }
    };
    const handleSignIn = () => {
        // navigate('/signin');
    };
    const handleRegisterPlace = () => {
        if (!user) {
            // Visitor - take them to create account first
            //   navigate('/create-account');
        } else {
            // Authenticated user - navigate to my place
            //   navigate('/my-place');
        }
    };
    return <header className="bg-kaza-black text-background border-b border-border/40 sticky top-0 z-50 hidden sm:block">
        <div className="container mx-auto px-4 md:px-4 lg:px-8 py-3 md:py-4 transition-all duration-300">
            <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center">
                    {/* Desktop logo */}
                    <img src="/lovable-uploads/4caf3f59-cdd8-4cc8-8a5e-63133057e521.png" alt="KazaSwap" className="flex-shrink-0 hidden lg:block" style={{
                        width: '111px',
                        height: '43.729px'
                    }} />
                    {/* Tablet logo */}
                    <img src="/lovable-uploads/52f957a1-2a65-46fa-a8c1-628633e83a27.png" alt="KazaSwap" className="flex-shrink-0 block lg:hidden" style={{
                        width: '40px',
                        height: '40px'
                    }} />
                </div>

                {/* Navigation Tabs */}
                <nav className="flex items-center space-x-0 bg-[#232527] rounded-full px-3 md:px-1 lg:px-6 py-2 md:py-1 relative" onMouseLeave={() => {
                    setPosition(pv => ({
                        ...pv,
                        opacity: 0
                    }));
                }}>{navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return <div key={item.id}></div>;
                })}


                    {/* Sliding Cursor */}
                    <motion.div animate={{
                        ...position
                    }} className="absolute z-0 h-12 rounded-full bg-white" style={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }} />
                </nav>

                {/* Right Action Bar */}
                <div className="flex items-center space-x-4">
                    {user ?
                        // Logged In State
                        <>

                            {/* Notifications */}
                            <NotificationBell />

                            {/* User Profile */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-12 w-12 rounded-full p-0 hover:bg-white/10 transition-all duration-200 hover:shadow-lg">
                                        <SmartAvatar src={avatarUrl} alt="Profile" fallback={'U'} className="w-10 h-10 border-2 border-white/20" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg z-50 rounded-lg" sideOffset={5}>
                                    {/* My Profile */}
                                    <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer p-3 focus:bg-gray-50" onClick={() => handleMenuItemClick('/profile')}>
                                        <User className="w-4 h-4 mr-3 text-gray-600" />
                                        <span className="text-black font-medium">{t('myProfile')}</span>
                                    </DropdownMenuItem>

                                    {/* My Place */}
                                    <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer p-3 focus:bg-gray-50" onClick={() => handleMenuItemClick('/my-place')}>
                                        <MapPin className="w-4 h-4 mr-3 text-gray-600" />
                                        <span className="text-black font-medium">{t('myPlace')}</span>
                                    </DropdownMenuItem>

                                    {/* Credits */}
                                    <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer p-3 focus:bg-gray-50" onClick={() => handleMenuItemClick('/credits')}>
                                        <MapPin className="w-4 h-4 mr-3 text-gray-600" />
                                        <span className="text-black font-medium">{t('credits')}</span>
                                    </DropdownMenuItem>

                                    {/* Swap History */}
                                    <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer p-3 focus:bg-gray-50" onClick={() => handleMenuItemClick('/swap-history')}>
                                        <History className="w-4 h-4 mr-3 text-gray-600" />
                                        <span className="text-black font-medium">{t('swapHistory')}</span>
                                    </DropdownMenuItem>

                                    {/* Admin Dashboard - Only show for admins */}
                                    {isAdmin && <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer p-3 focus:bg-gray-50" onClick={() => handleMenuItemClick('/admin')}>
                                        <Shield className="w-4 h-4 mr-3 text-blue-600" />
                                        <span className="text-blue-600 font-medium">{t('adminDashboard')}</span>
                                    </DropdownMenuItem>}

                                    {/* Push Notifications Toggle */}
                                    <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer p-3 focus:bg-gray-50" onSelect={e => e.preventDefault()} // Prevent dropdown from closing
                                    >
                                        <Settings className="w-4 h-4 mr-3 text-gray-600" />
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-black font-medium">{t('pushNotifications')}</span>
                                            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} className="ml-3 data-[state=checked]:bg-kaza-yellow" />
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="my-1 bg-gray-200" />

                                    {/* Logout */}
                                    <DropdownMenuItem className="hover:bg-red-50 cursor-pointer p-3 focus:bg-red-50" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-3 text-red-600" />
                                        <span className="text-red-600 font-medium">{t('logout')}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Credits Counter */}
                            <Button onClick={() => { }} className="h-10 px-4 rounded-full bg-[#FFE361] text-black font-semibold hover:bg-[#FFE361]/90 transition-all duration-200 flex items-center gap-2 hover:shadow-lg">
                                <img src="/lovable-uploads/e1b4e5c9-8e2b-4dba-a4dd-efb4732abb5f.png" alt="Credits" className="w-4 h-4" />
                                <span>{credits || 0}</span>
                            </Button>
                        </> :
                        // Logged Out State
                        <>
                            {/* Sign In Button */}
                            <Button onClick={handleSignIn} variant="ghost" className="text-white hover:text-white hover:font-semibold hover:underline bg-transparent hover:bg-transparent rounded-full px-4 py-2 transition-all duration-200" data-visitor-modal-exclude="true">
                                {t('signIn')}
                            </Button>

                            {/* Register Your Place Button */}
                            <Button onClick={handleRegisterPlace} className="bg-[#FFE361] text-black font-bold hover:bg-[#FFE361] transition-all duration-200 rounded-full px-6 py-2 hover:shadow-lg" data-visitor-modal-exclude="true">
                                {t('registerYourPlace')}
                            </Button>
                        </>}
                </div>
            </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>;
};

// NavTab component for sliding animation
// const NavTab = ({
//   item,
//   isActive,
//   onClick,
//   setPosition,
//   Icon
// }) => {
//   const ref = useRef(null);
//   return <div ref={ref} onMouseEnter={() => {
//     if (!ref?.current) return;
//     const {
//       width
//     } = ref.current.getBoundingClientRect();
//     setPosition({
//       left: ref.current.offsetLeft,
//       width,
//       opacity: 1
//     });
//   }} onClick={onClick} className={`relative z-10 cursor-pointer rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 px-10 text-white mix-blend-difference`} style={{
//     width: '140px',
//     height: '48px',
//     flexShrink: 0
//   }}>
//       {item.icon === 'image' ? <img src="/lovable-uploads/a046c4b1-6fb6-425a-b835-4bc0439a3865.png" alt="Explore" className="w-6 h-6 brightness-0 invert" /> : item.icon === 'favourites-image' ? <img src="/lovable-uploads/4f76eb4e-2377-4121-812b-d11e17186b12.png" alt="Favourites" className="w-6 h-6 brightness-0 invert" /> : item.icon === 'chat-image' ? <img src="/lovable-uploads/a4d3609d-62bc-423b-ae52-b9ee30ea7876.png" alt="Chat" className="w-6 h-6 brightness-0 invert" /> : <Icon className="w-6 h-6" />}
//       {item.label}
//     </div>;
// };
export default Header;
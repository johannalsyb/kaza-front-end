// import { Coins, Gift, Users, Copy, ChevronDown } from "lucide-react";
// import { FiChevronDown } from "react-icons/fi";
// import KButton from "../KButton/KButton";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// import { Badge } from "../ui/badge";
// // import { useNavigate } from "react-router-dom";
// // import { useNavigation } from '@react-navigation/native';

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import useMeasure from "react-use-measure";
// import Header from "../Headerr";
// import Footer from "../Foooter";
// import { useUserData } from "../../hooks/useUserData";
// import { supabase } from "../../Integrations/supabase/client";
// import { useAuth } from "../../contexts/AuthContext";
// import useAuthentication from "../../hooks/useAuthentication";
// import MobileBottomNav from "../MobileBottomNav";
// import MobileHeader from "../MobileHeader";
// import { toastError } from "../Toast/Toast";
// import { Button } from "../ui/button";

// const Credits = () => {
//     // const navigation = useNavigation();

//     console.log('🎯 Credits page loaded successfully');
//     //   const navigate = useNavigate();
//     const { user } = useAuth();
//     const { credits } = useUserData();
//     const [copied, setCopied] = useState(false);
//     const [referralLink, setReferralLink] = useState<string>("");
//     const [isLoadingReferral, setIsLoadingReferral] = useState(true);

//     console.log('Credits page - user:', user?.email, 'credits:', credits);

//     useEffect(() => {
//         const fetchReferralLink = async () => {
//             if (!user?.id) return;

//             try {
//                 const referralResponse = await supabase.rpc('get_referral_link', {
//                     user_uuid: user.id
//                 });

//                 if (referralResponse.error) {
//                     console.error('Error fetching referral link:', referralResponse.error);
//                     toastError("Failed to load your referral link.");
//                 } else {
//                     setReferralLink(referralResponse.data || "");
//                 }
//             } catch (error) {
//                 console.error('Error fetching referral link:', error);
//                 toastError("Failed to load your referral link.");
//             } finally {
//                 setIsLoadingReferral(false);
//             }
//         };

//         fetchReferralLink();
//     }, [user?.id]);

//     const handleCopyLink = () => {
//         if (referralLink) {
//             navigator.clipboard.writeText(referralLink);
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000);
//         }
//     };
//     return <div className="min-h-screen" style={{
//         backgroundColor: '#F7F6E9'
//     }}>
//         <div className="hidden md:block">
//             <Header />
//         </div>
//         <MobileHeader title="Credits" />

//         <main
//             className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 md:pt-4 sm:md:pt-8"
//             style={{ paddingTop: 'calc(128px + 1rem)' }}
//         >
//             <div className="max-w-7xl mx-auto">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//                     {/* Left Column - My Credits & Referral */}
//                     <div className="space-y-4 sm:space-y-6">
//                         {/* My Credits */}
//                         <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl">
//                             <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
//                                 <div className="flex items-center justify-between flex-wrap gap-3">
//                                     <div className="flex items-center gap-2 sm:gap-3">
//                                         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F7F6E9] rounded-full flex items-center justify-center">
//                                             <img src="/lovable-uploads/c24db80e-5525-4151-8a7c-f0abb77061d6.png" alt="Credits" className="w-6 h-6 sm:w-8 sm:h-8" />
//                                         </div>
//                                         <div>
//                                             <CardTitle className="text-lg sm:text-xl text-black">My Credits</CardTitle>
//                                             <CardDescription className="text-sm sm:text-base text-black/70">1 night = 1 credit</CardDescription>
//                                         </div>
//                                     </div>
//                                     <Badge className="bg-kaza-yellow text-black text-xl sm:text-2xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
//                                         {credits || 0}
//                                     </Badge>
//                                 </div>
//                             </CardHeader>
//                         </Card>

//                         {/* Reward Program */}
//                         <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl">
//                             <CardHeader className="p-4 sm:p-6">
//                                 <CardTitle className="text-lg sm:text-xl text-black">Reward Program</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
//                                 <p className="text-sm sm:text-base text-black/80">
//                                     If you need more credits, you can get them by:
//                                 </p>
//                                 <ul className="space-y-2 text-sm sm:text-base text-black/80">
//                                     <li className="flex items-start gap-2">
//                                         <span className="w-2 h-2 bg-kaza-yellow rounded-full mt-2 flex-shrink-0"></span>
//                                         <span>Hosting other members at your place</span>
//                                     </li>
//                                     <li className="flex items-start gap-2">
//                                         <span className="w-2 h-2 bg-kaza-yellow rounded-full mt-2 flex-shrink-0"></span>
//                                         <span>Participating in the rewards program</span>
//                                     </li>
//                                 </ul>
//                                 {/* <Button onClick={() => navigation.navigate('/reward-program')} className="w-full bg-kaza-yellow text-black hover:bg-kaza-yellow/90 rounded-full font-semibold text-sm sm:text-base">
//                                     Earn more credits
//                                 </Button> */}
//                             </CardContent>
//                         </Card>

//                         {/* Invite Friends */}
//                         <Card className="bg-kaza-yellow border-0 shadow-sm rounded-2xl sm:rounded-3xl">
//                             <CardHeader className="p-4 sm:p-6">
//                                 <div className="flex items-center gap-2 sm:gap-3">
//                                     <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center">
//                                         <Users className="w-3 h-3 sm:w-4 sm:h-4 text-kaza-yellow" />
//                                     </div>
//                                     <CardTitle className="text-base sm:text-lg text-black">Invite friends and earn credits</CardTitle>
//                                 </div>
//                             </CardHeader>
//                             <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
//                                 <div className="flex items-center gap-2 p-2 sm:p-3 bg-white rounded-full">
//                                     <span className="flex-1 text-black font-mono text-xs sm:text-sm truncate">
//                                         {isLoadingReferral ? "Loading your referral link..." : referralLink}
//                                     </span>
//                                     <Button
//                                         onClick={handleCopyLink}
//                                         size="sm"
//                                         variant="ghost"
//                                         className="text-black hover:bg-black/10 rounded-full p-1 sm:p-2"
//                                         disabled={isLoadingReferral || !referralLink}
//                                     >
//                                         <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
//                                     </Button>
//                                 </div>
//                                 {copied && <p className="text-black text-xs sm:text-sm">Link copied!</p>}
//                                 <p className="text-black text-xs sm:text-sm">
//                                     When your friend registers their home with your link, both you and them earn 2 bonus credits. Win-win!
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Right Column - FAQ */}
//                     <div className="space-y-4 sm:space-y-6">
//                         <Card className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl">
//                             <CardHeader className="p-4 sm:p-6">
//                                 <CardTitle
//                                     style={{
//                                         color: '#000',
//                                         fontFamily: '"Plus Jakarta Sans"',
//                                         fontSize: '15px',
//                                         fontStyle: 'normal',
//                                         fontWeight: 500,
//                                         lineHeight: '13px',
//                                         letterSpacing: '-0.5px'
//                                     }}
//                                 >
//                                     FAQ
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="p-4 sm:p-6 pt-0">
//                                 <div className="w-full space-y-2">
//                                     <Question title="How to earn credit?" defaultOpen>
//                                         <p className="text-xs sm:text-sm text-black/80">
//                                             You can earn credits by hosting other members at your place (1 credit per night) or by referring friends through your unique referral link (2 credits for each successful referral).
//                                         </p>
//                                     </Question>
//                                     <Question title="What's the value of a credit?">
//                                         <p className="text-xs sm:text-sm text-black/80">
//                                             1 credit corresponds to 1 night of accommodation on the KazaSwap platform.
//                                         </p>
//                                     </Question>
//                                     <Question title="Is it possible to buy credits?">
//                                         <p className="text-xs sm:text-sm text-black/80">
//                                             No, credits cannot be purchased. They can only be earned by hosting or referring others.
//                                         </p>
//                                     </Question>
//                                     <Question title="What happens if I cancel a booking?">
//                                         <p className="text-xs sm:text-sm text-black/80">
//                                             If you cancel a booking, the credits used will be refunded according to our cancellation policy.
//                                         </p>
//                                     </Question>
//                                     <Question title="After how many days can I see my new credits balance?">
//                                         <p className="text-xs sm:text-sm text-black/80">
//                                             Your new credit balance appears immediately after hosting validation.
//                                         </p>
//                                     </Question>
//                                     <Question title="Do my credits expire?">
//                                         <p className="text-xs sm:text-sm text-black/80">
//                                             Credits do not expire as long as your account remains active on the platform.
//                                         </p>
//                                     </Question>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </main>
//         <Footer />
//         <MobileBottomNav />
//     </div>;
// };

// const Question = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
//     const [ref, { height }] = useMeasure();
//     const [open, setOpen] = useState(defaultOpen);

//     return (
//         <motion.div
//             animate={open ? "open" : "closed"}
//             className="border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4"
//         >
//             <button
//                 onClick={() => setOpen((pv) => !pv)}
//                 className="flex w-full items-center justify-between gap-4 py-3 sm:py-4"
//             >
//                 <motion.span
//                     variants={{
//                         open: {
//                             color: "rgba(0, 0, 0, 0.6)",
//                         },
//                         closed: {
//                             color: "rgba(0, 0, 0, 1)",
//                         },
//                     }}
//                     className="text-left text-sm sm:text-base font-medium"
//                 >
//                     {title}
//                 </motion.span>
//                 <motion.span
//                     variants={{
//                         open: {
//                             rotate: "180deg",
//                             color: "#000",
//                         },
//                         closed: {
//                             rotate: "0deg",
//                             color: "#000",
//                         },
//                     }}
//                 >
//                     {/* <FiChevronDown className="text-lg sm:text-xl" /> */}
//                 </motion.span>
//             </button>
//             <motion.div
//                 initial={false}
//                 animate={{
//                     height: open ? height : "0px",
//                     marginBottom: open ? "12px" : "0px",
//                 }}
//                 className="overflow-hidden"
//             >
//                 <div ref={ref}>{children}</div>
//             </motion.div>
//         </motion.div>
//     );
// };

// export default Credits;



import { useEffect, useState } from "react"
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, Text } from "react-native"
import { Users, Copy } from "lucide-react"

import useIsMobile from "../../hooks/useIsMobile"
import Header from "../Headerr"
import MobileHeader from "../MobileHeader"
import Footer from "../Foooter"
import MobileBottomNav from "../MobileBottomNav"
import { useAuth } from "../../contexts/AuthContext"
import { useUserData } from "../../hooks/useUserData"
import { supabase } from "../../Integrations/supabase/client"
import { toastError } from "../Toast/Toast"

export default () => {
  const { isMobile } = useIsMobile()
  const { user } = useAuth()
  const { credits } = useUserData()

  const [referralLink, setReferralLink] = useState<string>("")
  const [isLoadingReferral, setIsLoadingReferral] = useState(true)
  const [copied, setCopied] = useState(false)

//   useEffect(() => {
//     if (!user?.id) return
//     setIsLoadingReferral(true)

//     supabase.rpc("get_referral_link", { user_uuid: user.id })
//       .then(({ data, error }) => {
//         if (error) throw error
//         setReferralLink(data || "")
//       })
//     //   .catch(() => toastError("Failed to load your referral link."))
//     //   .finally(() => setIsLoadingReferral(false))
//   }, [user?.id])

  const handleCopy = () => {
    if (!referralLink || Platform.OS !== "web") return

    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderReferralSection = () => (
    <View style={[styles.card, { backgroundColor: "#FBAF3F" }]}>
      <Text style={styles.title}>Invite friends and earn credits</Text>
      <View style={styles.referralContainer}>
        <Text numberOfLines={1} style={styles.referralText}>
          {isLoadingReferral ? "Loading your referral link..." : referralLink}
        </Text>
        <Pressable onPress={handleCopy} disabled={isLoadingReferral || !referralLink}>
          <Copy width={20} height={20} color="black" />
        </Pressable>
      </View>
      {copied && <Text style={styles.description}>Link copied!</Text>}
      <Text style={styles.description}>
        When your friend registers their home with your link, both you and them earn 2 bonus credits.
        Win-win!
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {isMobile ? <MobileHeader title="Credits" /> : <Header />}

      <View style={{ flex: 1 }}>
        {/* Credits card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Users width={24} height={24} color="black" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.title}>My Credits</Text>
              <Text style={styles.description}>1 night = 1 credit</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.title}>{credits || 0}</Text>
            </View>
          </View>
        </View>

        {/* Reward program info */}
        <View style={styles.card}>
          <Text style={styles.title}>Reward Program</Text>
          <Text style={styles.description}>If you need more credits, you can get them by:</Text>
          <Text style={styles.description}>• Hosting other members at your place</Text>
          <Text style={styles.description}>• Participating in the rewards program</Text>
        </View>

        {/* Referral */}
        {renderReferralSection()}
      </View>

      <Footer />
      <MobileBottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6E9",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  description: {
    fontSize: 14,
    color: "rgba(0,0,0,0.8)",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "yellow",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  referralContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 8,
    marginTop: 8,
  },
  referralText: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 12,
    color: "black",
  },
})

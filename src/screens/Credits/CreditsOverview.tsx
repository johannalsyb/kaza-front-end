// src/screens/Credits/CreditsOverview.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet, Dimensions, Alert } from "react-native";
import useIsMobile from "../../hooks/useIsMobile";
import KText from "../../components/KText";
import KIcon from "../../components/KIcon/KIcon";
import variables from "../../styles/variables";
import { Colors } from "react-native/Libraries/NewAppScreen";


type Props = {
  onClose: () => void;
  onOpenRewardProgram: () => void;
  credits?: number;
};

const CreditsOverview: React.FC<Props> = ({ onClose, onOpenRewardProgram, credits = 5 }) => {
  const { isMobile } = useIsMobile();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  type IconNames = "credits" | "user" | "creds" | "copy" | "calendar" | "reward_program" | "faq1" | "faq2" | "faq3" | "faq4" | "faq5";

  const [expandedFAQIndex, setExpandedFAQIndex] = useState<number | null>(null);
  useEffect(() => {
      setExpandedFAQIndex(0)
    }, [])

  type FAQItem = {
    question: string;
    answer: string;
    icon: IconNames;  // ✅ use the same type as KIcon.name
    width: number;
    height: number;
    };

  const faq: FAQItem[] =  [
  {
    question: "How to earn credit?",
    answer: "Credits can be earned by hosting people at your place with our app, or with the Reward Program",
    icon: "faq1", // icon name for left side
    width: 29,
    height: 29,
  },
  {
    question: "What’s the value of a credit?",
    answer: "Each credit is equivalent to 1 night stay.",
    icon: "faq2",
    width: 19,
    height: 19,
  },
  {
    question: "Is it possible to buy a credit?",
    answer: "Yes, you can buy credits through the app payment system.",
    icon: "faq5",
    width: 21,
    height: 21,
  },
  {
    question: "What happens if I cancel a booking?",
    answer: "Yes, you can buy credits through the app payment system.",
    icon: "faq4",
    width: 25,
    height: 25,
  },
  {
    question: "Do credits carry into the new year?",
    answer: "Yes, you can buy credits through the app payment system.",
    icon: "faq5",
    width: 21,
    height: 21,
  },
  {
    question: "Does my credit expire?",
    answer: "Yes, you can buy credits through the app payment system.",
    icon: "faq5",
    width: 21,
    height: 21,
  },
  {
    question: "How to spend credits?",
    answer: "Yes, you can buy credits through the app payment system.",
    icon: "faq4",
    width: 25,
    height: 25,
  },
];


  const affiliateUrl = "kazaswap.com/nameoftheuser/9390904349789734873947000";

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 2000); // Toast visible for 2 seconds
  };

  const copyText = (text: string) => {
    // Clipboard.setString(text); // currently disabled
    showToast("copied!");
    // console.log("clicked");
  };



  return (
    <View style={{ flex: 1, width: '100%'  }}>
      {isMobile && (
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable onPress={onClose}>
              <KIcon name="backArrow" size="large" style={styles.backIcon} />
            </Pressable>
            <KText style={styles.headerTitle}>Credits earned</KText>
            <View style={{ width: 40, height: 40 }} />
          </View>
        </View>
      )}

      <ScrollView
        style={{ flex: 1, backgroundColor: variables.colors.white }}
        contentContainerStyle={{ paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20 }}
      >
        <View style={{ width: '100%' }}>
            {/* Credits Section */}
            <View style={styles.creditsSection}>
            <View style={styles.creditRow}>
                <View style={styles.topRow}>
                <View style={styles.iconCircle}>
                    <KIcon name="credits" size="small" />
                </View>
                <KText style={styles.creditValue}>{credits}</KText>
                </View>
                <KText style={styles.creditSub}>1 night = 1 credit</KText>
            </View>

            {/* Reward Program Tile */}
            <View style={styles.rewardTile}>
                <View style={styles.iconCircleSmall}>
                <KIcon name="rewardProgram" size="medium" />
                </View>
                <View style={styles.rewardTextBox}>
                <KText style={styles.rewardTitle}>Reward Program</KText>
                <KText style={styles.rewardSub}>Learn how to earn more credits</KText>
                </View>
                <Pressable style={styles.knowMoreBtn} onPress={onOpenRewardProgram}>
                <KText style={styles.knowMoreText}>Know More</KText>
                </Pressable>
            </View>
            </View>

            {/* Referral Card */}
            <View style={styles.card}>
            <View style={styles.iconTopCenter}>
                <KIcon name="envelopeCustom" size="large" width={46} height={43} />
            </View>
            <KText style={styles.referralTitle}>
                Invite Your Friends and Earn Rewards!
            </KText>
            <KText style={styles.referralDesc}>Copy your affiliate link below:</KText>

            <View style={styles.linkBox}>
                <View style={styles.linkTextContainer}>
                <KText
                    style={styles.linkText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    allowFontScaling={false}
                >
                    {affiliateUrl}
                </KText>
                </View>
                <Pressable onPress={() => copyText(affiliateUrl)}>
                <View style={styles.copyIconWrapper}>
                    <KIcon name="copy" size="medium" style={{ color: variables.colors.yellow }} />
                </View>
                </Pressable>


            </View>

            <KText style={styles.referralNote}>
                When your friend lists their home within <KText style={{ fontWeight: '700' }}>7 days</KText> of signing up, you'll earn <KText style={{ fontWeight: '700' }}>2 extra credits</KText>, and they'll get <KText style={{ fontWeight: '700' }}>2 bonus credit</KText>.
            </KText>
            </View>

            {/* FAQ Card */}
            <View style={styles.faqCard}>
            <KText style={styles.faqTitle}>Check our FAQ</KText>
            {faq.map((item, index) => {
                const isExpanded = expandedFAQIndex === index;

                return (
                <Pressable
                    key={index}
                    style={[styles.faqItem, isExpanded && { flexDirection: 'column', alignItems: 'flex-start' }]}
                    onPress={() => setExpandedFAQIndex(isExpanded ? null : index)}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <View style={{ width: 30, alignItems: 'center', marginRight: 12 }}>
                      {/* Left Icon */}
                      <KIcon name={item.icon as any} size="medium" style={{ width:item.width, height:item.height }} />
                    </View>  
                    
                    {/* Question Text */}
                    <KText style={[styles.faqText, { flex: 1 }]}>{item.question}</KText>

                    {/* Right Expand/Collapse Icon */}
                    <View style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }], }}>
                        <KIcon name="chevronRight" size="medium" style={{opacity:0.5}} />
                    </View>
                    </View>

                    {/* Answer */}
                    {isExpanded && (
                    <KText style={styles.faqAnswer}>
                        {item.answer}
                    </KText>
                    )}
                </Pressable>
                );
            })}
            </View>

            
        </View>    
      </ScrollView>

      {/* Toast */}
      {toastVisible && (
        <View style={styles.toastContainer}>
          <KText style={styles.toastText}>{toastMessage}</KText>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F7F6E9",
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backIcon: { width: 40, height: 40, backgroundColor: "white", borderRadius: 100 },
  headerTitle: { fontSize: 17, fontWeight: "500" },

  creditsSection: {
    backgroundColor: variables.colors.yellow,
    borderRadius: 26.31,
    padding: 10,
    marginBottom: 15,
  },
  creditRow: { alignItems: "center", marginBottom: 29, marginTop:28, },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: variables.colors.white, alignItems: "center", justifyContent: "center", marginRight: 8 },
  creditValue: { fontSize: 35, fontWeight: "700", color: variables.colors.black, },
  creditSub: { fontSize: 10, color: variables.colors.grey, marginTop: 2, textAlign: "center", lineHeight:20, },

  rewardTile: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: variables.colors.white, padding: 14, borderRadius: 12, marginBottom: 17, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  iconCircleSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: variables.colors.lightGrey, alignItems: "center", justifyContent: "center", marginRight: 12 },
  rewardTextBox: { flex: 1, justifyContent: "center" },
//   rewardTitle: { fontSize: 16, fontWeight: "600", color: variables.colors.black },
    rewardTitle: {
        fontFamily: "Plus Jakarta Sans",
        fontSize: 13,
        fontStyle: "normal",
        fontWeight: "600",
        lineHeight: 16,
        letterSpacing: -0.4,
        color: "rgba(0, 0, 0, 0.96)",
    },
//   rewardSub: { fontSize: 13, color: variables.colors.grey, marginTop: 2 },

  rewardSub: { fontSize: 12, color: "rgba(0, 0, 0, 0.96)",  fontFamily: "Plus Jakarta Sans", fontStyle: "normal", fontWeight: "400", lineHeight: 14, letterSpacing: -0.4 },


  knowMoreBtn: { backgroundColor: variables.colors.lightGrey, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 23 },
  knowMoreText: { fontSize: 13, fontWeight: "500", color: variables.colors.black },

  card: { padding: 11, borderRadius: 26, backgroundColor: variables.colors.yellow, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 15, },
  iconTopCenter: { alignItems: "center", marginBottom: 18, marginTop:19, },
//   referralTitle: { textAlign: "center", fontSize: 16, fontWeight: "600", marginBottom: 8 },

  referralTitle: { textAlign: "center", fontSize: 16, fontWeight: "600", marginBottom: 13, color: "#000", fontFamily:"Plus Jakarta Sans", fontStyle:"normal", lineHeight:13, letterSpacing:-0.5 },

//   referralDesc: { textAlign: "center", fontSize: 14, marginBottom: 10 },

  referralDesc: { textAlign: "center", fontSize: 13, marginBottom: 22, color:"#000", fontFamily: "Plus Jakarta Sans", fontStyle:"normal", fontWeight:"500", lineHeight:31, letterSpacing:-0.5, opacity: 0.5 },

  linkBox: { flexDirection: "row", alignItems: "center", backgroundColor: variables.colors.white, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, marginBottom: 0, width: "100%", maxWidth:"100%", overflow: "hidden", height:64, },
  linkTextContainer: { flex: 1, minWidth: 0, marginRight: 8,  maxWidth: Dimensions.get("window").width - 36 - 28,  },
  linkText: { flexShrink: 1, overflow: "hidden", opacity: 0.5 },
  copyIconWrapper: { width: 44.77, height: 46, borderRadius: 23, backgroundColor: variables.colors.black, justifyContent: "center", alignItems: "center" },

//   referralNote: { textAlign: "center", fontSize: 12, color: variables.colors.black },

referralNote: { textAlign: "center", fontSize: 12, color: "#000", fontFamily: "Plus Jakarta Sans", fontStyle: "normal", fontWeight:"500", lineHeight:15, letterSpacing:-0.5, marginTop:24, marginBottom:38, },

//   faqCard: { padding: 16, borderRadius: 12, backgroundColor: variables.colors.white, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 20 },
//   faqTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
//   faqItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomColor: variables.colors.lightGrey, borderBottomWidth: 1 },
//   faqText: { fontSize: 14 },


  faqCard: {
  // padding: 16,
  // borderRadius: 12,
  // backgroundColor: variables.colors.white,
  // shadowColor: "#000",
  // shadowOpacity: 0.05,
  // shadowRadius: 4,
  elevation: 2,
  // marginBottom: 20,
},

// faqTitle: {
//   fontSize: 16,
//   fontWeight: "600",
//   marginBottom: 10,
// },



faqTitle: {
  fontSize: 15,
  fontWeight: "500",
  marginBottom: 10,
  color: "#000",
  fontFamily: "Plus Jakarta Sans",
  fontStyle: "normal",
  lineHeight:13,
  letterSpacing: -0.5,
  padding:9,
},


faqItem: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 12,
  borderBottomColor: variables.colors.lightGrey,
  borderBottomWidth: 1,
  backgroundColor: '#F7F6E9',
  padding: 10,
  borderRadius: 20,
  marginBottom: 7,
},

// faqText: {
//   fontSize: 14,
//   flex: 1,
//   marginLeft: 8, // spacing from icon
// },

// faqAnswer: {
//   fontSize: 13,
//   color: variables.colors.grey,
//   marginVertical: 8,
//   marginLeft: 32, // align with question text (after left icon)
// },

faqText: {
  fontSize: 15,
  flex: 1,
  // marginLeft: 8, // spacing from icon
  color: "#000",
  opacity:0.55,
  fontFamily: "Plus Jakarta Sans",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: 13,
  letterSpacing: -0.5,
},

faqAnswer: {
  fontSize: 12,
  color: "#000",
  marginVertical: 8,
  marginLeft: 30 + 13, // align with question text (after left icon)
  fontFamily: "Plus Jakarta Sans",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: 15,
  letterSpacing: -0.5,
},


 toastContainer: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    transform: [{ translateX: -150 }],
    width: 300,
    padding: 12,
    backgroundColor: variables.colors.black,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toastText: {
    color: variables.colors.yellow,
    fontSize: 14,
    fontWeight: "500",
  },

});

export default CreditsOverview;

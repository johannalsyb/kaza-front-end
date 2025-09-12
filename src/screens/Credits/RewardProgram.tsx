// src/screens/Credits/RewardProgram.tsx
import React from "react";
import { View, ScrollView, Pressable, StyleSheet, Dimensions, Image } from "react-native";
import KText from "../../components/KText";
import KIcon from "../../components/KIcon/KIcon";
import variables from "../../styles/variables";
import KButton from "../../components/KButton/KButton";
import useIsMobile from "../../hooks/useIsMobile";

import { ViewStyle } from "react-native";

type RewardProgramProps = {
  onBack: () => void;
  onClose: () => void;
  onSelectLevel: (tier: any) => void;
};




const RewardProgram: React.FC<RewardProgramProps> = ({ onBack, onClose, onSelectLevel }) => {

    const { isMobile } = useIsMobile();

type IconNames = "credits" | "user" | "creds" | "copy" | "calendar" | "rewardProgram" ;
type Tier = {
  id: number;
  level: string;
  title: string;
  description: string;
  color: string;
  icon: IconNames;
  subheading: string;
};

const tiers: Tier[] = [
  {
    id: 1,
    level: "Level1 (Newbie)",
    title: "Globetrotter in Training",
    description: "Kick off your hosting journey and start earning rewards.",
    color: variables.colors.greenLight,
    icon: "rewardProgram",
    subheading: "Beginner Tier",
  },
  {
    id: 2,
    level: "Level2 (Medium)",
    title: "Wanderlust Explorer",
    description: "You’re becoming a trusted host with growing experience.",
    color: variables.colors.greenLight,
    icon: "rewardProgram",
    subheading: "Intermediate Tier",
  },
  {
    id: 3,
    level: "Level3 (Confirmed)",
    title: "Master Host Nomad",
    description: "You’ve reached the top tier with maximum benefits.",
    color: variables.colors.greenLight,
    icon: "rewardProgram", 
    subheading: "Advanced Tier",
  },
];

  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* Header */}
        <View style={styles.header}>
        <View style={styles.headerRow}>
            {/* Back Button */}
            <Pressable onPress={onBack}>
            <KIcon name="backArrow" size="large" style={styles.backIcon} />
            </Pressable>

            {/* Centered Title */}
            <KText style={styles.headerTitle}>Reward Program</KText>

            {/* Empty space to balance layout */}
            <View style={{ width: 40, height: 40 }} />
        </View>

        {/* Icon + Description */}
        <View style={styles.headerIconDesc}>
            {/* <KIcon name="creds" size={80} style={{ marginBottom: 12, color: variables.colors.orange }} /> */}
            <Image
                source={{ uri: "/rewardProgram.png" }}
                style={{
                    width: 65,
                    height: 65,
                    marginBottom: 12,
                    resizeMode: "contain", 
                }}
                />
            <KText style={styles.headerDesc}>
            Share your home <br/>and earn rewards!
            </KText>
        </View>
        </View>




      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 100, backgroundColor: variables.colors.white, }}>
        {/* Tiers Section */}
            <View
            style={{
                alignItems: 'center',
                width: '100%',
                marginTop: 20,
            }}
            >
                
            {tiers.map((tier, i) => {

                const buttonStyle = StyleSheet.flatten<ViewStyle>([
                {
                    width: "100%",
                    borderWidth: 0,
                    minHeight: 66,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    paddingLeft: 16,
                    paddingRight: 10,
                    marginBottom: 8,
                    backgroundColor: tier.color,
                    borderRadius: 20,
                },
                ]);


                return (
                <View key={`tier_${i}`} style={{ width: "100%" }}>
                    
                    {/* Row button */}
                    <KButton
                    color="light"
                    style={buttonStyle}
                    onPress={() => onSelectLevel(tier)} // navigation to rewardLevelProgram
                    >
                    {tier.icon && (
                        <View style={styles.iconCircle}>
                          <KIcon
                          name={tier.icon}
                          style={{ marginRight: 10, marginLeft: 10, opacity: 0.7 }}
                          size="medium"
                          />                    
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        {/* Dynamic subheading */}
                        <KText
                        style={{
                            marginBottom: 5,
                            marginLeft: 5,
                            color: "rgba(0, 0, 0, 0.50)",
                            fontSize: 9,
                            fontWeight: "500",
                            fontStyle:"normal",
                            fontFamily:"Plus Jakarta Sans",
                            lineHeight: 15,
                            letterSpacing:-0.3,
                        }}
                        >
                        {tier.level}
                        </KText>
                        <KText style={{ 
                            fontWeight: "500",
                            color: "#000",
                            fontSize: 15,
                            fontStyle:"normal",
                            fontFamily:"Plus Jakarta Sans",
                            lineHeight: 15,
                            letterSpacing:-0.5,
                         }}>{tier.title}</KText>
                        
                    </View>
                    <KIcon
                        name="chevronRight"
                        style={{ marginRight: 10, marginLeft: 10, opacity:0.5, }}
                        size="medium"
                    />
                    </KButton> 
                </View>
                );
            })}
            </View>


      </ScrollView>


      {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
        <Pressable style={styles.cancelBtn} onPress={onBack}>
            <KText style={styles.cancelText}>Cancel</KText>
        </Pressable>
        <Pressable style={styles.gotItBtn} onPress={onBack}>
            <KText style={styles.gotItText}>Got It</KText>
        </Pressable>
        </View>    
      
    </View>
  );
};

const styles = StyleSheet.create({

  header: {
  paddingTop: 60,
  paddingBottom: 20,
  paddingHorizontal: 20,
  backgroundColor: variables.colors.yellow,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},

headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},

backIcon: {
  width: 40,
  height: 40,
  backgroundColor: variables.colors.white,
  borderRadius: 100,
},

headerTitle: {
  fontSize: 17,
  fontWeight: '500',
  color: variables.colors.black,
  textAlign: 'center',
  flex: 1, 
},

headerIconDesc: {
  alignItems: 'center',
  marginBottom: 10,
},

// headerDesc: {
//   fontSize: 18,
//   fontWeight: '700',
//   color: variables.colors.black,
//   textAlign: 'center',
//   lineHeight: 24,
// },


headerDesc: {
  fontSize: 28,
  fontWeight: '600',
  color: "rgba(0, 0, 0, 0.96)",
  textAlign: 'center',
  lineHeight: 28,
  fontFamily: "Plus Jakarta Sans",
  letterSpacing: -0.4,
},


//   header: {
//     backgroundColor: variables.colors.yellow,
//     borderBottomRightRadius: 23,
//     borderBottomLeftRadius: 23,
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     justifyContent: "center",
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   backIcon: { width: 40, height: 40, backgroundColor: "white", borderRadius: 100 },
//   headerTitleCenter: {
//     fontSize: 16,
//     fontWeight: "500",
//     textAlign: "center",
//     marginTop: 10,
//   },
//   headerIconDesc: {
//     alignItems: "center",
//     marginTop: 16,
//   },
//   headerDesc: {
//     fontSize: 18,
//     color: variables.colors.black,
//     textAlign: "center",
//     marginTop: 4,
//     maxWidth: "80%",
//     fontWeight: "700"
//   },

  tierItem: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tierTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  tierDesc: {
    fontSize: 14,
    color: variables.colors.black,
  },

  bottomButtons: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  paddingVertical: 16,
  backgroundColor: variables.colors.white,
  borderTopWidth: 1,
  borderTopColor: variables.colors.lightGrey,
},

//   cancelBtn: {
//     flex: 1,
//     backgroundColor: variables.colors.lightGrey,
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginRight: 8,
//     alignItems: "center",
//   },
//   cancelText: { color: variables.colors.black, fontWeight: "600" },
//   gotItBtn: {
//     flex: 1,
//     backgroundColor: variables.colors.black,
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginLeft: 8,
//     alignItems: "center",
//   },
//   gotItText: { color: variables.colors.yellow, fontWeight: "600" },

cancelBtn: {
  flex: 1,
  marginRight: 10,
  paddingVertical: 12,
  backgroundColor: variables.colors.lightGrey,
  borderRadius: 28,
  alignItems: "center",
},
gotItBtn: {
  flex: 1,
  marginLeft: 10,
  paddingVertical: 12,
  backgroundColor: variables.colors.black,
  borderRadius: 28,
  alignItems: "center",
},
// cancelText: { color: variables.colors.black, fontWeight: "600" },
// gotItText: { color: variables.colors.yellow, fontWeight: "600" },

cancelText: { 
  color: variables.colors.black, 
  fontWeight: "500" ,
  textAlign:"center",
   fontFamily:"Plus Jakarta Sans",
   fontSize: 15,
   fontStyle: "normal",
   lineHeight: 15,
   letterSpacing: -0.5,

},

gotItText: { 
  color: variables.colors.yellow, 
  fontWeight: "500",
   textAlign:"center",
   fontFamily:"Plus Jakarta Sans",
   fontSize: 15,
   fontStyle: "normal",
   lineHeight: 15,
   letterSpacing: -0.5,
},


iconCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: variables.colors.white, alignItems: "center", justifyContent: "center", marginRight: 8,  },

});

export default RewardProgram;

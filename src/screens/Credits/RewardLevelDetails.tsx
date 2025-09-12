// src/screens/Credits/RewardLevelDetails.tsx
import React from "react";
import { View, ScrollView, Pressable, StyleSheet, Image } from "react-native";
import KText from "../../components/KText";
import KIcon from "../../components/KIcon/KIcon";
import variables from "../../styles/variables";
import KButton from "../../components/KButton/KButton";

type RewardLevelDetailsProps = {
  tier: any;
  onBack: () => void;
};

const RewardLevelDetails: React.FC<RewardLevelDetailsProps> = ({ tier, onBack }) => {

  type Icons = "globeTrotter" | "wanderLust" | "masterHost" | "credits" ;
  const tierIcons: Icons[] = ["globeTrotter", "wanderLust", "masterHost"];
  const iconName: Icons = tierIcons[tier.id - 1] || "globeTrotter"; 

  type IconNames = "credits" | "user" | "creds" | "copy" | "calendar" | "rewardProgram" | "globeTrotter" | "wanderLust" |  "masterHost" | "object";

type Badge = {
  id: number;
  title: string;
  description: string;
  icon: IconNames;
  width: number;
  height: number;
};

const tierBadges: Record<number, Badge[]> = {
  1: [
    {
      id: 1,
      title: "Criteria",
      description: "Create a completed profile and host your first guest.",
      icon: "creds",
      width: 33,
      height: 33,
    },
    {
      id: 2,
      title: "Badge",
      description: "A suitcase with a single sticker on it.",
      icon: "globeTrotter",
      width: 18,
      height: 30,
    },
    {
      id: 3,
      title: "Reward",
      description: "3 bonus credits for hosting your first guest.",
      icon: "rewardProgram",
      width: 24,
      height: 29,
    },
  ],
  2: [
    {
      id: 1,
      title: "Criteria",
      description: "Host 5 guests and receive 3 positive reviews.",
      icon: "creds",
      width: 33,
      height: 33,
    },
    {
      id: 2,
      title: "Badge",
      description: "A passport with multiple stamps.",
      icon: "wanderLust",
      width: 18,
      height: 30,
    },
    {
      id: 3,
      title: "Reward",
      description: "5 bonus credits and a special profile highlight as an \"Explorer Host.\"",
      icon: "rewardProgram",
      width: 24,
      height: 29,
    },
  ],
  3: [
    {
      id: 1,
      title: "Criteria",
      description: "Host 10+ guests with consistent positive feedback.",
      icon: "creds",
      width: 33,
      height: 33,
    },
    {
      id: 2,
      title: "Badge",
      description: "A golden compass with intricate designs.",
      icon: "masterHost",
      width: 18,
      height: 30,
    },
    {
      id: 3,
      title: "Reward",
      description: "Exclusive Kazaswap perks, such as priority listing in search results or discounted service fees.",
      icon: "rewardProgram",
      width: 24,
      height: 29,
    },
  ],
};


const badges = tierBadges[tier.id] || [];


type MEMBERItem = {
    id: number;
    title: string;
    location: string;
    width: number;
    height: number;
    };

  const member: MEMBERItem[] =  [
  {
    id:1,
    title: "Fiona",
    location: "Berlim, Germany",
    width: 29,
    height: 29,
  },
  {
    id: 2,
    title: "Isabella",
    location: "Lyon, France",
    width: 19,
    height: 19,
  },
  {
    id:3,
    title: "Michael",
    location: "Barcelona, Spain",
    width: 21,
    height: 21,
  },
];

// type Badge = {
//   id: number;
//   title: string;
//   description: string;
//   icon: IconNames; // 👈 enforce valid icon names
//   width: number;
//   height: number;
// };

// const badges: Badge[] = [
//   {
//     id: 1,
//     title: "Criteria",
//     description: "Create a  completed profile and host your first guest.",
//     icon: "creds", // 👈 your KIcon name here
//     width: 33,
//     height: 33,
//   },
//   {
//     id: 2,
//     title: "Badge",
//     description: "A suitcase with a single sticker on it.",
//     icon: "globeTrotter", // 👈 different icon
//     width: 18,
//     height: 30,
//   },
//   {
//     id: 3,
//     title: "Reward",
//     description: "3  bonus credit for hosting your first guest.",
//     icon: "rewardProgram", // 👈 crown/credits icon
//     width: 24,
//     height: 29,
//   },
// ];

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

          {/* Spacer */}
          <View style={{ width: 40, height: 40 }} />
        </View>

        {/* Icon + Title */}
        <View style={styles.headerIconDesc}>
          <View style={styles.iconCircle}>
            <KIcon name={iconName} size="xlarge" style={{ opacity: 0.7 }} />
          </View>
          
          <KText
              style={{
                  marginTop: 12,
                  color: "rgba(0, 0, 0, 0.50)",
                  fontSize: 11,
                  fontWeight: "500",
                  fontStyle:"normal",
                  fontFamily:"Plus Jakarta Sans",
                  lineHeight: 15,
                  letterSpacing:-0.3,
              }}
              >
              {tier.level}
              </KText>
          <KText style={styles.headerDesc}>{tier.title}</KText>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 20,
          backgroundColor: variables.colors.white,
        }}
      >
        <View style={styles.detailCard}>

          {badges.map((badge, i) => {

            return (
              <View key={`badge_${i}`} style={{ width: "100%" }}>
              {/* Row button */}
                    <KButton
                    color="light"
                    style={styles.buttonStyle}
                    onPress={() => {}} // navigation to rewardLevelProgram
                    >
                    {badge.icon && (
                        <KIcon
                          name={badge.icon}
                          style={{ marginRight: 10, marginLeft: 0, opacity: 0.7 }}
                          size="medium"
                          // width={badge.width}
                          // height={badge.height}
                          /> 
                        
                    )}
                    <View style={{ flex: 1 }}>
                        
                        <KText style={{ 
                            fontWeight: "500",
                            color: "#000",
                            fontSize: 13,
                            fontStyle:"normal",
                            fontFamily:"Plus Jakarta Sans",
                            lineHeight: 15,
                            letterSpacing:-0.5,
                         }}>{badge.title}</KText>
                         
                        {/* Dynamic subheading */}
                        <KText
                        style={{
                            marginTop: 4,
                            // marginLeft: 5,
                            color: "rgba(0, 0, 0, 0.50)",
                            fontSize: 12,
                            fontWeight: "500",
                            fontStyle:"normal",
                            fontFamily:"Plus Jakarta Sans",
                            lineHeight: 15,
                            letterSpacing:-0.3,
                        }}
                        >
                        {badge.description}
                        </KText>
                        
                        
                    </View>
                    </KButton>
                  </View>
            );

          })}
          
        </View>



        {/* Member Card */}
            <View style={styles.memberCard}>
            <KText style={styles.memberTitle}>List of <KText style={{ fontWeight: '700' }}>{tier.title}</KText> members</KText>
            {member.map((item, index) => {

                return (
                <Pressable
                    key={index}
                    style={[styles.memberItem, { flexDirection: 'column', alignItems: 'flex-start' }]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%',  }}>
                    <View style={{ alignItems: "center", marginRight: 12 }}>
                      {/* Left Icon */}
                      {/* <KIcon name={item.icon as any} size="medium" style={{ width:item.width, height:item.height }} /> */}

                      <Image
                          source={{ uri: "/member"+item.id+".svg" }}
                          style={{
                              width: 40,
                              height: 40,
                              borderRadius: 20, 
                              resizeMode: "cover",
                            }}
                          />
                    </View>  
                    
                    {/* Title + Location */}
                    <View style={{ flex: 1 }}>
                      {/* Title */}
                      <KText style={styles.memberText}>{item.title}</KText>

                      {/* Location Row */}
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                        <KIcon name="location" size="small" style={{ color: "#000", marginRight: 6, opacity:0.4 }} />
                        <KText style={{ color: "#000", fontSize: 11, opacity:0.4, fontFamily: "Plus Jakarta Sans", fontStyle: "normal", lineHeight:13, letterSpacing: -0.5, }}>
                          {item.location || "Unknown location"}
                        </KText>
                      </View>
                    </View>

                    <View style={styles.copyIconWrapper}>
                        <KIcon name="object" size="medium" style={{ color: variables.colors.yellow }} />
                    </View>
                    </View>

                </Pressable>
                );
            })}
            </View>

      </ScrollView>

      {/* Bottom Button */}
      {/* <View style={styles.bottomButtons}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <KText style={styles.backText}>Back</KText>
        </Pressable>
      </View>
       */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor:"#F7F6E9",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "500",
    color: variables.colors.black,
    textAlign: "center",
    flex: 1,
  },
  headerIconDesc: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerDesc: {
    fontSize: 22,
    fontWeight: "600",
    color: variables.colors.black,
    textAlign: "center",
    // marginTop: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: variables.colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  detailCard: {
    borderRadius: 16,
    padding: 15,
    paddingBottom:0,
    backgroundColor: "#F7F6E9",
    marginBottom: 16,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: variables.colors.black,
  },
  description: {
    fontSize: 15,
    color: "rgba(0,0,0,0.7)",
    lineHeight: 20,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: variables.colors.white,
    borderTopWidth: 1,
    borderTopColor: variables.colors.lightGrey,
  },
  backBtn: {
    backgroundColor: variables.colors.black,
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: "center",
  },
  backText: {
    color: variables.colors.yellow,
    fontWeight: "500",
    fontSize: 15,
  },

   buttonStyle: {
      width: "100%",
      borderWidth: 0,
      // minHeight: 66,
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
      // paddingLeft: 16,
      // paddingRight: 10,
      marginBottom: 18,
      // borderRadius: 20,
      backgroundColor: "none",
  },


  memberCard: {
  // padding: 16,
  // borderRadius: 12,
  // backgroundColor: variables.colors.white,
  // shadowColor: "#000",
  // shadowOpacity: 0.05,
  // shadowRadius: 4,
  elevation: 2,
  // marginBottom: 20,
},


memberTitle: {
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


memberItem: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 12,
  // borderBottomWidth: 1,
  // backgroundColor: '#F7F6E9',
  padding: 10,
  borderRadius: 20,
  marginBottom: 7,
  borderWidth:1,
  borderStyle:"solid",
  borderColor: "rgba(0, 0, 0, 0.20)",
},

memberText: {
  fontSize: 15,
  flex: 1,
  // marginLeft: 8, // spacing from icon
  color: "#000",
  fontFamily: "Plus Jakarta Sans",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: 13,
  letterSpacing: -0.5,
},

copyIconWrapper: { width: 44.77, height: 46, borderRadius: 23, backgroundColor: variables.colors.black, justifyContent: "center", alignItems: "center" },
                  
});

export default RewardLevelDetails;

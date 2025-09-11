import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import KText from "../../components/KText";
import KIcon from "../../components/KIcon/KIcon";

type RewardLevelDetailsProps = {
  level: {
    id: string;
    title: string;
    color: string;
    description: string;
    benefits: string[];
  };
  onClose: () => void;
  onBack: () => void;
};

const RewardLevelDetails: React.FC<RewardLevelDetailsProps> = ({
  level,
  onClose,
  onBack,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        }}
      >
        <Pressable onPress={onBack} style={{ marginRight: 12 }}>
          <KIcon name="chevronRight" size="medium" />
        </Pressable>
        <KText style={{ flex: 1, fontWeight: "bold", fontSize: 20 }}>
          {level.title} Level
        </KText>
        <Pressable onPress={onClose}>
          <KIcon name="close" size="medium" />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Banner */}
        <View
          style={{
            backgroundColor: level.color,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <KText style={{ fontWeight: "bold", fontSize: 18 }}>
            {level.title}
          </KText>
          <KText style={{ marginTop: 8 }}>{level.description}</KText>
        </View>

        {/* Benefits list */}
        <KText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Benefits:
        </KText>
        {level.benefits.map((benefit, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
          >
            <KIcon name="tick" size="small" />
            <KText style={{ marginLeft: 8 }}>{benefit}</KText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RewardLevelDetails;

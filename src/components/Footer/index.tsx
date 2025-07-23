import { Linking, Pressable, View, Text, StyleSheet } from "react-native";
import KIcon from "../KIcon/KIcon";

import { NavStackParamList, isFooterHidden } from "../../navigation/screens";
import variables from "../../styles/variables";
import KText from "../KText";
import useIsMobile from "../../hooks/useIsMobile";
import useConfig from "../../hooks/useConfig";

type Props = {
  route?: string
}
export default ({ route }: Props) => {
  const { config } = useConfig()
  const { isMobile } = useIsMobile()
  if (isFooterHidden(route as keyof NavStackParamList, isMobile)) return null

  return (

    <View style={styles.container}>
      <View style={[styles.upperContainer, { paddingHorizontal: isMobile ? 5 : 20 }]}>
        <View style={{ flex: 1 }}>
          <KIcon
            name="logoBlack"
            width={130}
            height={40}
            style={{ color: variables.colors.black }} />
        </View>
        <View style={styles.pages}>
          <Pressable onPress={() => Linking.openURL("/blog")}><KText style={{ marginRight: 10 }}>Blog</KText></Pressable>
          <Text style={styles.separator}>|</Text>
          <Pressable onPress={() => Linking.openURL("/confidentiality")}><KText style={{ marginHorizontal: 10 }}>Confidentiality</KText></Pressable>
          <Text style={styles.separator}>|</Text>
          <Pressable onPress={() => Linking.openURL("/terms-of-use")}><KText style={{ marginLeft: 10 }}>Terms of Use</KText></Pressable>
        </View>

        <View style={styles.communityEmailText}>
          <KText onPress={() => Linking.openURL(`mailto:${config?.emails.community}`)}>{config?.emails.community || ""}</KText>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <KText style={styles.bottomText}>© 2023 Kaza Swap LLC. All rights reserved.</KText>
        <KText style={styles.bottomText}>30 N Gould St, Sheridan, WY 82801</KText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: variables.colors.greenLight,
  },
  upperContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 10,
    width: '100%',
  },
  bottomContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    justifyContent: 'space-between',
    backgroundColor: variables.colors.black,
  },
  pages: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: { 
    fontSize: 11, 
    fontWeight: '500', 
    color: variables.colors.white, 
    fontFamily: 'Plus Jakarta Sans', 
  },
  communityEmailText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 10,
    flex: 1
  },
  separator: {
    color: variables.colors.xLightGray,
    paddingHorizontal: 40,
    fontWeight: '200',
    fontSize: 24,
  },
})

import { ImageBackground, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native"
import KButton from "../../components/KButton/KButton"
import { useEffect, useState } from "react"
import User1, { Preferences } from "../../components/forms/user/User1"
import users from "../../api/users"
import useAuthentication from "../../hooks/useAuthentication"
import { toastError } from "../../components/Toast/Toast"
import KText from "../../components/KText"
import KImage from "../../components/KImage/KImage"
import variables from "../../styles/variables"
import { useNavigation } from "@react-navigation/native"
import { NavStackParamList } from "../../navigation/screens"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import useIsMobile from "../../hooks/useIsMobile"
import KIcon from "../../components/KIcon/KIcon"

type Props = NativeStackScreenProps<NavStackParamList, 'Success'>

const mimg = require("../../assets/Onboarding/Congrats.webp")
const dimg = require("../../assets/Onboarding/Desktop_Congrats.jpg")

export default (props: Props) => {
    const { user } = useAuthentication()
    const {navigate} = useNavigation()
    const { isMobile } = useIsMobile()
    const [loading, setLoading] = useState(false)
    // if(!user) {
    //     props.navigation.navigate("Home")
    //     return null
    // }
    const { width, height } = useWindowDimensions();
      const calculateFontSize = () => {
        const baseSize = 70 * width * 0.00069;
        return Math.min(baseSize, 70); 
      };
    
      const calculateLineHeight = () => {
        const baseSize = 80 * (width * 0.00082);
        return Math.min(baseSize, 80); 
      };
    

    console.log('user', user)
    return  <View style={{ flex: 1}}>
{ isMobile && (
       
                  <ImageBackground
                        source={require('../../components/KIcon/icons/onboardingBg.jpg')}
                        style={{
                            width: '100%',
                            height: 300, 
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderBottomRightRadius: 28,
                            borderBottomLeftRadius: 28,
                            borderColor: '#EDEBD9',
                            borderWidth: 1,
                            overflow: 'hidden'
                        }}
                        resizeMode="cover"
                         >
                        <View style={[styles.containerText, { marginTop: 36 }]}>
                            <KText style={{ fontWeight: '700', fontSize: 35, color: '#FFFFFF' }}>Congratulation</KText>
                            <KText style={{ fontWeight: '700', fontSize: 35, color: '#FFFFFF' }}>{user?.firstName}!</KText>
                        </View>
                          {isMobile &&
                          <View style={styles.iconBack}>
                          <KIcon
                              name="backArrow"
                              size={40}
                              onPress={() => {
                                props.navigation.push('Home')
                              }}
                              style={
                               { backgroundColor: 'white', borderRadius: 50, padding: 5 }
                              }
                            />
                          </View>
                        }
                    </ImageBackground>
    )
}
     <ImageBackground
        source={require('../../components/KIcon/icons/onboardingBg.jpg')}
          style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: isMobile ? 'auto' :undefined,
          zIndex: 1,
          width: isMobile ? '100%' : undefined,
          flex: isMobile ? undefined : 1,
          overflow: 'hidden', 
          position: 'relative'
            }}
            resizeMode="cover"
            >
                
            {
                !isMobile && (
              <Pressable
                style={{ position: 'absolute', bottom: 82, left: 0, right: 0 ,
                   zIndex: 3333,
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   width: '50%'
                }}
                onPress={() => {
             
                 props.navigation.navigate("Home")
                }}>
                <KIcon name="KazaSwaplogoblackandyellowVertical" style={{width: 70, height: 104,}} />
              </Pressable>
                )
              }
    <ScrollView
        style={{
            paddingBottom: 0,
            width: "100%",
        }}
        contentContainerStyle={[styles.container, isMobile && { flexDirection: "column" }]}>
            {
                !isMobile && (
        <View
            style={[styles.containerLeftSide, styles.borderRadiusDesktop, isMobile && { maxWidth: '100%', borderTopEndRadius: 0, borderBottomStartRadius: 23, maxHeight: 295 }]}
        >
            <View style={[styles.containerText, isMobile && { marginTop: 0 }]} >
                <KText
                 style={{ fontWeight: isMobile ? '700' : '600', fontSize: calculateFontSize(),
                  lineHeight: calculateLineHeight(),color: '#FFFFFF' }}>
                    Congratulation
                    </KText>
                <KText 
                style={{ fontWeight: isMobile ? '700' : '600', fontSize: calculateFontSize(),
                  lineHeight: calculateLineHeight(), color: '#FFFFFF' }}>
                    {user?.firstName}!
                    </KText>
            </View>
        </View>
                )
            }

        <View 
        style={[styles.containerRightSide,
             {
            maxWidth: isMobile ? '100%' :  654, borderRadius:isMobile ? 0 :30 ,
            width: isMobile ? '100%' : undefined,
            marginTop: isMobile ? 0 : 83,
            marginRight: isMobile ? 0 : 50,
            paddingBottom: isMobile ? 30 : 127,
            paddingTop: isMobile ? 39 : '5%',
            paddingLeft: isMobile ? 20: '3%',
            paddingRight: isMobile ? 20 : '3%',
            margin: 'auto',

        }]}>

            <KText style={[styles.label && { fontSize: isMobile ? 20 : 35, lineHeight: isMobile ? 24 : 39, textAlign: 'center', fontWeight: '600',letterSpacing: -0.5 }]}>
                Welcome to the  {!isMobile &&(<br />) }  Kaza Swap {isMobile &&(<br />) } community!
            </KText>
            <View style={isMobile ? { marginTop: 38, marginBottom: 56 } : { marginTop: 61, marginBottom: 65 }}>
                {!Boolean(user?.emailVerified) && <View style={[styles.contaiterNotification, { marginBottom: isMobile ? 26 : 34 }]}>
                    <KIcon name="email" size={33} style={{ ...(isMobile ? styles.iconMobile : styles.icon) }} />
                    <KText style={[styles.emailText, isMobile && { lineHeight: 21 }]}>
                        Please check your mailbox to validate your email now
                    </KText>
                </View>}
                <View style={styles.contaiterNotification}>
                    <KIcon name="credits" size='large' style={{ ...(isMobile ? styles.iconMobile : styles.icon) }} />
                    <KText style={[styles.emailText, isMobile && { lineHeight: 21 }]}>
                        For registering you get {' '}
                        <KText style={{ fontWeight: "bold", color: variables.colors.black }}>
                            5 credits
                        </KText>
                        , which is equal to 5 nights at someone else place.1 credit : 1 night
                    </KText>
                </View>
            </View>
           
            <View style={{ justifyContent: 'flex-start' }}>
            </View>
            <View>
                {/* sdf */}
            </View>
            <KButton
                text="Start Exploring"
                loading={loading}
                onPress={() => {
                    setLoading(true)
                    localStorage.setItem("onboardingFinishedAt", `${new Date().toISOString()}`)
                    users.me.update({ onboarding: JSON.stringify({ step: 5, data: {}, completed: true }) })
                        .catch(e => {
                            console.log(e)
                        })
                        .finally(() => {
                            setLoading(false)
                            // props.navigation.navigate("Home")
                            document.location.href = "/" // Force reload
                        })
                }}
                color="primary"
                style={{ width: '100%', maxWidth: 400, marginBottom: 15, marginHorizontal: 'auto' }}
                textStyle={{ fontSize: 15, fontWeight: '600' }}
            />
            {!isMobile && (
     <>
{!Boolean(user?.emailVerified) && <KButton
    text="Check your mailbox"
    onPress={() => { window.open('https://mail.google.com', '_blank') }}
    color="light"
    style={styles.buttonMailbox}
    textStyle={{ fontSize: 15, fontWeight: '600' }}
/>
}
</>
)}
    </View>
    </ScrollView>
    </ImageBackground>
    </View>

}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 0,
        flex: 1

    },
    containerLeftSide: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: 'transparent',
        position: "relative",
        maxWidth: '50%'
    },
    borderRadiusDesktop: {
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
    },
    containerText: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
      
    },
    logo: {
        position: "absolute",
        top: 0,
        left: 40,
        width: 124,
        height: 124,
    },
    containerRightSide: {
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
        // flex: 1,
        margin: 'auto',
        backgroundColor: variables.colors.white,  
        
        
    },
    label: {
        fontSize: 28,
        fontWeight: "600",
        lineHeight: 32,
        letterSpacing: -0.5,
        maxWidth: 400,
        textAlign: "center",
    },
    icon: {
        backgroundColor: variables.colors.lightCream,
        borderRadius: 50,
        padding: 12
    },
    iconMobile: {
        backgroundColor: variables.colors.lightCream,
        borderRadius: 100,
        width: 33,
        height: 33,
        padding: 8.5,
    },
    emailText: {
        fontSize: 16,
        maxWidth: 324,
        lineHeight: 21,
        letterSpacing: -0.5,
        flex: 1,

    },
    contaiterNotification: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
    },
    buttonMailbox: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 23,
        backgroundColor: variables.colors.lightCream,
        borderWidth: 0,
        marginHorizontal: 'auto'
    },
     iconBack: {
    position: 'absolute',
    top: 70,
    left: 17,
    zIndex: 1000
  }
})
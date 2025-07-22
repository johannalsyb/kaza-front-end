import { ScrollView, StyleSheet, View } from "react-native"
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
    const { isMobile } = useIsMobile()
    const [loading, setLoading] = useState(false)
    // if(!user) {
    //     props.navigation.navigate("Home")
    //     return null
    // }
    console.log('user', user)
    return <ScrollView
        style={{
            paddingBottom: isMobile ? 20 : 0,
            width: "100%",
        }}
        contentContainerStyle={[styles.container, isMobile && { flexDirection: "column" }]}>
        <View
            style={[styles.containerLeftSide, styles.borderRadiusDesktop, isMobile && { maxWidth: '100%', borderTopEndRadius: 0, borderBottomStartRadius: 23, maxHeight: 295 }]}
        >
            {!isMobile && <KIcon name="KazaSwap" size={124} style={styles.logo} />}
            <KIcon name="tada" size={isMobile ? 99 : 140} />
            <View style={[styles.containerText, isMobile && { marginTop: 22 }]} >
                <KText style={{ fontWeight: "bold", fontSize: isMobile ? 28 : 54 }}>Congratulations</KText>
                <KText style={{ fontWeight: "bold", fontSize: isMobile ? 28 : 54 }}>{user?.firstName}!</KText>
            </View>
        </View>


        <View style={[styles.containerRightSide, isMobile && { paddingHorizontal: 30 }]}>

            <KText style={[styles.label && { fontSize: isMobile ? 17 : 28, lineHeight: 24, textAlign: isMobile ? 'left' : 'center', fontWeight: '700' }]}>
                Welcome to the Kaza Swap community! We are thrilled to have you here.
            </KText>
            <View style={isMobile ? { marginTop: 38, marginBottom: 56 } : { marginTop: 95, marginBottom: 65 }}>
                {!Boolean(user?.emailVerified) && <View style={[styles.contaiterNotification, { marginBottom: isMobile ? 26 : 34 }]}>
                    <KIcon name="email" size={33} style={{ ...(isMobile ? styles.iconMobile : styles.icon) }} />
                    <KText style={[styles.emailText, isMobile && { fontSize: 15, lineHeight: 20 }]}>
                        Please cjheck your mailbox to validate your email now
                    </KText>
                </View>}
                <View style={styles.contaiterNotification}>
                    <KIcon name="swap" size={33} style={{ ...(isMobile ? styles.iconMobile : styles.icon) }} />
                    <KText style={[styles.emailText, isMobile && { fontSize: 15, lineHeight: 20 }]}>
                        For registering you get {' '}
                        <KText style={{ fontWeight: "bold", color: variables.colors.yellow }}>
                            5 credits
                        </KText>
                        , which is equal to 5 nights at someone else place.
                    </KText>
                </View>
            </View>
            {!isMobile && <KText style={{ fontSize: 16, marginBottom: 68, width: '100%' }}>
                Cheers!
            </KText>}
            <View style={{ justifyContent: 'flex-start' }}>
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
                style={{ width: '100%', marginBottom: 15 }}
                textStyle={{ fontSize: 15, fontWeight: '600' }}
            />
            {!Boolean(user?.emailVerified) && <KButton
                text="Check your mailbox"
                onPress={() => { window.open('https://mail.google.com', '_blank') }}
                color="light"
                style={styles.buttonMailbox}
                textStyle={{ fontSize: 15, fontWeight: '600' }}
            />}

        </View>

    </ScrollView>
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
        backgroundColor: variables.colors.yellow,
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
        marginTop: 57,
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
        maxWidth: 400,
        marginHorizontal: 'auto',
        // height: "100%",
        marginTop: 35
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
        borderRadius: 100,
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
        borderRadius: 23,
        backgroundColor: variables.colors.lightCream,
        borderWidth: 0,
    }
})
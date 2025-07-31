import React, { useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Easing,
  Platform
} from 'react-native'

import useAuthentication from '../../hooks/useAuthentication'
import KTextInput from '../../components/Form/KTextInput/KTextInput'
import KButton from '../../components/KButton/KButton'
import KText from '../../components/KText'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { NavStackParamList } from '../../navigation/screens'
import FormField from '../../components/Form/FormField/FormField'
import variables from '../../styles/variables'
import useIsMobile from '../../hooks/useIsMobile'
import KIcon from '../../components/KIcon/KIcon'
import GoogleLoginButton from '../../components/GoogleAuthButton/GoogleLoginButton'
import LeftSide from '../../components/Screens/Auth/LeftSide'
import { showModalRegisterPlaceAtom, showComponentAtom } from '../../atoms'
import { useSetAtom } from 'jotai'
import VerifyPhone from '../../components/VerifyPhone'

type Props = NativeStackScreenProps<NavStackParamList, 'Login'>
export default ({ navigation }: Props) => {
  
  const { isMobile } = useIsMobile()
  const authentication = useAuthentication()
  const [setShowModalComponent] = [useSetAtom(showComponentAtom)]

  const [creds, setCreds] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false)

  // Animations
  const leftSlideAnim = useRef(new Animated.Value(-700)).current

  const formAnims = [
    useRef(new Animated.Value(800)).current,
    useRef(new Animated.Value(800)).current,
    useRef(new Animated.Value(800)).current,
    useRef(new Animated.Value(800)).current,
    useRef(new Animated.Value(800)).current,
  ]

  useEffect(() => {
    Animated.timing(leftSlideAnim, {
      toValue: 0,
      duration: 700,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start()

    formAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        delay: 100 + index * 100,
        useNativeDriver: true,
      }).start()
    })
  }, [])

  const login = async () => {
    try {
      const result = await authentication.login(creds.email, creds.password);
      if (result.user) {
        // Login successful - user is verified and logged in
        // Navigation to Home will be handled automatically by the authentication system
        // when the user state is set
      } else if (result.needsVerification) {
        // Login failed due to unverified phone - show verification modal
        setNeedsPhoneVerification(true);
        showPhoneVerificationModal();
      } else {
        // Login failed due to invalid credentials
        // The authentication hook already shows appropriate error messages
      }
    } catch (error) {
      // Handle any other errors
    }
  }

  const showPhoneVerificationModal = () => {
    setShowModalComponent(
      <VerifyPhone
        onVerified={async () => {
          // After verification, try to login again
          setShowModalComponent(null);
          setNeedsPhoneVerification(false);
          
          // Retry login after verification
          const result = await authentication.login(creds.email, creds.password);
          if (result.user) {
            // Login successful after verification - user state is now set
            // Navigation to Home will happen automatically via the navigation system
          }
        }}
        onClose={() => {
          setShowModalComponent(null);
          setNeedsPhoneVerification(false);
        }}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isMobile && { flexDirection: 'column' }]}>
      <Animated.View style={{ transform: [{ translateX: leftSlideAnim }], flex: 1, width: '100%' }}>
        <LeftSide title='Sign In' />
      </Animated.View>

      <View
        style={[styles.containerLogin,
        isMobile && { justifyContent: 'flex-start', maxWidth: '100%', paddingHorizontal: 60 }]}>

        {/* Email */}
        <Animated.View style={{ transform: [{ translateY: formAnims[0] }], width: '100%', maxWidth: 400 }}>
          <FormField labelAlign="center" label="Email" gapAfterChildren={false} gapBeforeChildren={false}>
            <KTextInput
              placeholder="Email"
              value={creds.email}
              onChangeText={email => setCreds({ ...creds, email })}
              inputStyles={{ paddingVertical: 7.5 ,textAlign:'center'}}
            />
          </FormField>
        </Animated.View>

        {/* Password */}
        <Animated.View style={{ transform: [{ translateY: formAnims[1] }], width: '100%', maxWidth: 400 }}>
          <FormField labelAlign="center" label="Password" gapAfterChildren={false} gapBeforeChildren={false}>
            <KTextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={creds.password}
              onChangeText={password => setCreds({ ...creds, password })}
              rightComponent={
                <KIcon
                  name={showPassword ? 'eyeOpen' : 'eyeClose'}
                  size={'medium'}
                  style={{ marginRight: 10, opacity: 0.5 }}
                />
              }
            inputStyles={{ paddingVertical: 7.5 ,textAlign:'center'}}
              onRightComponentPress={() => setShowPassword(!showPassword)}
            />
          </FormField>
        </Animated.View>

        {/* Forgot Password */}
        <Animated.View style={{ transform: [{ translateY: formAnims[2] }], width: '100%', maxWidth: 400 }}>
          <KText
            style={[styles.forgotPassword, isMobile && { margin: 0, marginBottom: 25 }]}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <KIcon name="password" size={'medium'} style={{ marginRight: 10, opacity: 0.5 }} />
            Forgot Password?
          </KText>
        </Animated.View>

        {/* Sign In Button */}
        <Animated.View style={{ transform: [{ translateY: formAnims[3] }], width: '100%', maxWidth: 400 }}>
          <KButton
            text="Sign In"
            style={{ width: '100%', marginTop: isMobile ? 0 : 40 }}
            onPress={login}
          />
        </Animated.View>

        {/* Divider + Google Login */}
        <Animated.View style={{ transform: [{ translateY: formAnims[4] }], width: '100%', maxWidth: 400 }}>
          <KText style={styles.dividerContainer}>
            <View style={styles.divider} />
            <KText style={{ marginHorizontal: 10, color: '#C6C5BA' }}>or</KText>
            <View style={styles.divider} />
          </KText>
          <GoogleLoginButton />

          {/* Register */}
          <KText
            style={styles.registrationContainer}
            onPress={() => navigation.navigate('SignUp')}>
            Don't have an account yet?
            <KIcon name="register" size={'medium'} style={styles.iconRegister} />
            <KText style={{ fontWeight: '500', color: 'black' }}>Register</KText>
          </KText>
        </Animated.View>
      </View>

      {!isMobile && (
        <View style={{ position: 'absolute', top: 20, right: 20 }}>
          <KIcon name="closeWithBorder" size={'large'} onPress={() => navigation.navigate('Home')} />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  containerLogin: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  forgotPassword: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: '#C6C5BA',
    marginVertical: 16
  },
  divider: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    height: 1,
  },
  registrationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    color: variables.colors.grey,
    fontSize: 13,
    marginTop: 53,
  },
  iconRegister: {
    marginLeft: 10,
    marginRight: 5,
    opacity: 0.5,
    stroke: 'black',
  },
  iconHeart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 13,
    color: 'black',
  }
})

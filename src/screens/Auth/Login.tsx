import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  ImageBackground,
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
import { showComponentAtom } from '../../atoms'
import { useSetAtom } from 'jotai'
import VerifyPhone from '../../components/VerifyPhone'
import { Link } from '@react-navigation/native'

type Props = NativeStackScreenProps<NavStackParamList, 'Login'>

export default ({ navigation }: Props) => {

  const { isMobile } = useIsMobile()
  const authentication = useAuthentication()
  const [setShowModalComponent] = [useSetAtom(showComponentAtom)]

  const [creds, setCreds] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false)


  const login = async () => {
    try {
      const result = await authentication.login(creds.email, creds.password);
      if (result?.needsVerification) {
        setNeedsPhoneVerification(true);
        showPhoneVerificationModal();
      }
    } catch (error) {
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
            navigation.navigate('Onboarding',{});
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
    <View style={{ flex: 1, backgroundColor: isMobile ? variables.colors.white : 'transparent' }}>
  <ImageBackground
         source={!isMobile && require('../../components/KIcon/icons/onboardingBg.jpg')}
         style={{
         display: 'flex',
         justifyContent: 'center',
        //  alignItems: 'center',
         flexDirection: 'column',
         width: '100%',     
         height: '100%',
         zIndex: 1,
         flex: isMobile ? undefined : 1,
         overflow: 'hidden', 
           }}
           resizeMode="cover">

    <ScrollView
      contentContainerStyle={[styles.container, isMobile && { flexDirection: 'column' }]}>
    
{
        !isMobile && (
          <View 
          style={{width: isMobile?'100%':'50%'}}
          >
          <Link
            to={'/'}
            style={{
              position: 'absolute',
              width: '100%',
              top: 270,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <KIcon
              name="KazaSwaplogoblackandyellowVertical"
              style={{width: 70, height: 104,}}
            />
          </Link>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              left: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <KText
              style={{
                fontSize: 50,
                maxWidth: 670,
                margin: 'auto',
                fontWeight: '600',
                lineHeight: 60,
                textAlign: 'center',
                color: 'white',    
                overflow: 'hidden'         
              }}
              numberOfLines={2}
              >
              Swap your place, <br /> explore the world
            </KText>
          </View>
        </View>
        )   
      }
      {
       isMobile && (
      <View style={{width: isMobile?'100%':'50%'}}>
        <LeftSide title='Sign In' />  
      </View>
        )
      }
      
      <View
        style={[styles.containerLogin,
        { justifyContent: 'flex-start',  paddingHorizontal: '11%',
            backgroundColor:  variables.colors.white, 
            marginBottom: isMobile ? 30 : 40,
            position: 'relative',
            maxWidth: isMobile ? '100%' :  540,
            borderRadius:isMobile ? 0 :30 ,
            width: isMobile ? '100%' : '100%',
            marginTop: isMobile ? 0 : 30,
            marginRight: isMobile ? 0 : 50,
            paddingBottom: isMobile ? 10 : 50,
            paddingTop: isMobile ? 30 : '2%',
            paddingLeft: isMobile ? 5: '3%',
            paddingRight: isMobile ? 5 : '3%',
            margin: isMobile ? 'auto' : undefined,
            borderTopStartRadius: isMobile ? 20 : undefined,
            borderTopRightRadius: isMobile ? 20 : undefined,
            zIndex: 33334
         }]}
        >
        <View style={{ width: '100%', maxWidth: 400 }}>
      <KText style={[styles.title, {textAlign: 'center'}]}>Sign In</KText>
          <FormField labelAlign="center" label="Email" gapAfterChildren={false} gapBeforeChildren={false}>
            <KTextInput
              placeholder="Email"
              value={creds.email}
              onChangeText={email => setCreds({ ...creds, email })}
              inputStyles={{
                paddingTop: isMobile ? 11 : 9,
                paddingBottom: isMobile ? 15 : 12,
                textAlign: 'center',
              }}
            />
          </FormField>
        </View>

        <View style={{ width: '100%', maxWidth: 400 }}>
          <FormField labelAlign="center" label="Password" gapAfterChildren={false} gapBeforeChildren={false}>
            <KTextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={creds.password}
              onChangeText={password => setCreds({ ...creds, password })}
              inputStyles={{
                paddingTop: isMobile ? 11 : 9,
                paddingBottom: isMobile ? 15 : 12,
                textAlign: 'center',
              }}
              rightComponent={
                <KIcon
                  name={showPassword ? 'eyeOpen' : 'eyeClose'}
                  size={'medium'}
                  style={{ marginRight: 10, opacity: 0.5 }}
                />
              }
              onRightComponentPress={() => setShowPassword(!showPassword)}
            />
          </FormField>
        </View>
        <View style={{ width: '100%', maxWidth: 400 }}>
          <KText
            style={[styles.forgotPassword, isMobile && { margin: 0, marginBottom: 25 }]}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <KIcon name="password" size={'medium'} style={{ marginRight: 10, opacity: 0.5 }} />
            Forgot Password?
          </KText>
        </View>
        {/* Sign In Button */}
        <View style={{ width: '100%', maxWidth: 400 }}>
          <KButton text="Sign In" style={{ width: '100%', marginTop: isMobile ? 0 : 40, marginBottom: isMobile ? 15 : 0, }} onPress={login} />
        </View>
         {/* Divider + Google Login */}
        <View style={{ width: '100%', maxWidth: 400 }}>
          {!isMobile && (
              <KText style={styles.dividerContainer}>
                <View style={styles.divider} />
                <span style={{padding: '0 22px'}}>or</span>
                <View style={styles.divider} />
              </KText>
            )}
          <GoogleLoginButton />

          <KText
            style={[
            styles.registrationContainer,
            {paddingBottom: isMobile ? 31 : 0},
            ]}
            onPress={() => navigation.navigate('SignUp')}>
             <KText numberOfLines={1}> Don't have an account yet?</KText>
            <KIcon name="register" size={'medium'} style={styles.iconRegister} />
            <KText style={{ fontWeight: '500', color: 'black' }}>Register</KText>
          </KText>
        </View>
      </View>

      {!isMobile && (
        <View style={{ position: 'absolute', top: 20, right: 20 }}>
          <KIcon name="closeWithBorder" size={'large'} onPress={() => navigation.navigate('Home')} />
        </View>
      )}
    </ScrollView>
           </ImageBackground>
    </View>
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
    margin:'auto',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
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
    marginVertical: 16,
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
    marginTop: 50,
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

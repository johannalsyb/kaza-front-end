import { useEffect, useRef, useState } from 'react'
import { Button, Image, ImageBackground, TextInput, View } from 'react-native'
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
// import { GoogleLogin } from '@react-oauth/google'
// import { useGoogleOneTapLogin } from '@react-oauth/google'

const TopImg = require('../../assets/Auth/top.webp')
const LeftImg = require('../../assets/Auth/left_1920_x2.webp')

type Props = NativeStackScreenProps<NavStackParamList, 'Login'>

export default ({ route, navigation }: Props) => {
  const { isMobile } = useIsMobile()
  const authentication = useAuthentication()
  const { isAuthLoading } = authentication
  const [creds, setCreds] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const login = () => {
    authentication.login(creds.email, creds.password)
  }


  return (
    <View
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        // width: "90%",
        // padding: "15%",
        flex: 1,
        position: 'relative',
      }}>
      <Image
        source={isMobile ? TopImg : LeftImg}
        resizeMode={isMobile ? 'contain' : 'cover'}
        style={{
          width: isMobile ? '100%' : '50%',
          height: isMobile ? 250 : '100%',
          position: 'relative',
          top: 0,
          // left: 0,
          // right: 0,
          zIndex: -1,
          borderTopRightRadius: isMobile ? 0 : 30,
          borderBottomRightRadius: isMobile ? 0 : 30,
        }}
      />
      {isMobile ? (
        <View
          style={{
            height: 150,
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: variables.colors.yellow,
            zIndex: -2,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            display: isMobile ? 'flex' : 'none',
          }}
        />
      ) : (
        <View
          style={{
            position: 'absolute',
            width: '50%',
            bottom: 50,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <KIcon name="logoText2" style={{ width: 200, height: 150 }} />
          <KText style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 50 }}>
            Swap your place, explore the world
          </KText>
          <KText
            style={{
              fontSize: 15,
              color: variables.colors.grey,
              width: '90%',
              textAlign: 'left',
            }}>
            © {new Date().getFullYear()} Kaza Swap LLC. All rights reserved.
          </KText>
        </View>
      )}

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          alignItems: 'center',
          margin: 'auto',
          gap: 16,
          flex: 1,
          width: '100%',
          maxWidth: isMobile ? '100%' : 400,
        }}>
        <KText
          style={{
            fontSize: isMobile ? 20 : 30,
            fontWeight: 'bold',
            marginBottom: 24,
          }}>
          Sign In
        </KText>

        <FormField labelAlign="center" label="Email">
          <KTextInput
            placeholder="Email"
            value={creds.email}
            onChangeText={email => setCreds({ ...creds, email })}
          />
        </FormField>

        <FormField labelAlign="center" label="Password">
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
            onRightComponentPress={() => setShowPassword(!showPassword)}
          />
        </FormField>

        <KText
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            marginTop: isMobile ? 0 : 4,
          }}
          onPress={() => {
            navigation.navigate('ForgotPassword')
          }}>
          <KIcon
            name="password"
            size={'medium'}
            style={{ marginRight: 10, opacity: 0.5 }}
          />
          Forgot Password?
        </KText>

        <KButton
          text="Sign In"
          style={{
            width: '100%',
            marginTop: isMobile ? 0 : 40,
          }}
          onPress={login}
        />
        <KText
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            color: '#C6C5BA',
          }}>
          <div
            style={{
              flex: 1,
              borderBottom: '1px solid #EFEFEF',
              marginRight: '0.5em',
            }}
          />
          <span>or</span>
          <div
            style={{
              flex: 1,
              borderBottom: '1px solid #EFEFEF',
              marginLeft: '0.5em',
            }}
          />
        </KText>
        <GoogleLoginButton />

        <KText
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            color: variables.colors.grey,
          }}
          onPress={() => {
            navigation.navigate('SignUp')
          }}>
          Don't have an account yet?
          <KIcon
            name="register"
            size={'medium'}
            style={{
              marginLeft: 20,
              marginRight: 10,
              opacity: 0.5,
              stroke: 'black',
            }}
          />
          <KText style={{ fontWeight: 'bold', color: 'black' }}>Register</KText>
        </KText>
      </View>
      {!isMobile && (
        <View style={{ position: 'absolute', top: 20, right: 20 }}>
          {/* <KText onPress={() => {
                navigation.navigate('Home')
            }}>{"> Look around"}</KText> */}
          <KIcon
            name="closeWithBorder"
            size={'large'}
            onPress={() => {
              navigation.navigate('Home')
            }}
          />
        </View>
      )}
      {!isMobile && (
        <KText
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            fontSize: 13,
            color: 'black',
          }}>
          ♥️
        </KText>
      )}
    </View>
  )
}

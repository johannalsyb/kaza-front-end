import { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
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


type Props = NativeStackScreenProps<NavStackParamList, 'Login'>

export default ({ navigation }: Props) => {
  const { isMobile } = useIsMobile()
  const authentication = useAuthentication()

  const [creds, setCreds] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const login = () => {
    authentication.login(creds.email, creds.password)
  }


  return (
    <ScrollView
      contentContainerStyle={[styles.container, isMobile && { flexDirection: 'column' }]}>
      <LeftSide title='Sign In' />
      <View
        style={[styles.containerLogin,
        isMobile && { justifyContent: 'flex-start', maxWidth: '100%', paddingHorizontal: 60 }]}>

        <FormField
          labelAlign="center"
          label="Email"
          gapAfterChildren={false}
          gapBeforeChildren={false}
        >
          <KTextInput
            placeholder="Email"
            value={creds.email}
            onChangeText={email => setCreds({ ...creds, email })}
            inputStyles={{ paddingVertical: 13 }}
          />
        </FormField>

        <FormField
          labelAlign="center"
          label="Password"
          gapAfterChildren={false}
          gapBeforeChildren={false}>
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
          style={[styles.forgotPassword, isMobile && { margin: 0, marginBottom: 25 }]}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <KIcon name="password" size={'medium'} style={{ marginRight: 10, opacity: 0.5 }} />
          Forgot Password?
        </KText>

        <KButton text="Sign In" style={{ width: '100%', marginTop: isMobile ? 0 : 40 }} onPress={login} />
        <KText style={styles.dividerContainer}>
          <View style={styles.divider} />
          <span>or</span>
          <View style={styles.divider} />
        </KText>
        <GoogleLoginButton />

        <KText
          style={styles.registrationContainer}
          onPress={() => navigation.navigate('SignUp')}>
          Don't have an account yet?
          <KIcon name="register" size={'medium'} style={styles.iconRegister} />
          <KText style={{ fontWeight: 'bold', color: 'black' }}>Register</KText>
        </KText>
      </View>
      {
        !isMobile && (
          <View style={{ position: 'absolute', top: 20, right: 20 }}>
            <KIcon name="closeWithBorder" size={'large'} onPress={() => navigation.navigate('Home')} />
          </View>
        )
      }

    </ScrollView >
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
    // gap: 16,
    flex: 1,
    maxWidth: 400,
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
    marginTop: 16,
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
}
)
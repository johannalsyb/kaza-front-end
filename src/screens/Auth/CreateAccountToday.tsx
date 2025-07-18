import { useState } from 'react'
import { Button, Image, ImageBackground, ScrollView, StyleSheet, TextInput, View } from 'react-native'
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
import auth from '../../api/auth'
import { RegisterFormError } from '../../components/forms/auth/Register'
import KPhoneInputV2 from '../../components/Form/KPhoneInput/KPhoneInputV2'
import { isValidPhoneNumber } from 'libphonenumber-js'
import GoogleLoginButton from '../../components/GoogleAuthButton/GoogleLoginButton'
import LeftSide from '../../components/Screens/Auth/LeftSide'
import VerifyPhone from '../../components/VerifyPhone'
import { toastSuccess } from '../../components/Toast/Toast'
import { useSetAtom } from 'jotai'
import { showComponentAtom } from '../../atoms'
import users from '../../api/users'

type Props = NativeStackScreenProps<NavStackParamList, 'Login'>

export default (props: any) => {
  const { isMobile } = useIsMobile()
  const authentication = useAuthentication()
  const { isAuthLoading } = authentication
  const [body, setBody] = useState({
    firstName: '',
    phone: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<RegisterFormError>({})
  // useEffect(() => {
  //   authentication.check();
  // }, []);
  const createAccount = async () => {
    const isValid = isValidPhoneNumber(body.phone)
    if (!body.firstName) {
      setError((prev) => ({ ...prev, firstName: 'First name is required' }))
      return
    } else {
      setError((prev) => ({ ...prev, firstName: undefined }))
    }
    if (!isValid) {
      setError((prev) => ({ ...prev, phone: 'Invalid phone number' }))
      setLoading(false)
      console.log('error', error)
      return
    } else {
      setError((prev) => ({ ...prev, phone: undefined }))
    }
    if (!body.email) {
      setError((prev) => ({ ...prev, email: 'Email is required' }))
      return
    } else {
      setError((prev) => ({ ...prev, email: undefined }))
    }
    if (!body.password) {
      setError((prev) => ({ ...prev, password: 'Password is required' }))
      return
    } else {
      setError((prev) => ({ ...prev, password: undefined }))
    }
    setLoading(true)
    try {
      const response = await auth.signup(body)
      await login(response.data.email)

      setShowModalComponent(<VerifyPhone onVerified={() => {
        toastSuccess("Phone verified successfully")
        setShowModalComponent(null)
      }} />)
      await users.me.requestVerify('phone')
    } catch (err: any) {
      const error = err.json
      if (error?.data?.error && error?.data?.error.indexOf("User already exists") >= 0) {
        setError({ ...error, email: "Email already exists" })
      }
    } finally {
      setLoading(false)
    }
  }
  const [setShowModalComponent] = [useSetAtom(showComponentAtom)]
  const login = async (email: string) => {
    await authentication.login(email, body.password)
  }

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        height: '100%',
        flex: 1,
        position: 'relative',
        paddingHorizontal: isMobile ? 0 : 0,
      }}>
      <LeftSide style={styles.leftSide} title="Join now!" />

      <ScrollView
        contentContainerStyle={{ padding: 0 }}
        style={{ width: '100%', marginBottom: isMobile ? 30 : 0 }}>

        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            alignItems: 'center',
            margin: 'auto',
            gap: isMobile ? 15 : 21,
            flex: 1,
            width: '100%',
            maxWidth: isMobile ? '100%' : 400,
            paddingHorizontal: isMobile ? 20 : 0,
            paddingTop: isMobile ? 18 : 0
          }}>
          {isMobile ? <KText
            style={{
              fontSize: 13,
              fontWeight: '500',
              marginBottom: 7,
              textAlign: 'center',
              maxWidth: '100%',
            }}>
            Please fill your details
          </KText> : (
            <KText style={{
              fontSize: 35,
              fontWeight: '600',
              marginBottom: 56,
              lineHeight: 30,
              textAlign: 'center',
              maxWidth: 320,
              letterSpacing: -0.5
            }}>
              Create your account today!
            </KText>)}

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : "Name"}
            gapBeforeChildren={false}
            gapAfterChildren={false}>
            <KTextInput
              placeholder="Name"
              value={body.firstName}
              onChangeText={firstName => setBody({ ...body, firstName })}
              inputStyles={{
                textAlign: 'left',
                paddingLeft: 20,
                paddingVertical: 12,
              }}
              error={error.firstName}
            />
          </FormField>

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : "Phone"}
            style={{ zIndex: 5 }}
            gapBeforeChildren={false}
            gapAfterChildren={false}
          >

            <KPhoneInputV2
              phone={body.phone}
              // placeholder="Add your phone number"
              onChange={(phone) => setBody({ ...body, phone })}
              error={error.phone}
            />
          </FormField>

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : "Email"}
            gapBeforeChildren={false}
            gapAfterChildren={false}>
            <KTextInput
              placeholder={isMobile ? 'E-mail' : "Add your email"}
              value={body.email}
              onChangeText={email => setBody({ ...body, email })}
              inputStyles={{
                textAlign: 'left',
                paddingLeft: 20,
                paddingVertical: 12,
              }}
              error={error.email}
            />
          </FormField>

          <FormField
            labelAlign="left"
            label={isMobile ? undefined : "Choose password"}
            gapBeforeChildren={false}
            gapAfterChildren={false}
          >
            <KTextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={body.password}
              onChangeText={password => setBody({ ...body, password })}
              rightComponent={
                <KIcon
                  name={showPassword ? 'eyeOpen' : 'eyeClose'}
                  size={'medium'}
                  style={{ marginRight: 10, opacity: 0.5 }}
                />
              }
              inputStyles={{
                textAlign: 'left',
                paddingLeft: 20,
                paddingVertical: 12,
              }}
              error={error.password}
              onRightComponentPress={() => setShowPassword(!showPassword)}
            />
          </FormField>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: isMobile ? '100%' : 274,
              gap: isMobile ? 18 : 32,
            }}>
            <KButton
              text="Create account"
              style={{
                width: '100%',
                marginTop: isMobile ? 9 : 40,
              }}
              onPress={createAccount}
              disabled={loading}
              loading={loading}

            />
            <KText style={styles.dividerContainer}>
              <View style={styles.divider} />
              <span>or</span>
              <View style={styles.divider} />
            </KText>
            <GoogleLoginButton />

          </View>
        </View>
      </ScrollView>
      {
        !isMobile && (
          <View style={{ position: 'absolute', top: 20, right: 20 }}>
            <KIcon
              name="closeWithBorder"
              size={'large'}
              onPress={() => {
                props.navigation.navigate('Home')
              }}
            />
          </View>
        )
      }
      {
        !isMobile && (
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
        )
      }
    </View >
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
    gap: 16,
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
    fontSize: 13
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
  },
  leftSide: {
    height: 261
  },
  containerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  }
}
)
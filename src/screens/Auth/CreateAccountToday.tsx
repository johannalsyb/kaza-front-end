import { useState } from 'react'
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
import auth from '../../api/auth'
import UserEvent from '../../events/UserEvent'
import { RegisterFormError } from '../../components/forms/auth/Register'
import { ApiResponseError } from '../../api'
import KPhoneInputV2 from '../../components/Form/KPhoneInput/KPhoneInputV2'
import parsePhoneNumber, { isValidPhoneNumber } from 'libphonenumber-js'

const TopImg = require('../../assets/Auth/top.webp')
const LeftImg = require('../../assets/Auth/left_1920_x2.webp')

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
  console.log('isAuthLoading', isAuthLoading)
  const createAccount = async () => {
    const isValid = isValidPhoneNumber(body.phone)
    if (!isValid) {
      setError({ phone: 'Invalid phone number' })
      setLoading(false)
      console.log('error', error)
      return
    }
    setLoading(true)
    try {
      const response = await auth.signup(body)
      console.log('response', response)
      const user = await login(response.data.email)
      props.onCreated && props.onCreated(user!)


    } catch (err: any) {
      const error = err.json
      if (error?.data?.error && error?.data?.error.indexOf("User already exists") >= 0) {
        setError({ ...error, email: "Email already exists" })
      }
    } finally {
      setLoading(false)
    }
  }

  const login = (email: string) => {
    authentication.login(email, body.password)
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
          gap: 10,
          flex: 1,
          width: '100%',
          maxWidth: isMobile ? '100%' : 400,
        }}>
        <KText
          style={{
            fontSize: isMobile ? 20 : 35,
            fontWeight: 'bold',
            marginBottom: 24,
            textAlign: 'center',
            maxWidth: isMobile ? '100%' : 320,
          }}>
          Create your account today!
        </KText>

        <FormField labelAlign="left" label="Name">
          <KTextInput
            placeholder="Enter your name"
            value={body.firstName}
            onChangeText={firstName => setBody({ ...body, firstName })}
            inputStyles={{
              textAlign: 'left',
              paddingLeft: 20,
              paddingVertical: 12,
            }}
          />
        </FormField>

        <FormField labelAlign="left" label="Phone" style={{ zIndex: 5 }}>

          {/* <KTextInput
            placeholder="Add your phone number"
            value={body.phone}
            autoComplete="tel"
            onChangeText={phone => setBody({...body, phone})}
            inputStyles={{
              textAlign: 'left',
              paddingLeft: 20,
              paddingVertical: 12,
            }}
          /> */}
          <KPhoneInputV2
            phone={body.phone}
            // placeholder="Add your phone number"
            onChange={(phone) => setBody({ ...body, phone })}

          />
        </FormField>

        <FormField labelAlign="left" label="Email">
          <KTextInput
            placeholder="Add your email"
            value={body.email}
            onChangeText={email => setBody({ ...body, email })}
            inputStyles={{
              textAlign: 'left',
              paddingLeft: 20,
              paddingVertical: 12,
            }}
          />
        </FormField>

        <FormField labelAlign="left" label="Choose password">
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
            gap: 32,
          }}>
          <KButton
            text="Create account"
            style={{
              width: '100%',
              marginTop: isMobile ? 0 : 40,
            }}
            onPress={createAccount}
            disabled={loading}
            loading={loading}

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
          <KButton
            color="light"
            text="Sign in with Google"
            style={{
              width: '100%',
              marginBottom: isMobile ? 12 : 80,
              marginLeft: 56,
              marginRight: 56,
            }}
            icon="Google"
            iconStyle={{ stroke: 'transparent' }}
            onPress={() => { }}
          />
        </View>
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
              props.navigation.navigate('Home')
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

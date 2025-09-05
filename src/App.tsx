import React, { useEffect, useRef } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  Platform,
} from 'react-native'
import useAuthentication from './hooks/useAuthentication'
import ToastManager from './components/Toast/ToastManager'
import Navigation, { Handle } from './navigation'
import './components/KText'
import KText from './components/KText'
import { ClickOutsideProvider } from 'react-native-click-outside'
import useConfig from './hooks/useConfig'
import './utils/'
import variables from './styles/variables'
import KIcon from './components/KIcon/KIcon'
import { OnboardingInfo } from './common/types/api/auth'
import { toastSuccess } from './components/Toast/Toast'
import properties from './api/properties'
import { AuthProvider } from './contexts/AuthContext'
import { TranslationProvider } from './contexts/TranslationContext'
import { NotificationsProvider } from './contexts/NotificationsContext'
import { ModalProvider } from './contexts/ModalContext'

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'
  if (Platform.OS === 'web') {
    require('react-datepicker/dist/react-datepicker.css');
    require('./components/DatePicker/datepickerOverrides.css');
  }

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: variables.colors.greenLight,
  }

  const authentication = useAuthentication()
  const config = useConfig()
  const { isAuthLoading, user } = authentication
  const navRef = useRef<Handle>(null)

  useEffect(() => {
    authentication.check(true)
      .then(async (uu) => {
        if (uu) {

          try {
            const userProperties = await properties.ofUser('me')
            const hasProperties = userProperties.data.length > 0


            if (!hasProperties) {
              setTimeout(() => {
                console.log("No properties found, navigating to onboarding")
                navRef.current?.navigate("Onboarding", { step: 1 })
              }, 200)
              return
            }


            if (uu.onboarding) {
              const onboarding = JSON.parse(uu.onboarding) as OnboardingInfo
              console.log(onboarding)
              if (!onboarding.completed) {
                setTimeout(() => {
                  console.log("Onboarding not completed, navigating to onboarding")
                  navRef.current?.navigate("Onboarding", { step: onboarding.step })
                }, 200)
              }
            }
          } catch (error) {
            console.log("Error checking user properties:", error)

            setTimeout(() => {
              console.log("Error checking properties, navigating to onboarding")
              navRef.current?.navigate("Onboarding", { step: 1 })
            }, 200)
          }
        }
      })
    config.load()
  }, [])
  return (
    <React.StrictMode>
              <SafeAreaView
                style={[
                  backgroundStyle,
                  {
                    height: '100%',
                  },
                ]}>
                <ClickOutsideProvider>
                  <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={backgroundStyle.backgroundColor}
                  />
                  <ToastManager>
                    {isAuthLoading ? <View style={{
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <KIcon name="logoText2" size={120} style={{}} />
                      <ActivityIndicator color={"black"} />
                    </View> : <Navigation ref={navRef} />}
                  </ToastManager>
                </ClickOutsideProvider>
              </SafeAreaView>
    </React.StrictMode>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})

export default App

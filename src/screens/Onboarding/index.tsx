import {
  ActivityIndicator,
  Button,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import KText from '../../components/KText'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { NavStackParamList } from '../../navigation/screens'
import StepView from '../../components/StepView'
import React, { useEffect, useState } from 'react'
import { clamp } from '../../utils/math'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import variables from '../../styles/variables'
import { Property } from '../../components/forms/property'
import properties from '../../api/properties'
import useAuthentication from '../../hooks/useAuthentication'
import useIsMobile from '../../hooks/useIsMobile'
import KIcon from '../../components/KIcon/KIcon'
import users from '../../api/users'
import { OnboardingInfo } from '../../common/types/api/auth'
import KAlert from '../../components/KAlert'
import Notification from '../../components/Screens/Onboarding/CalendarComponent/Notification'
// import Step6 from "./Step6";

type Props = NativeStackScreenProps<NavStackParamList, 'Onboarding'>
// & {
//   step: number,
// };

export const onboardingSteps: {
  icon: string
  title: string
  subtitle?: string
  content?: JSX.Element
}[] = [
    {
      icon: '🏡',
      title: 'About your place',
    },
    {
      icon: '🤓',
      title: 'A bit more details',
    },
    {
      icon: '📷',
      title: 'Time to show off',
      subtitle: 'Minimum 4 pictures',
    },
    {
      icon: 'calendarNew',
      title: 'What’s the availabilities of your place?',
    },
  ]

export const defaultProperty: Property = {
  location: '',
  type: '',
  amenities: [],
  petFriendly: undefined,
  size: 25,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  bedroomsBeds: [{ single: 0, double: 1 }],
  pics: [],
}

let callback: (() => void) | undefined

export default (props: Props) => {
  const [currentStep, setCurrentStep] = useState<number | undefined>()
  const [property, setProperty] = useState<Property>()
  const { user } = useAuthentication()
  const { isMobile, height } = useIsMobile()

  const navigationListenerFn = (e: any) => {
    if (currentStep === 1) return props.navigation.push('Login')
    if (!props.route?.params) return
    if (
      currentStep === undefined &&
      props.route.params.step === onboardingSteps.length
    ) {
      callback && callback()
      return // DO NOTHING WHEN FINISHED. This was creating a bug where the user would be redirected to onboarding when opening the profile after signing up
    }
    e.preventDefault()
    stepDown()
  }

  useEffect(() => {
    if (!callback) {
      // console.log("ADDING NAVIGATION LISTENER")
      callback = props.navigation.addListener(
        'beforeRemove',
        navigationListenerFn,
      )
    }
    return () => {
      // console.log("UNMOUNTING calling callback...")
      callback && callback()
    }
  }, [props.navigation])

  useEffect(() => {
    Promise.all([users.me.get(), properties.ofUser('me')])
      .then(([me, properties]) => {
        // const onboarding:OnboardingInfo = me.data.onboarding ? JSON.parse(me.data.onboarding) : {step: 1, data: defaultProperty, completed: false}
        let onboarding: OnboardingInfo
        if (me.data.onboarding) {
          onboarding = JSON.parse(me.data.onboarding)
        } else {
          let step = 1
          let completed = false
          let data: any = defaultProperty
          if (properties.data.length) {
            data = {}
            step = 5
            if (me.data.payment) {
              step = 6 // If the user has already paid, skip to the end
              completed = true
            }
          }
          onboarding = { step, data, completed }
        }

        if (onboarding.completed) return props.navigation.navigate('Success')

        const propData =
          onboarding.data && Object.keys(onboarding.data).length
            ? onboarding.data
            : defaultProperty

        if (properties.data.length) {
          setProperty({ ...propData, id: properties.data[0].id })
        } else {
          setProperty(propData)
        }
        setCurrentStep(onboarding.step)
      })
      .catch(err => {
        // We're most likely not logged in
        setCurrentStep(1)
      })
  }, [])

  const stepUp = (v = (currentStep || 1) + 1) => {
    const vv = clamp(v, 1, onboardingSteps.length)
    return users.me
      .update({
        onboarding: JSON.stringify({
          step: vv,
          data: property,
          completed: false,
        }),
      })
      .then(() => {
        setCurrentStep(vv)
        props.navigation.push('Onboarding', { step: vv })
      })
  }

  const stepDown = (v = (currentStep || 2) - 1) => {
    const vv = clamp(v, 1, onboardingSteps.length)
    return users.me
      .update({
        onboarding: JSON.stringify({
          step: vv,
          data: property,
          completed: false,
        }),
      })
      .then(() => {
        setCurrentStep(vv)
        props.navigation.push('Onboarding', { step: vv })
      })
      .catch(err => {
        console.log(err)
        props.navigation.push('Login')
      })
  }

  const finish = () => {
    return users.me
      .update({
        onboarding: JSON.stringify({
          step: currentStep,
          data: property,
          completed: true,
        }),
      })
      .then(() => {
        // console.log("FINISHED, calling callback to unsubscribe...")
        callback && callback()
        props.navigation.navigate('Success')
      })
  }

  onboardingSteps[0].content = (
    <Step2
      property={property || defaultProperty}
      onChange={setProperty}
      onNext={() => stepUp(2)}
    />
  )
  onboardingSteps[1].content = (
    <Step3
      property={property || defaultProperty}
      onChange={setProperty}
      onNext={() => stepUp(3)}
      onPrev={() => stepDown(1)}
    />
  )
  onboardingSteps[2].content = (
    <Step4
      property={property || defaultProperty}
      onChange={setProperty}
      onNext={() => stepUp(4)}
      onPrev={() => stepDown(2)}
    />
  )
  onboardingSteps[3].content = (
    <Step5
      onChange={setProperty}
      property={property || defaultProperty}
      onNext={finish} onPrev={() => stepDown(3)} />
  )

  const currentStepObject = onboardingSteps[(currentStep || 1) - 1]
  const Comp = isMobile ? ScrollView : View


  return (
    <>
      <Comp
        style={{
          display: 'flex',
          flex: 1,
          backgroundColor: 'white',
          flexDirection: isMobile ? 'column' : 'row',
        }}
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'white',
          flexDirection: isMobile ? 'column' : 'row',
        }}>
        {isMobile &&
          <View style={styles.iconBack}>
            <KIcon
              name="backArrow"
              size={40}
              onPress={() => currentStep && currentStep !== 1 ? stepDown(currentStep - 1) : props.navigation.push('Home')}
              style={
                { backgroundColor: 'white', borderRadius: 50, padding: 5 }
              }
            />
          </View>
        }
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            paddingBottom: 30,
            paddingTop: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            zIndex: 1,
            width: isMobile ? '100%' : undefined,
            flex: isMobile ? undefined : 1,
            backgroundColor: variables.colors.greenLight,
          }}>
          {isMobile && (
            <StepView
              number={onboardingSteps.length}
              current={currentStep || 1}
              style={{
                height: 3,
                width: '90%',
                flex: 1,
                opacity: !currentStep ? 0 : 1,
              }}
            />
          )}
          {Boolean(currentStep) && <KText
            style={{
              fontSize: isMobile ? 40 : 70,
              backgroundColor: isMobile ? 'transparent' : 'white',
              padding: isMobile ? 0 : 10,
              borderRadius: isMobile ? 0 : 60,
              width: isMobile ? 'auto' : 120,
              textAlign: 'center',
              marginTop: isMobile ? 44 : 0
            }}>
            {currentStepObject.icon === 'calendarNew' ? <KIcon
              name={currentStepObject.icon as 'calendarNew'}
              size={isMobile ? 40 : 70}
              style={{
                color: variables.colors.yellow,
                // marginTop: isMobile ? 44 : 10,

              }} /> :
              currentStepObject.icon}
          </KText>}
          {Boolean(currentStep) && <KText
            style={styles.title}>
            {currentStepObject.title}
          </KText>}
          {currentStepObject.subtitle && (
            <KText
              style={styles.subtitle}>
              {currentStepObject.subtitle}
            </KText>
          )}

          {!isMobile && (
            <>
              <KText style={{ marginTop: 20, opacity: !currentStep ? 0 : 1 }}>
                Step {currentStep} of {onboardingSteps.length}
              </KText>
              <StepView
                number={onboardingSteps.length}
                current={currentStep || 1}
                style={{
                  height: 3,
                  width: '90%',
                  marginTop: 30,
                  opacity: !currentStep ? 0 : 1,
                }}
              />
              <Pressable
                style={{ position: 'absolute', top: 0, left: 40 }}
                onPress={() => {
                  Linking.openURL('/')
                }}>
                <KIcon name="KazaSwapLogoBlackYellow" size={120} />
              </Pressable>
              <KText
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  fontSize: 10,
                  color: variables.colors.grey,
                }}>
                © {new Date().getFullYear()} Kaza Swap LLC. All rights reserved.
              </KText>
            </>
          )}
        </View>
        <ScrollView
          contentContainerStyle={{
            marginHorizontal: 'auto',
            marginVertical: 30,
            width: isMobile ? '100%' : 400,
            paddingHorizontal: isMobile ? 30 : 0,
            ...(Platform.OS === 'web' && typeof height === 'number'
              ? { minHeight: isMobile ? 'auto' : height - 60, height: isMobile && currentStep === 4 ? 'calc(100% - 60px)' : 'auto' } as any
              : {}),
          }}
          style={{
            flex: 1,
            width: '100%',
          }}>
          {!currentStep ? (
            <ActivityIndicator
              color={variables.colors.yellow}
              size="large"
              style={{ marginTop: 20 }}
            />
          ) : (
            <View
              style={styles.containerRightSide}>
              {currentStepObject.content}
            </View>
          )}
        </ScrollView>
      </Comp>
      <KAlert />

      <Notification countCredits={5} />

    </>
  )
}

const styles = StyleSheet.create({
  containerRightSide: {
    zIndex: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#000',
    textAlign: 'center',
    fontFamily: "Plus Jakarta Sans",
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 23,
    letterSpacing: -0.5,
    maxWidth: 243
  },
  subtitle: {
    marginTop: 5,
    opacity: 0.5,
    textAlign: 'center',
    fontFamily: "Plus Jakarta Sans",
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 13,
    letterSpacing: -0.5
  },
  iconBack: {
    position: 'absolute',
    top: 40,
    left: 17,
    zIndex: 1000
  }
})

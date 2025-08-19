import {
  ActivityIndicator,
  Button,
  ImageBackground,
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
// import Notification from '../../components/Screens/Onboarding/CalendarComponent/Notification'
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
      title: 'Describe Your Place',
    },
    {
      icon: '🤓',
      title: 'Add More Info',
    },
    {
      icon: '📷',
      title: 'Time to show off',
      subtitle: 'Minimum 4 pictures',
    },
    {
      icon: 'calendarNew',
      title: 'When’s Your Place Free?',
    },
  ]

export const defaultProperty: Property = {
  location: '',
  type: '',
  amenities: [],
  petFriendly: undefined,
  size: 0,
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
  const [hasProperties, setHasProperties] = useState<boolean>(false)
  const { user } = useAuthentication()
  const { isMobile, height } = useIsMobile()

  const navigationListenerFn = (e: any) => {
    if (currentStep === 1 && !hasProperties) {
      e.preventDefault()
      return
    }
    
    if (currentStep === 1) return props.navigation.push('Login')
    if (!props.route?.params) return
    if (
      currentStep === undefined &&
      props.route.params.step === onboardingSteps.length
    ) {
      callback && callback()
      return
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
        // Set whether user has properties
        setHasProperties(properties.data.length > 0)
        
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
              step = 6 
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
        setCurrentStep(1)
        setHasProperties(false)
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

  
  const onPropertyCreated = () => {
    setHasProperties(true)
  }

  onboardingSteps[0].content = (
    <Step2
      property={property || defaultProperty}
      onChange={setProperty}
      onNext={() => stepUp(2)}
      hasProperties={hasProperties}
    />
  )
  onboardingSteps[1].content = (
    <Step3
      property={property || defaultProperty}
      onChange={setProperty}
      onNext={() => stepUp(3)}
      onPrev={() => stepDown(1)}
      onPropertyCreated={onPropertyCreated}
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
      onNext={finish} 
      onPrev={() => stepDown(3)}
      onPropertyCreated={onPropertyCreated}
    />
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
              size={35}
              onPress={() => {
                
                if (currentStep === 1 && !hasProperties) {
                  return
                }
                currentStep && currentStep !== 1 ? stepDown(currentStep - 1) : props.navigation.push('Home')
              }}
              style={
                { backgroundColor: 'white', borderRadius: 50, padding: 4 }
              }
            />
          </View>
        }

       <ImageBackground
        source={require('../../components/KIcon/icons/onboardingBg.jpg')}
        style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      paddingBottom: 30,
     
      height: isMobile ? 228 :undefined,
      marginBottom: isMobile? 0 :32,
      marginLeft: isMobile ? 0 : 39,
      marginTop: isMobile ? 0 : 55,
      borderRadius: isMobile ? 25 : 54,
      zIndex: 1,
      width: isMobile ? '100%' : undefined,
      flex: isMobile ? undefined : 1,
      overflow: 'hidden', 
        }}
        resizeMode="cover">
          {Boolean(currentStep) && <KText
            style={[styles.title, { fontSize: isMobile ? 27 : 40, fontWeight: isMobile ? '700' : '600'}]}          
            >
            {currentStepObject.title} 
          </KText>}
            <>
              <StepView
                number={onboardingSteps.length}
                current={currentStep || 1}
                style={{
                  height: 7,
                  width: '100%',
                  maxWidth: 268,
                  marginTop: 30,
                  opacity: !currentStep ? 0 : 1,
                }}
              />
                <KText style={{ marginTop: 20, opacity: !currentStep ? 0 : 1,fontSize:19, color: 'white' }}>
                  Step {`${(currentStep ?? 0) < 10 ? '0' : ''}`}{currentStep}  <KText style={{color: '#FFE361'}}>of {onboardingSteps.length}</KText> 
                </KText>
              {
                !isMobile && (
              <Pressable
                style={{ position: 'absolute', bottom: 32, left: 0, right: 0 ,

                   alignItems: 'center', 
                  justifyContent: 'center', 
                }}
                onPress={() => {
                  Linking.openURL('/')
                }}>
                <KIcon name="KazaSwaplogoblackandyellowVertical" style={{width: 70, height: 104,}} />
              </Pressable>
                )
              }
            </>
        </ImageBackground>
        <ScrollView
          contentContainerStyle={{
            marginHorizontal: 'auto',
            marginVertical: 40,
            width: isMobile ? '100%' : 420,
            paddingHorizontal: isMobile ? 30 : 8,
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

      {/* <Notification countCredits={5} /> */}

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
    color: 'white',
    textAlign: 'center',
    fontFamily: "Plus Jakarta Sans",
    fontStyle: 'normal',
    lineHeight: 30,
    letterSpacing: -0.5,
    maxWidth: 530
  },
  
  iconBack: {
    position: 'absolute',
    top: 70,
    left: 17,
    zIndex: 1000
  }
})

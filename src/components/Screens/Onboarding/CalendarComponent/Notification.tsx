import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import KIcon from '../../../KIcon/KIcon'
import KText from '../../../KText'
import variables from '../../../../styles/variables'
import { useAtomValue } from 'jotai'
import { avilebleDatesAtom } from '../../../../atoms'
import useIsMobile from '../../../../hooks/useIsMobile'
import { useRoute } from '@react-navigation/native'

interface NotificationProps {
  countCredits?: number
}

const Notification = (props: NotificationProps) => {
  // const { countCredits } = props
  // Створюємо анімовані значення
  const translateY = useRef(new Animated.Value(100)).current // Починаємо з низу (100px вниз)
  const opacity = useRef(new Animated.Value(0)).current // Починаємо з прозорості 0
  const zIndex = useRef(new Animated.Value(-1)).current // Починаємо з  позиції -1
  // Анімація появи

  const showAnimation = Animated.parallel([
    Animated.timing(translateY, {
      toValue: 0, // Піднімаємо до потрібної позиції
      duration: 1000, // 0.5 секунди на появу
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 1, // Робимо видимим
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(zIndex, {
      toValue: 1, // Піднімаємо на передній план
      duration: 300,
      useNativeDriver: true,
    }),
  ])

  // Анімація зникнення
  const hideAnimation = Animated.parallel([
    Animated.timing(translateY, {
      toValue: 100, // Опускаємо вниз
      duration: 100, // 0.5 секунди на зникнення
      useNativeDriver: true,
    }),
    Animated.timing(opacity, {
      toValue: 0, // Робимо прозорим
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(zIndex, {
      toValue: -1, // Ховаємо з екрану
      duration: 100,
      useNativeDriver: true,
    }),
  ])

  // Запускаємо послідовність анімацій
  const sequence = Animated.sequence([
    showAnimation,
    Animated.delay(7000), // Тримаємо 7 секунди
    hideAnimation,
  ])
  // useEffect(() => {
  //   if (countCredits === undefined || countCredits <= 0) return
  //   sequence.start()
  // }, [countCredits])
  const avilebleDates = useAtomValue(avilebleDatesAtom)
  const culculatedCredits = avilebleDates.reduce((acc: number, date: { value: [string, string] }) => {
    const start = new Date(date.value[0])
    const end = new Date(date.value[1])
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
    return acc + days
  }, 0)

  const route = useRoute();
  const step = (route as { params?: { step?: number } }).params?.step ?? 0;
  useEffect(() => {
    if (step === 4) {
      if (culculatedCredits > 0) {
        sequence.start()
      }
    }
  }, [culculatedCredits, step])
  const { isMobile } = useIsMobile()

  return (
    <Animated.View style={{
      position: 'relative',
      
      width:  '100%',
      transform: [{ translateY ,}],
      top:0,
      opacity,
      left: 0,
      zIndex
    }}>
      <View style={styles.container}>
        <KIcon name="bell" size={29} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <KText style={styles.title}>
            NOTE!
          </KText>
          <KText style={styles.text}>
            You will get
            <KText style={styles.credits}> {culculatedCredits} credits</KText> if someone stays at your
            place for the whole time. 
          </KText>
        </View>
      </View>
    </Animated.View>
  )
}

export default Notification

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: "center",
    gap: 15,
    backgroundColor: variables.colors.yellow,
    paddingHorizontal: 21,
    borderRadius: 25,
    paddingTop: 8,
    paddingBottom: 5,
  },
  icon: {
    borderRadius: 36,
    border: '1px solid rgba(0, 0, 0, 0.20)',
    background: '#FFF',
    padding: 7,
    backgroundColor: variables.colors.white,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 20
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    maxWidth: 300
  },
  credits: {
    fontWeight: 'bold',

    textDecorationLine: 'underline',
  }
})
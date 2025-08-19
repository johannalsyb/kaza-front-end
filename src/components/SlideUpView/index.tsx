import { useFocusEffect } from '@react-navigation/native'
import React, { useRef } from 'react'
import { Animated, View, ViewStyle } from 'react-native'
import useIsMobile from '../../hooks/useIsMobile'

type Props = {
  children: React.ReactNode
  delay?: number
  duration?: number
  style?: ViewStyle
}

const SlideUpView = ({ children, delay = 0, duration = 500, style }: Props) => {
  const { isMobile } = useIsMobile()

  const translateY = useRef(new Animated.Value(500)).current
  const opacity = useRef(new Animated.Value(0)).current

  useFocusEffect(
    React.useCallback(() => {
      if (!isMobile) {
        translateY.setValue(500)
        opacity.setValue(0)

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          }),
        ]).start()
      }
    }, [isMobile, delay, duration, translateY, opacity])
  )

  if (isMobile) {
    return <View style={style}>{children}</View>
  }

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }],
          opacity,
         
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
}

export default SlideUpView

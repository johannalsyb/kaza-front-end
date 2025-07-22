import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'
import variables from '../../styles/variables'

interface Props {
  progress?: number // 0-100
  duration?: number // Тривалість анімації в мс
  width?: string | number
  height?: number
  backgroundColor?: string
  progressColor?: string
}

const AnimatedProgressBar = ({
  progress,
  duration = 150,
  width = '80%',
  height = 20,
  backgroundColor = 'rgba(0, 0, 0, 0.8)',
  progressColor = variables.colors.white
}: Props) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(animatedValue, {
        toValue: progress / 100,
        duration: 500,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start()
    }
  }, [progress, duration])

  const widthPercentage = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={{
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      borderRadius: 23,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 18,
      left: '50%',
      transform: [
        { translateX: '-50%' },
        { translateY: -height / 2 }
      ],
      padding: 2,
    } as any}>
      <Animated.View style={{
        width: widthPercentage,
        height: '100%',
        backgroundColor: progressColor,
        borderRadius: (height - 4) / 2,
      }} />
    </View>
  )
}

export default AnimatedProgressBar
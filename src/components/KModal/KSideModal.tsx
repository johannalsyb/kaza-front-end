import React, { CSSProperties, forwardRef, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Modal,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
  Pressable,
  Text,
  ViewStyle,
} from 'react-native'
import variables from '../../styles/variables'
import KIcon from '../KIcon/KIcon'
import useIsMobile from '../../hooks/useIsMobile'

type Props = {
  visible: boolean
  onClose: (visible: boolean) => void
  children: React.ReactNode
  showCross?: boolean
  style?: ViewStyle
  position?: 'left' | 'right' | 'bottom'
}

const KModal = ({
  visible,
  onClose,
  children,
  showCross = true,
  style = {},
  position = 'right',
}: Props, ref: any) => {
  const { width, height } = useWindowDimensions()
  const { isMobile } = useIsMobile()

  const isLeft = position === 'left'
  const isBottom = position === 'bottom'
  const translateY = useRef(new Animated.Value(height)).current

  const translateX = useRef(new Animated.Value(isLeft ? -width / 2 : width)).current
  useEffect(() => {
    if (isBottom) {
      // Анімація з низу
      Animated.timing(translateY, {
        toValue: visible ? 0 : height,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      // Анімація з боків (існуюча логіка)
      Animated.timing(translateX, {
        toValue: !isLeft ? (visible ? 0 : width) : (visible ? 0 : -width),
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, width, height, isBottom, isLeft])

  if (!visible) return null
  // console.log('isBottom', isBottom, position)
  const posStyle: ViewStyle = {}
  if (isBottom) {
    // Стилі для анімації з низу
    posStyle.bottom = 0
    posStyle.left = 0
    posStyle.right = 0
    posStyle.transform = [{ translateY }]
    posStyle.borderTopLeftRadius = 20
    posStyle.borderTopRightRadius = 20
    posStyle.borderBottomLeftRadius = 0
    posStyle.borderBottomRightRadius = 0
    posStyle.width = "100%"
    posStyle.height = 'auto'
    posStyle.maxHeight = "90%"
  } else {
    // Існуюча логіка для бокових анімацій
    if (isLeft) {
      posStyle.left = 0
      posStyle.transform = [{ translateX }]
      posStyle.borderTopRightRadius = isMobile ? 0 : 20
      posStyle.borderBottomRightRadius = isMobile ? 0 : 20
    } else {
      posStyle.left = isMobile ? 0 : "50%"
      posStyle.transform = [{ translateX }]
      posStyle.borderTopLeftRadius = isMobile ? 0 : 20
      posStyle.borderBottomLeftRadius = isMobile ? 0 : 20
    }
    posStyle.width = isMobile ? "100%" : "90%"
    posStyle.maxWidth = isMobile ? "100%" : "50%"
    posStyle.height = "100%"
  }
  return (
    <Modal
      ref={ref}
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose(false)}>
      <>
        <TouchableOpacity
          style={[styles.modalOverlay]}
          onPress={() => onClose(false)} />
        <Animated.View
          style={[
            styles.modalView,
            posStyle,
            style
          ]}>
          {children && children}
          {showCross && <Pressable style={styles.close} onPress={() => onClose(false)}>
            <KIcon name="crossCircle" size="medium" style={{ stroke: variables.colors.grey }} />
          </Pressable>}
        </Animated.View>
      </>
    </Modal>
  )
}

export default forwardRef(KModal)

const {
  colors: { closeButton, yellow },
} = variables

const styles = StyleSheet.create({
  modalOverlay: {
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  modalView: {
    backgroundColor: "white",
    alignItems: 'center',
    // margin: 'auto',
    // left: "50%",
    // width: '90%',
    // maxWidth: "50%",
    height: "100%",
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    // borderWidth: 1,
    borderRadius: 50,
    borderColor: closeButton,
  },
  xButton: {
    color: closeButton,
  },
})

import React, { CSSProperties, forwardRef, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Modal,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
  Pressable,
  View,
  Text,
  ViewStyle,
} from 'react-native'
import variables from '../../styles/variables'
import KIcon from '../KIcon/KIcon'
import KButton from '../KButton/KButton'

type Props = {
  isMobile?: boolean
  visible: boolean
  setVisibility: (visible: boolean) => void
  children: React.ReactNode
  clearFilters: () => void
  clearFiltersView?: () => React.ReactNode
  showCross?: boolean
  crossStyle?: CSSProperties
  style?: ViewStyle
  onLayout?: (event: any) => void,
  title?: string
}

const KModal = ({
  visible,
  setVisibility,
  children,
  showCross = true,
  isMobile = false,
  style = {},
  crossStyle = {},
  onLayout,
  clearFilters,
  clearFiltersView,
  title = 'Filters'
}: Props, ref: any) => {
  const { height } = useWindowDimensions()

  const translateY = useRef(new Animated.Value(height)).current
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : height,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [visible, height])

  if (!visible) return null
  return (
    <Modal
      ref={ref}
      animationType="none"
      transparent={true}
      visible={visible}
      onLayout={onLayout}
      onRequestClose={() => setVisibility(false)}>
      <>
        <TouchableOpacity
          style={[styles.modalOverlay]}
          onPress={() => setVisibility(false)}></TouchableOpacity>
        <Animated.View
          style={[
            isMobile ? styles.modalViewMobile : styles.modalView,
            {
              transform: [{ translateY }],
            },
            style
          ]}>
          {title === 'Dates' && <View style={{ width: 30, height: 2, backgroundColor: variables.colors.yellow, marginBottom: 5 }} />}
          <View style={[styles.header, { justifyContent: isMobile ? 'center' : 'space-between' }]}>
            {isMobile ?
              <Text
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: '600',
                  fontSize: 25,
                  lineHeight: 25,
                  letterSpacing: -0.5,
                  textAlign: 'center'
                }}
              >
                {title}
              </Text> : <Text style={{ color: closeButton, fontSize: 16, fontFamily: variables.font.family.regular }}>{title}</Text>}
            {clearFiltersView && clearFiltersView()}
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: isMobile ? 'column-reverse' : 'row',
              alignItems: 'center',
              gap: isMobile ? 0 : 20,
              width: '100%',
              minHeight: isMobile ? 320 : 100
            }}>
            {children && children}
          </View>
          {showCross && !isMobile && <Pressable style={styles.close} onPress={() => setVisibility(false)}>
            <KIcon name="crossCircle" size="medium" style={{ stroke: variables.colors.grey, ...crossStyle }} />
          </Pressable>}
          {isMobile &&
            <View style={styles.bottomButtons}>
              <KButton
                onPress={() => {
                  clearFilters()
                  setVisibility(false)
                }}
                color={'greenLight'}
                iconSize='medium'
                text='Cancel'
              />
              <KButton
                onPress={() => setVisibility(false)}
                text={title === 'Filters' ? 'Apply' : 'Confirm'}
              />
            </View>}
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
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: yellow,
    borderRadius: 30,
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    top: 150,
    right: 14,
    width: '90%',
    maxWidth: 480,
  },
  modalViewMobile: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: yellow,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxWidth: 480,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    width: '100%',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 50,
    borderColor: closeButton,
  },
  xButton: {
    color: closeButton,
  },
  bottomButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginTop: 30,
    marginBottom: 10,
  }
})

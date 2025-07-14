import React, { Dispatch, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import KText from '../KText'
import { useAtomValue } from 'jotai'
import { showAlert } from '../../atoms'
import KButton from '../KButton/KButton'


const KAlert = () => {
  const {
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  } = useAtomValue(showAlert)

  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: open ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }, [open])

  return (
    <Animated.View style={
      [styles.container,
      {
        opacity,
        zIndex: open ? 1000 : -1
      }]}>
      {/* Your alert content goes here */}
      <Animated.View style={styles.popup}>
        <KButton
          icon='closeWithBorder'
          iconSize='large'
          onPress={() => onClose(false)}
          color='light' style={styles.iconButton} />
        <View style={styles.header} >
          <KText style={styles.title}>{title}</KText>
        </View>
        <View style={styles.content}>
          <KText style={styles.message}>{message}</KText>
        </View>
        <View style={styles.footer}>
          <KButton
            text={cancelText}
            onPress={() => onClose(false)}
            style={styles.button}
            color='light'
          />
          <KButton
            text={confirmText}
            onPress={() => {
              onConfirm()
              onClose(false)
            }}
            textStyle={{ color: '#fff' }}
            style={{ ...styles.button, ...{ backgroundColor: 'red' } }}
          />
        </View>
      </Animated.View>

    </Animated.View>
  )
}

export default KAlert

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(1.5px)',

  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 300,
    maxWidth: 400,
    width: '100%',
    rowGap: 24
  },
  iconButton: {
    width: 'auto',
    borderWidth: 0,
    padding: 0,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1001,
    cursor: 'pointer',
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  message: {
    width: '100%',
    opacity: 0.8,
    fontSize: 16,
  },
  footer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 16
  },
  button: {
    width: '100%',
    flex: 1,
  }
})
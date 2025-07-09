import React, { Fragment } from 'react'
import variables from '../../styles/variables'
import { StyleSheet, View } from 'react-native'
import KButton from '../KButton/KButton'
import KText from '../KText'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavStackParamList } from '../../navigation/screens'

interface IModal {
  title: string
  description: string
  button: {
    label: string
    onPress: () => void
  }
  setOpen: (open: boolean) => void
  isSignIn?: boolean
  navigation?: NativeStackNavigationProp<
    NavStackParamList,
    'Properties' | 'Matching' | 'Favourites',
    undefined
  >
}

const Modal = (props: IModal) => {
  const { title, description, setOpen, button: { label, onPress }, isSignIn, navigation } = props
  console.log('description.includes()', description, description.includes('<br/>'))
  const seperator = '<br/>'
  return (
    <View style={styles.container}>
      <View style={styles.popup}>
        <KButton style={styles.iconButton} onPress={() => { setOpen(false) }} icon='closeWithBorder' iconSize='large' />
        <KText style={styles.title}>
          {title}
        </KText>
        <KText style={styles.description}>
          {description.includes(seperator) ? description.split(seperator).map((line, index) =>
          (<Fragment key={index}>
            {line}
            {index < description.split(seperator).length - 1 && <br />}
          </Fragment>
          )) : description}
          {/* You need to add a place to swap. <br />
          Get 5 credits by registering it now. */}
        </KText>
        <View style={styles.buttonsContainer} >
          {isSignIn && (
            <KButton
              text='Sign in'
              color='light'
              onPress={() => {
                navigation?.navigate('Login')
                setOpen(false)
                }
              }
              style={{ ...(isSignIn && { borderWidth: 0 }) }} />)}
          <KButton text={label} onPress={onPress} style={{ ...styles.button, ...(isSignIn && { borderWidth: 0, marginHorizontal: 0 }) }} />
        </View>


      </View>
    </View>
  )
}

export default Modal


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(1.5px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    borderRadius: 25,
    backgroundColor: variables.colors.yellow,
    paddingHorizontal: 36,
    paddingBottom: 32,
    paddingTop: 52,
    width: '100%',
    position: 'relative',
    maxWidth: 480,
  },
  iconButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1001,
    cursor: 'pointer',
    width: 'auto',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    color: variables.colors.black,
    fontFamily: variables.font.family.bold,
  },
  description: {
    opacity: 0.6,
    fontSize: 15,
    textAlign: 'center',
    color: variables.colors.black,
    fontFamily: variables.font.family.regular,
    fontWeight: '500',
    latterSpacing: -0.5,
    marginTop: 12,
    marginBottom: 28
  },
  button: {
    marginHorizontal: 'auto'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  }
})


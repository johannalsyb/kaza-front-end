import React from 'react'
import { StyleSheet, View } from 'react-native'
import variables from '../../styles/variables'
import KText from '../../components/KText'
import KButton from '../../components/KButton/KButton'
import { useSetAtom } from 'jotai'
import { showModalRegisterPlaceAtom } from '../../atoms'

interface IOnboarding {
  open: boolean
}

export default (props: IOnboarding) => {
  const { open } = props
  const setShowModalRegisterPlace = useSetAtom(showModalRegisterPlaceAtom)
  if (!open) return null
  return (
    <>
      <View style={styles.container}>
        <View style={styles.popup}>
          <KButton style={styles.iconButton} onPress={() => { setShowModalRegisterPlace(false) }} icon='closeWithBorder' iconSize='large' />
          <KText style={styles.title}>
            First, register your place
          </KText>
          <KText style={styles.description}>
            You need to add a place to swap. <br />
            Get 5 credits by registering it now.
          </KText>
          <KButton text='Register' onPress={() => { }} style={styles.button} />


        </View>
      </View>
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  }
})


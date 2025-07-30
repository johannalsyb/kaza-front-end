import React from 'react'
import { useSetAtom } from 'jotai'
import { showModalRegisterPlaceAtom } from '../../atoms'
import Modal from '../../components/Modal'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavStackParamList } from '../../navigation/screens'
import { useNavigation } from '@react-navigation/native'

interface IOnboarding {
  open: boolean
}

export default (props: IOnboarding) => {
  const { open, } = props
  const setShowModalRegisterPlace = useSetAtom(showModalRegisterPlaceAtom)
  const { navigate } = useNavigation<NativeStackNavigationProp<NavStackParamList>>()
  if (!open) return null
  return (
    <>
      <Modal
        title='First, register your place'
        description='You need to add a place to swap. <br/> Get 5 credits by registering it now.'
        button={{
          label: 'Register',
          onPress: () => {
            navigate('Onboarding', { step: 0 })
            setShowModalRegisterPlace(false)
          }
        }}
        setOpen={setShowModalRegisterPlace}
      />
    </>
  )
}

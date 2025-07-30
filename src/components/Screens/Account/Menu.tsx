import React from 'react'
import useIsMobile from '../../../hooks/useIsMobile'
import { View } from 'react-native'
import KButton from '../../KButton/KButton'

const Menu = (props: any) => {
  const { navigation, route } = props
  console.log('props', props)
  const isHistory = route.name === 'History' || route.name === 'Swap'
  const { isMobile } = useIsMobile()

  const menu = [
    {
      text: 'My Profile',
      icon: 'user',
      onPress: () => navigation.navigate('Account', { edit: undefined }),
      active: route.name === 'Account',
    },
    {
      text: 'My Place',
      icon: 'placeType',
      onPress: () => navigation.navigate('Myplace', {}),
      active: route.name === 'Myplace',
    },
    {
      text: ' History',
      icon: 'history',
      onPress: () => navigation.navigate('History'),
      active: isHistory,
    },
  ]

  return (
    <View style={{ flexDirection: isMobile ? 'column' : 'row' }}>
      {menu.map((m, i) => (
        <KButton
          key={`menu_${i}`}
          color={m.active ? 'tertiary' : 'light'}
          text={m.text}
          icon={m.icon as any}
          onPress={m.onPress}
          style={{ marginRight: 10 }}
        />
      ))}
    </View>
  )
}

export default Menu
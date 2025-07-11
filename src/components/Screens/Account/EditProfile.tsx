import React from 'react'
import { ActivityIndicator } from 'react-native'
import EditProfile from '../../Views/Account/EditProfile'
import useIsMobile from '../../../hooks/useIsMobile'

const EditProfileComponent = (props: any) => {
  const isMobile = useIsMobile()
  const { user, setUser, setModal, loadUser } = props


  if (!user) {
    return (
      <ActivityIndicator />
    )
  }
  return (
    <EditProfile
      style={{
        width: isMobile ? '100%' : '90%',
      }}
      creds={user.creds}
      onChange={c => setUser({ user: user.user, creds: c })}
      onClose={() => setModal(null)}
      onUpdated={() => {
        setModal(null)
        loadUser()
      }}
    />)
}

export default EditProfileComponent
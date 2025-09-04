import { useState, useEffect } from 'react'
import { Pressable, View, ViewStyle } from "react-native"
import { useRoute } from "@react-navigation/native"

import KIcon from "../KIcon/KIcon"
import KButton from "../KButton/KButton"
import variables from "../../styles/variables"
import useIsMobile from "../../hooks/useIsMobile"
import KSideModal from '../KModal/KSideModal'
import { CircleImage } from "../CircleImage/CircleImage"
import useAuthentication from "../../hooks/useAuthentication"
import { NavStackParamList } from "../../navigation/screens"
import Notifications from "../Views/Notifications"
import  storage from '../../utils/Storage/storageNew'

const size = 30

export default ({
  navigate,
  style
}: {
  navigate: (name: keyof NavStackParamList) => void,
  style?: ViewStyle
}) => {

  const { isMobile } = useIsMobile()
  const auth = useAuthentication()
  const user = auth.user
  const route = useRoute()

  const [bubbles, setBubbles] = useState({ notifications: 0, matches: 0 });

  useEffect(() => {
    const loadBubbles = async () => {
      const ur = parseInt((await storage.getItem("unreadNotifications")) || "0", 10);
      const nm = parseInt((await storage.getItem("newMatches")) || "0", 10);
      setBubbles({ notifications: ur, matches: nm });
    };

    loadBubbles();
  }, []);

  const [notificationsVisible, setNotificationsVisible] = useState(false)

  if (!isMobile) return <></>

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 101,

        ...style
      }}>
      <View style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {user ?
          <>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
              paddingVertical: 16,
              paddingHorizontal: 20,
              gap: 2,
              width: '100%',
              backgroundColor: 'black',

            }}>
              <KIcon
                onPress={() => navigate('Home')}
                name="home" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 11,
                  borderRadius: size,
                  stroke: route.name === "Home" ? "black" : "white",
                  backgroundColor: route.name === "Home" ? "white" : variables.colors.blackLight
                }} />
              <KIcon
                onPress={() => isMobile ? navigate('Notifications') : setNotificationsVisible(prev => !prev)}
                name="bellNew" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 11,
                  borderRadius: size,
                  stroke: route.name === "Notifications" ? "black" : "white",
                  backgroundColor: route.name === "Notifications" ? "white" : variables.colors.blackLight
                }}
              />
              <KIcon
                onPress={() => navigate('Favourites')}
                name="fav" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 11,
                  borderRadius: size,
                  stroke: route.name === "Favourites" ? "black" : "white",
                  backgroundColor: route.name === "Favourites" ? "white" : variables.colors.blackLight
                }} />
              <KIcon
                onPress={() => navigate('Chat')}
                name="chat" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 11,
                  borderRadius: size,
                  stroke: route.name === "Chat" ? "black" : "white",
                  backgroundColor: route.name === "Chat" ? "white" : variables.colors.blackLight
                }} />
              <Pressable onPress={() => { navigate('Account') }}>
                <CircleImage
                  thumbnail={true}
                  imageId={`${user.id}/${user.primaryImage}`}
                  type="users"
                  source={user.primaryImage}
                  style={user.primaryImage ? {
                    width: 50,
                    height: 50,
                    padding: 0,
                    borderWidth: 0,
                    borderColor: variables.colors.white,
                  } : {
                    width: 34,
                    height: 34,
                    padding: 7,
                    borderWidth: 2,
                    borderColor: variables.colors.orange,
                  }}
                />
              </Pressable>
              <KSideModal
                visible={notificationsVisible}
                onClose={() => {
                  setNotificationsVisible(false)
                }}>
                <Notifications unreadNotifications={bubbles.notifications || 0} />
              </KSideModal>
            </View>
          </>
          :
          <View style={{
            gap: 10,
            width: '100%',
            display: 'flex',
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
            backgroundColor: 'black',
          }}>
            <KButton text="Sign In" icon="login" color="light" onPress={() => navigate('Login')} />
            <KButton text="Register your place" icon="register" color="secondary" onPress={() => navigate('SignUp')} style={{ width: 'auto', paddingHorizontal: 4 }} />
          </View>
        }
      </View>
    </View>
  )
}

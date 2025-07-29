import { useRef } from 'react'
import { Pressable, View, ViewStyle, Animated } from "react-native"
import useAuthentication from "../../hooks/useAuthentication";
import { CircleImage } from "../CircleImage/CircleImage";
import { useNavigationContainerRef, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NavStackParamList } from "../../navigation/screens";
import KButton from "../KButton/KButton";
import useIsMobile from "../../hooks/useIsMobile";
import KIcon from "../KIcon/KIcon";
import variables from "../../styles/variables";
import { useEffect, useState } from "react";
import KText from "../KText";
import { useSetAtom } from "jotai";
import { showSwapNowAtom } from "../../atoms";

const size = 30

export default ({
  navigate,
  style
}: {
  navigate: (name: keyof NavStackParamList) => void,
  style?: ViewStyle
}) => {

  const { isMobile } = useIsMobile()
  const auth = useAuthentication();
  const user = auth.user;
  const route = useRoute()
  const setShowSwapNow = useSetAtom(showSwapNowAtom);
  const isDefaultImage = !user?.id || user.primaryImage === user.primaryImage;

  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!isMobile) return <></>
  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
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
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {user ?
          <>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
              padding: 16,
              gap: 10,
              width: '100%',
              backgroundColor: 'black',
            }}>
              <KIcon
                onPress={() => navigate('Home')}
                name="home" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 10,
                  borderRadius: size,
                  stroke: route.name === "Home" ? "black" : "white",
                  backgroundColor: route.name === "Home" ? "white" : variables.colors.blackLight
                }} />
              <KIcon
                onPress={() => navigate('Chats')}
                name="bellNew" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 10,
                  borderRadius: size,
                  stroke: route.name === "Chats" ? "black" : "white",
                  backgroundColor: route.name === "Chats" ? "white" : variables.colors.blackLight
                }}
              />
              <KIcon
                onPress={() => navigate('Favourites')}
                name="fav" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 10,
                  borderRadius: size,
                  stroke: route.name === "Favourites" ? "black" : "white",
                  backgroundColor: route.name === "Favourites" ? "white" : variables.colors.blackLight
                }} />
              <KIcon
                onPress={() => navigate('Chats')}
                name="chat" size="xlarge" style={{
                  marginRight: 5,
                  width: size,
                  height: size,
                  padding: 10,
                  borderRadius: size,
                  stroke: route.name === "Chats" ? "black" : "white",
                  backgroundColor: route.name === "Chats" ? "white" : variables.colors.blackLight
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
                    padding: 6,
                    borderWidth: 2,
                    borderColor: variables.colors.orange,
                  }}
                />
              </Pressable>
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
    </Animated.View>
  )
}

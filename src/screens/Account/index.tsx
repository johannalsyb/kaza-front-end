import { ActivityIndicator, Linking, Pressable, ScrollView, View, StyleSheet } from 'react-native'
import KButton from '../../components/KButton/KButton'
import useAuthentication from '../../hooks/useAuthentication'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { NavStackParamList } from '../../navigation/screens'
import variables from '../../styles/variables'
import KText from '../../components/KText'
import KIcon from '../../components/KIcon/KIcon'
import MainInfo from '../../components/Views/Account/MainInfo'
import History from '../../components/Views/Account/History'
import { useEffect, useState } from 'react'
import { parsePhone } from '../../utils/phone'
import KSideModal from '../../components/KModal/KSideModal'
import useIsMobile from '../../hooks/useIsMobile'
import { Creds } from '../../components/forms/auth/Register'
import users from '../../api/users'
import EditProperty from '../../components/Views/Account/EditProperty'
import { Api } from '../../common'
import { toastError } from '../../components/Toast/Toast'
import { useSetAtom, useAtomValue } from 'jotai'
import { showSwapNowAtom, isSideModalOpenAtom } from '../../atoms'
import UserEvent from '../../events/UserEvent'
import useConfig from '../../hooks/useConfig'
import HeaderEvent from '../../events/HeaderEvent'
import MyPlace from './MyPlace'
import { shareProperty } from '../../utils/Share'
import MenuButtons from '../../components/Screens/Account/Menu'
import EditProfileComponent from '../../components/Screens/Account/EditProfile'
import KToggle from '../../components/KToggle'
import KImage from '../../components/KImage/KImage'
import CreditsOverview from '../../screens/Credits/CreditsOverview'
import RewardProgram from '../../screens/Credits/RewardProgram'
import RewardLevelDetails from '../../screens/Credits/RewardLevelDetails'



type Props = NativeStackScreenProps<
  NavStackParamList,
  'Account' | 'Swap' | 'History' | 'Myplace'
>

let shareEvId: string | undefined = undefined

export default (props: Props) => {
  const { route } = props
  const [modal, setModal] = useState<'user' | 'property' | 'swap' | 'Myplace' | 'Credits' | null>(null)
  const { isMobile } = useIsMobile()
  const [user, setUser] = useState<{ user: Api.Users.Me; creds: Creds }>()
  // const [property, setProperty] = useState<Property>()
  const [prop, setProp] = useState<Api.Properties.PrivateProperty>()
  const [loading, setLoading] = useState(false)
  const [ueListenerId, setUeListenerId] = useState<string>()
  const setShowSwapNow = useSetAtom(showSwapNowAtom)
  const { logout, properties } = useAuthentication()
  const [creditsView, setCreditsView] = useState<'overview' | 'program' | 'level'>('overview');
  const [selectedLevel, setSelectedLevel] = useState<any | null>(null);


  const { config } = useConfig()

  // console.log('isSideModalOpenAtom', isSideModalOpenAtom)

  const [contentHeight, setContentHeight] = useState(-1)
  const [scrollViewHeight, setScrollViewHeight] = useState(-1)

  const swapId = (route.params as Readonly<{ id: string }>)?.id
  const edit = (route.params as Readonly<{ edit: boolean }>)?.edit

  const setIsSideModalOpen = useSetAtom(isSideModalOpenAtom);
  const isSideModalOpen = useAtomValue(isSideModalOpenAtom);

  useEffect(() => {
    if (!isSideModalOpen) { // Use the value, not the atom
      setModal(null);
      props.navigation.setParams({ edit: undefined });
    }
  }, [isSideModalOpen, props.navigation]);

  useEffect(() => {
    if (!prop) {
      setLoading(true)
      loadProperty().finally(() => {
        setLoading(false)
      })
    }
    if (!user) loadUser()
    if (!ueListenerId) {
      setUeListenerId(
        UserEvent.addListener('update', u => {
          loadUser()
        }),
      )
    }

    const evId = HeaderEvent.addListener("edit", (data) => {
      if (data === "user") setModal("user")
      if (data === "property") setModal("property")
    })

    return () => {
      if (ueListenerId) UserEvent.removeListener('update', ueListenerId)
      if (evId) HeaderEvent.removeListener("edit", evId)
      if (shareEvId) HeaderEvent.removeListener("share", shareEvId)
    }
  }, [])

  useEffect(() => {
    if (!ueListenerId) return // wait til first load
    props.navigation.setParams({ edit: modal ? true : undefined })
  }, [modal])

  useEffect(() => {
    if (edit && user && prop && !modal) {
      if (props.route.name === "Account") setModal("user")
      else if (props.route.name === "Myplace") setModal("Myplace")
    }

    if (prop) {
      if (shareEvId) HeaderEvent.removeListener("share", shareEvId)
      shareEvId = HeaderEvent.addListener("share", (data) => {
        if (data === "property") {
          shareProperty(`${window.location.origin}/property/${prop?.id}`)
        }
      })
    }
  }, [user, prop])

  const loadProperty = (changeHidden?: boolean) => {
    return properties.reload(changeHidden)
      .then((array) => {
        const p = array[0]
        if (!p) return
        setProp(p)
      })
      .catch(err => {
        toastError('An error occured while fetching your property')
      })
  }

  const loadUser = () => {
    return users.me
      .get()
      .then(({ data }) => Promise.all([data, parsePhone(data.phone)]))
      .then(([user, phone]) =>
        setUser({
          user,
          creds: {
            email: user!.email,
            firstName: user!.firstName,
            gender: user!.gender,
            image: user!.primaryImage,
            job: user!.job,
            hobby: user!.hobby,
            phoneVerified: user!.phoneVerified,
            emailVerified: user!.emailVerified,
            password: '',
            phone: phone || {
              code: '+1',
              number: '',
            },
            socialMedia: user!.socialMedia,
            address: user!.address,
            dateFrom: user!.dateFrom,
            dateTo: user!.dateTo,
          },
        }),
      )
  }

  const EditPropertyView = !prop ? (
    <ActivityIndicator />
  ) : (
    <EditProperty
      style={{
        width: isMobile ? '100%' : '90%',
      }}
      verified={prop.verified}
      property={{
        id: prop.id,
        location: prop.address,
        type: prop.type,
        amenities: prop.amenities != null ? prop.amenities.split(',') : [],
        petFriendly: prop.pets,
        size: prop.sizeM2,
        bathrooms: prop.bathrooms,
        bedrooms: prop.bedrooms,
        beds: prop.beds,
        bedroomsBeds: JSON.parse(prop.bedArrangements),
        pics: prop.images != null ? (prop.images as string)?.split(',') : [],
        private: !!prop.private,
        childrenAllowed: !!prop.childrenAllowed,
        smokingAllowed: !!prop.smokingAllowed,
        lat: prop.lat,
        lon: prop.lon,
      }}
      onClose={() => setModal(null)}
      onUpdated={(np) => {
        setModal(null)
        loadProperty(np.private !== prop.private ? np.private : undefined)
      }}
    />
  )

  const onEditPropertyPressed = () => {
    props.navigation.navigate('Myplace', { edit: true });
  };

  const onEditProfilePressed = () => {
    setModal('user')
    setIsSideModalOpen(true)
  }

  const isHistory = route.name === 'History' || route.name === 'Swap'

  const phoneValid =
    user &&
    user.creds.phone &&
    user.creds.phone.number &&
    user.creds.phone.number.length &&
    user.creds.phone.code
  const phone = phoneValid
    ? `${user.creds.phone.code}${user.creds.phone.number}`
    : undefined


  interface MenuItem {
    text: string;
    icon?: 'user' | 'history' | 'logout' | 'email' | 'phone' | 'chevronRight' | 'placeType' | 'creds' | 'settings' | 'pushNotifs'; // Add all valid icons
    onPress?: () => void;
    active?: boolean;
    noTrailingIcon?: boolean;
    trailingText?: string;
    trailingButton?: { text: string; onPress: () => void };
    trailingToggle?: { isOn: boolean; onToggle?: (isOn: boolean) => void };
    styles?: object;
  }

  const menu: MenuItem[] = [
    {
      text: 'My Profile',
      icon: 'user' as const,
      onPress: () => props.navigation.navigate('Account', { edit: undefined }),
      active: route.name === 'Account',
    },
    {
      text: 'Credits',
      icon: 'creds' as const,
      onPress: () => setModal('Credits'),
      active: modal === 'Credits',
    },
    {
      text: 'Swap History',
      icon: 'history' as const,
      onPress: () => props.navigation.navigate('History'),
      active: isHistory,
    },
    {
      text: 'Push Notifications',
      icon: 'pushNotifs' as const,
      onPress: () => { },
      active: isHistory,
      trailingToggle: {
        isOn: true,
      },
    },
    {
      text: user?.creds.email || 'Email',
      onPress: () => { },
      icon: 'email' as const,
      noTrailingIcon: true,
    },
    {
      text: user?.creds.phone
        ? `${user.creds.phone.code}${user.creds.phone.number}`
        : 'Phone',
      onPress: () => { },
      icon: 'phone' as const,
      noTrailingIcon: true,
    },
    {
      text: 'support@kazaswap.co',
      icon: 'history' as const,
      onPress: () => { },
      active: isHistory,
      trailingText: 'Support',
      noTrailingIcon: true,
      styles: { backgroundColor: variables.colors.lightGrey }
    },
    {
      text: 'Logout',
      icon: 'logout' as const,
      onPress: () => { },
      active: isHistory,
      noTrailingIcon: true,
      styles: { backgroundColor: variables.colors.lightGrey }
    },
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: variables.colors.white }}>
      {route.name === 'Account' && (
        <View style={{ width: '100%' }}>
          <MainInfo
            onLayout={e => {
              setContentHeight(e.nativeEvent.layout.height)
            }}
            property={prop}
            creds={user}
            onEditPropertyPressed={() => setModal('property')}
            onEditProfilePressed={() => {
              setModal('user')
              setIsSideModalOpen(true)
            }}
            onHomePressed={() => props.navigation.navigate('Home')}
          />
        </View>
      )}

      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isMobile ? variables.colors.greenLight : 'black',
        }}>
        {isMobile ?
          <></>
          : <View
            style={{
              display: 'flex',
              width: '100%',
              backgroundColor: isMobile ? variables.colors.yellow : 'black',
            }}>
            <View style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: isMobile ? variables.colors.yellow : 'white',
              flex: 1,
              display: "flex",
              flexDirection: 'row',
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: 'space-around',
            }}>
              <View style={{ flex: 1 }}></View>
              <MenuButtons navigation={props.navigation} route={route} />

              <View style={{ flex: 1, justifyContent: "flex-end", flexDirection: "row" }}>
                {route.name === "Myplace" && <>
                  <KButton
                    color="light"
                    onPress={() => setModal('property')}
                    style={{ flexDirection: 'row', borderWidth: isMobile ? 0 : 1, borderColor: variables.colors.borderGray }}
                    size={isMobile ? 'small' : 'medium'}>
                    <KIcon name="edit" size="large" />
                    {isMobile ? null : <KText>Edit property</KText>}
                  </KButton>
                </>}
              </View>
            </View>
          </View>}

        <View
          onLayout={e => {
            setScrollViewHeight(e.nativeEvent.layout.height)
          }}
          style={{
            flex: 1,
            backgroundColor: variables.colors.white,
          }}>

          {route.name === "Myplace" && <MyPlace
            onEditPropertyPressed={onEditPropertyPressed}
            onPropertyEdited={loadProperty}
            privateProperty={prop}
            id={prop?.id}
            onBackPressed={() => props.navigation.navigate("Account", { edit: undefined })}
            navigation={props.navigation}
          />}
          {isHistory && <History />}
        </View>

        {isMobile && route.name === "Account" &&
          <View style={{ backgroundColor: variables.colors.greenLight, padding: 10, }}>
            <Pressable
              style={{
                flex: 1,
                backgroundColor: variables.colors.white,
                borderRadius: 20,
                marginTop: 20,
              }}>

              {prop && (
                <View>
                  <View style={{ position: 'relative' }}>
                    {prop?.primaryImage && prop?.id &&
                      <KImage
                        imageId={`${prop?.id}/${prop?.primaryImage}`}
                        type="properties"
                        style={{ width: '100%', height: 250, objectFit: 'cover', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                        hideOnError={false}
                      />}
                  </View>
                  <View style={{ flexDirection: 'row', marginVertical: 16, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <KIcon name="location" style={{ opacity: 0.5 }} size={24} />
                      <KText style={{ fontSize: 12 }}>{prop.address.slice(0, 20) || 'Address'}</KText>
                    </View>
                    <Pressable
                      onPress={onEditPropertyPressed}
                      style={{
                        backgroundColor: variables.colors.yellow,
                        paddingHorizontal: 20, paddingVertical: 10, gap: 8, borderRadius: 50, flexDirection: 'row', alignItems: 'flex-end'
                      }} >
                      <KText>Manage my place</KText>
                    </Pressable>
                  </View>
                </View>
              )}
            </Pressable>
          </View >
        }

        {
          isMobile && route.name === "Account" && (
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                marginTop: 20,
                backgroundColor: variables.colors.greenLight,
                paddingHorizontal: isMobile ? 10 : "5%"
              }}>
              {menu.map((m, i) => {
                const buttonStyle = StyleSheet.flatten([
                  {
                    width: '100%',
                    display: m.active ? 'none' : 'flex',
                    borderWidth: 0,
                    height: 53,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    paddingLeft: 5,
                    paddingRight: 15,
                    marginBottom: 5,
                    marginTop: 5,
                  },
                  m.styles,
                ]);

                return (
                  <KButton
                    color="light"
                    text={m.text}
                    icon={m.icon}
                    onPress={m.onPress || (() => { })}
                    key={`menu_${i}`}
                    style={buttonStyle}
                  >
                    {m.icon && (
                      <KIcon
                        name={m.icon}
                        style={{ marginRight: 10, marginLeft: 10, opacity: 0.5 }}
                        size="medium"
                      />
                    )}
                    <KText style={{ flex: 1 }}>{m.text}</KText>
                    {m.trailingToggle ? (
                      <KToggle
                        isOn={m.trailingToggle.isOn}
                        onToggle={m.trailingToggle.onToggle}
                        style={{ marginLeft: 10 }}
                      />
                    ) : m.trailingButton ? (
                      <KButton
                        text={m.trailingButton.text}
                        onPress={m.trailingButton.onPress}
                        color="primary"
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          height: 30,
                        }}
                      />
                    ) : m.trailingText ? (
                      <KText
                        style={{
                          marginRight: 10,
                          marginLeft: 10,
                          color: variables.colors.grey,
                          fontSize: 14,
                        }}
                      >
                        {m.trailingText}
                      </KText>
                    ) : (
                      !m.noTrailingIcon && (
                        <KIcon
                          name="chevronRight"
                          style={{ marginRight: 10, marginLeft: 10 }}
                          size="medium"
                        />
                      )
                    )}
                  </KButton>
                );
              })}
            </View>
          )
        }
        {
          props.route.name === "Account" ? <>
            <View
              style={{
                width: '100%',
                display: isMobile && route.name !== "Account" ? "none" : 'none',
                flexDirection: isMobile ? 'column' : 'row',
                height: 53,
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 5,
                backgroundColor: variables.colors.greenLight,
              }}>
              <KButton
                icon="support"
                text={config?.emails.support || 'Contact support'}
                onPress={() => {
                  Linking.openURL(`mailto:${config?.emails.support}`)
                }}
                style={{
                  backgroundColor: variables.colors.darkYellow,
                  width: isMobile ? '100%' : 'auto',
                  display: isMobile ? 'flex' : "none",
                  paddingLeft: 5,
                  height: 53,
                  marginBottom: isMobile ? 10 : 0,
                  alignItems: 'flex-start',
                }}
                color="greenLight"
              />
              <KButton
                icon="logout"
                text="Log out"
                onPress={logout}
                style={{
                  backgroundColor: variables.colors.darkYellow,
                  width: isMobile ? '100%' : 'auto',
                  display: isMobile ? 'flex' : "none",
                  paddingLeft: 5,
                  height: 53,
                  marginBottom: isMobile ? 10 : 0,
                  alignItems: 'flex-start',
                  zIndex: 1000,
                }}
                color="greenLight"
              />
            </View>
          </> : null
        }

        <KSideModal
          visible={!!modal}
          showCross={false}
          onClose={() => setModal(null)}>
          {modal === 'user' &&
            <EditProfileComponent
              user={user}
              setUser={setUser}
              setModal={setModal}
              loadUser={loadUser}
            />}
          {modal === 'property' && EditPropertyView}
          {modal === 'Credits' && (
            <>
              {creditsView === 'overview' && (
                <CreditsOverview
                  onClose={() => setModal(null)}
                  onOpenRewardProgram={() => setCreditsView('program')}
                />
              )}

              {creditsView === 'program' && (
                <RewardProgram
                  onClose={() => setModal(null)}
                  onBack={() => setCreditsView('overview')}
                  onSelectLevel={(tier) => {
                  setSelectedLevel(tier);
                  setCreditsView('level');
                }}
                />
              )}

              {creditsView === 'level' && selectedLevel && (
                <RewardLevelDetails
                  level={selectedLevel}
                  onBack={() => setCreditsView('program')}
                  onClose={() => setModal(null)}
                />
              )}

            </>
          )}


        </KSideModal>
      </View >
    </ScrollView >
  )
}

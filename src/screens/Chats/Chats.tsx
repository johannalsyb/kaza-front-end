import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ActivityIndicator, Pressable, View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import styles from './styles'
import ChatList from './ChatList'
import swaps from '../../api/swaps'
import { timeAgo } from '../../utils'
import Menu from '../../components/Menu'
import KText from '../../components/KText'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import useConfig from '../../hooks/useConfig'
import variables from '../../styles/variables'
import KIcon from '../../components/KIcon/KIcon'
import useIsMobile from '../../hooks/useIsMobile'
import KModal from '../../components/KModal/KModal'
import SlideUpView from '../../components/SlideUpView'
import KButton from '../../components/KButton/KButton'
import MenuIcon from '../../components/Header/MenuIcon'
import ChatView from '../../components/Views/Chats/Chat'
import { SwapRequest } from '../../common/types/api/swap'
import { toastError } from '../../components/Toast/Toast'
import KSideModal from '../../components/KModal/KSideModal'
import { ChatMessage } from '../../common/types/SwapRequest'
import { NavStackParamList } from '../../navigation/screens'
import useAuthentication from '../../hooks/useAuthentication'
import ContractView from '../../components/Views/ContractView'
import Decline from '../../components/Views/SwapRequest/Decline'
import KTextInput from '../../components/Form/KTextInput/KTextInput'
import { CircleImage } from '../../components/CircleImage/CircleImage'
import VerifyAccount from '../../components/Views/SwapRequest/VerifyAccount'
import { swapRequestStatusAtom } from '../../atoms'

type Props = NativeStackScreenProps<NavStackParamList, 'Chats' | 'Chat'>
export type SwapRequestChat = {
  swapRequest: SwapRequest,
  otherUser: {
    id: string,
    image: string,
    firstName: string
  }
}

export default ({
  route,
  navigation,
}: Props) => {
  const { isMobile } = useIsMobile()
  const auth = useAuthentication()
  const user = auth.user
  const isAdmin = auth.isAdmin
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<SwapRequest[]>([])
  const [request, setRequest] = useState<SwapRequestChat | undefined>(undefined)
  const [showContractModal, setShowContractModal] = useState(false)
  const [showModal, setShowModal] = useState<React.ReactNode | undefined>(undefined)
  const [showArchive, setShowArchive] = useState(false)
  const [showChatMenuDots, setShowChatMenuDots] = useState<string | null>(null)
  const [showChatMenu, setShowChatMenu] = useState<string | null>(null)
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false)
  const [, setStatuses] = useAtom(swapRequestStatusAtom)

  const { config, overlay } = useConfig()
  const showOverlay = overlay || config?.features.chat === false
  const id = route.params?.id

  const load = (force = false) => {
    if (!id) return
    setLoading(true)
    auth.requests[force ? 'reload' : 'get']()
      .then(srs => {
        force && setRequests(srs)
        const sr = srs.find(sr => sr.id === id)
        if (sr) {
          setRequest({
            swapRequest: sr,
            otherUser: {
              id: sr.fromProperty.owner.id === user?.id ? sr.toProperty.owner.id : sr.fromProperty.owner.id,
              image: sr.fromProperty.owner.id === user?.id ? sr.toProperty.owner.primaryImage : sr.fromProperty.owner.primaryImage,
              firstName: sr.fromProperty.owner.id === user?.id ? sr.toProperty.owner.firstName : sr.fromProperty.owner.firstName,
            }
          })
          setShowArchive(sr.status === 'declined')
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (id) load(true)
  }, [id])

  useEffect(() => {
    if (user) {
      setLoading(true)
      auth.requests.get()
        .then(res => {
          setRequests(res)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user])

  const openChat = (sr: SwapRequestChat) => {
    if (request && request.swapRequest.id === sr.swapRequest.id) return
    navigation.navigate('Chat', { id: sr.swapRequest.id })
  }

  const confirmRequest = (rid: string) => {
    setLoading(true)
    swaps.requests.accept(rid)
      .then(res => {
        if (!request || (request.swapRequest.id !== rid)) return
        setRequest({
          ...request,
          swapRequest: res.data
        })
      })
      .catch(e => {
        console.error(e)
        const message =
          e.json?.data?.error ||
          e.statusText ||
          e.message ||
          'An error occured'
        toastError(message)
        if (message === 'User not verified') {
          setShowModal(
            <VerifyAccount onClicked={() => {
              setShowModal(undefined)
              setShowContractModal(false)
            }} />,
          )
        }
        // setSwapRequestStatus(prevValue)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const declineRequest = (rid: string, note: string) => {
    setLoading(true)
    swaps.requests.decline(rid, note)
      .then(res => {
        setRequests(requests.map(r => {
          if (r.id === rid) {
            r.status = 'declined'
          }
          return r
        }))
        setShowArchive(true)
        if (!request || (request.swapRequest.id !== rid)) return
        setRequest({
          ...request,
          swapRequest: res.data
        })
      })
      .catch(e => {
        console.error(e)
        const message =
          e.json?.data?.error ||
          e.statusText ||
          e.message ||
          'An error occured'
        toastError(message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onSwapRequestStatusChange = (status: 'accepted' | 'declined') => load(true)

  const ShowStatus = () => user && request ? <ContractView
    user={user}
    request={request}
    style={{ padding: 20, marginTop: isMobile ? 20 : undefined }}
    onConfirm={() => confirmRequest(request.swapRequest.id)}
    onCancel={() => setShowModal(<Decline
      swapRequest={request.swapRequest}
      onCancel={() => setShowModal(undefined)}
      onDeclined={(sr) => {
        setRequest({
          ...request,
          swapRequest: sr
        })
        setStatuses(prev => ({
          ...prev,
          [sr.toProperty]: sr.status === 'pending' ? 'none' : (sr.status)
        }))
        setShowModal(undefined)
      }}
      onError={() => {
        // setShowModal(undefined)
      }}
    />)}
    loading={loading}
    onNavigateOut={() => setShowContractModal(false)}
  /> : null

  const visibleRequests = requests.filter(r => {
    let createdYrsAgo = 0
    try {
      createdYrsAgo = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 3600 * 24 * 365)
    } catch (e) { }

    const otherUser = r.fromProperty.owner.id === user?.id ? r.toProperty.owner : r.fromProperty.owner
    const matchesSearch = search.trim().length === 0 ||
      otherUser.firstName.toLowerCase().includes(search.trim().toLowerCase())

    if (!matchesSearch) return false

    if (showArchive && (r.status === 'declined' || createdYrsAgo >= 1)) return true
    if (!showArchive && r.status !== 'declined' && createdYrsAgo < 1) return true
    return false
  }).map(r => {
    let rr = new Date(r.updatedAt).getTime()
    if (r.lastMessage) {
      try {
        const j = JSON.parse(r.lastMessage) as ChatMessage
        rr = new Date(j.at).getTime()
      } catch (err) { }
    }
    return {
      ...r,
      lastUpdateAt: rr
    }
  }).sort((a, b) => {
    return b.lastUpdateAt - a.lastUpdateAt
  })

  const emptyIcon = () => <View style={{ width: 40, height: 40 }} />

  let headerLeftComponent = <Pressable onPress={() => setShowMobileSearchBar(true)} style={styles.headerButton}>
    <KIcon name={'search'} size={'medium'} />
  </Pressable>

  useEffect(() => {
    if (!request) {
      headerLeftComponent = <Pressable onPress={() => setShowMobileSearchBar(true)} style={styles.headerButton}>
        <KIcon name={'search'} size={'medium'} />
      </Pressable>
    } else if (request) {
      headerLeftComponent = <KIcon name='back' size='medium' style={{
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
      }}
        onPress={() => navigation.navigate('Chats')} />
    }
  }, [request])

  let headerRightComponent = emptyIcon()
  if (isMobile) {
    if (request) {
      headerLeftComponent = <KIcon name='back' size='medium' style={{
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
      }}
        onPress={() => navigation.navigate('Chats')} />
    }
    if (!showArchive) {
      headerRightComponent = <KIcon name={request ? 'contract' : 'archived'} size='medium' style={{
        backgroundColor: request ? variables.colors.yellow : 'white',
        borderRadius: 50,
        padding: 10,
        flex: 1
      }}
        onPress={() => request ? setShowContractModal(true) : setShowArchive(!showArchive)} />
    } if (showArchive) {
      headerLeftComponent = <KIcon name='back' size='medium' style={{
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
      }}
        onPress={() => setShowArchive(false)} />
    } else {
      headerLeftComponent = headerLeftComponent
    }
  }

  const onMessageUpdate = (chat: SwapRequestChat, msg: ChatMessage) => {
    const req = requests.find(r => r.id === chat.swapRequest.id)
    if (!req) return
    req.lastMessage = JSON.stringify(msg)
    setRequests([...requests])
  }

  return <View style={{
    backgroundColor: isMobile ? 'white' : variables.colors.greenLight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <SlideUpView delay={0} style={{ flex: 1, width: '100%' }}>
      {isMobile ? showMobileSearchBar ? <View style={styles.header}>
        <KTextInput
          topStyle={{ margin: 0, borderWidth: 1, height: 39, width: '100%', }}
          inputStyles={{ textAlign: 'left', height: 39, marginLeft: -16 }}
          leftComponent={<KIcon name='search' size='medium' style={{ marginLeft: -3 }} />}
          rightComponent={<KIcon
            name='crossCircle'
            size='medium'
            onPress={() => {
              setSearch('')
              setShowMobileSearchBar(false)
            }}
            style={{ marginRight: -2, opacity: 0.5, stroke: 'black' }}
          />}
          value={search}
          onChangeText={text => setSearch(text)}
          autoFocus={true}
        />
      </View> :
        <Header
          route={route}
          navigation={navigation}
          options={{}}
          force={true}
          title={request ? <View style={{
            flexDirection: "row",
            alignItems: "center",
            width: '100%'
          }}>
            <CircleImage
              thumbnail={true}
              imageId={`${request.otherUser.id}/${request.otherUser.image}`}
              type="users"
              style={{ width: 44, height: 44, marginRight: 10, marginLeft: 10, marginTop: 3, borderWidth: 0 }} />
            <KText>{request.otherUser.firstName}</KText>
          </View> : (showArchive ? "Archive" : "Chat")}
          leftComponent={headerLeftComponent}
          rightComponent={headerRightComponent}
        /> : null}
      <View style={[styles.mainContainer, { padding: isMobile ? 0 : 50, }]}>
        <View style={{
          flex: 1,
          backgroundColor: variables.colors.white,
          maxWidth: isMobile ? 'auto' : 300,
          borderRadius: isMobile ? 5 : 20,
          padding: isMobile ? 10 : 20,
        }}>
          <View style={{
            display: isMobile ? 'none' : 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <KButton
              icon='chat'
              text='Chat'
              color='light'
              onPress={() => setShowArchive(false)}
              style={{ marginBottom: 10, borderWidth: 0, width: '50%', backgroundColor: showArchive ? 'transparent' : variables.colors.greenLight }} />
            <KButton
              icon='archived'
              text='Archived'
              color='light'
              onPress={() => setShowArchive(true)}
              style={{ marginBottom: 10, borderWidth: 0, width: '50%', backgroundColor: showArchive ? variables.colors.greenLight : 'transparent' }} />
          </View>
          <ChatList
            visibleRequests={visibleRequests}
            user={user}
            id={id}
            isMobile={isMobile}
            showArchive={showArchive}
            showChatMenuDots={showChatMenuDots}
            setShowChatMenuDots={setShowChatMenuDots}
            showChatMenu={showChatMenu}
            setShowChatMenu={setShowChatMenu}
            openChat={openChat}
            confirmRequest={confirmRequest}
            declineRequest={declineRequest}
            timeAgo={timeAgo}
          />
        </View>
        {!isMobile ?
          <>
            <View style={{
              flex: 1,
              borderRadius: 20,
              backgroundColor: 'white',
              marginLeft: 20,
              marginRight: 20,
              display: 'flex',
              flexDirection: 'column',
              padding: 20,
              justifyContent: 'center'
            }}>{loading ? <ActivityIndicator /> :
              !user || (requests && !requests.length) ?
                <View style={{ flex: 1, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                  <KIcon name='chat' size='xxlarge' style={styles.chatIcon} />
                  <KText style={{ fontSize: 25, fontWeight: 'bold', marginTop: 20, marginBottom: 20 }}>
                    {user ? 'Chat is empty' : 'Please login to see your chats'}
                  </KText>
                  {user ?
                    <>
                      <KText style={{ maxWidth: isMobile ? '60%' : '25%', textAlign: 'center', lineHeight: 20 }}>
                        Start exploring for Swap
                      </KText>
                      <KButton text='Explore' color='primary' onPress={() => {
                        navigation.navigate('Home')
                      }} style={{ marginTop: 20 }} />
                    </>
                    : (!isMobile ? <View style={styles.signinContainer}>
                      <KButton text='Sign in' color={isMobile ? 'greenLight' : 'light'} onPress={() => {
                        navigation.navigate('Login')
                      }} style={{
                        borderColor: !isMobile ? 'black' : 'white',
                        borderWidth: 1,
                        marginRight: 10,
                      }} />
                      <KButton text='Register' color='primary' onPress={() => {
                        navigation.navigate('SignUp')
                      }} />
                    </View> : null)}
                </View> :
                !request ?
                  <View style={{ alignItems: 'center' }}>
                    <KIcon name='chat' size='xxlarge' style={{ stroke: 'black' }} />
                    <KText style={{
                      textAlign: 'center',
                      padding: 20
                    }}>Select a request to start chatting</KText>
                  </View>
                  :
                  <ChatView
                    request={request}
                    onSwapRequestStatusChange={onSwapRequestStatusChange}
                    onMessageUpdate={(msg) => onMessageUpdate(request, msg)}
                  />
              }
            </View>
            <View style={{
              maxWidth: 320,
              borderRadius: 20,
              backgroundColor: 'white',
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              display: 'flex',
            }}>
              {request ? ShowStatus() : null}
            </View>
          </> : <>
            {request ? <View style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 1000,
              backgroundColor: 'white',
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 20,
            }}>
              <ChatView
                request={request}
                onSwapRequestStatusChange={onSwapRequestStatusChange}
                onMessageUpdate={msg => onMessageUpdate(request, msg)}
              />
            </View>
              : null}

          </>}
      </View>
      <Footer route={navigation.getState().routes[0].name} />
      {/* } */}
      {isMobile && !request ? <Menu navigate={navigation.navigate} /> : null}
      {
        isMobile && user && request ? <KSideModal visible={showContractModal} onClose={() => setShowContractModal(false)}>
          {ShowStatus()}
        </KSideModal> : null
      }
      {
        user && request ? <KModal visible={!!showModal} setVisibility={() => setShowModal(undefined)}>
          {showModal}
        </KModal> : null
      }

      {
        (showOverlay && (!user || !isAdmin)) && <View style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          //@ts-ignore
          backdropFilter: 'blur(10px)',
          //@ts-ignore
          webkitBackdropFilter: 'blur(10px)'
        }}>
          <View style={{ backgroundColor: variables.colors.darkYellow, padding: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center', alignContent: 'center', top: 10 }}>
            <KIcon name='logoText2' size={150} />
            <KText style={{ color: 'black', textAlign: 'center' }}>{overlay || 'Coming soon 🚀'}</KText>
          </View>
        </View>
      }
    </SlideUpView >
  </View>
}

import React from 'react'
import { ScrollView, View, Pressable } from 'react-native'

import styles from './styles'
import KText from '../../components/KText'
import variables from '../../styles/variables'
import KIcon from '../../components/KIcon/KIcon'
import ChatMenu from '../../components/Views/Chats/ChatMenu'
import { ChatMessage } from '../../common/types/SwapRequest'
import { CircleImage } from '../../components/CircleImage/CircleImage'

type Props = {
	visibleRequests: any[]
	user: any
	id: string | undefined
	isMobile: boolean
	showArchive: boolean
	showChatMenuDots: string | null
	setShowChatMenuDots: (id: string | null) => void
	showChatMenu: string | null
	setShowChatMenu: (id: string | null) => void
	openChat: (params: any) => void
	confirmRequest: (id: string) => void
	declineRequest: (id: string, note: string) => void
	timeAgo: (time: number) => string | undefined
}

const ChatList: React.FC<Props> = ({
	visibleRequests,
	user,
	id,
	isMobile,
	showArchive,
	showChatMenuDots,
	setShowChatMenuDots,
	showChatMenu,
	setShowChatMenu,
	openChat,
	confirmRequest,
	declineRequest,
	timeAgo,
}) => (
	<ScrollView showsVerticalScrollIndicator={false}>
		{visibleRequests.length ? visibleRequests.map((request, i) => {
			const otherUser = request.fromProperty.owner?.id === user?.id ? request.toProperty.owner : request.fromProperty.owner
			const otherUserImage = otherUser.primaryImage && otherUser.primaryImage.length ? otherUser.primaryImage : (
				otherUser.images && otherUser.images.length ? (otherUser.images as string).split(',')[0] : ''
			)
			const lastMessage = request.lastMessage && request.lastMessage.length ? JSON.parse(request.lastMessage) as ChatMessage : null
			const lastMessageTimeAgo = lastMessage ? timeAgo(typeof lastMessage.at === 'string' ? new Date(lastMessage.at).getTime() : lastMessage.at) : null
			const backgroundColor = `${request?.id === id ? variables.colors.yellow : variables.colors.greenLight}${showChatMenuDots === request.id ? 'aa' : 'ff'}`
			return <View
				style={[styles.chatItem, {
					marginBottom: isMobile ? 5 : 10,
					borderRadius: isMobile ? 10 : 20,
					backgroundColor,
					zIndex: showChatMenu !== request?.id ? -1 : 0,
				}]}
				key={`request-${i}`}>
				{request.newMessage ? <KText style={styles.bubble}>1</KText> : null}
				<Pressable
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'center',
						flex: 1,
					}}
					onHoverIn={showArchive ? undefined : () => setShowChatMenuDots(request?.id)}
					onHoverOut={showArchive ? undefined : () => setShowChatMenuDots(null)}
					onPress={() => {
						openChat({
							swapRequest: request,
							otherUser: {
								id: otherUser?.id,
								image: otherUserImage,
								firstName: otherUser.firstName
							}
						})
					}}>
					<CircleImage
						thumbnail={true}
						imageId={`${otherUser?.id}/${otherUserImage}`}
						type='users'
						style={{ width: 40, height: 40, marginRight: 10 }} />
					<View style={{
						flexDirection: 'column'
					}}>
						<KText>{otherUser.firstName}
							{lastMessage ? <KText style={{
								opacity: 0.4,
								fontSize: 10,
								marginLeft: 10
							}}>
								{lastMessageTimeAgo}
							</KText>
								: null}
						</KText>
						{request.status === 'pending' ?
							lastMessage ? <KText style={{
								opacity: 0.6,
								fontSize: 11,
								marginTop: 5
							}}>
								{lastMessage.message.length > 20 ? lastMessage.message.substring(0, 20) + '...' : lastMessage.message}
							</KText>
								: null
							: <KText style={{
								opacity: 0.6,
								fontSize: 11,
								marginTop: 5
							}}>
								Request {request.status === 'declined' ? 'Declined' : 'Accepted'}
							</KText>}
					</View>
				</Pressable>

				{request.status === 'pending' && !showArchive && (isMobile || showChatMenuDots === request?.id) ? <Pressable
					style={{ height: '100%', justifyContent: 'center' }}
					onPress={showArchive ? undefined : () => setShowChatMenu(request?.id)}
					onHoverIn={showArchive ? undefined : () => setShowChatMenuDots(request?.id)}
					onHoverOut={showArchive ? undefined : () => setShowChatMenuDots(null)}
				>
					<KIcon name='more' size='medium' style={{ transform: 'rotate(90deg)', opacity: 0.5 }} />
				</Pressable> : null}
				<ChatMenu
					show={request.status === 'pending' && showChatMenu === request?.id}
					setShow={(b) => setShowChatMenu(b ? request?.id : null)}
					onAccept={() => confirmRequest(request?.id)}
					onDecline={() => declineRequest(request?.id, 'Declined')}
				/>
			</View>
		}) : <View style={{ alignItems: 'center' }}>
			<KIcon name='smile' size='xxlarge' style={{ stroke: 'black' }} />
			<KText style={{ alignSelf: 'center' }}>{showArchive ? 'No archived chats' : 'No chats in inbox'}</KText>
		</View>}
	</ScrollView>
)

export default ChatList

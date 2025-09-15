import { ActivityIndicator, FlatList, View, Pressable, StyleSheet, TextInput } from 'react-native'
import KText from '../../KText'
import { useEffect, useState } from 'react'
import swapsApi from '../../../api/swaps'
import { Api } from '../../../common'
import variables from '../../../styles/variables'
import KIcon from '../../KIcon/KIcon'
import KButton from '../../KButton/KButton'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { NavStackParamList } from '../../../navigation/screens'
import useAuthentication from '../../../hooks/useAuthentication'
import useIsMobile from '../../../hooks/useIsMobile'
import KImage from '../../KImage/KImage'
import KTimer from '../../KTimer'
import OldSwapsList, { formatDateRange } from './OldSwaps'
import KModalWeb from '../../KModal/KModalWeb'
import StarRating from '../../StarRating/StarRating'
import FutureSwapList from './FutureSwaps'

const filters = ['Old Swaps', 'Current Swaps', 'Future Swaps']

const mockData = {
	currentSwap: {
		owner: 'Elke',
		ownerImage: 'https://picsum.photos/200/200',
		location: 'Lisbon, Portugal',
		checkoutTime: '15 Sep 2025, 6:00 PM',
	},
	oldSwaps: [
		{
			id: '1',
			ownerFirstName: 'Alice',
			ownerLastName: 'Johnson',
			ownerImage: 'https://picsum.photos/200/200',
			location: 'Paris, France',
			dateFrom: '2025-08-12',
			dateTo: '2025-08-20',
			isReviewed: false,
		},
		{
			id: '2',
			ownerFirstName: 'Marco',
			ownerLastName: 'Santos',
			ownerImage: 'https://picsum.photos/200/200',
			location: 'Lisbon, Portugal',
			dateFrom: '2025-06-01',
			dateTo: '2025-06-10',
			isReviewed: true,
		}
	],

	futureSwaps: [
		{
			id: '1',
			ownerFirstName: 'Alice',
			ownerLastName: 'Johnson',
			ownerImage: 'https://picsum.photos/200/200',
			location: 'Paris, France',
			dateFrom: '2025-08-12',
			dateTo: '2025-08-20',
		},
		{
			id: '2',
			ownerFirstName: 'Marco',
			ownerLastName: 'Santos',
			ownerImage: 'https://picsum.photos/200/200',
			location: 'Lisbon, Portugal',
			dateFrom: '2025-06-01',
			dateTo: '2025-06-10',
		}
	]
}

export default () => {
	const [loading, setLoading] = useState<boolean>(false)
	const [swaps, setSwaps] = useState<Api.Swaps.Swap[]>()
	const { user } = useAuthentication()
	const navigation = useNavigation<NativeStackNavigationProp<NavStackParamList, 'Account' | 'Swap', undefined>>()
	const route = useRoute()
	//@ts-ignore
	const swapId = route.params?.id
	const [modal, setModal] = useState<boolean>(!!swapId)
	const { isMobile } = useIsMobile()

	const [selectedFilter, setSelectedFilter] = useState<string>('Old Swaps')
	const [showReviewModal, setShowReviewModal] = useState(false)
	const [selectedSwap, setSelectedSwap] = useState<any>(null)
	const { colors } = variables
	const [headingWidth, setHeadingWidth] = useState(0);

	useEffect(() => {
		if (!swapId) return
		setModal(true)
	}, [swapId])

	const load = (filter: string) => {
		setLoading(true)
		swapsApi.swaps
			.all()
			.then((r) => {
				setSwaps(r.data)
			})
			.catch((e) => {
				console.error(e)
				setSwaps([])
			})
			.finally(() => {
				setLoading(false)
			})
	}

	useEffect(() => {
		load(selectedFilter)
	}, [selectedFilter])

	if (!user) return <KText>You must be logged in to view this page</KText>

	const renderContent = () => {
		if (selectedFilter === 'Current Swaps') {
			return (
				<View style={{ backgroundColor: colors.greenLight, margin: 10, borderRadius: 20, paddingBottom: 10 }}>
					<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10 }}>
						<View style={{ borderWidth: 4, borderColor: colors.white, backgroundColor: colors.white, borderRadius: 100 }}>
							<KImage
								source={mockData?.currentSwap?.ownerImage}
								style={{
									objectFit: "cover",
									borderRadius: 100,
									width: 60,
									height: 60,
									backgroundColor: colors.white,
								}}
							/>
						</View>
						<View style={{ display: 'flex', marginTop: 8, flex: 1, marginLeft: 12 }}>
							<KText style={{ fontSize: 15, fontWeight: '500', letterSpacing: -0.5 }}>You are staying at {mockData?.currentSwap?.owner}'s place</KText>
							<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
								<KIcon name='location' size={20} style={{ stroke: colors.black, marginRight: 4, opacity: 0.5 }} />
								<KText style={{ fontSize: 12, fontWeight: '400', letterSpacing: -0.5, opacity: 0.5 }}>{mockData?.currentSwap?.location}</KText>
							</View>
						</View>
						<KIcon name='chat' size={30} style={{ stroke: colors.yellow, backgroundColor: colors.black, padding: 6, borderRadius: 100 }} onPress={() => console.log("functionality is yet to be implemented")} />
					</View>
					<View style={{ padding: 10 }}>
						<KTimer titleText='Time Remaining Before Checkout' targetDate={mockData?.currentSwap?.checkoutTime} />
					</View>
					<KButton text='Early check-out' color='primary' style={{ width: 160, alignSelf: 'center' }} onPress={() => console.log("functionality is yet to be implemented")} />
				</View>
			)
		} else if (selectedFilter === 'Old Swaps') {
			return <>
				<KModalWeb
					isMobile={isMobile}
					clearFilters={() => null}
					confirmText='Publish'
					visible={showReviewModal}
					setVisibility={() => setShowReviewModal(false)}
					isActionsVisible  = {true}
					style={{ backgroundColor: variables.colors.white, padding: 20 }}
				>
					{selectedSwap ? (
						<View style={{ width: '100%'}}>
							<View style={{ backgroundColor: colors.yellow, width: 34, height: 3, alignSelf: 'center', marginTop: -20, marginBottom: 12 }} ></View>
							<KText style={{ fontSize: 25, fontWeight: '600', letterSpacing: -0.5, alignSelf: 'center' }}>
								Swap Review
							</KText>
							<View
								style={{
									padding: 10,
									borderRadius: 20,
									marginTop: 20,
									flexDirection: 'row',
									alignItems: 'flex-start',
									justifyContent: 'space-between',
									backgroundColor: colors.greenLight,
								}}>
								<View style={{ borderWidth: 2, borderColor: colors.white, borderRadius: 100 }}>
									<KImage
										source={selectedSwap.ownerImage}
										style={{
											objectFit: 'cover',
											borderRadius: 100,
											width: 60,
											height: 60,
											backgroundColor: colors.white,
										}}
									/>
								</View>
								<View style={{ marginTop: 0, flex: 1, marginLeft: 12 }}>
									<KText style={{ fontSize: 15, fontWeight: '400', letterSpacing: -0.5 }}>
										{selectedSwap.ownerFirstName} {selectedSwap.ownerLastName}
									</KText>
									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
										<KIcon name="location" size={20} style={{ stroke: colors.black, marginRight: 4, opacity: 0.5 }} />
										<KText style={{ fontSize: 12, fontWeight: '400', letterSpacing: -0.5, opacity: 0.5 }}>
											{selectedSwap.location}
										</KText>
									</View>
									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
										<KIcon name="calendar" size={20} style={{ stroke: colors.black, marginRight: 4, opacity: 0.5 }} />
										<KText style={{ fontSize: 12, fontWeight: '400', letterSpacing: -0.5, opacity: 0.5 }}>
											{formatDateRange(selectedSwap.dateFrom, selectedSwap.dateTo)}
										</KText>
									</View>
								</View>

							</View>
							
							<View style={{ marginTop: 30, width: "100%" }}>
								<KText
									style={{
										fontFamily:"Plus Jakarta Sans",
										fontStyle:"normal",
										lineHeight:13,
										letterSpacing:-0.5,
										fontSize: 13,
										fontWeight: "600",
										marginBottom: 4,
										alignSelf: "flex-start",

									}}
									onLayout={(e) => setHeadingWidth(e.nativeEvent.layout.width)}
								>
									Stars
								</KText>

								<View style={{ marginLeft: headingWidth || 0 }}>
									<StarRating
										maxStars={5}
										size={34}
										color={colors.yellow}
										onChange={(val) => console.log("Selected rating:", val)}
									/>
								</View>
							</View>

							<View style={{ marginTop: 30, width: '100%' }}>
								<KText
									style={{
										fontFamily: 'Plus Jakarta Sans',
										fontStyle: 'normal',
										lineHeight: 13,
										letterSpacing: -0.5,
										fontSize: 13,
										fontWeight: '600',
										marginBottom: 4,
										alignSelf: 'flex-start',
									}}
								>
									Message
								</KText>

								<View
									style={{
										padding: 15,
										borderRadius: 20,
										backgroundColor: '#fff',
										elevation: 3,
										borderColor:"#C6C5BA",
										borderWidth: 1,
										borderStyle:"solid",
									}}
								>
									<TextInput
										style={{
											minHeight: 100,
											fontSize: 14,
											lineHeight: 20,
											color: '#000',
											textAlignVertical: 'top',
											opacity: 0.5,
											padding: 0,
											...( { outlineStyle: 'none' } as any )
										}}
										placeholder="Write your review..."
										placeholderTextColor="#999"
										multiline
									/>
								</View>
							</View>

						</View>
					) : null}
				</KModalWeb>
				<OldSwapsList
					data={mockData?.oldSwaps}
					onReview={(swap) => {
						setSelectedSwap(swap)
						setShowReviewModal(true)
					}}
				/>
			</>
		} else if (selectedFilter === 'Future Swaps') {
			return <>
			<FutureSwapList
			data={mockData?.futureSwaps} />
			</>

		} else return null
	}

	return (
		<View style={{ flex: 1, }}>
			<FlatList
				data={filters}
				horizontal
				keyExtractor={(item) => item}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ padding: 10, gap: 8 }}
				renderItem={({ item }) => {
					const isSelected = item === selectedFilter
					return (
						<Pressable onPress={() => setSelectedFilter(item)} style={[styles.filterButton, isSelected ? styles.selectedFilterButton : {}]}>
							<KText style={[styles.filterButtonText, isSelected ? styles.selectedFilterButtonText : {}]}>
								{item}
							</KText>
						</Pressable>
					)
				}}
			/>
			{loading ? (
				<ActivityIndicator size='large' color={colors.yellow} style={{ marginTop: 20 }} />
			) : (
				<>
					{!swaps?.length ?
						<View style={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: 20,
						}}>
							<View style={{ padding: 30, borderRadius: 500, backgroundColor: colors.greenLight }}>
								<KIcon name='credsLight' size={70} style={{ opacity: 0.5 }} />
							</View>
							<KText style={{ fontSize: 12, fontWeight: '400', marginTop: 20, marginBottom: isMobile ? '54%' : 40, opacity: 0.5, width: '70%', textAlign: 'center' }}>You don’t have any current swap. Find out your next Swap!</KText>
							<KButton text='Discover your next swap' color='primary' style={{ width: isMobile ? '100%' : '20%' }} onPress={() => navigation.navigate('Home')} />
						</View>
						:
						(renderContent())
					}
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	filterButton: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: variables.colors.grey,
		backgroundColor: 'transparent',
		height: 38,
		width: 140,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedFilterButton: {
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: variables.colors.yellow,
		backgroundColor: variables.colors.yellow,
	},
	filterButtonText: {
		fontSize: 13,
		fontWeight: '600',
		opacity: 0.5,
	},
	selectedFilterButtonText: {
		opacity: 1,
	}
})

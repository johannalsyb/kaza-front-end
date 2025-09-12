import { FlatList, View } from "react-native"
import { OldSwapsListProps } from "../../../common/types/SwapRequest"
import variables from "../../../styles/variables"
import KImage from "../../KImage/KImage"
import KText from "../../KText"
import KIcon from "../../KIcon/KIcon"
import KButton from "../../KButton/KButton"


export const formatDateRange = (dateFrom: string, dateTo: string) => {
	const from = new Date(dateFrom)
	const to = new Date(dateTo)

	const optionsFrom: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }
	const optionsTo: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }

	const fromStr = from.toLocaleDateString("en-GB", optionsFrom)
	const toStr = to.toLocaleDateString("en-GB", optionsTo)

	return `${fromStr} - ${toStr}`
}

const OldSwapsList = ({ data, onReview }: OldSwapsListProps) => {
	const { colors } = variables

	const renderItem = ({ item }: any) => (
		<View style={{ backgroundColor: item.isReviewed ? colors.greenLight : colors.yellow, margin: 10, borderRadius: 20, paddingBottom: 10 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 10 }}>
				<View style={{ borderWidth: 4, borderColor: colors.white, borderRadius: 100 }}>
					<KImage
						source={item.ownerImage}
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
						{item.ownerFirstName} {item.ownerLastName}
					</KText>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
						<KIcon name="location" size={20} style={{ stroke: colors.black, marginRight: 4, opacity: 0.5 }} />
						<KText style={{ fontSize: 12, fontWeight: '400', letterSpacing: -0.5, opacity: 0.5 }}>
							{item.location}
						</KText>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
						<KIcon name="calendar" size={20} style={{ stroke: colors.black, marginRight: 4, opacity: 0.5 }} />
						<KText style={{ fontSize: 12, fontWeight: '400', letterSpacing: -0.5, opacity: 0.5 }}>
							{formatDateRange(item.dateFrom, item.dateTo)}
						</KText>
					</View>
				</View>

				<KIcon
					name="contract"
					size={30}
					style={{ stroke: colors.yellow, backgroundColor: colors.black, padding: 6, borderRadius: 100 }}
					onPress={() => console.log('Contract pressed')}
				/>
			</View>

			<View
				style={{
					borderWidth: item.isReviewed ? 1 : 0,
					borderColor: colors.lightGray,
					borderRadius: 20,
					alignSelf: 'center',
					flexDirection: 'column',
					padding: 10,
					gap: 20,
					backgroundColor: variables.colors.white,
				}}
			>
				{!item.isReviewed ? (
					<>
						<View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
							<KText style={{ fontSize: 11, fontWeight: '500', letterSpacing: -0.5, opacity: 0.5 }}>You can </KText>
							<KText style={{ fontSize: 11, fontWeight: '500', letterSpacing: -0.5 }}>Review Your Swap</KText>
						</View>
						<View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
							<KButton
								text="Cancel"
								icon="crossCircle"
								iconPosition="left"
								iconStyle={{ opacity: 0.5, height: 20, width: 20 }}
								color="greenLight"
								style={{ width: 160 }}
								onPress={() => console.log('Cancel pressed')}
							/>
							<KButton
								text="Review"
								icon="review"
								iconPosition="left"
								iconStyle={{ color: colors.yellow, height: 20, width: 20 }}
								color="primary"
								style={{ width: 160 }}
								onPress={() => onReview?.(item)}
							/>
						</View>
					</>
				) : (
					<View style={{
						borderRadius: 20,
						alignSelf: 'center',
						flexDirection: 'column',
						padding: 10,
						minWidth: 350,
						backgroundColor: variables.colors.white,
					}}>
						<KText style={{ textAlign: 'center', fontSize: 13, opacity: 0.6 }}>Thank you!</KText>
						<KText style={{ textAlign: 'center', fontSize: 13, opacity: 0.6 }}>You have already left your Swap Review.</KText>
					</View>
				)}
			</View>
		</View>
	)
	return (
		<FlatList
			data={data}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			contentContainerStyle={{ paddingBottom: 20 }}
		/>
	)
}

export default OldSwapsList
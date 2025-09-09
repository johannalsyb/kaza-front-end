import { TextStyle, View, StyleSheet, Pressable, Animated } from "react-native"
import FormField from "../../Form/FormField/FormField"
import KTextInput from "../../Form/KTextInput/KTextInput"
import variables from "../../../styles/variables"
import KIcon from "../../KIcon/KIcon"
import { useEffect, useState } from "react"
import KButton from "../../KButton/KButton"
import CheckBox from "../../CheckBox/CheckBox"
import { Property } from "."
import KText from "../../KText"
import KNumberInput from "../../Form/KNumberInput/KNumberInput"
import useIsMobile from '../../../hooks/useIsMobile';

const inputStyles: TextStyle = {
	textAlign: "left",
	height: variables.button.size.medium.height,


}

type Props = {
	onChange: (property: Property) => void,
	property: Property,
}

const amenities = [
	// Place
	'Garden',
	'Balcony',
	'Terrace',
	'Ground floor',
	'Rooftop',
	// Temp control
	'Heating',
	'A/C',
	//Kitchen
	'Refrigerator',
	'Coffee machine',
	'Microwave',
	'Oven',
	'Barbecue',
	'Dishwasher',
	// Clothes
	'Iron',
	'Washing machine',
	'Dryer',
	'Closet space',
	// Stuff
	'Crib',
	'Hair dryer',
	'TV',
	'Fireplace',
	'Desk',
	'Wi-Fi',
	// Outside
	'Parking spot',
	'Jacuzzi',
	'Swimming pool',
	'Wheelchair accessible',
];

export default (props: Props) => {
	const [property, setProperty] = useState<Property>(props.property);
	const [showAllAmenities, setShowAllAmenities] = useState(false);
	const { isMobile } = useIsMobile();
	const initialAmenitiesCount = Math.ceil(amenities.length / 2);

	const displayedAmenities =
		isMobile || showAllAmenities
			? amenities
			: amenities.slice(0, initialAmenitiesCount);

	return (
		<View style={{ paddingHorizontal: isMobile ? 20 : 0 }}>

			<FormField
				labelAlign="left"
				label="What do you want to swap?"
				style={{
					height: isMobile ? 140 : 'auto',
					paddingTop: isMobile ? 10 : 10,
				}}
				gapBeforeChildren={false}
				gapAfterChildren={false}>
				<View style={[styles.container, styles.containerSwap]}>
					<KButton
						style={{
							...styles.button,
							...(isMobile && styles.buttonMobile),
						}}
						color={property.type === 'room' ? 'primary' : 'light'}
						text="Room"
						onPress={() => setProperty({ ...property, type: 'room' })}
					/>
					<KButton
						style={{
							...styles.button,
							...(isMobile && styles.buttonMobile),
						}}
						color={property.type === 'flat' ? 'primary' : 'light'}
						text="Flat"
						onPress={() => setProperty({ ...property, type: 'flat' })}
					/>
					<KButton
						style={{
							...styles.button,
							...(isMobile && styles.buttonMobile),
						}}
						color={property.type === 'studio' ? 'primary' : 'light'}
						text="Studio"
						onPress={() => setProperty({ ...property, type: 'studio' })}
					/>
					<KButton
						style={{
							...styles.button,
							...(isMobile && styles.buttonMobile),
						}}
						color={property.type === 'house' ? 'primary' : 'light'}
						text="House"
						onPress={() => setProperty({ ...property, type: 'house' })}
					/>
				</View>
			</FormField>

			<FormField label="How many square metres is your space?"
				gapAfterChildren={false}
				gapBeforeChildren={false}
			>
				<KTextInput
					leftComponent={<KIcon name="sqm2" size="medium" />}
					rightComponent={<KText>m²</KText>}
					placeholder="Size"
					value={(props.property.size === 0 ? "" : props.property.size) + ""}
					keyboardType="numeric"
					inputMode="decimal"
					onChangeText={size => {
						if (size === "") return props.onChange({ ...props.property, size: 0 })
						const nb = parseInt(size)
						if (isNaN(nb)) return
						if (nb < 0) return
						if (nb > 10000) return
						props.onChange({ ...props.property, size: nb })
					}}


					inputStyles={inputStyles} />

			</FormField>

			{/* how many bedrooms */}
			<FormField
				labelAlign="left"
				label="How many bedroom(s)?"
				style={{ marginTop: 20 }}
				gapAfterChildren={false}
				gapBeforeChildren={false}
			>
				<KNumberInput
					inputStyles={inputStyles}
					topStyle={inputStyles}
					min={0}
					max={20}
					value={props.property.bedrooms + ""}
					onChange={n => props.onChange({ ...props.property, bedrooms: n as number })} />
			</FormField>

			{/* How many beds */}
			<FormField
				labelAlign="left"
				label="How many beds?"
				style={{ marginTop: 20 }}
				gapAfterChildren={false}
				gapBeforeChildren={false}
			>
				{new Array(props.property.bedrooms).fill(undefined).map((bedroom, i) => {
					if (props.property.bedroomsBeds.length < i + 1) props.property.bedroomsBeds.push({ single: 0, double: 0 })
					const bb = props.property.bedroomsBeds[i]
					return <View key={`br_${i}`} >
						<KText style={{
							marginBottom: 12,
							maxWidth: 69,
							textAlign: 'left',
							borderRadius: 20,
							paddingBottom: 4
						}}>Room {i + 1}</KText>
						<View style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
						}}>
							<FormField labelAlign="left" label={
								<KText style={{ fontSize: 15, fontWeight: "500", opacity: 0.5 }}>

									Single
								</KText>
							}
								gapAfterChildren={false}
								gapBeforeChildren={false}
								style={{ flex: 1 }}

							>
								<KNumberInput
									inputStyles={inputStyles}
									topStyle={inputStyles}
									min={0}
									max={20}
									value={bb.single + ""}
									onChange={n => {
										bb.single = n as number
										props.onChange({
											...props.property,
											bedroomsBeds: [...props.property.bedroomsBeds]
										})
									}} />
							</FormField>

							<FormField labelAlign="left" label={
								<KText style={{ fontSize: 15, fontWeight: "500", opacity: 0.5 }}>
									Double
								</KText>
							}
								gapAfterChildren={false}
								gapBeforeChildren={false}
								style={{ flex: 1, marginLeft: 10 }}
							>
								<KNumberInput
									inputStyles={inputStyles}
									topStyle={inputStyles}
									min={0}
									max={20}
									value={bb.double + ""}
									onChange={n => {
										bb.double = n as number
										props.onChange({
											...props.property,
											bedroomsBeds: [...props.property.bedroomsBeds]
										})
									}} />
							</FormField>
						</View>
					</View>
				})}
			</FormField>

			{/* How many bathrooms */}
			<FormField labelAlign="left" label="How many bathroom(s)?"
				style={{ marginTop: 20 }}
			>
				<KNumberInput
					inputStyles={inputStyles}
					topStyle={inputStyles}
					min={0}
					max={20}
					value={props.property.bathrooms + ""}
					onChange={n => props.onChange({ ...props.property, bathrooms: n as number })} />
			</FormField>

			{/* amenities */}
			<FormField
				labelAlign="left"
				label="Add some amenities (3 minimum)"
				style={{ paddingTop: isMobile ? 15 : 10, marginBottom: 0 }}
				gapBeforeChildren={false}
				gapAfterChildren={false}>
				<View style={[styles.container, { rowGap: 15, marginTop: 0 }]}>
					{displayedAmenities.map((amenity, i) => {
						return (
							<CheckBox
								key={i}
								style={{ maxWidth: 150, width: '100%' }}
								name={amenity}
								checked={property.amenities.includes(amenity)}
								onPress={() => {
									const ams = property.amenities.includes(amenity)
										? property.amenities.filter(a => a !== amenity)
										: [...property.amenities, amenity];
									setProperty({ ...property, amenities: ams });
								}}
							/>
						);
					})}
				</View>
				{!isMobile && (
					<Pressable
						onPress={() => setShowAllAmenities(!showAllAmenities)}
						style={styles.showMoreButton}>
						<KText style={styles.showMoreText}>
							{showAllAmenities ? 'Show less' : 'Show more'}
						</KText>
						<Animated.View
							style={{
								transform: [
									{
										rotate: showAllAmenities ? '180deg' : '0deg',
									},
								],
								opacity: 0.7,
							}}>
							<KIcon name="down" size={'large'} style={{ color: 'black' }} />
						</Animated.View>
					</Pressable>
				)}
			</FormField>

		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},
	containerSwap: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	containerAmenities: {
		gap: 40,
	},
	button: {
		borderRadius: 20,
		fontSize: variables.font.size.normal,
		letterSpacing: -0.5,
		maxWidth: 94,
		width: '100%',
		height: 94,
	},
	buttonMobile: {
		maxWidth: '48%',
		height: 45,
	},
	labelText: {
		color: '#000',
		fontFamily: 'Plus Jakarta Sans',
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: '600',
		lineHeight: 13,
		letterSpacing: -0.5,
	},
	incorrectAddressBox: {
		backgroundColor: '#FF784E',
		position: 'relative',

		marginTop: -12,
		alignItems: 'center',

		borderRadius: 28,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 8,
		paddingRight: 5,
	},
	incorectaddressMessage: {
		textAlign: 'center',
		fontWeight: '400',
		lineHeight: 16,
		letterSpacing: -0.4,
		color: '#18181DF5',
	},
	icon: {
		borderRadius: 36,
		border: '1px solid rgba(0, 0, 0, 0.20)',
		background: '#FFF',
		padding: 7,
		backgroundColor: variables.colors.white,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 15,
		lineHeight: 20,
	},
	text: {
		fontSize: 12,
		lineHeight: 16,
		maxWidth: 300,
	},
	showMoreButton: {
		width: '100%',
		maxWidth: 115,
		marginTop: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignSelf: 'flex-start',
		cursor: 'pointer',
		gap: 4,
	},
	showMoreText: {
		color: variables.colors.black,
		fontWeight: '500',
		textDecorationLine: 'underline',
		textDecorationColor: '#979090ff',
	},
});

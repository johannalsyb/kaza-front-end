import { v4 as uuidv4 } from 'uuid'
import React, { useEffect, useState } from 'react'
import { ScrollView, View, ViewStyle, Pressable, TouchableOpacity, Text } from 'react-native'

import KButton from '../../KButton/KButton'
import { toastError } from '../../Toast/Toast'
import properties from '../../../api/properties'
import Property from '../../../common/types/Property'
import KText from '../../KText'
import variables from '../../../styles/variables'
import useIsMobile from '../../../hooks/useIsMobile'
import KIcon from '../../KIcon/KIcon'
import DatePicker from '../../DatePicker'
import { DropdownHandle } from '../../Dropdown/Dropdown'
import KSideModal from '../../KModal/KSideModal'

type Props = {
	propertyId?: string,
	style?: ViewStyle,
	verified?: boolean,
	onClose?: () => void,
	onUpdated: (u: Property) => void,
}

export type Handle = {
	setSearch: (search: string) => void
	clearFilters: () => void
}

interface Propss {
	date: Date | null
	placeholder?: string
	fontSize?: number
}

interface AvailableSlot {
	id: string
	dateFrom: string
	dateTo: string
}

export default (props: Props) => {

	const { isMobile } = useIsMobile()
	const marginVertical = isMobile ? 10 : 20

	const [loading, setLoading] = useState(false)
	const [loadingSlots, setLoadingSlots] = useState(false)
	const flatFilterRef = React.createRef<DropdownHandle>()
	const brFilterRef = React.createRef<DropdownHandle>()
	const [showDateModal, setShowDateModal] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)

	// State for slots with proper typing
	const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])

	// For editing slots
	const [editingSlot, setEditingSlot] = useState<AvailableSlot | null>(null)

	// Load property slots when propertyId changes
	useEffect(() => {
		if (!props.propertyId) return

		const loadProperty = async () => {
			setLoadingSlots(true)
			try {
				const res = await properties.get(props.propertyId!)
				console.log('Property data:', res) // Debug log

				// Handle the response properly - it might be wrapped in a data property
				const property = res.data || res
				console.log('Property: ', property)

				// Convert string dates to proper format if needed
				const slots = property.availableSlots || []
				console.log('Slots from API:', slots) // Debug log

				const formattedSlots: AvailableSlot[] = slots.map((slot: any) => ({
					id: slot.id || uuidv4(),
					dateFrom: slot.dateFrom,
					dateTo: slot.dateTo
				}))

				setAvailableSlots(formattedSlots)
			} catch (err) {
				console.error('Failed to load property', err)
				toastError('Failed to load property data')
			} finally {
				setLoadingSlots(false)
			}
		}

		loadProperty()
	}, [props.propertyId])

	// Add new slot
	const handleAddSlot = async () => {
		if (!startDate || !endDate) {
			toastError('Please select both start and end dates')
			return
		}

		// Validate date range
		if (startDate >= endDate) {
			toastError('Start date must be before end date')
			return
		}

		const newSlot: AvailableSlot = {
			id: uuidv4(),
			dateFrom: startDate.toISOString(),
			dateTo: endDate.toISOString(),
		}

		setAvailableSlots(prev => [...prev, newSlot])
		try {
			const updateData = {
				id: props.propertyId,
				availableSlots: [...availableSlots, newSlot], // Include the new slot
			}
			console.log('Adding slot, sending to backend:', updateData)
			await properties.update(updateData)
			console.log('Slot added successfully')
		} catch (err) {
			console.error('Failed to add slot', err)
			toastError('Failed to add slot')
			// Optionally revert the local state if the API call fails
			setAvailableSlots((prev) => prev.filter((slot) => slot.id !== newSlot.id))
		}
		setShowDateModal(false)
		setStartDate(null)
		setEndDate(null)
	}

	// Edit existing slot
	const handleEditSlot = (slot: AvailableSlot) => {
		setEditingSlot(slot)
		setStartDate(new Date(slot.dateFrom))
		setEndDate(new Date(slot.dateTo))
		setShowDateModal(true)
	}

	// Update slot after editing
	const handleUpdateSlot = async () => {
		if (!startDate || !endDate || !editingSlot) {
			toastError('Please select both start and end dates')
			return
		}

		if (startDate >= endDate) {
			toastError('Start date must be before end date')
			return
		}

		const updatedSlot: AvailableSlot = {
			...editingSlot,
			dateFrom: startDate.toISOString(),
			dateTo: endDate.toISOString(),
		}

		setAvailableSlots(prev =>
			prev.map(slot => slot.id === editingSlot.id ? updatedSlot : slot)
		)

		try {
			const updateData = {
				id: props.propertyId,
				availableSlots: availableSlots.map((slot) =>
					slot.id === editingSlot.id ? updatedSlot : slot
				),
			}
			console.log('Updating slot, sending to backend:', updateData)
			await properties.update(updateData)
			console.log('Slot updated successfully')
		} catch (err) {
			console.error('Failed to update slot', err)
			toastError('Failed to update slot')
			// Optionally revert the local state if the API call fails
			setAvailableSlots((prev) => [...prev]) // Revert to previous state
		}

		setShowDateModal(false)
		setEditingSlot(null)
		setStartDate(null)
		setEndDate(null)
	}

	// Delete slot
	const handleDeleteSlot = async (id: string) => {
		const updatedSlots = availableSlots.filter((s) => s.id !== id)
		setAvailableSlots(updatedSlots)

		// Save to backend
		try {
			const updateData = {
				id: props.propertyId,
				availableSlots: updatedSlots,
			}
			console.log('Deleting slot, sending to backend:', updateData)
			await properties.update(updateData)
			console.log('Slot deleted successfully')
		} catch (err) {
			console.error('Failed to delete slot', err)
			toastError('Failed to delete slot')
			// Revert local state if the API call fails
			setAvailableSlots(availableSlots)
		}
	}
	// Save changes to backend
	const handleSave = async () => {
		if (!props.propertyId) {
			toastError('No property ID provided')
			return
		}

		setLoading(true)
		try {
			console.log('Saving slots:', availableSlots) // Debug log
			const updateData = {
				id: props.propertyId,
				availableSlots: availableSlots
			}
			const updated = await properties.update(updateData)
			console.log('Update response:', updated) // Debug log

			// Handle the response properly
			const updatedProperty = updated.data || updated
			props.onUpdated(updatedProperty)
			props.onClose?.()
		} catch (err) {
			console.error('Failed to update property', err)
			toastError('Failed to save changes')
		} finally {
			setLoading(false)
		}
	}

	// Cancel and revert changes
	const handleCancel = () => {
		// Reload original data
		if (props.propertyId) {
			properties.get(props.propertyId).then(res => {
				const property = res.data || res
				const slots = property.availableSlots || []
				const formattedSlots: AvailableSlot[] = slots.map((slot: any) => ({
					id: slot.id || uuidv4(),
					dateFrom: slot.dateFrom,
					dateTo: slot.dateTo
				}))
				setAvailableSlots(formattedSlots)
			}).catch(err => {
				console.error('Failed to reload property', err)
			})
		}
		props.onClose?.()
	}

	const FormattedDateWithFadedYear: React.FC<Propss> = ({
		date,
		placeholder = 'Select Date',
		fontSize = 14,
	}) => {
		if (!date) {
			return <Text style={{ fontSize, opacity: 0.5 }}>{placeholder}</Text>
		}

		const month = date.toLocaleDateString('en-US', { month: 'short' })
		const day = date.toLocaleDateString('en-US', { day: 'numeric' })
		const year = date.getFullYear()

		return (
			<Text style={{ fontSize }}>
				{month} {day},{' '}
				<Text style={{ opacity: 0.5 }}>{year}</Text>
			</Text>
		)
	}

	const formatDateRange = (dateFrom: string, dateTo: string) => {
		const from = new Date(dateFrom)
		const to = new Date(dateTo)

		const fromMonth = from.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()
		const fromDay = from.getDate()
		const fromYear = from.getFullYear()
		const toMonth = to.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()
		const toDay = to.getDate()
		const toYear = to.getFullYear()

		const capitalizedFromMonth = fromMonth.charAt(0).toUpperCase() + fromMonth.slice(1)
		const capitalizedToMonth = toMonth.charAt(0).toUpperCase() + toMonth.slice(1)

		if (capitalizedFromMonth === capitalizedToMonth && fromYear === toYear) {
			return (
				<Text style={{ fontSize: 16 }}>
					{capitalizedFromMonth} {fromDay} - {capitalizedToMonth} {toDay} {' '}
					<Text style={{ opacity: 0.5, paddingLeft: 5 }}>{fromYear}</Text>
				</Text>
			)
		} else if (fromYear === toYear) {
			return (
				<Text style={{ fontSize: 16 }}>
					{capitalizedFromMonth} {fromDay} - {capitalizedToMonth} {toDay},{' '}
					<Text style={{ opacity: 0.5 }}>{fromYear}</Text>
				</Text>
			)
		} else {
			return (
				<Text style={{ fontSize: 16 }}>
					{capitalizedFromMonth} {fromDay},{' '}
					<Text style={{ opacity: 0.5 }}>{fromYear}</Text>{' '}
					- {capitalizedToMonth} {toDay},{' '}
					<Text style={{ opacity: 0.5 }}>{toYear}</Text>
				</Text>
			)
		}
	}

	return (
		<View style={[props.style, { flex: 1, width: '100%' }]}>
			<View
				style={[
					{
						backgroundColor: variables.colors.lightGrey,
						borderRadius: isMobile ? 0 : 20,
						borderBottomRightRadius: 23,
						borderBottomLeftRadius: 23,
						marginRight: isMobile ? 0 : 20,
						marginBottom: isMobile ? 0 : marginVertical,
						paddingTop: 60,
						paddingBottom: 20,
						paddingHorizontal: 20,
						justifyContent: 'center',
						flexDirection: 'column',
						width: isMobile ? '100%' : 'auto',
						maxWidth: isMobile ? undefined : 900,
					},
					!isMobile && { alignItems: 'center' },
				]}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}>
					<KIcon
						name='backArrow'
						size={'large'}
						style={{
							width: 40,
							height: 40,
							backgroundColor: 'white',
							borderRadius: 100,
						}}
						onPress={props.onClose}
					/>
					<KText style={{ fontSize: 17, fontWeight: '400' }}>
						Edit My Calendar
					</KText>
					<View style={{ width: 40, height: 40 }} />
				</View>
			</View>

			<View style={{ paddingHorizontal: 20 }}>
				<KText style={{ fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 10 }}>
					List of Available dates
				</KText>
			</View>

			{/* CONTENT AREA */}
			<View style={{ flex: 1 }}>
				{loadingSlots ? (
					<View style={{ alignItems: 'center', marginTop: 20 }}>
						<KText>Loading slots...</KText>
					</View>
				) : availableSlots.length === 0 ? (
					<View style={{ alignItems: 'center', marginTop: 20 }}>
						<KText style={{ opacity: 0.6 }}>No available slots yet. Add some below!</KText>
					</View>
				) : (
					<ScrollView style={{ paddingHorizontal: 20 }}>
						{availableSlots.map((slot) => (
							<View key={slot.id} style={{
								flexDirection: 'row',
								alignItems: 'center',
								borderWidth: 1,
								borderColor: variables.colors.grey,
								borderRadius: 50,
								paddingVertical: 12,
								paddingHorizontal: 15,
								marginVertical: 6,
								backgroundColor: 'white'
							}}>

								{/* Edit button */}
								<Pressable
									onPress={() => handleEditSlot(slot)}
									style={{ marginRight: 10 }}
								>
									<KIcon
										name='edit'
										style={{
											borderRadius: 100,
											padding: 7,
											backgroundColor: variables.colors.black,
											stroke: variables.colors.yellow
										}}
										size='medium'
									/>
								</Pressable>


								<KText style={{ flex: 1, fontSize: 16 }}>
									{formatDateRange(slot.dateFrom, slot.dateTo)}
								</KText>


								{/* Delete button */}
								<Pressable onPress={() => handleDeleteSlot(slot.id)}>
									<KIcon
										name='delete'
										style={{
											borderRadius: 100,
											padding: 7,
											backgroundColor: variables.colors.lightGrey,
										}}
										size='medium'
									/>
								</Pressable>
							</View>
						))}
					</ScrollView>
				)}

				{/* Add slot button */}
				<View style={{
					marginTop: 20,
					paddingHorizontal: 20,
					justifyContent: 'center',
					alignSelf: 'center',
					flexDirection: 'row'
				}}>
					<Pressable
						onPress={() => {
							setEditingSlot(null)
							setStartDate(null)
							setEndDate(null)
							setShowDateModal(true)
						}}
						disabled={loading}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: variables.colors.greenLight,
							paddingHorizontal: 40,
							paddingVertical: 10,
							borderRadius: 40,
						}}
					>
						<KIcon
							name='plusCircle'
							style={{ stroke: variables.colors.grey, marginRight: 8 }}
							size={'medium'}
						/>
						<KText style={{ color: 'black', fontWeight: '500' }}>Add slots</KText>
					</Pressable>
				</View>
			</View>

			{/* FIXED BUTTONS */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingHorizontal: 20,
					marginTop: 'auto',
					marginBottom: 20,
				}}>
				<KButton
					color='greenLight'
					text='Cancel'
					disabled={loading}
					onPress={handleCancel}
				/>
				<KButton
					text='Save Changes'
					loading={loading}
					disabled={loading}
					onPress={handleSave}
				/>
			</View>

			{/* Modal for adding/editing slots */}
			<KSideModal
				// isMobile={true}
				showCross={false}
				visible={showDateModal}
				onClose={() => {
					setShowDateModal(false)
					setEditingSlot(null)
					setStartDate(null)
					setEndDate(null)
				}}
				// clearFilters={clearFilters}
				style={{ backgroundColor: variables.colors.white, flex: 1 }}
			// hideButtons={true}
			>
				<View style={{ flex: 1, width: '100%' }}>
					<View style={{ width: 40, height: 2, backgroundColor: variables.colors.yellow, alignSelf: 'center' }}></View>
					<Text style={{
						fontFamily: 'Plus Jakarta Sans',
						fontWeight: '600',
						fontSize: 22,
						lineHeight: 25,
						letterSpacing: -0.5,
						textAlign: 'center',
						marginTop: 5,
						marginBottom: 17
					}}>
						{editingSlot ? 'Edit Slot' : 'Add more slots'}
					</Text>
					<Text
						style={{
							paddingHorizontal: 24,
							marginBottom: 4,
							fontSize: 13,
							fontWeight: '500',
							fontFamily: 'Plus Jakarta Sans',
							color: variables.colors.black,
							opacity: 0.5
						}}
					>
						Select the dates
					</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						style={{
							borderWidth: 1,
							borderRadius: 30,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							paddingVertical: 4.5,
							paddingHorizontal: 20,
							alignSelf: 'center',
							minWidth: '90%',
							justifyContent: 'center',
							borderColor: variables.colors.borderGray,
						}}
						onPress={() => { console.log('Date range selector pressed') }}
					>
						<View
							style={{
								flex: 1,
								gap: 10,
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
								paddingLeft: 20,
							}}
						>
							<FormattedDateWithFadedYear date={startDate} placeholder='Start Date' fontSize={16} />
							<Text style={{ fontSize: 14, opacity: 0.5 }}>-</Text>
							<FormattedDateWithFadedYear date={endDate} placeholder='End Date' fontSize={16} />
						</View>
						<KIcon name={'down'} size={30} style={{ opacity: 0.5 }} />
					</TouchableOpacity>
					{/* Calendar */}
					<View style={{}}>
						<DatePicker
							isOpen
							isRange
							isMobile={isMobile}
							startDate={startDate}
							endDate={endDate}
							onRangeSelected={(startDate: Date | null, endDate: Date | null) => {
								setStartDate(startDate)
								setEndDate(endDate)
							}}
						/>
					</View>
					{/* Buttons */}
					<View style={{
						flexDirection: 'row', gap: 10, marginTop: 20,
						position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20
					}}>
						<Pressable
							onPress={() => {
								setShowDateModal(false)
								setEditingSlot(null)
								setStartDate(null)
								setEndDate(null)
							}}
							style={{
								flex: 1,
								backgroundColor: variables.colors.lightGrey,
								paddingVertical: 14,
								borderRadius: 30,
								alignItems: 'center'
							}}
						>
							<KText style={{}}>Cancel</KText>
						</Pressable>
						<Pressable
							onPress={() => {
								console.log('Confirm button pressed, editingSlot:', editingSlot)
								editingSlot ? handleUpdateSlot() : handleAddSlot()
							}}
							disabled={!startDate || !endDate}
							style={{
								flex: 1,
								backgroundColor: (!startDate || !endDate) ?
									variables.colors.black : variables.colors.black,
								paddingVertical: 14,
								borderRadius: 30,
								alignItems: 'center'
							}}
						>
							<KText style={{
								fontWeight: '600',
								color: variables.colors.yellow,
								opacity: (!startDate || !endDate) ? 0.5 : 1
							}}>
								{editingSlot ? 'Update' : 'Confirm'}
							</KText>
						</Pressable>
					</View>
				</View>
			</KSideModal>
		</View>
	)
}

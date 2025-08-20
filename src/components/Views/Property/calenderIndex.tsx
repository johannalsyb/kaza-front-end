import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';

import KButton from '../../../components/KButton/KButton';

import ListAvailbleDates from './ListAvailableDates';
// import KSideModal from '../../../KModal/KSideModal'
import KSideModal from '../../../components/KModal/KSideModal';
import KCalendar from '../../../components/KCalendar';
import SelectDates from '../../Screens/Onboarding/CalendarComponent/SelectDates';
import dayjs from 'dayjs';
import {useAtom, useSetAtom} from 'jotai';
import {avilebleDatesAtom, showModalCalendarAtom} from '../../../atoms';
import useIsMobile from '../../../hooks/useIsMobile';
//
import variables from '../../../styles/variables';

import KText from '../../../components/KText/index';
import KIcon from '../../../components/KIcon/KIcon';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type Props = {
	autoOpenCalendar?: boolean;
	initialHostDates?: [Date, Date] | null;
};

const CalendarComponent = (props: Props) => {
	const [availableDates, setAvailableDates] = useAtom(avilebleDatesAtom);
	const [isOpenCalendar, setIsOpenCalendar] = useState(
		props.autoOpenCalendar ?? false,
	);
	const [value, onChange] = useState<Value>([new Date(), new Date()]);
const setShowCalendarModal = useSetAtom(showModalCalendarAtom);
	const [calendarSelectedDateRange, setCalendarSelectedDateRange] =
		useState<Value>([new Date(), new Date()]);

	// seed preferred dates by host if provided
	useEffect(() => {
		if (props.initialHostDates && Array.isArray(props.initialHostDates)) {
			const [start, end] = props.initialHostDates
			setAvailableDates((prev: any[]) => {
				const exists = prev.some((d: any) =>
					Array.isArray(d.value) && d.value[0] && d.value[1] &&
					new Date(d.value[0]).getTime() === new Date(start).getTime() &&
					new Date(d.value[1]).getTime() === new Date(end).getTime()
				)
				return exists ? prev : [{ id: Date.now(), value: [start, end], readonly: true }, ...prev]
			})
		}
	}, [props.initialHostDates, setAvailableDates])

	const handleClickAddSlots = () => {
		setAvailableDates([
			{id: availableDates.length + 1, value},
			...availableDates,
		]);
		adjustRangeIfBlocked(value as [Date, Date]);
		setIsOpenCalendar(false);
		setCalendarSelectedDateRange([new Date(), new Date()]);
	};

	const isDateInRanges = (date: Date) => {
		return availableDates.some((item: any) => {
			if (!Array.isArray(item.value) || item.value.length < 2) return false;
			const start = new Date(item.value[0]);
			const end = new Date(item.value[1]);
			const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
			const s = new Date(
				start.getFullYear(),
				start.getMonth(),
				start.getDate(),
			);
			const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
			return d >= s && d <= e;
		});
	};

	const adjustRangeIfBlocked = (range: [Date, Date]) => {
		for (const item of availableDates) {
			if (!Array.isArray(item.value) || item.value.length < 2) continue;
			const blockedStart = new Date(item.value[0]);
			const blockedEnd = new Date(item.value[1]);
			// Якщо діапазони перетинаються
			if (range[0] <= blockedEnd && range[1] >= blockedStart) {
				const newStart = dayjs(blockedEnd).add(1, 'day').toDate();
				const newEnd = dayjs(newStart).add(6, 'day').toDate();
				onChange([newStart, newEnd]);
				return true;
			}
		}
		return false;
	};

	const handleChange = (val: Value) => {
		if (Array.isArray(val) && val[0] && val[1]) {
			if (adjustRangeIfBlocked([val[0], val[1]])) {
				return;
			}
		}
		onChange(val);
		setCalendarSelectedDateRange(val);
	};

	const [itemEdit, setItemEdit] = useState<any>(undefined);
	const handleClickEdit = (item: any) => {
		// console.log('availableDates', availableDates, item)
		setIsOpenCalendar(true);
		let updateItems = availableDates.filter((i: any) => i.id !== item.id);

		setAvailableDates(updateItems);
		onChange(item.value);
		setCalendarSelectedDateRange(item.value);
		setIsOpenCalendar(true);
		setItemEdit(item);
	};
	const {isMobile} = useIsMobile();
	useEffect(() => {
		if (Array.isArray(value) && value[0] && value[1]) {
			adjustRangeIfBlocked([value[0], value[1]]);
		}
	}, [availableDates]);

	useEffect(() => {
		if (!isOpenCalendar) {
			setCalendarSelectedDateRange([new Date(), new Date()]);
		}
	}, [isOpenCalendar]);
	return (
		<>
			{/* Backdrop to darken background while calendar overlay is shown */}
			<Pressable
				onPress={() => setShowCalendarModal(false)}
				style={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: 'rgba(0,0,0,0.5)',
					zIndex: 3332,
				}}
			/>
			<View
				style={{
					position: 'absolute',
					width: '100%',
					maxWidth: 550,
					margin: 'auto',
					alignItems:"center",
					justifyContent:'center',
					paddingHorizontal: 'auto',	
					zIndex: 3333,
					top: isMobile ? undefined : 5,
					bottom: isMobile ? 0 : undefined,
					left: 0,
					right: 0,
					marginBottom: isMobile? 84 :0,
				}}>
				
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{
						backgroundColor: variables.colors.white,
						width: isMobile ? '100%' : 496,
						// borderTopLeftRadius: isMobile ? 15 : 20,
						// borderTopRightRadius: isMobile ? 15 : 20,
						borderRadius: 20,
						...(!isMobile && {
								shadowColor: '#C6C5BA',
								shadowOffset: {width: 0, height: 2},
								shadowOpacity: 0.25,
								shadowRadius: 4,
								elevation: 5,
							}),
							// ...(props.style || {})
					}}
					contentContainerStyle={{
						flex: 1,
						flexDirection: 'row',
						flexWrap: 'wrap',
						justifyContent: 'space-around',
						paddingTop: isMobile ? 16 :0,
						paddingHorizontal: isMobile ? 16 : 30,
						paddingBottom: 'auto',
						
						//   ...(props.contentContainerStyle || {})
					}}>
				 
				<ListAvailbleDates
					items={availableDates}
					setItems={setAvailableDates}
					onPressEdit={handleClickEdit}
				/>
				<KSideModal
					visible={isOpenCalendar}
					onClose={() => {
						setIsOpenCalendar(false);
						Boolean(itemEdit) &&
							setAvailableDates([...availableDates, itemEdit]);
					}}
					showCross={!isMobile}
					position={isMobile ? 'bottom' : 'right'}
					style={
						isMobile
							? {
									height: 'auto',
									position: 'absolute',
									bottom: 0,
									width: '100%',
									paddingTop: 23,
									paddingBottom: 50,
									borderTopLeftRadius: 28,
									borderTopRightRadius: 28,
									
							  }
							: {
									// maxWidth: 500,
									// left: '81%'
								  }
					}>
					<View style={[styles.container, styles.calendarContainer]}>
						<KText
							style={{textAlign: 'center', fontSize: 25, fontWeight: '600'}}>
							Dates
						</KText>
						<SelectDates
							style={{marginBottom: 46}}
							startDate={
								Array.isArray(calendarSelectedDateRange)
									? calendarSelectedDateRange[0]
									: new Date()
							}
							endDate={
								Array.isArray(calendarSelectedDateRange)
									? calendarSelectedDateRange[1]
									: new Date()
							}
						/>
						<KCalendar
							onChange={handleChange}
							value={calendarSelectedDateRange}
							minDate={new Date()}
							tileDisabled={({date, view}) =>
								view === 'month' && isDateInRanges(date)
							}
						/>

						<View style={styles.containerButtons}>
							<KButton
								text="Cancel"
								onPress={() => {
									setIsOpenCalendar(false);
									Boolean(itemEdit) &&
										setAvailableDates([...availableDates, itemEdit]);
								}}
								color="light"
								style={{width: '100%', flex: 1}}
							/>
							<KButton
								text="Confirm"
								onPress={() => handleClickAddSlots()}
								color="primary"
								style={{width: '100%', flex: 1}}
							/>
						</View>
					</View>
				</KSideModal>
				<View
					style={{
						// display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						gap: 10,
						margin: 'auto',
						// paddingTop: 60,
						paddingBottom: 40,
						marginTop:  isMobile ? 61 : 15
					}}>
					<KButton
						text="Suggest a date"
						onPress={() => setIsOpenCalendar(true)}
						color="primary"
						style={{width: '100%'}}
						disabled={availableDates?.length === 3}
					/>
					<KButton
						text="back"
						//   loading={loading}
						//   disabled={loading || !isValid(props.property)}
					 	onPress={() => {
							setShowCalendarModal(false);
							}}
						color="greenLight"
						style={{width: '100%'}}
					/>
				</View>
				</ScrollView>
			</View>
		</>
	);
};

export default CalendarComponent;

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	label: {
		color: '#000',
		fontSize: 15,
		opacity: 0.5,
		marginBottom: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 30,
		height: 50,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	button: {
		backgroundColor: variables.colors.lightCream,
		display: 'flex',
		flexDirection: 'row',
		width: 'auto',
		marginTop: 10,
		borderWidth: 0,
		paddingHorizontal: 40,
		paddingVertical: 8,
	},
	calendarContainer: {
		alignItems: 'center',
		paddingHorizontal: 50,
		height: '100%',
	},
	containerButtons: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginTop: 80,
		columnGap: 23,
	},
});

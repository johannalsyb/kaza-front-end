import dayjs from 'dayjs';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import KButton from '../../../components/KButton/KButton';
import ListAvailbleDates from './ListAvailableDates';
import KSideModal from '../../../components/KModal/KSideModal';
import KCalendar from '../../../components/KCalendar';
import SelectDates from '../../Screens/Onboarding/CalendarComponent/SelectDates';
import { showModalCalendarAtom } from '../../../atoms';
import useIsMobile from '../../../hooks/useIsMobile';
import variables from '../../../styles/variables';
import KText from '../../../components/KText/index';
import AvalibleSlot from './DateSlot';
import KModal from '../../KModal/KModal';
import SwapRequestButton from '../../SwapRequestButton/SwapRequestButton';
import { Property } from '../../../common/types/api/properties';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type Props = {
	property: Property;
	autoOpenCalendar?: boolean;
	initialHostDates?: [Date, Date] | null;
};

const CalendarComponent = (props: Props) => {
	const [availableDates, setAvailableDates] = useState<any>([]);
	const [selectedDate, setSelectedDate] = useState<any>(null);
	const [isCustomDate, setIsCustomDate] = useState(false);
	const [isOpenCalendar, setIsOpenCalendar] = useState(props.autoOpenCalendar ?? false);
	const [value, onChange] = useState<Value>([new Date(), new Date()]);
	const [showCalendarModal, setShowCalendarModal] = useAtom(showModalCalendarAtom)
	const [calendarSelectedDateRange, setCalendarSelectedDateRange] = useState<Value>([new Date(), new Date()])

	useEffect(() => console.log("selectedDate: ", selectedDate), [selectedDate]);
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
		console.log("Value: ", value)
		// setAvailableDates([
		// 	{ id: availableDates.length + 1, value },
		// 	...availableDates,
		// ]);
		adjustRangeIfBlocked(value as [Date, Date]);
		setIsOpenCalendar(false);
		setCalendarSelectedDateRange([new Date(), new Date()]);
		setSelectedDate({ id: availableDates.length + 1, value })
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
		setIsOpenCalendar(true);
		let updateItems = availableDates.filter((i: any) => i.id !== item.id);

		setAvailableDates(updateItems);
		onChange(item.value);
		setCalendarSelectedDateRange(item.value);
		setIsOpenCalendar(true);
		setItemEdit(item);
	};
	const { isMobile } = useIsMobile();
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

	let params = {
		dateFrom: selectedDate?.value[0],
		dateTo: selectedDate?.value[1],
		isCustomDate: isCustomDate,
	}

	return (
		<>
			{showCalendarModal && <KModal
				visible={showCalendarModal ? true : false}
				setVisibility={() => setShowCalendarModal(false)}
				showCross={isMobile ? false : true}
				style={{
					width: '100%',
					left: 0,
					right: 0,
					top: isMobile ? undefined : 84,
					bottom: isMobile ? 0 : undefined,
					position: 'absolute',
					marginBottom: 0,
					borderEndEndRadius: isMobile ? 0 : undefined,
					borderEndStartRadius: isMobile ? 0 : undefined,
					backgroundColor: variables.colors.white,
				}}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{
						backgroundColor: variables.colors.white,
						width: isMobile ? '100%' : 496,
						borderRadius: 20,
						...(!isMobile && {
							shadowColor: '#C6C5BA',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 5,
						}),
					}}
					contentContainerStyle={{
						flex: 1,
						flexDirection: 'column',
						flexWrap: 'wrap',
						justifyContent: 'space-around',
						paddingTop: isMobile ? 16 : 0,
					}}>
					{isMobile && <View style={styles.divider} />}
					{selectedDate ?
						<>
							<KText
								style={[
									styles.label,
									{
										fontSize: isMobile ? 25 : 20,
										fontWeight: isMobile ? '600' : '500',
										marginBottom: 20,
										backgroundColor: isMobile ? '' : variables.colors.lightCream,
									},
								]}>
								List of available dates
							</KText>
							<View style={{ paddingHorizontal: isMobile ? 16 : 30, }}>
								<AvalibleSlot
									dates={selectedDate}
									onPress={() => null}
									selected={true}
								/>
								{!isMobile && <View style={styles.availablelistDatesdivider} />}
							</View>
						</>
						:
						<ListAvailbleDates
							items={availableDates}
							selectedDate={selectedDate}
							setSelectedDate={setSelectedDate}
						/>
					}
					<View
						style={{
							display: 'flex',
							flexDirection: selectedDate ? 'row-reverse' : 'column',
							justifyContent: 'space-between',
							width: '100%',
							gap: 10,
							paddingHorizontal: isMobile ? 16 : 30,
							paddingBottom: 40,
							marginTop: isMobile ? 61 : 15,
						}}>
						{/* <KButton
							text={selectedDate ? "Send Request" : "Suggest a date"}
							onPress={selectedDate ? () => {
								sendSwapRequest({
									dateFrom: selectedDate.value[0],
									dateTo: selectedDate.value[1],
									isCustomDate: isCustomDate,
								})
								setShowCalendarModal(false)
							} : () => setIsOpenCalendar(true)}
							color="primary"
							style={{ width: selectedDate ? '45%' : '100%' }}
						/> */}
						{selectedDate ? <SwapRequestButton
							property={props.property}
							params={params}
							hideIcon
						/>
							:
							<KButton
								text={"Suggest a date"}
								onPress={() => setIsOpenCalendar(true)}
								color="primary"
								style={{ width: selectedDate ? '45%' : '100%' }}
							/>
						}
						<KButton
							text="Back"
							onPress={() => {
								setShowCalendarModal(false);
							}}
							color="greenLight"
							style={{ width: selectedDate ? '45%' : '100%' }}
						/>
					</View>
				</ScrollView>
			</KModal>}
			{isOpenCalendar && <KSideModal
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
							paddingHorizontal: 16,
							borderTopLeftRadius: 28,
							borderTopRightRadius: 28,
						}
						: {
							// maxWidth: 500,
							// left: '81%'
						}
				}>
				<View style={[styles.container, styles.calendarContainer]}>
					{isMobile && <View style={styles.divider} />}
					<KText
						style={{ textAlign: 'center', fontSize: 25, fontWeight: '600' }}>
						Dates
					</KText>
					<SelectDates
						style={{ marginBottom: 46 }}
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
						tileDisabled={({ date, view }) =>
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
							style={{ width: '100%', flex: 1 }}
						/>
						<KButton
							text="Confirm"
							onPress={() => {
								handleClickAddSlots()
								setIsCustomDate(true)
							}}
							color="primary"
							style={{ width: '100%', flex: 1 }}
						/>
					</View>
				</View>
			</KSideModal>}
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
	divider: {
		width: 34,
		margin: 'auto',
		height: 2,
		borderRadius: 20,
		backgroundColor: '#FFE361',
		marginTop: 10,
		marginBottom: 10,
	},
	label: {
		alignItems: 'center',
		width: '100%',
		textAlign: 'center',
		flex: 1,
		margin: 'auto',
		lineHeight: 13,
		letterSpacing: -0.5,
		paddingVertical: 20,
		borderEndEndRadius: 28,
		borderEndStartRadius: 28
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
	availablelistDatesdivider: {
		width: '100%',
		margin: 'auto',
		height: 1,
		marginVertical: 26,
		borderRadius: 20,
		backgroundColor: '#C6C5BA',
		marginTop: 10,
		marginBottom: 10,
	},
});

import dayjs from 'dayjs';
import { Pressable, StyleSheet } from 'react-native';

import KIcon from '../../../components/KIcon/KIcon';
import KText from '../../../components/KText/index';
import variables from '../../../styles/variables';

export interface IDateSlot {
	dates: any;
	onPress: (range: any) => void;
	selected?: boolean;
}

const range = (item: any) => {
	if (!item || !item.value || !item.value[0] || !item.value[1]) return '';
	return `${dayjs(item.value[0]).format('MMM DD')} - ${dayjs(
		item.value[1],
	).format('MMM DD')}`;
};

const DateSlot = ({ dates, onPress, selected }: IDateSlot) => {
	console.log("DATES: ", dates);
	return (
		<Pressable
			style={[
				styles.dateContainer,
				{ backgroundColor: selected ? variables.colors.yellow : variables.colors.white },
			]}
			onPress={() => onPress(dates)}
		>
			<KIcon
				name="calendar"
				size="medium"
				style={{ opacity: 0.5 }}
			/>
			<KText style={{ color: '#000', fontSize: 15 }}>
				{range(dates)}
				<KText style={{ color: 'rgba(0,0,0,0.5)', marginLeft: 16 }}>
					{dates?.value?.[1] ? dayjs(dates.value[1]).format('YYYY') : ''}
				</KText>
			</KText>
			<KIcon
				onPress={() => { }}
				name="calendar"
				size="medium"
				style={{ display: 'none' }}
			/>
		</Pressable>
	);
};

export default DateSlot;

const styles = StyleSheet.create({
	dateContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: variables.colors.lightGray,
		paddingHorizontal: 20,
		alignItems: 'center',
		paddingVertical: 17,
		borderRadius: 20,
		borderWidth: 1,
	},
});

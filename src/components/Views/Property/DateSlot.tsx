import { Pressable, StyleSheet } from 'react-native';

import KIcon from '../../../components/KIcon/KIcon';
import KText from '../../../components/KText/index';
import variables from '../../../styles/variables';

export interface IAvalibleSlot {
	range: string;
	year: string;
	onPress: (range: string, year: string) => void;
	selected?: boolean;
}

const AvalibleSlot = ({ range, year, onPress, selected }: IAvalibleSlot) => {
	return (
		<Pressable
			style={[
				styles.dateContainer,
				{ backgroundColor: selected ? variables.colors.yellow : variables.colors.white },
			]}
			onPress={() => onPress(range, year)}
		>
			<KIcon
				name="calendar"
				size="medium"
				style={{ opacity: 0.5 }}
			/>
			<KText style={{ color: '#000', fontSize: 15 }}>
				{range}
				<KText style={{ color: 'rgba(0,0,0,0.5)', marginLeft: 16 }}>
					{year}
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

export default AvalibleSlot;

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

import { StyleSheet } from 'react-native';
import variables from '../../styles/variables';

const styles = StyleSheet.create({
	header: {
		paddingTop: 48,
		paddingBottom: 16,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		borderBottomEndRadius: 30,
		borderBottomStartRadius: 30,
		justifyContent: 'space-between',
		backgroundColor: variables.colors.greenLight,
	},
	headerButton: {
		padding: 8,
		borderRadius: 100,
		backgroundColor: variables.colors.white
	},
	title: {
		color: variables.colors.black,
		textAlign: "center",
		fontFamily: "Plus Jakarta Sans",
		fontSize: 17,
		fontweight: "500",
		lineHeight: 17,
		letterSpacing: -0.5,
	},
	mainContainer: {
		display: "flex",
		flexDirection: "row",
		flex: 1,
		width: "100%",
	},
	chatIcon: {
		stroke: 'black',
		backgroundColor: 'white',
		borderRadius: 100,
		padding: 10,
	},
	chatItem: {
		width: '100%',
		padding: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	bubble: {
		fontSize: 10,
		color: 'white',
		textAlign: 'center',
		width: 14,
		height: 14,
		borderRadius: 10,
		backgroundColor: variables.colors.orange,
		top: 10,
		right: 10,
		position: 'absolute'
	},
	signinContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		width: '30%',
		marginTop: 20,
	}
})

export default styles;

import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import KIcon from '../components/KIcon/KIcon'
import variables from '../styles/variables'
import Notifications from "../components/Views/Notifications"
import storage from '../utils/Storage/storageNew'

const NotificationsHeader: React.FC<{ title?: string }> = ({ title = "Notifications" }) => {
	const navigation = useNavigation()
	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
				<KIcon name={'back'} size={'medium'} />
			</TouchableOpacity>
			<Text style={styles.title}>{title}</Text>
			<View style={{ height: 40, width: 40 }}></View>
		</View>
	)
}

const NotificationsScreen = () => {
	
	const [bubbles, setBubbles] = useState<{ notifications: number; matches: number }>({
		notifications: 0,
		matches: 0,
	});

	useEffect(() => {
		const fetchBubbles = async () => {
			const ur = parseInt((await storage.getItem("unreadNotifications")) || "0", 10);
			const nm = parseInt((await storage.getItem("newMatches")) || "0", 10);
			setBubbles({ notifications: ur, matches: nm });
		};

		fetchBubbles();
	}, []);


	return (
		<SafeAreaView style={[styles.container, { backgroundColor: bubbles.notifications ? variables.colors.white : variables.colors.greenLight }]}>
			<NotificationsHeader title={"Notifications"} />
			<Notifications unreadNotifications={bubbles.notifications || 0} />
		</SafeAreaView>
	)
}

export default NotificationsScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: 48,
		paddingBottom: 16,
		paddingHorizontal: 16,
		borderBottomEndRadius: 30,
		borderBottomStartRadius: 30,
		backgroundColor: variables.colors.greenLight,
	},
	backButton: {
		marginRight: 16,
		padding: 8,
		borderRadius: 100,
		backgroundColor: variables.colors.white
	},
	backText: {
		fontSize: 28,
		color: '#333',
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
})

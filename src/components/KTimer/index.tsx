import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import KText from '../KText'
import variables from '../../styles/variables'
import useIsMobile from '../../hooks/useIsMobile'

type TimerProps = {
	targetDate: string | Date,
	titleText?: string
}

const KTimer: React.FC<TimerProps> = ({ targetDate, titleText }) => {

	const { isMobile } = useIsMobile()

	const calculateTimeLeft = () => {
		const end = new Date(targetDate).getTime()
		const now = new Date().getTime()
		const diff = end - now

		if (diff <= 0) {
			return { days: 0, hours: 0, minutes: 0 }
		}

		const days = Math.floor(diff / (1000 * 60 * 60 * 24))
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

		return { days, hours, minutes }
	}

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft(calculateTimeLeft())
		}, 60000)

		return () => clearInterval(interval)
	}, [targetDate])

	const pad = (n: number) => String(n).padStart(2, "0")

	return (
		<View style={[styles.container, isMobile ? { } : { width: 'auto', paddingHorizontal: 20 }]}>
			{titleText && <KText style={styles.titleText}>{titleText}</KText>}
			<View style={styles.timerRow}>
				<View>
					<KText style={styles.countText}>{pad(timeLeft.days)}</KText>
					<KText style={styles.titleText}>Days</KText>
				</View>
				<KText style={styles.countText}>:</KText>
				<View>
					<KText style={styles.countText}>{pad(timeLeft.hours)}</KText>
					<KText style={styles.titleText}>Hours</KText>
				</View>
				<KText style={styles.countText}>:</KText>
				<View>
					<KText style={styles.countText}>{pad(timeLeft.minutes)}</KText>
					<KText style={styles.titleText}>Mins</KText>
				</View>
			</View>
		</View>
	)
}

export default KTimer

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 20,
		width: '100%',
		alignSelf: 'center',
		flexDirection: 'column',
		paddingVertical: 10,
		backgroundColor: variables.colors.white,
		borderColor: variables.colors.lightGray,
	},
	timerRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
		gap: 20,
		paddingVertical: 10,
	},
	countText: {
		fontWeight: '600',
		fontSize: 40,
		letterSpacing: -1.5,
		textAlign: 'center',
	},
	titleText: {
		fontSize: 11,
		fontWeight: '500',
		opacity: 0.5,
		textAlign: 'center',
		marginBottom: 4,
		color: variables.colors.black,
	}
})

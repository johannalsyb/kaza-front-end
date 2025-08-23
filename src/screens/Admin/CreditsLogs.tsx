import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native'
import admin from '../../api/admin'
import KModal from '../../components/KModal/KModal'
import KButton from '../../components/KButton/KButton'
import KIcon from '../../components/KIcon/KIcon'
import Dropdown from '../../components/Dropdown/Dropdown'
import { toastSuccess, toastError } from '../../components/Toast/Toast'
import { phone } from '../../components/KIcon/icons'
import variables from '../../styles/variables'
import KText from '../../components/KText'

type Reason = 'on sign up' | 'on referral' | 'on swap'

interface LogEntry {
	id: number
	date: string
	fromUser: string | null
	toUser: string
	credits: number
	reason: Reason
}

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay)
		return () => clearTimeout(handler)
	}, [value, delay])

	return debouncedValue
}

const mockLogs: LogEntry[] = [
	{ id: 1, date: '2025-08-11 10:15:23', fromUser: null, toUser: 'Alice', credits: 5, reason: 'on sign up' },
	{ id: 2, date: '2025-08-10 14:42:10', fromUser: null, toUser: 'Bob', credits: 2, reason: 'on referral' },
	{ id: 3, date: '2025-08-09 09:20:45', fromUser: 'Alice', toUser: 'Charlie', credits: 2, reason: 'on swap' },
	{ id: 4, date: '2025-08-08 18:33:12', fromUser: 'David', toUser: 'Eve', credits: 7, reason: 'on swap' },
	{ id: 5, date: '2025-08-07 07:50:05', fromUser: null, toUser: 'Frank', credits: 5, reason: 'on sign up' },
	{ id: 6, date: '2025-08-06 13:15:56', fromUser: null, toUser: 'Grace', credits: 3, reason: 'on referral' },
	{ id: 7, date: '2025-08-05 16:42:29', fromUser: 'Eve', toUser: 'Henry', credits: 4, reason: 'on swap' },
	{ id: 8, date: '2025-08-04 11:05:17', fromUser: 'Charlie', toUser: 'Ivy', credits: 6, reason: 'on swap' },
	{ id: 9, date: '2025-08-03 08:10:44', fromUser: null, toUser: 'Jack', credits: 5, reason: 'on sign up' },
	{ id: 10, date: '2025-08-02 20:33:09', fromUser: null, toUser: 'Kate', credits: 2, reason: 'on referral' },
	{ id: 11, date: '2025-08-01 15:27:38', fromUser: 'Henry', toUser: 'Liam', credits: 8, reason: 'on swap' },
	{ id: 12, date: '2025-07-31 12:14:51', fromUser: 'Ivy', toUser: 'Mia', credits: 3, reason: 'on swap' },
	{ id: 13, date: '2025-07-30 09:59:04', fromUser: null, toUser: 'Noah', credits: 5, reason: 'on sign up' },
	{ id: 14, date: '2025-07-29 17:25:36', fromUser: null, toUser: 'Olivia', credits: 2, reason: 'on referral' },
	{ id: 15, date: '2025-07-28 06:45:18', fromUser: 'Mia', toUser: 'Paul', credits: 6, reason: 'on swap' },
]

const sortedLogs = [...mockLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function LogsScreen() {
	const [logs, setLogs] = useState<LogEntry[]>([])
	const [loading, setLoading] = useState(true)

	const [page, setPage] = useState(1)
	const [limit] = useState(10) // fixed 10 per page
	const [totalCount, setTotalCount] = useState(0)

	const [cLoading, setCLoading] = useState(false)
	const [result, setResult] = useState<string | null>(null)

	const handleRunTestCron = async () => {
		try {
			setCLoading(true);
			setResult(null);

			const res = await admin.credits.runTestCron();

			setResult(res.data.message || "Test cron executed successfully");
		} catch (err: any) {
			console.error("Error running test cron:", err);
			setResult(err?.response?.data?.error || "Failed to run test cron");
		} finally {
			setCLoading(false);
		}
	};


	// filters
	const [fromFilter, setFromFilter] = useState("")
	const [toFilter, setToFilter] = useState("")
	const [date, setDate] = useState("")
	const [reasonFilter, setReasonFilter] = useState("")

	const isClearVisible = fromFilter || toFilter || date || reasonFilter

	// Debounced filters
	const debouncedFrom = useDebounce(fromFilter, 2000)
	const debouncedTo = useDebounce(toFilter, 2000)
	const debouncedDate = useDebounce(date, 2000)
	const debouncedReason = useDebounce(reasonFilter, 2000)

	useEffect(() => {
		// whenever filters change, reset to page 1
		setPage(1)
	}, [debouncedFrom, debouncedTo, debouncedReason, debouncedDate])

	useEffect(() => {
		loadLogs()
	}, [debouncedFrom, debouncedTo, debouncedReason, debouncedDate, page])

	const [modalVisible, setModalVisible] = useState(false)
	// const [users, setUsers] = useState<string[]>(["Alice", "Bob", "Charlie", "David"])
	const [selectedUser, setSelectedUser] = useState<string>("")
	const [credits, setCredits] = useState<string>("")
	const [users, setUsers] = useState<{ id: string; name: string; email: string; phone: string; credits?: number }[]>([])
	const [loadingUsers, setLoadingUsers] = useState(false)
	const [selectedUserTotalCredits, setSelectedUserTotalCredits] = useState<string>("")

	const loadUsers = async () => {
		try {
			setLoadingUsers(true)
			const res = await admin.users.getAll()
			const mapped = (res?.data || []).map((u: any) => ({
				id: u.id,
				name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email || "Unknown",
				email: u.email || "Unknown",
				phone: u.phone || "Unknown",
				credits: typeof u.credits === 'number' ? u.credits : 0,
			}))
			setUsers(mapped)
		} catch (err) {
			console.error("Failed to load users:", err)
			Alert.alert("Error", "Failed to load users")
		} finally {
			setLoadingUsers(false)
		}
	}


	interface LogEntry {
		id: number
		date: string
		fromUser: string | null
		toUser: string
		credits: number
		reason: Reason
	}

	interface LogsResponse {
		page: number
		limit: number
		count: number
		data: LogEntry[]
	}

	interface LogsApiResponse {
		meta: { time: number; code: number }
		data: LogsResponse
	}

	const loadLogs = async () => {
		try {
			setLoading(true)
			const qs: any = { page: page.toString(), limit: limit.toString() }
			if (debouncedFrom) qs.userFrom = debouncedFrom
			if (debouncedTo) qs.userTo = debouncedTo
			if (debouncedReason) qs.reason = debouncedReason
			if (debouncedDate) qs.date = debouncedDate

			const res = await admin.credits.logs(qs)

			// Handle the response based on your actual API structure
			// If res.data is the array directly (current type definition)
			if (Array.isArray(res.data)) {
				setLogs(res.data)
				setTotalCount(res.data.length)
			} else if (res.data && typeof res.data === 'object' && 'data' in res.data) {
				// If res.data has the nested structure like your backend shows
				setLogs((res.data as any).data || [])
				setTotalCount((res.data as any).count || 0)
			} else {
				setLogs([])
				setTotalCount(0)
			}
		} catch (err) {
			console.error("Failed to load credit logs:", err)
			Alert.alert("Error", "Could not load logs")
		} finally {
			setLoading(false)
		}
	}

	// useEffect(() => {
	// 	loadLogs()
	// }, [fromFilter, toFilter, reasonFilter, date])

	const sortedLogs = [...logs].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	)
	const handleAddCredits = async () => {
		const amount = Number(credits)
		if (!selectedUser || Number.isNaN(amount) || amount <= 0) {
			Alert.alert("Error", "Please select a user and enter a valid positive number of credits")
			return
		}

		// Close immediately
		try {
			setModalVisible(false)
			await admin.credits.send({
				userId: selectedUser,
				credits: amount
			})
			toastSuccess(`Successfully sent ${amount} credits`)
			setCredits("")
			setSelectedUser("")
			setSelectedUserTotalCredits("")
			loadLogs()
		} catch (error) {
			toastError(error instanceof Error ? error.message : "Credits cannot be greater then 99")
		}

		// Alert.alert(
		// 	"Confirm",
		// 	`Are you sure you want to give ${amount} credits to ${selectedUser}?`,
		// 	[
		// 		{ text: "Cancel", style: "cancel" },
		// 		{
		// 			text: "Yes",
		// 			onPress: async () => {
		// 				try {
		// // Close immediately
		// setModalVisible(false)
		// await admin.credits.send({
		// 	userId: selectedUser,
		// 	credits: amount
		// })
		// 					toastSuccess(`Successfully sent ${amount} credits`)
		// 					setCredits("")
		// 					setSelectedUser("")
		// 					setSelectedUserTotalCredits("")
		// 					loadLogs()
		// 				} catch (err) {
		// 					console.error("Failed to send credits:", err)
		// 					toastError("Failed to send credits")
		// 				}
		// 			}
		// 		}
		// 	]
		// )
	}

	// const filteredLogs = logs.filter((log) => {
	// 	return (
	// 		(fromFilter === '' || log.fromUser?.toLowerCase().includes(fromFilter.toLowerCase())) &&
	// 		(toFilter === '' || log.toUser.toLowerCase().includes(toFilter.toLowerCase())) &&
	// 		(dateFilter === '' || log.date.includes(dateFilter)) &&
	// 		(reasonFilter === '' || log.reason.toLowerCase().includes(reasonFilter.toLowerCase()))
	// 	)
	// })

	// const sortedFilterLogs = [...filteredLogs].sort(
	// 	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	// )


	if (loading) {
		return (
			<View style={styles.loading}>
				<ActivityIndicator size="large" />
			</View>
		)
	}

	if (!loading && logs.length === 0) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
				<Text style={{ fontSize: 16, color: '#777' }}>No data to show</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			{/* main heading where credit logs and add credits button */}
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Text style={styles.header}>Credit Logs</Text>
				<KButton
					style={{ marginBottom: 12 }}
					onPress={() => {
						setModalVisible(true)
						setSelectedUser("")
						setSelectedUserTotalCredits("")
						setCredits("")
						loadUsers()
					}}
					text='Add Credits'
				/>
			</View>

			{/* <View>
				<KButton
					style={styles.hBtn}
					onPress={handleRunTestCron}
					disabled={cLoading}
				>
				<KText style={{color:'white'}}>{cLoading ? "Running..." : "Run Test Cron"}</KText>	
				</KButton>
				{result && (
					<KText style={{ marginTop: 10 }}>
						{result}
					</KText>
				)}
			</View> */}

			{/* Filtering the credits logs */}

			<View style={styles.searchBar}>
				<TextInput
					style={styles.input}
					placeholder="From User"
					value={fromFilter}
					onChangeText={setFromFilter}
				/>
				<TextInput
					style={styles.input}
					placeholder="To User"
					value={toFilter}
					onChangeText={setToFilter}
				/>
				<TextInput
					style={styles.input}
					placeholder="Date (YYYY-MM-DD)"
					value={date}
					onChangeText={setDate}
				/>

				<TextInput
					style={styles.input}
					placeholder="Reason (swap/referral/sign up)"
					value={reasonFilter}
					onChangeText={setReasonFilter}
				/>
				{isClearVisible && (
					<KIcon
						name="close"
						size={"large"}
						style={{ padding: 5, borderRadius: 100 }}
						onPress={() => {
							setFromFilter("")
							setToFilter("")
							setDate("")
							setReasonFilter("")
						}}
					/>
				)}
			</View>


			<View style={[styles.row, styles.headerRow]}>
				<Text style={[styles.cell, styles.cellDate]}>Date</Text>
				<Text style={styles.cell}>From</Text>
				<Text style={styles.cell}>To</Text>
				<Text style={styles.cell}>Credits</Text>
				<Text style={styles.cell}>Reason</Text>
				<Text style={[styles.cell, styles.cellDescription]}>Description</Text>
			</View>

			<FlatList
				data={sortedLogs}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={[styles.cell, styles.cellDate]}>
							{new Intl.DateTimeFormat('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric',
								hour: 'numeric',
								minute: 'numeric',
								hour12: true,
							}).format(new Date(item.date.replace(' ', 'T')))}
						</Text>
						<Text style={styles.cell}>{item.fromUser ?? 'Kaza'}</Text>
						<Text style={styles.cell}>{item.toUser}</Text>
						<Text style={styles.cell}>{item.credits}</Text>
						<Text style={styles.cell}>{item.reason}</Text>
						<Text style={[styles.cell, styles.cellDescription]}>
							{item.credits} credits were{' '}
							{item?.fromUser ? 'moved from ' : 'awarded to '}
							{item.fromUser ? `${item.fromUser} to ` : ''}
							{item.toUser} {item.reason}.
						</Text>
					</View>
				)}
			/>

			<KModal visible={modalVisible} setVisibility={setModalVisible}>
				<View style={{ padding: 20, width: "100%", backgroundColor: "white", borderRadius: 12 }}>
					<Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Add Credits</Text>

					{/* User Dropdown */}
					<Text style={{ fontSize: 16, marginBottom: 8 }}>Select User:</Text>
					{loadingUsers ? (
						<ActivityIndicator size="small" />
					) : (
						<Dropdown
							// items={users.map(
							// 	u =>
							// 		`Name: ${u.name}${u.email ? " - Email: " + u.email : ""}${u.phone ? " - Phone: " + u.phone : ""
							// 		}`
							// )}
							items={users.map(
								u => `${u.id}::Name: ${u.name}${u.email ? " - Email: " + u.email : ""}${u.phone ? " - Phone: " + u.phone : ""}`
							)}
							// onChange={(selectedItems) => {
							// 	const picked = users.find(u => {
							// 		const name = u.name || ""
							// 		const email = u.email || ""
							// 		const phone = u.phone || ""
							// 		const selected = selectedItems[0] || ""

							// 		return (
							// 			selected.includes(name) ||
							// 			selected.includes(email) ||
							// 			selected.includes(phone)
							// 		)
							// 	})

							// 	setSelectedUser(picked?.id || "")
							// 	setSelectedUserTotalCredits(
							// 		picked && typeof picked.credits === "number"
							// 			? String(picked.credits)
							// 			: ""
							// 	)
							// }
							onChange={(selectedItems) => {
								const raw = selectedItems[0] || ""
								const id = raw.split("::")[0] // 👈 extract id from "id::label"
								const picked = users.find(u => u.id === id)

								setSelectedUser(picked?.id || "")
								setSelectedUserTotalCredits(
									picked && typeof picked.credits === "number"
										? String(picked.credits)
										: ""
								)
							}
							}
							showSearch={true}
							emptyInitially={true}
							dropdownStyle={{ width: "100%", maxHeight: 300 }}
						/>
					)}


					{/* Total Credits (read-only) */}
					<Text style={{ fontSize: 16, marginTop: 8 }}>Total Credits:</Text>
					<TextInput
						value={selectedUserTotalCredits}
						editable={false}
						placeholder="Select a user to view total credits"
						style={{
							borderWidth: 1,
							borderColor: "#ccc",
							borderRadius: 10,
							padding: 12,
							marginVertical: 10,
							backgroundColor: "#f5f5f5"
						}}
					/>

					{/* Credits Input */}
					<Text style={{ fontSize: 16, marginTop: 8 }}>Credits:</Text>
					<TextInput
						value={credits}
						onChangeText={setCredits}
						placeholder="Enter credits"
						keyboardType="numeric"
						style={{
							borderWidth: 1,
							borderColor: "#ccc",
							borderRadius: 10,
							padding: 12,
							marginVertical: 10
						}}
					/>

					<KButton text="Confirm" onPress={handleAddCredits} />
				</View>
			</KModal>

			<View style={styles.pagination}>
				<KButton
					text="Prev"
					onPress={() => setPage((p) => Math.max(1, p - 1))}
					disabled={page === 1}
					style={{ marginRight: 10 }}
				/>
				<Text style={{ alignSelf: 'center' }}>Page {page}</Text>
				<KButton
					text="Next"
					onPress={() => setPage((p) => p + 1)}
					disabled={logs.length < limit} // disable if less than limit
					style={{ marginLeft: 10 }}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fafafa',
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	hBtn: {
		backgroundColor: '#000000',
		color: '#d8c230ff',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		textAlign: 'center',
		borderRadius: 8,
		cursor: 'pointer',
		fontSize: 15,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	row: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		paddingVertical: 8,
		alignItems: 'center',
	},
	headerRow: {
		backgroundColor: '#f0f0f0',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
	},
	cell: {
		flex: 1,
		fontSize: 14,
		paddingHorizontal: 4,
	},
	cellDate: {
		flex: 1.5,
	},
	cellDescription: {
		flex: 2.5,
	},
	searchBar: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginBottom: 10,
		width: '100%',
	},
	input: {
		flex: 1,
		minWidth: '22%',
		margin: 4,
		padding: 8,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 6,
	},
	pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }

})
import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import variables from '../../../styles/variables';
import KImage from '../../KImage/KImage';
import KText from '../../KText';
import KIcon from '../../KIcon/KIcon';
import KButton from '../../KButton/KButton';

export const formatDateRange = (dateFrom: string, dateTo: string) => {
	const from = new Date(dateFrom);
	const to = new Date(dateTo);

	const optionsFrom: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
	const optionsTo: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };

	const fromStr = from.toLocaleDateString("en-GB", optionsFrom);
	const toStr = to.toLocaleDateString("en-GB", optionsTo);

	return `${fromStr} - ${toStr}`;
};

export type FutureSwap = {
	id: string
	ownerFirstName: string
	ownerLastName: string
	ownerImage: string
	location: string
	dateFrom: string
	dateTo: string
}

interface FutureSwapListProps {
	data: FutureSwap[];
	onCancel?: (item: FutureSwap) => void;
	onMessagePress?: (item: FutureSwap) => void;
	onSharePress?: (item: FutureSwap) => void;
}

const FutureSwapList = ({
	data,
	onCancel,
	onMessagePress,
	onSharePress
}: FutureSwapListProps) => {
	const { colors } = variables;

    useEffect(() => {
		console.log("Future");

	}, [])

	const renderItem = ({ item }: { item: FutureSwap }) => (
		<View style={{
			backgroundColor: colors.yellow,
			margin: 10, borderRadius: 20, paddingBottom: 10
		}}>
			
			<View style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}>
				<View style={{
					backgroundColor: colors.white,
					borderRadius: 20,
					padding: 10,
					width: 40,
					height: 40,
					justifyContent: 'center',
					alignItems: 'center',
                    marginTop: 10, 
                    marginLeft: 10,
				}}>
					<KIcon 
						name="chat" 
						size={24} 
						style={{ stroke: colors.black }}
						onPress={() => onMessagePress?.(item)}
					/>
				</View>

				<View style={{
					backgroundColor: colors.white,
					borderRadius: 20,
					padding: 10,
					width: 40,
					height: 40,
					justifyContent: 'center',
					alignItems: 'center',
                    marginTop: 10,
                    marginRight: 10,
				}}>
					<KIcon 
						name="contract" 
						size={24} 
						style={{ stroke: colors.black }}
						onPress={() => onSharePress?.(item)}
					/>
				</View>
			</View>

			<View style={{
				alignItems: 'center',
				marginBottom: 10,
                marginTop: -30,
			}}>
				<View style={{
					borderWidth: 4,
					borderColor: colors.white,
					borderRadius: 60,
				}}>
					<KImage
						source={item.ownerImage}
						style={{
							width: 100,
							height: 100,
							borderRadius: 50,
							objectFit: 'cover',
							backgroundColor: colors.white,
                            
						}}
					/>
				</View>
			</View>

			{/* User Info */}
			<View style={{
				alignItems: 'center',
			}}>
				<KText style={{
					color: colors.black,
                    textAlign: "center",
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: 35,
                    fontStyle: "normal",
                    fontWeight: "600",
                    lineHeight: 37,
                    letterSpacing: -1.5,
				}}>
					{item.ownerFirstName} {item.ownerLastName}
				</KText>

				<View style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: 20
				}}>
					<KIcon 
						name="location" 
						size={20} 
						style={{ stroke: colors.black, marginRight: 6, opacity: 0.7 }} 
					/>
					<KText style={{
						color: colors.black,
                        textAlign: "center",
                        fontFamily: "Plus Jakarta Sans",
                        fontSize: 13,
                        fontStyle: "normal",
                        fontWeight: "400",
                        lineHeight: 15,
						opacity: 0.7,
                        
					}}>
						{item.location}
					</KText>
				</View>
			</View>

			{/* Stay Details Card */}
			<View style={{
				backgroundColor: colors.greenLight,
				borderRadius: 20,
				padding: 10,
                margin:10,
				marginBottom: 0
			}}>
				<KText style={{
					color: colors.black,
                    textAlign: "center",
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: 14,
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: 15,
                    letterSpacing: -0.5,
                    marginBottom: 16
				}}>
					{item.ownerFirstName} is staying at your place
				</KText>

				<View style={{
					justifyContent: 'space-between',
				}}>
					
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: '#fff', 
                        borderRadius: 12, 
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                        marginBottom: 10,
                        }}>
                        
                        <KText style={{
                            fontSize: 14,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "400",
                            marginRight: 4,
                            fontStyle: "normal",
                            lineHeight: 13,
                            letterSpacing: -0.5,
                            opacity: 0.5,
                            textAlign: "center",
                        }}>
                            From
                        </KText>
                        <KText style={{
                            fontSize: 15,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: 13,
                            letterSpacing: -0.5,
                            textAlign: "center",
                        }}>
                            {new Date(item.dateFrom).toLocaleDateString("en-GB", { 
                            day: "2-digit", 
                            month: "short"
                            }).replace(' ', '')}
                        </KText>
                        <KText style={{
                            fontSize: 14,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "400",
                            fontStyle: "normal",
                            lineHeight: 13,
                            letterSpacing: -0.5,
                            opacity: 0.5,
                            textAlign: "center",
                            marginLeft: 4,
                            marginRight: 8,
                        }}>
                            {new Date(item.dateFrom).getFullYear()}
                        </KText>

                        <KText style={{
                            fontSize: 15,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "400",
                            opacity: 0.5,
                            marginHorizontal: 8,
                        }}>
                            |
                        </KText>

                        <KText style={{
                            fontSize: 14,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "400",
                            marginRight: 4,
                            fontStyle: "normal",
                            lineHeight: 13,
                            letterSpacing: -0.5,
                            opacity: 0.5,
                            textAlign: "center",
                        }}>
                            To
                        </KText>
                        <KText style={{
                            fontSize: 15,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "500",
                            fontStyle: "normal",
                            lineHeight: 13,
                            letterSpacing: -0.5,
                            textAlign: "center",
                        }}>
                            {new Date(item.dateTo).toLocaleDateString("en-GB", { 
                            day: "2-digit", 
                            month: "short"
                            }).replace(' ', '')}
                        </KText>
                        <KText style={{
                            fontSize: 14,
                            color: colors.black,
                            fontFamily: "Plus Jakarta Sans",
                            fontWeight: "400", 
                            fontStyle: "normal",
                            lineHeight: 13,
                            letterSpacing: -0.5,
                            opacity: 0.5,
                            textAlign: "center",
                            marginLeft: 4,
                        }}>
                            {new Date(item.dateTo).getFullYear()}
                        </KText>
                        </View>


				</View>

                <KButton
                    text="Cancel"
                    icon="crossCircle"
                    iconPosition="left"
                    iconStyle={{ 
                        color: colors.white,
                        height: 20, 
                        width: 20,
                        marginRight: 8
                    }}
                    style={{
                        backgroundColor: colors.black,
                        borderRadius: 25,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        alignSelf: 'center', 
                        marginTop: 10,
                    }}
                    textStyle={{
                        color: colors.yellow,
                        fontSize: 15,
                        fontWeight: '500',
                        textAlign: "center",
                        fontFamily: "Plus Jakarta Sans",
                        fontStyle: "normal",
                        lineHeight: 15,
                        letterSpacing: -0.5
                    }}
                    onPress={() => onCancel?.(item)}
                />

			</View>
		</View>
	);

	return (
		<FlatList
			data={data}
			keyExtractor={(item) => item.id}
			renderItem={renderItem}
			contentContainerStyle={{ paddingBottom: 20 }}
		/>
	);
};

export default FutureSwapList;
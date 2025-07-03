import { Modal, ScrollView, TextInput, TextStyle, View, Animated, TouchableOpacity, Pressable, StyleSheet, Platform } from "react-native"
import KButton from "../../KButton/KButton"
import variables from "../../../styles/variables"
import KText from "../../KText"
import KIcon from "../../KIcon/KIcon"
import KTextInput from "../KTextInput/KTextInput"
import { useEffect, useRef, useState } from "react"
import KModal from "../../KModal/KModal"
import { Phone } from "../../forms/auth/Register"
import { Countries, getCountries, isPhoneValid } from "../../../utils/phone"
import useIsMobile from "../../../hooks/useIsMobile"
import Dropdown from "../../Dropdown/Dropdown"
import { useCloseFromOutside } from '../../../hooks/useCloseFromOutside'

const inputStyles: TextStyle = {
    textAlign: "left",
    height: variables.button.size.medium.height
}

type Props = {
    phone?: string
    onChange: (phone: string) => void
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: variables.colors.xLightGray,
        borderRadius: 23,
        height: 44,
        position: 'relative',
        zIndex: 1,
    },
    dropdown: {
        position: 'absolute',
        top: 45,
        left: 0,
        backgroundColor: variables.colors.white,
        width: 'auto',
        paddingVertical: 15,
        paddingLeft: 15,
        borderRadius: 15,
        zIndex: 1,
        boxShadow: '15px 15px 55px 0px rgba(77, 75, 63, 0.25)',
    },
})


export default (props: Props) => {
    const { isMobile } = useIsMobile()
    const [modalVisible, setModalVisible] = useState(false)
    const [code, setCode] = useState("+1")
    const [number, setNumber] = useState(props.phone || "")
    const [countries, setCountries] = useState<Countries>({})
    const [countrySearch, setCountrySearch] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const modalSearchInput = useRef<TextInput>(null)
    const modalRef = useRef<View>(null)
    const [isOpenDropdown, setIsOpenDropdown] = useState(false)
    const [isHovered, setIsHovered] = useState(-1)
    const rotateAnim = useRef(new Animated.Value(0)).current
    const closeSuggestionRef = useCloseFromOutside(
        isOpenDropdown,
        setIsOpenDropdown,
    )
    useEffect(() => {
        if (!Object.keys(countries).length) {
            getCountries()
                .then(c => {
                    setCountries(c)
                    const index = Object.keys(c).findIndex(c => c === code)
                    setSelectedIndex(index)
                })
        }
    }, [])

    useEffect(() => {
        Animated.timing(rotateAnim, {
            toValue: isOpenDropdown ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [isOpenDropdown]) 

    useEffect(() => {
        if (code !== undefined && number !== undefined) props.onChange(`${code}${number}`)
    }, [code, number])
    console.log(props.phone)
    return <View>

        <Pressable
            ref={closeSuggestionRef}
            style={[styles.container]}
        >
            <Pressable
                onPress={() => setIsOpenDropdown(!isOpenDropdown)}
                style={{ paddingLeft: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <KText>
                    {code}
                </KText>
                <Animated.View
                    style={{
                        transform: [
                            {
                                rotate: rotateAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                }),
                            },
                        ],
                    }}
                >
                    <KIcon
                        name="arrowDown"
                        size="medium"
                        style={{ color: variables.colors.black, opacity: 0.6 }}
                    />
                </Animated.View>
            </Pressable>
            <View
                style={{
                    width: 1,
                    height: '60%',
                    backgroundColor: '#ccc',
                    marginHorizontal: 5,
                }}
            />
            <View style={{ flex: 1, paddingLeft: 10, paddingRight: 20 }}>
                {/* <KText style={{ color: variables.colors.black, opacity: 0.6, fontSize: 16 }}>
                    Phone number
                </KText> */}
                <TextInput
                    value={number}
                    onChangeText={(e) => setNumber(e)
                        
                    }
                    placeholder='Phone number'
                    style={{
                        color: variables.colors.black,
                        opacity: 0.6,
                        fontSize: 16,
                        height: 44,
                        textAlign: 'left',
                        paddingVertical: 0,
                        ...(Platform.OS === 'web' ? { outlineWidth: 0 } : {}), // тільки для web

                    }} />
            </View>
            {isOpenDropdown && <View style={[
                styles.dropdown,
            ]}>
                <ScrollView style={{ maxHeight: 300 }}>
                    {Object.entries(countries).map(([c, countries], index) => (
                        <Pressable
                            key={'drop-down-item-' + index}
                            style={{
                                borderRadius: 10,
                                padding: 10,
                                backgroundColor:
                                    isHovered !== index && code === c ? variables.colors.xLightGray : isHovered === index
                                        ? variables.colors.yellow
                                        : 'transparent',
                            }}
                            onPress={() => {
                                setCode(c)
                                setSelectedIndex(index)
                                setIsOpenDropdown(false)
                            }}
                            onHoverIn={() => setIsHovered(index)}
                            onHoverOut={() => setIsHovered(-1)}>
                            <KText>
                                {countries.join(", ")}({c})
                            </KText>
                        </Pressable>

                    ))}
                </ScrollView>

            </View>}
        </Pressable>
    </View>

}
import { useEffect, useState } from "react"
import useIsMobile from "../../hooks/useIsMobile"
import Property, { leftColumnWidth, rightColumnWidth } from "../../components/Views/Property"
import PropertyCard from "../../components/PropertyCard"
import { PrivateProperty, Property as PropertyT } from "../../common/types/api/properties"
import propertiesApi from "../../api/properties"
import { ActivityIndicator, BackHandler, NativeEventSubscription, Platform, Pressable, ScrollView, Switch, View, ViewStyle } from "react-native"
import variables from "../../styles/variables"
import KButton from "../../components/KButton/KButton"
import KText from "../../components/KText"
import KIcon from "../../components/KIcon/KIcon"
import HeaderEvent from "../../events/HeaderEvent"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { ParamListBase, useRoute } from "@react-navigation/native"
import { useAtomValue, useSetAtom } from "jotai"
import { isSideModalOpenAtom, showSwapNowAtom } from "../../atoms"
import useAuthentication from "../../hooks/useAuthentication"
import KSwitch from "../../components/KSwitch"
import Footer from "../../components/Footer"
import { shareProperty } from "../../utils/Share"
import KSideModal from "../../components/KModal/KSideModal"
import EditProfileComponent from "../../components/Screens/Account/EditProfile"
import EditProperty from "../../components/Views/Account/EditProperty"
import { Api } from "../../common"
import { Creds } from "../../components/forms/auth/Register"
import { toastError } from "../../components/Toast/Toast"
import users from "../../api/users"
import { parsePhone } from "../../utils/phone"
import { edit } from "../../components/KIcon/icons"
import UserEvent from "../../events/UserEvent"
import EditAvailabilities from "../../components/Screens/Account/EditAvailabilities"

type Props = {
    id?: string,
    property?: PropertyT,
    privateProperty?: PrivateProperty,
    onBackPressed: () => void,
    navigation: NativeStackNavigationProp<ParamListBase>,
    onEditPropertyPressed?: () => void,
    onEditCalendarPressed?: () => void,
    onPropertyEdited?: () => void,
}

let shareEvId: string | undefined = undefined

type ExtProp = { public: PropertyT, private: PrivateProperty }

let lid: string | undefined = undefined

export default (props: Props) => {
    const { isMobile } = useIsMobile()
    const route = useRoute()
    const marginVertical = isMobile ? 10 : 20

    const [modal, setModal] = useState<'user' | 'property' | 'swap' | 'Myplace' | 'EditAvailabilities' | null>(null)
    const [uuser, setUser] = useState<{ user: Api.Users.Me; creds: Creds }>()
    const [prop, setProp] = useState<Api.Properties.PrivateProperty>()

    const onEditPropertyPressed = () => setModal('property')
    // const onEditCalendarPressed = () => setModal('EditAvailabilities')
    const onEditCalendarPressed = () => {
        setModal('EditAvailabilities')
        setIsSideModalOpen(true)
    }

    const preview = (route?.params as Readonly<{ preview: boolean }>)?.preview

    const [showPreview, setShowPreview] = useState(preview)
    const [property, setProperty] = useState<ExtProp | undefined>(undefined)
    // const [hidden, setHidden] = useState(false)
    const [loading, setLoading] = useState(false)
    const setShowSwapNow = useSetAtom(showSwapNowAtom)
    const { properties, user } = useAuthentication()

    const setIsSideModalOpen = useSetAtom(isSideModalOpenAtom);
    const isSideModalOpen = useAtomValue(isSideModalOpenAtom);
    const [ueListenerId, setUeListenerId] = useState<string>()


    useEffect(() => {
        if (!isSideModalOpen) {
            setModal(null);
            props.navigation.setParams({ edit: undefined });
        }
    }, [isSideModalOpen, props.navigation]);


    useEffect(() => {
        if (!ueListenerId) return
        props.navigation.setParams({ edit: modal ? true : undefined })
    }, [modal])

    useEffect(() => {
        if (!prop) {
            setLoading(true)
            loadProperty().finally(() => {
                setLoading(false)
            })
        }
        if (!user) loadUser()
        if (!ueListenerId) {
            setUeListenerId(
                UserEvent.addListener('update', u => {
                    loadUser()
                }),
            )
        }

        const evId = HeaderEvent.addListener("edit", (data) => {
            if (data === "user") setModal("user")
            if (data === "property") setModal("property")
        })

        return () => {
            if (ueListenerId) UserEvent.removeListener('update', ueListenerId)
            if (evId) HeaderEvent.removeListener("edit", evId)
            if (shareEvId) HeaderEvent.removeListener("share", shareEvId)
        }
    }, [])


    useEffect(() => {
        if (props.id || props.privateProperty) {
            const id = props.id || props.privateProperty?.id
            if (!id) return
            let pub = props.property ? Promise.resolve(props.property) : propertiesApi.get(id)
                .then(res => {
                    if (!res.data) return
                    return res.data as unknown as PropertyT
                })
                .catch(err => {
                    console.log(err)
                })

            Promise.all([pub, properties.get()])
                .then(([pup, prps]) => {
                    if (!pup) return
                    const prop = prps.filter(p => p.id === props.id)
                    setProperty({ public: pup, private: prop[0] })
                })
        }
    }, [props.privateProperty, props.id])

    useEffect(() => {
        return () => {
            setShowPreview(false)
            if (lid) HeaderEvent.removeListener("back", lid!)
        }
    }, [])

    useEffect(() => {
        if (lid) HeaderEvent.removeListener("back", lid!)
        lid = HeaderEvent.addListener("back", () => {
            if (showPreview) setShowPreview(false)
            else {
                props.onBackPressed()
            }
            return
        })

        if (!showPreview) props.navigation.setParams({ preview: undefined })
    }, [showPreview])

    const updateHidden = (priv: boolean) => {
        setLoading(loading)
        propertiesApi.update({ id: props.id, private: priv })
            .then(() => {
                properties.reload(priv)
                    .then(() => props.onPropertyEdited && props.onPropertyEdited())
            })
            .catch(err => {
                console.log(err)
                // setProperty({...property, private: {...property.private, private: !priv}})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const hideMyPlaceButton = (prop: ExtProp, {
        style = {},
        switchStyle = {}
    }: {
        style?: ViewStyle,
        switchStyle?: ViewStyle
    } = {}) => {
        console.log("IS PRIVATE", prop.private.private)
        return <KButton
            color="light"
            onPress={() => {
                // setHidden(!hidden)
                // updateHidden(!hidden)
            }}
            style={{
                width: isMobile ? '100%' : 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "flex-start",
                marginTop: isMobile ? 5 : 0,
                marginBottom: isMobile ? 5 : 0,
                borderColor: "white",
                height: 53,
                ...style
            }}>
            <KIcon name="eyeClose" style={{ marginRight: 10, marginLeft: 10 }} size="medium" />
            <KText style={{ flex: 1, color: propVerified ? "black" : variables.colors.orange }}>Visibility of your place{!propVerified ? " (Property not verified)" : ""}</KText>
            <KSwitch
                disabled={loading || !propVerified}
                loading={loading}
                style={{ marginRight: 10, ...switchStyle }}
                onValueChange={(t) => {
                    setProperty({ ...prop, private: { ...prop.private, private: t } })
                    updateHidden(t)
                }}
                value={prop.private.private}
            />
        </KButton>
    }

    const EditPropertyView = !prop ? (
        <ActivityIndicator />
    ) : (
        <EditProperty
            style={{
                width: isMobile ? '100%' : '90%',
            }}
            verified={prop.verified}
            property={{
                id: prop.id,
                location: prop.address,
                type: prop.type,
                amenities: prop.amenities != null ? prop.amenities.split(',') : [],
                petFriendly: prop.pets,
                size: prop.sizeM2,
                bathrooms: prop.bathrooms,
                bedrooms: prop.bedrooms,
                beds: prop.beds,
                bedroomsBeds: JSON.parse(prop.bedArrangements),
                pics: prop.images != null ? (prop.images as string)?.split(',') : [],
                private: !!prop.private,
                childrenAllowed: !!prop.childrenAllowed,
                smokingAllowed: !!prop.smokingAllowed,
                lat: prop.lat,
                lon: prop.lon,
            }}
            onClose={() => setModal(null)}
            onUpdated={(np) => {
                setModal(null)
                loadProperty(np.private !== prop.private ? np.private : undefined)
            }}
        />
    )


    const loadProperty = (changeHidden?: boolean) => {
        return properties.reload(changeHidden)
            .then((array) => {
                const p = array[0]
                if (!p) return
                setProp(p)
            })
            .catch(err => {
                toastError('An error occured while fetching your property')
            })
    }

    const loadUser = () => {
        return users.me
            .get()
            .then(({ data }) => Promise.all([data, parsePhone(data.phone)]))
            .then(([user, phone]) =>
                setUser({
                    user,
                    creds: {
                        email: user!.email,
                        firstName: user!.firstName,
                        gender: user!.gender,
                        image: user!.primaryImage,
                        job: user!.job,
                        hobby: user!.hobby,
                        phoneVerified: user!.phoneVerified,
                        emailVerified: user!.emailVerified,
                        password: '',
                        phone: phone || {
                            code: '+1',
                            number: '',
                        },
                        socialMedia: user!.socialMedia,
                        address: user!.address,
                        dateFrom: user!.dateFrom,
                        dateTo: user!.dateTo,
                    },
                }),
            )
    }

    const hasProperty = !!props.id
    const propVerified = user && user.verified && (property && property.private.verified)

    if (!hasProperty) return <View style={{
        backgroundColor: variables.colors.greenLight,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <KIcon name="placeType" size="xxlarge" style={{
            stroke: "black",
            backgroundColor: "white",
            borderRadius: 100,
            padding: 10,
        }} />
        <KText style={{ fontSize: isMobile ? 18 : 25, fontWeight: "bold", marginTop: 20, marginBottom: 20, textAlign: "center" }}>
            Oops ! You don't have a property yet...
        </KText>
        <KText style={{ maxWidth: isMobile ? "90%" : "25%", textAlign: "center", lineHeight: 20 }}>
            Add your property to start swapping.
        </KText>
        <KButton text="Add my property" color="primary" onPress={() => {
            props.navigation.navigate('Onboarding')
        }} style={{ marginTop: 20 }} />
    </View>

    return (
        <View style={{
            // backgroundColor: variables.colors.white, flex:1
        }}>
            {isMobile &&
                <View style={[
                    {
                        backgroundColor: variables.colors.yellow,
                        borderRadius: isMobile ? 0 : 20,
                        borderBottomRightRadius: 23,
                        borderBottomLeftRadius: 23,
                        flex: 1,
                        marginRight: isMobile ? 0 : 20,
                        marginBottom: isMobile ? 0 : marginVertical,
                        paddingTop: 60,
                        paddingBottom: 40,
                        paddingHorizontal: 20,
                        justifyContent: 'center',
                        flexDirection: "column",
                        width: isMobile ? '100%' : 'auto',
                        maxWidth: isMobile ? undefined : 900,
                    },
                    !isMobile && { alignItems: 'center' },
                ]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Pressable onPress={() => props.navigation.navigate('account')}>
                            <KIcon name='backArrow' size={'large'} style={{
                                width: 40, height: 40,
                                backgroundColor: "white", borderRadius: 100
                            }} ></KIcon>
                        </Pressable>

                        <KText style={{ fontSize: 17, fontWeight: '400' }}>Manage my Place</KText>
                        <View style={{ width: 40, height: 40 }} />
                    </View>
                </View>
            }
            <ScrollView style={{
                marginLeft: isMobile ? 10 : 0,
                marginRight: isMobile ? 10 : 0,
                marginBottom: isMobile ? 10 : 0,
            }}>
                {property ?
                    showPreview ? <View style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        // justifyContent: "flex-end",
                    }}>
                        <View style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            paddingTop: 10,
                            paddingBottom: 0,
                            paddingLeft: 40,
                            paddingRight: 40,
                            display: isMobile ? "none" : "flex",
                            flexWrap: "wrap",
                        }}>
                            <View style={{ backgroundColor: "transparent", height: 0, width: leftColumnWidth }} />
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: rightColumnWidth }}>
                                {hideMyPlaceButton(property, { switchStyle: { marginLeft: 20 } })}

                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Pressable
                                        onPress={() => shareProperty(`${window.location.origin}/property/${property.public.id}`)}
                                        style={{
                                            marginLeft: 20,
                                            marginRight: 20,
                                            borderWidth: 1,
                                            borderColor: "grey",
                                            borderRadius: 30,
                                            padding: 10
                                        }}>
                                        <KIcon name="share" size="medium" />
                                    </Pressable>
                                    <KButton
                                        color="tertiary"
                                        text="Edit Place"
                                        icon="edit"
                                        iconStyle={{ stroke: variables.colors.yellow }}
                                        onPress={() => {
                                            props.onEditPropertyPressed && props.onEditPropertyPressed()
                                        }} />
                                </View>
                            </View>
                        </View>
                        <Property id={props.id!} />
                    </View>
                        : <>
                            {/* {property && <PropertyCard
                        property={property.public}
                        hoverable={false}
                        onPress={() => {
                            props.navigation.push(route.name, { preview: true })
                            // setShowPreview(true)
                        }} />} */}

                            <KButton
                                color="light"
                                // onPress={() => {
                                //     props.navigation.push(route.name, { edit: true })
                                //     setModal('property')
                                //     // setShowPreview(true)
                                // }}
                                onPress={onEditPropertyPressed}
                                style={{
                                    width: isMobile ? '100%' : 'auto',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: "flex-start",
                                    // increased the margin top
                                    marginTop: isMobile ? 20 : 0,
                                    height: 53,
                                    marginBottom: isMobile ? 5 : 0,
                                    borderColor: "white"
                                }}>
                                <KIcon name="placeType" style={{ marginRight: 10, marginLeft: 10 }} size="medium" />
                                <KText style={{ flex: 1 }}>Edit my place</KText>
                                <KIcon name="chevronRight" style={{ marginRight: 10, marginLeft: 10 }} size="medium" />
                            </KButton>

                            <KButton
                                color="light"
                                // onPress={() => setShowSwapNow(true)}
                                onPress={onEditCalendarPressed}
                                style={{
                                    width: isMobile ? '100%' : 'auto',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: "flex-start",
                                    marginTop: isMobile ? 5 : 0,
                                    marginBottom: isMobile ? 5 : 0,
                                    height: 53,
                                    borderColor: "white"
                                }}>
                                <KIcon name="calendarEdit" style={{ marginRight: 10, marginLeft: 10, stroke: "#555" }} size="medium" />
                                <KText style={{ flex: 1 }}>Edit Availabilities</KText>
                                <KIcon name="chevronRight" style={{ marginRight: 10, marginLeft: 10 }} size="medium" />
                            </KButton>
                            {hideMyPlaceButton(property)}
                        </>
                    : <ActivityIndicator color={variables.colors.yellow} />}
                <Footer route={"Myplace"} />

            </ScrollView>
            <KSideModal
                visible={!!modal}
                showCross={false}
                onClose={() => setModal(null)}>
                {/* {modal === 'user' &&
                    <EditProfileComponent
                        user={uuser}
                        setUser={setUser}
                        setModal={setModal}
                        loadUser={loadUser}
                    />}
                {modal === 'property' && EditPropertyView} */}
                {modal === 'user' &&
                    <EditProfileComponent
                        user={uuser}
                        setUser={setUser}
                        setModal={setModal}
                        loadUser={loadUser}
                    />}
                {modal === 'property' && EditPropertyView}
                {modal === 'EditAvailabilities' &&
                    <EditAvailabilities
                        propertyId={props.id}
                        onClose={() => setModal(null)}
                        onUpdated={() => {
                            setModal(null)
                            props.onPropertyEdited && props.onPropertyEdited()
                        }}
                    />}
            </KSideModal>
        </View>
    )
}
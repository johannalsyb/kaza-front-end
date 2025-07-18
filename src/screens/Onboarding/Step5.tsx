import { View } from "react-native"
import KButton from "../../components/KButton/KButton"
import { useEffect, useState } from "react"
import User1, { Preferences } from "../../components/forms/user/User1"
import users from "../../api/users"
import useAuthentication from "../../hooks/useAuthentication"
import { toastError } from "../../components/Toast/Toast"
import KText from '../../components/KText'
import KIcon from '../../components/KIcon/KIcon'
import variables from '../../styles/variables'
import CalendarComponent from '../../components/Screens/Onboarding/CalendarComponent'
import { useAtomValue } from 'jotai'
import { avilebleDatesAtom } from '../../atoms'
import { Property } from '../../components/forms/property'
import properties from "../../api/properties"
import { Api } from '../../common'

type Props = {
    onPrev: () => void,
    onNext: () => void,
    onChange: (prefs: Property) => void,
    property: Property,
}

export default (props: Props) => {
    const { user } = useAuthentication()
    const [loading, setLoading] = useState(false)
    // const [prefs, setPrefs] = useState<Preferences>(props.preferences || {
    //     location: undefined,
    //     dateFromTo: undefined,
    // })
    const availableDates = useAtomValue(avilebleDatesAtom)

    const createOrUpdate = () => {
        setLoading(true)
        properties.ofUser("me")
            //@ts-ignore
            .then(({ data }) => {
                const pdata: Partial<Api.Properties.PrivateProperty> = {
                    name: `${props.property.type.capitalizeFirst()} ${props.property.location ? `in ${props.property.location.split(",").slice(-2).join(",")}` : ""}`,
                    id: data.length === 0 ? undefined : data[0].id,
                    type: props.property.type,
                    sizeM2: props.property.size,
                    address: props.property.location,
                    amenities: props.property.amenities.join(","),
                    pets: props.property.petFriendly,
                    beds: props.property.beds,
                    bedrooms: props.property.bedrooms,
                    bathrooms: props.property.bathrooms,
                    bedArrangements: JSON.stringify(props.property.bedroomsBeds),
                    availableDates
                    // images: string | string[]
                    // primaryImage: string
                    // description: "",
                    // flatmates: number
                    // country: string
                    // region: string | null
                    // city: string
                }
                return data.length === 0 ? properties.create(pdata) : properties.update(pdata)
            })
            .then(p => {
                //@ts-ignore
                props.onChange({ ...props.property, id: p.data.id })
                props.onNext()
            }).catch(e => {
                if (e.code === 406) {
                    // This is if the property address is not accurate enough
                }
                toastError("An error occured while creating your property")
            }).finally(() => {
                setLoading(false)
            })
    }

    // useEffect(() => {
    //     props.onChange(prefs)
    // }, [prefs])

    // const isValid = (prefs.dateFromTo === null || (Array.isArray(prefs.dateFromTo) && prefs.dateFromTo[0] < prefs.dateFromTo[1])) &&
    //     prefs.location === null || (Array.isArray(prefs.location) && prefs.location.length > 0)

    const updateUser = () => {
        if (!user) return
        setLoading(true)
        return users.update({
            id: user.id,

            // swapLocations: prefs.location ? prefs.location.join("\n") : null,
            // dateTo: prefs.dateFromTo ? prefs.dateFromTo[1] : undefined,
            // dateFrom: prefs.dateFromTo ? prefs.dateFromTo[0] : undefined,
        })
            .then(() => props.onNext())
            .catch(() => {
                toastError("An error occured while updating your profile")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return <>
        {/* <User1 onChange={setPrefs} preferences={prefs}/> */}
        <CalendarComponent />
        <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 20,
            marginBottom: 20
        }}>
            <KButton
                text="Back"
                loading={loading}
                disabled={loading}
                onPress={(props.onPrev)}
                color="greenLight"
                style={{ width: "48%" }} />

            <KButton
                text="Next"
                loading={loading}
                disabled={loading || availableDates.length < 1}
                onPress={createOrUpdate}
                color="primary"
                style={{ width: "48%" }} />
        </View>
        <View style={{ height: 10 }} />
    </>
}
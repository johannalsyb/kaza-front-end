import { ScrollView, View, ViewStyle } from "react-native"
import KButton from "../../KButton/KButton"
import { useEffect, useState } from "react"
import { toastError } from "../../Toast/Toast"
import properties from "../../../api/properties"
import Property1 from "../../forms/property/Property1"
import { Property as Prop } from "../../forms/property"
import Property2 from "../../forms/property/Property2"
import Property3 from "../../forms/property/Property3"
import FormField from "../../Form/FormField/FormField"
import CheckBox from "../../CheckBox/CheckBox"
import Property from "../../../common/types/Property"

type Props = {
    property: Prop,
    style?: ViewStyle,
    verified?: boolean,
    onClose?: () => void,
    onUpdated: (u: Property) => void,
}

export default (props: Props) => {


    const [prop, setProp] = useState<Prop>(props.property)
    useEffect(() => {
        if (props.property) setProp(props.property)
    }, [props.property])

    const [loading, setLoading] = useState(false)
    const update = () => {
        setLoading(true)
        return properties.update({
            id: prop.id,
            type: prop.type,
            sizeM2: prop.size,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            beds: prop.beds,
            amenities: prop.amenities.join(","),
            pets: prop.petFriendly,
            private: !!prop.private,
            childrenAllowed: !!prop.childrenAllowed,
            smokingAllowed: !!prop.smokingAllowed,
            bedArrangements: JSON.stringify(prop.bedroomsBeds),
            address: prop.location,
            primaryImage: prop.primaryImage,
        })
            .then(({ data }) => {
                props.onUpdated(data)
            })
            .catch(err => {
                const msg = err.json?.data?.error as unknown as string
                toastError(msg || "An error occured while updating your property")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return <ScrollView style={props.style}>

        <Property1 property={prop} onChange={setProp}
        onClose={props.onClose}
        propertyExtra={prop.lat && prop.lon ? { lat: prop.lat, lng: prop.lon } : undefined} />
        <Property3 property={prop} onChange={setProp} showRotate={true} />
        <Property2 property={prop} onChange={setProp} />
        <FormField labelAlign="left" label="Rules of your place" style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}>
                <CheckBox
                    style={{ width: "100%", marginBottom: 10 }}
                    name="Is your place pet friendly?"
                    checked={prop.petFriendly}
                    onPress={() => {
                        setProp({ ...prop, petFriendly: !prop.petFriendly })
                    }}
                />
                <CheckBox
                    style={{ width: "100%", marginBottom: 10 }}
                    name="Is your place suitable for children?"
                    checked={prop.childrenAllowed}
                    onPress={() => {
                        setProp({ ...prop, childrenAllowed: !prop.childrenAllowed })
                    }}
                />
                <CheckBox
                    style={{ width: "100%", marginBottom: 10 }}
                    name="Is it possible to smoke in your place?"
                    checked={prop.smokingAllowed}
                    onPress={() => {
                        setProp({ ...prop, smokingAllowed: !prop.smokingAllowed })
                    }}
                />
            </View>
        </FormField>

        <View style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 20,
            marginBottom: 20,
            paddingHorizontal: 20
        }}>
            <KButton
                color="greenLight"
                text="Cancel"
                disabled={loading}
                onPress={() => props.onClose && props.onClose()}
            />
            <KButton
                text="Save Changes"
                loading={loading}
                disabled={loading}
                onPress={update}
            />
        </View>
    </ScrollView>
}

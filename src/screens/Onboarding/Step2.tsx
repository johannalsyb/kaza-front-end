import { StyleSheet, View } from "react-native"
import FormField from "../../components/Form/FormField/FormField"
import KTextInput from "../../components/Form/KTextInput/KTextInput"
import Property1 from "../../components/forms/property/Property1"
import KButton from "../../components/KButton/KButton"
import { Property } from "../../components/forms/property"
import { useEffect, useState } from "react"
import Gap from "../../components/Gap/Gap"
import KText from "../../components/KText"
import autocomplete from "../../api/autocomplete"
import variables from '../../styles/variables'
import { useNavigation } from '@react-navigation/native'

type Props = {
    onNext: () => void,
    onChange: (property: Property) => void,
    property: Property,
}

const isValid = (property: Property) => {
    const errors: { [key: string]: string } = {}
    if (!property.location || property.location.length < 3) errors.location = "Invalid location"
    if (!property.type || !property.type.length) errors.type = "Please select a property type"
    if (property.petFriendly === undefined) errors.petFriendly = "Please select if your property is pet friendly"
    if (!property.amenities || property.amenities.length < 3) errors.amenities = "Please select at least one amenity"
    return errors
}

const checkAddress = (address: string) => {
    return autocomplete.verify(address)
        .catch(() => {
            return false
        })
}

export default (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<{ [key: string]: string }>({})
    const navigation = useNavigation()

    return <>
        <Property1 property={props.property} onChange={props.onChange} error={error} />
        <View style={styles.container}>
            <KButton
                text="Back"
                onPress={() => navigation.goBack()}
                color="light"
                style={{
                    ...styles.button,
                    backgroundColor: variables.colors.lightCream,
                    borderWidth: 0,
                }} />
            <KButton
                text="Next"
                loading={loading}
                disabled={Object.keys(isValid(props.property)).length > 0}
                onPress={() => {
                    setLoading(true)
                    checkAddress(props.property.location)
                        .then(result => {
                            if (!result) {
                                setError({ ...error, location: "Please enter a valid address" })
                                return
                            }
                            props.onNext()
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                }}
                color="primary"
                style={styles.button} />


        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        maxWidth: 150,
        width: '100%',

    }
})
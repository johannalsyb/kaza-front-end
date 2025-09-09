import { StyleSheet, TextStyle, View } from 'react-native';
import FormField from '../../Form/FormField/FormField';
import KTextInput from '../../Form/KTextInput/KTextInput';
import variables from '../../../styles/variables';
import KIcon from '../../KIcon/KIcon';
import { useEffect, useState } from 'react';
import { Property } from '.';
import autocomplete from '../../../api/autocomplete';
import KText from '../../KText';
import KModal from '../../KModal/KModal';
import useIsMobile from '../../../hooks/useIsMobile';

const inputStyles: TextStyle = {
  textAlign: 'left',
  height: variables.button.size.medium.height,
  padding: 10,
  marginBottom: 3,
  marginLeft: 30,
};

type Props = {
  onChange?: (property: Property) => void;
  property: Property;
  error?: {
    location?: string;
  };
  propertyExtra?: {
    lat: number;
    lng: number;
  };
  onClose?: () => void;
};

const amenities = [
  // Place
  'Garden',
  'Balcony',
  'Terrace',
  'Ground floor',
  'Rooftop',
  // Temp control
  'Heating',
  'A/C',
  //Kitchen
  'Refrigerator',
  'Coffee machine',
  'Microwave',
  'Oven',
  'Barbecue',
  'Dishwasher',
  // Clothes
  'Iron',
  'Washing machine',
  'Dryer',
  'Closet space',
  // Stuff
  'Crib',
  'Hair dryer',
  'TV',
  'Fireplace',
  'Desk',
  'Wi-Fi',
  // Outside
  'Parking spot',
  'Jacuzzi',
  'Swimming pool',
  'Wheelchair accessible',
];

export default (props: Props) => {
  const [property, setProperty] = useState<Property>(props.property);
  const [modal, setModal] = useState<string | null>(null);
  const [showIncorrectAddress, setShowIncorrectAddress] = useState(false);
  const [lastValidatedAddress, setLastValidatedAddress] = useState('');
  const validateAddress = async (address: string) => {
    if (!address.trim()) {
      setShowIncorrectAddress(false);
      return;
    }

    // Don't validate again if it's the same address we just checked
    if (address === lastValidatedAddress) return;

    try {
      const results = await autocomplete.address(address);
      const isValid = results.data.results.length > 0;
      setShowIncorrectAddress(!isValid);
      setLastValidatedAddress(isValid ? address : '');
    } catch (error) {
      setShowIncorrectAddress(true);
      setLastValidatedAddress('');
    }
  };

  const handleAddressChange = (location: string) => {
    setProperty({ ...property, location });
    validateAddress(location);
  };

  // Add this effect to hide the message when typing starts
  useEffect(() => {
    if (property.location !== lastValidatedAddress) {
      setShowIncorrectAddress(false);
    }
  }, [property.location, lastValidatedAddress]);
  useEffect(() => {
    props.onChange && props.onChange(property);
  }, [property]);

  const autocompleteAddress = (address: string) => {
    return autocomplete
      .address(address)
      .then(res => {
        return res.data.results.map(r => r.description);
      })
      .catch(err => [] as string[]);
  };
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const { isMobile } = useIsMobile();
  const initialAmenitiesCount = Math.ceil(amenities.length / 2);
  const displayedAmenities =
    isMobile || showAllAmenities
      ? amenities
      : amenities.slice(0, initialAmenitiesCount);

  const marginVertical = isMobile ? 10 : 20


  return (
    <View>
      <View style={[
        {
          backgroundColor: variables.colors.lightGrey,
          borderRadius: isMobile ? 0 : 20,
          borderBottomRightRadius: 23,
          borderBottomLeftRadius: 23,
          flex: 1,
          marginRight: isMobile ? 0 : 20,
          marginBottom: isMobile ? 0 : marginVertical,
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
          justifyContent: 'center',
          flexDirection: "column",
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? undefined : 900,
        },
        !isMobile && { alignItems: 'center' },
      ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <KIcon name='backArrow' size={'large'} style={{ width: 40, height: 40, backgroundColor: "white", borderRadius: 100 }}
            onPress={props.onClose}></KIcon>
          <KText style={{ fontSize: 17, fontWeight: '400' }}>Edit My Place</KText>
          <View style={{ width: 40, height: 40 }} />
        </View>

      </View>

      <FormField
        label="What is your address?"
        style={{ zIndex: 100, paddingHorizontal: 20, marginTop: isMobile ? 22 : 0 }}
        gapBeforeChildren={false}
        gapAfterChildren={false}>
        <KTextInput
          leftComponent={
            <KIcon
              name="location"
              size="medium"
              style={{ opacity: 0.5, }}
            />
          }
          placeholder="42 Elm Road, New York, NY 10001, USA"
          value={property.location}
          inputStyles={inputStyles}
          suggestionCallback={autocompleteAddress}
          onChangeText={handleAddressChange} // Updated handler
          error={props.error?.location}
        />
      </FormField>

      <KModal
        visible={!!modal}
        setVisibility={visible => {
          setModal(null);
        }}
        style={{
          padding: 20,
          paddingTop: 40,
          backgroundColor: variables.colors.white,
          borderRadius: 10,
        }}>
        <KText>{modal}</KText>
      </KModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  containerSwap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  containerAmenities: {
    gap: 40,
  },
  button: {
    borderRadius: 20,
    fontSize: variables.font.size.normal,
    letterSpacing: -0.5,
    maxWidth: 94,
    width: '100%',
    height: 94,
  },
  buttonMobile: {
    maxWidth: '48%',
    height: 45,
  },
  labelText: {
    color: '#000',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 13,
    letterSpacing: -0.5,
  },
  incorrectAddressBox: {
    backgroundColor: '#FF784E',
    position: 'relative',

    marginTop: -12,
    alignItems: 'center',

    borderRadius: 28,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    paddingRight: 5,
  },
  incorectaddressMessage: {
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: -0.4,
    color: '#18181DF5',
  },
  icon: {
    borderRadius: 36,
    border: '1px solid rgba(0, 0, 0, 0.20)',
    background: '#FFF',
    padding: 7,
    backgroundColor: variables.colors.white,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 20,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    maxWidth: 300,
  },
  showMoreButton: {
    width: '100%',
    maxWidth: 115,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    cursor: 'pointer',
    gap: 4,
  },
  showMoreText: {
    color: variables.colors.black,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationColor: '#979090ff',
  },
});

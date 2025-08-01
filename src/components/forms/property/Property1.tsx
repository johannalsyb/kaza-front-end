import {Animated, Pressable, StyleSheet, TextStyle, View} from 'react-native';
import FormField from '../../Form/FormField/FormField';
import KTextInput from '../../Form/KTextInput/KTextInput';
import variables from '../../../styles/variables';
import KIcon from '../../KIcon/KIcon';
import {useEffect, useState} from 'react';
import KButton from '../../KButton/KButton';
import CheckBox from '../../CheckBox/CheckBox';
import {Property} from '.';
import autocomplete from '../../../api/autocomplete';
import MapView from '../../MapView';
import KText from '../../KText';
import KModal from '../../KModal/KModal';
import useIsMobile from '../../../hooks/useIsMobile';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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
  'Wi-fi',
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
    setProperty({...property, location});
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
  const {isMobile} = useIsMobile();
  const initialAmenitiesCount = Math.ceil(amenities.length / 2);
  const displayedAmenities =
    isMobile || showAllAmenities
      ? amenities
      : amenities.slice(0, initialAmenitiesCount);

  return (
    <>
      <FormField
        label="What is your exact address ?"
        style={{zIndex: 100}}
        gapBeforeChildren={false}
        gapAfterChildren={false}>
        <KTextInput
          leftComponent={
            <KIcon
              name="location"
              size="medium"
              style={{opacity: 0.5, }}
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

      {showIncorrectAddress && (
        <View style={[styles.incorrectAddressBox,{  width: isMobile? '108%':'105%',  marginTop: isMobile?-14:-25,  }]}>
          <KText style={[styles.incorectaddressMessage , {fontSize: isMobile ? 13 : 15,} ]}
      numberOfLines={1}
          >
            You need to put the exact address of your place
          </KText>
          <Pressable
            onPress={() => setShowIncorrectAddress(false)}
            style={{zIndex: 232}}>
            <KIcon
              name="closeBtn"
              size={'large'}
              style={{color: 'black'}}
            />
          </Pressable>
        </View>
      )}

      {props.propertyExtra && (
        <MapView
          lat={props.propertyExtra?.lat}
          lng={props.propertyExtra?.lng}
          points={[props.propertyExtra]}
          zoom={17}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
      )}

      <FormField
        labelAlign="left"
        label="What do you want to swap?"
        style={{
          height: isMobile ? 140 : 'auto',
          paddingTop: isMobile ? 20 : 10,
        }}
        gapBeforeChildren={false}
        gapAfterChildren={false}>
        <View style={[styles.container, styles.containerSwap]}>
          <KButton
            style={{
              ...styles.button,
              ...(isMobile && styles.buttonMobile),
            }}
            color={property.type === 'room' ? 'primary' : 'light'}
            text="Room"
            onPress={() => setProperty({...property, type: 'room'})}
          />
          <KButton
            style={{
              ...styles.button,
              ...(isMobile && styles.buttonMobile),
            }}
            color={property.type === 'flat' ? 'primary' : 'light'}
            text="Flat"
            onPress={() => setProperty({...property, type: 'flat'})}
          />
          <KButton
            style={{
              ...styles.button,
              ...(isMobile && styles.buttonMobile),
            }}
            color={property.type === 'studio' ? 'primary' : 'light'}
            text="Studio"
            onPress={() => setProperty({...property, type: 'studio'})}
          />
          <KButton
            style={{
              ...styles.button,
              ...(isMobile && styles.buttonMobile),
            }}
            color={property.type === 'house' ? 'primary' : 'light'}
            text="House"
            onPress={() => setProperty({...property, type: 'house'})}
          />
        </View>
      </FormField>

      <FormField
        labelAlign="left"
        label="Pets friendly?"
        style={{paddingTop: isMobile ? 20 : 10}}
        gapBeforeChildren={false}
        gapAfterChildren={false}>
        <View style={[styles.container, {gap: 6}]}>
          <KButton
            style={{width: '48%', marginBottom: 10}}
            color={property.petFriendly ? 'primary' : 'light'}
            text="Yes"
            onPress={() => setProperty({...property, petFriendly: true})}
          />
          <KButton
            style={{width: '48%', marginBottom: 10}}
            color={
              property.petFriendly !== undefined && !property.petFriendly
                ? 'primary'
                : 'light'
            }
            text="No"
            onPress={() => setProperty({...property, petFriendly: false})}
          />
        </View>
      </FormField>

      <FormField
        labelAlign="left"
        label="Add some amenities (3 minimum)"
        style={{paddingTop: isMobile ? 15 : 10, marginBottom: 0}}
        gapBeforeChildren={false}
        gapAfterChildren={false}>
        <View style={[styles.container, {rowGap: 15, marginTop: 0}]}>
          {displayedAmenities.map((amenity, i) => {
            return (
              <CheckBox
                key={i}
                // margin bottom fixed
                // style={{ width: "48%", marginBottom: 14 }}
                style={{maxWidth: 150, width: '100%'}}
                name={amenity}
                checked={property.amenities.includes(amenity)}
                onPress={() => {
                  const ams = property.amenities.includes(amenity)
                    ? property.amenities.filter(a => a !== amenity)
                    : [...property.amenities, amenity];
                  setProperty({...property, amenities: ams});
                }}
              />
            );
          })}
        </View>
      {!isMobile && (
  <Pressable
    onPress={() => setShowAllAmenities(!showAllAmenities)}
    style={styles.showMoreButton}>
    <KText style={styles.showMoreText}>
      {showAllAmenities ? 'Show less' : 'Show more'}
    </KText>
    <Animated.View style={{
      transform: [{
        rotate: showAllAmenities ? '180deg' : '0deg'
      }],
      opacity: 0.7 
    }}>
      <KIcon
        name="down"
        size={'large'}
        style={{ color: 'black' }}
      />
    </Animated.View>
  </Pressable>
)}
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
    </>
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
    flexDirection: 'row',
    marginTop: -12,
    
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 28,
  paddingTop:10,
  paddingBottom:10,
  paddingLeft:8,
  paddingRight:5,
    
  },
  incorectaddressMessage: {
textAlign:'center',
fontWeight:'400',
lineHeight:16,
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
width:'100%',
maxWidth:115,
    marginTop: 10,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  alignSelf: 'flex-start',
  gap: 4, 
  },
  showMoreText: {
   
      color: variables.colors.black,
  fontWeight: '500',
  textDecorationLine: 'underline',
  textDecorationColor: '#979090ff',
  },
});

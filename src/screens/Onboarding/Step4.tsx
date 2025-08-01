import {Pressable, View} from 'react-native';
import KButton from '../../components/KButton/KButton';
import {Property} from '../../components/forms/property';
import Property3 from '../../components/forms/property/Property3';
import properties from '../../api/properties';
import {toastError} from '../../components/Toast/Toast';
import {useEffect, useState} from 'react';
import KText from '../../components/KText';
import KIcon from '../../components/KIcon/KIcon';

type Props = {
  onPrev: () => void;
  onNext: () => void;
  onChange: (property: Property) => void;
  property: Property;
};

export default (props: Props) => {
  const [showImageNotification, setShowImageNotification] = useState(false);
  
    
  useEffect(() => {
    if (props.property.pics.length >= 4 && showImageNotification) {
      setShowImageNotification(false);
    }
  }, [props.property.pics.length, showImageNotification]);


  const handleNextStep = () => {
    if (props.property.pics.length < 4) {
      setShowImageNotification(true);
      return;
    }

    if (props.property.primaryImage) {
      properties
        .update({
          id: props.property.id,
          primaryImage: props.property.primaryImage,
        })
        .then(p => {
          props.onChange({...props.property, id: p.data.id});
          props.onNext();
        })
        .catch(() => {
          toastError('An error occurred while updating your property');
        });
    } else {
      props.onNext();
    }
  };
  return (
    <>
      <Property3
        property={props.property}
        onChange={props.onChange}
        showImageNotification={showImageNotification}
        setShowImageNotification={setShowImageNotification}
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginTop: 80,
          // marginBottom: 20
        }}>
        <KButton
          text="Back"
          // loading={loading}
          // disabled={loading || Object.keys(error).length > 0}
          onPress={props.onPrev}
          color="greenLight"
          style={{width: '48%'}}
        />

        <KButton
          text="Next Step"
          // loading={loading}
          disabled={props.property.pics.length < 4}
          onPress={handleNextStep}
          color="primary"
          style={{width: '48%'}}
        />
      </View>
      <View style={{height: 10}} />
    </>
  );
};

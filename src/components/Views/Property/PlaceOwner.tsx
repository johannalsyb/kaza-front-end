import KText from '../../KText';
import {View, StyleSheet, Pressable} from 'react-native';
import {Property} from '../../../common/types/api/properties';
import variables from '../../../styles/variables';
import {CircleImage} from '../../CircleImage/CircleImage';
import Gap from '../../Gap/Gap';
import {IconText} from '../../IconText/IconText';
import SwapRequestButton, { SwapRequestButtonHandle } from '../../SwapRequestButton/SwapRequestButton';
import useIsMobile from '../../../hooks/useIsMobile';
import useAuthentication from '../../../hooks/useAuthentication';
import { useRef, useState } from 'react';

type Props = {
  property?: Property;
  hideSwapRequestButton?: boolean;
};

export default ({
  property,
  hideSwapRequestButton
}: Props) => {
  const {isMobile} = useIsMobile();
  const {user} = useAuthentication();
  const swpReqButtonRef = useRef<SwapRequestButtonHandle>(null);
  const [showMore, setShowMore] = useState(false);


  const showMoreTextComponent  = () => {
      const wordLimit = isMobile ? 10 : 20;
      const words = property?.owner?.hobby.trim().split(/\s+/) || [];
      const isLongText = words.length > wordLimit;
      const displayedText : any = showMore || !isLongText
        ? property?.owner?.hobby
        : words.slice(0, wordLimit).join(' ') + '...';


      return (
        <>
          <KText style={{ textAlign: "center", fontWeight: '500',lineHeight: isMobile ? 21 : 22, fontSize: isMobile ? 15 : 16,letterSpacing: -0.5 }}>
            {displayedText} {isLongText && (
            <Pressable onPress={() => setShowMore(!showMore)}style={{}}>
              <KText style={{ color: 'black',fontSize: isMobile ? 14 : 16, fontWeight: '800',textDecorationLine: 'underline' }}>
                {showMore ? 'Show Less' : 'Show More'}
              </KText>
            </Pressable>
          )}
          </KText>
          <Gap size="xsmall" vertical />
        </>
      )

  };
 

  if (!property?.owner) return <KText>Loading...</KText>;
  else return <View style={styles.container}>
    <KText style={styles.lightText}>{swpReqButtonRef.current?.hasActiveSwapRequest() ? "" : "Place Owner"}</KText>
    <Gap size="small" vertical />
    <View style={styles.avatar}>
      <CircleImage
        size="small"
        imageId={`${property.owner.id}/${property.owner.primaryImage}`}
        type="users"
        style={{borderWidth: 4,}}
       
      />

    </View>
    <Gap size="medium" vertical />
    <KText style={{fontSize: isMobile ? 24 : 30, textAlign: 'center', fontWeight: '600', letterSpacing: -0.5}}>{property.owner.firstName}</KText>
    <Gap size="xsmall" vertical />
    <IconText
      size="medium"
      iconName="location"
      text={`${property.city}, ${property.country}`}
    />
    <Gap size="xsmall" vertical />
     {!!property.owner.hobby && showMoreTextComponent()}
     {!!property.owner.job && (  
      <IconText numberOfLines={2} style={{textAlign: 'center',fontWeight: '400', lineHeight: 15}} size="medium" iconName="job" text={property.owner.job} />
     )} 
     
    {isMobile && <Gap size="xsmall" vertical />}
    {isMobile && <Gap size="xsmall" vertical />}

    <View style={{
        position: isMobile ? undefined : "absolute",
        top: isMobile ? "auto" : 20,
        right: isMobile ? "auto" : 20,
        display: (!user || user.id !== property.owner.id) && !hideSwapRequestButton ? "flex" : "none"
    }}>
      <SwapRequestButton
        ref={swpReqButtonRef}
        property={property}
        buttonStyle="primary"
        iconStyle={{color: variables.colors.yellow}}
        hideIcon={true}
      />
    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    paddingVertical:24,
    paddingHorizontal: variables.spacing.medium,
    maxWidth: 700,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: variables.colors.yellow,
  },
  lightText: {
    opacity: 0.5,
    width: '100%',
    textAlign: 'left',
  },
  avatar: {},
});

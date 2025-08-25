import KText from '../../KText';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Property} from '../../../common/types/api/properties';
import variables from '../../../styles/variables';
import Gap from '../../Gap/Gap';
import {IconText} from '../../IconText/IconText';
import {formatFriendlyDate} from '../../../utils/date';
import KButton from '../../KButton/KButton';
import useAuthentication from '../../../hooks/useAuthentication';
import {showSignInAtom, showSwapNowAtom} from '../../../atoms';
import {useAtomValue, useSetAtom} from 'jotai';
import KIcon from '../../KIcon/KIcon';

type Props = {
  property?: Property;
};

export default ({property}: Props) => {
  const user = useAuthentication();
  const [showSwapNow, setShowSwapNow] = [
    useAtomValue(showSwapNowAtom),
    useSetAtom(showSwapNowAtom),
  ];

  if (!property?.owner)
    return <ActivityIndicator color={variables.colors.yellow} />;
  else {
    const {
      owner: {firstName, dateFrom, dateTo, swapLocations},
      city,
      country,
    } = property;
    const availableDateText =
      dateFrom && dateTo
        ? `${formatFriendlyDate(new Date(dateFrom))} - ${formatFriendlyDate(
            new Date(dateTo),
          )}`
        : 'Flexible';
    const swapForText = swapLocations?.split('\n') || ['Flexible'];
    
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'column',
            gap:16
          }}>
            <KText style={styles.availableDatesSlot}>Preferred dates by Host </KText>
         
          <View style={styles.infoTopContainer}>
            <View 
              style={{flexDirection: 'row', alignItems: 'center', gap: 8,}}>
              <IconText
                size="small"
                iconName="calendar"
                text={availableDateText}
                style={styles.availableDates}
              />
             
            </View>
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal:24,
    paddingVertical: 19,
    height: 104,
    // aspectRatio: 620 / 155,
    borderRadius: 20,
    backgroundColor: variables.colors.greenLight,
    marginBottom: 50,
  },
  infoTopContainer: {
    width: '100%',
    margin:'auto'
  },
  availableDatesSlot:{
    fontWeight:'600',
    fontSize: 15,
    lineHeight: 12,
    letterSpacing: -0.5
  },
  availableDates: {
    paddingVertical: 8,
    width: 182,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderColor: '#C6C5BA80',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: variables.colors.white,
  },
});

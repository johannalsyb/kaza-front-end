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
    console.log('property:-', property);
    return (
      <View style={styles.container}>
        <View
          style={{
            // display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            gap: 8,
          }}>
          <View style={styles.textIconCard}>
            <KIcon name="location" size="large" style={{opacity: 0.4}} />
            <KText
              style={[styles.locationText, {fontWeight: '500',fontSize:16}]}
              numberOfLines={2}>
              {`${city}, ${country}`}
            </KText>
          </View>
          <View style={styles.textIconCard}>
            <KIcon name="calendar" size="large" style={{opacity: 0.4}} />
            <KText
              style={[
                styles.locationText,
                {
                  backgroundColor: variables.colors.greenLight,
                  fontWeight: '400',
                  paddingHorizontal: 11,
                  paddingVertical: 8,
                  borderRadius: 20,
                  fontSize:15
                },
              ]}
              numberOfLines={1}>
              Swap Availabilities
            </KText>
          </View>
          <View style={styles.infoTopContainer}>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 2}}>
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
    flexDirection: 'row',
    // aspectRatio: 620 / 155,
    borderRadius: 20,
  },
  infoTopContainer: {
    width: '32%',
  },
  infoBottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: variables.spacing.small,
  },
  lightText: {
    opacity: 0.4,
    marginBottom: variables.spacing.xsmall,
  },
  textIconCard: {
    width: '32%',
    backgroundColor: variables.colors.white,
    flexDirection: 'column',
    height: 126,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  locationText: {
    color: variables.colors.black,
    marginTop: 6,
    fontSize: 16,
    
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  availableDates: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: variables.colors.white,
  },
});

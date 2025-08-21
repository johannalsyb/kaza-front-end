import dayjs from 'dayjs';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSetAtom } from 'jotai';

import variables from '../../../styles/variables';
import KText from '../../../components/KText/index';
import KIcon from '../../../components/KIcon/KIcon';
import useIsMobile from '../../../hooks/useIsMobile';
import { showModalCalendarAtom } from '../../../atoms';
import AvalibleSlot from './DateSlot';

const ListAvailbleDates = (props: any) => {
  const { items, setSelectedDate } = props;

  const { isMobile } = useIsMobile();

  return (
    <View style={{ width: '100%' }}>
      <View style={[styles.container]}>
        {((items.length && isMobile) || !isMobile) && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto',
              gap: isMobile ? undefined : 20,
              width: '100%',
              marginBottom: isMobile ? 0 : 20,
              borderRadius: 20,
            }}>
            <KText
              style={[
                styles.label,
                {
                  fontSize: isMobile ? 25 : 20,
                  fontWeight: isMobile ? '600' : '500',
                  backgroundColor: isMobile ? '' : variables.colors.lightCream,
                },
              ]}>
              List of available dates
            </KText>
          </View>
        )}
        <View style={{ paddingHorizontal: isMobile ? 16 : 30, }}>
          {items?.length > 0 && !isMobile && (
            <KText
              style={{
                fontSize: 12,
                opacity: 0.6,
                fontWeight: '500',
                marginBottom: 14,
              }}>
              Preferred dates by Host
            </KText>
          )}
          {items?.length > 0 && (
            <View
              style={[
                styles.container,
                {
                  rowGap: 10,
                  marginTop: isMobile ? 15 : 0,
                  marginBottom: isMobile ? 0 : 14,
                },
              ]}>
              {items.map((item: any) => (
                <AvalibleSlot
                  key={item.id}
                  dates={item}
                  onPress={(range) => {
                    setSelectedDate(range)
                  }}
                />
              ))}
            </View>
          )}
          {!isMobile && <View style={styles.availablelistDatesdivider} />}
        </View>
      </View>
    </View>
  );
};

export default ListAvailbleDates;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  containerButtons: {
    maxWidth: '60%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    margin: 'auto',
    marginTop: 61,
  },
  label: {
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    flex: 1,
    margin: 'auto',
    lineHeight: 13,
    letterSpacing: -0.5,
    paddingVertical: 20,
    borderEndEndRadius: 28,
    borderEndStartRadius: 28
  },
  containerIcon: {
    backgroundColor: variables.colors.lightCream,
    borderRadius: 100,
    width: 85,
    height: 85,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
  },
  containerNotResults: {
    paddingTop: 50,
    paddingBottom: 105,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelNotResults: {
    width: '100%',
    textAlign: 'center',
    opacity: 0.3,
    marginTop: 12,
    maxWidth: 166,
    fontSize: 17,
    letterSpacing: -0.5,
    lineHeight: 17,
  },
  availablelistDatesdivider: {
    width: '100%',
    margin: 'auto',
    height: 1,
    marginVertical: 26,
    borderRadius: 20,
    backgroundColor: '#C6C5BA',
    marginTop: 10,
    marginBottom: 10,
  },
});

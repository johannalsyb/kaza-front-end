import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
// import variables from '../../../../styles/variables'
import variables from '../../../styles/variables';

import KText from '../../../components/KText/index';
import KIcon from '../../../components/KIcon/KIcon';
// import AvalibleSlot from './AvalibleSlot'
import AvalibleSlot from '../../Screens/Onboarding/CalendarComponent/AvalibleSlot';

import dayjs from 'dayjs';
import {useSetAtom, useAtomValue} from 'jotai';
// import { showAlert } from '../../../../atoms'

import useIsMobile from '../../../hooks/useIsMobile';

import KButton from '../../../components/KButton/KButton';
import {showModalCalendarAtom} from '../../../atoms';
const ListAvailbleDates = (props: any) => {
  const {items, setItems, onPressEdit} = props;
  console.log('items', items);
  const setShowCalendarModal = useSetAtom(showModalCalendarAtom);

  const handleClickDelete = (id: number) => {
    const updatedItems = items.filter((item: any) => item.id !== id);
    setItems(updatedItems);
  };

  const range = (item: any) => {
    if (!item || !item.value || !item.value[0] || !item.value[1]) return '';
    return `${dayjs(item.value[0]).format('MMM DD')} - ${dayjs(
      item.value[1],
    ).format('MMM DD')}`;
  };
  const {isMobile} = useIsMobile();
  return (
    <View style={{position: 'relative', width: '100%'}}>
      <View style={[styles.container]}>
        {((items.length && isMobile) || !isMobile) && (
          <View
            style={{
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              margin: 'auto',
              gap: isMobile ? undefined : 20,
              width: '100%',
              backgroundColor: isMobile ? '' : variables.colors.greenLight,
              paddingVertical: isMobile ? 0 : 15,
              marginBottom: isMobile ? 0 : 20,
              borderRadius: 20,
            }}>
            {isMobile && <View style={styles.divider} />}

            <KText
              style={[
                styles.label,
                {
                  fontSize: isMobile ? 25 : 20,
                  fontWeight: isMobile ? '600' : '500',
                },
              ]}>
              List of available dates
            </KText>
            {!isMobile && (
              <KIcon
                onPress={() => {
                  setShowCalendarModal(false);
                }}
                name="closeBtn"
                size={'large'}
                style={{
                  color: '#000000',
                  position: 'relative',
                  right: 10,
                  opacity: 0.5,
                  
                }}
              />
            )}
          </View>
        )}
        {!isMobile && items?.length > 0 && (
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
                key={item?.id}
                range={range(item)}
                year={
                  item?.value?.[1] ? dayjs(item.value[1]).format('YYYY') : ''
                }
                onPressDelete={() => handleClickDelete(item.id)}
                onPressEdit={() => onPressEdit(item)}
              />
            ))}
          </View>
        )}

        {!isMobile && <View style={styles.availablelistDatesdivider} />}
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
    // columnGap: 23,
  },
  label: {
    // display: 'flex',
    // flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    flex: 1,

    margin: 'auto',
    lineHeight: 13,
    letterSpacing: -0.5,
    paddingVertical: 10,
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
  divider: {
    // flex: 1,
    width: 34,
    margin: 'auto',
    height: 2,
    borderRadius: 20,
    backgroundColor: '#FFE361',
    marginTop: 10,
    marginBottom: 10,
  },
  availablelistDatesdivider: {
    // flex: 1,
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

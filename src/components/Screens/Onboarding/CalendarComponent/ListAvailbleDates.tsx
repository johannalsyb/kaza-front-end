import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import variables from '../../../../styles/variables'
import KText from '../../../KText'
import KIcon from '../../../KIcon/KIcon'
import AvalibleSlot from './AvalibleSlot'
import dayjs from 'dayjs'
import { useSetAtom, useAtomValue } from 'jotai'
import { showAlert } from '../../../../atoms'

const ListAvailbleDates = (props: any) => {
  const { items, setItems, onPressEdit } = props
  const setShowAlert = useSetAtom(showAlert)
  const valueAlert = useAtomValue(showAlert)
  const handleClickDelete = (id: number) => {
    setShowAlert({
      open: true,
      title: 'Delete date',
      message: 'Are you sure you want to delete this date?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        const updatedItems = items.filter((item: any) => item.id !== id)
        setItems(updatedItems)
      },
      onClose: () => setShowAlert({ ...valueAlert, open: false })
    })

  }

  const range = (item: any) => {
    if (!item || !item.value || !item.value[0] || !item.value[1]) return ''
    return `${dayjs(item.value[0]).format('MMM DD')} - ${dayjs(item.value[1]).format('MMM DD')}`
  }
  return (
    <>
      <View style={[styles.container]}>
        <KText style={styles.label}>
          List of available dates
          <View style={styles.divider} />
        </KText>
        {
          items?.length ?
            <View style={[styles.container, { rowGap: 10, marginTop: 34, marginBottom: 160 }]}>
              {items.map((item: any) => (
                <AvalibleSlot
                  key={item?.id}
                  range={range(item)}
                  year={item?.value?.[1] ? dayjs(item.value[1]).format('YYYY') : ''}
                  onPressDelete={() => handleClickDelete(item.id)}
                  onPressEdit={() => onPressEdit(item)}
                />

              ))}
            </View> :
            <View style={styles.containerNotResults}>
              <View style={styles.containerIcon}>
                <KIcon name="smile" style={styles.icon} />
              </View>
              <KText style={styles.labelNotResults}>
                Add your available dates now!
              </KText>
            </View>
        }
      </View>


    </>
  )
}

export default ListAvailbleDates

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    fontSize: 15
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
    lineHeight: 17
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 18
  }

})
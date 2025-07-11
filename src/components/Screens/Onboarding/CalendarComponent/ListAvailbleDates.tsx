import React from 'react'
import { StyleSheet, View } from 'react-native'
import KText from '../../../KText'
import KIcon from '../../../KIcon/KIcon'
import variables from '../../../../styles/variables'

const ListAvailbleDates = (props: any) => {
  const { items } = props
  return (
    <View style={[styles.container]}>
      <KText style={styles.label}>
        List of available dates
      </KText>
      {items?.length ?
        <>length</> :
        <>
          <View style={styles.containerIcon}>
            <KIcon name="smile" style={styles.icon} />
          </View>
          <KText style={{ opacity: 0.5, width: '100%', maxWidth: 166 }}>
            Add your available dates now!
        </KText>
          </>
      }
    </View>
  )
}

export default ListAvailbleDates

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
  }

})
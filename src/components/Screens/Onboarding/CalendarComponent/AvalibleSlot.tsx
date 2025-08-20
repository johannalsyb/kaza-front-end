import React from 'react'
import { StyleSheet, View } from 'react-native'
import KButton from '../../../KButton/KButton'
import KText from '../../../KText'
import variables from '../../../../styles/variables'

interface IAvalibleSlot {
  range: string
  year: string
  onPressDelete: () => void
  onPressEdit: () => void
  readonly?: boolean
}

const AvalibleSlot = (props: IAvalibleSlot) => {
  const { range, year, onPressDelete, onPressEdit, readonly } = props
  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {readonly ? (
          <KButton
            style={styles.button}
            onPress={() => {}}
            icon='calendar'
            iconSize='medium'
            iconStyle={{ margin: 0, opacity: 0.5 }}
            color='light'
          />
        ) : (
          <KButton
            style={styles.button}
            onPress={() => onPressEdit()}
            icon='edit'
            iconSize='medium'
            iconStyle={{ margin: 0 }}
          />
        )}
        <KText style={{ color: '#000', fontSize: 15, marginLeft: 10 }}>
          {range}
          <KText style={{ color: 'rgba(0,0,0,0.5)', marginLeft: 16 }}>{year}</KText>
        </KText>
      </View>
      {!readonly && (
        <KButton
          style={{ ...styles.button, borderWidth: 0, backgroundColor: variables.colors.lightCream }}
          onPress={() => onPressDelete()}
          icon='delete'
          iconSize='medium'
          iconStyle={{ margin: 0, opacity: 0.5 }}
          color='light' />
      )}
    </View>
  )
}

export default AvalibleSlot

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C6C5BA',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  button: {
    margin: 0,
    width: 46,
    height: 46
  }
})
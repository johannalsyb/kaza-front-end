import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import KText from '../../../KText'
import KIcon from '../../../KIcon/KIcon'
import KButton from '../../../KButton/KButton'
import variables from '../../../../styles/variables'
import ListAvailbleDates from './ListAvailbleDates'

const CalendarComponent = () => {
  return (
    <>
      <View style={[styles.container, { justifyContent: 'center', marginBottom: 70, width: '100%' }]}>
        <Pressable onPress={() => { }} style={{ width: '100%' }}>
          <KText style={styles.label}>
            Select dates
          </KText>
          <View style={styles.input}>
            <View style={styles.container}>
              <KText style={{ color: "#000", fontSize: 15, marginLeft: 20, marginRight: 18 }}>
                Nov 23,
                <KText style={{ color: 'rgba(0,0,0,0.5)' }}>2023</KText>
              </KText>
              -
              <KText style={{ color: "#000", fontSize: 15, marginLeft: 18 }}>
                Nov 30,
                <KText style={{ color: 'rgba(0,0,0,0.5)' }}>2023</KText>
              </KText>

            </View>
            <KIcon name="arrowDown" size={'large'} style={{ marginRight: 20 }} />
          </View>
        </Pressable>

        <KButton onPress={() => { }} color='light' style={styles.button} >
          <KIcon name="plusCircle" size="medium" style={{ stroke: '#000', opacity: 0.5 }} />
          <KText style={{ color: "#000", fontSize: 15, marginLeft: 10 }}>
            Add more slots
          </KText>
        </KButton>

      </View >
      <ListAvailbleDates />
    </>
  )
}

export default CalendarComponent

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  label: {
    color: "#000",
    fontSize: 15,
    opacity: 0.5,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 30,
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: variables.colors.lightCream,
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    marginTop: 10,
    borderWidth: 0,
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
})
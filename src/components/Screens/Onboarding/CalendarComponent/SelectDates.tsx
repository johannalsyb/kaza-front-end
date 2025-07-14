import React from 'react'
import KText from '../../../KText'
import KIcon from '../../../KIcon/KIcon'
import { StyleSheet, View } from 'react-native'
import dayjs from 'dayjs'


type ValuePiece = Date | null

type Value = ValuePiece

interface ISelectDatesProps extends React.ComponentPropsWithoutRef<typeof View> {
  startDate: Value
  endDate: Value
}



const SelectDates = (props: ISelectDatesProps) => {
  const { startDate, endDate, style } = props
  return (
    <View style={[{ width: '100%' }, style]}>
      <KText style={styles.label}>
        Select dates
      </KText>
      <View style={styles.input}>
        <View style={styles.container}>
          <KText style={{ color: "#000", fontSize: 15, marginLeft: 20, marginRight: 18 }}>
            {dayjs(startDate).format('MMM DD,')}
            <KText style={{ color: 'rgba(0,0,0,0.5)' }}>{dayjs(startDate).format('YYYY')}</KText>
          </KText>
          -
          <KText style={{ color: "#000", fontSize: 15, marginLeft: 18 }}>
            {dayjs(endDate).format('MMM DD,')}
            <KText style={{ color: 'rgba(0,0,0,0.5)' }}>{dayjs(endDate).format('YYYY')}</KText>
          </KText>

        </View>
        <KIcon name="arrowDown" size={'large'} style={{ marginRight: 20 }} />
      </View>
    </View>
  )
}

export default SelectDates

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  }
})
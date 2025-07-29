import React from 'react'
import Calendar from 'react-calendar'
import './Calendar.css'
import KIcon from '../KIcon/KIcon'
import { StyleSheet } from 'react-native'
type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]


interface KCalendarProps extends React.ComponentPropsWithoutRef<typeof Calendar> {
  onChange: (value: Value) => void
  value: Value,

}

const KCalendar = (props: KCalendarProps) => {
  const { onChange, value, ...rest } = props
  return (
    <Calendar
      {...rest}
      onChange={onChange}
      value={value}
      selectRange
      next2Label={null}
      locale='en-US'
      calendarType="iso8601"
    
      prevLabel={<KIcon name='chevronLeft' size={'large'} style={styles.button} />}
      nextLabel={<KIcon name='chevronRight' size={'large'} style={styles.button} />}
      prev2Label={null} />
  )
}

export default KCalendar

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    backgroundColor: '#FAF9E7',
  }
})
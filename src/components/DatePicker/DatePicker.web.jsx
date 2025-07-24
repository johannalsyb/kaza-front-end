import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import KIcon from '../KIcon/KIcon'
import variables from '../../styles/variables'

const CustomContainer = ({ className, children, isMobile }) => {
  const containerStyle = isMobile ? styles.customContainerMobile : styles.customContainer
  console.log("isMobile: ", isMobile)
  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  )
}

const CustomDatePicker = ({
  onRangeSelected,
  isMobile = false,
  isOpen = false,
  date: externalDate,
  startDate: externalStartDate,
  endDate: externalEndDate
}) => {
  const [date, setDate] = useState(null)
  const [dateRange, setDateRange] = useState([null, null])
  const [open, setOpen] = useState(isOpen)
  const { form } = variables
  const [startDate, endDate] = dateRange

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (isMobile && (externalStartDate !== dateRange[0] || externalEndDate !== dateRange[1])) {
      setDateRange([externalStartDate, externalEndDate])
    }
  }, [externalStartDate, externalEndDate])

  const formatDate = (date) => {
    if (!date) return ''
    const month = date.toLocaleString('en-US', { month: 'short' })
    const day = date.toLocaleString('en-US', { day: '2-digit' })
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  // Handlers
  const handleRangeDateChange = (range) => {
    const [start, end] = range
    setDateRange(range)
    onRangeSelected?.(start, end)
  }

  return (
    <View>
      {open && (
        <View
          style={[
            styles.webPickerContainer,
            isMobile && { position: 'relative', width: '100%' }
          ]}
        >
          <ReactDatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                handleRangeDateChange(update)
              }}
              inline
              dateFormat="dd/MM/yyyy"
              calendarClassName="my-custom-calendar"
              dayClassName={(d) => d.getDay() === 0 ? 'sunday' : undefined}
              calendarContainer={(props) => <CustomContainer {...props} isMobile={isMobile} />}
              minDate={new Date()}
            />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 15,
    marginLeft: 10,
    color: 'gray',
    fontFamily: variables.font.family?.regular ?? 'System',
    flex: 1,
  },
  webPickerContainer: {
    zIndex: 2200,
    position: 'absolute',
  },
  customContainer: {
    position: 'absolute',
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    border: 'none',
    minWidth: 350,
    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.3)',
  },
  customContainerMobile: {
    border: 'none',
  },
})

export default CustomDatePicker

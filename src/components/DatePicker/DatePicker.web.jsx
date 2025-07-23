import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import KIcon from '../KIcon/KIcon'
import variables from '../../styles/variables'

const CustomContainer = ({ className, children, isRange }) => {
  const containerStyle = isRange ? styles.customRangeContainer : styles.customContainer
  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  )
}

const CustomDatePicker = ({
  onDateSelected,
  onRangeSelected,
  label,
  isRange = false,
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
    if (!isRange && externalDate !== date) {
      setDate(externalDate)
    }
  }, [externalDate])

  useEffect(() => {
    if (isRange && (externalStartDate !== dateRange[0] || externalEndDate !== dateRange[1])) {
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
  const handleSingleDateChange = (newDate) => {
    setDate(newDate)
    onDateSelected?.(newDate)
  }
  const handleRangeDateChange = (range) => {
    const [start, end] = range
    setDateRange(range)
    onRangeSelected?.(start, end)
  }


  // Display label
  let displayLabel = label
  if (isRange) {
    if (startDate && endDate) {
      displayLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`
    }
  } else {
    if (date) {
      displayLabel = formatDate(date)
    }
  }

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            gap: 16,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'center',
            display: isRange ? 'none' : 'flex',
            borderWidth: form.input.borderWidth,
            borderRadius: form.input.borderRadius,
            borderColor: form.colors.border.default,
            backgroundColor: form.colors.background.default,
          },
        ]}
        onPress={() => setOpen((prevState) => !prevState)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{displayLabel}</Text>
        <KIcon name="down" size="large" style={{ opacity: 0.5 }} />
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.webPickerContainer,
            isRange && { position: 'relative', width: '100%' }
          ]}
        >
          {isRange ? (
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
              calendarContainer={(props) => <CustomContainer {...props} isRange={true} />}
              minDate={new Date()}
            />
          ) : (
            <ReactDatePicker
              selected={date}
              onChange={(d) => {
                handleSingleDateChange(d)
                setOpen(false)
              }}
              inline
              dateFormat="dd/MM/yyyy"
              calendarClassName="my-custom-calendar"
              dayClassName={(d) => d.getDay() === 0 ? 'sunday' : undefined}
              calendarContainer={(props) => <CustomContainer {...props} isRange={false} />}
              minDate={new Date()}
            />
          )}
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
    top: 42,
    marginLeft: 4,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
  },
  customRangeContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    border: 'none',
  },
})

export default CustomDatePicker

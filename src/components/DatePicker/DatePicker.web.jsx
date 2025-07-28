import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import KIcon from '../KIcon/KIcon'
import variables from '../../styles/variables'

const CustomContainer = ({ className, children, isMobile }) => {
  const containerStyle = isMobile ? styles.customContainerMobile : styles.customContainer
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
  startDate: externalStartDate,
  endDate: externalEndDate
}) => {
  const [dateRange, setDateRange] = useState([null, null])
  const [open, setOpen] = useState(isOpen)
  const [startDate, endDate] = dateRange

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (externalStartDate !== dateRange[0] || externalEndDate !== dateRange[1]) {
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
            showOutsideDays={false}
            calendarClassName="my-custom-calendar"
            dayClassName={(date) => {
              // remove today highlight completely
              const today = new Date()
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
              return isToday ? 'no-today-highlight' : undefined
            }}
            calendarContainer={(props) => <CustomContainer {...props} isMobile={isMobile} />}
            minDate={new Date()}
            renderCustomHeader={({
              date,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => {
              const today = new Date()
              const isCurrentMonth =
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()

              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0'
                  }}
                >
                  <TouchableOpacity
                    onPress={decreaseMonth}
                    disabled={prevMonthButtonDisabled || isCurrentMonth}
                    style={[
                      styles.navButton,
                      isCurrentMonth && { opacity: 0, pointerEvents: 'none' }
                    ]}
                  >
                    <KIcon name="chevronLeft" size="large" />
                  </TouchableOpacity>

                  <span style={styles.monthText}>
                    {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                  </span>

                  <TouchableOpacity
                    onPress={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    style={styles.navButton}
                  >
                    <KIcon name="chevronRight" size="large" />
                  </TouchableOpacity>
                </div>
              )
            }}
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
    maxWidth: 290,
    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.3)',
  },
  customContainerMobile: {
    border: 'none',
  },
  navButton: {
    backgroundColor: variables.colors.greenLight,
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: 4,
  },
})

export default CustomDatePicker

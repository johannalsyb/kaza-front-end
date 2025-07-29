import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import KIcon from '../KIcon/KIcon'
import DatePicker from '../DatePicker'
import variables from '../../styles/variables'

const DesktopDatePicker = ({
  isCalendarOpen,
  setIsCalendarOpen,
  startDate,
  endDate,
  isMobile,
  setStartDate,
  setEndDate,
  onFilter
}) => {
  const calendarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false)
      }
    }

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCalendarOpen])

  return (
    <View
      style={{
        flex: 1,
        gap: 10,
        marginLeft: 18,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
      }}
    >
      <TouchableOpacity
        onPress={() => setIsCalendarOpen(prev => !prev)}
        activeOpacity={0.8}
        style={{
          minWidth: 290,
          borderWidth: 1,
          display: 'flex',
          borderRadius: 30,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4.2,
          paddingHorizontal: 20,
          justifyContent: 'center',
          backgroundColor: variables.colors.white,
          borderColor: variables.colors.borderGray,
        }}
      >
        <View
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 20,
          }}
        >
          <Text
            style={[
              { fontSize: 14, opacity: 0.5, paddingVertical: 4, paddingHorizontal: 6, },
              (startDate || isCalendarOpen) &&
              { backgroundColor: variables.colors.greenLight, borderRadius: 14 }
            ]}>
            {startDate
              ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Start Date'}
          </Text>
          <Text style={{ fontSize: 14, opacity: 0.5 }}>-</Text>
          <Text style={[
            { fontSize: 14, opacity: 0.5, paddingVertical: 4, paddingHorizontal: 6, },
            (startDate || endDate) &&
            { backgroundColor: variables.colors.greenLight, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 14 }
          ]}>
            {endDate
              ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'End Date'}
          </Text>
        </View>
        <KIcon name={'down'} size={30} style={{ opacity: 0.5 }} />
      </TouchableOpacity>

      {isCalendarOpen && (
        <View ref={calendarRef} style={{ position: 'absolute', top: 42, left: 0, zIndex: 100 }}>
          <DatePicker
            isOpen={isCalendarOpen}
            isMobile={isMobile}
            startDate={startDate}
            endDate={endDate}
            onRangeSelected={(start, end) => {
              setStartDate(start)
              setEndDate(end)
              if (start) {
                onFilter({ type: 'startDate', filters: [start.toISOString()] })
              }
              if (end) {
                onFilter({ type: 'endDate', filters: [end.toISOString()] })
                setIsCalendarOpen(false)
              }
            }}
          />
        </View>
      )}
    </View>
  )
}

export default DesktopDatePicker

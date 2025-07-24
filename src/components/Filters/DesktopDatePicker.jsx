import React from 'react'
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
        style={{
          borderWidth: 1,
          borderColor: variables.colors.borderGray,
          borderRadius: 30,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 4.5,
          paddingHorizontal: 20,
          alignSelf: 'center',
          minWidth: 350
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
          <Text style={{ fontSize: 14, opacity: 0.5 }}>
            {startDate
              ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Start Date'}
          </Text>
          <Text style={{ fontSize: 14, opacity: 0.5 }}>-</Text>
          <Text style={{ fontSize: 14, opacity: 0.5 }}>
            {endDate
              ? endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'End Date'}
          </Text>
        </View>
        <KIcon name={'down'} size={30} style={{ opacity: 0.5 }} />
      </TouchableOpacity>
      <View style={{ position: 'absolute', top: 42, left: 0, zIndex: 100 }}>
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
    </View>
  )
}

export default DesktopDatePicker

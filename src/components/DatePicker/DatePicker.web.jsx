import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import KIcon from '../KIcon/KIcon';
import variables from '../../styles/variables';

const MyContainer = ({ className, children }) => {
  return (
    <div style={styles.customContainer} className={className}>
      {children}
    </div>
  );
};

const CustomDatePicker = ({ onDateSelected, label, isRange = false }) => {
  const [date, setDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [open, setOpen] = useState(false);
  const { form } = variables;
  const [startDate, endDate] = dateRange;

  const formatDate = (date) => {
    if (!date) return '';
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.toLocaleString('en-US', { day: '2-digit' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Handlers
  const handleSingleDateChange = (newDate) => {
    setDate(newDate);
    onDateSelected?.(newDate);
  };
  const handleRangeDateChange = (range) => {
    setDateRange(range);
    onDateSelected?.(range);
  };

  // Display label
  let displayLabel = label;
  if (isRange) {
    if (startDate && endDate) {
      displayLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  } else {
    if (date) {
      displayLabel = formatDate(date);
    }
  }

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            position: 'relative',
            backgroundColor: form.colors.background.default,
            borderRadius: form.input.borderRadius,
            borderWidth: form.input.borderWidth,
            borderColor: form.colors.border.default,
          },
        ]}
        onPress={() => setOpen((prevState) => !prevState)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{displayLabel}</Text>
        <KIcon name="down" size="large" style={{ stroke: 'gray' }} />
      </TouchableOpacity>
      {open && (
        <View style={styles.webPickerContainer}>
          {isRange ? (
            <ReactDatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                handleRangeDateChange(update);
                if (update[0] && update[1]) setOpen(false);
              }}
              inline
              dateFormat="dd/MM/yyyy"
              calendarClassName="my-custom-calendar"
              dayClassName={d => d.getDay() === 0 ? 'sunday' : undefined}
              calendarContainer={MyContainer}
              minDate={new Date()}
            />
          ) : (
            <ReactDatePicker
              selected={date}
              onChange={(d) => {
                handleSingleDateChange(d);
                setOpen(false);
              }}
              inline
              dateFormat="dd/MM/yyyy"
              calendarClassName="my-custom-calendar"
              dayClassName={d => d.getDay() === 0 ? 'sunday' : undefined}
              calendarContainer={MyContainer}
              minDate={new Date()}
            />
          )}
        </View>
      )}
    </View>
  );
};

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
    color: 'gray',
    fontFamily: variables.font.family?.regular ?? 'System',
    flex: 1,
  },
  webPickerContainer: {
    zIndex: 2200, // increased zIndex for calendar
    position: 'absolute',
  },
  customContainer: {
    position: 'absolute',
    top: 42,
    marginLeft: 4,
    borderRadius: 20,
    paddingHorizontal: 16, 
    background: "#fff", 
    border: "none",
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
  }
});

export default CustomDatePicker; 
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

const CustomDatePicker = ({ onDateSelected, label }) => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const { form } = variables;

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onDateSelected?.(newDate);
  };

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
        <Text style={styles.buttonText}>
          {date ? date.toLocaleDateString() : label}
        </Text>
        <KIcon name="down" size="large" style={{ stroke: 'gray' }} />
      </TouchableOpacity>
      {open && (
        <View style={styles.webPickerContainer}>
          <ReactDatePicker
            selected={date}
            onChange={(d) => {
              handleDateChange(d);
              setOpen(false);
            }}
            inline
            dateFormat="dd/MM/yyyy"
            calendarClassName="my-custom-calendar"
            dayClassName={d => d.getDay() === 0 ? 'sunday' : undefined}
            calendarContainer={MyContainer}
          />
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
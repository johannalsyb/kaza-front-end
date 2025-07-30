import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import KIcon from '../KIcon/KIcon';
import variables from '../../styles/variables';

const CustomDatePicker = ({ onDateSelected, label }) => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const { form } = variables;

  const handleDateChange = (event, selectedDate) => {
    setOpen(false);
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelected?.(selectedDate);
    }
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
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {date ? date.toLocaleDateString() : label}
        </Text>
        <KIcon name="down" size="large" style={{ stroke: 'gray' }} />
      </TouchableOpacity>
      {open && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
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
});

export default CustomDatePicker; 
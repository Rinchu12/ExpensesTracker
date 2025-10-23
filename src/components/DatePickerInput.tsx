import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface DatePickerInputProps {
  date: Date;
  onChange: (date: Date) => void;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ date, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handlePress = () => setShowPicker(true);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false); // auto-close on Android
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View>
      <TouchableOpacity onPress={handlePress} style={styles.input}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});

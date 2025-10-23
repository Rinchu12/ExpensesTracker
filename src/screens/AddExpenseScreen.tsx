// src/screens/AddExpenseScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { saveExpenses, getExpenses } from '../utils/storage';
import { CATEGORIES } from '../constants/categories';
import { Expense } from '../types/Expense';
import { SCREENS } from '../constants/screens';
import DatePickerInput from '../components/DatePickerInput';

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

const AddExpenseScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());

  const handleSave = async () => {
    if (!amount) return;
    const newExpense: Expense = {
      id: generateId(),
      amount: Number(amount),
      category,
      note,
      date: date.toISOString().split('T')[0],
    };
    const current = await getExpenses();
    await saveExpenses([...current, newExpense]);
    navigation.navigate(SCREENS.Home);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <Picker selectedValue={category} onValueChange={setCategory}>
        {CATEGORIES.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <TextInput
        placeholder="Note (optional)"
        style={styles.input}
        value={note}
        onChangeText={setNote}
      />

      <DatePickerInput date={date} onChange={setDate} />

      <Button title="Save Expense" onPress={handleSave} />
    </View>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 },
});
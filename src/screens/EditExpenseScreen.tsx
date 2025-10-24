import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getExpenses, saveExpenses } from '../utils/storage';
import { CATEGORIES } from '../constants/categories';
import { SCREENS } from '../constants/screens';
import DatePickerInput from '../components/DatePickerInput';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EditExpense'>;

const EditExpenseScreen: React.FC<Props> = ({ route, navigation }) => {
  const { expense } = route.params;

  const [amount, setAmount] = useState<string>(expense.amount.toString());
  const [category, setCategory] = useState<string>(expense.category);
  const [note, setNote] = useState<string>(expense.note || '');
  const [date, setDate] = useState<Date>(new Date(expense.date));
  const {theme} = useTheme();

  const handleSave = async () => {
    if (!amount || Number(amount) === 0) return;
    const current = await getExpenses();
    const updatedExpenses = current.map((e) =>
      e.id === expense.id
        ? { ...e, amount: Number(amount), category, note, date: date.toISOString().split('T')[0] }
        : e
    );
    await saveExpenses(updatedExpenses);
    navigation.navigate(SCREENS.Home);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        placeholder="Amount"
        placeholderTextColor={theme.secondaryText}
        keyboardType="numeric"
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        value={amount}
        onChangeText={setAmount}
      />

      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={{ color: theme.text, marginBottom: 10 }}
      >
        {CATEGORIES.map(cat => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <TextInput
        placeholder="Note (optional)"
        placeholderTextColor={theme.secondaryText}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        value={note}
        onChangeText={setNote}
      />

      <DatePickerInput date={date} onChange={setDate} theme={theme} />

      <Button title="Update Expense" onPress={handleSave} color={theme.primary} />
    </View>
  );
};

export default EditExpenseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 8 },
})
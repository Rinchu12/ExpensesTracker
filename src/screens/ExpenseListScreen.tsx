import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getExpenses, saveExpenses } from '../utils/storage';
import { Expense } from '../types/Expense';
import ExpenseCard from '../components/ExpenseCard';
import { SCREENS } from '../constants/screens';
import { CATEGORIES } from '../constants/categories';
import DatePickerInput from '../components/DatePickerInput';
import { showAlert } from '../utils/alertUtil';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ExpenseList'>;

const ExpenseListScreen: React.FC<Props> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
const {theme} = useTheme();
  /** 🧩 Load expenses on focus */
  const loadExpenses = useCallback(async () => {
    const data = await getExpenses();
    setExpenses(data);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadExpenses);
    return unsubscribe;
  }, [navigation, loadExpenses]);

  /** 🧮 Filter expenses based on category and date */
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchCategory =
        selectedCategory === 'All' || exp.category === selectedCategory;

      const expDate = new Date(exp.date);
      const matchFromDate = fromDate ? expDate >= fromDate : true;
      const matchToDate = toDate ? expDate <= toDate : true;

      return matchCategory && matchFromDate && matchToDate;
    });
  }, [expenses, selectedCategory, fromDate, toDate]);

  /** 🗑 Delete expense with alert confirmation */
  const handleDelete = useCallback(
    (id: string) => {
      showAlert('Delete', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = expenses.filter(e => e.id !== id);
            await saveExpenses(updated);
            setExpenses(updated);
          },
        },
      ]);
    },
    [expenses],
  );

  /** 🧭 Navigation handlers */
  const handleEditExpense = useCallback(
    (expense: Expense) => navigation.navigate(SCREENS.EditExpense, { expense }),
    [navigation],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>All Expenses</Text>

      {/* 🗂 Filters */}
      <View>
        <View style={styles.filters}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={value => setSelectedCategory(value)}
            style={{ color: theme.text, marginBottom: 10 }}
          >
            <Picker.Item label="All Categories" value="All" />
            {CATEGORIES.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>

          <DatePickerInput
            date={fromDate || new Date()}
            onChange={date => {
              if (toDate && date > toDate) {
                showAlert('Invalid Date', 'Start date cannot be after end date.');
                return;
              }
              setFromDate(date);
            }}
          />
          <DatePickerInput
            date={toDate || new Date()}
            onChange={date => {
              if (fromDate && date < fromDate) {
                showAlert('Invalid Date', 'End date cannot be before start date.');
                return;
              }
              setToDate(date);
            }}
          />

          <Button
            title="Clear Filters"
            onPress={() => {
              setSelectedCategory('All');
              setFromDate(null);
              setToDate(null);
            }}
            color={theme.primary}
          />
        </View>

        {filteredExpenses.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
            No expenses found.
          </Text>
        ) : (
          <FlatList
            data={filteredExpenses.slice().reverse()}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExpenseCard
                theme={theme}
                item={item}
                onPress={() => handleEditExpense(item)}
                onLongPress={() => handleDelete(item.id)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ExpenseListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  filters: { marginBottom: 16 },
  picker: { height: 50, marginBottom: 10 },
  emptyText: { fontStyle: 'italic', color: '#777' },
});

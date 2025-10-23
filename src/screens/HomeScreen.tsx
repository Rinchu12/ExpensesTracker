// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getExpenses } from '../utils/storage';
import { Expense } from '../types/Expense';
import CategorySummary from '../components/CategorySummary';
import ExpenseCard from '../components/ExpenseCard';
import { SCREENS } from '../constants/screens';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await getExpenses();
      setExpenses(data);
    };
    const unsubscribe = navigation.addListener('focus', loadExpenses);
    return unsubscribe;
  }, [navigation]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Total Spent: ₹{total}</Text>

      <CategorySummary expenses={expenses} />

      <Text style={styles.subHeader}>Recent Expenses</Text>
      {recentExpenses.length === 0 ? (
        <Text>No expenses yet.</Text>
      ) : (
        <FlatList
          data={recentExpenses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExpenseCard
              item={item}
              onPress={() => navigation.navigate(SCREENS.EditExpense, { expense: item })}
            />
          )}
        />
      )}

      <View style={styles.buttons}>
        <Button title="Add Expense" onPress={() => navigation.navigate(SCREENS.AddExpense)} />
        <View style={{ height: 10 }} />
        <Button title="View All" onPress={() => navigation.navigate(SCREENS.ExpenseList)} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  buttons: { marginTop: 20 },
});

// src/screens/ExpenseListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getExpenses, saveExpenses } from '../utils/storage';
import { Expense } from '../types/Expense';
import ExpenseCard from '../components/ExpenseCard';
import { SCREENS } from '../constants/screens';

type Props = NativeStackScreenProps<RootStackParamList, 'ExpenseList'>;

const ExpenseListScreen: React.FC<Props> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getExpenses();
      setExpenses(data);
    };
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const filtered = expenses.filter(e => e.id !== id);
          await saveExpenses(filtered);
          setExpenses(filtered);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>
      {expenses.length === 0 ? (
        <Text>No expenses available.</Text>
      ) : (
        <FlatList
          data={expenses.slice().reverse()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExpenseCard
              item={item}
              onPress={() => navigation.navigate(SCREENS.EditExpense, { expense: item })}
              onLongPress={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

export default ExpenseListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});

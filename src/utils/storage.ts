import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types/Expense';

const EXPENSES_KEY = 'EXPENSES_DATA';

export const getExpenses = async (): Promise<Expense[]> => {
  const jsonValue = await AsyncStorage.getItem(EXPENSES_KEY);
  return jsonValue ? JSON.parse(jsonValue) : [];
};

export const saveExpenses = async (expenses: Expense[]) => {
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

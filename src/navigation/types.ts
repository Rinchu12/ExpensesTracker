import { Expense } from '../types/Expense';

export type RootStackParamList = {
  Home: undefined;
  AddExpense: undefined;
  ExpenseList: undefined;
  EditExpense: { expense: Expense };
};

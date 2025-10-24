import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getExpenses } from '../utils/storage';
import { Expense } from '../types/Expense';
import CategorySummary from '../components/CategorySummary';
import { SCREENS } from '../constants/screens';
import { PieChart } from 'react-native-chart-kit';
import { CATEGORIES } from '../constants/categories';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { theme, toggleTheme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  /** 🧩 Fetch Expenses When Screen is Focused */
  const loadExpenses = useCallback(async () => {
    const data = await getExpenses();
    setExpenses(data);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadExpenses);
    return unsubscribe;
  }, [navigation]);

  /** 🧮 Memoized total and recent expenses */
  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );

  /** 📊 Memoized chart data to avoid recalculating on every render */
  const chartData = useMemo(
    () =>
      CATEGORIES.map(cat => ({
        name: cat,
        amount: expenses
          .filter(e => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0),
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        legendFontColor: theme.text,
        legendFontSize: 13,
      })),
    [expenses, theme],
  );

  /** 🧭 Navigation handlers wrapped in useCallback for stable reference */
  const handleAddExpense = useCallback(
    () => navigation.navigate(SCREENS.AddExpense),
    [navigation],
  );

  const handleViewAll = useCallback(
    () => navigation.navigate(SCREENS.ExpenseList),
    [navigation],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        💰 Total Spent: ₹{total}
      </Text>

      <CategorySummary expenses={expenses} theme={theme} />
      {expenses.length > 0 && (
        <PieChart
          data={chartData}
          width={screenWidth - 16}
          height={180}
          chartConfig={{
            backgroundColor: theme.background,
            color: () => theme.primary,
            labelColor: () => theme.text,
          }}

          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="8"
        />
      )}

      <View style={styles.buttons}>
        <Button
          title="Add Expense"
          onPress={handleAddExpense}
          color={theme.primary}
        />
        <View style={{ height: 10 }} />
        <Button
          title="View All"
          onPress={handleViewAll}
          color={theme.primary}
        />
        <View style={{ height: 10 }} />
        <Button
          title="Toggle Theme"
          onPress={toggleTheme}
          color={theme.primary}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  buttons: { marginTop: 20 },
});

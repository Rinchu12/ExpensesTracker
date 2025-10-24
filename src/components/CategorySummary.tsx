import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '../types/Expense';
import { CATEGORIES } from '../constants/categories';
import { Theme } from '../theme/theme';

interface Props {
  expenses: Expense[];
}

const CategorySummary: React.FC<Props & { theme: Theme }> = ({
  expenses,
  theme,
}) => {
  const categoryTotals: Record<string, number> = {};

  CATEGORIES.forEach(cat => {
    categoryTotals[cat] = 0;
  });

  expenses.forEach(exp => {
    categoryTotals[exp.category] += exp.amount;
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.text }]}>
        Category-wise Breakdown
      </Text>
      {CATEGORIES.map(cat => (
        <View
          key={cat}
          style={[styles.row, { borderBottomColor: theme.border }]}
        >
          <Text style={[styles.category, { color: theme.text }]}>{cat}</Text>
          <Text style={[styles.amount, { color: theme.primary }]}>
            ₹{categoryTotals[cat] || 0}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default CategorySummary;

const styles = StyleSheet.create({
  container: { width: '100%', marginTop: 20, paddingHorizontal: 16 },
  header: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  category: { fontSize: 14 },
  amount: { fontWeight: 'bold', color: '#007AFF' },
});

// src/components/ExpenseCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '../types/Expense';

interface Props {
  item: Expense;
  onPress?: () => void;
  onLongPress?: () => void;
}

const ExpenseCard: React.FC<Props> = ({ item, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.row}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
      {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
    </TouchableOpacity>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { fontSize: 16, fontWeight: '600', color: '#333' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  date: { fontSize: 12, color: '#777', marginTop: 4 },
  note: { fontSize: 13, color: '#555', marginTop: 4, fontStyle: 'italic' },
});

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Expense } from '../types/Expense';
import { Theme } from '../theme/theme';

interface Props {
  item: Expense;
  onPress?: () => void;
  onLongPress?: () => void;
}

const ExpenseCard: React.FC<Props & { theme: Theme }> = ({
  item,
  onPress,
  onLongPress,
  theme,
}) => {
  // 1. Create a ref for animation value
  const fadeAnim = useRef(new Animated.Value(0)).current; // initial opacity 0
  const translateYAnim = useRef(new Animated.Value(20)).current; // initial Y offset

  // 2. Animate on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.row}>
          <Text style={[styles.category, { color: theme.text }]}>
            {item.category}
          </Text>
          <Text style={[styles.amount, { color: theme.primary }]}>
            ₹{item.amount}
          </Text>
        </View>
        <Text style={[styles.date, { color: theme.secondaryText }]}>
          {item.date}
        </Text>
        {item.note ? (
          <Text style={[styles.note, { color: theme.secondaryText }]}>
            {item.note}
          </Text>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
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

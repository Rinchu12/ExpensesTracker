import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import EditExpenseScreen from './src/screens/EditExpenseScreen';
import { RootStackParamList } from './src/navigation/types';
import { Button } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <NavigationContainer theme={theme === 'light' ? DefaultTheme : DarkTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerRight: () => (
              <Button title={theme === 'light' ? 'Dark' : 'Light'} onPress={toggleTheme} />
            ),
          }}
        />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
        <Stack.Screen name="EditExpense" component={EditExpenseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

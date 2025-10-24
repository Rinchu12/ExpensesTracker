// src/theme/theme.ts
export type Theme = {
  background: string;
  text: string;
  secondaryText: string;
  primary: string;
  card: string;
  border: string;
};

export const lightTheme: Theme = {
  background: '#f9f9f9',
  text: '#000',
  secondaryText: '#777',
  primary: '#007AFF',
  card: '#fff',
  border: '#ccc',
};

export const darkTheme: Theme = {
  background: '#121212',
  text: '#fff',
  secondaryText: '#aaa',
  primary: '#1E90FF',
  card: '#1e1e1e',
  border: '#333',
};

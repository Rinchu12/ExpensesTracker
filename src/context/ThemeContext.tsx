import React, { createContext, useContext, useState, ReactNode } from 'react';
import { darkTheme, lightTheme, Theme } from '../theme/theme';


interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

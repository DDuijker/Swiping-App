import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext({
  isDarkTheme: false,
  theme: MD3DarkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const scheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(scheme === 'dark');
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkTheme');
        if (savedTheme !== null) {
          setIsDarkTheme(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };
    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    try {
      await AsyncStorage.setItem('isDarkTheme', JSON.stringify(newTheme));
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
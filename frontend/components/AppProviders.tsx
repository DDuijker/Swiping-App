import "intl-pluralrules";
import React from "react";
import { UserProvider } from "../context/UserContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/I18n";
import { ThemeProvider } from "../context/ThemeContext";
import { Provider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { ReactNode } from "react";
import { Text } from "react-native";

const AppProviders = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Provider theme={theme}>
            <UserProvider>
              {typeof children === "string" ? (
                <Text>{children}</Text>
              ) : (
                children
              )}
            </UserProvider>
          </Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
};

export default AppProviders;

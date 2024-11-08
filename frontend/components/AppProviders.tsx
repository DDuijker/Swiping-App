import "intl-pluralrules";
import React from "react";
import { UserProvider } from "../context/UserContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/I18n";
import { ThemeProvider } from "../context/ThemeContext";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ReactNode } from "react";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <ThemeProvider>
          <PaperProvider>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </PaperProvider>
        </ThemeProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default AppProviders;

import 'intl-pluralrules';
import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/I18n";
import { ThemeProvider } from "../context/ThemeContext";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PaperProvider>
          <I18nextProvider i18n={i18n}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* All screens not in the tab folder*/}
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
            </Stack>
          </I18nextProvider>
        </PaperProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

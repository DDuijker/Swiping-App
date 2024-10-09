import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/I18n";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </I18nextProvider>
    </ThemeProvider>
  );
}

import "intl-pluralrules";
import { Stack } from "expo-router";
import AppProviders from "../components/AppProviders";
export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        {/* All screens not in the tab folder*/}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </AppProviders>
  );
}

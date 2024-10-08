import 'intl-pluralrules';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { I18nextProvider } from 'react-i18next';
import i18n from '../locales/I18n';

export default function RootLayout() {
  // Define the color scheme for the app (dark/light)
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  // Determine the global theme based on the current color scheme
  const globalTheme = colorScheme === 'dark'
    ? { ...MD3DarkTheme, colors: theme.dark }
    : { ...MD3LightTheme, colors: theme.light };

  return (
    <I18nextProvider i18n={i18n}>
      <PaperProvider theme={globalTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </PaperProvider>
    </I18nextProvider>
  );
}

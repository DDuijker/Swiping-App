import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import {  MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  // Here we define the colorscheme of MD3. This covers the whole app
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  // Use the global theme, set in the hooks/useColorScheme.ts file
  const globalTheme = colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };


  
  return (
    <PaperProvider theme={globalTheme}>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen  name="index" />
      </Stack>
    </PaperProvider>
  );
}

import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme = colorScheme === 'dark'
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light };

  
  return (
    <PaperProvider theme={paperTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
      </Stack>
    </PaperProvider>
  );
}

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
      </Stack>
    </PaperProvider>
  );
}

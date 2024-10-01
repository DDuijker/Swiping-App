import { Stack } from "expo-router";
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false}} />
      </Stack>
    </PaperProvider>
  );
}

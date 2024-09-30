import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MD3DarkTheme as defaultTheme, PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider theme={defaultTheme}>
      <View style={[styles.container, { backgroundColor: defaultTheme.colors.background }]}>
        <Text style={{ color: defaultTheme.colors.onBackground }}>Open up App.js to start working on your app!</Text>
        <StatusBar style="light" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

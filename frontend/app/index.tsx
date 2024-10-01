import * as React from "react";
import { useState } from "react";
import { Link } from "expo-router";
import { View } from "react-native";
import { Button, Text, Switch, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";

export default function Index() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Toggle function for dark mode
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Choose the theme based on the current state
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background, 
        }}
      >
        <Text variant="displayMedium">Brand Name</Text>
        
        {/* Toggle Switch for Dark Mode */}
        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20 }}>
          <Text>Dark Mode</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} />
        </View>

        <Link href={"/register"} asChild>
          <Button mode="contained">Register</Button>
        </Link>
        <Link href={"/login"} asChild>
          <Button mode="text">Login</Button>
        </Link>
      </View>
    </PaperProvider>
  );
}

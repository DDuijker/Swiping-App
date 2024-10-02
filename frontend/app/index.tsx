import * as React from "react";
import { Link } from "expo-router";
import { View } from "react-native";
import { Button, Text, Provider as PaperProvider, useTheme } from "react-native-paper";

export default function Index() {
  const theme = useTheme()
  
  return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background, 
        }}
      >
        <Text variant="displayMedium">Brand Name</Text>

        <Link href={"/register"} asChild>
          <Button mode="contained">Register</Button>
        </Link>
        <Link href={"/login"} asChild>
          <Button mode="text">Login</Button>
        </Link>
      </View>
  );
}

import * as React from "react";
import { Link } from "expo-router";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  const { width, height } = Dimensions.get("window");
  const isSmallDevice = width < 360;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceVariant,
    },
    title: {
      fontWeight: "bold",
      paddingTop: 60,
      paddingBottom: 20,
      color: theme.colors.onSurface,
      fontSize: isSmallDevice ? 24 : 32,
      textAlign: "center",
    },
    buttonContainer: {
      alignItems: "center",
      width: "100%",
      padding: 20,
      paddingTop: 40,
      backgroundColor: theme.colors.surface,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    button: {
      width: Platform.OS === "web" ? "30%" : isSmallDevice ? "80%" : "50%",
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text variant="displayMedium" style={styles.title}>
        CineSwipe
      </Text>
      <View style={styles.buttonContainer}>
        <Link href={"/register"} asChild>
          <Button
            mode="contained"
            style={styles.button}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            Register
          </Button>
        </Link>
        <Link href={"/login"} asChild>
          <Button
            mode="text"
            style={styles.button}
            labelStyle={{ color: theme.colors.primary }}
          >
            Login
          </Button>
        </Link>
      </View>
    </View>
  );
}

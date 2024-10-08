import * as React from "react";
import { Link } from "expo-router";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { BRAND_NAME } from "../constants/Names"; // Adjust the path as necessary
import { SPACING } from "../constants/DesignValues"; // Adjust the path as necessary

export default function Index() {
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 360;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceVariant, // Use theme color
    },
    title: {
      fontWeight: "bold",
      paddingTop: SPACING.xLarge, 
      paddingBottom: SPACING.large, 
      color: theme.colors.onSurface,
      fontSize: isSmallDevice ? theme.fonts.displayMedium.fontSize : theme.fonts.displayMedium.fontSize,
      textAlign: "center",
    },
    buttonContainer: {
      alignItems: "center",
      width: "100%",
      paddingTop: SPACING.xLarge,
      backgroundColor: theme.colors.surface,
      borderTopRightRadius: theme.roundness, 
      borderTopLeftRadius: theme.roundness, 
    },
    button: {
      width: Platform.OS === "web" ? "30%" : isSmallDevice ? "80%" : "50%",
      marginBottom: SPACING.medium,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {BRAND_NAME}
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

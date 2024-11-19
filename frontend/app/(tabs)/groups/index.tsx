import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { SPACING } from "../../../constants/DesignValues";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function GroupsIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  console.log("Groups screen mounted");

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={{ color: theme.colors.onBackground }}>
        {t("groups.title")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.medium,
  },
});

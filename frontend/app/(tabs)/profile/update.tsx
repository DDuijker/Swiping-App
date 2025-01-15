import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "react-native-paper";
import { logout, getUser } from "../../../api/userService";
import { router } from "expo-router";

export default function ProfileUpdate() {
  // const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ color: theme.colors.onBackground }}>Profiel Update</Text>
    </View>
  );
}

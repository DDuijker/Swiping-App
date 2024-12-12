import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "react-native-paper";
import { logout, getUser } from "../../../api/userService";
import { Link, router } from "expo-router";

export default function ProfileIndex() {
  // const [user, setUser] = useState(null);
  const { t } = useTranslation();
  const { theme } = useTheme();

  // useEffect(() => {
  //   getUser().then((user) => {
  //     console.log("User:", user);
  //     setUser(user);
  //   });
  // }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.navigate("/login");
    } catch (error) {
      console.error(t("errors.auth.logout"), error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{ color: theme.colors.onBackground }}>
        {t("profile.title")}
      </Text>

      <Button onPress={() => router.push("/groups/create")}>Update</Button>

      <Button onPress={handleLogout}>{t("common.actions.logout")}</Button>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import {Text} from 'react-native-paper';
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "react-native-paper";
import { logout, getUser } from "../../../api/userService";
import { router } from "expo-router";

export default function ProfileIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if(!user) {
          router.navigate("/login");
          return;
        }
        setUser(user);
      } catch (error) {
        console.error(t("errors.auth.fetchUser"), error);
      }
    };
    fetchUser();
  }
  , []);
  console.log(user);

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
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
        {user?.email}
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>
        {user?.name}
      </Text>
      <Button onPress={handleLogout}>{t("common.actions.logout")}</Button>
    </View>
  );
}

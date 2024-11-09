import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "react-native-paper";
import { logout } from "../../../api/userService";
import { router } from "expo-router";

export default function ProfileIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();

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
      <Button onPress={handleLogout}>{t("common.actions.logout")}</Button>
    </View>
  );
}

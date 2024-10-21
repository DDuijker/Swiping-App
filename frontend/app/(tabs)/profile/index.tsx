import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

export default function ProfileIndex() {
  const {t} = useTranslation();
  const {theme} = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text style={{color: theme.colors.onBackground}}>{t("profile.title")}</Text>
    </View>
  );
}

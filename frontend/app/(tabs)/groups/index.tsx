import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

export default function GroupIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  console.log("Groups screen mounted");

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
        {t("groups.title")}
      </Text>
    </View>
  );
}

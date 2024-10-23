import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { SPACING } from "../../../constants/DesignValues";

export default function GroupsIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Appbar Header */}
      <Appbar.Header mode="center-aligned">
        <Appbar.Content
          title={t("groups.title")}
          color={theme.colors.onBackground}
        />
        <Appbar.Action
          icon="plus"
          mode="contained"
          onPress={() => router.push("/groups/create")}
        />
      </Appbar.Header>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={{ fontSize: SPACING.large, color: theme.colors.onBackground }}
        >
          {t("groups.title")}
        </Text>
      </View>
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

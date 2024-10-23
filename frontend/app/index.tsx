import * as React from "react";
import { Link } from "expo-router";
import {
  SafeAreaView,
  View,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { Appbar, Button, Text, Menu, Provider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SPACING } from "../constants/DesignValues";
import { BRAND_NAME } from "../constants/Names";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const { t, i18n } = useTranslation();
  const { isDarkTheme, theme, toggleTheme } = useTheme(); // Get the user's preferred color scheme (light or dark)

  const { width } = Dimensions.get("window");

  const [visible, setVisible] = React.useState(false); // State for managing the menu visibility

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setVisible(false); // Close the menu after selecting
  };

  return (
    <Provider theme={theme}>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        <SafeAreaView style={styles.container}>
          <View>
            {/* AppBar with Language Selector and Theme Toggle */}
            <Appbar.Header
              style={[
                styles.appBar,
                { backgroundColor: theme.colors.background },
              ]}
              mode="center-aligned"
            >
              {/* Theme Toggle Button */}
              <Appbar.Action
                icon={isDarkTheme ? "weather-sunny" : "moon-waxing-crescent"}
                onPress={toggleTheme} // Use toggleTheme from context
              />
              <Appbar.Content
                title={t("common.welcome-to-brandname").replace(
                  "BrandName",
                  BRAND_NAME
                )}
              />
              <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                  <Appbar.Action
                    icon="translate"
                    onPress={() => setVisible(true)}
                  />
                } // Language button on the right
              >
                <Menu.Item
                  onPress={() => changeLanguage("en")}
                  title="English"
                />
                <Menu.Item
                  onPress={() => changeLanguage("nl")}
                  title="Nederlands"
                />
              </Menu>
            </Appbar.Header>
          </View>
          {/* Buttons on the bottom area */}
          <View
            style={[
              styles.buttonContainer,
              { backgroundColor: theme.colors.inverseOnSurface },
            ]}
          >
            <Link href="/register" asChild>
              <Button
                mode="contained"
                style={styles.button}
                labelStyle={{ color: theme.colors.onPrimary }}
              >
                {t("common.register")}
              </Button>
            </Link>
            <Link href="/login" asChild>
              <Button
                mode="text"
                style={styles.button}
                labelStyle={{ color: theme.colors.primary }}
              >
                {t("common.login")}
              </Button>
            </Link>
            <Link href="/groups" asChild>
              <Button
                mode="text"
                style={styles.button}
                labelStyle={{ color: theme.colors.primary }}
              >
                {t("groups.title")}
              </Button>
            </Link>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  appBar: {
    justifyContent: "space-between",
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: SPACING.large,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    width:
      Platform.OS === "web"
        ? "30%"
        : Dimensions.get("window").width < 360
        ? "80%"
        : "50%",
    marginBottom: SPACING.large,
  },
});

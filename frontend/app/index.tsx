import * as React from "react";
import { router } from "expo-router";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Appbar, Button, Text, Menu, Provider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SPACING } from "../constants/DesignValues";


export default function Index() {
  const { t, i18n } = useTranslation();
  const { isDarkTheme, theme, toggleTheme } = useTheme(); // Get the user's preferred color scheme (light or dark)
  const [visible, setVisible] = React.useState(false); // State for managing the menu visibility

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setVisible(false); // Close the menu after selecting
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <View>
          {/* AppBar with Language Selector and Theme Toggle */}
          <Appbar.Header
            style={[
              styles.appBar,
              { backgroundColor: theme.colors.elevation.level0 },
            ]}
            mode="center-aligned"
          >
            {/* Theme Toggle Button */}
            <Appbar.Action
              icon={isDarkTheme ? "weather-sunny" : "moon-waxing-crescent"}
              onPress={toggleTheme} // Use toggleTheme from context
            />
            <Appbar.Content title={t("common.welcome-to-brandname").replace("BrandName", "Binge")} />
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
              <Menu.Item onPress={() => changeLanguage("en")} title="English" />
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
            {
              backgroundColor: theme.colors.surface,
              borderTopRightRadius: theme.roundness,
              borderTopLeftRadius: theme.roundness,
            },
          ]}
        >
            <Button
            onPress={() => router.replace('/register')}
              mode="contained"
              style={[styles.button]}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              {t("common.register")}
            </Button>
            <Button
              onPress={() => router.replace('/login')}
              mode="text"
              style={styles.button}
              labelStyle={{ color: theme.colors.primary }}
            >
              {t("common.login")}
            </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

// Stylesheet using SPACING values
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  appBar: {
    justifyContent: "space-between",
  },
  title: {
    padding: SPACING.large,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: SPACING.medium,
  },
  button: {
    marginBottom: SPACING.medium,
  },
});

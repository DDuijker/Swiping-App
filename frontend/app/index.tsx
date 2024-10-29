import * as React from "react";
import { Link } from "expo-router";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Appbar, Button, Text, Menu, Provider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SPACING } from "../constants/DesignValues";

export default function Index() {
  const { t, i18n } = useTranslation(); // i18n for translations
  const { isDarkTheme, theme, toggleTheme } = useTheme(); // Context for theme and toggle

  // State for controlling language menu visibility
  const [visible, setVisible] = React.useState(false);

  // Define MenuButton as a forwardRef component for accessibility and testability
  interface MenuButtonProps {
    onPress: () => void;
  }

  // This component uses React.forwardRef to enable passing a ref from the parent component in the language menu ( <MenuButton ref={ref} /> )
  const MenuButton = React.forwardRef<View, MenuButtonProps>((props, ref) => (
    <Appbar.Action
      icon="translate"
      onPress={props.onPress}
      ref={ref}
      testID="language-menu"
    />
  ));

  // Function to change the app language
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setVisible(false); // Close the menu after selection
  };

  return (
    <Provider theme={theme}>
      {/* Main Container */}
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <View>
          {/* AppBar containing theme toggle and language menu */}
          <Appbar.Header
            style={[
              styles.appBar,
              { backgroundColor: theme.colors.elevation.level0 },
            ]}
          >
            {/* Theme Toggle Button - toggles between light and dark modes */}
            <Appbar.Action
              icon={isDarkTheme ? "weather-sunny" : "moon-waxing-crescent"}
              onPress={toggleTheme}
              testID="theme-toggle"
            />
            {/* Language Menu - allows user to select app language */}
            <Menu
              visible={visible}
              onDismiss={() => setVisible(false)}
              anchor={<MenuButton onPress={() => setVisible(true)} />}
            >
              <Menu.Item
                onPress={() => changeLanguage("en")}
                title="English"
                testID="language-item-english"
              />
              <Menu.Item
                onPress={() => changeLanguage("nl")}
                title="Nederlands"
                testID="language-item-dutch"
              />
            </Menu>
          </Appbar.Header>

          {/* Welcome Text - shows greeting with app name */}
          <Text
            style={[
              styles.title,
              {
                fontSize: theme.fonts.headlineLarge.fontSize,
                color: theme.colors.onSurface,
              },
            ]}
          >
            {t("common.welcome-to-brandname").replace("BrandName", "Binge")}
          </Text>
        </View>

        {/* Bottom Area with Register and Login Buttons */}
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
          {/* Register Button */}
          <Link href="/register" asChild>
            <Button
              mode="contained"
              style={styles.button}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              {t("common.register")}
            </Button>
          </Link>
          {/* Login Button */}
          <Link href="/login" asChild>
            <Button
              mode="text"
              style={styles.button}
              labelStyle={{ color: theme.colors.primary }}
            >
              {t("common.login")}
            </Button>
          </Link>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

// Stylesheet
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

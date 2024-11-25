import * as React from "react";
import { router } from "expo-router";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Appbar, Button, Menu, Provider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SPACING } from "../constants/DesignValues";
import "react-native-reanimated";
import Tutorial from "@/components/Tutorial";

// Interface for the MenuButton component
interface MenuButtonProps {
  onPress: () => void;
}

// Custom MenuButton component, in order to make use of react-native-paper's Appbar.Action
const MenuButton = React.forwardRef<View, MenuButtonProps>((props, ref) => (
  <Appbar.Action
    icon="translate"
    onPress={props.onPress}
    ref={ref}
    testID="language-menu"
  />
));
MenuButton.displayName = "MenuButton";

export default function Index() {
  const { t, i18n } = useTranslation();
  const { isDarkTheme, theme, toggleTheme } = useTheme();
  const [visible, setVisible] = React.useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setVisible(false);
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
          <Appbar.Header
            style={[
              styles.appBar,
              { backgroundColor: theme.colors.elevation.level0 },
            ]}
            mode="center-aligned"
          >
            <Appbar.Action
              icon={isDarkTheme ? "weather-sunny" : "moon-waxing-crescent"}
              onPress={toggleTheme}
              testID="theme-toggle"
            />
            <Appbar.Content title={t("common.welcome.title")} />
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
        </View>
        <View style={styles.tutorial}>
        <Tutorial />
        </View>
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
            onPress={() => router.replace("/register")}
            mode="contained"
            style={styles.button}
            labelStyle={{ color: theme.colors.onPrimary }}
          >
            {t("common.actions.register")}
          </Button>
          <Button
            onPress={() => router.replace("/login")}
            mode="text"
            style={styles.button}
            labelStyle={{ color: theme.colors.primary }}
          >
            {t("common.actions.login")}
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appBar: {
    justifyContent: "space-between",
  },
  tutorial: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: SPACING.medium,
  },
  buttonContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: SPACING.medium,
  },
  button: {
    marginBottom: SPACING.medium,
  },
  title: {
    textAlign: "center",
    marginTop: SPACING.large,
  },
});

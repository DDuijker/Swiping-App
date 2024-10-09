import * as React from "react";
import { Link } from "expo-router";
import { SafeAreaView, View, Dimensions, Platform } from "react-native";
import { Appbar, Button, Text, Menu, MD3Theme, Provider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

export default function Index() {
  const { t, i18n } = useTranslation();
  const scheme = useColorScheme(); // Get the user's preferred color scheme (light or dark)
  
  // Set initial theme state based on the color scheme or saved preference
  const [isDarkTheme, setIsDarkTheme] = React.useState(scheme === 'dark');
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 360;

  const [visible, setVisible] = React.useState(false); // State for managing the menu visibility

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setVisible(false); // Close the menu after selecting
  };

  const styles = createStyles(theme, isSmallDevice);

  // Function to load the theme preference
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkTheme');
      if (savedTheme !== null) {
        setIsDarkTheme(JSON.parse(savedTheme)); // Set the theme state
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error);
    }
  };

  // Function to save the theme preference
  const saveThemePreference = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('isDarkTheme', JSON.stringify(isDark));
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // Load theme preference when the component mounts
  React.useEffect(() => {
    loadThemePreference();
  }, []);

  // Save theme preference whenever it changes
  React.useEffect(() => {
    saveThemePreference(isDarkTheme);
  }, [isDarkTheme]);

  // Update the theme based on system color scheme changes
  React.useEffect(() => {
    if (scheme) {
      setIsDarkTheme(scheme === 'dark');
    }
  }, [scheme]);

  return (
    <Provider theme={theme}>
      <SafeAreaView style={styles.container}>
        <View>
          {/* AppBar with Language Selector and Theme Toggle */}
          <Appbar.Header style={styles.appBar} mode="center-aligned">
            {/* Theme Toggle Button */}
            <Appbar.Action 
              icon={isDarkTheme ? "weather-sunny" : "moon-waxing-crescent"} 
              onPress={() => setIsDarkTheme(!isDarkTheme)} 
            />
            <Menu
              visible={visible}
              onDismiss={() => setVisible(false)}
              anchor={<Appbar.Action icon="translate" onPress={() => setVisible(true)} />} // Language button on the right
            >
              <Menu.Item onPress={() => changeLanguage("en")} title="English" />
              <Menu.Item onPress={() => changeLanguage("nl")} title="Nederlands" />
            </Menu>
          </Appbar.Header>
          <Text style={styles.title}>
            {t("common.welcome-to-brandname").replace("BrandName", "Binge")}
          </Text>
        </View>
        {/* Buttons on the bottom area */}
        <View style={styles.buttonContainer}>
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
        </View>
      </SafeAreaView>
    </Provider>
  );
}

// Function to create styles
function createStyles(theme: MD3Theme, isSmallDevice: boolean) {
  return {
    container: {
      flex: 1,
      justifyContent: "space-between",
      backgroundColor: theme.colors.surfaceVariant,
    },
    appBar: {
      backgroundColor: theme.colors.elevation.level0,
      justifyContent: "space-between",
    },
    title: {
      padding: 20,
      textAlign: "center",
      fontSize: theme.fonts.headlineLarge.fontSize,
      color: theme.colors.onSurface,
    },
    buttonContainer: {
      alignItems: "center",
      width: "100%",
      paddingTop: 20,
      backgroundColor: theme.colors.surface,
      borderTopRightRadius: theme.roundness,
      borderTopLeftRadius: theme.roundness,
    },
    button: {
      width: Platform.OS === "web" ? "30%" : isSmallDevice ? "80%" : "50%",
      marginBottom: 20,
    },
  };
}

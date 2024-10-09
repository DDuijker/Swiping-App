import * as React from "react";
import { Link } from "expo-router";
import { View, Dimensions, Platform, SafeAreaView, DimensionValue, Text } from "react-native";
import { Appbar, Button, useTheme, Menu, MD3Theme } from "react-native-paper";
import { BRAND_NAME } from "../constants/Names";
import { SPACING } from "../constants/DesignValues";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 360;

  // State for managing the menu visibility
  const [visible, setVisible] = React.useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setVisible(false); // Close the menu after selecting
  };

  const styles = createStyles(theme, isSmallDevice);

  return (
    <SafeAreaView style={styles.container}>
      <View>
      {/* AppBar with Language Selector */}
      <Appbar.Header style={styles.appBar}>
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={<Appbar.Action icon="translate"  onPress={() => setVisible(true)} />}
        >
          <Menu.Item onPress={() => changeLanguage("en")} title="English" />
          <Menu.Item onPress={() => changeLanguage("nl")} title="Nederlands" />
        </Menu>
      </Appbar.Header>
      <Text style={styles.title}>
        {t("common.welcome-to-brandname").replace("BrandName", BRAND_NAME)}
      </Text>
      </View>
      {/* Main content area */}
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
  );
}

// Function to create styles
function createStyles(theme: MD3Theme, isSmallDevice: boolean) {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: "space-between" as "space-between",
    },
    appBar: {
      backgroundColor: theme.colors.elevation.level0, //makes it transparent
    },
    title: {
      fontWeight: "bold" as "bold",
      paddingTop: SPACING.xLarge, 
      paddingBottom: SPACING.large, 
      color: theme.colors.onSurface,
      fontSize: isSmallDevice ? theme.fonts.displayMedium.fontSize : theme.fonts.displayMedium.fontSize,
      textAlign: "center" as "center",
    },
    buttonContainer: {
      alignItems: "center" as "center",
      width: "100%" as DimensionValue,
      paddingTop: SPACING.xLarge,
      backgroundColor: theme.colors.surface,
      borderTopRightRadius: theme.roundness,
      borderTopLeftRadius: theme.roundness,
    },
    button: {
      width: Platform.OS === "web" ? "30%" : isSmallDevice ? "80%" : "50%" as DimensionValue,
      marginBottom: SPACING.medium,
    },
  };
}

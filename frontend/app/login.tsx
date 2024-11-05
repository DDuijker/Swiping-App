import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Button, Provider, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { login } from "../api/userService";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { SPACING } from "../constants/DesignValues";

export default function LoginPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await login(username, password);
      console.log(user);
      router.navigate("/(tabs)/groups");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View>
          <Appbar.Header mode="center-aligned">
            <Appbar.BackAction onPress={() => router.replace("/")} />
            <Appbar.Content title={t("common.login")} />
          </Appbar.Header>
        </View>
        <View style={styles.form}>
          <TextInput
            label={t("common.username")}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label={t("common.password")}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button style={styles.button} mode="contained" onPress={handleLogin}>
            {t("common.login")}
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  form: {
    margin: SPACING.xLarge,
    padding: SPACING.xLarge,
  },
  button: {
    margin: SPACING.xLarge,
  },
});

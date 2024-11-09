import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Provider,
  TextInput,
  Snackbar,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { login } from "../api/userService";
import { Link, router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { SPACING } from "../constants/DesignValues";

export default function LoginPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setSnackbarMessage(t("validation.fields.required"));
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const user = await login(username, password);
      if (user) {
        router.push("/(tabs)/groups");
      }
    } catch (error) {
      setSnackbarMessage(t("errors.auth.invalidCredentials"));
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Appbar.Header mode="center-aligned">
          <Appbar.BackAction onPress={() => router.replace("/")} />
          <Appbar.Content title={t("common.actions.login")} />
        </Appbar.Header>
        <View style={styles.form}>
          <TextInput
            label={t("common.fields.username")}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            disabled={loading}
          />
          <TextInput
            label={t("common.fields.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            disabled={loading}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          >
            {t("common.actions.login")}
          </Button>
        </View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
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

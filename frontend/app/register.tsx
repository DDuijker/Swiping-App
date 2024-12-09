import React, { useEffect, useState } from "react";
import { SPACING } from "../constants/DesignValues";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Provider,
  Appbar,
  Button,
  TextInput,
  HelperText,
  Snackbar,
} from "react-native-paper";
import ImagePickerComponent from "../components/RegisterImagePickerComponent";
import { getUser, register } from "../api/userService";
import { useTheme } from "../context/ThemeContext";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import GenreChips, { Genre } from "../components/GenreChips";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favoriteMovieGenres, setMovieFavoriteGenres] = useState<Genre[]>([]);
  const [favoriteTVGenres, setTVFavoriteGenres] = useState<Genre[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) {
        router.replace("/(tabs)/groups");
      }
    };

    checkUser();
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setError("");

    if (!username || username.length < 3) {
      setError(t("validation.username.minLength"));
      return;
    }

    if (!email) {
      setError(t("validation.email.required"));
      return;
    }

    if (!isValidEmail(email)) {
      setError(t("validation.email.format"));
      return;
    }

    if (!password) {
      setError(t("validation.password.required"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("validation.password.match"));
      return;
    }

    setLoading(true);

    try {
      await register(
        username,
        password,
        email,
        avatar,
        favoriteMovieGenres,
        favoriteTVGenres
      );

      setSnackbarMessage(t("common.succes.registration"));
      setSnackbarVisible(true);
      setLoading(false);
      setTimeout(() => {
        router.replace("/(tabs)/groups");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.msg ||
        error?.msg ||
        t("errors.auth.invalidCredentials");

      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  const onDismissSnackbar = () => setSnackbarVisible(false);

  return (
    <Provider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView>
            <Appbar.Header mode="center-aligned">
              <Appbar.BackAction onPress={() => router.replace("/")} />
              <Appbar.Content title={t("common.actions.register")} />
            </Appbar.Header>

            <View style={styles.form}>
              <ImagePickerComponent
                avatar={avatar}
                setAvatar={setAvatar}
                username={username}
                onError={(message) => setError(message)}
                removeText={t("profile.actions.removePicture")}
                uploadText={t("profile.actions.uploadPicture")}
              />

              <TextInput
                label={t("common.fields.username")}
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
              />
              <TextInput
                label={t("common.fields.email")}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                label={t("common.fields.password")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                label={t("profile.fields.passwordRepeat")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />

              <GenreChips
                selectedGenres={favoriteMovieGenres}
                onToggleGenre={(genre) => {
                  setMovieFavoriteGenres((prevGenres) =>
                    prevGenres.some((g) => g.id === genre.id)
                      ? prevGenres.filter((g) => g.id !== genre.id)
                      : [...prevGenres, genre]
                  );
                }}
                title={t("common.preferences.genres.selectMovie")}
                genreType="movie"
              />

              <GenreChips
                selectedGenres={favoriteTVGenres}
                onToggleGenre={(genre) => {
                  setTVFavoriteGenres((prevGenres) =>
                    prevGenres.some((g) => g.id === genre.id)
                      ? prevGenres.filter((g) => g.id !== genre.id)
                      : [...prevGenres, genre]
                  );
                }}
                title={t("common.preferences.genres.selectTV")}
                genreType="tv"
              />

              {error ? <HelperText type="error">{error}</HelperText> : <></>}

              <View>
                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                >
                  <Text>{t("common.actions.register")}</Text>
                </Button>
                <Button mode="text" onPress={() => router.replace("/login")}>
                  <Text>{t("common.actions.login")}</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
          {snackbarMessage ? (
            <Snackbar
              visible={snackbarVisible}
              onDismiss={onDismissSnackbar}
              action={{
                label: t("common.actions.close"),
                onPress: onDismissSnackbar,
              }}
            >
              {snackbarMessage}
            </Snackbar>
          ) : (
            <></>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.medium,
  },
  avatarButtons: {
    flexDirection: "row",
    marginTop: SPACING.medium,
  },
  removeButton: {
    marginRight: SPACING.small,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  form: {
    margin: SPACING.xLarge,
    padding: SPACING.xLarge,
  },
  buttons: {
    margin: SPACING.xLarge,
  },
});

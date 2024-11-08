import React, { useState, useEffect } from "react";
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
  Avatar,
  Snackbar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { register } from "../api/userService";
import { useTheme } from "../context/ThemeContext";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import GenreChips from "../components/GenreChips";

interface Genre {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [favoriteMovieGenres, setMovieFavoriteGenres] = useState<Genre[]>([]);
  const [favoriteTVGenres, setTVFavoriteGenres] = useState<Genre[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Image picker for avatar
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert(t("profile.avatarPermissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Get avatar source
  const getAvatarSource = () => {
    return avatar
      ? { uri: avatar }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            username || "User"
          )}`,
        };
  };

  // Remove selected image
  const removeImage = () => {
    setAvatar("");
  };

  // Handle registration
  const handleRegister = async () => {
    setError(""); // Clear previous errors

    if (!username) {
      setError(t("common.errorUsername"));
      return;
    }
    if (!email) {
      setError(t("common.errorEmail"));
      return;
    }
    if (!password) {
      setError(t("common.errorPassword"));
      return;
    }
    if (!confirmPassword) {
      setError(t("common.errorConfirmPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("profile.passwordRepeatMismatch"));
      return;
    }

    setLoading(true);
    try {
      const favoriteMovieGenresIds = favoriteMovieGenres.map(
        (genre) => genre.id
      );
      const favoriteTVGenresIds = favoriteTVGenres.map((genre) => genre.id);
      const user = await register(
        username,
        password,
        email,
        avatar,
        favoriteMovieGenresIds,
        favoriteTVGenresIds // Pass TV genres to the register function
      );
      console.log(user);
      setSnackbarMessage(t("common.registrationSuccess")); // Set success message
      setSnackbarVisible(true); // Show snackbar
      setLoading(false);
      // Redirect after a short delay to allow the snackbar to display
      setTimeout(() => {
        router.replace("/groups");
      }, 2000);
    } catch (error) {
      setError(t("common.error"));
      setSnackbarMessage(t("common.registrationError")); // Set error message
      setSnackbarVisible(true); // Show snackbar
      setLoading(false);
    }
  };

  // Handle snackbar dismiss
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
            <View>
              <Appbar.Header mode="center-aligned">
                <Appbar.BackAction onPress={() => router.replace("/")} />
                <Appbar.Content title={t("common.register")} />
              </Appbar.Header>
            </View>
            <View style={styles.form}>
              <View style={styles.avatarContainer}>
                <Avatar.Image size={100} source={getAvatarSource()} />
                <View style={styles.avatarButtons}>
                  {avatar ? (
                    <Button
                      onPress={removeImage}
                      mode="outlined"
                      style={styles.removeButton}
                    >
                      {t("profile.removePictureButton")}
                    </Button>
                  ) : null}
                  <Button onPress={pickImage} mode="outlined">
                    {t("profile.uploadPictureButton")}
                  </Button>
                </View>
              </View>

              <TextInput
                label={t("common.username")}
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
              />
              <TextInput
                label={t("profile.email")}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                label={t("common.password")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                label={t("profile.passwordRepeat")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />

              <View>
                <GenreChips
                  selectedGenres={favoriteTVGenres}
                  onToggleGenre={(genre) => {
                    setTVFavoriteGenres((prevGenres) =>
                      prevGenres.some((g) => g.id === genre.id)
                        ? prevGenres.filter((g) => g.id !== genre.id)
                        : [...prevGenres, genre]
                    );
                  }}
                  title={t("common.selectFavoriteTVGenres")}
                  genreType="tv"
                />
              </View>

              <View>
                <GenreChips
                  selectedGenres={favoriteMovieGenres}
                  onToggleGenre={(genre) => {
                    setMovieFavoriteGenres((prevGenres) =>
                      prevGenres.some((g) => g.id === genre.id)
                        ? prevGenres.filter((g) => g.id !== genre.id)
                        : [...prevGenres, genre]
                    );
                  }}
                  title={t("common.selectFavoriteMovieGenres")}
                  genreType="movie"
                />
              </View>

              {error ? <HelperText type="error">{error}</HelperText> : null}

              <View style={styles.buttons}>
                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                >
                  {t("common.register")}
                </Button>
                <Button onPress={() => router.replace("/login")}>
                  {t("common.login")}
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        action={{
          label: t("common.close"),
          onPress: onDismissSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
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

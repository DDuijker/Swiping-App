import { useState, useEffect } from "react";
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
  Chip,
  Text,
  ActivityIndicator,
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

interface Genre {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [favoriteMovieGenres, setMovieFavoriteGenres] = useState<Genre[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGenresLoading, setIsGenresLoading] = useState(true);

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch genres from TMDb API with dynamic language
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?&language=${i18n.language}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError(t("common.errorLoadingGenres"));
      } finally {
        setIsGenresLoading(false);
      }
    };

    fetchGenres();
  }, [i18n.language]);

  // Function to toggle genre selection
  const toggleGenre = (genre: Genre) => {
    setMovieFavoriteGenres((prevGenres: Genre[]) => {
      if (prevGenres.some((g: Genre) => g.id === genre.id)) {
        return prevGenres.filter((g: Genre) => g.id !== genre.id);
      } else {
        return [...prevGenres, genre];
      }
    });
  };

  // Email validation
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

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

    if (!username || !email || !password || !confirmPassword) {
      setError(t("common.errorFields"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("profile.emailInvalid"));
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
      const user = await register(
        username,
        password,
        email,
        avatar,
        favoriteMovieGenresIds
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
                  {avatar && (
                    <Button
                      onPress={removeImage}
                      mode="outlined"
                      style={styles.removeButton}
                    >
                      {t("profile.removePictureButton")}
                    </Button>
                  )}
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

              {/* Genre Selection Text */}
              {isGenresLoading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : genres.length > 0 ? (
                <Text style={styles.genreText} variant="titleLarge">
                  {t("common.selectFavoriteMovieGenres")}
                </Text>
              ) : (
                <Text style={styles.genreText}>
                  {t("common.noGenresAvailable")}
                </Text>
              )}

              {/* Genre Selection Chips */}
              <View style={styles.genreContainer}>
                {genres.map((genre: Genre) => (
                  <Chip
                    key={genre.id}
                    selected={favoriteMovieGenres.some(
                      (g: Genre) => g.id === genre.id
                    )}
                    onPress={() => toggleGenre(genre)}
                    mode={
                      favoriteMovieGenres.some((g: Genre) => g.id === genre.id)
                        ? "flat"
                        : "outlined"
                    }
                    style={styles.genreChip}
                  >
                    {genre.name}
                  </Chip>
                ))}
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
          label: "Close",
          onPress: onDismissSnackbar, // Dismiss on close
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
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.medium,
  },
  genreText: {
    alignItems: "center",
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  genreChip: {
    margin: SPACING.small,
  },
});

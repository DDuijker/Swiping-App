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
  ActivityIndicator, // Import ActivityIndicator
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { register } from "../api/userService";
import { useTheme } from "../context/ThemeContext";
import {
  View,
  StyleSheet,
  Alert,
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
  const [isGenresLoading, setIsGenresLoading] = useState(true); // Track loading state for genres

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
        setIsGenresLoading(false); // Set loading state to false after fetch
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

  // Error handling functions
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

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
      const user = await register(
        username,
        password,
        email,
        avatar,
        favoriteMovieGenres
      );
      console.log(user);
      setLoading(false);
      // Show success message and redirect to login
      router.replace("/groups");
    } catch (error) {
      setError(t("common.error"));
      setLoading(false);
    }
  };

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

  // Function to get the avatar source
  const getAvatarSource = () => {
    return avatar
      ? { uri: avatar }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            username || "User"
          )}`,
        };
  };

  // Remove selected image to revert to generated avatar
  const removeImage = () => {
    setAvatar("");
  };

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
                    } // Set mode based on selection
                    style={styles.genreChip} // Keep the base styling here
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

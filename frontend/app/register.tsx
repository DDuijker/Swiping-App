import React, { useEffect, useState } from "react";
import { SPACING } from "../constants/DesignValues"; // Import spacing constants for consistent design values
import { router } from "expo-router"; // Expo router for navigation
import { useTranslation } from "react-i18next"; // Translation hook for multi-language support
import { SafeAreaView } from "react-native-safe-area-context"; // To handle safe area on devices
import {
  Provider,
  Appbar,
  Button,
  TextInput,
  HelperText,
  Snackbar,
} from "react-native-paper"; // UI components from React Native Paper library
import ImagePickerComponent from "../components/RegisterImagePickerComponent"; // Custom component for picking avatar
import { getUser, register } from "../api/userService"; // API functions for user registration
import { useTheme } from "../context/ThemeContext"; // Context to handle theming (light/dark mode)
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import GenreChips, { Genre } from "../components/GenreChips"; // Component for selecting favorite genres

// Main functional component for the registration page
export default function RegisterPage() {
  const { t } = useTranslation(); // For translations of text (i18n)
  const { theme } = useTheme(); // Access the current theme (light/dark)

  // State management for user input fields
  const [username, setUsername] = useState(""); // Username input
  const [email, setEmail] = useState(""); // Email input
  const [avatar, setAvatar] = useState(""); // Avatar image path
  const [password, setPassword] = useState(""); // Password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Password confirmation input
  const [favoriteMovieGenres, setMovieFavoriteGenres] = useState<Genre[]>([]); // Selected favorite movie genres
  const [favoriteTVGenres, setTVFavoriteGenres] = useState<Genre[]>([]); // Selected favorite TV genres

  // State for error handling and loading
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state for register button

  // State for the Snackbar (temporary message display)
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Check if a user is already logged in and redirect them
  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser(); // Check if a user session exists
      if (user) {
        router.replace("/(tabs)/groups"); // Redirect to groups page if logged in
      }
    };

    checkUser();
  }, []);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    // Regular expression to check if email is in correct format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // Return true if email is valid
  };

  // Function to handle user registration
  const handleRegister = async () => {
    setError(""); // Reset error state

    // Input validation
    if (!username || username.length < 3) {
      setError(t("validation.username.minLength")); // Show error if username is too short
      return;
    }

    if (!email) {
      setError(t("validation.email.required")); // Show error if email is empty
      return;
    }

    if (!isValidEmail(email)) {
      setError(t("validation.email.format")); // Show error if email format is invalid
      return;
    }

    if (!password) {
      setError(t("validation.password.required")); // Show error if password is empty
      return;
    }

    if (password !== confirmPassword) {
      setError(t("validation.password.match")); // Show error if passwords don't match
      return;
    }

    setLoading(true); // Set loading to true while making API request

    try {
      // Call register API to create a new user
      await register(
        username,
        password,
        email,
        avatar,
        favoriteMovieGenres,
        favoriteTVGenres
      );

      // Show success message and redirect to groups page
      setSnackbarMessage(t("common.succes.registration"));
      setSnackbarVisible(true);
      setLoading(false);
      setTimeout(() => {
        router.replace("/(tabs)/groups");
      }, 2000);
    } catch (error) {
      // Handle errors from the API
      const errorMessage =
        error?.response?.data?.msg || // Check for API error message
        error?.msg || // Fallback to general error message
        t("errors.auth.invalidCredentials");

      setError(errorMessage); // Set error state for HelperText
      setSnackbarMessage(errorMessage); // Show error in Snackbar
      setSnackbarVisible(true);
      setLoading(false); // Reset loading state
    }
  };

  // Dismiss the Snackbar message
  const onDismissSnackbar = () => setSnackbarVisible(false);

  return (
    <Provider theme={theme}>
      {/* SafeAreaView ensures content is displayed within the device's safe area */}
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Handle keyboard overlap for input fields */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView>
            {/* Appbar for navigation and title */}
            <Appbar.Header mode="center-aligned">
              <Appbar.BackAction onPress={() => router.replace("/")} />{" "}
              {/* Back button */}
              <Appbar.Content title={t("common.actions.register")} />{" "}
              {/* Page title */}
            </Appbar.Header>

            {/* Registration form */}
            <View style={styles.form}>
              {/* Image picker for avatar */}
              <ImagePickerComponent
                avatar={avatar}
                setAvatar={setAvatar}
                username={username}
                onError={(message) => setError(message)}
                removeText={t("profile.actions.removePicture")}
                uploadText={t("profile.actions.uploadPicture")}
              />

              {/* Username input */}
              <TextInput
                label={t("common.fields.username")}
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
              />

              {/* Email input */}
              <TextInput
                label={t("common.fields.email")}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              {/* Password input */}
              <TextInput
                label={t("common.fields.password")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              {/* Confirm password input */}
              <TextInput
                label={t("profile.fields.passwordRepeat")}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />

              {/* Genre selection for favorite movies */}
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

              {/* Genre selection for favorite TV shows */}
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

              {/* Display validation errors */}
              {error ? <HelperText type="error">{error}</HelperText> : <></>}

              {/* Buttons for registration and navigation */}
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

          {/* Snackbar for success or error messages */}
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

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen height
  },
  input: {
    marginBottom: SPACING.medium, // Add spacing below input fields
  },
  form: {
    margin: SPACING.xLarge, // Outer margin for form
    padding: SPACING.xLarge, // Inner padding for form
  },
});

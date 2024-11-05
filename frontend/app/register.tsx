import { SPACING } from "../constants/DesignValues";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Provider,
  Appbar,
  Button,
  TextInput,
  HelperText,
  Avatar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { register } from "../api/userService";
import { useTheme } from "../context/ThemeContext";
import { View, StyleSheet, Alert } from "react-native";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // Avatar image URI
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        favoriteGenres
      );
      console.log(user);
      setLoading(false);
      Alert.alert(t("common.success"), t("profile.registerSuccess"));
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
      setAvatar(result.assets[0].uri); // Set the avatar URI
    }
  };

  // Function to get the avatar source, either user-selected or generated based on the name
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
        <View>
          <Appbar.Header mode="center-aligned">
            <Appbar.BackAction onPress={() => router.replace("/")} />
            <Appbar.Content title={t("common.register")} />
          </Appbar.Header>
        </View>
        <View style={styles.form}>
          {/* Centered Avatar with options to upload or remove */}
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

          {/* Registration Form Inputs */}
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

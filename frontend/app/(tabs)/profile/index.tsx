import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  FAB,
  Switch,
  List,
  Snackbar,
  Dialog,
  Portal,
  Chip,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "expo-router";

// Import API service functions
import {
  getUser,
  updateUser,
  logout,
  deleteUser,
  changePassword,
} from "../../../api/userService";

// Import components
import GenreChips, { Genre } from "../../../components/GenreChips";

export default function ProfileIndex() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<any>({});
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Fetch user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await getUser();
        if (fetchedUser) {
          setUser(fetchedUser);
          setUpdatedUser(fetchedUser);
        }
      } catch (error) {
        setSnackbar({ visible: true, message: error.message });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleToggleGenre = (type: "movie" | "tv", genre: Genre) => {
    const key = `favorite${type === "movie" ? "Movie" : "TV"}Genres`;
    const isSelected = updatedUser[key].some((g: Genre) => g.id === genre.id);

    setUpdatedUser((prevState: any) => ({
      ...prevState,
      [key]: isSelected
        ? prevState[key].filter((g: Genre) => g.id !== genre.id)
        : [...prevState[key], genre],
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(user._id, updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      setSnackbar({
        visible: true,
        message: t("profile.success.profileUpdated"),
      });
    } catch (error) {
      setSnackbar({ visible: true, message: error.message });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      setSnackbar({ visible: true, message: error.message });
    }
  };

  const handleDeleteAccount = () => {
    setDialogVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteUser(user._id);
      await logout();
      router.replace("/login");
    } catch (error) {
      setSnackbar({ visible: true, message: error.message });
    } finally {
      setDialogVisible(false);
    }
  };

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setSnackbar({
        visible: true,
        message: t("profile.errors.passwordMismatch"),
      });
      return;
    }

    try {
      await changePassword(user._id, passwords.current, passwords.new);
      setPasswordDialogVisible(false);
      setSnackbar({
        visible: true,
        message: t("profile.success.passwordChanged"),
      });
    } catch (error) {
      setSnackbar({ visible: true, message: error.message });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text theme={theme}>{t("profile.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {/* Profile Header */}
        <View style={styles.infoContainer}>
          <Text theme={theme} variant="titleLarge">
            {updatedUser.username}
          </Text>
          <Text theme={theme}>{updatedUser.email}</Text>
        </View>

        {/* Editing Section */}
        {isEditing ? (
          <>
            <TextInput
              label={t("profile.fields.username")}
              value={updatedUser.username || ""}
              onChangeText={(text) =>
                setUpdatedUser({ ...updatedUser, username: text })
              }
              theme={theme}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label={t("profile.fields.email")}
              value={updatedUser.email || ""}
              onChangeText={(text) =>
                setUpdatedUser({ ...updatedUser, email: text })
              }
              theme={theme}
              mode="outlined"
              style={styles.input}
            />
            <GenreChips
              selectedGenres={updatedUser.favoriteMovieGenres}
              onToggleGenre={(genre) => handleToggleGenre("movie", genre)}
              title={t("profile.fields.favoriteMovieGenres")}
              genreType="movie"
            />
            <GenreChips
              selectedGenres={updatedUser.favoriteTVGenres}
              onToggleGenre={(genre) => handleToggleGenre("tv", genre)}
              title={t("profile.fields.favoriteTVGenres")}
              genreType="tv"
            />
          </>
        ) : (
          <>
            <Text theme={theme} variant="titleMedium">
              {t("profile.fields.favoriteMovieGenres")}
            </Text>
            <View style={styles.chipContainer}>
              {updatedUser.favoriteMovieGenres.length > 0 ? (
                updatedUser.favoriteMovieGenres.map((genre: Genre) => (
                  <Chip key={genre.id} style={styles.chip} theme={theme}>
                    {genre.name}
                  </Chip>
                ))
              ) : (
                <Text theme={theme}>-</Text>
              )}
            </View>

            <Text theme={theme} variant="titleMedium" style={{ marginTop: 8 }}>
              {t("profile.fields.favoriteTVGenres")}
            </Text>
            <View style={styles.chipContainer}>
              {updatedUser.favoriteTVGenres.length > 0 ? (
                updatedUser.favoriteTVGenres.map((genre: Genre) => (
                  <Chip key={genre.id} style={styles.chip} theme={theme}>
                    {genre.name}
                  </Chip>
                ))
              ) : (
                <Text theme={theme}>-</Text>
              )}
            </View>

            {/* Theme and Language Toggles */}
            <List.Section
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 8,
              }}
              theme={theme}
              title={t("profile.settings.preferences")}
            >
              <List.Item
                left={(props) => <List.Icon {...props} icon="translate" />}
                title={t("common.languages.dutch")}
                right={() => (
                  <Switch
                    value={i18n.language === "nl"}
                    onValueChange={() =>
                      handleChangeLanguage(i18n.language === "en" ? "nl" : "en")
                    }
                  />
                )}
                theme={theme}
              />
              <List.Item
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={theme.dark ? "weather-sunny" : "weather-night"}
                  />
                )}
                theme={theme}
                title={
                  theme.dark
                    ? t("common.actions.lightMode")
                    : t("common.actions.darkMode")
                }
                right={() => (
                  <Switch value={theme.dark} onValueChange={toggleTheme} />
                )}
              />
            </List.Section>

            {/* Logout and Delete */}
            <List.Section
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 8,
              }}
              title={t("profile.settings.title")}
              theme={theme}
            >
              <List.Item
                title={t("profile.settings.logout")}
                left={(props) => <List.Icon {...props} icon="logout" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleLogout}
                theme={theme}
              />
              <List.Item
                title={t("profile.settings.deleteAccount")}
                left={(props) => <List.Icon {...props} icon="delete" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={handleDeleteAccount}
                theme={theme}
              />
              <List.Item
                title={t("profile.actions.changePassword")}
                left={(props) => <List.Icon {...props} icon="lock" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setPasswordDialogVisible(true)}
                theme={theme}
              />
            </List.Section>
          </>
        )}

        {/* Snackbar */}
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          duration={3000}
        >
          {snackbar.message}
        </Snackbar>

        {/* Delete Account Dialog */}
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={() => setDialogVisible(false)}
          >
            <Dialog.Title>{t("profile.settings.deleteAccount")}</Dialog.Title>
            <Dialog.Content>
              <Text>{t("profile.settings.confirmDeleteAccount")}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>
                {t("common.actions.cancel")}
              </Button>
              <Button onPress={confirmDeleteAccount}>
                {t("common.actions.confirm")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {/* Change Password Dialog */}
        <Portal>
          <Dialog
            visible={passwordDialogVisible}
            theme={theme}
            onDismiss={() => setPasswordDialogVisible(false)}
          >
            <Dialog.Title theme={theme}>
              {t("profile.actions.changePassword")}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label={t("profile.fields.currentPassword")}
                value={passwords.current}
                onChangeText={(text) =>
                  setPasswords({ ...passwords, current: text })
                }
                secureTextEntry
                theme={theme}
                mode="outlined"
                style={styles.input}
                error={passwords.current === ""}
              />
              <TextInput
                label={t("profile.fields.newPassword")}
                value={passwords.new}
                onChangeText={(text) =>
                  setPasswords({ ...passwords, new: text })
                }
                secureTextEntry
                theme={theme}
                mode="outlined"
                style={styles.input}
                error={passwords.new === ""}
              />
              <TextInput
                label={t("profile.fields.confirmPassword")}
                value={passwords.confirm}
                onChangeText={(text) =>
                  setPasswords({ ...passwords, confirm: text })
                }
                secureTextEntry
                theme={theme}
                mode="outlined"
                style={styles.input}
                error={passwords.confirm !== passwords.new}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                theme={theme}
                onPress={() => setPasswordDialogVisible(false)}
              >
                {t("common.actions.cancel")}
              </Button>
              <Button theme={theme} onPress={handleChangePassword}>
                {t("common.actions.confirm")}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
      {/* Action Buttons */}
      {isEditing ? (
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => setIsEditing(false)}
            theme={theme}
          >
            {t("common.actions.cancel")}
          </Button>
          <Button mode="contained" onPress={handleSave} theme={theme}>
            {t("common.actions.save")}
          </Button>
        </View>
      ) : (
        <FAB
          icon="pencil"
          style={styles.fab}
          onPress={() => setIsEditing(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoContainer: { marginBottom: 16, alignItems: "center" },
  chipContainer: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  input: { marginBottom: 16 },
  headerText: { marginVertical: 8, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between" },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
});

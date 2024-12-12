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
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { getUser, updateUser, logout } from "../../../api/userService";
import GenreChips, { Genre } from "../../../components/GenreChips";
import { useRouter } from "expo-router";

export default function ProfileIndex() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<any>({
    favoriteMovieGenres: [],
    favoriteTVGenres: [],
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Fetch user data and initialize state
    getUser().then((fetchedUser) => {
      setUser(fetchedUser);
      setUpdatedUser(fetchedUser);
    });
  }, []);

  const handleToggleMovieGenre = (genre: Genre) => {
    const isSelected = updatedUser.favoriteMovieGenres.some(
      (g: Genre) => g.id === genre.id
    );
    const newGenres = isSelected
      ? updatedUser.favoriteMovieGenres.filter((g: Genre) => g.id !== genre.id)
      : [...updatedUser.favoriteMovieGenres, genre];

    setUpdatedUser((prevState: any) => ({
      ...prevState,
      favoriteMovieGenres: newGenres,
    }));
  };

  const handleToggleTVGenre = (genre: Genre) => {
    const isSelected = updatedUser.favoriteTVGenres.some(
      (g: Genre) => g.id === genre.id
    );
    const newGenres = isSelected
      ? updatedUser.favoriteTVGenres.filter((g: Genre) => g.id !== genre.id)
      : [...updatedUser.favoriteTVGenres, genre];

    setUpdatedUser((prevState: any) => ({
      ...prevState,
      favoriteTVGenres: newGenres,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(user._id, updatedUser); // Call API to update user
      setUser(updatedUser);
      setIsEditing(false);
      setSnackbarMessage(t("profile.success.profileUpdated"));
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t("profile.errors.profileUpdate"));
      setSnackbarVisible(true);
    }
  };

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    Alert.alert(t("common.languageChanged"));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.navigate("/login");
    } catch (error) {
      console.error(t("errors.auth.logout"), error);
    }
  };

  if (!user) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={{ color: theme.colors.onBackground }}>
          {t("profile.loading")}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {/* Display or Edit Fields */}
      {!isEditing ? (
        <>
          <Text style={[styles.headerText, { color: theme.colors.primary }]}>
            {t("profile.fields.username")}:
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.onBackground }]}>
            {user.username}
          </Text>
          <Text style={[styles.headerText, { color: theme.colors.primary }]}>
            {t("profile.fields.email")}:
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.onBackground }]}>
            {user.email}
          </Text>
          <Text style={[styles.headerText, { color: theme.colors.primary }]}>
            {t("profile.fields.favoriteMovieGenres")}:
          </Text>
          <Text
            style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
          >
            {user.favoriteMovieGenres
              .map((genre: Genre) => genre.name)
              .join(", ") || "-"}
          </Text>
          <Text style={[styles.headerText, { color: theme.colors.primary }]}>
            {t("profile.fields.favoriteTVGenres")}:
          </Text>
          <Text
            style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}
          >
            {user.favoriteTVGenres
              .map((genre: Genre) => genre.name)
              .join(", ") || "-"}
          </Text>
        </>
      ) : (
        <>
          <TextInput
            label={t("profile.fields.username")}
            value={updatedUser.username || ""}
            onChangeText={(text) =>
              setUpdatedUser({ ...updatedUser, username: text })
            }
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label={t("profile.fields.email")}
            value={updatedUser.email || ""}
            onChangeText={(text) =>
              setUpdatedUser({ ...updatedUser, email: text })
            }
            mode="outlined"
            style={styles.input}
          />

          {/* Favorite Movie Genres */}
          <GenreChips
            selectedGenres={updatedUser.favoriteMovieGenres}
            onToggleGenre={handleToggleMovieGenre}
            title={t("profile.fields.favoriteMovieGenres")}
            genreType="movie"
          />

          {/* Favorite TV Genres */}
          <GenreChips
            selectedGenres={updatedUser.favoriteTVGenres}
            onToggleGenre={handleToggleTVGenre}
            title={t("profile.fields.favoriteTVGenres")}
            genreType="tv"
          />
        </>
      )}

      <List.Section>
        <Text style={[styles.headerText, { color: theme.colors.primary }]}>
          {t("common.preferences.language")}
        </Text>
        <List.Item
          title={t("common.languages.dutch")}
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={() => (
            <Switch
              value={i18n.language === "nl"}
              onValueChange={(value) =>
                handleChangeLanguage(value ? "nl" : "en")
              }
            />
          )}
        />
        <List.Item
          title={t("common.languages.english")}
          left={(props) => <List.Icon {...props} icon="translate" />}
          right={() => (
            <Switch
              value={i18n.language === "en"}
              onValueChange={(value) =>
                handleChangeLanguage(value ? "en" : "nl")
              }
            />
          )}
        />
      </List.Section>

      {/* Action Buttons */}
      {isEditing ? (
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => setIsEditing(false)}
            style={styles.button}
          >
            {t("common.actions.cancel")}
          </Button>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            {t("common.actions.save")}
          </Button>
        </View>
      ) : (
        <FAB
          icon="pencil"
          style={[styles.fab]}
          onPress={() => setIsEditing(true)}
        />
      )}
      <Button onPress={handleLogout}>{t("common.actions.logout")}</Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems: "center",
    padding: 16,
  },
  input: {
    width: "90%",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

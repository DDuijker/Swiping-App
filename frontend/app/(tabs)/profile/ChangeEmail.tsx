import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, TextInput, Snackbar } from "react-native-paper";
import { router } from "expo-router";
import { changeEmail } from "../../../api/userService"; // Correcte import

export default function ChangeEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleSave = async () => {
    if (!newEmail.includes("@")) {
      setError("Ongeldig e-mailadres");
      return;
    }
    try {
      await changeEmail(newEmail); // Correcte functie-aanroep
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 2000); // Navigeren na succes
    } catch (e) {
      setError("Kon e-mailadres niet wijzigen");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">E-mailadres wijzigen</Text>
      <TextInput
        label="Nieuw e-mailadres"
        value={newEmail}
        onChangeText={setNewEmail}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button mode="contained" onPress={handleSave}>
        Opslaan
      </Button>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        E-mailadres succesvol gewijzigd
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginVertical: 8 },
  error: { color: "red", marginVertical: 8 },
});

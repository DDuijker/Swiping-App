import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Snackbar } from "react-native-paper";
import { router } from "expo-router";
import { deleteAccount } from "../../../api/userService";

export default function DeleteAccount() {
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteAccount();
      setSnackbarVisible(true);
      setTimeout(() => router.replace("/login"), 2000);
    } catch (e) {
      alert("Kon account niet verwijderen");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Account verwijderen</Text>
      <Text>Weet je zeker dat je je account wilt verwijderen?</Text>
      <Button mode="contained" onPress={handleDelete} style={styles.button}>
        Verwijderen
      </Button>
      <Button mode="text" onPress={() => router.back()} style={styles.button}>
        Annuleren
      </Button>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        Account succesvol verwijderd
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  button: { marginVertical: 8 },
});

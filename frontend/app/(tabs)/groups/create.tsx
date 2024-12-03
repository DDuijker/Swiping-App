import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title, Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleCreateGroup = () => {
    setLoading(true);

    // Hardcoded action: You can replace this with a POST request to your backend
    console.log("Group Created:", {
      name,
      description,
      members: [],
    });

    // Simulate success and navigate back
    setTimeout(() => {
      setLoading(false);
      router.back(); // Navigate back to the previous screen
    }, 1000);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
       
      <Title>Create a New Group</Title>
      <TextInput
        label="Group Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={handleCreateGroup}
        loading={loading}
        disabled={loading || !name || !description} // Disable if loading or inputs are empty
        style={styles.button}
      >
        Create Group
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

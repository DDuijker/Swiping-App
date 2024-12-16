import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import { getUserId } from "../../../api/userService"; // Assuming this function fetches the logged-in user
import groupService from "@/api/groupService";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getUserId().then((id) => {
      setUserId(id);
    });
    console.log("User ID:", userId);
  });

  const handleCreateGroup = async () => {
    setLoading(true);

    try {
      if (!userId) throw new Error("User not logged in.");

      const groupData = {
        name,
        description,
        members: [], // Empty for now
        creator: userId, // Use the user's ObjectId
      };

      const createdGroup = await groupService.createGroup(groupData);
      console.log("Created Group:", createdGroup);
      console.log("Created Group:", groupData);

      // router.back(); // Navigate back after success
    } catch (error) {
      console.error("Error creating group:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        disabled={loading || !name || !description} // Disable if inputs are empty
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

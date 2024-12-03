import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import groupService from "../../../api/groupService";
import { getUser } from "../../../api/userService"; // Assuming this function fetches the logged-in user

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateGroup = async () => {
    setLoading(true);

    try {
      const user = await getUser(); // Fetch logged-in user
      if (!user) throw new Error("User not logged in.");

      const groupData = {
        name,
        description,
        members: [], // Empty for now
        creator: user._id, // Use the user's ObjectId
      };

      // const createdGroup = await groupService.createGroup(groupData);
      // console.log("Created Group:", createdGroup);
      console.log("Created Group:", groupData);

      router.back(); // Navigate back after success
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

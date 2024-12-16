import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Title,
  Provider,
  Searchbar,
  List,
} from "react-native-paper";
import { useRouter } from "expo-router";
import groupService from "../../../api/groupService";
import { getUser } from "../../../api/userService"; // Assuming this function fetches the logged-in user
import { getUserId } from "../../../api/userService";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../context/ThemeContext";
import { SPACING } from "../../../constants/DesignValues";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateGroupScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);

  useEffect(() => {
    getUserId().then((userId) => {
      setUserId(userId);
    });
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Hier straks een functie aanroepen die gebruikers ophaalt
  };

  const handleAddUser = (user) => {
    if (!addedUsers.includes(user)) {
      setAddedUsers([...addedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    setLoading(true);

    try {
      const groupData = {
        name,
        description,
        members: [], // Empty for now
        creator: userId, // Use the user's ObjectId
      };

      const createdGroup = await groupService.createGroup(groupData);

      router.back(); // Navigate back after success
    } catch (error) {
      console.error("Error creating group:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.form}>
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
          <Searchbar
            placeholder="Search for users"
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.searchbar}
          />
          <List.Section>
            {foundUsers.map((user) => (
              <List.Item
                key={user.id}
                title={user.username}
                description={user.email}
                onPress={() => handleAddUser(user)}
              />
            ))}
          </List.Section>
          <List.Section title="Added Users">
            {addedUsers.map((user) => (
              <List.Item key={user.id} title={user.username} />
            ))}
          </List.Section>
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
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  form: {
    margin: SPACING.xLarge,
    padding: SPACING.xLarge,
  },
  button: {
    margin: SPACING.xLarge,
  },
});

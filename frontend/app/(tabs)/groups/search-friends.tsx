import { useTheme } from "../../../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Appbar,
  TextInput,
  Avatar,
  Button,
  List,
  Searchbar,
} from "react-native-paper";
import { useState } from "react";
import { SPACING } from "../../../constants/DesignValues";
import { t } from "i18next";

const mockFriends = [
  { id: "1", name: "Alice Johnson", avatar: "https://via.placeholder.com/150" },
  { id: "2", name: "Bob Smith", avatar: "https://via.placeholder.com/150" },
  { id: "3", name: "Charlie Brown", avatar: "https://via.placeholder.com/150" },
  { id: "4", name: "Dana White", avatar: "https://via.placeholder.com/150" },
];

export default function Search() {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedFriends: initialSelectedFriends } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriends, setSelectedFriends] = useState(
    initialSelectedFriends || []
  );

  // Filtered friends based on search query
  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting a friend
  const handleSelectFriend = (friend) => {
    if (!selectedFriends.find((f) => f.id === friend.id)) {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  // Handle removing a friend
  const handleRemoveFriend = (friendId) => {
    setSelectedFriends(selectedFriends.filter((f) => f.id !== friendId));
  };

  // Handle saving selected friends
  const handleSaveFriends = () => {
    router.push({
      pathname: "/groups/create",
      params: { selectedFriends },
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Search Friends" />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />

        <Button
          mode="contained"
          onPress={handleSaveFriends}
          style={styles.saveButton}
        >
          {t("common.save")}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.xLarge,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.large,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  saveButton: {
    marginTop: SPACING.large,
  },
});

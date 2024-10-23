import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "expo-router";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Appbar,
  Searchbar,
  Button,
  List,
  Avatar,
  Checkbox,
} from "react-native-paper";
import { useState, useMemo, useEffect } from "react";
import { SPACING } from "../../../constants/DesignValues";
import { useTranslation } from "react-i18next";
import { Member } from "../../../interfaces/groupTypes";
import { useGroup } from "../../../context/GroupContext";

// Mock data for members
const mockMembers: Member[] = [
  {
    id: "1",
    username: "Alice Johnson",
    avatar: "https://ui-avatars.com/api/?name=Alice+Johnson",
  },
  {
    id: "2",
    username: "Bob Smith",
    avatar: "https://ui-avatars.com/api/?name=Bob+Smith",
  },
  {
    id: "3",
    username: "Charlie Brown",
    avatar: "https://ui-avatars.com/api/?name=Charlie+Brown",
  },
  {
    id: "4",
    username: "Dana White",
    avatar: "https://ui-avatars.com/api/?name=Dana+White",
  },
];

export default function SearchMembers() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { group, updateGroupDetails } = useGroup(); // Use group context

  const [searchQuery, setSearchQuery] = useState("");
  const [initialSelectedMembers, setInitialSelectedMembers] = useState<
    Member[]
  >([]);

  // Store the initial selected members when the component mounts
  useEffect(() => {
    setInitialSelectedMembers(group.selectedMembers);
  }, []);

  // Filter members based on the search query
  const filteredMembers = useMemo(
    () =>
      mockMembers.filter((member) =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  // Toggle member selection
  const toggleSelectMember = (member: Member) => {
    const isSelected = group.selectedMembers.some((m) => m.id === member.id);

    if (isSelected) {
      // Remove member from the selectedMembers list
      updateGroupDetails({
        selectedMembers: group.selectedMembers.filter(
          (m) => m.id !== member.id
        ),
      });
    } else {
      // Add member to the selectedMembers list
      updateGroupDetails({
        selectedMembers: [...group.selectedMembers, member],
      });
    }
  };

  // Handle cancelling adding new members, and restore the initial state
  const handleCancel = () => {
    updateGroupDetails({ selectedMembers: initialSelectedMembers });
    router.replace("/groups/create");
  };

  // Handle saving selected members and go back to the create screen
  const handleSaveMembers = () => {
    router.push("/groups/create");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction
          onPress={() => router.replace("/(tabs)/groups/create")}
        />
        <Appbar.Content title={t("groups.searchForPeople")} />
      </Appbar.Header>
      <View style={styles.content}>
        <Searchbar
          placeholder={t("common.search")}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.username}
              left={() => (
                <Avatar.Image size={40} source={{ uri: item.avatar }} />
              )}
              right={() => (
                <Checkbox
                  status={
                    group.selectedMembers.some((m) => m.id === item.id)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => toggleSelectMember(item)}
                />
              )}
              onPress={() => toggleSelectMember(item)}
            />
          )}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={handleCancel}>{t("common.cancel")}</Button>
          <Button mode="contained" onPress={handleSaveMembers}>
            {t("common.save")}
          </Button>
        </View>
      </View>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xLarge,
  },
  searchbar: {
    marginBottom: SPACING.xLarge,
  },
  buttonContainer: {
    marginTop: SPACING.xLarge,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.xLarge,
    gap: SPACING.medium,
  },
});

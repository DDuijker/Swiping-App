import { useTheme } from "../../../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Appbar,
  Searchbar,
  Button,
  List,
  Avatar,
  Checkbox,
} from "react-native-paper";
import { useEffect, useState, useCallback, useMemo } from "react";
import { SPACING } from "../../../constants/DesignValues";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

// Define the interface for a Member
interface Member {
  id: string;
  name: string;
  avatar: string;
}

// Mock data for members
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://ui-avatars.com/api/?name=Alice+Johnson",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://ui-avatars.com/api/?name=Bob+Smith",
  },
  {
    id: "3",
    name: "Charlie Brown",
    avatar: "https://ui-avatars.com/api/?name=Charlie+Brown",
  },
  {
    id: "4",
    name: "Dana White",
    avatar: "https://ui-avatars.com/api/?name=Dana+White",
  },
];

export default function SearchMembers() {
  const { t } = useTranslation(); // Translation hook
  const { theme } = useTheme(); // Access theme for consistent UI styling
  const router = useRouter(); // Router for navigation
  const { fromCreatePage, selectedMembers: initialSelectedMembers } =
    useLocalSearchParams(); // Retrieve passed params

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State to store the selected members
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // Effect to validate and parse the initially selected members from params
  useEffect(() => {
    if (initialSelectedMembers) {
      try {
        const parsedMembers = JSON.parse(initialSelectedMembers);
        setSelectedMembers(parsedMembers);
      } catch (error) {
        console.error("Failed to parse selected members:", error);
      }
    }
  }, [initialSelectedMembers]);

  // Redirect to 'groups/create' if this screen is accessed incorrectly
  useEffect(() => {
    if (!fromCreatePage) {
      router.replace("/groups/create");
    }
  }, [fromCreatePage, router]);

  // Filter members based on the search query (case-insensitive)
  const filteredMembers = useMemo(
    () =>
      mockMembers.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  // Function to toggle the selection of a member
  const toggleSelectMember = useCallback(
    (member: Member) => {
      setSelectedMembers((prevSelectedMembers) =>
        prevSelectedMembers.some((m) => m.id === member.id)
          ? prevSelectedMembers.filter((m) => m.id !== member.id)
          : [...prevSelectedMembers, member]
      );
    },
    [setSelectedMembers]
  );

  // Function to save selected members and navigate back to the group creation page
  const handleSaveMembers = useCallback(() => {
    router.push({
      pathname: "/groups/create",
      params: { selectedMembers: JSON.stringify(selectedMembers) },
    });
  }, [router, selectedMembers]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t("groups.searchMembers")} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* Search Bar for filtering members */}
        <Searchbar
          placeholder={t("common.search")}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          accessibilityLabel={t("common.search")}
        />

        {/* FlatList to display filtered members */}
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={{ uri: item.avatar }}
                  size={40}
                />
              )}
              right={() => (
                <Checkbox
                  status={
                    selectedMembers.some((m) => m.id === item.id)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => toggleSelectMember(item)}
                />
              )}
              onPress={() => toggleSelectMember(item)}
              accessibilityLabel={item.name}
            />
          )}
        />

        {/* Save Button to save the selected members */}
        <Button
          mode="contained"
          onPress={handleSaveMembers}
          style={styles.saveButton}
          accessibilityLabel={t("common.save")}
        >
          {t("common.save")}
        </Button>
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
    padding: SPACING.large,
    justifyContent: "flex-start",
  },
  searchbar: {
    marginBottom: SPACING.medium,
  },
  saveButton: {
    marginTop: SPACING.large,
  },
});

import { useTheme } from "../../../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import {
  Appbar,
  Button,
  Avatar,
  List,
  Divider,
  TextInput,
  Text,
} from "react-native-paper";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { SPACING } from "../../../constants/DesignValues";
import { useTranslation } from "react-i18next";

interface Member {
  id: string;
  name: string;
  avatar: string;
}

export default function CreateGroup() {
  const { t } = useTranslation(); // Translation hook
  const { theme } = useTheme(); // Theme hook for styling
  const router = useRouter();

  const { selectedMembers: initialSelectedMembers } = useLocalSearchParams();

  // States for the component
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [groupName, setGroupName] = useState(""); // Group name input
  const [description, setDescription] = useState(""); // Group description input

  // Effect to update selected members from params (parsed as JSON)
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

  // Function to allow users to pick an image for the group
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(t("common.permissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to reset the image back to default
  const resetImage = () => {
    setImage(null);
  };

  // Function to generate avatar source (either from image or placeholder)
  const getAvatarSource = () => {
    return image
      ? { uri: image }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            groupName || "Group"
          )}`,
        };
  };

  // Navigate to the "Add Members" screen to select members
  const handleAddMembers = () => {
    router.push({
      pathname: "/groups/search-members",
      params: {
        selectedMembers: JSON.stringify(selectedMembers),
        fromCreatePage: true,
      },
    });
  };

  // Handle creating a new group (save action)
  const handleCreateGroup = () => {
    const finalImage = getAvatarSource().uri;
    console.log(`Group Name: ${groupName}`);
    console.log(`Description: ${description}`);
    console.log(`Image URI: ${finalImage}`);
    console.log(`Selected Members: ${JSON.stringify(selectedMembers)}`);

    router.push("/groups"); // Redirect after saving
  };

  return (
    <SafeAreaView>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header with back navigation */}
        <Appbar.Header mode="center-aligned">
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={t("groups.create")} />
        </Appbar.Header>

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={styles.content}>
          {/* Avatar image for group */}
          <Avatar.Image
            size={120}
            source={getAvatarSource()}
            style={styles.avatar}
          />

          {/* Buttons for image actions */}
          <View style={styles.buttonContainer}>
            <Button mode="text" onPress={resetImage}>
              {t("common.resetImage")}
            </Button>
            <Button mode="contained" onPress={pickImage}>
              {t("common.pickImage")}
            </Button>
          </View>

          {/* Input for group name */}
          <View>
            <TextInput
              mode="flat"
              label={t("groups.name")}
              value={groupName}
              onChangeText={setGroupName}
              style={styles.input}
              theme={{ colors: { text: theme.colors.onSurface } }}
            />

            {/* Input for group description */}
            <TextInput
              mode="flat"
              label={t("groups.description")}
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              theme={{ colors: { text: theme.colors.onSurface } }}
            />
          </View>
          <Divider />

          {/* Button to add members */}
          <Button mode="outlined" onPress={handleAddMembers}>
            {t("groups.addMembers")}
          </Button>

          {/* FlatList for displaying selected members */}
          {selectedMembers.length && (
            <View style={styles.members}>
              <Text>{t("groups.members")}</Text>
              <FlatList
                data={selectedMembers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <List.Item
                    title={item.name}
                    left={() => (
                      <Avatar.Image source={{ uri: item.avatar }} size={40} />
                    )}
                    right={() => (
                      <Button
                        mode="text"
                        onPress={() =>
                          setSelectedMembers(
                            selectedMembers.filter((m) => m.id !== item.id)
                          )
                        }
                      >
                        {t("common.remove")}
                      </Button>
                    )}
                  />
                )}
                horizontal={false}
              />
            </View>
          )}

          {/* Cancel and Save buttons */}
          <View style={styles.buttonContainer}>
            <Button onPress={() => router.push("/groups")}>
              {t("common.cancel")}
            </Button>
            <Button
              mode="contained"
              onPress={handleCreateGroup}
              style={styles.button}
            >
              {t("common.save")}
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xLarge,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    marginBottom: SPACING.medium,
  },
  members: {
    marginTop: SPACING.large,
    marginBottom: SPACING.large,
  },
  buttonContainer: {
    marginTop: SPACING.large,
    marginBottom: SPACING.large,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 200,
  },
  button: {
    flex: 1,
    marginHorizontal: SPACING.small,
  },
  input: {
    width: "100%",
    marginBottom: SPACING.medium,
  },
});

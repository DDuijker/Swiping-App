import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Appbar, Button, TextInput, Avatar } from "react-native-paper";
import { SPACING } from "../../../constants/DesignValues";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function CreateGroup() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null); // State for the group image
  const [groupName, setGroupName] = useState(""); // State for the group name
  const [description, setDescription] = useState(""); // State for the group description
  const [selectedFriends, setSelectedFriends] = useState([]); // State for selected friends

  // Function to pick an image from the device
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied to access media library");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Save the image URI in state
    }
  };

  const resetImage = () => {
    setImage(null);
  };

  // Function to handle the creation of a group
  const handleCreateGroup = () => {
    const finalImage = image
      ? image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          groupName || "Jane Doe"
        )}`;
    console.log(`Group Name: ${groupName}`);
    console.log(`Description: ${description}`);
    console.log(`Image URI: ${finalImage}`);
    console.log(
      `Selected Friends: ${selectedFriends.map((friend) => friend.name)}`
    );

    // Here you would send the image and group data to your backend/database
    router.push("/groups");
  };

  // Function to handle navigating to the friend search screen
  const handleAddFriends = () => {
    router.push({
      pathname: "/groups/search-friends",
      params: { selectedFriends },
    });
  };

  return (
    <SafeAreaView>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View>
          <Appbar.Header mode="center-aligned">
            <Appbar.BackAction onPress={() => router.back()} />
            <Appbar.Content
              title={t("groups.create")}
              color={theme.colors.onBackground}
            />
          </Appbar.Header>
        </View>
        <View style={styles.content}>
          <Avatar.Image
            size={120}
            source={
              image
                ? { uri: image }
                : {
                    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      groupName
                    )}`,
                  }
            }
            style={styles.avatar}
          />
          <View style={styles.buttonContainer}>
            <Button mode="text" onPress={resetImage}>
              {t("common.resetImage")}
            </Button>
            <Button mode="contained" onPress={pickImage}>
              {t("common.pickImage")}
            </Button>
          </View>

          <TextInput
            mode="flat"
            label={t("groups.name")}
            value={groupName}
            onChangeText={setGroupName}
            style={styles.input}
            theme={{ colors: { text: theme.colors.onSurface } }}
          />
          <TextInput
            mode="flat"
            label={t("groups.description")}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            theme={{ colors: { text: theme.colors.onSurface } }}
          />

          {/* Button to navigate to the friend search screen */}
          <Button
            mode="outlined"
            onPress={handleAddFriends}
            style={styles.addFriendsButton}
          >
            {t("groups.addFriends")}
          </Button>

          <View style={styles.buttonContainer}>
            <Button mode="text" onPress={() => router.push("/groups")}>
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
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xLarge,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.large,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  avatar: {
    marginBottom: SPACING.medium,
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
  addFriendsButton: {
    marginBottom: SPACING.medium,
  },
});

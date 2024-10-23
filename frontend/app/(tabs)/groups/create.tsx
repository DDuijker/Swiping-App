import { useTheme } from "../../../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
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
import { SafeAreaProvider } from "react-native-safe-area-context";

interface Member {
  id: string;
  name: string;
  avatar: string;
}

export default function CreateGroup() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedMembers: initialSelectedMembers } = useLocalSearchParams();

  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

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

  const resetImage = () => setImage(null);

  const getAvatarSource = () => {
    return image
      ? { uri: image }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            groupName || "Group"
          )}`,
        };
  };

  const handleAddMembers = () => {
    router.push({
      pathname: "/groups/search-members",
      params: {
        selectedMembers: JSON.stringify(selectedMembers),
        fromCreatePage: true,
      },
    });
  };

  const handleCreateGroup = () => {
    const finalImage = getAvatarSource().uri;
    console.log(`Group Name: ${groupName}`);
    console.log(`Description: ${description}`);
    console.log(`Image URI: ${finalImage}`);
    console.log(`Selected Members: ${JSON.stringify(selectedMembers)}`);
    router.push("/groups");
  };

  return (
    <SafeAreaProvider
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView style={styles.safeArea}>
        <Appbar.Header mode="center-aligned">
          <Appbar.BackAction
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/groups")
            }
          />
          <Appbar.Content title={t("groups.create")} />
        </Appbar.Header>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // This ensures the keyboard does not interfere with scrolling.
          scrollEnabled={true} // Explicitly enabling scrolling
          showsVerticalScrollIndicator={true} // To show the scrollbar
          pointerEvents="auto" // Ensures the scrollview handles touch events properly
        >
          {/* Avatar */}
          <Avatar.Image
            size={120}
            source={getAvatarSource()}
            style={styles.avatar}
          />

          {/* Image Actions */}
          <View style={styles.buttonContainer}>
            <Button mode="text" onPress={resetImage}>
              {t("common.resetImage")}
            </Button>
            <Button mode="contained" onPress={pickImage}>
              {t("common.pickImage")}
            </Button>
          </View>

          {/* Group Name Input */}
          <TextInput
            mode="flat"
            label={t("groups.name")}
            value={groupName}
            onChangeText={setGroupName}
            style={styles.input}
            theme={{ colors: { text: theme.colors.onSurface } }}
          />

          {/* Group Description Input */}
          <TextInput
            mode="flat"
            label={t("groups.description")}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            theme={{ colors: { text: theme.colors.onSurface } }}
          />

          {/* Add Members Button */}
          <Button mode="outlined" onPress={handleAddMembers}>
            {t("groups.addMembers")}
          </Button>

          {/* Selected Members List */}
          {selectedMembers.length > 0 && (
            <View style={styles.members}>
              <Text variant="headlineSmall">{t("groups.members")}</Text>
              {selectedMembers.map((item) => (
                <List.Item
                  key={item.id}
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
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button onPress={() => router.push("/groups")}>
              {t("common.cancel")}
            </Button>
            <Button mode="contained" onPress={handleCreateGroup}>
              {t("common.save")}
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SPACING.large,
    paddingHorizontal: SPACING.medium,
    flexGrow: 1,
  },
  avatar: {
    marginBottom: SPACING.medium,
    alignSelf: "center",
  },
  members: {
    marginTop: SPACING.large,
    marginBottom: SPACING.large,
  },
  buttonContainer: {
    marginTop: SPACING.large,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.xLarge,
    gap: SPACING.medium,
  },
  input: {
    width: "100%",
    marginBottom: SPACING.large,
  },
});

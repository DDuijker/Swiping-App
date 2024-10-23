import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "expo-router";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Appbar, Button, Avatar, List, TextInput } from "react-native-paper";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { SPACING } from "../../../constants/DesignValues";
import { useTranslation } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useGroup } from "../../../context/GroupContext";

export default function CreateGroup() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const { group, updateGroupDetails } = useGroup(); // Use group context

  const [image, setImage] = useState<string | null>(group.image); // Local state for image

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
      updateGroupDetails({ image: result.assets[0].uri });
    }
  };

  const getAvatarSource = () => {
    return image
      ? { uri: image }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            group.groupName || "Group"
          )}`,
        };
  };

  const resetImage = () => {
    setImage(null);
    updateGroupDetails({ image: null });
  };

  const handleAddMembers = () => {
    router.push("/groups/search-members");
  };

  const handleCreateGroup = () => {
    console.log("Group Data:", group); // Use group data from context
    router.push("/groups");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Appbar */}
        <Appbar.Header mode="center-aligned">
          <Appbar.BackAction onPress={() => router.replace("/groups")} />
          <Appbar.Content title={t("groups.create")} />
        </Appbar.Header>
        {/* Content */}
        <View style={styles.content}>
          <ScrollView>
            <Avatar.Image
              style={styles.avatar}
              size={120}
              source={getAvatarSource()}
            />
            <View style={styles.buttonContainer}>
              <Button onPress={resetImage}>{t("common.resetImage")}</Button>
              <Button mode="contained-tonal" onPress={pickImage}>
                {t("common.pickImage")}
              </Button>
            </View>

            <TextInput
              mode="flat"
              label={t("groups.name")}
              value={group.groupName}
              onChangeText={(text) => updateGroupDetails({ groupName: text })}
              style={styles.input}
              theme={{ colors: { text: theme.colors.onSurface } }}
            />

            <TextInput
              mode="flat"
              label={t("groups.description")}
              value={group.description}
              onChangeText={(text) => updateGroupDetails({ description: text })}
              style={styles.input}
              theme={{ colors: { text: theme.colors.onSurface } }}
            />

            <Button mode="outlined" onPress={handleAddMembers}>
              {t("groups.addMembers")}
            </Button>

            {/* Display Selected Members */}
            {group.selectedMembers.length > 0 && (
              <View style={styles.members}>
                {group.selectedMembers.map((member) => (
                  <List.Item
                    key={member.id}
                    title={member.username}
                    left={() => (
                      <Avatar.Image size={40} source={{ uri: member.avatar }} />
                    )}
                    right={() => (
                      <Button
                        onPress={() =>
                          updateGroupDetails({
                            selectedMembers: group.selectedMembers.filter(
                              (m) => m.id !== member.id
                            ),
                          })
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
        </View>
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
  content: {
    justifyContent: "center",
    alignItems: "center",
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

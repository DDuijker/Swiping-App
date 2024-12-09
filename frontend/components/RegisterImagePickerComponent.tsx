import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

interface ImagePickerComponentProps {
  avatar: string;
  setAvatar: (uri: string) => void;
  username: string;
  onError: (message: string) => void;
  removeText: string;
  uploadText: string;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  avatar,
  setAvatar,
  username,
  onError,
  removeText,
  uploadText,
}) => {
  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        onError("Permission to access media library is denied.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      onError("Error picking image.");
    }
  };

  const convertToBase64 = async (uri: string) => {
    try {
      if (uri.startsWith("data:")) {
        return uri.split(",")[1];
      }

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
      );

      return await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      throw new Error("Failed to process image.");
    }
  };

  const removeImage = () => setAvatar("");

  const getAvatarSource = () => {
    return avatar
      ? { uri: avatar }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            username || "User"
          )}`,
        };
  };

  return (
    <View style={styles.avatarContainer}>
      <Avatar.Image size={100} source={getAvatarSource()} />
      <View style={styles.avatarButtons}>
        {avatar ? (
          <Button
            onPress={removeImage}
            mode="outlined"
            style={styles.removeButton}
          >
            {removeText}
          </Button>
        ) : null}
        <Button onPress={pickImage} mode="outlined">
          {uploadText}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarButtons: {
    flexDirection: "row",
    marginTop: 16,
  },
  removeButton: {
    marginRight: 8,
  },
});

export default ImagePickerComponent;

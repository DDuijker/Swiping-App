import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function GroupPage() {
  const theme = useTheme();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen  options={
        {
          title: 'My Groups',
        }
      }/>
      <Text>My Groups</Text>
    </View>
  );
}

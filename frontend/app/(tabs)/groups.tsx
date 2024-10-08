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
        backgroundColor: theme.colors.background,
      }}
    >
      <Stack.Screen  options={
        {
          title: 'Groups',
          headerTintColor: theme.colors.onBackground,
        }
      }/>
      <Text style={{color: theme.colors.onBackground}}>My Groups</Text>
    </View>
  );
}

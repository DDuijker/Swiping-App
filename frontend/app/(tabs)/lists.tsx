import { Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Stack } from "expo-router";

export default function ListPage() {
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
          title: 'Lists',
          headerTintColor: theme.colors.onBackground,
        }
      }/>
      <Text style={{color: theme.colors.onBackground}}>My Lists</Text>
    </View>
  );
}

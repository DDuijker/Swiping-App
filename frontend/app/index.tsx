import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome</Text>
      <Link href={"/register"} asChild>
        <Button mode="contained">Register</Button>
      </Link>
      <Link href={"/login"} asChild>
        <Button mode="text">Login</Button>
      </Link>
    </View>
  );
}

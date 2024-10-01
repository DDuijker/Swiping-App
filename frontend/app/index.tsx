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
      <Link href={"/register"}>
        Register
      </Link>
      <Link href={"/login"}>
        Login
      </Link>
    </View>
  );
}

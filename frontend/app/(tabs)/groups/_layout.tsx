import { GroupProvider } from "../../../context/GroupContext";
import { Stack } from "expo-router";

export default function GroupsLayout() {
  return (
    <GroupProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main Groups screen */}
        <Stack.Screen name="index" options={{ title: "Groups" }} />
        {/* Create Group screen */}
        <Stack.Screen name="create" options={{ title: "Create Group" }} />
        {/* Search Members screen */}
        <Stack.Screen
          name="search-members"
          options={{ title: "Search Members" }}
        />
      </Stack>
    </GroupProvider>
  );
}

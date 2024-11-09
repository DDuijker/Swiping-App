import React from "react";
import AppProviders from "../components/AppProviders";
import { router, Stack } from "expo-router";
import { useUser } from "../context/UserContext";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { user, loading } = useUser();

  React.useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/");
    }
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Public Routes */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />

        {/* Protected Routes */}
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade",
            headerShown: false,
          }}
        />
      </Stack>
    </AppProviders>
  );
}

import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useUser } from "../context/UserContext";
import { useRouter, Slot } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import AppProviders from "../components/AppProviders";
export default function MainLayout() {
  const { user, loading } = useUser();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect based on authentication status
      if (user) {
        router.replace("/(tabs)/groups"); // Redirect to groups if logged in
      } else {
        router.replace("/"); // Redirect to index (home or login) if not logged in
      }
    }
  }, [loading, user, router]);

  // Show a loading indicator while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AppProviders>
      <Slot />
    </AppProviders>
  );
}

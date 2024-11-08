import React, { useEffect } from "react";
import AppProviders from "../components/AppProviders";
import { Slot, useRouter, useSegments } from "expo-router";
import { isAuthenticated } from "../api/userService";
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const authenticated = await isAuthenticated();
      const inAuthGroup = segments[0] === "(tabs)";

      if (authenticated && !inAuthGroup) {
        router.replace("/(tabs)/groups");
      } else if (!authenticated && inAuthGroup) {
        router.replace("/");
      }
    };

    checkAuthAndRedirect();
  }, [segments]);

  return (
    <AppProviders>
      <Slot />
    </AppProviders>
  );
}

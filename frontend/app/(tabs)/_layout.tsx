import React, { useState, useEffect } from "react";
import { PaperProvider, BottomNavigation, Appbar } from "react-native-paper";
import { useWindowDimensions, ActivityIndicator, View } from "react-native";
import ListIndex from "./lists/index";
import GroupIndex from "./groups/index";
import ProfileIndex from "./profile/index";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";

export default function BottomTabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 80 : 60;

  const { user, loading } = useUser();
  const router = useRouter();

  // State to manage the active route
  const [index, setIndex] = useState(1);

  // Define routes for BottomNavigation
  const [routes] = useState([
    {
      key: "lists",
      title: t("lists.title"),
      focusedIcon: "bookmark",
      unfocusedIcon: "bookmark-outline",
    },
    {
      key: "groups",
      title: t("groups.title"),
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
    {
      key: "profile",
      title: t("profile.title"),
      focusedIcon: "account-circle",
      unfocusedIcon: "account-circle-outline",
    },
  ]);

  // Redirect to home or login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // Redirect to the home or login screen
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

  // Get the current tab title for the AppBar
  const getCurrentTitle = () => {
    return routes[index].title;
  };

  // Map each route key to its component
  const renderScene = BottomNavigation.SceneMap({
    lists: ListIndex,
    groups: GroupIndex,
    profile: ProfileIndex,
  });

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content
          color={theme.colors.onBackground}
          title={getCurrentTitle()}
        />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          height: tabBarHeight,
          paddingBottom: 20,
          backgroundColor: theme.colors.background,
        }}
        sceneAnimationType="shifting"
        labeled={true}
      />
    </PaperProvider>
  );
}

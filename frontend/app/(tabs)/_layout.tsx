import React, { useState } from "react";
import { PaperProvider, BottomNavigation, Appbar, IconButton } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import ListPage from "./lists";
import GroupPage from "./groups";
import ProfilePage from "./profile";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { SPACING } from "@/constants/DesignValues";

export default function BottomTabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 80 : 60;

  // State to manage the active route
  const [index, setIndex] = useState(0);

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

  // Get the current tab title for the AppBar
  const getCurrentTitle = () => {
    return routes[index].title;
  };

  // Map each route key to its component
  const renderScene = BottomNavigation.SceneMap({
    lists: ListPage,
    groups: GroupPage,
    profile: ProfilePage,
  });

  const handleAddGroup = () => {
    console.log("Add Group Button Pressed");
  };

  return (
    <ThemeProvider>
      <PaperProvider theme={theme}>
        <Appbar.Header mode="center-aligned">
          <Appbar.Content
            color={theme.colors.onBackground}
            title={getCurrentTitle()}
          />
          {index === 1 && ( // Only show the button when on the groups tab
            <IconButton 
              icon="plus" // Add a plus icon
              mode="contained" 
              onPress={handleAddGroup} 
              style={{ marginLeft: SPACING.large }} // Add some spacing
            />
          )}
        </Appbar.Header>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{
            height: tabBarHeight,
            paddingBottom: 20,
          }}
          sceneAnimationType="shifting"
          labeled={true}
        />
      </PaperProvider>
    </ThemeProvider>
  );
}

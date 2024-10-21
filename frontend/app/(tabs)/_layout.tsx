import React, { useState } from "react";
import { PaperProvider, BottomNavigation, Appbar } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import ListIndex from "./lists/index";
import GroupsLayout from "./groups/_layout";
import ProfileIndex from "./profile/index";
import { useTranslation } from "react-i18next";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { SPACING } from "../../constants/DesignValues";

export default function BottomTabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 80 : 60;

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

  // Map each route key to its component
  const renderScene = BottomNavigation.SceneMap({
    lists: ListIndex,
    groups: GroupsLayout,
    profile: ProfileIndex,
  });

  return (
    <ThemeProvider>
      <PaperProvider theme={theme}>
        
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{
            height: tabBarHeight,
            paddingBottom: SPACING.large,
          }}
          sceneAnimationType="shifting"
          labeled={true}
        />
      </PaperProvider>
    </ThemeProvider>
  );
}

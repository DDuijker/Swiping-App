import { Appbar, BottomNavigation } from "react-native-paper";
import { useWindowDimensions, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import React from "react";
import ListScreen from "./lists/index";
import GroupsScreen from "./groups/index";
import ProfileScreen from "./profile/index";
import AppProviders from "../../components/AppProviders";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 80 : 60;
  const [index, setIndex] = React.useState(1);

  const [routes] = React.useState([
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

  const renderScene = BottomNavigation.SceneMap({
    lists: ListScreen,
    groups: GroupsScreen,
    profile: ProfileScreen,
  });

  return (
    <AppProviders>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar.Header
          mode="center-aligned"
          style={{
            backgroundColor: "transparent",
            elevation: 0,
          }}
        >
          <Appbar.Content
            color={theme.colors.onBackground}
            title={routes[index].title}
          />
        </Appbar.Header>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{
            height: tabBarHeight,
            backgroundColor: theme.colors.elevation.level2,
          }}
          sceneAnimationType="shifting"
          labeled={true}
          theme={theme}
        />
      </View>
    </AppProviders>
  );
}

import React, { useState } from 'react';
import { PaperProvider, BottomNavigation, useTheme, Appbar } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import ListPage from './lists';
import GroupPage from './groups';
import ProfilePage from './profile';

export default function BottomTabsLayout() {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 80 : 60;

  // State to manage the active route
  const [index, setIndex] = useState(0);

  // Define routes for BottomNavigation
  const [routes] = useState([
    { key: 'lists', title: 'Lists', focusedIcon: 'bookmark', unfocusedIcon: 'bookmark-outline' },
    { key: 'groups', title: 'Groups', focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline'},
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
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

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header mode='center-aligned'>
          <Appbar.Content title={getCurrentTitle()} />
        </Appbar.Header>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{
          height: tabBarHeight,
          paddingBottom: 20,
        }}
        sceneAnimationType='shifting'
        labeled={true} 
      />
    </PaperProvider>
  );
}

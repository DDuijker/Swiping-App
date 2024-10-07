import HomePage from '../app/(tabs)';
import ListPage from '../app/(tabs)/lists';
import ProfilePage from '../app/(tabs)/profile';
import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';

const ListsRoute = () => <ListPage />;

const HomeRoute = () => <HomePage />;

const ProfileRoute = () => <ProfilePage />;

export default function Navbar() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Groepen', icon: 'account-group' },
    { key: 'lists', title: 'Lists', icon: 'bookmark-multiple' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    lists: ListsRoute,
    profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
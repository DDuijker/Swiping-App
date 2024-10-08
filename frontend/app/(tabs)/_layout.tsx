import React from 'react';
import { Tabs } from 'expo-router';
import { PaperProvider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';

export default function TabsLayout() {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 90 : 70;
  
  
  return (
    <PaperProvider theme={theme}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.onSurface,
        tabBarInactiveTintColor: theme.colors.surface,
        tabBarStyle: {
          backgroundColor: theme.colors.secondaryContainer,
          height: tabBarHeight,
          padding: theme.roundness * 2,
          paddingBottom: 20,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIconStyle: { marginBottom: -3 },
        headerShown: true,
        headerTitleAlign: 'center',
        headerTransparent: true,
      }}
    >
       <Tabs.Screen
        name="lists"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'bookmark' : 'bookmark-outline'} size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'account-group' : 'account-group-outline'} size={28} color={color} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ?  'account-circle' : 'account-circle-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  </PaperProvider>
  );
}

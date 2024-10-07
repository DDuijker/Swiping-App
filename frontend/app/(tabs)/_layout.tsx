import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';

export default function TabsLayout() {
  const { colors, roundness,  } = useTheme();
  const { height } = useWindowDimensions();
  const tabBarHeight = height > 700 ? 90 : 70;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.onSecondaryContainer,
        tabBarInactiveTintColor: colors.secondaryContainer,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: tabBarHeight,
          padding: roundness * 2,
          paddingBottom: 20,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIconStyle: { marginBottom: -3 },
        headerShown: true,
          headerTitleAlign: 'center',
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
        name="index"
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
  );
}

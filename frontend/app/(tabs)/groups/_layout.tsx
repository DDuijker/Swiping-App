import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function GroupsLayout() {
  return (
    <View>
        <Stack>
            {/* All screens in the groups folder will use this stack layout */}
            <Stack.Screen name="index" />
            <Stack.Screen name="create"/>
        </Stack>
    </View>
  );
}

import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Card, Title, Paragraph } from "react-native-paper";
import { useTheme } from "../../../context/ThemeContext";

export default function GroupDetail() {
  const { id } = useLocalSearchParams(); // Get the group ID from the route
  const { theme } = useTheme();
  const router = useRouter();

  // Fetch the group details if needed (mock data for now)
  const group = {
    id,
    name: "Sample Group",
    description: "This is a detailed description of the group.",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.secondaryContainer, elevation: 5 },
        ]}
      >
        <Card.Content>
          <Title style={{ color: theme.colors.onSecondaryContainer }}>
            {group.name}
          </Title>
          <Paragraph style={{ color: theme.colors.onSecondaryContainer }}>
            {group.description}
          </Paragraph>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={() => router.push(`/groups/${id}/swiping`)}
      >
        Start swiping
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});

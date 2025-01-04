import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

export default function MatchesPage() {
  const { matches } = useLocalSearchParams();
  const parsedMatches = JSON.parse(matches || "[]"); // Parse matches from the URL params

  return (
    <View style={styles.container}>
      <FlatList
        data={parsedMatches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>{item.description}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
      {parsedMatches.length === 0 && (
        <Text style={styles.noMatchesText}>No matches yet!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 10,
  },
  noMatchesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#888",
  },
});

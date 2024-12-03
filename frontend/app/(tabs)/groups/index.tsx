import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Card, Title, Paragraph, FAB, IconButton } from "react-native-paper";

export default function GroupIndex() {
  const router = useRouter();
  const {theme} = useTheme();
  const groups = [
    {
      _id: "1",
      name: "Groep 1",
      description: "Beschrijving groep 1",
    },
    {
      _id: "2",
      name: "Groep 2",
      description: "Beschrijving groep 2",
    },
    {
      _id: "3",
      name: "Groep 3",
      description: "Beschrijving groep 3",
    },
  ];

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.textContainer}>
                <Title>{item.name}</Title>
                <Paragraph>{item.description}</Paragraph>
              </View>
              <IconButton
                icon="chevron-right"
                size={24}
                onPress={() => console.log(`Navigate to details of ${item.name}`)}
              />
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/groups/create")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

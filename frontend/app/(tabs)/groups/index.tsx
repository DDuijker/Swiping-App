import React, { useState, useEffect } from "react";
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native";
import { Card, Title, Paragraph, FAB } from "react-native-paper";
import groupService from "../../../api/groupService";
import { useRouter } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

export default function GroupIndex() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupService.getAllGroups(); // Fetch from backend
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading && <ActivityIndicator size="large" />}
      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.secondaryContainer,
                elevation: 5,
              },
            ]}
          >
            <Card.Content>
              <Title style={{ color: theme.colors.onSecondaryContainer }}>
                {item.name}
              </Title>
              <Paragraph style={{ color: theme.colors.onSecondaryContainer }}>
                {item.description}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/(tabs)/groups/create")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

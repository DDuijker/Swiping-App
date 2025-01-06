import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Swiping from "../../../../components/Swiping";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function SwipingPage() {
  const [matches, setMatches] = useState([]);
  const router = useRouter();
  const { theme } = useTheme();

  const handleMatch = (movie) => {
    setMatches((prevMatches) => [...prevMatches, movie]);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Swiping onMatch={handleMatch} />
      <Button
        style={{ margin: 10 }}
        mode="elevated"
        onPress={() =>
          router.push({
            pathname: "/groups/[id]/matches",
            params: { matches: JSON.stringify(matches) },
          })
        }
      >
        View Matches
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

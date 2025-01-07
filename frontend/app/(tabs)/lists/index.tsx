import { useTranslation } from "react-i18next";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { List, Divider, FAB } from "react-native-paper";

export default function ListIndex() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const favoriteMovies = [
    { title: "The Shawshank Redemption", description: "1994" },
    { title: "The Godfather", description: "1972" },
    { title: "The Dark Knight", description: "2008" },
    { title: "Pulp Fiction", description: "1994" },
    { title: "Forrest Gump", description: "1994" },
  ];

  const seriesToWatch = [
    { title: "Breaking Bad", description: "2008–2013" },
    { title: "Game of Thrones", description: "2011–2019" },
    { title: "Stranger Things", description: "2016–Present" },
    { title: "The Crown", description: "2016–Present" },
    { title: "The Mandalorian", description: "2019–Present" },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView>
        <List.Section>
          <List.Subheader theme={theme}>Favorite Movies</List.Subheader>
          {favoriteMovies.map((movie, index) => (
            <View key={index}>
              <List.Item
                theme={theme}
                title={movie.title}
                description={movie.description}
                left={(props) => <List.Icon {...props} icon="movie" />}
              />
              <Divider />
            </View>
          ))}
        </List.Section>

        <List.Section>
          <List.Subheader theme={theme}>Series to Watch</List.Subheader>
          {seriesToWatch.map((series, index) => (
            <View key={index}>
              <List.Item
                theme={theme}
                title={series.title}
                description={series.description}
                left={(props) => <List.Icon {...props} icon="television" />}
              />
              <Divider />
            </View>
          ))}
        </List.Section>
      </ScrollView>
      <FAB style={styles.fab} icon="plus" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

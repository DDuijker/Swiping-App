import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { SPACING } from "../constants/DesignValues";
import { useTheme } from "../context/ThemeContext";

export interface Genre {
  id: string;
  name: string;
}

interface GenreChipsProps {
  selectedGenres: Genre[];
  onToggleGenre: (genre: Genre) => void;
  title: string;
  genreType: "movie" | "tv";
}

const GenreChips: React.FC<GenreChipsProps> = ({
  selectedGenres,
  onToggleGenre,
  title,
  genreType,
}) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const language = i18n.language;

        const response = await fetch(
          `https://api.themoviedb.org/3/genre/${genreType}/list?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=${language}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching genres:", errorData);
          setError(t("common.errorLoadingGenres"));
          return;
        }

        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError(t("common.errorLoadingGenres"));
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [t, genreType, i18n.language]);

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        style={{ margin: SPACING.small }}
        color={theme.colors.primary}
      />
    );
  }

  if (error && typeof error === "string") {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View>
      <Text style={styles.title} theme={theme} variant="titleLarge">
        {title}
      </Text>
      <View style={styles.genreContainer}>
        {genres.map((genre: Genre) => (
          <Chip
            theme={theme}
            key={genre.id}
            selected={selectedGenres.some((g: Genre) => g.id === genre.id)}
            onPress={() => onToggleGenre(genre)}
            mode={
              selectedGenres.some((g: Genre) => g.id === genre.id)
                ? "flat"
                : "outlined"
            }
            style={{ margin: SPACING.small }}
          >
            <Text theme={theme}>{genre.name}</Text>
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.medium,
  },
});

export default GenreChips;

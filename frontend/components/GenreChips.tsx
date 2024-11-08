import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Chip, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { SPACING } from "../constants/DesignValues";

interface Genre {
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
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch genres from TMDb API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log("Fetching genres for:", genreType);
        const language = i18n.language; // Get the current language
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/${genreType}/list?&language=${language}?api_key=${process.env.TMDB_API_KEY}`, // Use the current language
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
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
        console.log("Fetched genres:", data.genres);
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError(t("common.errorLoadingGenres"));
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [genreType, i18n.language]); // Include i18n.language in the dependency array

  if (loading) {
    return <ActivityIndicator size="small" color="primary" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <>
      <Text style={styles.title} variant="titleLarge">
        {title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginBottom: SPACING.medium,
        }}
      >
        {genres.map((genre: Genre) => (
          <Chip
            key={genre.id}
            selected={selectedGenres.some((g: Genre) => g.id === genre.id)}
            onPress={() => onToggleGenre(genre)}
            mode={
              selectedGenres.some((g: Genre) => g.id === genre.id)
                ? "flat"
                : "outlined"
            }
            style={{ margin: 4 }}
          >
            {genre.name}
          </Chip>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});

export default GenreChips;

const Group = require("../models/Group");
const axios = require("axios");
exports.getMoviesByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { language } = req.query; // en or nl

    const supportedLanguages = ["en", "nl"];
    const lang = supportedLanguages.includes(language) ? language : "en";
    // Fetch group members
    const group = await Group.findById(groupId).populate("members");
    // If group not found, return 404
    if (!group) return res.status(404).json({ message: "Group not found" });
    // If group has no members, return error
    if (!group.members.length)
      return res.json({ message: "No members in group" });

    // Get all members' favorite genres
    // Create a set to store unique genre IDs
    const movieGenreIds = new Set();
    const tvGenreIds = new Set();

    group.members.forEach((member) => {
      member.favoriteMovieGenres.forEach((genre) => {
        movieGenreIds.add(genre.id);
      });
      member.favoriteTVGenres.forEach((genre) => {
        tvGenreIds.add(genre.id);
      });
    });
    // Convert sets to arrays
    const movieGenresArray = Array.from(movieGenreIds);
    const tvGenresArray = Array.from(tvGenreIds);

    // Fetch movies
    const tmdbApiKey = process.env.TMDB_API_KEY;
    if (!tmdbApiKey) {
      return res.status(500).json({ message: "TMDB API key not configured" });
    }
    // Define TMDB API URLs
    const moviesUrl = `https://api.themoviedb.org/3/discover/movie`;
    const tvUrl = `https://api.themoviedb.org/3/discover/tv`;

    // Fetch movies and TV shows
    const [moviesResponse, tvResponse] = await Promise.all([
      axios.get(moviesUrl, {
        params: {
          api_key: tmdbApiKey,
          with_genres: movieGenresArray.join(","),
          sort_by: "popularity.desc",
          language: lang,
        },
      }),
      axios.get(tvUrl, {
        params: {
          api_key: tmdbApiKey,
          with_genres: tvGenresArray.join(","),
          sort_by: "popularity.desc",
          language: lang,
        },
      }),
    ]);

    // Combine movies and TV shows
    const combinedResults = [
      ...moviesResponse.data.results.map((item) => ({
        ...item,
        media_type: "movie",
      })),
      ...tvResponse.data.results.map((item) => ({ ...item, media_type: "tv" })),
    ];

    // Optionally, shuffle the combined results for a better swiping experience
    const shuffledResults = combinedResults.sort(() => 0.5 - Math.random());

    // Respond with the combined list
    res.json({
      movies: shuffledResults,
    });
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

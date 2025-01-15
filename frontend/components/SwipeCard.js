import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for rendering star icons
import { useTheme } from "@/context/ThemeContext"; // Custom hook to access the theme context
import { Text } from "react-native-paper"; // Import Text component from React Native Paper

// Component to display a movie card
const SwipeCard = ({ movie }) => {
  const { theme } = useTheme(); // Access the current theme (light or dark)

  // Function to render the star rating
  const renderStars = (rating) => {
    const stars = [];
    // Loop to create up to 5 stars based on the movie's rating
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i} // Unique key for each star
          name={i < rating ? "star" : "star-o"} // Full star if index is less than rating, else outline
          size={20} // Size of the star icon
          color="#FFD700" // Gold color for the stars
        />
      );
    }
    return stars; // Return the array of star icons
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.secondaryContainer }, // Dynamically set background color based on theme
      ]}
    >
      {/* Movie poster image */}
      <Image source={{ uri: movie.image }} style={styles.image} />
      {/* Movie title */}
      <Text style={styles.title}>{movie.name}</Text>
      {/* Movie description */}
      <Text style={styles.description}>{movie.description}</Text>
      {/* Render the star rating */}
      <View style={styles.rating}>{renderStars(movie.rating)}</View>
    </View>
  );
};

// Styles for the SwipeCard component
const styles = StyleSheet.create({
  card: {
    width: 300, // Fixed width for the card
    height: 450, // Fixed height for the card
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderRadius: 10, // Rounded corners for the card
    shadowColor: "#000", // Shadow color for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 5, // Shadow blur radius for iOS
    elevation: 5, // Elevation for Android shadows
    padding: 10, // Padding inside the card
  },
  image: {
    width: "100%", // Image takes full width of the card
    height: 200, // Fixed height for the image
    borderRadius: 10, // Rounded corners for the image
    marginBottom: 10, // Space below the image
  },
  title: {
    fontSize: 20, // Font size for the title
    fontWeight: "bold", // Bold font style for the title
    textAlign: "center", // Center-align the text
    marginBottom: 10, // Space below the title
  },
  description: {
    fontSize: 14, // Font size for the description
    textAlign: "center", // Center-align the text
    marginBottom: 10, // Space below the description
  },
  rating: {
    flexDirection: "row", // Arrange stars in a row
    justifyContent: "center", // Center-align the stars
  },
});

export default SwipeCard; // Export the component for use in other parts of the application

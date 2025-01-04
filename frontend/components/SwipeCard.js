import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const SwipeCard = ({ movie }) => {
  // Render stars for the rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i < rating ? "star" : "star-o"}
          size={20}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: movie.image }} style={styles.image} />
      <Text style={styles.title}>{movie.name}</Text>
      <Text style={styles.description}>{movie.description}</Text>
      <View style={styles.rating}>{renderStars(movie.rating)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 450,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  rating: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default SwipeCard;

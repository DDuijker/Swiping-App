import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import SwipeCards from "react-native-swipe-cards";
import SwipeCard from "./SwipeCard";

const Swiping = ({ onMatch }) => {
  const movies = [
    {
      id: 1,
      name: "Inception",
      description:
        "Dom Cobb, a skilled thief, is offered a chance to have his past crimes forgiven by implanting another person's idea into a target's subconscious. A visually stunning, cerebral thriller that blurs the lines between dreams and reality.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg",
      genres: ["Sci-Fi", "Action", "Thriller"],
      rating: 5,
    },
    {
      id: 2,
      name: "Titanic",
      description:
        "A timeless love story unfolds aboard the RMS Titanic, where Jack and Rose, two passengers from vastly different worlds, fall in love during the ship's ill-fated maiden voyage.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg",
      genres: ["Drama", "Romance"],
      rating: 4,
    },
    {
      id: 3,
      name: "Avatar",
      description:
        "On the lush alien world of Pandora, a paraplegic Marine becomes torn between following his orders and protecting the world he feels is his new home.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/b0/Avatar-Teaser-Poster.jpg",
      genres: ["Sci-Fi", "Adventure"],
      rating: 4,
    },
    {
      id: 4,
      name: "The Matrix",
      description:
        "Neo, a computer hacker, learns about the true nature of his reality and his role in the war against its controllers. A genre-defining classic blending philosophy, action, and groundbreaking visuals.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
      genres: ["Sci-Fi", "Action"],
      rating: 5,
    },
    {
      id: 5,
      name: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son. A powerful tale of family, loyalty, and betrayal.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/a/af/The_Godfather%2C_The_Game.jpg",
      genres: ["Crime", "Drama"],
      rating: 5,
    },
    {
      id: 6,
      name: "Pulp Fiction",
      description:
        "A series of interconnected stories unfold in the underbelly of Los Angeles, featuring memorable characters and razor-sharp dialogue. A modern masterpiece of storytelling.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/8/82/Pulp_Fiction_cover.jpg",
      genres: ["Crime", "Drama"],
      rating: 5,
    },
    {
      id: 7,
      name: "Forrest Gump",
      description:
        "The story of a man with a low IQ but a big heart, who unknowingly influences some of the defining moments of the 20th century while chasing his one true love.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg",
      genres: ["Drama", "Romance"],
      rating: 4,
    },
    {
      id: 8,
      name: "Gladiator",
      description:
        "Betrayed by the empire he once served, a Roman general rises through the ranks of the gladiatorial arena to avenge the murder of his family and emperor.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/8/8d/Gladiator_ver1.jpg",
      genres: ["Action", "Drama"],
      rating: 4,
    },
    {
      id: 9,
      name: "The Dark Knight",
      description:
        "Gotham's vigilante hero faces his greatest challenge when the Joker, a criminal mastermind, threatens to plunge the city into chaos. A gripping tale of morality, sacrifice, and justice.",
      image: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
      genres: ["Action", "Drama"],
      rating: 5,
    },
    {
      id: 10,
      name: "Fight Club",
      description:
        "An insomniac office worker and a soap salesman create an underground fight club that evolves into something much more sinister. A gritty exploration of identity and rebellion.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg",
      genres: ["Drama", "Thriller"],
      rating: 4,
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [match, setMatch] = useState(null);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);

  const handleYup = () => {
    const likedMovie = movies[currentCardIndex];
    console.log("Liked:", likedMovie.name);
    checkForMatch(likedMovie);

    handleNextCard();
  };

  const hideButtons = () => {
    // Hide the like and dislike buttons
    setIsButtonsVisible(false);
  };

  const handleNope = () => {
    const dislikedMovie = movies[currentCardIndex];
    console.log("Disliked:", dislikedMovie.name);
    handleNextCard();
  };

  const handleNextCard = () => {
    if (currentCardIndex < movies.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("No more movies to swipe!");
      hideButtons();
      return (
        <View>
          <Text>No more movies to swipe!</Text>
        </View>
      );
    }
  };

  const checkForMatch = (movie) => {
    // Simulate a match condition
    if (movie.name === "Inception") {
      setMatch(movie);
      onMatch(movie);
    }
  };

  const resetMatch = () => {
    setMatch(null);
  };

  return (
    <View style={styles.container}>
      {match ? (
        <View style={styles.matchModal}>
          <Text style={styles.matchText}>It's a Match! 🎉</Text>
          <Text style={styles.matchText}>{match.name}</Text>
          <Button title="Continue" onPress={resetMatch} />
        </View>
      ) : (
        <View style={styles.swipeContainer}>
          <SwipeCards
            cards={movies.slice(currentCardIndex)}
            renderCard={(cardData) => <SwipeCard movie={cardData} />}
            renderNoMoreCards={() => (
              <View>
                <Text>No more movies to swipe!</Text>
              </View>
            )}
            handleYup={handleYup}
            handleNope={handleNope}
          />
          {isButtonsVisible ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.dislikeButton]}
                onPress={handleNope}
              >
                <Text style={styles.buttonText}>Dislike</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.likeButton]}
                onPress={handleYup}
              >
                <Text style={styles.buttonText}>Like</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  likeButton: {
    backgroundColor: "#4CAF50",
  },
  dislikeButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  matchModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  matchText: {
    color: "#fff",
    fontSize: 20,
    marginVertical: 10,
  },
});

export default Swiping;

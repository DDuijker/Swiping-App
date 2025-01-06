import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import SwipeCards from "react-native-swipe-cards";
import SwipeCard from "./SwipeCard";
import { useTheme } from "@/context/ThemeContext";

const Swiping = ({ onMatch }) => {
  const movies = [
    {
      id: 1,
      name: "Inception",
      description:
        "Dom Cobb, a skilled thief, is offered a chance to have his past crimes forgiven by implanting another person's idea into a target's subconscious. A visually stunning, cerebral thriller that blurs the lines between dreams and reality.",
      image:
        "https://imgs.search.brave.com/RVWiCbQyXi8zcLhmVPc_ggsmae4ocdIf2FoWXTpvg_8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzF1S00rTGRnRkwu/anBn",
      genres: ["Sci-Fi", "Action", "Thriller"],
      rating: 5,
    },
    {
      id: 2,
      name: "Titanic",
      description:
        "A timeless love story unfolds aboard the RMS Titanic, where Jack and Rose, two passengers from vastly different worlds, fall in love during the ship's ill-fated maiden voyage.",
      image:
        "https://imgs.search.brave.com/bNg2ym94HIDWjW1lB4ILeJjltFF_nrJFtzhGzXBxZXk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZW5k/ZXIuZmluZWFydGFt/ZXJpY2EuY29tL2lt/YWdlcy9yZW5kZXJl/ZC9tZWRpdW0vcG9z/dGVyLzYvOC9icmVh/ay9pbWFnZXMvYXJ0/d29ya2ltYWdlcy9t/ZWRpdW0vMy90aXRh/bmljLXBvc3Rlci1q/b3NodWEtd2lsbGlh/bXMuanBn",
      genres: ["Drama", "Romance"],
      rating: 4,
    },
    {
      id: 3,
      name: "Avatar",
      description:
        "On the lush alien world of Pandora, a paraplegic Marine becomes torn between following his orders and protecting the world he feels is his new home.",
      image:
        "https://imgs.search.brave.com/xlNMY-jC_TGZLP_OupoN0FrCruI2-nLcdBxzmRhfTTI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFrVFZMZVcxQ0wu/anBn",
      genres: ["Sci-Fi", "Adventure"],
      rating: 4,
    },
    {
      id: 4,
      name: "The Matrix",
      description:
        "Neo, a computer hacker, learns about the true nature of his reality and his role in the war against its controllers. A genre-defining classic blending philosophy, action, and groundbreaking visuals.",
      image:
        "https://imgs.search.brave.com/DSI3AXH3MB8fQQtDoyjPy6qt39XioU8QWCN68U6kNqY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzE0UjRpWXZJSEwu/anBn",
      genres: ["Sci-Fi", "Action"],
      rating: 5,
    },
    {
      id: 5,
      name: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son. A powerful tale of family, loyalty, and betrayal.",
      image:
        "https://imgs.search.brave.com/CORRx3217Lq8Ye7ThLdinuimKPUj8fDYjD09FepcuRs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9maWxt/YXJ0Z2FsbGVyeS5j/b20vY2RuL3Nob3Av/ZmlsZXMvVGhlLUdv/ZGZhdGhlci1WaW50/YWdlLU1vdmllLVBv/c3Rlci1PcmlnaW5h/bC0xLVNoZWV0LTI3/eDQxLTUyNTQuanBn/P3Y9MTY4ODAxNDkz/NCZ3aWR0aD0xMjAw",
      genres: ["Crime", "Drama"],
      rating: 5,
    },
    {
      id: 6,
      name: "Pulp Fiction",
      description:
        "A series of interconnected stories unfold in the underbelly of Los Angeles, featuring memorable characters and razor-sharp dialogue. A modern masterpiece of storytelling.",
      image:
        "https://imgs.search.brave.com/77vPRwjMWGu1J2Ds6qV9Dv7y_itH2IHWb6j5C2EmaCU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/b3JpZ2luYWxmaWxt/YXJ0LmNvbS9jZG4v/c2hvcC9wcm9kdWN0/cy9wdWxwX2ZpY3Rp/b25fMTk5NF9vcmln/aW5hbF9maWxtX2Fy/dF8yY2MzZTNmZC1j/MDE1LTRlMzctYTI4/MC1kNGE1YWIzODVi/MGEud2VicD92PTE2/NTYwOTY1MTcmd2lk/dGg9MTIwMA",
      genres: ["Crime", "Drama"],
      rating: 5,
    },
    {
      id: 7,
      name: "Forrest Gump",
      description:
        "The story of a man with a low IQ but a big heart, who unknowingly influences some of the defining moments of the 20th century while chasing his one true love.",
      image:
        "https://imgs.search.brave.com/8IdNPXIYAnYEzGSjUvgYB9u0itDKEcco7C7WID2G95A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmV0/c3lzdGF0aWMuY29t/LzQxNjEwMzAzL3Iv/aWwvNjQ4MzFmLzU2/ODczODQ4NTEvaWxf/NjAweDYwMC41Njg3/Mzg0ODUxX25ybWgu/anBn",
      genres: ["Drama", "Romance"],
      rating: 4,
    },
    {
      id: 8,
      name: "Gladiator",
      description:
        "Betrayed by the empire he once served, a Roman general rises through the ranks of the gladiatorial arena to avenge the murder of his family and emperor.",
      image:
        "https://imgs.search.brave.com/DWgi1HjCxMmlEfpw6YNuyvNEUSqK31jDqez4uZj_c_s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/b3JpZ2luYWxmaWxt/YXJ0LmNvbS9jZG4v/c2hvcC9wcm9kdWN0/cy9nbGFkaWF0b3Jf/MjAwMF9vcmlnaW5h/bF9maWxtX2FydC5q/cGc_dj0xNjIxOTg2/NzIzJndpZHRoPTEy/MDA",
      genres: ["Action", "Drama"],
      rating: 4,
    },
    {
      id: 9,
      name: "The Dark Knight",
      description:
        "Gotham's vigilante hero faces his greatest challenge when the Joker, a criminal mastermind, threatens to plunge the city into chaos. A gripping tale of morality, sacrifice, and justice.",
      image:
        "https://imgs.search.brave.com/LzqgXjYTWSHA0i5rA6PRO26UFN8JeOckS9NUQv4ULmw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFtVDdIUW5DNkwu/anBn",
      genres: ["Action", "Drama"],
      rating: 5,
    },
    {
      id: 10,
      name: "Fight Club",
      description:
        "An insomniac office worker and a soap salesman create an underground fight club that evolves into something much more sinister. A gritty exploration of identity and rebellion.",
      image:
        "https://imgs.search.brave.com/HN-Cgf4mZFrIeKyXOVF0ABrgm0u3WArDS8sinWw_QK4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFEK0tKa080U0wu/anBn",
      genres: ["Drama", "Thriller"],
      rating: 4,
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [match, setMatch] = useState(null);
  const [isButtonsVisible, setIsButtonsVisible] = useState(true);

  const handleLike = () => {
    const likedMovie = movies[currentCardIndex];
    checkForMatch(likedMovie);
    handleNextCard();
  };

  const hideButtons = () => {
    // Hide the like and dislike buttons
    setIsButtonsVisible(false);
  };

  const handleDislike = () => {
    handleNextCard();
  };

  const handleNextCard = () => {
    if (currentCardIndex < movies.length - 1) {
      setCurrentCardIndex((prevIndex) => prevIndex + 1);
    } else {
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
    <View style={[styles.container]}>
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
            handleYup={handleLike}
            handleNope={handleDislike}
          />
          {isButtonsVisible ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.dislikeButton]}
                onPress={handleDislike}
              >
                <Text style={styles.buttonText}>Dislike</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.likeButton]}
                onPress={handleLike}
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

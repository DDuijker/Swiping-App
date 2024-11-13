import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  GestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SPACING } from "@/constants/DesignValues";

// Define screen width and image size for scaling
const { width } = Dimensions.get("window");
const imageSize = width * 0.3;

const Tutorial = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current tutorial page
  const translateX = useSharedValue(0); // Shared value for swipe gesture animation
  const textTranslateX = useSharedValue(0); // Shared value for text animation

  const { theme } = useTheme(); // Access theme context for colors
  const { t } = useTranslation(); // Access translation function

  // Define the array of tutorial pages, each with an image, title, and description
  const tutorialPages = useMemo(
    () => [
      {
        titleKey: "tutorial.welcome.title",
        descriptionKey: "tutorial.welcome.description",
        illustration: require("../assets/images/searching.png"),
      },
      {
        titleKey: "tutorial.createGroup.title",
        descriptionKey: "tutorial.createGroup.description",
        illustration: require("../assets/images/group.png"),
      },
      {
        titleKey: "tutorial.givePreferences.title",
        descriptionKey: "tutorial.givePreferences.description",
        illustration: require("../assets/images/horror-movie.png"),
      },
      {
        titleKey: "tutorial.swipeToFindMatch.title",
        descriptionKey: "tutorial.swipeToFindMatch.description",
        illustration: require("../assets/images/high-five.png"),
      },
      {
        titleKey: "tutorial.groupAndPersonalLists.title",
        descriptionKey: "tutorial.groupAndPersonalLists.description",
        illustration: require("../assets/images/list.png"),
      },
      {
        titleKey: "tutorial.endCard.title",
        descriptionKey: "tutorial.endCard.description",
        illustration: require("../assets/images/welcome.png"),
      },
    ],
    [theme] // Update if theme changes
  );

  // Function to transition to the next page, looping back if at the end
  const goToNextPage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tutorialPages.length);
  }, [tutorialPages.length]);

  // Automatically transition pages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Slide text out, change page, and slide new text in
      textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
        runOnJS(goToNextPage)(); // Move to the next page
        textTranslateX.value = width; // Reset text offscreen
        textTranslateX.value = withTiming(0, { duration: 300 }); // Slide new text in
      });
    }, 5000);
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [currentIndex, goToNextPage, textTranslateX]);

  // Handle swipe gestures to navigate between pages
  const onHandlerStateChange = (event: GestureHandlerStateChangeEvent) => {
    const nativeEvent = event.nativeEvent;
    if (nativeEvent && typeof nativeEvent.oldState === "number") {
      // Check if gesture ended (oldState === 4)
      if (nativeEvent.oldState === 4) {
        const { translationX } = nativeEvent;
        if (translationX < -50 && currentIndex < tutorialPages.length - 1) {
          transitionPage(currentIndex + 1, -width); // Swipe left
        } else if (translationX > 50 && currentIndex > 0) {
          transitionPage(currentIndex - 1, width); // Swipe right
        }
        translateX.value = withSpring(0); // Reset swipe position
      }
    }
  };

  // Helper function to animate page transitions
  const transitionPage = (newIndex: number, offset: number) => {
    textTranslateX.value = withTiming(offset, { duration: 300 }, () => {
      runOnJS(setCurrentIndex)(newIndex); // Update to new page
      textTranslateX.value = -offset; // Reset text offscreen
      textTranslateX.value = withTiming(0, { duration: 300 }); // Slide new text in
    });
  };

  // Animated style for sliding text
  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textTranslateX.value }],
  }));

  // Custom hook to generate animated styles for dot indicators
  const useDotAnimatedStyle = (index: number) => {
    const isActive = currentIndex === index; // Check if this dot is active
    const scale = useSharedValue(isActive ? 1.2 : 1); // Scale active dots larger
    useEffect(() => {
      scale.value = withSpring(isActive ? 1.5 : 1); // Animate dot scale transition
    }, [isActive]);
    return useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      backgroundColor: isActive ? theme.colors.primary : "#ccc", // Color active dot
    }));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Pan gesture handler to navigate pages with swipe */}
      <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={styles.pageContainer}>
          {/* Animated view for the tutorial page */}
          <Animated.View style={[styles.page, { width }, textAnimatedStyle]}>
            {/* Display current page's image */}
            <Image
              source={tutorialPages[currentIndex].illustration}
              style={{
                width: imageSize,
                height: imageSize,
                resizeMode: "contain",
              }}
            />
            {/* Display the title with theme color */}
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {t(tutorialPages[currentIndex].titleKey)}
            </Text>
            {/* Display the description with theme color */}
            <Text
              style={[styles.description, { color: theme.colors.secondary }]}
            >
              {t(tutorialPages[currentIndex].descriptionKey)}
            </Text>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>

      {/* Dot indicators for each page */}
      <View style={styles.dotsContainer}>
        {tutorialPages.map((_, index) => (
          <Animated.View
            key={index}
            style={[styles.dot, useDotAnimatedStyle(index)]} // Apply animated style for each dot
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

// Styles for component layout and presentation
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageContainer: {
    flexDirection: "row",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.large,
  },
  title: {
    fontSize: SPACING.large,
    fontWeight: "bold",
    marginBottom: SPACING.medium,
  },
  description: {
    fontSize: SPACING.medium,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: SPACING.large,
  },
  dot: {
    width: SPACING.medium,
    height: SPACING.medium,
    borderRadius: SPACING.medium / 2,
    backgroundColor: "#ccc",
    margin: SPACING.small,
  },
});

export default Tutorial;

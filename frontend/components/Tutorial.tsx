import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next"; // For handling translations
import { useTheme } from "../context/ThemeContext"; // Custom hook for getting theme-related styles
import SearchSvg from "../assets/svg/searching.svg"; // SVG assets for illustrations
import GroupSvg from "../assets/svg/group.svg";
import HorrorMovieSvg from "../assets/svg/horror-movie.svg";
import HighFiveSvg from "../assets/svg/high-five.svg";
import ListSvg from "../assets/svg/list.svg";
import WelcomeSvg from "../assets/svg/welcome.svg";

// Get the width of the device screen to dynamically size elements
const { width } = Dimensions.get("window");
const svgSize = width * 0.3; // Size for SVG illustrations relative to screen width

const Tutorial = () => {
  // State to track which tutorial page is currently active
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shared values for animations
  const translateX = useSharedValue(0); // Horizontal animation for swiping gesture
  const textTranslateX = useSharedValue(0); // Animation for text transition

  // Access the current theme from the ThemeContext
  const { theme } = useTheme();

  // Access translations using the useTranslation hook
  const { t } = useTranslation();

  // Array representing each tutorial page with a title, description, and illustration
  const tutorialPages = [
    {
      titleKey: "tutorial.welcome.title", // Translation key for the title
      descriptionKey: "tutorial.welcome.description", // Translation key for the description
      illustration: (
        <SearchSvg
          width={svgSize}
          height={svgSize}
          fill={theme.colors.primary}
        />
      ), // SVG illustration
    },
    {
      titleKey: "tutorial.createGroup.title",
      descriptionKey: "tutorial.createGroup.description",
      illustration: (
        <GroupSvg
          width={svgSize}
          height={svgSize}
          fill={theme.colors.primary}
        />
      ),
    },
    {
      titleKey: "tutorial.givePreferences.title",
      descriptionKey: "tutorial.givePreferences.description",
      illustration: (
        <HorrorMovieSvg
          width={svgSize}
          height={svgSize}
          fill={theme.colors.primary}
        />
      ),
    },
    {
      titleKey: "tutorial.swipeToFindMatch.title",
      descriptionKey: "tutorial.swipeToFindMatch.description",
      illustration: (
        <HighFiveSvg
          width={svgSize}
          height={svgSize}
          fill={theme.colors.primary}
        />
      ),
    },
    {
      titleKey: "tutorial.groupAndPersonalLists.title",
      descriptionKey: "tutorial.groupAndPersonalLists.description",
      illustration: (
        <ListSvg width={svgSize} height={svgSize} fill={theme.colors.primary} />
      ),
    },
    {
      titleKey: "tutorial.endCard.title",
      descriptionKey: "tutorial.endCard.description",
      illustration: (
        <WelcomeSvg
          width={svgSize}
          height={svgSize}
          fill={theme.colors.primary}
        />
      ),
    },
  ];

  // Function to go to the next tutorial page, loops back to the first page if at the end
  const goToNextPage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < tutorialPages.length - 1 ? prevIndex + 1 : 0
    );
  };

  // useEffect to automatically transition between tutorial pages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Animate text to slide out, change page, then animate new text sliding in
      textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
        runOnJS(goToNextPage)(); // Go to the next page
        textTranslateX.value = width; // Move text back off-screen
        textTranslateX.value = withTiming(0, { duration: 300 }); // Animate the new text sliding in
      });
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [currentIndex]);

  // Function to handle swipe gesture events
  const onGestureEvent = (event: any) => {
    translateX.value = event.translationX; // Track the swipe gesture's translation on the X-axis
  };

  // Function to handle the end of the swipe gesture (e.g., when the user lifts their finger)
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === 4) {
      // Gesture has ended
      const { translationX } = event.nativeEvent;

      if (translationX < -50 && currentIndex < tutorialPages.length - 1) {
        // Swipe left to go to the next page
        textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
          runOnJS(setCurrentIndex)(currentIndex + 1);
          textTranslateX.value = width;
          textTranslateX.value = withTiming(0, { duration: 300 });
        });
      } else if (translationX > 50 && currentIndex > 0) {
        // Swipe right to go to the previous page
        textTranslateX.value = withTiming(width, { duration: 300 }, () => {
          runOnJS(setCurrentIndex)(currentIndex - 1);
          textTranslateX.value = -width;
          textTranslateX.value = withTiming(0, { duration: 300 });
        });
      }
      translateX.value = withSpring(0); // Snap back the swipe gesture position
    }
  };

  // Animated style for sliding text in and out
  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textTranslateX.value }], // Slide based on the shared value
  }));

  // Custom hook to handle the animation of the dots that represent tutorial pages
  const useDotAnimatedStyle = (index: number) => {
    const isActive = currentIndex === index; // Check if this dot corresponds to the active page
    const scale = useSharedValue(isActive ? 1.2 : 1); // Active dots are slightly bigger

    // Animate the scaling of the dot when it becomes active/inactive
    useEffect(() => {
      scale.value = withSpring(isActive ? 1.5 : 1); // Scale to 1.5 when active, 1 when inactive
    }, [isActive]);

    // Return the animated style for the dot
    return useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }], // Apply the scaling animation
      backgroundColor: isActive ? theme.colors.primary : "#ccc", // Active dots get the primary color
    }));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Handle swipe gestures to navigate through pages */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={[styles.pageContainer]}>
          {/* Animated view for the current tutorial page */}
          <Animated.View style={[styles.page, { width }, textAnimatedStyle]}>
            {/* Illustration for the current page */}
            {tutorialPages[currentIndex].illustration}
            {/* Title for the current page */}
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {t(tutorialPages[currentIndex].titleKey)}
            </Text>
            {/* Description for the current page */}
            <Text
              style={[styles.description, { color: theme.colors.secondary }]}
            >
              {t(tutorialPages[currentIndex].descriptionKey)}
            </Text>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      {/* Dots to indicate the current page, animated with scaling */}
      <View style={styles.dotsContainer}>
        {tutorialPages.map((_, index) => (
          <Animated.View
            key={index}
            style={[styles.dot, useDotAnimatedStyle(index)]}
          />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

// Styles for the tutorial screen
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    margin: 5,
  },
});

export default Tutorial;

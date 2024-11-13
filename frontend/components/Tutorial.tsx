import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SPACING } from "@/constants/DesignValues";
import SearchSvg from "../ assets/svg/searching.svg";
import GroupSvg from "../assets/svg/group.svg";
import HorrorMovieSvg from "../assets/svg/horror-movie.svg";
import HighFiveSvg from "../assets/svg/high-five.svg";
import ListSvg from "../assets/svg/list.svg";
import WelcomeSvg from "../assets/svg/welcome.svg";

// Define screen width and SVG size once
const { width } = Dimensions.get("window");
const svgSize = width * 0.3;

const Tutorial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const textTranslateX = useSharedValue(0);

  const { theme } = useTheme();
  const { t } = useTranslation();

  // Memoize tutorial pages for performance and readability
  const tutorialPages = useMemo(
    () => [
      {
        titleKey: "tutorial.welcome.title",
        descriptionKey: "tutorial.welcome.description",
        illustration: (
          <SearchSvg
            width={svgSize}
            height={svgSize}
            fill={theme.colors.primary}
          />
        ),
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
          <ListSvg
            width={svgSize}
            height={svgSize}
            fill={theme.colors.primary}
          />
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
    ],
    [theme]
  );

  // Set the next tutorial page, cycling back to start
  const goToNextPage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tutorialPages.length);
  }, [tutorialPages.length]);

  // Auto-transition pages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
        runOnJS(goToNextPage)();
        textTranslateX.value = width;
        textTranslateX.value = withTiming(0, { duration: 300 });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, goToNextPage]);

  // Handle swipe gestures
  const onHandlerStateChange = (event) => {
    const { translationX, nativeEvent } = event.nativeEvent;
    if (nativeEvent.oldState === 4) {
      if (translationX < -50 && currentIndex < tutorialPages.length - 1) {
        transitionPage(currentIndex + 1, -width);
      } else if (translationX > 50 && currentIndex > 0) {
        transitionPage(currentIndex - 1, width);
      }
      translateX.value = withSpring(0);
    }
  };

  const transitionPage = (newIndex, offset) => {
    textTranslateX.value = withTiming(offset, { duration: 300 }, () => {
      runOnJS(setCurrentIndex)(newIndex);
      textTranslateX.value = -offset;
      textTranslateX.value = withTiming(0, { duration: 300 });
    });
  };

  // Animated style for sliding text
  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textTranslateX.value }],
  }));

  // Dot scaling animation hook
  const useDotAnimatedStyle = (index) => {
    const isActive = currentIndex === index;
    const scale = useSharedValue(isActive ? 1.2 : 1);
    useEffect(() => {
      scale.value = withSpring(isActive ? 1.5 : 1);
    }, [isActive]);
    return useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      backgroundColor: isActive ? theme.colors.primary : "#ccc",
    }));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={styles.pageContainer}>
          <Animated.View style={[styles.page, { width }, textAnimatedStyle]}>
            {tutorialPages[currentIndex].illustration}
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {t(tutorialPages[currentIndex].titleKey)}
            </Text>
            <Text
              style={[styles.description, { color: theme.colors.secondary }]}
            >
              {t(tutorialPages[currentIndex].descriptionKey)}
            </Text>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
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

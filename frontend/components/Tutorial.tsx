import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions } from "react-native";
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

const Tutorial = () => {
  const { width, height } = useWindowDimensions();
  const imageSize = Math.min(width * 0.4, height * 0.25);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const textTranslateX = useSharedValue(0);

  const { theme } = useTheme();
  const { t } = useTranslation();

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
    [theme]
  );

  const goToNextPage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tutorialPages.length);
  }, [tutorialPages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
        runOnJS(goToNextPage)();
        textTranslateX.value = width;
        textTranslateX.value = withTiming(0, { duration: 300 });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, goToNextPage, textTranslateX, width]);

  const onHandlerStateChange = (event: GestureHandlerStateChangeEvent) => {
    const nativeEvent = event.nativeEvent;
    if (nativeEvent && typeof nativeEvent.oldState === "number") {
      if (nativeEvent.oldState === 4) {
        const { translationX } = nativeEvent;
        if (translationX < -50 && currentIndex < tutorialPages.length - 1) {
          transitionPage(currentIndex + 1, -width);
        } else if (translationX > 50 && currentIndex > 0) {
          transitionPage(currentIndex - 1, width);
        }
        translateX.value = withSpring(0);
      }
    }
  };

  const transitionPage = (newIndex: number, offset: number) => {
    textTranslateX.value = withTiming(offset, { duration: 300 }, () => {
      runOnJS(setCurrentIndex)(newIndex);
      textTranslateX.value = -offset;
      textTranslateX.value = withTiming(0, { duration: 300 });
    });
  };

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: textTranslateX.value }],
  }));

  const useDotAnimatedStyle = (index: number) => {
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
        <Animated.View style={[styles.pageContainer, { height: height * 0.7 }]}>
          <Animated.View 
            style={[
              styles.page, 
              { width }, 
              textAnimatedStyle,
              { maxHeight: height * 0.7 }
            ]}
          >
            <View style={styles.contentContainer}>
              <Image
                source={tutorialPages[currentIndex].illustration}
                style={[
                  styles.image,
                  {
                    width: imageSize,
                    height: imageSize,
                  }
                ]}
              />
              <View style={styles.textContainer}>
                <Text 
                  style={[
                    styles.title, 
                    { 
                      color: theme.colors.primary,
                      fontSize: Math.min(width * 0.06, 24)
                    }
                  ]}
                  numberOfLines={2}
                >
                  {t(tutorialPages[currentIndex].titleKey)}
                </Text>
                <Text
                  style={[
                    styles.description,
                    {
                      color: theme.colors.secondary,
                      fontSize: Math.min(width * 0.04, 16)
                    }
                  ]}
                  numberOfLines={4}
                >
                  {t(tutorialPages[currentIndex].descriptionKey)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>

      <View style={[styles.dotsContainer, { bottom: height * 0.05 }]}>
        {tutorialPages.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              useDotAnimatedStyle(index),
              { width: width * 0.02, height: width * 0.02 }
            ]}
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
    alignItems: "center",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.large,
    maxWidth: 600,
  },
  image: {
    resizeMode: "contain",
    marginBottom: SPACING.large,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: SPACING.medium,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: SPACING.medium,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: SPACING.small,
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 999,
    backgroundColor: "#ccc",
    margin: SPACING.small,
  },
});

export default Tutorial;
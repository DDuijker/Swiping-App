import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const tutorialPages = [
    {
        titleKey: "tutorial.welcome.title",
        descriptionKey: "tutorial.welcome.description",
    },
    {
        titleKey: "tutorial.createGroup.title",
        descriptionKey: "tutorial.createGroup.description",
    },
    {
        titleKey: "tutorial.givePreferences.title",
        descriptionKey: "tutorial.givePreferences.description",
    },
    {
        titleKey: "tutorial.swipeToFindMatch.title",
        descriptionKey: "tutorial.swipeToFindMatch.description",
    },
    {
        titleKey: "tutorial.groupAndPersonalLists.title",
        descriptionKey: "tutorial.groupAndPersonalLists.description",
    },
];

const Tutorial = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const textTranslateX = useSharedValue(0); // Position for text sliding animation
    const { theme } = useTheme();
    const { t } = useTranslation(); // Initialize translation hook

    // Function to move to the next page
    const goToNextPage = () => {
        if (currentIndex < tutorialPages.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Loop back to the first page
        }
    };

    // Automatic page switch every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            // Animate text sliding out
            textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
                // After sliding out, change content
                goToNextPage();

                // Move text off-screen to the right and then animate it in
                textTranslateX.value = width;
                textTranslateX.value = withTiming(0, { duration: 300 });
            });
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [currentIndex]);

    // Gesture handlers for manual swipe
    const onGestureEvent = (event: any) => {
        translateX.value = event.translationX; // Update translation value based on gesture
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.oldState === 4) {
            if (event.nativeEvent.translationX < -50 && currentIndex < tutorialPages.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (event.nativeEvent.translationX > 50 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
            translateX.value = withSpring(0); // Reset translation after gesture ends
        }
    };

    // Animated styles for text sliding animation
    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: textTranslateX.value }],
        };
    });

    // Animated style for the dots
    const dotAnimatedStyle = (index: number) => {
        const isActive = currentIndex === index;
        const scale = useSharedValue(isActive ? 1.2 : 1); // Default scale for active dot

        useEffect(() => {
            scale.value = withSpring(isActive ? 1.5 : 1); // Animate size change on active state
        }, [isActive]);

        return useAnimatedStyle(() => {
            return {
                transform: [{ scale: scale.value }],
                backgroundColor: isActive ? theme.colors.primary : '#ccc', // Active color
            };
        });
    };

    return (
        <GestureHandlerRootView style={styles.container}> {/* Wrap in GestureHandlerRootView */}
            <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                <Animated.View style={[styles.pageContainer]}>
                    <Animated.View style={[styles.page, { width }, textAnimatedStyle]}>
                        <Text style={[styles.title, { color: theme.colors.primary }]}>{t(tutorialPages[currentIndex].titleKey)}</Text>
                        <Text style={[styles.description, { color: theme.colors.secondary }]}>{t(tutorialPages[currentIndex].descriptionKey)}</Text>
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
            <View style={styles.dotsContainer}>
                {tutorialPages.map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.dot, dotAnimatedStyle(index)]} // Apply animated style
                    />
                ))}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageContainer: {
        flexDirection: 'row',
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        margin: 5,
    },
});

export default Tutorial;

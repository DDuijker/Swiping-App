import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const tutorialPages = [
    {
        title: "Welcome to Binge! 🎬",
        description: "Ever found yourself stuck in an endless cycle of 'What do you want to watch?' and 'I don’t know, what do you want to watch?'",
    },
    {
        title: "Create a Group",
        description: "Make a group with your friends and share your preferences.",
    },
    {
        title: "Give Your Preferences",
        description: "Let everyone share their movie or series preferences.",
    },
    {
        title: "Swipe to Find a Match",
        description: "Swipe to discover movies that everyone will love!",
    },
    {
        title: "Group & Personal Lists",
        description: "Keep track of your group matches and your personal favorites.",
    },
];

const Tutorial = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const theme = useTheme();

    const onGestureEvent = (event: any) => {
        translateX.value = event.translationX;
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.oldState === 4) {
            if (event.nativeEvent.translationX < -50 && currentIndex < tutorialPages.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (event.nativeEvent.translationX > 50 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
            translateX.value = withSpring(0);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    return (
        <View style={styles.container}>
            <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                <Animated.View style={[styles.pageContainer, animatedStyle]}>
                    {tutorialPages.map((page, index) => (
                        <View key={index} style={[styles.page, { width }]}>
                            <Text style={[styles.title, { color: theme.colors.primary }]}>{page.title}</Text>
                            <Text style={styles.description}>{page.description}</Text>
                        </View>
                    ))}
                </Animated.View>
            </PanGestureHandler>
            <View style={styles.dotsContainer}>
                {tutorialPages.map((_, index) => (
                    <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
                ))}
            </View>
        </View>
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
    activeDot: {
        backgroundColor: '#000',
    },
});

export default Tutorial;
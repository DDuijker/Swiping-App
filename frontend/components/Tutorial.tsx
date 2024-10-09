import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import SearchSvg  from '../assets/images/tutorial/searching.svg'; // Import as a React component
import GroupSvg from '../assets/images/tutorial/group.svg'; // Same here
import HorrorMovieSvg from '../assets/images/tutorial/horror-movie.svg'; // And here
import HighFiveSvg  from '../assets/images/tutorial/high-five.svg'; // And here
import ListSvg from '../assets/images/tutorial/list.svg'; // And here

const { width } = Dimensions.get('window');
const svgSize = width * 0.5;

const tutorialPages = [
    {
        titleKey: "tutorial.welcome.title",
        descriptionKey: "tutorial.welcome.description",
        illustration: <SearchSvg width={svgSize} height={svgSize} />,
    },
    {
        titleKey: "tutorial.createGroup.title",
        descriptionKey: "tutorial.createGroup.description",
        illustration: <GroupSvg width={svgSize} height={svgSize} />,
    },
    {
        titleKey: "tutorial.givePreferences.title",
        descriptionKey: "tutorial.givePreferences.description",
        illustration: <HorrorMovieSvg width={svgSize} height={svgSize} />,
    },
    {
        titleKey: "tutorial.swipeToFindMatch.title",
        descriptionKey: "tutorial.swipeToFindMatch.description",
        illustration: <HighFiveSvg width={svgSize} height={svgSize} />,
    },
    {
        titleKey: "tutorial.groupAndPersonalLists.title",
        descriptionKey: "tutorial.groupAndPersonalLists.description",
        illustration: <ListSvg width={svgSize} height={svgSize} />,
    },
];

const Tutorial = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const textTranslateX = useSharedValue(0);
    const { theme } = useTheme();
    const { t } = useTranslation();

    const goToNextPage = () => {
        setCurrentIndex((prevIndex) => (prevIndex < tutorialPages.length - 1 ? prevIndex + 1 : 0));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            textTranslateX.value = withTiming(-width, { duration: 300 }, () => {
                goToNextPage();
                textTranslateX.value = width;
                textTranslateX.value = withTiming(0, { duration: 300 });
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const onGestureEvent = (event) => {
        translateX.value = event.translationX;
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === 4) {
            if (event.nativeEvent.translationX < -50 && currentIndex < tutorialPages.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else if (event.nativeEvent.translationX > 50 && currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
            translateX.value = withSpring(0);
        }
    };

    const textAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: textTranslateX.value }],
    }));

    const useDotAnimatedStyle = (index) => {
        const isActive = currentIndex === index;
        const scale = useSharedValue(isActive ? 1.2 : 1);
        useEffect(() => {
            scale.value = withSpring(isActive ? 1.5 : 1);
        }, [isActive]);
        return useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
            backgroundColor: isActive ? theme.colors.primary : '#ccc',
        }));
    };

    return (
        <GestureHandlerRootView style={styles.container}>
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
                    <Animated.View key={index} style={[styles.dot, useDotAnimatedStyle(index)]} />
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

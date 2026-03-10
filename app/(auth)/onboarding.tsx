import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Post a Task',
        description: 'Describe what you need done and set your own budget. It only takes 2 minutes.',
        icon: '⚡',
    },
    {
        id: '2',
        title: 'Get Real Offers',
        description: 'Receive competitive offers from top-rated freelancers instantly.',
        icon: '💎',
    },
    {
        id: '3',
        title: 'Work Securely',
        description: 'Chat, collaborate, and pay only when the job is done to your satisfaction.',
        icon: '🛡️',
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < SLIDES.length - 1) {
            // @ts-ignore
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/(auth)/register');
        }
    };

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={styles.slide}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={{ flex: 3 }}>
                <FlatList
                    data={SLIDES}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 30, 10],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={i.toString()}
                                style={[styles.dot, { width: dotWidth, opacity }]}
                            />
                        );
                    })}
                </View>

                <View style={styles.buttonContainer}>
                    {currentIndex < SLIDES.length - 1 ? (
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text style={styles.skip}>Skip</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 40 }} />
                    )}

                    <Button
                        mode="contained"
                        onPress={scrollTo}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        contentStyle={styles.buttonContent}
                    >
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#111111',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    icon: {
        fontSize: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: -1,
    },
    description: {
        fontSize: 18,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 28,
    },
    footer: {
        height: height * 0.25,
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        width: '100%',
    },
    pagination: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    skip: {
        color: '#64748B',
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 20,
    },
    buttonLabel: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonContent: {
        height: 50,
    },
});

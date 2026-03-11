import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Dimensions,
    Animated,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Welcome to TalentlyX',
        subtitle: 'Your gateway to global freelance opportunities.',
        iconEmoji: '🚀',
        accentIcon: '✦',
    },
    {
        id: '2',
        title: 'Grow Your Career',
        subtitle: 'Build your portfolio and get recognized by clients worldwide.',
        iconEmoji: '📈',
        accentIcon: '⬆',
    },
    {
        id: '3',
        title: 'Find Jobs Easily',
        subtitle: 'Browse thousands of projects matching your skills.',
        iconEmoji: '🔍',
        accentIcon: '💼',
    },
    {
        id: '4',
        title: 'Secure Payments',
        subtitle: 'Get paid safely through our escrow system.',
        iconEmoji: '🛡️',
        accentIcon: '💰',
    },
    {
        id: '5',
        title: 'Work With The Best',
        subtitle: 'Connect with businesses and freelancers worldwide.',
        iconEmoji: '🌐',
        accentIcon: '🤝',
    },
];

// Animated icon component with float + glow effects
function AnimatedIcon({ iconEmoji, accentIcon, isActive }: { iconEmoji: string; accentIcon: string; isActive: boolean }) {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isActive) {
            // Entry animation
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();

            // Continuous floating animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(floatAnim, {
                        toValue: -6,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(floatAnim, {
                        toValue: 6,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Glow pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 0.8,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0.3,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Subtle rotation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(rotateAnim, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotateAnim, {
                        toValue: 0,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scaleAnim.setValue(0.8);
            opacityAnim.setValue(0);
        }
    }, [isActive]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['-3deg', '3deg'],
    });

    return (
        <Animated.View
            style={[
                styles.iconWrapper,
                {
                    opacity: opacityAnim,
                    transform: [
                        { translateY: floatAnim },
                        { scale: scaleAnim },
                        { rotate },
                    ],
                },
            ]}
        >
            {/* Glow behind icon */}
            <Animated.View style={[styles.iconGlow, { opacity: glowAnim }]} />

            {/* Shadow under icon */}
            <View style={styles.iconShadow} />

            {/* Main icon container */}
            <View style={styles.iconContainer}>
                <Text style={styles.mainIcon}>{iconEmoji}</Text>
                <View style={styles.accentBadge}>
                    <Text style={styles.accentIcon}>{accentIcon}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = useCallback(() => {
        if (currentIndex < SLIDES.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/(auth)/welcome');
        }
    }, [currentIndex]);

    const handleSkip = useCallback(() => {
        router.push('/(auth)/welcome');
    }, []);

    const renderItem = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
        return (
            <View style={styles.slide}>
                <AnimatedIcon
                    iconEmoji={item.iconEmoji}
                    accentIcon={item.accentIcon}
                    isActive={currentIndex === index}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
            </View>
        );
    };

    const isLastSlide = currentIndex === SLIDES.length - 1;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Skip button - top right */}
            {!isLastSlide && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                    activeOpacity={0.7}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            {/* Slides */}
            <View style={styles.slidesContainer}>
                <FlatList
                    data={SLIDES}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            {/* Footer with dots + button */}
            <View style={styles.footer}>
                {/* Pagination dots */}
                <View style={styles.pagination}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [8, 24, 8],
                            extrapolate: 'clamp',
                        });
                        const dotColor = scrollX.interpolate({
                            inputRange,
                            outputRange: ['#E5E5E5', '#C1F21D', '#E5E5E5'],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={i.toString()}
                                style={[
                                    styles.dot,
                                    {
                                        width: dotWidth,
                                        backgroundColor: dotColor,
                                    },
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Navigation button */}
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        isLastSlide && styles.getStartedButton,
                    ]}
                    onPress={scrollTo}
                    activeOpacity={0.85}
                >
                    <Text style={styles.nextButtonText}>
                        {isLastSlide ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    skipButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 48,
        right: 24,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    slidesContainer: {
        flex: 1,
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    // Animated icon styles
    iconWrapper: {
        width: 140,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48,
    },
    iconGlow: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#C1F21D',
    },
    iconShadow: {
        position: 'absolute',
        bottom: -8,
        width: 80,
        height: 16,
        borderRadius: 40,
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 30,
        backgroundColor: '#111111',
        alignItems: 'center',
        justifyContent: 'center',
        // Subtle shadow
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
    mainIcon: {
        fontSize: 52,
    },
    accentBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#C1F21D',
        alignItems: 'center',
        justifyContent: 'center',
        // shadow
        shadowColor: '#C1F21D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    accentIcon: {
        fontSize: 14,
    },
    // Text
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '400',
    },
    // Footer
    footer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 32,
        gap: 24,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        backgroundColor: '#C1F21D',
        borderRadius: 14,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        // subtle shadow
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 3,
    },
    getStartedButton: {
        backgroundColor: '#C1F21D',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});

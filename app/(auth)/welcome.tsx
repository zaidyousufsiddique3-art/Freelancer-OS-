import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const logoScale = useRef(new Animated.Value(0.9)).current;
    const buttonFade = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        // Staggered entrance animation
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 60,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(buttonFade, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonSlide, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Top section - Logo & tagline */}
            <View style={styles.topSection}>
                <Animated.View
                    style={[
                        styles.logoWrapper,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: logoScale }, { translateY: slideAnim }],
                        },
                    ]}
                >
                    {/* Logo icon */}
                    <View style={styles.logoIcon}>
                        <Text style={styles.logoIconText}>TX</Text>
                    </View>
                    <Text style={styles.logoText}>TalentlyX</Text>
                </Animated.View>

                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.title}>Join TalentlyX</Text>
                    <Text style={styles.subtitle}>Find work or hire talent.</Text>
                </Animated.View>
            </View>

            {/* Bottom section - Buttons */}
            <Animated.View
                style={[
                    styles.bottomSection,
                    {
                        opacity: buttonFade,
                        transform: [{ translateY: buttonSlide }],
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/(auth)/role-select')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/(auth)/login')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.secondaryButtonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms of Service.
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: Platform.OS === 'ios' ? 40 : 32,
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    logoIconText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#C1F21D',
        letterSpacing: -1,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000000',
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111111',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6B7280',
        textAlign: 'center',
    },
    bottomSection: {
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#C1F21D',
        borderRadius: 14,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 3,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000000',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
    },
});

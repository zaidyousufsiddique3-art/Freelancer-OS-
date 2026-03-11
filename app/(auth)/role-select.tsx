import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

type RoleOption = 'freelancer' | 'client';

export default function RoleSelectScreen() {
    const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const card1Anim = useRef(new Animated.Value(0)).current;
    const card1Slide = useRef(new Animated.Value(40)).current;
    const card2Anim = useRef(new Animated.Value(0)).current;
    const card2Slide = useRef(new Animated.Value(40)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            // Title entrance
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Card 1
            Animated.parallel([
                Animated.timing(card1Anim, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(card1Slide, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
            // Card 2
            Animated.parallel([
                Animated.timing(card2Anim, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(card2Slide, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
            // Button
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleContinue = () => {
        if (selectedRole) {
            router.push({
                pathname: '/(auth)/signup-options',
                params: { role: selectedRole },
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Back button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Title section */}
            <Animated.View
                style={[
                    styles.header,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                <Text style={styles.title}>How would you{'\n'}like to use TalentlyX?</Text>
                <Text style={styles.subtitle}>Select your role to get started</Text>
            </Animated.View>

            {/* Role cards */}
            <View style={styles.cardsContainer}>
                {/* Service Provider card */}
                <Animated.View
                    style={{
                        opacity: card1Anim,
                        transform: [{ translateY: card1Slide }],
                    }}
                >
                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                            selectedRole === 'freelancer' && styles.roleCardSelected,
                        ]}
                        onPress={() => setSelectedRole('freelancer')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconContainer}>
                            <Text style={styles.cardIcon}>💼</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={[
                                styles.cardTitle,
                                selectedRole === 'freelancer' && styles.cardTitleSelected,
                            ]}>
                                I am a Service Provider
                            </Text>
                            <Text style={styles.cardDescription}>
                                Find projects and offer your skills
                            </Text>
                        </View>
                        {/* Selection indicator */}
                        <View style={[
                            styles.radioOuter,
                            selectedRole === 'freelancer' && styles.radioOuterSelected,
                        ]}>
                            {selectedRole === 'freelancer' && (
                                <View style={styles.radioInner} />
                            )}
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Hiring card */}
                <Animated.View
                    style={{
                        opacity: card2Anim,
                        transform: [{ translateY: card2Slide }],
                    }}
                >
                    <TouchableOpacity
                        style={[
                            styles.roleCard,
                            selectedRole === 'client' && styles.roleCardSelected,
                        ]}
                        onPress={() => setSelectedRole('client')}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardIconContainer}>
                            <Text style={styles.cardIcon}>🏢</Text>
                        </View>
                        <View style={styles.cardTextContainer}>
                            <Text style={[
                                styles.cardTitle,
                                selectedRole === 'client' && styles.cardTitleSelected,
                            ]}>
                                I am Hiring
                            </Text>
                            <Text style={styles.cardDescription}>
                                Post jobs and find top talent
                            </Text>
                        </View>
                        {/* Selection indicator */}
                        <View style={[
                            styles.radioOuter,
                            selectedRole === 'client' && styles.radioOuterSelected,
                        ]}>
                            {selectedRole === 'client' && (
                                <View style={styles.radioInner} />
                            )}
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Continue button */}
            <Animated.View style={[styles.footerSection, { opacity: buttonAnim }]}>
                <TouchableOpacity
                    style={[
                        styles.continueButton,
                        !selectedRole && styles.continueButtonDisabled,
                    ]}
                    onPress={handleContinue}
                    activeOpacity={0.85}
                    disabled={!selectedRole}
                >
                    <Text style={[
                        styles.continueButtonText,
                        !selectedRole && styles.continueButtonTextDisabled,
                    ]}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: Platform.OS === 'ios' ? 40 : 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    backIcon: {
        fontSize: 20,
        color: '#111111',
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: -0.5,
        lineHeight: 32,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
    },
    cardsContainer: {
        flex: 1,
        gap: 16,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        // subtle shadow
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 3,
    },
    roleCardSelected: {
        borderColor: '#C1F21D',
        borderWidth: 2,
        backgroundColor: '#FAFFF0',
    },
    cardIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardIcon: {
        fontSize: 28,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111111',
        marginBottom: 4,
    },
    cardTitleSelected: {
        color: '#000000',
    },
    cardDescription: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '400',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    radioOuterSelected: {
        borderColor: '#C1F21D',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#C1F21D',
    },
    footerSection: {
        paddingTop: 16,
    },
    continueButton: {
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
    continueButtonDisabled: {
        backgroundColor: '#F5F5F5',
        shadowOpacity: 0,
        elevation: 0,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    continueButtonTextDisabled: {
        color: '#9CA3AF',
    },
});

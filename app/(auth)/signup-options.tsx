import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Platform,
    Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserRole } from '../../types';

export default function SignupOptionsScreen() {
    const { role } = useLocalSearchParams<{ role: string }>();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const btn1Anim = useRef(new Animated.Value(0)).current;
    const btn1Slide = useRef(new Animated.Value(20)).current;
    const btn2Anim = useRef(new Animated.Value(0)).current;
    const btn2Slide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.sequence([
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
            Animated.parallel([
                Animated.timing(btn1Anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(btn1Slide, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(btn2Anim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(btn2Slide, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleGoogleSignup = () => {
        // Navigate to register screen with Google flag
        router.push({
            pathname: '/(auth)/register',
            params: { role: role || 'freelancer', method: 'google' },
        });
    };

    const handleEmailSignup = () => {
        router.push({
            pathname: '/(auth)/register',
            params: { role: role || 'freelancer', method: 'email' },
        });
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

            {/* Header */}
            <Animated.View
                style={[
                    styles.header,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}
            >
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>
                    Choose how you'd like to sign up
                </Text>
            </Animated.View>

            {/* Signup buttons */}
            <View style={styles.buttonsContainer}>
                {/* Google signup */}
                <Animated.View
                    style={{
                        opacity: btn1Anim,
                        transform: [{ translateY: btn1Slide }],
                    }}
                >
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={handleGoogleSignup}
                        activeOpacity={0.85}
                    >
                        <View style={styles.googleIconContainer}>
                            <Text style={styles.googleIconText}>G</Text>
                        </View>
                        <Text style={styles.googleButtonText}>Sign up with Google</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Email signup */}
                <Animated.View
                    style={{
                        opacity: btn2Anim,
                        transform: [{ translateY: btn2Slide }],
                    }}
                >
                    <TouchableOpacity
                        style={styles.emailButton}
                        onPress={handleEmailSignup}
                        activeOpacity={0.85}
                    >
                        <View style={styles.emailIconContainer}>
                            <Text style={styles.emailIcon}>✉</Text>
                        </View>
                        <Text style={styles.emailButtonText}>Sign up with Email</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '400',
    },
    buttonsContainer: {
        flex: 1,
        gap: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 2,
    },
    googleIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    googleIconText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4285F4',
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111111',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    dividerText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginHorizontal: 16,
        fontWeight: '500',
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C1F21D',
        borderRadius: 14,
        height: 52,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 3,
    },
    emailIconContainer: {
        marginRight: 12,
    },
    emailIcon: {
        fontSize: 18,
    },
    emailButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    loginLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
    },
});

import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topSection}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>FreelancerOS</Text>
                    <View style={styles.dot} />
                </View>
                <Text style={styles.tagline}>Elevate your workflow with the most premium freelancer platform.</Text>
            </View>

            <View style={styles.bottomSection}>
                <Button
                    mode="contained"
                    onPress={() => router.push('/(auth)/register')}
                    style={styles.primaryButton}
                    labelStyle={styles.primaryButtonLabel}
                    contentStyle={styles.buttonContent}
                >
                    Get Started
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.secondaryButton}
                    labelStyle={styles.secondaryButtonLabel}
                    contentStyle={styles.buttonContent}
                >
                    I already have an account
                </Button>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>By continuing, you agree to our Terms of Service.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: SPACING.xl,
        justifyContent: 'space-between',
        paddingVertical: SPACING.xxl,
    },
    topSection: {
        marginTop: 100,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    logo: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -2,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
        marginLeft: 4,
    },
    tagline: {
        fontSize: 24,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: SPACING.md,
        lineHeight: 32,
    },
    bottomSection: {
        gap: SPACING.md,
    },
    primaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.md,
        height: 56,
        justifyContent: 'center',
    },
    primaryButtonLabel: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        borderColor: '#334155',
        borderRadius: BORDER_RADIUS.md,
        height: 56,
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    secondaryButtonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonContent: {
        height: 56,
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        color: '#64748B',
        fontSize: 12,
        textAlign: 'center',
    },
});

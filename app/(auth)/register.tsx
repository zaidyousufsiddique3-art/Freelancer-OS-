import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { signUp } from '../../services/auth';
import { UserRole } from '../../types';

export default function RegisterScreen() {
  const params = useLocalSearchParams<{ role?: string; method?: string }>();
  const selectedRole = (params.role as UserRole) || 'freelancer';
  const method = params.method || 'email';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!fullName || !email.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    if (method === 'email' && (!password.trim() || password.length < 6)) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');

    // For Service Providers: Pass data to Service Registration without creating account yet.
    if (selectedRole === 'freelancer') {
      router.push({
        pathname: '/(auth)/setup-profile',
        params: {
          firstName,
          lastName,
          email,
          phone,
          country,
          password: method === 'email' ? password : 'google-auth-placeholder',
          role: selectedRole,
        },
      });
      return;
    }

    // For Hiring/Clients: Create account immediately and skip service registration.
    setLoading(true);
    try {
      await signUp(
        email.trim(),
        method === 'email' ? password : 'google-auth-placeholder',
        fullName,
        selectedRole
      );
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const isGoogle = method === 'google';
  const headerTitle = isGoogle ? 'Complete your profile' : 'Create your account';
  const headerSubtitle = isGoogle
    ? 'Fill in your details to get started'
    : 'Enter your information below';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
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
          <Text style={styles.title}>{headerTitle}</Text>
          <Text style={styles.subtitle}>{headerSubtitle}</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View
          style={[
            styles.form,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>First Name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                mode="outlined"
                placeholder="John"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                outlineColor="#E5E5E5"
                activeOutlineColor="#C1F21D"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Last Name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                mode="outlined"
                placeholder="Doe"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                outlineColor="#E5E5E5"
                activeOutlineColor="#C1F21D"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              placeholder="you@example.com"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              mode="outlined"
              placeholder="+1 (555) 000-0000"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Country</Text>
            <TextInput
              value={country}
              onChangeText={setCountry}
              mode="outlined"
              placeholder="United States"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Password field only for email signup */}
          {!isGoogle && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureEntry}
                mode="outlined"
                placeholder="Min. 6 characters"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                outlineColor="#E5E5E5"
                activeOutlineColor="#C1F21D"
                placeholderTextColor="#9CA3AF"
                right={
                  <TextInput.Icon
                    icon={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setSecureEntry(!secureEntry)}
                    color="#9CA3AF"
                  />
                }
              />
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating account...' : selectedRole === 'freelancer' ? 'Continue' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 40,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  field: {},
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    height: 48,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#C1F21D',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#E5E5E5',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});

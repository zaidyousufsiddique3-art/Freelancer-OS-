import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../../store/authStore';
import CategoryPicker from '../../components/CategoryPicker';
import { Category } from '../../types';
import { updateUserProfile } from '../../services/auth';

export default function SetupProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const isFreelancer = user?.role === 'freelancer';

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

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        bio: bio.trim(),
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        categories: selectedCategories,
      });
      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Final step</Text>
        </View>

        <Text style={styles.title}>
          {isFreelancer ? 'Set up your profile' : 'Almost there!'}
        </Text>
        <Text style={styles.subtitle}>
          {isFreelancer
            ? 'Tell clients what you do best'
            : 'Select categories you typically hire for'}
        </Text>
      </Animated.View>

      {/* Freelancer-specific fields */}
      {isFreelancer && (
        <Animated.View
          style={[
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About you</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Full-stack developer with 5 years of experience..."
              style={styles.textArea}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TextInput
              value={skills}
              onChangeText={setSkills}
              mode="outlined"
              placeholder="React, Node.js, TypeScript, Figma"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              outlineColor="#E5E5E5"
              activeOutlineColor="#C1F21D"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </Animated.View>
      )}

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isFreelancer ? 'Categories you work in' : 'Categories you hire for'}
        </Text>
        <Text style={styles.sectionHint}>
          {isFreelancer
            ? "You'll get notified about jobs in these categories"
            : 'This helps us personalize your experience'}
        </Text>
        <CategoryPicker
          selected={selectedCategories}
          onSelect={toggleCategory}
          multiple
        />
      </View>

      {/* Complete button */}
      <TouchableOpacity
        style={[
          styles.completeButton,
          (loading || selectedCategories.length === 0) && styles.completeButtonDisabled,
        ]}
        onPress={handleComplete}
        activeOpacity={0.85}
        disabled={loading || selectedCategories.length === 0}
      >
        <Text style={[
          styles.completeButtonText,
          (loading || selectedCategories.length === 0) && styles.completeButtonTextDisabled,
        ]}>
          {loading
            ? 'Saving...'
            : isFreelancer
              ? "Let's Go!"
              : 'Start Posting Tasks'}
        </Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace('/(tabs)')}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 70 : 56,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#C1F21D',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 24,
    fontWeight: '400',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    height: 48,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    minHeight: 80,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  completeButton: {
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
  completeButtonDisabled: {
    backgroundColor: '#F5F5F5',
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completeButtonTextDisabled: {
    color: '#9CA3AF',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});

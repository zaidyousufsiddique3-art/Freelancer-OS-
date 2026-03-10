import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import CategoryPicker from '../../components/CategoryPicker';
import { Category } from '../../types';
import { updateUserProfile } from '../../services/auth';

export default function OnboardingScreen() {
  const user = useAuthStore((s) => s.user);
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const isFreelancer = user?.role === 'freelancer';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isFreelancer ? 'Set up your profile' : 'Almost there!'}
        </Text>
        <Text style={styles.subtitle}>
          {isFreelancer
            ? 'Tell clients what you do best'
            : 'Select categories you typically hire for'}
        </Text>
      </View>

      {isFreelancer && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About you</Text>
            <TextInput
              label="Short bio"
              value={bio}
              onChangeText={setBio}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., Full-stack developer with 5 years of experience..."
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <TextInput
              label="Your skills (comma separated)"
              value={skills}
              onChangeText={setSkills}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              placeholder="e.g., React, Node.js, TypeScript, Figma"
            />
          </View>
        </>
      )}

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

      <Button
        mode="contained"
        onPress={handleComplete}
        loading={loading}
        disabled={loading || selectedCategories.length === 0}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        {isFreelancer ? "Let's Go!" : 'Start Posting Tasks'}
      </Button>

      <Button
        mode="text"
        onPress={() => router.replace('/(tabs)')}
        style={styles.skipButton}
        labelStyle={styles.skipLabel}
      >
        Skip for now
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 80,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 8,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#000000',
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1.5,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  buttonContent: {
    height: 56,
  },
  skipButton: {
    marginTop: 12,
  },
  skipLabel: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});

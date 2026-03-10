import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import CategoryPicker from '../../components/CategoryPicker';
import { Category } from '../../types';
import { createTask } from '../../services/tasks';

export default function PostTaskScreen() {
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const canProceed = () => {
    switch (step) {
      case 1:
        return category !== null;
      case 2:
        return title.trim().length > 0 && description.trim().length > 0;
      case 3:
        return parseFloat(budget) > 0 && parseInt(deadline) > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const deadlineDays = parseInt(deadline);
      const deadlineTimestamp = Date.now() + deadlineDays * 24 * 60 * 60 * 1000;

      await createTask({
        clientId: user.id,
        clientName: user.name,
        title: title.trim(),
        description: description.trim(),
        category: category!,
        budget: parseFloat(budget),
        deadline: deadlineTimestamp,
      });

      Alert.alert('Task Posted!', 'Freelancers will start sending offers soon.', [
        {
          text: 'OK', onPress: () => {
            setStep(1);
            setTitle('');
            setDescription('');
            setCategory(null);
            setBudget('');
            setDeadline('');
            router.replace('/(tabs)');
          }
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to post task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress indicator */}
      <View style={styles.progress}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              s <= step && styles.progressDotActive,
              s === step && styles.progressDotCurrent,
            ]}
          />
        ))}
      </View>

      {/* Step 1: Category */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>What do you need done?</Text>
          <Text style={styles.stepSubtitle}>Pick a category that best fits your task</Text>
          <CategoryPicker selected={category} onSelect={setCategory} />
        </View>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Describe your task</Text>
          <Text style={styles.stepSubtitle}>Be specific — better descriptions get better offers</Text>

          <TextInput
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            placeholder="e.g., Design a modern logo for my startup"
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={[styles.input, styles.textArea]}
            outlineStyle={styles.inputOutline}
            placeholder="Describe what you need, any specific requirements, style preferences..."
          />
        </View>
      )}

      {/* Step 3: Budget & Deadline */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Set your budget & timeline</Text>
          <Text style={styles.stepSubtitle}>Freelancers can accept or counter-offer</Text>

          <TextInput
            label="Budget (USD)"
            value={budget}
            onChangeText={setBudget}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            left={<TextInput.Affix text="$" />}
            placeholder="e.g., 200"
          />

          <TextInput
            label="Deadline (days from now)"
            value={deadline}
            onChangeText={setDeadline}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            placeholder="e.g., 7"
            right={<TextInput.Affix text="days" />}
          />

          {budget && deadline && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Task Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Title</Text>
                <Text style={styles.summaryValue}>{title}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Budget</Text>
                <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                  ${parseFloat(budget).toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Deadline</Text>
                <Text style={styles.summaryValue}>{deadline} days</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Navigation buttons */}
      <View style={styles.nav}>
        {step > 1 && (
          <Button
            mode="outlined"
            onPress={() => setStep(step - 1)}
            style={styles.navButton}
            labelStyle={styles.navButtonLabel}
          >
            Back
          </Button>
        )}
        <Button
          mode="contained"
          onPress={step < totalSteps ? () => setStep(step + 1) : handleSubmit}
          disabled={!canProceed() || loading}
          loading={loading}
          style={[styles.navButton, styles.navButtonPrimary]}
          labelStyle={styles.navButtonLabel}
          contentStyle={styles.navButtonContent}
        >
          {step < totalSteps ? 'Continue' : 'Post Task'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 24,
    paddingBottom: 60,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E293B',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
  progressDotCurrent: {
    width: 48,
  },
  stepContainer: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#000000',
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: '#334155',
  },
  textArea: {
    minHeight: 120,
  },
  summaryCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nav: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  navButton: {
    flex: 1,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
  },
  navButtonPrimary: {
    flex: 2,
    backgroundColor: '#FFFFFF',
  },
  navButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  navButtonContent: {
    height: 52,
  },
});

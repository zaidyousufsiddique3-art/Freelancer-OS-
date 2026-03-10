import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, TextInput, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import StatusBadge from '../../components/StatusBadge';
import { getCategoryInfo } from '../../constants/categories';
import { formatBudget, formatDeadline, formatDate } from '../../utils/formatters';
import { Task } from '../../types';
import { getTask, updateTaskStatus } from '../../services/tasks';
import { createOffer } from '../../services/offers';

export default function TaskDetailScreen() {
  const { id, action } = useLocalSearchParams<{ id: string; action?: string }>();
  const user = useAuthStore((s) => s.user);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(action === 'counter');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDays, setOfferDays] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isClient = user?.role === 'client';
  const isOwner = task?.clientId === user?.id;

  useEffect(() => {
    if (!id) return;
    const loadTask = async () => {
      const t = await getTask(id);
      setTask(t);
      setLoading(false);
      if (action === 'accept' && t) {
        setOfferPrice(t.budget.toString());
      }
    };
    loadTask();
  }, [id]);

  const handleSubmitOffer = async () => {
    if (!user || !task) return;
    const price = parseFloat(offerPrice);
    const days = parseInt(offerDays);
    if (!price || !days) {
      Alert.alert('Error', 'Please fill in price and delivery days');
      return;
    }
    setSubmitting(true);
    try {
      await createOffer({
        taskId: task.id,
        freelancerId: user.id,
        freelancerName: user.name,
        freelancerAvatar: user.avatar || '',
        price,
        deliveryDays: days,
        message: offerMessage.trim(),
      });
      Alert.alert('Offer Sent!', 'The client will review your offer.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!task) return;
    Alert.alert(
      'Mark Complete',
      'Are you sure this project is completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            await updateTaskStatus(task.id, 'completed');
            setTask({ ...task, status: 'completed' });
          },
        },
      ]
    );
  };

  if (loading || !task) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const category = getCategoryInfo(task.category);

  return (
    <>
      <Stack.Screen options={{ title: task.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Status and Category */}
        <View style={styles.topRow}>
          <StatusBadge status={task.status} />
          <Chip
            style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
            textStyle={[styles.categoryText, { color: category.color }]}
          >
            {category.label}
          </Chip>
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        <Divider style={styles.divider} />

        {/* Meta info */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <MaterialCommunityIcons name="currency-usd" size={24} color={COLORS.success} />
            <Text style={styles.metaLabel}>Budget</Text>
            <Text style={styles.metaValue}>{formatBudget(task.budget)}</Text>
          </View>
          <View style={styles.metaCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.warning} />
            <Text style={styles.metaLabel}>Deadline</Text>
            <Text style={styles.metaValue}>{formatDeadline(task.deadline)}</Text>
          </View>
          <View style={styles.metaCard}>
            <MaterialCommunityIcons name="account-multiple" size={24} color={COLORS.primary} />
            <Text style={styles.metaLabel}>Offers</Text>
            <Text style={styles.metaValue}>{task.offerCount}</Text>
          </View>
        </View>

        <Text style={styles.postedBy}>
          Posted by {task.clientName} · {formatDate(task.createdAt)}
        </Text>

        <Divider style={styles.divider} />

        {/* Client: View offers button */}
        {isOwner && task.status === 'open' && (
          <Button
            mode="contained"
            onPress={() => router.push(`/offers/${task.id}`)}
            style={styles.actionButton}
            labelStyle={styles.actionLabel}
            contentStyle={styles.actionContent}
            icon="format-list-bulleted"
          >
            View Offers ({task.offerCount})
          </Button>
        )}

        {/* Client/Freelancer: Mark complete */}
        {task.status === 'in_progress' && (task.assignedTo === user?.id || isOwner) && (
          <Button
            mode="contained"
            onPress={handleMarkComplete}
            style={[styles.actionButton, { backgroundColor: COLORS.success }]}
            labelStyle={styles.actionLabel}
            contentStyle={styles.actionContent}
            icon="check-circle"
          >
            Mark as Completed
          </Button>
        )}

        {/* Freelancer: Make offer */}
        {!isClient && task.status === 'open' && (
          <>
            {!showOfferForm ? (
              <View style={styles.offerActions}>
                <Button
                  mode="contained"
                  onPress={() => {
                    setOfferPrice(task.budget.toString());
                    setShowOfferForm(true);
                  }}
                  style={styles.acceptBtn}
                  labelStyle={styles.actionLabel}
                  contentStyle={styles.actionContent}
                >
                  Accept ({formatBudget(task.budget)})
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setShowOfferForm(true)}
                  style={styles.counterBtn}
                  labelStyle={[styles.actionLabel, { color: COLORS.primary }]}
                  contentStyle={styles.actionContent}
                >
                  Counter Offer
                </Button>
              </View>
            ) : (
              <View style={styles.offerForm}>
                <Text style={styles.offerFormTitle}>Your Offer</Text>
                <TextInput
                  label="Your Price (USD)"
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Affix text="$" />}
                />
                <TextInput
                  label="Delivery Time (days)"
                  value={offerDays}
                  onChangeText={setOfferDays}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                />
                <TextInput
                  label="Message (optional)"
                  value={offerMessage}
                  onChangeText={setOfferMessage}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  placeholder="Why are you the best fit for this task?"
                />
                <View style={styles.offerFormActions}>
                  <Button
                    mode="text"
                    onPress={() => setShowOfferForm(false)}
                    labelStyle={{ color: COLORS.textSecondary }}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmitOffer}
                    loading={submitting}
                    disabled={submitting}
                    style={styles.submitOfferBtn}
                    labelStyle={styles.actionLabel}
                  >
                    Send Offer
                  </Button>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  categoryChip: {
    height: 28,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  divider: {
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.divider,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  metaValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  postedBy: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.md,
  },
  actionButton: {
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
  actionContent: {
    paddingVertical: SPACING.xs,
  },
  offerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  acceptBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.success,
  },
  counterBtn: {
    flex: 1,
    borderRadius: BORDER_RADIUS.md,
    borderColor: COLORS.primary,
  },
  offerForm: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offerFormTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
  },
  inputOutline: {
    borderRadius: BORDER_RADIUS.md,
  },
  offerFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  submitOfferBtn: {
    borderRadius: BORDER_RADIUS.md,
  },
});

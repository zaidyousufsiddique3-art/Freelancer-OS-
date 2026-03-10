import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';
import { getCategoryInfo } from '../constants/categories';
import { formatBudget, formatDeadline, formatTimeAgo } from '../utils/formatters';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  showActions?: boolean;
  onAccept?: () => void;
  onCounter?: () => void;
}

export default function TaskCard({ task, onPress, showActions, onAccept, onCounter }: TaskCardProps) {
  const category = getCategoryInfo(task.category);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Chip
            style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}
            textStyle={[styles.categoryText, { color: category.color }]}
            icon={() => (
              <MaterialCommunityIcons name={category.icon as any} size={14} color={category.color} />
            )}
          >
            {category.label}
          </Chip>
          <Text style={styles.timeAgo}>{formatTimeAgo(task.createdAt)}</Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="currency-usd" size={18} color={COLORS.success} />
            <Text style={styles.budget}>{formatBudget(task.budget)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.deadline}>{formatDeadline(task.deadline)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="account-multiple" size={18} color={COLORS.textSecondary} />
            <Text style={styles.offers}>{task.offerCount} offers</Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.counterButton} onPress={onCounter}>
              <Text style={styles.counterText}>Counter Offer</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryChip: {
    height: 28,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  timeAgo: {
    fontSize: 12,
    color: '#64748B',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budget: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
  deadline: {
    fontSize: 13,
    color: '#64748B',
  },
  offers: {
    fontSize: 13,
    color: '#64748B',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  counterButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  counterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

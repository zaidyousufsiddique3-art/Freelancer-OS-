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
            style={[styles.categoryChip, { backgroundColor: category.color + '15' }]}
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
            <MaterialCommunityIcons name="clock-outline" size={18} color="#9CA3AF" />
            <Text style={styles.deadline}>{formatDeadline(task.deadline)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="account-multiple" size={18} color="#9CA3AF" />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
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
    color: '#9CA3AF',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#22C55E',
  },
  deadline: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  offers: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#C1F21D',
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
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  counterText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 14,
  },
});

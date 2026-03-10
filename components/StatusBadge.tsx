import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { TaskStatus } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: COLORS.info, bg: COLORS.primaryLight },
  assigned: { label: 'Assigned', color: COLORS.warning, bg: COLORS.accentLight },
  in_progress: { label: 'In Progress', color: COLORS.primary, bg: COLORS.primaryLight },
  completed: { label: 'Completed', color: COLORS.success, bg: COLORS.secondaryLight },
  cancelled: { label: 'Cancelled', color: COLORS.danger, bg: COLORS.dangerLight },
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

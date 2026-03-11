import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Offer } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';
import { formatBudget, formatTimeAgo } from '../utils/formatters';

interface OfferCardProps {
  offer: Offer;
  onAccept?: () => void;
  onReject?: () => void;
  isClientView?: boolean;
}

export default function OfferCard({ offer, onAccept, onReject, isClientView }: OfferCardProps) {
  const statusColors: Record<string, string> = {
    pending: COLORS.warning,
    accepted: COLORS.success,
    rejected: COLORS.danger,
    withdrawn: COLORS.textLight,
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.freelancerInfo}>
          <Avatar.Text
            size={44}
            label={offer.freelancerName.charAt(0).toUpperCase()}
            style={{ backgroundColor: '#C1F21D' }}
            labelStyle={{ color: '#000000', fontWeight: '700' }}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{offer.freelancerName}</Text>
            <Text style={styles.time}>{formatTimeAgo(offer.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatBudget(offer.price)}</Text>
          <Text style={styles.delivery}>{offer.deliveryDays} days</Text>
        </View>
      </View>

      {offer.message ? (
        <Text style={styles.message} numberOfLines={3}>
          {offer.message}
        </Text>
      ) : null}

      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[offer.status] + '15' }]}>
          <Text style={[styles.statusText, { color: statusColors[offer.status] }]}>
            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </Text>
        </View>
      </View>

      {isClientView && offer.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <MaterialCommunityIcons name="check" size={18} color="#000000" />
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <MaterialCommunityIcons name="close" size={18} color={COLORS.danger} />
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freelancerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#111111',
  },
  time: {
    fontSize: FONT_SIZES.xs,
    color: '#9CA3AF',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.success,
  },
  delivery: {
    fontSize: FONT_SIZES.xs,
    color: '#6B7280',
    marginTop: 2,
  },
  message: {
    fontSize: FONT_SIZES.sm,
    color: '#6B7280',
    lineHeight: 20,
    marginTop: SPACING.sm,
  },
  statusRow: {
    marginTop: SPACING.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#C1F21D',
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  acceptText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: FONT_SIZES.sm,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  rejectText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: FONT_SIZES.sm,
  },
});

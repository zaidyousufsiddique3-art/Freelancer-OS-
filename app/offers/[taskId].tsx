import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import OfferCard from '../../components/OfferCard';
import { Offer } from '../../types';
import { subscribeOffers, acceptOffer, rejectOffer } from '../../services/offers';

export default function OffersScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const user = useAuthStore((s) => s.user);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!taskId) return;
    const unsubscribe = subscribeOffers(taskId, (newOffers) => {
      setOffers(newOffers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [taskId]);

  const handleAcceptOffer = (offer: Offer) => {
    Alert.alert(
      'Accept Offer',
      `Accept ${offer.freelancerName}'s offer for $${offer.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await acceptOffer(offer.id, offer.taskId, offer.freelancerId);
              Alert.alert('Offer Accepted!', 'A chat has been created with the freelancer.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to accept offer');
            }
          },
        },
      ]
    );
  };

  const handleRejectOffer = (offer: Offer) => {
    Alert.alert('Decline Offer', `Decline ${offer.freelancerName}'s offer?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            await rejectOffer(offer.id);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to decline offer');
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: `Offers (${offers.length})` }} />
      <View style={styles.container}>
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OfferCard
              offer={item}
              isClientView={user?.role === 'client'}
              onAccept={() => handleAcceptOffer(item)}
              onReject={() => handleRejectOffer(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                {loading ? 'Loading offers...' : 'No offers yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                Offers will appear here as freelancers respond
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

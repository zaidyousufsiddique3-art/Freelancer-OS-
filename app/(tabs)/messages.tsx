import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { subscribeChats } from '../../services/chat';
import { formatTimeAgo, truncateText } from '../../utils/formatters';
import { Chat } from '../../types';

export default function MessagesScreen() {
  const user = useAuthStore((s) => s.user);
  const { chats, setChats } = useChatStore();

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeChats(user.id, (newChats) => {
      setChats(newChats);
    });
    return () => unsubscribe();
  }, [user]);

  const getOtherName = (chat: Chat) => {
    if (!user) return '';
    const otherId = chat.participants.find((p) => p !== user.id) || '';
    return chat.participantNames[otherId] || 'Unknown';
  };

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.7}
    >
      <Avatar.Text
        size={48}
        label={getOtherName(item).charAt(0).toUpperCase()}
        style={{ backgroundColor: '#C1F21D' }}
        labelStyle={{ color: '#000000', fontWeight: '700' }}
      />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{getOtherName(item)}</Text>
          <Text style={styles.chatTime}>
            {item.lastMessageAt ? formatTimeAgo(item.lastMessageAt) : ''}
          </Text>
        </View>
        <Text style={styles.chatTask} numberOfLines={1}>
          {item.taskTitle}
        </Text>
        <Text style={styles.chatLastMessage} numberOfLines={1}>
          {item.lastMessage ? truncateText(item.lastMessage, 50) : 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Chats will appear here when a freelancer is selected for a task
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
  },
  chatTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatTask: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '700',
    marginTop: 2,
    opacity: 0.7,
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

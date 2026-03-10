import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TextInput as RNTextInput } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import ChatBubble from '../../components/ChatBubble';
import { Message, Chat } from '../../types';
import { subscribeMessages, sendMessage, getChat } from '../../services/chat';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const { activeMessages, setActiveMessages, addMessage } = useChatStore();
  const [text, setText] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!id) return;

    const loadChat = async () => {
      const c = await getChat(id);
      setChat(c);
    };
    loadChat();

    const unsubscribe = subscribeMessages(id, (messages) => {
      setActiveMessages(messages);
    });

    return () => {
      unsubscribe();
      setActiveMessages([]);
    };
  }, [id]);

  const getOtherName = () => {
    if (!chat || !user) return 'Chat';
    const otherId = chat.participants.find((p) => p !== user.id) || '';
    return chat.participantNames[otherId] || 'Chat';
  };

  const handleSend = async () => {
    if (!text.trim() || !user || !id) return;
    const messageText = text.trim();
    setText('');

    try {
      await sendMessage(id, {
        senderId: user.id,
        text: messageText,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: getOtherName(),
          headerShown: true,
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Task reference */}
        {chat?.taskTitle && (
          <View style={styles.taskBanner}>
            <Text style={styles.taskBannerText}>{chat.taskTitle}</Text>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={activeMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} isOwn={item.senderId === user?.id} />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
            </View>
          }
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <RNTextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textLight}
            multiline
            maxLength={2000}
          />
          <IconButton
            icon="send"
            iconColor={text.trim() ? COLORS.primary : COLORS.textLight}
            size={24}
            onPress={handleSend}
            disabled={!text.trim()}
            style={styles.sendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  taskBanner: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  taskBannerText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  messageList: {
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendButton: {
    marginLeft: 4,
  },
});

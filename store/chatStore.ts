import { create } from 'zustand';
import { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  activeMessages: Message[];
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  setActiveMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeMessages: [],
  isLoading: false,
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  setActiveMessages: (activeMessages) => set({ activeMessages }),
  addMessage: (message) =>
    set((state) => ({
      activeMessages: [...state.activeMessages, message],
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

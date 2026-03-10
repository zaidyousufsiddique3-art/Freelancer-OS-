import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Chat, Message } from '../types';

const chatsRef = collection(db, 'chats');

export const createChat = async (
  chatData: Omit<Chat, 'id' | 'lastMessage' | 'lastMessageAt'>
): Promise<string> => {
  const docRef = await addDoc(chatsRef, {
    ...chatData,
    lastMessage: '',
    lastMessageAt: Date.now(),
  });
  return docRef.id;
};

export const getChat = async (chatId: string): Promise<Chat | null> => {
  const docSnap = await getDoc(doc(db, 'chats', chatId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Chat;
};

export const subscribeChats = (
  userId: string,
  callback: (chats: Chat[]) => void
): (() => void) => {
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Chat));
    callback(chats);
  });
};

export const sendMessage = async (
  chatId: string,
  messageData: Pick<Message, 'senderId' | 'text'>
): Promise<void> => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    ...messageData,
    createdAt: Date.now(),
    read: false,
  });

  // Update last message on chat
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: messageData.text,
    lastMessageAt: Date.now(),
  });
};

export const subscribeMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Message));
    callback(messages);
  });
};

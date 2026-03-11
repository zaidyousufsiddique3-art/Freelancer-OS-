import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAuthStore } from '../store/authStore';
import { User, UserRole, Category } from '../types';

export const signUp = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<void> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user: User = {
    id: credential.user.uid,
    name,
    email,
    role,
    avatar: '',
    skills: [],
    categories: [],
    bio: '',
    createdAt: Date.now(),
  };
  await setDoc(doc(db, 'users', credential.user.uid), user);
  useAuthStore.getState().setUser(user);
};

export const signIn = async (email: string, password: string): Promise<void> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
  if (userDoc.exists()) {
    useAuthStore.getState().setUser(userDoc.data() as User);
  }
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
  useAuthStore.getState().logout();
};

export const updateUserProfile = async (
  updates: Partial<Pick<User, 'bio' | 'skills' | 'categories' | 'name' | 'avatar' | 'serviceTitle' | 'priceRange' | 'deliveryTime'>>
): Promise<void> => {
  const currentUser = useAuthStore.getState().user;
  if (!currentUser) throw new Error('Not authenticated');

  await updateDoc(doc(db, 'users', currentUser.id), updates);
  useAuthStore.getState().setUser({ ...currentUser, ...updates });
};

export const initAuthListener = (): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        useAuthStore.getState().setUser(userDoc.data() as User);
      } else {
        useAuthStore.getState().setUser(null);
      }
    } else {
      useAuthStore.getState().setUser(null);
    }
  });
};

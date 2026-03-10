// Notification service - placeholder for Phase 1
// Push notifications will be fully implemented with Expo Notifications + FCM
// For now, in-app alerts handle notifications

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const savePushToken = async (userId: string, token: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), { pushToken: token });
};

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Offer, OfferStatus } from '../types';
import { updateTaskStatus } from './tasks';
import { createChat } from './chat';

const offersRef = collection(db, 'offers');

export const createOffer = async (
  offerData: Omit<Offer, 'id' | 'status' | 'createdAt'>
): Promise<string> => {
  const docRef = await addDoc(offersRef, {
    ...offerData,
    status: 'pending' as OfferStatus,
    createdAt: Date.now(),
  });

  // Increment offer count on task
  await updateDoc(doc(db, 'tasks', offerData.taskId), {
    offerCount: increment(1),
  });

  return docRef.id;
};

export const acceptOffer = async (
  offerId: string,
  taskId: string,
  freelancerId: string
): Promise<void> => {
  const batch = writeBatch(db);

  // Accept this offer
  batch.update(doc(db, 'offers', offerId), { status: 'accepted' });

  // Update task status
  batch.update(doc(db, 'tasks', taskId), {
    status: 'in_progress',
    assignedTo: freelancerId,
  });

  await batch.commit();

  // Create a chat between client and freelancer
  const taskDoc = await import('firebase/firestore').then(({ getDoc }) =>
    getDoc(doc(db, 'tasks', taskId))
  );
  const taskData = taskDoc.data();
  const freelancerDoc = await import('firebase/firestore').then(({ getDoc }) =>
    getDoc(doc(db, 'users', freelancerId))
  );
  const freelancerData = freelancerDoc.data();

  if (taskData && freelancerData) {
    await createChat({
      participants: [taskData.clientId, freelancerId],
      participantNames: {
        [taskData.clientId]: taskData.clientName,
        [freelancerId]: freelancerData.name,
      },
      taskId,
      taskTitle: taskData.title,
    });
  }
};

export const rejectOffer = async (offerId: string): Promise<void> => {
  await updateDoc(doc(db, 'offers', offerId), { status: 'rejected' });
};

export const withdrawOffer = async (offerId: string): Promise<void> => {
  await updateDoc(doc(db, 'offers', offerId), { status: 'withdrawn' });
};

export const subscribeOffers = (
  taskId: string,
  callback: (offers: Offer[]) => void
): (() => void) => {
  const q = query(offersRef, where('taskId', '==', taskId), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const offers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Offer));
    callback(offers);
  });
};

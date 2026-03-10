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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Task, TaskStatus, Category } from '../types';

const tasksRef = collection(db, 'tasks');

export const createTask = async (
  taskData: Omit<Task, 'id' | 'status' | 'assignedTo' | 'createdAt' | 'offerCount'>
): Promise<string> => {
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    status: 'open' as TaskStatus,
    assignedTo: null,
    createdAt: Date.now(),
    offerCount: 0,
  });
  return docRef.id;
};

export const getTask = async (taskId: string): Promise<Task | null> => {
  const docSnap = await getDoc(doc(db, 'tasks', taskId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Task;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus,
  assignedTo?: string
): Promise<void> => {
  const updates: Record<string, any> = { status };
  if (assignedTo !== undefined) updates.assignedTo = assignedTo;
  await updateDoc(doc(db, 'tasks', taskId), updates);
};

export const subscribeTasks = (
  clientId: string | undefined,
  callback: (tasks: Task[]) => void
): (() => void) => {
  let q;
  if (clientId) {
    // Client sees only their own tasks
    q = query(tasksRef, where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
  } else {
    // Freelancer sees all open tasks
    q = query(tasksRef, where('status', '==', 'open'), orderBy('createdAt', 'desc'));
  }

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
    callback(tasks);
  });
};

export const subscribeUserProjects = (
  userId: string,
  role: string,
  callback: (tasks: Task[]) => void
): (() => void) => {
  const field = role === 'client' ? 'clientId' : 'assignedTo';
  const q = query(tasksRef, where(field, '==', userId), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
    callback(tasks);
  });
};

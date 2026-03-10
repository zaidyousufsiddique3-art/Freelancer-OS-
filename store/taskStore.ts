import { create } from 'zustand';
import { Task, Category } from '../types';

interface TaskState {
  tasks: Task[];
  filteredCategory: Category | null;
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setFilteredCategory: (category: Category | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filteredCategory: null,
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  setFilteredCategory: (filteredCategory) => set({ filteredCategory }),
  setLoading: (isLoading) => set({ isLoading }),
}));

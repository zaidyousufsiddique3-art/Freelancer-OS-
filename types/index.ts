// ============================================================
// FreelancerOS Type Definitions
// ============================================================

export type UserRole = 'client' | 'freelancer';

export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export type Category =
  | 'web_development'
  | 'mobile_development'
  | 'ui_ux_design'
  | 'graphic_design'
  | 'content_writing'
  | 'copywriting'
  | 'video_editing'
  | 'marketing'
  | 'ai_automation'
  | 'data_entry'
  | 'virtual_assistant'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  skills: string[];
  categories: Category[];
  bio: string;
  createdAt: number;
  pushToken?: string;
  // Service Provider fields
  serviceTitle?: string;
  priceRange?: string;
  deliveryTime?: string;
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  category: Category;
  budget: number;
  deadline: number;
  status: TaskStatus;
  assignedTo: string | null;
  createdAt: number;
  offerCount: number;
}

export interface Offer {
  id: string;
  taskId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  price: number;
  deliveryDays: number;
  message: string;
  status: OfferStatus;
  createdAt: number;
}

export interface Chat {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  taskId: string;
  taskTitle: string;
  lastMessage: string;
  lastMessageAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
  read: boolean;
}

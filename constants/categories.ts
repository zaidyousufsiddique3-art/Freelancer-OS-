import { Category } from '../types';

export interface CategoryInfo {
  key: Category;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'web_development', label: 'Web Development', icon: 'web', color: '#4A90D9' },
  { key: 'mobile_development', label: 'Mobile Development', icon: 'cellphone', color: '#7B68EE' },
  { key: 'ui_ux_design', label: 'UI/UX Design', icon: 'palette', color: '#E91E63' },
  { key: 'graphic_design', label: 'Graphic Design', icon: 'draw', color: '#FF6B6B' },
  { key: 'content_writing', label: 'Content Writing', icon: 'pencil', color: '#4CAF50' },
  { key: 'copywriting', label: 'Copywriting', icon: 'file-document-edit', color: '#FF9800' },
  { key: 'video_editing', label: 'Video Editing', icon: 'video', color: '#9C27B0' },
  { key: 'marketing', label: 'Marketing', icon: 'bullhorn', color: '#00BCD4' },
  { key: 'ai_automation', label: 'AI & Automation', icon: 'robot', color: '#607D8B' },
  { key: 'data_entry', label: 'Data Entry', icon: 'database', color: '#795548' },
  { key: 'virtual_assistant', label: 'Virtual Assistant', icon: 'headset', color: '#3F51B5' },
  { key: 'other', label: 'Other', icon: 'dots-horizontal', color: '#9E9E9E' },
];

export const getCategoryInfo = (key: Category): CategoryInfo => {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
};

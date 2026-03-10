import { MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#FFFFFF',
  primaryLight: '#333333',
  secondary: '#10B981',
  secondaryLight: '#064E3B',
  accent: '#F59E0B',
  accentLight: '#451A03',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  background: '#000000',
  surface: '#111111',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textLight: '#64748B',
  border: '#1E293B',
  divider: '#0F172A',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 32,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const paperTheme = {
  ...MD3LightTheme,
  dark: true,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.danger,
    onSurface: COLORS.text,
    onSurfaceVariant: COLORS.textSecondary,
    outline: COLORS.border,
  },
};


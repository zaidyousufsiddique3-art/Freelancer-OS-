import { MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  // Brand Colors
  brandGreen: '#C1F21D',
  black: '#000000',
  white: '#FFFFFF',

  // Backgrounds
  background: '#FFFFFF',
  backgroundSoft: '#F5F5F5',

  // Text
  primary: '#C1F21D',
  primaryLight: '#D4F75E',
  text: '#111111',
  textSecondary: '#6B7280',
  textDisabled: '#9CA3AF',
  textLight: '#6B7280',

  // System
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  error: '#EF4444',
  info: '#3B82F6',

  // Surface & Borders
  surface: '#FFFFFF',
  surfaceSoft: '#F5F5F5',
  border: '#F0F0F0',
  borderDark: '#E5E5E5',
  divider: '#F0F0F0',

  // Legacy compatibility
  secondary: '#C1F21D',
  secondaryLight: '#D4F75E',
  accent: '#C1F21D',
  accentLight: '#D4F75E',
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
  md: 14,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
};

export const paperTheme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.brandGreen,
    secondary: COLORS.brandGreen,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.danger,
    onPrimary: COLORS.black,
    onSurface: COLORS.text,
    onSurfaceVariant: COLORS.textSecondary,
    outline: COLORS.border,
  },
};

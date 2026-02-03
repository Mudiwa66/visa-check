import { Platform } from 'react-native';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const AppColors = {
  primary: '#2196f3',
  primaryDark: '#1976d2',
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#f9f9f9',
  text: {
    primary: '#212121',
    secondary: '#333333',
    muted: '#666666',
    hint: '#999999',
    inverse: '#ffffff',
  },
  border: {
    light: '#e0e0e0',
    default: '#cccccc',
    input: '#dddddd',
  },
  visa: {
    free: { background: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
    onArrival: { background: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
    eVisa: { background: '#fff3e0', border: '#ff9800', text: '#e65100' },
    etaRequired: { background: '#ede7f6', border: '#7e57c2', text: '#512da8' },
    required: { background: '#ffebee', border: '#f44336', text: '#c62828' },
    unknown: { background: '#f5f5f5', border: '#9e9e9e', text: '#616161' },
  },
  error: { background: '#fff3e0', border: '#ffb74d', text: '#e65100' },
  warning: { background: '#fff3e0', border: '#ff9800', text: '#e65100' },
  mode: {
    active: '#2196f3',
    inactive: '#f9f9f9',
    activeText: '#ffffff',
    inactiveText: '#333333',
  },
  chip: { background: '#e3f2fd', text: '#333333' },
  button: { secondary: '#eeeeee', secondaryText: '#666666' },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

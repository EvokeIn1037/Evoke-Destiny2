import type { CSSProperties } from 'react';

export const colors = {
  bg: '#0d0d14',
  bgSurface: '#14141f',
  bgCard: '#1a1a2e',
  bgCardHover: '#1f1f38',
  border: '#2a2a4a',
  borderLight: '#3a3a5a',
  primary: '#c8a951',
  primaryHover: '#e4c86c',
  accent: '#5bc0eb',
  text: '#e8e8f0',
  textMuted: '#8888aa',
  textDim: '#5a5a7a',
  error: '#ef5350',
  success: '#66bb6a',
  navBg: '#0a0a16',
  overlay: 'rgba(0,0,0,0.7)',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const fontSizes = {
  xs: '11px',
  sm: '12px',
  base: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  xxl: '32px',
  hero: '48px',
};

export const font = {
  family: '"FangSong", "仿宋", "FangSong_GB2312", "Noto Serif SC", serif',
};

export const radii = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
};

export const surfaceStyle: CSSProperties = {
  backgroundColor: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
  padding: spacing.lg,
};

export const inputStyle: CSSProperties = {
  backgroundColor: colors.bgSurface,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: radii.md,
  color: colors.text,
  fontFamily: font.family,
  fontSize: fontSizes.md,
  padding: `${spacing.sm} ${spacing.md}`,
  outline: 'none',
  width: '100%',
};

export const buttonStyle: CSSProperties = {
  backgroundColor: colors.primary,
  border: 'none',
  borderRadius: radii.md,
  color: '#0a0a16',
  cursor: 'pointer',
  fontFamily: font.family,
  fontSize: fontSizes.base,
  fontWeight: 'bold',
  padding: `${spacing.sm} ${spacing.md}`,
  whiteSpace: 'nowrap',
};

export const ghostButtonStyle: CSSProperties = {
  backgroundColor: 'transparent',
  border: `1px solid ${colors.borderLight}`,
  borderRadius: radii.md,
  color: colors.text,
  cursor: 'pointer',
  fontFamily: font.family,
  fontSize: fontSizes.base,
  padding: `${spacing.xs} ${spacing.sm}`,
  whiteSpace: 'nowrap',
};

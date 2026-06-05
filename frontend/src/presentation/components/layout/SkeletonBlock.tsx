import type { CSSProperties } from 'react';
import { colors, radii } from '@/presentation/styles/tokens';

interface Props {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export default function SkeletonBlock({ width = '100%', height = '16px', borderRadius = radii.sm }: Props) {
  return <div style={{ ...styles.block, width, height, borderRadius }} />;
}

const styles: Record<string, CSSProperties> = {
  block: {
    backgroundColor: colors.bgCardHover,
    display: 'block',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
  },
};

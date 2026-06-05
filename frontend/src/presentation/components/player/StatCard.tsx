import type { CSSProperties } from 'react';
import { colors, spacing, fontSizes, font, radii } from '@/presentation/styles/tokens';

interface Props {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: Props) {
  return (
    <div style={styles.card}>
      <span style={styles.value}>{value}</span>
      <span style={styles.label}>{label}</span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    backgroundColor: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.md,
    padding: `${spacing.md} ${spacing.lg}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: '88px',
  },
  value: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.xl,
    fontWeight: 700,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  label: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};

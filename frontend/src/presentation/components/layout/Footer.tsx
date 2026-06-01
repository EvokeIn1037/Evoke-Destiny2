import type { CSSProperties } from 'react';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>~Presented by evoke~</p>
    </footer>
  );
}

const styles: Record<string, CSSProperties> = {
  footer: {
    backgroundColor: colors.bgCard,
    borderTop: `1px solid ${colors.border}`,
    marginTop: spacing.xxl,
    padding: spacing.xl,
    textAlign: 'center',
  },
  text: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.base,
  },
};

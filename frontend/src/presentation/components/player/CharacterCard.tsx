import type { CSSProperties } from 'react';
import type { Character } from '@/domain/types/player';
import { CLASS_NAMES } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, radii } from '@/presentation/styles/tokens';

interface Props {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CharacterCard({ character, isSelected, onClick }: Props) {
  const emblemUrl = `https://www.bungie.net${character.emblemBackgroundPath}`;

  return (
    <div
      style={{
        ...styles.card,
        border: isSelected
          ? `2px solid ${colors.primary}`
          : `2px solid ${colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <img src={emblemUrl} alt="emblem" style={styles.emblem} />
      <div style={styles.overlay}>
        <span style={styles.className}>{CLASS_NAMES[character.classType]}</span>
        <span style={styles.light}>✦ {character.light}</span>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    position: 'relative',
    borderRadius: radii.lg,
    overflow: 'hidden',
    width: '220px',
    height: '70px',
    flexShrink: 0,
  },
  emblem: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  className: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
  },
  light: {
    color: colors.primary,
    fontFamily: font.family,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
  },
};

import type { CSSProperties } from 'react';
import type { Character } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, radii } from '@/presentation/styles/tokens';
import titanIcon from '@/presentation/assets/img/class/class-titan.svg';
import hunterIcon from '@/presentation/assets/img/class/class-hunter.svg';
import warlockIcon from '@/presentation/assets/img/class/class-warlock.svg';

const CLASS_ICONS: Record<number, string> = {
  0: titanIcon,
  1: hunterIcon,
  2: warlockIcon,
};

interface Props {
  character: Character;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CharacterCard({ character, isSelected, onClick }: Props) {
  const emblemUrl = `https://www.bungie.net${character.emblemBackgroundPath}`;
  const classIcon = CLASS_ICONS[character.classType];

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
      {classIcon && (
        <div style={styles.classIconWrapper}>
          <img src={classIcon} alt="class icon" style={styles.classIcon} />
        </div>
      )}
      <div style={styles.overlay}>
        <span style={styles.classPlaceholder}> </span>
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
  classIconWrapper: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    width: '28px',
    height: '28px',
    background: 'rgba(0,0,0,0.55)',
    borderRadius: radii.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classIcon: {
    width: '18px',
    height: '18px',
    filter: 'brightness(0) invert(1)',
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
  classPlaceholder: {
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

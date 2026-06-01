import { useState, type CSSProperties } from 'react';
import { PVP_MODES } from '@/domain/constants/pvpModes';
import { colors, spacing, fontSizes, font, radii } from '@/presentation/styles/tokens';

interface Props {
  selectedMode: number | null;
  onSelect: (mode: number) => void;
}

export default function ModeSelector({ selectedMode, onSelect }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div style={styles.wrapper}>
      {PVP_MODES.map(({ id, label }) => {
        const isActive = selectedMode === id;
        const isHovered = hovered === id;
        return (
          <button
            key={id}
            style={{
              ...styles.btn,
              backgroundColor: isActive
                ? colors.primary
                : isHovered
                  ? colors.bgCardHover
                  : colors.bgCard,
              color: isActive ? '#0a0a16' : colors.text,
              border: isActive
                ? `1px solid ${colors.primary}`
                : `1px solid ${colors.border}`,
            }}
            onClick={() => onSelect(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  btn: {
    borderRadius: radii.md,
    cursor: 'pointer',
    fontFamily: font.family,
    fontSize: fontSizes.base,
    fontWeight: 'bold',
    padding: `${spacing.xs} ${spacing.md}`,
    transition: 'background-color 0.1s, color 0.1s',
  },
};

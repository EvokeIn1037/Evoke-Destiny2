import { useEffect, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PVP_MODES, PVP_MODE_MAP } from '@/domain/constants/pvpModes';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

interface Props {
  selectedMode: number | null;
  onSelect: (mode: number) => void;
}

export default function ModeSelector({ selectedMode, onSelect }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (selectedMode !== null) return;
    const urlMode = Number(searchParams.get('mode'));
    if (urlMode && urlMode in PVP_MODE_MAP) {
      onSelect(urlMode);
    }
    // run once on mount to apply a deep-linked mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (id: number) => {
    onSelect(id);
    const next = new URLSearchParams(searchParams);
    next.set('mode', String(id));
    setSearchParams(next);
  };

  return (
    <div style={styles.wrapper} className="hide-scrollbar">
      {PVP_MODES.map(({ id, label }) => {
        const isActive = selectedMode === id;
        const isHovered = hovered === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            style={{
              ...styles.tab,
              color: isActive || isHovered ? colors.text : colors.textMuted,
              borderBottomColor: isActive ? colors.primary : 'transparent',
            }}
            onClick={() => handleSelect(id)}
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
    flexWrap: 'nowrap',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
    gap: spacing.xs,
    marginTop: spacing.sm,
    borderBottom: `1px solid ${colors.border}`,
  },
  tab: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontFamily: font.family,
    fontSize: fontSizes.base,
    fontWeight: 600,
    padding: `${spacing.sm} ${spacing.md}`,
    whiteSpace: 'nowrap',
    transition: 'color 0.1s, border-color 0.1s',
  },
};

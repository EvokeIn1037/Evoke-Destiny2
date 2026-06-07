import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { GearItem } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, surfaceStyle, radii } from '@/presentation/styles/tokens';

interface Props {
  gear: GearItem[];
}

interface GearSlotProps {
  item: GearItem;
}

function GearSlot({ item }: GearSlotProps) {
  const { i18n } = useTranslation();
  const iconUrl = `https://www.bungie.net${item.iconPath}`;
  const lightGgUrl = `https://www.light.gg/db/${i18n.language}/items/${item.itemHash}/`;
  return (
    <div style={styles.slot}>
      <a href={lightGgUrl} target="_blank" rel="noreferrer">
        <img src={iconUrl} alt={item.name} style={styles.icon} />
      </a>
      <p style={styles.itemName}>{item.name}</p>
      <p style={styles.itemLight}>{item.light}</p>
    </div>
  );
}

export default function GearGrid({ gear }: Props) {
  const { t } = useTranslation();
  const weapons = gear.slice(0, 3);
  const armor = gear.slice(3, 8);

  return (
    <div style={{ ...surfaceStyle, ...styles.wrapper }}>
      <p style={styles.sectionLabel}>{t('character.weapons')}</p>
      <div style={styles.row}>
        {weapons.map((item) => (
          <GearSlot key={item.itemHash} item={item} />
        ))}
      </div>
      <p style={{ ...styles.sectionLabel, marginTop: spacing.md }}>{t('character.armor')}</p>
      <div style={styles.row}>
        {armor.map((item) => (
          <GearSlot key={item.itemHash} item={item} />
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    marginTop: spacing.md,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  row: {
    display: 'flex',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  slot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.xs,
    width: '80px',
  },
  icon: {
    width: '64px',
    height: '64px',
    borderRadius: radii.md,
    border: `1px solid ${colors.border}`,
    objectFit: 'cover',
    backgroundColor: colors.bgSurface,
  },
  itemName: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    wordBreak: 'break-all',
    lineHeight: 1.3,
  },
  itemLight: {
    color: colors.primary,
    fontFamily: font.family,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
};

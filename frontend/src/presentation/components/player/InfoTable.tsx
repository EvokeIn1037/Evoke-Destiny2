import React, { type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { CharacterDetail } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, surfaceStyle } from '@/presentation/styles/tokens';

interface Props {
  character: CharacterDetail;
}

function formatPlayTime(minutes: number, tHour: string, tMinute: string): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}${tHour} ${m}${tMinute}`;
  }
  return `${minutes}${tMinute}`;
}

function formatLastPlayed(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function InfoTable({ character }: Props) {
  const { t } = useTranslation();
  const { class_name, race_name, race_description, dateLastPlayed, minutesPlayedTotal, light } = character;

  const rows: [string, React.ReactNode][] = [
    [t('character.classInfo'), <strong>{race_name} {class_name}</strong>],
    ...(race_description ? [[t('character.description'), race_description] as [string, React.ReactNode]] : []),
    [t('character.lastPlayed'), formatLastPlayed(dateLastPlayed)],
    [t('character.playTime'), formatPlayTime(minutesPlayedTotal, t('common.hour'), t('common.minute'))],
    [t('character.lightLevel'), light],
  ];

  return (
    <div style={{ ...surfaceStyle, ...styles.wrapper }}>
      <table style={styles.table}>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td style={styles.label}>{label}：</td>
              <td style={styles.value}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    display: 'inline-block',
  },
  table: {
    borderCollapse: 'collapse',
    fontFamily: font.family,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.base,
    padding: `${spacing.xs} ${spacing.md} ${spacing.xs} 0`,
    whiteSpace: 'nowrap',
  },
  value: {
    color: colors.text,
    fontSize: fontSizes.base,
    padding: `${spacing.xs} 0`,
  },
};

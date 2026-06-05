import type { CSSProperties } from 'react';
import type { CharacterDetail } from '@/domain/types/player';
import { CLASS_NAMES, RACE_NAMES, GENDER_NAMES } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, surfaceStyle } from '@/presentation/styles/tokens';

interface Props {
  character: CharacterDetail;
}

function formatPlayTime(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}小时${m}分钟`;
  }
  return `${minutes}分钟`;
}

function formatLastPlayed(iso: string): string {
  const idx = iso.indexOf('T');
  if (idx === -1) return iso;
  return iso.substring(0, idx) + '  ' + iso.substring(idx + 1).replace('Z', '');
}

export default function StatTable({ character }: Props) {
  const { classType, raceType, genderType, dateLastPlayed, minutesPlayedTotal, light } = character;

  const rows: [string, string | number][] = [
    ['职业', `${CLASS_NAMES[classType]} ${RACE_NAMES[raceType]} ${GENDER_NAMES[genderType]}`],
    ['上次登陆时间', formatLastPlayed(dateLastPlayed)],
    ['游戏时长', formatPlayTime(minutesPlayedTotal)],
    ['光等', light],
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

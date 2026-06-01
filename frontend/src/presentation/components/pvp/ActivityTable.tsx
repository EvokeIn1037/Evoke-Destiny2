import type { CSSProperties } from 'react';
import type { PvpActivity } from '@/domain/types/pvp';
import { colors, spacing, fontSizes, font, surfaceStyle } from '@/presentation/styles/tokens';

interface Props {
  activities: PvpActivity[];
}

const HEADERS = ['地图', '击杀', '死亡', '助攻', 'KD', 'KDA', '效率'];

export default function ActivityTable({ activities }: Props) {
  if (activities.length === 0) {
    return (
      <p style={styles.empty}>暂无记录</p>
    );
  }

  return (
    <div style={{ ...surfaceStyle, ...styles.wrapper }}>
      <div style={styles.scroll}>
        <table style={styles.table}>
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((act, idx) => (
              <tr
                key={`${act.activityHash}-${act.period}-${idx}`}
                style={{ backgroundColor: idx % 2 === 0 ? 'transparent' : colors.bgSurface }}
              >
                <td style={styles.td}>
                  {act.mapName}
                  {act.isTrialsLab && (
                    <span style={styles.labTag}>（试炼实验室）</span>
                  )}
                </td>
                <td style={styles.tdNum}>{act.kills}</td>
                <td style={styles.tdNum}>{act.deaths}</td>
                <td style={styles.tdNum}>{act.assists}</td>
                <td style={styles.tdNum}>{act.killsDeathsRatio.toFixed(2)}</td>
                <td style={styles.tdNum}>{act.killsDeathsAssists.toFixed(2)}</td>
                <td style={styles.tdNum}>{act.efficiency.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    marginTop: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  scroll: {
    overflowX: 'auto',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontFamily: font.family,
  },
  th: {
    backgroundColor: colors.bgSurface,
    borderBottom: `2px solid ${colors.border}`,
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
    padding: `${spacing.sm} ${spacing.md}`,
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text,
    fontSize: fontSizes.base,
    padding: `${spacing.sm} ${spacing.md}`,
    wordBreak: 'break-all',
  },
  tdNum: {
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text,
    fontSize: fontSizes.base,
    padding: `${spacing.sm} ${spacing.md}`,
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  labTag: {
    color: colors.accent,
    fontSize: fontSizes.xs,
    marginLeft: spacing.xs,
  },
  empty: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.base,
    padding: spacing.md,
  },
};

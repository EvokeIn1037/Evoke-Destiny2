import { useState, useEffect, type CSSProperties } from 'react';
import type { PvpActivity } from '@/domain/types/pvp';
import { isTrialsLab } from '@/domain/constants/trialsLab';
import { batchResolveHashes } from '@/data/services/hashService';
import SkeletonBlock from '@/presentation/components/layout/SkeletonBlock';
import { colors, spacing, fontSizes, font, radii, surfaceStyle } from '@/presentation/styles/tokens';

interface Props {
  activities?: PvpActivity[];
  loading?: boolean;
  mode?: number;
}

const HEADERS = ['结果', '地图', '击杀', '死亡', '助攻', 'KD', 'KDA', '效率'];
const SKELETON_ROWS = 5;

export default function ActivityTable({ activities = [], loading = false, mode }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mapNames, setMapNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activities.length === 0) return;
    const uniqueHashes = [...new Set(activities.map((a) => a.activityHash))];
    batchResolveHashes(uniqueHashes).then(setMapNames).catch(() => undefined);
  }, [activities]);

  if (loading) {
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
              {Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
                <tr key={idx}>
                  {HEADERS.map((h) => (
                    <td key={h} style={styles.td}>
                      <SkeletonBlock height="20px" borderRadius="4px" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

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
            {activities.map((act, idx) => {
              const rowBg = hovered === idx
                ? colors.bgCardHover
                : idx % 2 === 0
                  ? 'transparent'
                  : colors.bgSurface;
              const mapName = mapNames[String(act.activityHash)] ?? '';
              const lab = mode !== undefined && isTrialsLab(mode, act.activityDirectorHash);
              const isWin = act.standing === 0;
              const isLoss = act.standing === 1;
              const resultBadge = isWin ? styles.badgeWin : isLoss ? styles.badgeLoss : styles.badgeUnknown;
              const resultLabel = isWin ? 'W' : isLoss ? 'L' : 'N/A';
              return (
                <tr
                  key={`${act.activityHash}-${act.period}-${idx}`}
                  style={{ ...styles.row, backgroundColor: rowBg }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, ...resultBadge }}>{resultLabel}</span>
                  </td>
                  <td style={styles.td}>
                    {mapName}
                    {lab && (
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
              );
            })}
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
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: `${spacing.sm} ${spacing.md}`,
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  row: {
    transition: 'background-color 120ms ease-out',
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
    fontVariantNumeric: 'tabular-nums',
  },
  badge: {
    display: 'inline-block',
    borderRadius: radii.sm,
    padding: `2px ${spacing.sm}`,
    fontSize: fontSizes.sm,
    fontWeight: 600,
    minWidth: '44px',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
  },
  badgeWin: {
    backgroundColor: 'rgba(102,187,106,0.15)',
    color: colors.success,
  },
  badgeLoss: {
    backgroundColor: 'rgba(239,83,80,0.15)',
    color: colors.error,
  },
  badgeUnknown: {
    backgroundColor: 'rgba(136,136,170,0.1)',
    color: colors.textMuted,
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

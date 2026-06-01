import { useState, type CSSProperties } from 'react';
import bungieLoadGif from '@/presentation/assets/img/bungieload.gif';
import { usePlayer } from '@/data/providers/player.provider';
import { useRaid } from '@/data/providers/raid.provider';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import SearchBar from '@/presentation/components/player/SearchBar';
import CharacterCard from '@/presentation/components/player/CharacterCard';
import { RAID_MODES } from '@/domain/constants/raidModes';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

export default function RaidPage() {
  const { status: playerStatus, profile, error: playerError, search } = usePlayer();
  const { load, getState } = useRaid();
  const [selectedModes, setSelectedModes] = useState<Record<string, number>>({});

  const handleModeSelect = (characterId: string, mode: number) => {
    if (!profile) return;
    setSelectedModes((prev) => ({ ...prev, [characterId]: mode }));
    load(profile.membershipId, characterId, mode);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.header}>
        <h1 style={styles.brand}>evoke's destiny</h1>
        <SearchBar onSearch={search} loading={playerStatus === 'loading'} />
      </div>
      <div style={styles.main}>
        <h2 style={styles.pageTitle}>突袭查询</h2>
        {playerStatus === 'idle' && (
          <p style={styles.hint}>请输入Bungie昵称</p>
        )}
        {playerStatus === 'loading' && (
          <div style={styles.loadingWrapper}>
            <p style={styles.loadingText}>加载中...</p>
            <img src={bungieLoadGif} width={160} alt="loading" />
          </div>
        )}
        {playerStatus === 'error' && (
          <p style={styles.error}>{playerError}</p>
        )}
        {playerStatus === 'success' && profile && (
          <div>
            {profile.characters.map((character) => {
              const selectedMode = selectedModes[character.characterId] ?? null;
              const raidState = selectedMode !== null
                ? getState(character.characterId, selectedMode)
                : null;

              return (
                <div key={character.characterId} style={styles.characterSection}>
                  <CharacterCard character={character} />
                  <div style={styles.modeGrid}>
                    {RAID_MODES.map((m) => {
                      const isActive = selectedMode === m.id;
                      return (
                        <button
                          key={m.id}
                          style={{
                            ...styles.modeBtn,
                            backgroundColor: isActive ? colors.primary : 'transparent',
                            color: isActive ? '#0a0a16' : colors.text,
                            borderColor: isActive ? colors.primary : colors.borderLight,
                          }}
                          onClick={() => handleModeSelect(character.characterId, m.id)}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                  {raidState?.status === 'loading' && (
                    <div style={styles.loadingWrapper}>
                      <img src={bungieLoadGif} width={80} alt="loading" />
                    </div>
                  )}
                  {raidState?.status === 'error' && (
                    <p style={styles.error}>{raidState.error}</p>
                  )}
                  {raidState?.status === 'success' && raidState.activities.length === 0 && (
                    <p style={styles.hint}>暂无记录</p>
                  )}
                  {raidState?.status === 'success' && raidState.activities.length > 0 && (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            {['突袭', '完成', '击杀', '死亡', '助攻', '时长', '日期'].map((h) => (
                              <th key={h} style={styles.th}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {raidState.activities.map((a, i) => (
                            <tr key={i} style={i % 2 === 0 ? styles.rowEven : undefined}>
                              <td style={styles.td}>{a.raidName}</td>
                              <td style={{ ...styles.td, color: a.completed ? colors.success : colors.error }}>
                                {a.completed ? '✓' : '✗'}
                              </td>
                              <td style={styles.td}>{a.kills}</td>
                              <td style={styles.td}>{a.deaths}</td>
                              <td style={styles.td}>{a.assists}</td>
                              <td style={styles.td}>{a.duration}</td>
                              <td style={styles.td}>{a.period.slice(0, 10)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    backgroundColor: colors.bg,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: colors.bgCard,
    borderBottom: `1px solid ${colors.border}`,
    padding: `${spacing.xl} ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xl,
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  brand: {
    color: colors.primary,
    fontFamily: font.family,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.xl,
    width: '100%',
  },
  pageTitle: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  hint: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.md,
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  loadingText: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.md,
  },
  error: {
    color: colors.error,
    fontFamily: font.family,
    fontSize: fontSizes.md,
    padding: spacing.md,
  },
  characterSection: {
    marginBottom: spacing.xxl,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: spacing.xl,
  },
  modeGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  modeBtn: {
    border: '1px solid',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: font.family,
    fontSize: fontSizes.base,
    fontWeight: 'bold',
    padding: `${spacing.xs} ${spacing.sm}`,
    transition: 'background-color 0.15s, color 0.15s',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: spacing.md,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: font.family,
    fontSize: fontSizes.base,
  },
  th: {
    color: colors.textMuted,
    borderBottom: `1px solid ${colors.border}`,
    padding: `${spacing.sm} ${spacing.md}`,
    textAlign: 'left',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  td: {
    color: colors.text,
    padding: `${spacing.sm} ${spacing.md}`,
    whiteSpace: 'nowrap',
  },
  rowEven: {
    backgroundColor: colors.bgSurface,
  },
};

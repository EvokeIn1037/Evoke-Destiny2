import { useState, type CSSProperties } from 'react';
import { usePlayer } from '@/data/providers/player.provider';
import { usePvp } from '@/data/providers/pvp.provider';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import SearchBar from '@/presentation/components/player/SearchBar';
import CharacterCard from '@/presentation/components/player/CharacterCard';
import ModeSelector from '@/presentation/components/pvp/ModeSelector';
import ActivityTable from '@/presentation/components/pvp/ActivityTable';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

export default function PvpPage() {
  const { status: playerStatus, profile, error: playerError, search } = usePlayer();
  const { load, getState } = usePvp();
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
        <h2 style={styles.pageTitle}>pvp查询</h2>
        {playerStatus === 'idle' && (
          <p style={styles.hint}>请输入Bungie昵称</p>
        )}
        {playerStatus === 'loading' && (
          <div style={styles.loadingWrapper}>
            <p style={styles.loadingText}>加载中...</p>
            <img src="./img/bungieload.gif" width={160} alt="loading" />
          </div>
        )}
        {playerStatus === 'error' && (
          <p style={styles.error}>{playerError}</p>
        )}
        {playerStatus === 'success' && profile && (
          <div>
            {profile.characters.map((character) => {
              const selectedMode = selectedModes[character.characterId] ?? null;
              const pvpState = selectedMode !== null
                ? getState(character.characterId, selectedMode)
                : null;

              return (
                <div key={character.characterId} style={styles.characterSection}>
                  <CharacterCard character={character} />
                  <ModeSelector
                    selectedMode={selectedMode}
                    onSelect={(mode) => handleModeSelect(character.characterId, mode)}
                  />
                  {pvpState?.status === 'loading' && (
                    <div style={styles.loadingWrapper}>
                      <img src="./img/bungieload.gif" width={80} alt="loading" />
                    </div>
                  )}
                  {pvpState?.status === 'error' && (
                    <p style={styles.error}>{pvpState.error}</p>
                  )}
                  {pvpState?.status === 'success' && (
                    <ActivityTable activities={pvpState.activities} />
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
};

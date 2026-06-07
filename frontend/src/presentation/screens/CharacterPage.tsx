import { useEffect, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlayer } from '@/data/providers/player.provider';
import { useCharacter } from '@/data/providers/character.provider';
import bungieLoadGif from '@/presentation/assets/img/bungieload.gif';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import SearchBar from '@/presentation/components/player/SearchBar';
import CharacterCard from '@/presentation/components/player/CharacterCard';
import PlayerHeader from '@/presentation/components/player/PlayerHeader';
import StatTable from '@/presentation/components/player/StatTable';
import StatCard from '@/presentation/components/player/StatCard';
import GearGrid from '@/presentation/components/player/GearGrid';
import ClanInfo from '@/presentation/components/player/ClanInfo';
import type { CharacterStats } from '@/domain/types/player';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

const STAT_FIELDS: [string, keyof CharacterStats][] = [
  ['敏捷', 'mobility'],
  ['韧性', 'resilience'],
  ['恢复', 'recovery'],
  ['纪律', 'discipline'],
  ['智慧', 'intellect'],
  ['力量', 'strength'],
];

export default function CharacterPage() {
  const { t } = useTranslation();
  const { status: playerStatus, profile, error: playerError, search } = usePlayer();
  const { load, getState } = useCharacter();

  useEffect(() => {
    if (profile) {
      profile.characters.forEach((c) => load(profile.membershipId, c.characterId));
    }
  }, [profile, load]);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.header}>
        <h1 style={styles.brand}>evoke's destiny</h1>
        <SearchBar onSearch={search} loading={playerStatus === 'loading'} />
      </div>
      <div style={styles.main}>
        <h2 style={styles.pageTitle}>{t('character.pageTitle')}</h2>
        {playerStatus === 'idle' && (
          <p style={styles.hint}>{t('character.hint')}</p>
        )}
        {playerStatus === 'loading' && (
          <div style={styles.loadingWrapper}>
            <p style={styles.loadingText}>{t('common.loading')}</p>
            <img src={bungieLoadGif} width={160} alt="loading" />
          </div>
        )}
        {playerStatus === 'error' && (
          <p style={styles.error}>{playerError}</p>
        )}
        {playerStatus === 'success' && profile && (
          <div>
            <PlayerHeader profile={profile} />
            {profile.characters.map((character) => {
              const charState = getState(character.characterId);
              return (
                <div key={character.characterId} style={styles.characterSection}>
                  <CharacterCard character={character} />
                  {charState.status === 'loading' && (
                    <div style={styles.loadingWrapper}>
                      <img src={bungieLoadGif} width={80} alt="loading" />
                    </div>
                  )}
                  {charState.status === 'success' && charState.detail && (
                    <div style={styles.detailWrapper}>
                      <StatTable character={charState.detail} />
                      <div style={styles.statGrid}>
                        {STAT_FIELDS.map(([label, key]) => (
                          <StatCard key={key} label={label} value={charState.detail!.stats[key]} />
                        ))}
                      </div>
                      {charState.detail.gear.length > 0 && (
                        <GearGrid gear={charState.detail.gear} />
                      )}
                    </div>
                  )}
                  {charState.status === 'error' && (
                    <p style={styles.error}>{charState.error}</p>
                  )}
                </div>
              );
            })}
            {profile.clan && <ClanInfo clan={profile.clan} />}
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
    minHeight: '100dvh',
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
  detailWrapper: {
    marginTop: spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
  },
  statGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
};

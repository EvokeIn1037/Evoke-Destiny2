import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlayer } from '@/data/providers/player.provider';
import { useCharacter } from '@/data/providers/character.provider';
import bungieLoadGif from '@/presentation/assets/img/bungieload.gif';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import SearchBar from '@/presentation/components/player/SearchBar';
import CharacterCard from '@/presentation/components/player/CharacterCard';
import PlayerHeader from '@/presentation/components/player/PlayerHeader';
import InfoTable from '@/presentation/components/player/InfoTable';
import StatCard from '@/presentation/components/player/StatCard';
import GearGrid from '@/presentation/components/player/GearGrid';
import ClanInfo from '@/presentation/components/player/ClanInfo';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

export default function CharacterPage() {
  const { t, i18n } = useTranslation();
  const { status: playerStatus, profile, error: playerError, search } = usePlayer();
  const { load, getState } = useCharacter();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const langRef = useRef(i18n.language);
  const searchLangRef = useRef(i18n.language);

  useEffect(() => { langRef.current = i18n.language; });

  const toggleExpanded = (id: string) =>
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const handleSearch = (name: string) => {
    searchLangRef.current = i18n.language;
    search(name);
  };

  const effectiveStatus = playerStatus !== 'loading' && i18n.language !== searchLangRef.current
    ? 'idle'
    : playerStatus;

  useEffect(() => {
    if (!profile) return;
    profile.characters.forEach((c) => load(profile.membershipId, c.characterId, langRef.current));
  }, [profile, load]);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.header}>
        <h1 style={styles.brand}>evoke's destiny</h1>
        <SearchBar onSearch={handleSearch} loading={effectiveStatus === 'loading'} />
      </div>
      <div style={styles.main}>
        <h2 style={styles.pageTitle}>{t('character.pageTitle')}</h2>
        {effectiveStatus === 'idle' && (
          <p style={styles.hint}>{t('character.hint')}</p>
        )}
        {effectiveStatus === 'loading' && (
          <div style={styles.loadingWrapper}>
            <p style={styles.loadingText}>{t('common.loading')}</p>
            <img src={bungieLoadGif} width={160} alt="loading" />
          </div>
        )}
        {effectiveStatus === 'error' && (
          <p style={styles.error}>{playerError}</p>
        )}
        {effectiveStatus === 'success' && profile && (
          <div>
            <PlayerHeader profile={profile} />
            {profile.characters.map((character) => {
              const charState = getState(character.characterId, i18n.language);
              const isExpanded = expandedIds.has(character.characterId);
              return (
                <div key={character.characterId} style={styles.characterSection}>
                  <CharacterCard
                    character={character}
                    isSelected={isExpanded}
                    onClick={() => toggleExpanded(character.characterId)}
                  />
                  {isExpanded && charState.status === 'success' && charState.detail && (
                    <div style={styles.detailWrapper}>
                      <InfoTable character={charState.detail} />
                      <div style={styles.statGrid}>
                        {charState.detail.stats.map(({ name, value }) => (
                          <StatCard key={name} label={name} value={value} />
                        ))}
                      </div>
                      {charState.detail.gear.length > 0 && (
                        <GearGrid gear={charState.detail.gear} />
                      )}
                    </div>
                  )}
                  {isExpanded && charState.status === 'error' && (
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

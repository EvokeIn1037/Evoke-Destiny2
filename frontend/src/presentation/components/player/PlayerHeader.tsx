import type { CSSProperties } from 'react';
import type { PlayerProfile } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, radii } from '@/presentation/styles/tokens';
import { decodeHtml } from '@/shared/utils/bungieName';

interface Props {
  profile: PlayerProfile;
}

export default function PlayerHeader({ profile }: Props) {
  const banner = profile.characters[0]?.emblemBackgroundPath;
  const bannerUrl = banner ? `https://www.bungie.net${banner}` : null;
  const maxLight = profile.characters.reduce((m, c) => Math.max(m, c.light), 0);

  return (
    <div style={styles.banner}>
      {bannerUrl && <img src={bannerUrl} alt="" style={styles.bannerImg} />}
      <div style={styles.overlay}>
        <div>
          <h3 style={styles.name}>{profile.displayName}</h3>
          {profile.clan && (
            <p style={styles.clan}>
              {decodeHtml(profile.clan.name)} [{decodeHtml(profile.clan.callsign)}]
            </p>
          )}
        </div>
        {maxLight > 0 && <span style={styles.light}>✦ {maxLight}</span>}
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  banner: {
    position: 'relative',
    borderRadius: radii.lg,
    overflow: 'hidden',
    height: '120px',
    marginBottom: spacing.lg,
    border: `1px solid ${colors.border}`,
  },
  bannerImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.55)',
  },
  overlay: {
    position: 'relative',
    height: '100%',
    padding: spacing.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  },
  name: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.xl,
    fontWeight: 700,
    textShadow: '0 1px 3px rgba(0,0,0,0.9)',
    margin: 0,
  },
  clan: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.md,
    textShadow: '0 1px 3px rgba(0,0,0,0.9)',
    margin: 0,
    marginTop: spacing.xs,
  },
  light: {
    color: colors.primary,
    fontFamily: font.family,
    fontSize: fontSizes.lg,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    textShadow: '0 1px 3px rgba(0,0,0,0.9)',
  },
};

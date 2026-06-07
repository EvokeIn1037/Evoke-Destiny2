import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import type { ClanInfo as ClanInfoType } from '@/domain/types/player';
import { colors, spacing, fontSizes, font, surfaceStyle, radii } from '@/presentation/styles/tokens';

interface Props {
  clan: ClanInfoType;
}

export default function ClanInfo({ clan }: Props) {
  const { t } = useTranslation();
  const bannerUrl = `https://www.bungie.net${clan.bannerPath}`;

  return (
    <div style={{ ...surfaceStyle, ...styles.wrapper }}>
      <h3 style={styles.heading}>公会信息</h3>
      <div style={styles.body}>
        <img src={bannerUrl} alt="clan banner" style={styles.banner} />
        <div style={styles.details}>
          <p style={styles.name}>
            <strong>{clan.name}</strong>
            <span style={styles.callsign}> [{clan.callsign}]</span>
          </p>
          <p style={styles.meta}>{t('clan.membersCount', { count: clan.memberCount })}</p>
          {clan.motto && <p style={styles.motto}><strong>{t('clan.motto')}</strong>{clan.motto}</p>}
          {clan.about && (
            <div style={styles.about}>
              <strong>{t('clan.about')}</strong>
              <p style={styles.aboutText}>{clan.about}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    marginTop: spacing.lg,
  },
  heading: {
    color: colors.primary,
    fontFamily: font.family,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  body: {
    display: 'flex',
    gap: spacing.lg,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  banner: {
    width: '120px',
    height: 'auto',
    borderRadius: radii.md,
    flexShrink: 0,
  },
  details: {
    flex: 1,
    minWidth: '200px',
  },
  name: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.lg,
    marginBottom: spacing.xs,
  },
  callsign: {
    color: colors.primary,
  },
  meta: {
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: fontSizes.base,
    marginBottom: spacing.sm,
  },
  motto: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.base,
    marginBottom: spacing.xs,
  },
  about: {
    color: colors.text,
    fontFamily: font.family,
    fontSize: fontSizes.base,
    marginTop: spacing.xs,
  },
  aboutText: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
};

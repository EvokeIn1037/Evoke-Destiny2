import { useState, type CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '@/shared/i18n';
import { ROUTES } from '@/app/navigation/routes';
import { colors, spacing, fontSizes, font, radii } from '@/presentation/styles/tokens';

const NAV_KEYS = [
  { key: 'nav.home', route: ROUTES.HOME },
  { key: 'nav.character', route: ROUTES.CHARACTER },
  { key: 'nav.pvp', route: ROUTES.PVP },
  { key: 'nav.raid', route: ROUTES.RAID },
  { key: 'nav.hash', route: ROUTES.HASH },
] as const;

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'es-mx', label: 'Español (MX)' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' },
  { code: 'pt-br', label: 'Português (BR)' },
  { code: 'ru', label: 'Русский' },
  { code: 'pl', label: 'Polski' },
  { code: 'ko', label: '한국어' },
  { code: 'zh-cht', label: '繁體中文' },
  { code: 'zh-chs', label: '简体中文' },
] as const;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<string | null>(null);

  const currentHash = '#' + location.pathname;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <span
          style={styles.brand}
          onClick={() => navigate(ROUTES.HOME)}
        >
          {t('nav.brand')}
        </span>
        <ul style={styles.list}>
          {NAV_KEYS.map(({ key, route }) => {
            const isActive = currentHash === '#' + route || location.pathname === route;
            const isHovered = hovered === route;
            return (
              <li key={route} style={styles.item}>
                <button
                  style={{
                    ...styles.link,
                    color: isActive ? colors.primary : isHovered ? colors.text : colors.textMuted,
                    borderBottom: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                  }}
                  onClick={() => navigate(route)}
                  onMouseEnter={() => setHovered(route)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {t(key)}
                </button>
              </li>
            );
          })}
        </ul>
        <select
          aria-label="Select language"
          style={styles.langSelect}
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          {LANGUAGES.map(({ code, label }) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  nav: {
    backgroundColor: colors.navBg,
    borderBottom: `1px solid ${colors.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xl,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.lg}`,
    height: '52px',
  },
  brand: {
    color: colors.primary,
    fontFamily: font.family,
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    cursor: 'pointer',
    flexShrink: 0,
  },
  list: {
    display: 'flex',
    gap: spacing.xs,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flex: 1,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: font.family,
    fontSize: fontSizes.base,
    fontWeight: 'bold',
    padding: `${spacing.sm} ${spacing.md}`,
    transition: 'color 0.15s',
  },
  langSelect: {
    backgroundColor: colors.bgSurface,
    color: colors.primary,
    border: '1px solid ' + colors.border,
    borderRadius: radii.sm,
    padding: '4px 8px',
    cursor: 'pointer',
    fontFamily: font.family,
    fontSize: fontSizes.sm,
    flexShrink: 0,
  },
};

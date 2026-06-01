import { useState, type CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/app/navigation/routes';
import { colors, spacing, fontSizes, font } from '@/presentation/styles/tokens';

const NAV_ITEMS = [
  { label: '主页', route: ROUTES.HOME },
  { label: '个人数据', route: ROUTES.CHARACTER },
  { label: 'pvp查询', route: ROUTES.PVP },
  { label: '突袭查询', route: ROUTES.RAID },
  { label: 'hash查询', route: ROUTES.HASH },
] as const;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);

  const currentHash = '#' + location.pathname;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <span
          style={styles.brand}
          onClick={() => navigate(ROUTES.HOME)}
        >
          evoke's destiny
        </span>
        <ul style={styles.list}>
          {NAV_ITEMS.map(({ label, route }) => {
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
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
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
};

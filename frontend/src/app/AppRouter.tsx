import { lazy, Suspense, type CSSProperties } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './navigation/routes';
import { colors, fontSizes, font, spacing } from '@/presentation/styles/tokens';

const HomePage = lazy(() => import('@/presentation/screens/HomePage'));
const CharacterPage = lazy(() => import('@/presentation/screens/CharacterPage'));
const PvpPage = lazy(() => import('@/presentation/screens/PvpPage'));
const RaidPage = lazy(() => import('@/presentation/screens/RaidPage'));

function RouteFallback() {
  return <div style={fallbackStyle}>加载中...</div>;
}

export default function AppRouter() {
  return (
    <HashRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CHARACTER} element={<CharacterPage />} />
          <Route path={ROUTES.PVP} element={<PvpPage />} />
          <Route path={ROUTES.RAID} element={<RaidPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

const fallbackStyle: CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.bg,
  color: colors.textMuted,
  fontFamily: font.family,
  fontSize: fontSizes.md,
  padding: spacing.xl,
};

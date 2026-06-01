import { HashRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './navigation/routes';
import HomePage from '@/presentation/screens/HomePage';
import CharacterPage from '@/presentation/screens/CharacterPage';
import PvpPage from '@/presentation/screens/PvpPage';
import RaidPage from '@/presentation/screens/RaidPage';
import HashPage from '@/presentation/screens/HashPage';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CHARACTER} element={<CharacterPage />} />
        <Route path={ROUTES.PVP} element={<PvpPage />} />
        <Route path={ROUTES.RAID} element={<RaidPage />} />
        <Route path={ROUTES.HASH} element={<HashPage />} />
      </Routes>
    </HashRouter>
  );
}

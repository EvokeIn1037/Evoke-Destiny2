import { HashRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './navigation/routes';
import HomePage from '@/presentation/screens/HomePage';
import CharacterPage from '@/presentation/screens/CharacterPage';
import PvpPage from '@/presentation/screens/PvpPage';

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CHARACTER} element={<CharacterPage />} />
        <Route path={ROUTES.PVP} element={<PvpPage />} />
      </Routes>
    </HashRouter>
  );
}

import { Route, Routes } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import PlayPage from '../pages/PlayPage';
import RoundSummaryPage from '../pages/RoundSummaryPage';
import ScoresPage from '../pages/ScoresPage';

export default function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/scores" element={<ScoresPage />} />
        <Route path="/round/:id" element={<RoundSummaryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

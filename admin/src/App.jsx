import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Loader from './components/Loader';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LeadsPage = lazy(() => import('./pages/LeadsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <Suspense fallback={<Loader fullPage label="Loading admin panel" />}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin/dashboard"
          element={(
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/leads"
          element={(
            <ProtectedRoute>
              <LeadsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/projects"
          element={(
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/team"
          element={(
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/settings"
          element={(
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          )}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

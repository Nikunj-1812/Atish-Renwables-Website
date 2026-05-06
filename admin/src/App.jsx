import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import Loader from './components/Loader';

const adminPages = {
  '/admin/login': () => import('./pages/LoginPage'),
  '/admin/dashboard': () => import('./pages/DashboardPage'),
  '/admin/leads': () => import('./pages/LeadsPage'),
  '/admin/projects': () => import('./pages/ProjectsPage'),
  '/admin/team': () => import('./pages/TeamPage'),
  '/admin/settings': () => import('./pages/SettingsPage'),
  '*': () => import('./pages/NotFoundPage'),
};

const LoginPage = lazy(adminPages['/admin/login']);
const DashboardPage = lazy(adminPages['/admin/dashboard']);
const LeadsPage = lazy(adminPages['/admin/leads']);
const ProjectsPage = lazy(adminPages['/admin/projects']);
const TeamPage = lazy(adminPages['/admin/team']);
const SettingsPage = lazy(adminPages['/admin/settings']);
const NotFoundPage = lazy(adminPages['*']);

export const prefetchAdminRoute = (path) => {
  if (adminPages[path]) {
    adminPages[path]();
  }
};

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

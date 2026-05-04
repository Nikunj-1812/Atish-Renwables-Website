import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './authStore';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

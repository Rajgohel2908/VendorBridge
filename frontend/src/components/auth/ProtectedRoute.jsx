import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore.js';

/**
 * Wraps routes that require authentication.
 * Redirects to /login if no valid token/user is present,
 * preserving the originally requested path for post-login redirect.
 */
export default function ProtectedRoute() {
  const user = useAppStore((s) => s.user);
  const token = useAppStore((s) => s.token);
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

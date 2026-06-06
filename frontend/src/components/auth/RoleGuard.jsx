import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore.js';

/**
 * Restricts child routes to users whose role is in the allowed list.
 *
 * Usage:
 *   <Route element={<RoleGuard roles={['ADMIN', 'MANAGER']} />}>
 *     <Route path="/approvals" element={<ApprovalQueue />} />
 *   </Route>
 *
 * If the user's role is not included, they are redirected to /dashboard.
 */
export default function RoleGuard({ roles = [] }) {
  const user = useAppStore((s) => s.user);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

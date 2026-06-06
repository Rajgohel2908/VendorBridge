import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../activity/NotificationBell.jsx';
import Badge from '../ui/Badge.jsx';
import { useAppStore } from '../../store/useAppStore.js';

const roleBadgeTone = {
  ADMIN: 'slate',
  PROCUREMENT_OFFICER: 'blue',
  MANAGER: 'amber',
  VENDOR: 'green',
};

const roleLabel = {
  ADMIN: 'Admin',
  PROCUREMENT_OFFICER: 'Procurement',
  MANAGER: 'Manager',
  VENDOR: 'Vendor',
};

export default function Header({ onMenuToggle }) {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-border bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="rounded p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden">
          <Menu size={20} />
        </button>
        <p className="text-sm text-brand-muted">Procurement workspace</p>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="text-right">
          <p className="text-sm font-semibold">{user?.name || 'User'}</p>
          <Badge tone={roleBadgeTone[user?.role] || 'slate'}>{roleLabel[user?.role] || user?.role}</Badge>
        </div>
        <button
          onClick={handleLogout}
          className="rounded border border-brand-border p-2 text-slate-500 hover:bg-slate-50 hover:text-brand-danger"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

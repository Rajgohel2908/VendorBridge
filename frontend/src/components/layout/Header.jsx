import { LogOut, Menu, Sparkles } from 'lucide-react';
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
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/70 bg-brand-surface/85 px-4 shadow-sm shadow-slate-900/5 backdrop-blur lg:px-7">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="rounded-md p-2 text-slate-600 hover:bg-slate-900/5 lg:hidden">
          <Menu size={20} />
        </button>
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-teal">
            <Sparkles size={14} />
            Procurement workspace
          </p>
          <p className="mt-1 hidden text-sm text-brand-muted sm:block">Track RFQs, approvals, orders, and invoices in one place.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold text-brand-ink">{user?.name || 'User'}</p>
          <Badge tone={roleBadgeTone[user?.role] || 'slate'}>{roleLabel[user?.role] || user?.role}</Badge>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-brand-border bg-white/75 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-brand-danger"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

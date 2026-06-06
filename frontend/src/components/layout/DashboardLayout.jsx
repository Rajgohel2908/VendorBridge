import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import { useAppStore } from '../../store/useAppStore.js';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const token = useAppStore((s) => s.token);
  const user = useAppStore((s) => s.user);
  const initAuth = useAppStore((s) => s.initAuth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!token) navigate('/login', { replace: true });
  }, [token, navigate]);

  if (!token || !user) return null;

  return (
    <div className="flex min-h-screen bg-brand-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { activityService } from '../../services/activityService.js';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { data } = useQuery({
    queryKey: ['activity', 'recent'],
    queryFn: () => activityService.list({ limit: 5 }).then((r) => r.data),
    refetchInterval: 30000,
  });
  const items = data?.data || [];

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-md border border-brand-border bg-white/75 p-2 text-slate-700 transition hover:border-brand-primary/30 hover:bg-blue-50"
        title="Notifications"
      >
        <Bell size={18} />
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-brand-danger px-1 text-[10px] font-bold text-white ring-2 ring-brand-surface">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-3 w-80 overflow-hidden rounded-lg border border-white/80 bg-brand-surface shadow-2xl shadow-slate-950/15 ring-1 ring-slate-900/10">
          <div className="border-b border-brand-border px-4 py-3">
            <p className="text-sm font-bold text-brand-ink">Recent activity</p>
          </div>
          {items.length === 0 ? <p className="px-4 py-4 text-sm text-brand-muted">No recent activity.</p> : (
            items.map((item) => (
              <div key={item._id} className="border-b border-brand-border/80 px-4 py-3 last:border-0 hover:bg-blue-50/60">
                <p className="text-sm font-semibold text-brand-ink">{item.action}</p>
                <p className="mt-1 text-xs text-brand-muted">{item.userId?.name || 'System'} - {new Date(item.createdAt).toLocaleTimeString()}</p>
              </div>
            ))
          )}
          <Link to="/activity" onClick={() => setOpen(false)} className="block bg-slate-100/70 px-4 py-3 text-center text-sm font-semibold text-brand-primary hover:bg-blue-50">View all</Link>
        </div>
      )}
    </div>
  );
}

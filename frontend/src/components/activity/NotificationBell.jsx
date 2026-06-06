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
      <button onClick={() => setOpen(!open)} className="relative rounded border border-brand-border bg-white p-2 text-slate-700 hover:bg-slate-50">
        <Bell size={18} />
        {items.length > 0 && (
          <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-brand-danger px-1 text-[10px] font-bold text-white">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded border border-brand-border bg-white py-2 shadow-lg">
          {items.length === 0 ? <p className="px-4 py-2 text-sm text-brand-muted">No recent activity.</p> : (
            items.map((item) => (
              <div key={item._id} className="border-b border-brand-border px-4 py-2 last:border-0">
                <p className="text-sm font-medium">{item.action}</p>
                <p className="text-xs text-brand-muted">{item.userId?.name} · {new Date(item.createdAt).toLocaleTimeString()}</p>
              </div>
            ))
          )}
          <Link to="/activity" onClick={() => setOpen(false)} className="block px-4 py-2 text-center text-sm text-brand-primary hover:bg-slate-50">View all</Link>
        </div>
      )}
    </div>
  );
}

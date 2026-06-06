import { Bell } from 'lucide-react';

export default function NotificationBell() {
  return (
    <button className="relative rounded border border-brand-border bg-white p-2 text-slate-700">
      <Bell size={18} />
      <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-brand-danger px-1 text-[10px] font-bold text-white">
        3
      </span>
    </button>
  );
}

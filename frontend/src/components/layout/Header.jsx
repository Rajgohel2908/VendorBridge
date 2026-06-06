import NotificationBell from '../activity/NotificationBell.jsx';
import Badge from '../ui/Badge.jsx';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-brand-border bg-white px-4 lg:px-6">
      <div>
        <p className="text-sm text-brand-muted">Procurement workspace</p>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="text-right">
          <p className="text-sm font-semibold">Aarav Sharma</p>
          <Badge tone="blue">PROCUREMENT OFFICER</Badge>
        </div>
      </div>
    </header>
  );
}

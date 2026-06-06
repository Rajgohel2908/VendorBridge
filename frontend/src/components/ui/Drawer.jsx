import Button from './Button.jsx';
import { X } from 'lucide-react';

export default function Drawer({ title, children, onClose }) {
  return (
    <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-xl border-l border-white/80 bg-brand-surface shadow-2xl shadow-slate-950/20">
      <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
        <h2 className="font-bold text-brand-ink">{title}</h2>
        <Button variant="ghost" onClick={onClose} className="h-9 w-9 p-0" title="Close">
          <X size={17} />
        </Button>
      </div>
      <div className="p-5">{children}</div>
    </aside>
  );
}

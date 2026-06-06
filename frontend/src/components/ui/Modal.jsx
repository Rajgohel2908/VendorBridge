import Button from './Button.jsx';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-white/80 bg-brand-surface shadow-2xl shadow-slate-950/20 ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h2 className="font-bold text-brand-ink">{title}</h2>
          <Button variant="ghost" onClick={onClose} className="h-9 w-9 p-0" title="Close">
            <X size={17} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

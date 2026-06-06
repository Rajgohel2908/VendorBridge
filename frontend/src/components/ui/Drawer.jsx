import Button from './Button.jsx';

export default function Drawer({ title, children, onClose }) {
  return (
    <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-xl border-l border-brand-border bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
        <h2 className="font-semibold">{title}</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="p-4">{children}</div>
    </aside>
  );
}

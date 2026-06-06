import Button from './Button.jsx';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded border border-brand-border bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
          <h2 className="font-semibold">{title}</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

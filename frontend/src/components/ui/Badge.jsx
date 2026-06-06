const tones = {
  amber: 'bg-amber-50 text-brand-warning',
  blue: 'bg-blue-50 text-brand-primary',
  green: 'bg-green-50 text-brand-success',
  red: 'bg-red-50 text-brand-danger',
  slate: 'bg-slate-100 text-slate-700',
};

export default function Badge({ children, tone = 'slate' }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

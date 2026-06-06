const tones = {
  amber: 'bg-amber-100 text-amber-800 ring-amber-200',
  blue: 'bg-blue-100 text-brand-primary ring-blue-200',
  green: 'bg-emerald-100 text-brand-success ring-emerald-200',
  red: 'bg-red-100 text-brand-danger ring-red-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  teal: 'bg-teal-100 text-teal-800 ring-teal-200',
};

export default function Badge({ children, tone = 'slate', className = '', ...props }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]} ${className}`} {...props}>
      {children}
    </span>
  );
}

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const styles = {
    primary: 'border-brand-primary bg-brand-primary text-white shadow-sm shadow-brand-primary/20 hover:bg-brand-primaryDark',
    blue: 'border-brand-primary bg-brand-primary text-white shadow-sm shadow-brand-primary/20 hover:bg-brand-primaryDark',
    outline: 'border-brand-border bg-white/80 text-brand-ink hover:border-brand-primary/40 hover:bg-blue-50',
    ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-900/5',
    success: 'border-emerald-200 bg-emerald-50 text-brand-success hover:bg-emerald-100',
    danger: 'border-red-200 bg-red-50 text-brand-danger hover:bg-red-100',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary/25 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

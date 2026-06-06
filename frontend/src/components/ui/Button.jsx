export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'border-black bg-black text-white hover:bg-slate-800',
    blue: 'border-brand-primary bg-brand-primary text-white hover:bg-blue-700',
    outline: 'border-brand-border bg-white text-slate-900 hover:bg-slate-50',
    ghost: 'border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
    success: 'border-brand-success bg-white text-brand-success hover:bg-green-50',
    danger: 'border-brand-danger bg-white text-brand-danger hover:bg-red-50',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded border px-3 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span> : null}
      <input
        ref={ref}
        className={`w-full rounded-md border border-brand-border bg-white/85 px-3 py-2.5 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 ${error ? 'border-brand-danger focus:border-brand-danger focus:ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-brand-danger">{error}</span> : null}
    </label>
  );
});

export default Input;

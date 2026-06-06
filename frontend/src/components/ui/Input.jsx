import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        ref={ref}
        className={`w-full rounded border border-brand-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100 ${error ? 'border-brand-danger' : ''} ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-brand-danger">{error}</span> : null}
    </label>
  );
});

export default Input;

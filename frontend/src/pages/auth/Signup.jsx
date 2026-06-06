import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Building2, ClipboardCheck, UsersRound } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useRegister } from '../../hooks/useAuth.js';
import { useAppStore } from '../../store/useAppStore.js';

export default function Signup() {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);
  const { register: reg, handleSubmit, formState: { errors } } = useForm();
  const registerMutation = useRegister();
  const [apiError, setApiError] = useState('');

  const onSubmit = (data) => {
    setApiError('');
    registerMutation.mutate(data, {
      onSuccess: (res) => {
        setAuth({ user: res.data.user, token: res.data.token });
        navigate('/dashboard');
      },
      onError: (err) => {
        console.error('Registration error details:', err);
        setApiError(err.response?.data?.message || err.message || 'Registration failed');
      },
    });
  };

  return (
    <main className="grid min-h-screen bg-brand-background lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden overflow-hidden bg-brand-sidebar p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
            <img src="/logo.svg" alt="VendorBridge" className="h-8 w-8" />
          </span>
          <div>
            <h1 className="font-display text-4xl leading-none">VendorBridge</h1>
            <p className="mt-1 text-sm font-medium text-cyan-100/80">Start your procurement workspace</p>
          </div>
        </div>
        <div className="max-w-lg">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-200">Built for every role</p>
          <h2 className="mt-4 text-5xl font-bold leading-tight">Invite buyers, vendors, and managers into a cleaner workflow.</h2>
          <div className="mt-8 grid gap-3">
            {[
              { icon: Building2, label: 'Vendor registration' },
              { icon: ClipboardCheck, label: 'Approval routing' },
              { icon: UsersRound, label: 'Role-aware access' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/10">
                <Icon size={18} className="text-cyan-100" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-300">Structured from RFQ creation through invoice generation.</p>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_rgba(16,32,51,0.12)] ring-1 ring-slate-900/5 backdrop-blur">
          <div className="mb-6 lg:hidden">
            <img src="/logo.svg" alt="VendorBridge" className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-brand-ink">Create account</h2>
          <p className="mt-2 mb-6 text-sm text-brand-muted">Join VendorBridge and choose the role that matches your workflow.</p>
          {apiError && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-brand-danger ring-1 ring-red-100">{apiError}</p>}
          <div className="grid gap-4">
            <Input
              label="Full Name"
              error={errors.name?.message}
              {...reg('name', { required: 'Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...reg('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...reg('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Role</span>
              <select
                className="w-full rounded-md border border-brand-border bg-white/85 px-3 py-2.5 text-sm text-brand-ink outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
                {...reg('role', { required: 'Role is required' })}
              >
                <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                <option value="VENDOR">Vendor</option>
                <option value="MANAGER">Manager</option>
              </select>
              {errors.role && <span className="mt-1 block text-xs text-brand-danger">{errors.role.message}</span>}
            </label>
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? <><Spinner /> Creating...</> : 'Create account'}
            </Button>
            <Link to="/login" className="text-center text-sm text-brand-muted">
              Already have an account? <span className="font-semibold text-brand-primary">Sign in</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

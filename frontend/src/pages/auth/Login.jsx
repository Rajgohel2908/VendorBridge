import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CheckCircle2, FileCheck2, ShieldCheck, Workflow } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useLogin } from '../../hooks/useAuth.js';
import { useAppStore } from '../../store/useAppStore.js';

const highlights = [
  { icon: Workflow, label: 'RFQ to PO workflow' },
  { icon: ShieldCheck, label: 'Role-based approvals' },
  { icon: FileCheck2, label: 'Invoice-ready records' },
];

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAppStore((s) => s.setAuth);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const loginMutation = useLogin();
  const [apiError, setApiError] = useState('');

  const onSubmit = (data) => {
    setApiError('');
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        setAuth({ user: res.data.user, token: res.data.token });
        navigate('/dashboard');
      },
      onError: (err) => {
        console.error('Login error details:', err);
        setApiError(err.response?.data?.message || err.message || 'Login failed');
      },
    });
  };

  return (
    <main className="grid min-h-screen bg-brand-background lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-brand-sidebar p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(49,87,213,0.32),transparent_38%),linear-gradient(315deg,rgba(15,139,141,0.38),transparent_34%),linear-gradient(180deg,rgba(184,107,0,0.16),transparent_55%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <img src="/logo.svg" alt="VendorBridge" className="h-8 w-8" />
            </span>
            <div>
              <h1 className="font-display text-4xl leading-none">VendorBridge</h1>
              <p className="mt-1 text-sm font-medium text-cyan-100/80">Professional procurement workspace</p>
            </div>
          </div>
          <div className="mt-20 max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-200">Procurement control center</p>
            <h2 className="mt-4 text-5xl font-bold leading-tight">Bring vendors, quotes, approvals, and orders into one flow.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
              A clean operating layer for teams that need speed, accountability, and fewer handoffs.
            </p>
          </div>
        </div>
        <div className="relative grid gap-3">
          {highlights.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/10">
              <Icon size={18} className="text-cyan-100" />
              <span className="text-sm font-semibold text-white">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_rgba(16,32,51,0.12)] ring-1 ring-slate-900/5 backdrop-blur">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <img src="/logo.svg" alt="VendorBridge" className="h-10 w-10" />
            <div>
              <p className="font-display text-3xl leading-none text-brand-ink">VendorBridge</p>
              <p className="text-xs font-semibold text-brand-muted">Procurement workspace</p>
            </div>
          </div>
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800 ring-1 ring-teal-200">
              <CheckCircle2 size={14} />
              Secure access
            </span>
            <h2 className="mt-4 text-3xl font-bold text-brand-ink">Welcome back</h2>
            <p className="mt-2 text-sm text-brand-muted">Sign in to continue managing procurement operations.</p>
          </div>
          {apiError && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-brand-danger ring-1 ring-red-100">{apiError}</p>}
          <div className="grid gap-4">
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
            <Link to="/forgot-password" className="text-right text-sm font-semibold text-brand-muted underline-offset-4 hover:text-brand-primary hover:underline">
              Forgot password?
            </Link>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <><Spinner /> Signing in...</> : 'Sign in'}
            </Button>
            <div className="mt-6 border-t border-brand-border/60 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Demo Accounts (Password: password123)</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-slate-100/70 p-2 border border-brand-border/40">
                  <p className="font-bold text-slate-800">Admin</p>
                  <p className="text-brand-muted select-all cursor-pointer">aarav@vendorbridge.test</p>
                </div>
                <div className="rounded bg-slate-100/70 p-2 border border-brand-border/40">
                  <p className="font-bold text-slate-800">Procurement Officer</p>
                  <p className="text-brand-muted select-all cursor-pointer">priya@vendorbridge.test</p>
                </div>
                <div className="rounded bg-slate-100/70 p-2 border border-brand-border/40">
                  <p className="font-bold text-slate-800">Manager</p>
                  <p className="text-brand-muted select-all cursor-pointer">karan@vendorbridge.test</p>
                </div>
                <div className="rounded bg-slate-100/70 p-2 border border-brand-border/40">
                  <p className="font-bold text-slate-800">Vendor</p>
                  <p className="text-brand-muted select-all cursor-pointer">vendor@acme.test</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

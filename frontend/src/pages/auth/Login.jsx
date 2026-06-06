import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useLogin } from '../../hooks/useAuth.js';
import { useAppStore } from '../../store/useAppStore.js';

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
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-center bg-brand-sidebar p-10 text-white lg:flex">
        <img src="/logo.svg" alt="VendorBridge" className="mb-6 h-12 w-12" />
        <h1 className="font-display text-5xl">VendorBridge</h1>
        <p className="mt-3 max-w-md text-slate-300">Structured procurement from RFQ to invoice.</p>
        <div className="mt-10 space-y-3 text-sm text-slate-400">
          <p>✓ Vendor management & registration</p>
          <p>✓ RFQ creation & quotation comparison</p>
          <p>✓ Approval workflows & purchase orders</p>
          <p>✓ Invoice generation & email delivery</p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-2xl font-semibold">Welcome back</h2>
          <p className="mb-6 text-sm text-brand-muted">Sign in to your VendorBridge account</p>
          {apiError && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-brand-danger">{apiError}</p>}
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
            <Link to="/forgot-password" className="text-right text-sm text-brand-muted underline-offset-4 hover:underline">
              Forgot password?
            </Link>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? <><Spinner /> Signing in…</> : 'Sign in'}
            </Button>
            <Link to="/signup" className="text-center text-sm text-brand-muted">
              Don't have an account? <span className="text-brand-primary">Create one</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

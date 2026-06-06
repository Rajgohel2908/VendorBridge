import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
        setApiError(err.response?.data?.message || 'Registration failed');
      },
    });
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-center bg-brand-sidebar p-10 text-white lg:flex">
        <img src="/logo.svg" alt="VendorBridge" className="mb-6 h-12 w-12" />
        <h1 className="font-display text-5xl">VendorBridge</h1>
        <p className="mt-3 max-w-md text-slate-300">Register a procurement, manager, vendor, or admin account.</p>
      </section>
      <section className="flex items-center justify-center bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-2xl font-semibold">Create account</h2>
          <p className="mb-6 text-sm text-brand-muted">Join VendorBridge to manage procurement</p>
          {apiError && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-brand-danger">{apiError}</p>}
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
              <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
              <select
                className="w-full rounded border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100"
                {...reg('role', { required: 'Role is required' })}
              >
                <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                <option value="VENDOR">Vendor</option>
                <option value="MANAGER">Manager</option>
              </select>
              {errors.role && <span className="mt-1 block text-xs text-brand-danger">{errors.role.message}</span>}
            </label>
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? <><Spinner /> Creating…</> : 'Create account'}
            </Button>
            <Link to="/login" className="text-center text-sm text-brand-muted">
              Already have an account? <span className="text-brand-primary">Sign in</span>
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

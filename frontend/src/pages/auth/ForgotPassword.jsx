import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useForgotPassword } from '../../hooks/useAuth.js';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const mutation = useForgotPassword();
  const [sent, setSent] = useState(false);

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => setSent(true),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-background p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded border border-brand-border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Forgot Password</h1>
        <p className="mb-6 text-sm text-brand-muted">Enter your email to receive reset instructions.</p>
        {sent ? (
          <div className="rounded bg-green-50 px-4 py-3 text-sm text-brand-success">
            If that email is registered, you'll receive a reset link shortly.
          </div>
        ) : (
          <div className="grid gap-4">
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <><Spinner /> Sending…</> : 'Send Reset Email'}
            </Button>
          </div>
        )}
        <Link to="/login" className="mt-4 block text-center text-sm text-brand-muted">Back to login</Link>
      </form>
    </main>
  );
}

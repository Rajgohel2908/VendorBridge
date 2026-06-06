import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MailCheck } from 'lucide-react';
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-white/80 bg-white/90 p-7 shadow-[0_24px_70px_rgba(16,32,51,0.12)] ring-1 ring-slate-900/5 backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-100 text-brand-primary ring-1 ring-blue-200">
            <MailCheck size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-brand-ink">Reset password</h1>
            <p className="text-sm text-brand-muted">We will send instructions to your email.</p>
          </div>
        </div>
        {sent ? (
          <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-medium text-brand-success ring-1 ring-emerald-100">
            If that email is registered, you will receive a reset link shortly.
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
              {mutation.isPending ? <><Spinner /> Sending...</> : 'Send reset email'}
            </Button>
          </div>
        )}
        <Link to="/login" className="mt-5 block text-center text-sm font-semibold text-brand-muted hover:text-brand-primary">Back to login</Link>
      </form>
    </main>
  );
}

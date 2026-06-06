import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

export default function ForgotPassword() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-background p-6">
      <form className="w-full max-w-md rounded border border-brand-border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Forgot Password</h1>
        <p className="mb-6 text-sm text-brand-muted">Enter your email to receive reset instructions.</p>
        <div className="grid gap-4">
          <Input label="Email" type="email" />
          <Button type="button">Send Reset Email</Button>
          <Link to="/login" className="text-center text-sm text-brand-muted">Back to login</Link>
        </div>
      </form>
    </main>
  );
}

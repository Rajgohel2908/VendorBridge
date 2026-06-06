import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

export default function Login() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-center bg-brand-sidebar p-8 text-white">
        <img src="/logo.svg" alt="VendorBridge" className="mb-6 h-12 w-12" />
        <h1 className="font-display text-5xl">VendorBridge</h1>
        <p className="mt-3 max-w-md text-slate-300">Structured procurement from RFQ to invoice.</p>
      </section>
      <section className="flex items-center justify-center bg-white p-6">
        <form className="w-full max-w-md rounded border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Login</h2>
          <div className="grid gap-4">
            <Input label="Email" type="email" />
            <Input label="Password" type="password" />
            <Link to="/forgot-password" className="text-right text-sm underline-offset-4 hover:underline">
              Forgot password?
            </Link>
            <Button type="button" className="w-full">Login</Button>
            <Link to="/signup" className="text-center text-sm text-brand-muted">Create an account</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

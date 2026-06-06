import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

export default function Signup() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-center bg-brand-sidebar p-8 text-white">
        <img src="/logo.svg" alt="VendorBridge" className="mb-6 h-12 w-12" />
        <h1 className="font-display text-5xl">VendorBridge</h1>
        <p className="mt-3 max-w-md text-slate-300">Register a procurement, manager, vendor, or admin account.</p>
      </section>
      <section className="flex items-center justify-center bg-white p-6">
        <form className="w-full max-w-md rounded border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold">Signup</h2>
          <div className="grid gap-4">
            <Input label="Name" />
            <Input label="Email" type="email" />
            <Input label="Password" type="password" />
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
              <select className="w-full rounded border border-brand-border px-3 py-2 text-sm">
                <option>PROCUREMENT_OFFICER</option>
                <option>VENDOR</option>
                <option>MANAGER</option>
                <option>ADMIN</option>
              </select>
            </label>
            <Button type="button" className="w-full">Signup</Button>
            <Link to="/login" className="text-center text-sm text-brand-muted">Back to login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

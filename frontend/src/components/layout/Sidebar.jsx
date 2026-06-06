import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  FileQuestion,
  FileText,
  Home,
  ReceiptText,
  Shield,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';
import { canAccess } from '../../utils/roleGuard.js';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: Home, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] },
  { to: '/vendors', label: 'Vendors', icon: Users, roles: ['ADMIN'] }, // Admin: Manage vendors
  { to: '/rfq', label: 'RFQs', icon: FileQuestion, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] }, // PO: Create RFQs, Vendor: Track RFQ status, Manager: Monitor procurement workflows
  { to: '/quotations', label: 'Quotations', icon: FileText, roles: ['VENDOR'] }, // Vendor: Submit quotations
  { to: '/approvals', label: 'Approvals', icon: ClipboardCheck, roles: ['MANAGER'] }, // Manager: Approve or reject requests
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'] }, // PO: Generate POs, Vendor: View POs, Manager: Monitor workflows
  { to: '/invoices', label: 'Invoices', icon: ReceiptText, roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'] }, // PO: Generate Invoices, Manager: Monitor workflows
  { to: '/reports', label: 'Reports', icon: BarChart3, roles: ['ADMIN'] }, // Admin: View procurement analytics
  { to: '/admin', label: 'Admin', icon: Shield, roles: ['ADMIN'] }, // Admin: Manage users
];

export default function Sidebar({ open, onClose }) {
  const user = useAppStore((s) => s.user);
  const visibleItems = items.filter((item) => canAccess(user?.role, item.roles));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-brand-sidebar text-white shadow-2xl shadow-slate-950/20 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
            <img src="/logo.svg" alt="VendorBridge" className="h-7 w-7" />
          </span>
          <div>
            <span className="block font-display text-2xl leading-none">VendorBridge</span>
            <span className="text-xs font-medium text-cyan-100/80">Procurement OS</span>
          </div>
        </div>
        <button onClick={onClose} className="rounded-md p-1.5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden">
          <X size={18} />
        </button>
      </div>
      <nav className="space-y-1 px-3 py-5">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-white text-brand-sidebar shadow-lg shadow-slate-950/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-cyan-100 transition group-hover:bg-white/15">
              <Icon size={17} />
            </span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
        <div className="rounded-lg bg-white/10 p-3 ring-1 ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-100/80">Workspace</p>
          <p className="mt-1 text-sm font-semibold text-white">{user?.company || 'VendorBridge Network'}</p>
        </div>
      </div>
    </aside>
  );
}

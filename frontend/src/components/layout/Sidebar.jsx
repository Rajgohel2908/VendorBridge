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
      className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-brand-sidebar text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="VendorBridge" className="h-8 w-8" />
          <span className="font-display text-2xl">VendorBridge</span>
        </div>
        <button onClick={onClose} className="rounded p-1 text-slate-400 hover:text-white lg:hidden">
          <X size={18} />
        </button>
      </div>
      <nav className="px-3 py-4">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'border-brand-primary bg-white/10 text-white'
                  : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

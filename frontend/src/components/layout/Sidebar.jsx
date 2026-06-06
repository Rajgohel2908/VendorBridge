import { NavLink } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  FileQuestion,
  FileText,
  Home,
  ReceiptText,
  ShoppingCart,
  Users,
} from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/vendors', label: 'Vendors', icon: Users },
  { to: '/rfq', label: 'RFQs', icon: FileQuestion },
  { to: '/quotations', label: 'Quotations', icon: FileText },
  { to: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { to: '/invoices', label: 'Invoices', icon: ReceiptText },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 bg-brand-sidebar text-white lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <img src="/logo.svg" alt="VendorBridge" className="h-8 w-8" />
        <span className="font-display text-2xl">VendorBridge</span>
      </div>
      <nav className="px-3 py-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 border-l-2 px-3 py-2 text-sm ${
                isActive
                  ? 'border-brand-primary bg-white/10 text-white'
                  : 'border-transparent text-slate-300 hover:bg-white/5'
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

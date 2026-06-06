import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ClipboardCheck, FileQuestion, ReceiptText, ShoppingCart } from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { useAppStore } from '../../store/useAppStore.js';

const statusTone = { GENERATED: 'blue', SENT: 'amber', COMPLETED: 'green', PAID: 'green', OPEN: 'blue', PENDING: 'amber' };

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.get('/reports').then((r) => r.data),
  });
  const { data: posData } = useQuery({ queryKey: ['purchase-orders'], queryFn: () => api.get('/purchase-orders').then((r) => r.data) });
  const { data: invData } = useQuery({ queryKey: ['invoices'], queryFn: () => api.get('/invoices').then((r) => r.data) });

  const stats = data?.data?.summary || {};
  const pos = posData?.data?.slice(0, 5) || [];
  const invoices = invData?.data?.slice(0, 5) || [];
  const statCards = [
    {
      label: 'Active RFQs',
      value: stats.activeRFQs ?? 0,
      icon: FileQuestion,
      accent: 'from-blue-600 to-cyan-500',
      note: 'Open sourcing events',
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals ?? 0,
      icon: ClipboardCheck,
      accent: 'from-amber-500 to-orange-500',
      note: user?.role === 'MANAGER' ? 'Review queue' : 'Awaiting review',
      onClick: user?.role === 'MANAGER' ? () => navigate('/approvals') : undefined,
    },
    {
      label: 'Purchase Orders',
      value: stats.totalPOs ?? 0,
      icon: ShoppingCart,
      accent: 'from-emerald-600 to-teal-500',
      note: 'Issued commitments',
    },
    {
      label: 'Invoices',
      value: stats.totalInvoices ?? 0,
      icon: ReceiptText,
      accent: 'from-violet-600 to-indigo-500',
      note: 'Billing pipeline',
    },
  ];

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live view of procurement activity across sourcing, approvals, orders, and invoice flow."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, accent, note, onClick }) => (
          <Card
            key={label}
            onClick={onClick}
            className={`p-4 transition ${onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-muted">{label}</p>
                <p className="mt-3 text-4xl font-bold text-brand-ink">{value}</p>
              </div>
              <span className={`grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-lg shadow-slate-900/15`}>
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              {note}
              {onClick ? <ArrowRight size={13} /> : null}
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-5 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-ink">Quick actions</h2>
            <p className="mt-1 text-sm text-brand-muted">Jump into the next common task for your role.</p>
          </div>
          <QuickActions />
        </div>
      </Card>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-brand-border/80 bg-slate-100/70 px-4 py-3">
            <h2 className="font-bold text-brand-ink">Recent Purchase Orders</h2>
          </div>
          {pos.length === 0 ? <p className="p-4 text-sm text-brand-muted">No purchase orders yet.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/60 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">PO#</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Vendor</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pos.map((po) => (
                    <tr key={po._id} className="border-t border-brand-border/70 hover:bg-blue-50/60">
                      <td className="px-4 py-3 font-semibold text-brand-ink">{po.poNumber}</td>
                      <td className="px-4 py-3">{po.vendorId?.name || '-'}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(po.totalAmount)}</td>
                      <td className="px-4 py-3"><Badge tone={statusTone[po.status] || 'slate'}>{po.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-brand-border/80 bg-slate-100/70 px-4 py-3">
            <h2 className="font-bold text-brand-ink">Recent Invoices</h2>
          </div>
          {invoices.length === 0 ? <p className="p-4 text-sm text-brand-muted">No invoices yet.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/60 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Invoice#</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Vendor</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Total</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="border-t border-brand-border/70 hover:bg-blue-50/60">
                      <td className="px-4 py-3 font-semibold text-brand-ink">{inv.invoiceNo}</td>
                      <td className="px-4 py-3">{inv.vendorId?.name || '-'}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(inv.total)}</td>
                      <td className="px-4 py-3"><Badge tone={statusTone[inv.status] || 'slate'}>{inv.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

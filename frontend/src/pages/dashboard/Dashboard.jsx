import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
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

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of procurement activity." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-l-4 border-l-brand-primary p-4">
          <p className="text-3xl font-semibold">{stats.activeRFQs ?? 0}</p>
          <p className="mt-1 text-sm text-brand-muted">Active RFQs</p>
        </Card>
        {(user?.role === 'MANAGER' || user?.role === 'ADMIN') ? (
          <Card
            className="cursor-pointer border-l-4 border-l-brand-warning p-4 transition-shadow hover:shadow-md"
            onClick={() => navigate('/approvals')}
          >
            <p className="text-3xl font-semibold">{stats.pendingApprovals ?? 0}</p>
            <p className="mt-1 text-sm text-brand-muted">Pending Approvals</p>
            <p className="mt-1 text-xs text-brand-primary">Click to view →</p>
          </Card>
        ) : (
          <Card className="border-l-4 border-l-brand-warning p-4">
            <p className="text-3xl font-semibold">{stats.pendingApprovals ?? 0}</p>
            <p className="mt-1 text-sm text-brand-muted">Pending Approvals</p>
          </Card>
        )}
        <Card className="border-l-4 border-l-brand-success p-4">
          <p className="text-3xl font-semibold">{stats.totalPOs ?? 0}</p>
          <p className="mt-1 text-sm text-brand-muted">Purchase Orders</p>
        </Card>
        <Card className="border-l-4 border-l-slate-600 p-4">
          <p className="text-3xl font-semibold">{stats.totalInvoices ?? 0}</p>
          <p className="mt-1 text-sm text-brand-muted">Invoices</p>
        </Card>
      </div>
      <div className="mt-4"><QuickActions /></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Recent Purchase Orders</h2>
          {pos.length === 0 ? <p className="text-sm text-brand-muted">No purchase orders yet.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600"><tr>
                  <th className="px-3 py-2 font-semibold">PO#</th><th className="px-3 py-2 font-semibold">Vendor</th>
                  <th className="px-3 py-2 font-semibold">Amount</th><th className="px-3 py-2 font-semibold">Status</th>
                </tr></thead>
                <tbody>{pos.map((po) => (
                  <tr key={po._id} className="border-t border-brand-border hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{po.poNumber}</td>
                    <td className="px-3 py-2">{po.vendorId?.name || '—'}</td>
                    <td className="px-3 py-2">{formatCurrency(po.totalAmount)}</td>
                    <td className="px-3 py-2"><Badge tone={statusTone[po.status] || 'slate'}>{po.status}</Badge></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Recent Invoices</h2>
          {invoices.length === 0 ? <p className="text-sm text-brand-muted">No invoices yet.</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600"><tr>
                  <th className="px-3 py-2 font-semibold">Invoice#</th><th className="px-3 py-2 font-semibold">Vendor</th>
                  <th className="px-3 py-2 font-semibold">Total</th><th className="px-3 py-2 font-semibold">Status</th>
                </tr></thead>
                <tbody>{invoices.map((inv) => (
                  <tr key={inv._id} className="border-t border-brand-border hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium">{inv.invoiceNo}</td>
                    <td className="px-3 py-2">{inv.vendorId?.name || '—'}</td>
                    <td className="px-3 py-2">{formatCurrency(inv.total)}</td>
                    <td className="px-3 py-2"><Badge tone={statusTone[inv.status] || 'slate'}>{inv.status}</Badge></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

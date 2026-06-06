import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useInvoices } from '../../hooks/useInvoices.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const statusTone = { GENERATED: 'blue', SENT: 'amber', PAID: 'green' };

export default function InvoiceList() {
  const { data, isLoading } = useInvoices();
  const invoices = data?.data || [];

  return (
    <>
      <PageHeader title="Invoices" />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : invoices.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-brand-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600"><tr>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Invoice</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Vendor</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Total</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Status</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                  <td className="border-b border-brand-border px-4 py-3 font-medium">{inv.invoiceNo}</td>
                  <td className="border-b border-brand-border px-4 py-3">{inv.vendorId?.name || '—'}</td>
                  <td className="border-b border-brand-border px-4 py-3">{formatCurrency(inv.total)}</td>
                  <td className="border-b border-brand-border px-4 py-3"><Badge tone={statusTone[inv.status]}>{inv.status}</Badge></td>
                  <td className="border-b border-brand-border px-4 py-3">
                    <Link to={`/invoices/${inv._id}`} className="text-sm text-brand-primary hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

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
      <PageHeader title="Invoices" description="Monitor generated invoices, delivery status, and payment progress." />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : invoices.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No invoices yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(16,32,51,0.07)] ring-1 ring-slate-900/5">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100/90 text-left text-slate-600">
              <tr>
                {['Invoice', 'Vendor', 'Total', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b border-brand-border/70 transition hover:bg-blue-50/60">
                  <td className="px-4 py-3 font-semibold text-brand-ink">{inv.invoiceNo}</td>
                  <td className="px-4 py-3">{inv.vendorId?.name || '-'}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(inv.total)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[inv.status] || 'slate'}>{inv.status}</Badge></td>
                  <td className="px-4 py-3">
                    <Link to={`/invoices/${inv._id}`} className="text-sm font-semibold text-brand-primary hover:underline">View</Link>
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

import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useQuotations } from '../../hooks/useQuotations.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const statusTone = { SUBMITTED: 'blue', REVISED: 'amber', SELECTED: 'green', REJECTED: 'slate' };

export default function QuotationList() {
  const { data, isLoading } = useQuotations();
  const quotations = data?.data || [];

  return (
    <>
      <PageHeader title="My Quotations" />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : quotations.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No quotations submitted yet.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-brand-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600"><tr>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">RFQ</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Price</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Delivery</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Status</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Updated</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {quotations.map((q) => {
                const rfqOpen = q.rfqId?.status === 'OPEN';
                const canEdit = rfqOpen && (q.status === 'SUBMITTED' || q.status === 'REVISED');
                return (
                  <tr key={q._id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                    <td className="border-b border-brand-border px-4 py-3 font-medium">{q.rfqId?.title || '—'}</td>
                    <td className="border-b border-brand-border px-4 py-3">{formatCurrency(q.price)}</td>
                    <td className="border-b border-brand-border px-4 py-3">{q.deliveryDays} days</td>
                    <td className="border-b border-brand-border px-4 py-3"><Badge tone={statusTone[q.status]}>{q.status}</Badge></td>
                    <td className="border-b border-brand-border px-4 py-3 text-brand-muted">{formatDate(q.updatedAt)}</td>
                    <td className="border-b border-brand-border px-4 py-3">
                      {canEdit ? (
                        <Link to={`/rfq/${q.rfqId?._id}/quotations?edit=${q._id}`}>
                          <Button variant="outline" className="text-xs">Edit</Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-brand-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

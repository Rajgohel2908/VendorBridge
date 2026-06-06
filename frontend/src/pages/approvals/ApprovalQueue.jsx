import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useApprovals } from '../../hooks/useApprovals.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const statusTone = { PENDING: 'amber', APPROVED: 'green', REJECTED: 'slate' };

export default function ApprovalQueue() {
  const { data, isLoading } = useApprovals();
  const approvals = data?.data || [];

  return (
    <>
      <PageHeader title="Approval Queue" />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : approvals.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No approvals pending.</p>
      ) : (
        <div className="grid gap-3">
          {approvals.map((a) => (
            <Link to={`/approvals/${a._id}`} key={a._id}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{a.quotationId?.rfqId?.title || a.rfqId?.title || 'Quotation'}</h2>
                    <p className="text-sm text-brand-muted">
                      {a.quotationId?.vendorId?.name || '—'} · {formatCurrency(a.quotationId?.price)} · {a.quotationId?.deliveryDays || '?'} days
                    </p>
                  </div>
                  <Badge tone={statusTone[a.status]}>{a.status}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

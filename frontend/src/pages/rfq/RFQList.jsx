import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Card from '../../components/ui/Card.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useRFQs } from '../../hooks/useRFQ.js';
import { formatDate } from '../../utils/formatDate.js';
import { useAppStore } from '../../store/useAppStore.js';

const statusTone = { OPEN: 'blue', CLOSED: 'green', CANCELLED: 'slate' };

export default function RFQList() {
  const user = useAppStore((s) => s.user);
  const { data, isLoading } = useRFQs();
  const rfqs = data?.data || [];

  return (
    <>
      <PageHeader
        title="RFQs"
        action={user?.role === 'PROCUREMENT_OFFICER' ? <Link to="/rfq/new"><Button variant="blue">Create RFQ</Button></Link> : null}
      />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : rfqs.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No RFQs found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rfqs.map((rfq) => (
            <Link to={`/rfq/${rfq._id}`} key={rfq._id}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{rfq.title}</h3>
                  <Badge tone={statusTone[rfq.status] || 'slate'}>{rfq.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-brand-muted">Qty: {rfq.quantity} · Deadline: {formatDate(rfq.deadline)}</p>
                <p className="mt-1 text-xs text-brand-muted">{rfq.vendors?.length || 0} vendor(s) assigned</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

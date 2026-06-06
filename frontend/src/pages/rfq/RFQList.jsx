import { Link } from 'react-router-dom';
import { CalendarDays, Plus, Users } from 'lucide-react';
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
        description="Track sourcing events, invited vendors, and response deadlines."
        action={user?.role === 'PROCUREMENT_OFFICER' ? <Link to="/rfq/new"><Button variant="blue"><Plus size={16} /> Create RFQ</Button></Link> : null}
      />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : rfqs.length === 0 ? (
        <Card className="p-10 text-center text-brand-muted">No RFQs found.</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rfqs.map((rfq) => (
            <Link to={`/rfq/${rfq._id}`} key={rfq._id}>
              <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-brand-ink">{rfq.title}</h3>
                  <Badge tone={statusTone[rfq.status] || 'slate'}>{rfq.status}</Badge>
                </div>
                <div className="mt-5 grid gap-2 text-sm text-brand-muted">
                  <p className="flex items-center gap-2"><CalendarDays size={15} /> Deadline: {formatDate(rfq.deadline)}</p>
                  <p className="flex items-center gap-2"><Users size={15} /> {rfq.vendors?.length || 0} vendor(s) assigned</p>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">Quantity: {rfq.quantity}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

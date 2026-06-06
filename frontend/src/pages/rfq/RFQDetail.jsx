import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useRFQDetail } from '../../hooks/useRFQ.js';
import { useQuotations } from '../../hooks/useQuotations.js';
import { formatDate } from '../../utils/formatDate.js';
import { useAppStore } from '../../store/useAppStore.js';

const statusTone = { OPEN: 'blue', CLOSED: 'green', CANCELLED: 'slate' };

export default function RFQDetail() {
  const { id } = useParams();
  const user = useAppStore((s) => s.user);
  const { data, isLoading } = useRFQDetail(id);
  const rfq = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!rfq) return <p className="py-10 text-center text-brand-muted">RFQ not found.</p>;

  const isVendor = user?.role === 'VENDOR';
  const isOfficer = user?.role === 'PROCUREMENT_OFFICER';
  
  const { data: myQuotes } = useQuotations();
  const existingQuote = isVendor ? myQuotes?.data?.find(q => q.rfqId?._id === id) : null;

  return (
    <>
      <PageHeader
        title={rfq.title}
        action={
          <div className="flex gap-2">
            {isVendor && rfq.status === 'OPEN' && !existingQuote && <Link to={`/rfq/${id}/quotations`}><Button variant="blue">Submit Quotation</Button></Link>}
            {isVendor && existingQuote && <Link to={`/quotations/${existingQuote._id}`}><Button variant="outline">View Quotation</Button></Link>}
            {isOfficer && <Link to={`/rfq/${id}/compare`}><Button variant="outline">Compare Quotations</Button></Link>}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{rfq.title}</h2>
            <Badge tone={statusTone[rfq.status]}>{rfq.status}</Badge>
          </div>
          <p className="mt-3 text-sm text-slate-700">{rfq.description || 'No description.'}</p>
          <div className="mt-4 grid gap-2 text-sm text-brand-muted">
            <p>Quantity: <span className="font-medium text-slate-900">{rfq.quantity}</span></p>
            <p>Deadline: <span className="font-medium text-slate-900">{formatDate(rfq.deadline)}</span></p>
            <p>Created by: <span className="font-medium text-slate-900">{rfq.createdBy?.name || '—'}</span></p>
          </div>
          {rfq.attachment && (
            <div className="mt-4">
              <a href={`http://127.0.0.1:5000${rfq.attachment}`} target="_blank" rel="noreferrer" className="text-sm text-brand-primary hover:underline">📎 View Attachment</a>
            </div>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Assigned Vendors ({rfq.vendors?.length || 0})</h3>
          {rfq.vendors?.length ? (
            <div className="space-y-2">
              {rfq.vendors.map((v) => (
                <div key={v._id} className="rounded border border-brand-border p-3 text-sm">
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-brand-muted">{v.category} · {v.email}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-brand-muted">No vendors assigned.</p>}
        </Card>
      </div>
    </>
  );
}

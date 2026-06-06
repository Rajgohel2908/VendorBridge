import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useQuotationDetail } from '../../hooks/useQuotations.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { useAppStore } from '../../store/useAppStore.js';

const statusTone = { SUBMITTED: 'blue', REVISED: 'amber', SELECTED: 'green', REJECTED: 'slate' };

export default function QuotationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const { data, isLoading } = useQuotationDetail(id);

  const quotation = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!quotation) return <p className="py-10 text-center text-brand-muted">Quotation not found.</p>;

  const rfq = quotation.rfqId;
  const isVendor = user?.role === 'VENDOR';
  const rfqOpen = rfq?.status === 'OPEN';
  const canEdit = isVendor && rfqOpen && (quotation.status === 'SUBMITTED' || quotation.status === 'REVISED');

  return (
    <>
      <PageHeader
        title={`Quotation Detail - ${rfq?.title || 'RFQ Reference'}`}
        action={
          canEdit ? (
            <Link to={`/rfq/${rfq?._id}/quotations?edit=${quotation._id}`}>
              <Button variant="blue">Edit Proposal</Button>
            </Link>
          ) : null
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Bid Details */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4 mb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Proposal ID</span>
                <p className="text-sm font-medium text-slate-900">{quotation._id}</p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block text-right">Status</span>
                <Badge tone={statusTone[quotation.status]}>{quotation.status}</Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-brand-border bg-slate-50/50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Unit Bid Price</span>
                <p className="mt-1 text-2xl font-bold text-slate-800">{formatCurrency(quotation.price)}</p>
                <p className="text-xs text-brand-muted mt-1">Cost per single unit</p>
              </div>

              <div className="rounded-xl border border-brand-border bg-slate-50/50 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">Delivery Timeline</span>
                <p className="mt-1 text-2xl font-bold text-slate-800">{quotation.deliveryDays} Days</p>
                <p className="text-xs text-brand-muted mt-1">Estimated transit/fulfillment time</p>
              </div>
            </div>

            {rfq?.quantity && (
              <div className="mt-6 rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">Total Estimated Value</span>
                  <p className="text-3xl font-extrabold text-brand-primary leading-none mt-1">
                    {formatCurrency(quotation.price * rfq.quantity)}
                  </p>
                </div>
                <div className="text-sm text-brand-muted bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-brand-border/40">
                  <p>Target Qty: <span className="font-semibold text-slate-800">{rfq.quantity} units</span></p>
                  <p>Unit Bid: <span className="font-semibold text-slate-800">{formatCurrency(quotation.price)}</span></p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block mb-2">Proposal Remarks / Notes</span>
              <div className="rounded-lg border border-brand-border bg-slate-50/30 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {quotation.notes || 'No remarks provided.'}
              </div>
            </div>

            <div className="mt-6 border-t border-brand-border pt-4 flex gap-3 text-xs text-brand-muted">
              <p>Submitted: {formatDate(quotation.createdAt)}</p>
              <span>·</span>
              <p>Last Updated: {formatDate(quotation.updatedAt)}</p>
            </div>
          </Card>
        </div>

        {/* Right Column: RFQ Summary */}
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-brand-sidebar to-slate-900 text-white border-0 shadow-lg">
            <span className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
              Procurement RFQ Reference
            </span>
            <h3 className="mt-3 text-xl font-bold tracking-tight">{rfq?.title || 'RFQ Reference'}</h3>
            <p className="mt-2 text-sm text-slate-300/95 leading-relaxed">
              {rfq?.description || 'No additional specifications provided.'}
            </p>
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-white uppercase">{rfq?.status || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Quantity</span>
                <span className="font-semibold text-white">{rfq?.quantity || 0} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Response Deadline</span>
                <span className="font-semibold text-cyan-300">{formatDate(rfq?.deadline)}</span>
              </div>
            </div>
            {rfq?.attachment && (
              <div className="mt-5 rounded-lg bg-white/5 p-3 text-xs border border-white/10 flex items-center justify-between">
                <span className="text-slate-300 truncate mr-2">📎 {rfq.attachment.split('/').pop()}</span>
                <a
                  href={`http://127.0.0.1:5000${rfq.attachment}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-primary bg-white px-2.5 py-1 rounded hover:bg-slate-100 transition-colors shrink-0"
                >
                  Download
                </a>
              </div>
            )}
          </Card>
          <Button variant="outline" className="w-full py-2.5" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </>
  );
}

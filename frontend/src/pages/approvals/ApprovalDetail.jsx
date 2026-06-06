import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import Stepper from '../../components/ui/Stepper.jsx';
import { useApprovalDetail, useUpdateApproval } from '../../hooks/useApprovals.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

const statusTone = { PENDING: 'amber', APPROVED: 'green', REJECTED: 'slate' };

export default function ApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useApprovalDetail(id);
  const mutation = useUpdateApproval();
  const [remarks, setRemarks] = useState('');
  const approval = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!approval) return <p className="py-10 text-center text-brand-muted">Approval not found.</p>;

  const q = approval.quotationId;

  const handleDecision = (status) => {
    mutation.mutate({ id, data: { status, remarks } }, { onSuccess: () => navigate('/approvals') });
  };

  const steps = [
    { label: 'Created', done: true },
    { label: 'Submitted', done: true },
    { label: 'Pending Approval', done: approval.status !== 'PENDING' || approval.status === 'PENDING' },
    { label: approval.status === 'REJECTED' ? 'Rejected' : 'Approved', done: ['APPROVED', 'REJECTED'].includes(approval.status) },
  ];

  return (
    <>
      <PageHeader title="Approval Detail" />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold">{q?.rfqId?.title || approval.rfqId?.title || 'Quotation'}</h2>
            <Badge tone={statusTone[approval.status]}>{approval.status}</Badge>
          </div>
          <div className="mt-3 grid gap-1 text-sm text-brand-muted">
            <p>Vendor: <span className="font-medium text-slate-900">{q?.vendorId?.name || '—'}</span></p>
            <p>Price: <span className="font-medium text-slate-900">{formatCurrency(q?.price)}</span></p>
            <p>Delivery: <span className="font-medium text-slate-900">{q?.deliveryDays} days</span></p>
            <p>Quantity: <span className="font-medium text-slate-900">{q?.rfqId?.quantity || approval.rfqId?.quantity || '—'}</span></p>
            <p>Total: <span className="font-medium text-slate-900">{formatCurrency(q?.price * (q?.rfqId?.quantity || 1))}</span></p>
            {q?.notes && <p>Notes: <span className="text-slate-700">{q.notes}</span></p>}
          </div>
          {approval.status === 'PENDING' && (
            <>
              <textarea
                className="mt-4 min-h-28 w-full rounded border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100"
                placeholder="Remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              <div className="mt-4 flex gap-3">
                <Button variant="success" onClick={() => handleDecision('APPROVED')} disabled={mutation.isPending}>
                  {mutation.isPending ? <Spinner /> : 'Approve'}
                </Button>
                <Button variant="danger" onClick={() => handleDecision('REJECTED')} disabled={mutation.isPending}>
                  Reject
                </Button>
              </div>
            </>
          )}
          {approval.remarks && approval.status !== 'PENDING' && (
            <div className="mt-4 rounded bg-slate-50 p-3 text-sm">
              <p className="font-medium">Decision Remarks:</p>
              <p className="text-brand-muted">{approval.remarks}</p>
            </div>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="mb-4 font-semibold">Workflow</h3>
          <Stepper steps={steps} />
        </Card>
      </div>
    </>
  );
}

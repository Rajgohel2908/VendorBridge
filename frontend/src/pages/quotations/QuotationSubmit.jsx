import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useRFQDetail } from '../../hooks/useRFQ.js';
import { useCreateQuotation, useUpdateQuotation } from '../../hooks/useQuotations.js';
import { quotationService } from '../../services/quotationService.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function QuotationSubmit() {
  const { id: rfqId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const navigate = useNavigate();
  const { data: rfqData, isLoading: loadingRFQ } = useRFQDetail(rfqId);
  const rfq = rfqData?.data;
  const createMutation = useCreateQuotation();
  const updateMutation = useUpdateQuotation();
  const mutation = isEditMode ? updateMutation : createMutation;
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const price = watch('price');

  // Pre-fill form when editing
  useEffect(() => {
    if (editId) {
      quotationService.detail(editId).then((res) => {
        const q = res.data?.data;
        if (q) {
          reset({ price: q.price, deliveryDays: q.deliveryDays, notes: q.notes || '' });
        }
      });
    }
  }, [editId, reset]);

  const onSubmit = (data) => {
    const payload = { price: Number(data.price), deliveryDays: Number(data.deliveryDays), notes: data.notes };
    if (isEditMode) {
      updateMutation.mutate(
        { id: editId, data: payload },
        { onSuccess: () => navigate('/quotations') },
      );
    } else {
      createMutation.mutate(
        { rfqId, ...payload },
        { onSuccess: () => navigate('/quotations') },
      );
    }
  };

  if (loadingRFQ) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <>
      <PageHeader title={isEditMode ? 'Edit Proposal' : 'Submit Quotation'} description="Provide your pricing, delivery timeline, and notes for this procurement request." />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Left Column: RFQ Specifications */}
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-br from-brand-sidebar to-slate-900 text-white border-0 shadow-lg">
            <span className="inline-block rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
              Procurement Spec
            </span>
            <h2 className="mt-3 text-xl font-bold tracking-tight">{rfq?.title || 'RFQ Reference'}</h2>
            <p className="mt-2 text-sm text-slate-300/90 leading-relaxed">
              {rfq?.description || 'No additional specifications provided.'}
            </p>
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
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
        </div>

        {/* Right Column: Bid Proposal Form */}
        <Card className="p-6">
          <h3 className="mb-5 text-base font-bold text-slate-800 border-b border-brand-border pb-3">Your Bid Details</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Unit Price ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price', { required: 'Unit price is required', valueAsNumber: true, min: { value: 0.01, message: 'Price must be greater than 0' } })}
              />
              <Input
                label="Estimated Delivery (Days)"
                type="number"
                placeholder="e.g. 14"
                error={errors.deliveryDays?.message}
                {...register('deliveryDays', { required: 'Delivery days required', valueAsNumber: true, min: { value: 1, message: 'Must be at least 1 day' } })}
              />
            </div>

            {price > 0 && rfq?.quantity && (
              <div className="rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">Total Proposal Value</span>
                  <p className="text-2xl font-bold text-brand-primary leading-tight">
                    {formatCurrency(price * rfq.quantity)}
                  </p>
                </div>
                <div className="text-right text-xs text-brand-muted">
                  <p>Quantity: {rfq.quantity} units</p>
                  <p>Unit Cost: {formatCurrency(price)}</p>
                </div>
              </div>
            )}

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Proposal Remarks / Notes</span>
              <textarea
                className="min-h-28 w-full rounded-md border border-brand-border bg-white/85 px-3 py-2.5 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
                placeholder="Include key terms, shipping estimates, warranty, or comments..."
                {...register('notes')}
              />
            </label>

            <div className="flex items-center gap-3 border-t border-brand-border pt-4">
              <Button variant="blue" type="submit" disabled={mutation.isPending} className="px-6 py-2.5 shadow-md shadow-brand-primary/10">
                {mutation.isPending ? <><Spinner /> Submitting…</> : isEditMode ? 'Update Proposal' : 'Submit Proposal'}
              </Button>
              <Button variant="outline" type="button" onClick={() => navigate(-1)} className="px-6 py-2.5">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

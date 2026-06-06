import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useRFQDetail } from '../../hooks/useRFQ.js';
import { useCreateQuotation } from '../../hooks/useQuotations.js';
import { formatDate } from '../../utils/formatDate.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function QuotationSubmit() {
  const { id: rfqId } = useParams();
  const navigate = useNavigate();
  const { data: rfqData, isLoading: loadingRFQ } = useRFQDetail(rfqId);
  const rfq = rfqData?.data;
  const mutation = useCreateQuotation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const price = watch('price');

  const onSubmit = (data) => {
    mutation.mutate(
      { rfqId, price: Number(data.price), deliveryDays: Number(data.deliveryDays), notes: data.notes },
      { onSuccess: () => navigate('/quotations') },
    );
  };

  if (loadingRFQ) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <>
      <PageHeader title="Submit Quotation" />
      <Card className="mb-4 bg-slate-50 p-4">
        <h2 className="font-semibold">{rfq?.title || 'RFQ'}</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Quantity {rfq?.quantity} · Deadline {formatDate(rfq?.deadline)}
        </p>
      </Card>
      <Card className="max-w-2xl p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <Input label="Unit Price ($)" type="number" error={errors.price?.message} {...register('price', { required: 'Price is required', valueAsNumber: true })} />
          {price > 0 && rfq?.quantity && (
            <p className="rounded bg-blue-50 px-3 py-2 text-sm text-brand-primary">
              Total: {formatCurrency(price * rfq.quantity)} ({rfq.quantity} × {formatCurrency(price)})
            </p>
          )}
          <Input label="Delivery Days" type="number" error={errors.deliveryDays?.message} {...register('deliveryDays', { required: 'Required', valueAsNumber: true })} />
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
            <textarea className="min-h-24 w-full rounded border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" {...register('notes')} />
          </label>
          <Button variant="blue" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <><Spinner /> Submitting…</> : 'Submit Quotation'}
          </Button>
        </form>
      </Card>
    </>
  );
}

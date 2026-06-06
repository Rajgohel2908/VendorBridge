import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { usePODetail } from '../../hooks/usePurchaseOrders.js';
import { useCreateInvoice } from '../../hooks/useInvoices.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

export default function PODetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = usePODetail(id);
  const invoiceMutation = useCreateInvoice();
  const po = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!po) return <p className="py-10 text-center text-brand-muted">Purchase order not found.</p>;

  const handleGenInvoice = () => {
    invoiceMutation.mutate({ poId: po._id }, { onSuccess: (res) => navigate(`/invoices/${res.data.data._id}`) });
  };

  return (
    <>
      <PageHeader
        title={po.poNumber}
        action={
          <Button variant="blue" onClick={handleGenInvoice} disabled={invoiceMutation.isPending}>
            {invoiceMutation.isPending ? <Spinner /> : 'Generate Invoice'}
          </Button>
        }
      />
      <Card className="p-6">
        <div className="mb-5 flex flex-wrap justify-between gap-4">
          <div>
            <p className="font-semibold">VendorBridge</p>
            <p className="text-sm text-brand-muted">Procurement Office</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{po.vendorId?.name}</p>
            <p className="text-sm text-brand-muted">{formatDate(po.createdAt)}</p>
          </div>
        </div>
        <div className="overflow-x-auto rounded border border-brand-border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600"><tr>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Description</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold text-right">Qty</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold text-right">Unit Price</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold text-right">Total</th>
            </tr></thead>
            <tbody>
              {po.items?.map((item, i) => (
                <tr key={i} className="odd:bg-white even:bg-slate-50">
                  <td className="border-b border-brand-border px-4 py-3">{item.description}</td>
                  <td className="border-b border-brand-border px-4 py-3 text-right">{item.quantity}</td>
                  <td className="border-b border-brand-border px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border-b border-brand-border px-4 py-3 text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 text-right text-sm">
          <p>Subtotal: {formatCurrency(po.subtotal)}</p>
          <p>GST 18%: {formatCurrency(po.taxAmount)}</p>
          <p className="mt-1 text-lg font-semibold">Total: {formatCurrency(po.totalAmount)}</p>
        </div>
      </Card>
    </>
  );
}

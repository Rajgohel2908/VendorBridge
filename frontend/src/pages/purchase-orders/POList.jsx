import { Link } from 'react-router-dom';
import { Building2, ReceiptText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { usePurchaseOrders } from '../../hooks/usePurchaseOrders.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function POList() {
  const { data, isLoading } = usePurchaseOrders();
  const pos = data?.data || [];

  return (
    <>
      <PageHeader title="Purchase Orders" description="Review issued commitments, vendor assignments, and order totals." />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : pos.length === 0 ? (
        <Card className="p-10 text-center text-brand-muted">No purchase orders yet.</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pos.map((po) => (
            <Link to={`/purchase-orders/${po._id}`} key={po._id}>
              <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-brand-success ring-1 ring-emerald-200">
                    <ReceiptText size={18} />
                  </span>
                  <Badge tone="blue">{po.status}</Badge>
                </div>
                <h2 className="mt-4 font-bold text-brand-ink">{po.poNumber}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-brand-muted"><Building2 size={15} /> {po.vendorId?.name || '-'}</p>
                <p className="mt-4 text-2xl font-bold text-brand-ink">{formatCurrency(po.totalAmount)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

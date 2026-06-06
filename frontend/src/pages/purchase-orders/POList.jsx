import { Link } from 'react-router-dom';
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
      <PageHeader title="Purchase Orders" />
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : pos.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No purchase orders yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pos.map((po) => (
            <Link to={`/purchase-orders/${po._id}`} key={po._id}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <h2 className="font-semibold">{po.poNumber}</h2>
                <p className="mt-1 text-sm text-brand-muted">{po.vendorId?.name || '—'} · {formatCurrency(po.totalAmount)}</p>
                <Badge tone="blue" className="mt-2">{po.status}</Badge>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

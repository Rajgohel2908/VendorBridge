import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import { useRFQDetail, useRFQQuotations } from '../../hooks/useRFQ.js';
import { useApprovals } from '../../hooks/useApprovals.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import api from '../../services/api.js';

export default function QuotationComparison() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: rfqData } = useRFQDetail(id);
  const { data: quotData, isLoading } = useRFQQuotations(id);
  const rfq = rfqData?.data;
  const rawQuotations = quotData?.data || [];

  // Sorting state
  const [sortField, setSortField] = useState('price');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortArrow = (field) => {
    if (sortField !== field) return '';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const quotations = useMemo(() => {
    const sorted = [...rawQuotations];
    sorted.sort((a, b) => {
      const valA = sortField === 'price' ? a.price : a.deliveryDays;
      const valB = sortField === 'price' ? b.price : b.deliveryDays;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
    return sorted;
  }, [rawQuotations, sortField, sortDir]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const lowestPrice = quotations.length ? Math.min(...quotations.map((q) => q.price)) : 0;
  const fastestDelivery = quotations.length ? Math.min(...quotations.map((q) => q.deliveryDays)) : 0;

  const handleSelect = async (quotation) => {
    try {
      await api.post('/approvals', {
        quotationId: quotation._id,
        rfqId: id,
        status: 'PENDING',
      });
      navigate('/rfq');
    } catch (err) {
      alert('Failed to submit for approval');
    }
  };

  const { data: approvalsData } = useApprovals();
  const rfqApprovals = approvalsData?.data?.filter((a) => a.rfqId?._id === id || a.rfqId === id) || [];
  const hasPendingOrApproved = rfqApprovals.some((a) => a.status === 'PENDING' || a.status === 'APPROVED');

  return (
    <>
      <PageHeader title="Quotation Comparison" description="Side-by-side vendor comparison." />
      <Card className="mb-4 p-4 text-sm text-brand-muted">
        {rfq?.title} · Quantity {rfq?.quantity} · Deadline {new Date(rfq?.deadline).toLocaleDateString()}
      </Card>
      {quotations.length === 0 ? (
        <Card className="p-6 text-center text-brand-muted">No quotations submitted yet.</Card>
      ) : (
        <div className="overflow-x-auto rounded border border-brand-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Criteria</th>
                {quotations.map((q) => (
                  <th key={q._id} className={`border-b border-brand-border px-4 py-3 font-semibold ${q.price === lowestPrice ? 'bg-green-50' : ''}`}>
                    {q.vendorId?.name || 'Vendor'}
                    {q.price === lowestPrice && <Badge tone="green" className="ml-2">Lowest</Badge>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Vendor Rating Row */}
              <tr>
                <td className="border-b border-brand-border px-4 py-3 font-medium">Vendor Rating</td>
                {quotations.map((q) => (
                  <td key={q._id} className="border-b border-brand-border px-4 py-3">
                    <StarRating value={q.vendorId?.performanceRating || 0} />
                  </td>
                ))}
              </tr>
              {/* Unit Price — sortable */}
              <tr>
                <td
                  className="border-b border-brand-border px-4 py-3 font-medium cursor-pointer select-none hover:text-brand-primary"
                  onClick={() => toggleSort('price')}
                >
                  Unit Price{sortArrow('price')}
                </td>
                {quotations.map((q) => (
                  <td key={q._id} className={`border-b border-brand-border px-4 py-3 ${q.price === lowestPrice ? 'bg-green-50 font-semibold text-brand-success' : ''}`}>
                    {formatCurrency(q.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-brand-border px-4 py-3 font-medium">Grand Total</td>
                {quotations.map((q) => (
                  <td key={q._id} className={`border-b border-brand-border px-4 py-3 ${q.price === lowestPrice ? 'bg-green-50 font-semibold' : ''}`}>
                    {formatCurrency(q.price * (rfq?.quantity || 1))}
                  </td>
                ))}
              </tr>
              {/* Delivery — sortable */}
              <tr>
                <td
                  className="border-b border-brand-border px-4 py-3 font-medium cursor-pointer select-none hover:text-brand-primary"
                  onClick={() => toggleSort('deliveryDays')}
                >
                  Delivery (days){sortArrow('deliveryDays')}
                </td>
                {quotations.map((q) => (
                  <td key={q._id} className={`border-b border-brand-border px-4 py-3 ${q.deliveryDays === fastestDelivery ? 'bg-blue-50 font-semibold text-brand-primary' : ''}`}>
                    {q.deliveryDays}
                    {q.deliveryDays === fastestDelivery && <Badge tone="blue" className="ml-2">Fastest</Badge>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b border-brand-border px-4 py-3 font-medium">Notes</td>
                {quotations.map((q) => (
                  <td key={q._id} className="border-b border-brand-border px-4 py-3 text-brand-muted">{q.notes || '—'}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Actions</td>
                {quotations.map((q) => (
                  <td key={q._id} className="px-4 py-3">
                    <Button variant="outline" onClick={() => handleSelect(q)} disabled={rfq?.status === 'CLOSED' || hasPendingOrApproved}>
                      {rfq?.status === 'CLOSED' || hasPendingOrApproved ? 'Requested' : 'Select'}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

import { useQuery } from '@tanstack/react-query';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import SpendingChart from '../../components/reports/SpendingChart.jsx';
import VendorPerformanceChart from '../../components/reports/VendorPerformanceChart.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Reports() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.get('/reports').then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const report = data?.data || {};
  const summary = report.summary || {};

  return (
    <>
      <PageHeader title="Reports" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-brand-primary p-4">
          <p className="text-3xl font-semibold">{formatCurrency(summary.totalSpend)}</p>
          <p className="mt-1 text-sm text-brand-muted">Total Spend</p>
        </Card>
        <Card className="border-l-4 border-l-brand-success p-4">
          <p className="text-3xl font-semibold">{summary.totalPOs ?? 0}</p>
          <p className="mt-1 text-sm text-brand-muted">POs Generated</p>
        </Card>
        <Card className="border-l-4 border-l-slate-600 p-4">
          <p className="text-3xl font-semibold">{summary.activeVendors ?? 0}</p>
          <p className="mt-1 text-sm text-brand-muted">Active Vendors</p>
        </Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Monthly Trend</h2>
          <SpendingChart data={report.monthlyTrend || []} />
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Vendor Performance</h2>
          <VendorPerformanceChart data={report.deliveryPerformance || []} />
        </Card>
      </div>
      {report.vendorPerformance?.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded border border-brand-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600"><tr>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Vendor</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Orders</th>
              <th className="border-b border-brand-border px-4 py-3 font-semibold">Spend</th>
            </tr></thead>
            <tbody>
              {report.vendorPerformance.map((v) => (
                <tr key={v._id} className="odd:bg-white even:bg-slate-50">
                  <td className="border-b border-brand-border px-4 py-3 font-medium">{v.name}</td>
                  <td className="border-b border-brand-border px-4 py-3">{v.totalOrders}</td>
                  <td className="border-b border-brand-border px-4 py-3">{formatCurrency(v.totalSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

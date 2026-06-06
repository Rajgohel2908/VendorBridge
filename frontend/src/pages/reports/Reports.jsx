import PageHeader from '../../components/layout/PageHeader.jsx';
import SpendingChart from '../../components/reports/SpendingChart.jsx';
import VendorPerformanceChart from '../../components/reports/VendorPerformanceChart.jsx';
import StatsCard from '../../components/dashboard/StatsCard.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';

const rows = [{ Vendor: 'Acme Supplies', Orders: 8, Spend: '$42,000' }];

export default function Reports() {
  return (
    <>
      <PageHeader title="Reports" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Total Spend This Month" value="$24k" />
        <StatsCard label="POs Generated" value="18" accent="green" />
        <StatsCard label="Active Vendors" value="32" accent="slate" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-4"><h2 className="mb-3 font-semibold">Monthly Trend</h2><SpendingChart /></Card>
        <Card className="p-4"><h2 className="mb-3 font-semibold">Vendor Performance</h2><VendorPerformanceChart /></Card>
      </div>
      <div className="mt-5">
        <Table columns={['Vendor', 'Orders', 'Spend']} rows={rows} />
      </div>
    </>
  );
}

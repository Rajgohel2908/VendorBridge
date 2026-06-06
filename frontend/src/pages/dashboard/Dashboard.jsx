import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import RecentInvoices from '../../components/dashboard/RecentInvoices.jsx';
import RecentPOs from '../../components/dashboard/RecentPOs.jsx';
import StatsCard from '../../components/dashboard/StatsCard.jsx';

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Overview of procurement activity." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Active RFQs" value="12" accent="blue" />
        <StatsCard label="Pending Approvals" value="5" accent="amber" />
        <StatsCard label="Purchase Orders" value="18" accent="green" />
        <StatsCard label="Invoices" value="9" accent="slate" />
      </div>
      <div className="mt-4">
        <QuickActions />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Recent Purchase Orders</h2>
          <RecentPOs />
        </Card>
        <Card className="p-4">
          <h2 className="mb-3 font-semibold">Recent Invoices</h2>
          <RecentInvoices />
        </Card>
      </div>
    </>
  );
}

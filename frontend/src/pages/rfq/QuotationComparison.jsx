import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import ComparisonTable from '../../components/quotations/ComparisonTable.jsx';

export default function QuotationComparison() {
  return (
    <>
      <PageHeader title="Quotation Comparison" description="Side-by-side vendor comparison." />
      <Card className="mb-4 p-4 text-sm text-brand-muted">Laptop procurement · Quantity 50 · Deadline 2026-06-20</Card>
      <ComparisonTable />
    </>
  );
}

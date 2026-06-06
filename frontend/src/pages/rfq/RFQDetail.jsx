import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';

export default function RFQDetail() {
  return (
    <>
      <PageHeader title="RFQ Detail" />
      <Card className="p-4">
        <h2 className="font-semibold">Laptop procurement</h2>
        <p className="mt-2 text-sm text-brand-muted">Quantity: 50 · Deadline: 2026-06-20 · Status: OPEN</p>
      </Card>
    </>
  );
}

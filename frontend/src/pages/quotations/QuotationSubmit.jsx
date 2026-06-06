import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import QuotationForm from '../../components/quotations/QuotationForm.jsx';

export default function QuotationSubmit() {
  return (
    <>
      <PageHeader title="Submit Quotation" />
      <Card className="mb-4 bg-slate-50 p-4">
        <h2 className="font-semibold">Laptop procurement</h2>
        <p className="mt-1 text-sm text-brand-muted">Quantity 50 · Deadline 2026-06-20</p>
      </Card>
      <Card className="max-w-2xl p-4">
        <QuotationForm />
      </Card>
    </>
  );
}

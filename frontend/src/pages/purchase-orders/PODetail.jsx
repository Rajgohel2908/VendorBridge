import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Table from '../../components/ui/Table.jsx';

const rows = [{ Description: 'Laptops', Quantity: 50, 'Unit Price': '$240', Total: '$12,000' }];

export default function PODetail() {
  return (
    <>
      <PageHeader title="PO-2026-0001" action={<Button variant="blue">Generate Invoice</Button>} />
      <Card className="p-6">
        <div className="mb-5 flex justify-between">
          <div><p className="font-semibold">VendorBridge</p><p className="text-sm text-brand-muted">Procurement Office</p></div>
          <div className="text-right"><p className="font-semibold">Acme Supplies</p><p className="text-sm text-brand-muted">2026-06-03</p></div>
        </div>
        <Table columns={['Description', 'Quantity', 'Unit Price', 'Total']} rows={rows} />
        <div className="mt-5 text-right text-sm">
          <p>Subtotal: $12,000</p>
          <p>GST 18%: $2,160</p>
          <p className="text-lg font-semibold">Total: $14,160</p>
        </div>
      </Card>
    </>
  );
}

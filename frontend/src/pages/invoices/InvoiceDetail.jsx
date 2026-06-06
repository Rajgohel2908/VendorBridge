import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

export default function InvoiceDetail() {
  return (
    <>
      <PageHeader
        title="INV-2026-0001"
        action={<div className="flex gap-2"><Button variant="outline">Download PDF</Button><Button variant="outline">Print</Button><Button variant="blue">Send via Email</Button></div>}
      />
      <Card className="p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">INVOICE</h2>
          <img src="/logo.svg" alt="VendorBridge" className="h-10 w-10" />
        </div>
        <div className="mt-6 text-sm text-brand-muted">
          <p>Vendor: Acme Supplies</p>
          <p>Subtotal: $12,000</p>
          <p>GST 18%: $2,160</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">Grand Total: $14,160</p>
        </div>
      </Card>
    </>
  );
}

import PageHeader from '../../components/layout/PageHeader.jsx';
import Table from '../../components/ui/Table.jsx';

const rows = [
  { Invoice: 'INV-2026-0001', Vendor: 'Acme Supplies', Total: '$14,160', Status: 'GENERATED' },
];

export default function InvoiceList() {
  return (
    <>
      <PageHeader title="Invoices" />
      <Table columns={['Invoice', 'Vendor', 'Total', 'Status']} rows={rows} />
    </>
  );
}

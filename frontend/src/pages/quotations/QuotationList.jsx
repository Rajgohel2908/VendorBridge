import PageHeader from '../../components/layout/PageHeader.jsx';
import Table from '../../components/ui/Table.jsx';

const rows = [
  { RFQ: 'Laptop procurement', Price: '$12,000', Status: 'SUBMITTED', Updated: '2026-06-03' },
  { RFQ: 'Office furniture', Price: '$5,600', Status: 'REVISED', Updated: '2026-06-01' },
];

export default function QuotationList() {
  return (
    <>
      <PageHeader title="Quotations" />
      <Table columns={['RFQ', 'Price', 'Status', 'Updated']} rows={rows} />
    </>
  );
}

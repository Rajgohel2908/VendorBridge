import Badge from '../ui/Badge.jsx';
import Table from '../ui/Table.jsx';

const rows = [
  { Vendor: 'Northline Traders', Amount: '$4,100', Status: <Badge tone="blue">GENERATED</Badge>, Date: '2026-06-03' },
  { Vendor: 'Prime Components', Amount: '$6,900', Status: <Badge tone="green">PAID</Badge>, Date: '2026-05-30' },
];

export default function RecentInvoices() {
  return <Table columns={['Vendor', 'Amount', 'Status', 'Date']} rows={rows} />;
}

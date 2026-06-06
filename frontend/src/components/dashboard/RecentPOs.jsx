import Badge from '../ui/Badge.jsx';
import Table from '../ui/Table.jsx';

const rows = [
  { Vendor: 'Acme Supplies', Amount: '$12,400', Status: <Badge tone="blue">GENERATED</Badge>, Date: '2026-06-02' },
  { Vendor: 'Metro Tools', Amount: '$8,750', Status: <Badge tone="green">COMPLETED</Badge>, Date: '2026-06-01' },
];

export default function RecentPOs() {
  return <Table columns={['Vendor', 'Amount', 'Status', 'Date']} rows={rows} />;
}

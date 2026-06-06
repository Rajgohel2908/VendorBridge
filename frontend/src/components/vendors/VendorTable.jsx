import Badge from '../ui/Badge.jsx';
import Table from '../ui/Table.jsx';

const rows = [
  {
    'Vendor Name': 'Acme Supplies',
    Category: 'Raw materials',
    'GST No.': '22AAAAA0000A1Z5',
    Contact: 'ops@acme.test',
    Status: <Badge tone="green">ACTIVE</Badge>,
    Actions: 'View',
  },
  {
    'Vendor Name': 'Metro Tools',
    Category: 'Equipment',
    'GST No.': '27BBBBB1111B2Z6',
    Contact: 'sales@metro.test',
    Status: <Badge tone="slate">INACTIVE</Badge>,
    Actions: 'View',
  },
];

export default function VendorTable() {
  return <Table columns={['Vendor Name', 'Category', 'GST No.', 'Contact', 'Status', 'Actions']} rows={rows} />;
}

import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Table from '../ui/Table.jsx';

const rows = [
  { Metric: 'Price', 'Acme Supplies': <span className="bg-green-50 px-2 py-1 text-brand-success">$12,000 <Badge tone="green">Lowest</Badge></span>, 'Metro Tools': '$13,400' },
  { Metric: 'Delivery Days', 'Acme Supplies': '15', 'Metro Tools': <span className="bg-blue-50 px-2 py-1 text-brand-primary">11 <Badge tone="blue">Fastest</Badge></span> },
  { Metric: 'Notes', 'Acme Supplies': 'Includes freight', 'Metro Tools': 'Stock ready' },
  { Metric: 'Actions', 'Acme Supplies': <Button variant="outline">Select</Button>, 'Metro Tools': <Button variant="outline">Select</Button> },
];

export default function ComparisonTable() {
  return <Table columns={['Metric', 'Acme Supplies', 'Metro Tools']} rows={rows} />;
}

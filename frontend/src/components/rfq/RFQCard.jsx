import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

export default function RFQCard({ title, deadline, vendors }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        <Badge tone="blue">OPEN</Badge>
      </div>
      <p className="mt-4 text-sm text-brand-muted">Deadline: {deadline}</p>
      <p className="mt-1 text-sm text-brand-muted">Vendors: {vendors}</p>
    </Card>
  );
}

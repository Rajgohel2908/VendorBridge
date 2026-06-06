import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

export default function POCard() {
  return (
    <Card className="p-4">
      <h2 className="font-semibold">PO-2026-0001</h2>
      <p className="text-sm text-brand-muted">Acme Supplies · $12,000</p>
      <Badge tone="blue">GENERATED</Badge>
    </Card>
  );
}

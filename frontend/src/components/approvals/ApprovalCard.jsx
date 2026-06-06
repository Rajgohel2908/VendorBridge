import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

export default function ApprovalCard() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">Laptop procurement</h2>
          <p className="text-sm text-brand-muted">Acme Supplies · $12,000 · submitted by Priya</p>
        </div>
        <Badge tone="amber">PENDING</Badge>
      </div>
    </Card>
  );
}

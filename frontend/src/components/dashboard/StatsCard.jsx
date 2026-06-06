import Card from '../ui/Card.jsx';

const accents = {
  blue: 'border-l-brand-primary',
  amber: 'border-l-brand-warning',
  green: 'border-l-brand-success',
  slate: 'border-l-slate-600',
};

export default function StatsCard({ label, value, accent = 'blue' }) {
  return (
    <Card className={`border-l-4 p-4 ${accents[accent]}`}>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-brand-muted">{label}</p>
    </Card>
  );
}

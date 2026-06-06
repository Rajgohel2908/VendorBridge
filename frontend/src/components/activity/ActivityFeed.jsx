const items = [
  { dot: 'bg-brand-primary', text: 'Created RFQ', actor: 'Priya', time: '10:30 AM' },
  { dot: 'bg-brand-warning', text: 'Approval requested', actor: 'Karan', time: '11:00 AM' },
  { dot: 'bg-brand-success', text: 'Invoice generated', actor: 'Aarav', time: '12:15 PM' },
];

export default function ActivityFeed() {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.text}-${item.time}`} className="flex gap-3">
          <span className={`mt-1 h-3 w-3 rounded-full ${item.dot}`} />
          <p className="text-sm">
            <span className="font-semibold">{item.text}</span>
            <span className="text-brand-muted"> by {item.actor} · {item.time}</span>
          </p>
        </div>
      ))}
    </div>
  );
}

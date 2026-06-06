import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';

export default function RFQForm() {
  return (
    <form className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="grid gap-4 p-4">
        <Input label="RFQ Title" placeholder="Laptop procurement" />
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
          <textarea className="min-h-28 w-full rounded border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Quantity" type="number" placeholder="50" />
          <Input label="Deadline" type="date" />
        </div>
        <div className="rounded border border-dashed border-brand-border p-6 text-center text-sm text-brand-muted">
          Drop attachment here
        </div>
      </Card>
      <Card className="p-4">
        <h2 className="mb-3 font-semibold">Vendor Assignment</h2>
        <Input placeholder="Search vendors" />
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-brand-primary">Acme Supplies x</span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-brand-primary">Metro Tools x</span>
        </div>
        <Button variant="blue" className="mt-5 w-full" type="button">Create RFQ</Button>
      </Card>
    </form>
  );
}

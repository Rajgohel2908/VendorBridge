import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Spinner from '../ui/Spinner.jsx';
import { useVendors } from '../../hooks/useVendors.js';

export default function RFQForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { data: vendorsData } = useVendors();
  const vendors = vendorsData?.data || [];
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [file, setFile] = useState(null);

  const toggleVendor = (id) => {
    setSelectedVendors((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  const submit = (data) => {
    const fd = new FormData();
    fd.append('title', data.title);
    fd.append('description', data.description);
    fd.append('quantity', data.quantity);
    fd.append('deadline', data.deadline);
    fd.append('vendors', JSON.stringify(selectedVendors));
    if (file) fd.append('attachment', file);
    onSubmit?.(fd);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase text-brand-muted">RFQ Details</h3>
        <div className="grid gap-4">
          <Input label="Title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
            <textarea className="min-h-28 w-full rounded border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" {...register('description')} />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Quantity" type="number" error={errors.quantity?.message} {...register('quantity', { required: 'Quantity is required', valueAsNumber: true })} />
            <Input label="Deadline" type="date" error={errors.deadline?.message} {...register('deadline', { required: 'Deadline is required' })} />
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Attachment</span>
            <input type="file" className="text-sm file:mr-3 file:rounded file:border-0 file:bg-brand-primary file:px-3 file:py-1.5 file:text-sm file:text-white" onChange={(e) => setFile(e.target.files[0])} />
          </label>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="mb-4 text-sm font-semibold uppercase text-brand-muted">Assign Vendors ({selectedVendors.length})</h3>
        {vendors.length === 0 ? <p className="text-sm text-brand-muted">No vendors available.</p> : (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {vendors.filter((v) => v.status === 'ACTIVE').map((v) => (
              <label key={v._id} className={`flex cursor-pointer items-center gap-3 rounded border p-3 text-sm transition-colors ${selectedVendors.includes(v._id) ? 'border-brand-primary bg-blue-50' : 'border-brand-border hover:bg-slate-50'}`}>
                <input type="checkbox" checked={selectedVendors.includes(v._id)} onChange={() => toggleVendor(v._id)} className="accent-brand-primary" />
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-brand-muted">{v.category} · {v.email}</p>
                </div>
              </label>
            ))}
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <Button variant="blue" type="submit" disabled={isLoading}>
            {isLoading ? <><Spinner /> Creating…</> : 'Create RFQ'}
          </Button>
        </div>
      </Card>
    </form>
  );
}

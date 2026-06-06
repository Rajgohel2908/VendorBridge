import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Upload, CheckSquare, Square } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Input from '../ui/Input.jsx';
import Spinner from '../ui/Spinner.jsx';
import { useVendors } from '../../hooks/useVendors.js';

export default function RFQForm({ onSubmit, isLoading, defaultValues }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { data: vendorsData } = useVendors();
  const vendors = vendorsData?.data || [];
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [file, setFile] = useState(null);
  const [vendorSearch, setVendorSearch] = useState('');

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title,
        description: defaultValues.description,
        quantity: defaultValues.quantity,
        deadline: defaultValues.deadline ? new Date(defaultValues.deadline).toISOString().split('T')[0] : '',
      });
      if (defaultValues.vendors) {
        const vendorIds = defaultValues.vendors.map((v) => typeof v === 'object' ? v._id : v);
        setSelectedVendors(vendorIds);
      }
    }
  }, [defaultValues, reset]);

  const toggleVendor = (id) => {
    setSelectedVendors((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  const activeVendors = vendors.filter((v) => v.status === 'ACTIVE');

  const filteredVendors = activeVendors.filter(
    (v) =>
      v.name?.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.category?.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleSelectAll = () => {
    setSelectedVendors(activeVendors.map((v) => v._id));
  };

  const handleClearAll = () => {
    setSelectedVendors([]);
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
    <form onSubmit={handleSubmit(submit)} className="grid gap-6 xl:grid-cols-[1fr_380px]">
      {/* Left Column: Details */}
      <Card className="p-6">
        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-brand-primary border-b border-brand-border pb-2">RFQ Details</h3>
        <div className="grid gap-5">
          <Input label="Title" placeholder="e.g. Server Hardware Procurement Q3" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Detailed Description</span>
            <textarea
              className="min-h-32 w-full rounded-md border border-brand-border bg-white/85 px-3 py-2.5 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
              placeholder="Provide technical specifications, quality standards, and shipping requirements..."
              {...register('description')}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Quantity Required" type="number" placeholder="e.g. 50" error={errors.quantity?.message} {...register('quantity', { required: 'Quantity is required', valueAsNumber: true, min: { value: 1, message: 'Must be at least 1' } })} />
            <Input label="Response Deadline" type="date" error={errors.deadline?.message} {...register('deadline', { required: 'Deadline is required' })} />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Attachment / Specifications Document</span>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-5 cursor-pointer hover:border-brand-primary hover:bg-slate-50/50 transition-colors">
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-slate-600">
                {file ? file.name : 'Click to upload document'}
              </span>
              <span className="text-xs text-slate-400 mt-1">PDF, Excel, Word, or Image (Max 5MB)</span>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold uppercase text-brand-muted">Assign Vendors ({selectedVendors.length})</h3>
          <div className="flex gap-2 text-xs">
            <button type="button" onClick={handleSelectAll} className="text-brand-primary hover:underline">Select All</button>
            <span className="text-slate-300">|</span>
            <button type="button" onClick={handleClearAll} className="text-brand-primary hover:underline">Clear</button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            className="w-full rounded border border-brand-border bg-white pl-9 pr-3 py-1.5 text-sm outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/10"
          />
        </div>

        {filteredVendors.length === 0 ? (
          <p className="text-sm text-brand-muted py-4 text-center">No matching vendors found.</p>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {filteredVendors.map((v) => (
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
            {isLoading ? (
              <><Spinner /> {defaultValues ? 'Saving…' : 'Creating…'}</>
            ) : (
              defaultValues ? 'Save Changes' : 'Create RFQ'
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}

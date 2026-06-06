import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Upload, CheckSquare, Square } from 'lucide-react';
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
  const [vendorSearch, setVendorSearch] = useState('');

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

      {/* Right Column: Vendors list */}
      <div className="space-y-4">
        <Card className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-primary">Assign Vendors</h3>
            <span className="rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-bold text-brand-primary">
              {selectedVendors.length} Selected
            </span>
          </div>

          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name or category..." 
              value={vendorSearch} 
              onChange={(e) => setVendorSearch(e.target.value)} 
              className="w-full rounded-md border border-brand-border pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            />
          </div>

          <div className="flex gap-2 mb-4 text-xs font-semibold">
            <button type="button" onClick={handleSelectAll} className="flex-1 rounded border border-brand-border py-1.5 hover:bg-slate-50 transition-colors text-slate-700">
              Select All
            </button>
            <button type="button" onClick={handleClearAll} className="flex-1 rounded border border-brand-border py-1.5 hover:bg-slate-50 transition-colors text-slate-700">
              Clear All
            </button>
          </div>

          {filteredVendors.length === 0 ? (
            <p className="text-sm text-brand-muted py-6 text-center bg-slate-50/50 rounded-lg">No active vendors found.</p>
          ) : (
            <div className="max-h-[320px] space-y-2.5 overflow-y-auto pr-1">
              {filteredVendors.map((v) => {
                const isSelected = selectedVendors.includes(v._id);
                return (
                  <label 
                    key={v._id} 
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm transition-all ${
                      isSelected 
                        ? 'border-brand-primary bg-blue-50/70 shadow-sm shadow-brand-primary/5' 
                        : 'border-brand-border hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => toggleVendor(v._id)} 
                      className="hidden" 
                    />
                    <div className="mt-0.5 shrink-0 text-brand-primary">
                      {isSelected ? <CheckSquare size={17} /> : <Square size={17} className="text-slate-400" />}
                    </div>
                    <div className="leading-tight flex-grow min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{v.name}</p>
                      <p className="text-xs text-brand-muted mt-1 truncate">{v.category} · {v.email}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          <div className="mt-6 border-t border-brand-border pt-4">
            <Button variant="blue" type="submit" disabled={isLoading || selectedVendors.length === 0} className="w-full py-2.5 shadow-md shadow-brand-primary/10">
              {isLoading ? <><Spinner /> Creating…</> : 'Publish RFQ'}
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
}

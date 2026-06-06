import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Spinner from '../ui/Spinner.jsx';
import StarRating from '../ui/StarRating.jsx';

export default function VendorForm({ defaultValues, onSubmit, isLoading }) {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm({ defaultValues });

  const submit = (data) => onSubmit?.(data);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-primary">Basic Information</h3>
            <div className="space-y-4">
              <Input label="Vendor Name" error={errors.name?.message} placeholder="e.g. Acme Corp" {...register('name', { required: 'Name is required' })} />
              <Input label="Category" error={errors.category?.message} placeholder="e.g. Raw Materials, Electronics" {...register('category', { required: 'Category is required' })} />
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-primary">GST & Tax Info</h3>
            <Input label="GST Number" placeholder="e.g. 22AAAAA0000A1Z5" {...register('gstNumber')} />
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-primary">Performance</h3>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Initial Rating / Review Score</label>
              <div className="inline-flex items-center rounded-lg border border-brand-border bg-white px-4 py-3">
                <Controller
                  name="performanceRating"
                  control={control}
                  defaultValue={defaultValues?.performanceRating || 0}
                  render={({ field }) => (
                    <StarRating value={field.value} onChange={field.onChange} size="text-2xl" />
                  )}
                />
              </div>
              <p className="mt-1.5 text-xs text-brand-muted">Used to rate supplier reliability and product quality.</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 shadow-sm h-full flex flex-col">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-brand-primary">Contact Details</h3>
            <div className="space-y-4 flex-grow">
              <Input label="Email Address" type="email" error={errors.email?.message} placeholder="vendor@example.com" {...register('email', { required: 'Email is required' })} />
              <Input label="Phone Number" placeholder="+91 98765 43210" {...register('phone')} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Physical Address</span>
                <textarea
                  className="min-h-[148px] w-full rounded-md border border-brand-border bg-white/85 px-3 py-2.5 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15"
                  placeholder="Street, City, State, ZIP, Country"
                  {...register('address')}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-brand-border pt-5">
        <Button variant="blue" type="submit" disabled={isLoading} className="px-6 py-2.5 shadow-md shadow-brand-primary/15">
          {isLoading ? <><Spinner /> Saving…</> : defaultValues ? 'Update Vendor' : 'Save Vendor'}
        </Button>
        <Button variant="outline" type="button" onClick={() => navigate(-1)} className="px-6 py-2.5">Cancel</Button>
      </div>
    </form>
  );
}

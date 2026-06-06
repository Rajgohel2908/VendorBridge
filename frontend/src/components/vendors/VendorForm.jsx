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
    <form onSubmit={handleSubmit(submit)} className="grid gap-5">
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">Basic Info</h3>
        <Input label="Vendor Name" error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        <Input label="Category" error={errors.category?.message} {...register('category', { required: 'Category is required' })} />
      </section>
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">GST & Legal</h3>
        <Input label="GST Number" {...register('gstNumber')} />
      </section>
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">Contact Details</h3>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Phone" {...register('phone')} />
        <Input label="Address" {...register('address')} />
      </section>
      <section className="grid gap-3">
        <h3 className="text-xs font-semibold uppercase text-brand-muted">Performance</h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
          <Controller
            name="performanceRating"
            control={control}
            defaultValue={defaultValues?.performanceRating || 0}
            render={({ field }) => (
              <StarRating value={field.value} onChange={field.onChange} size="text-2xl" />
            )}
          />
        </div>
      </section>
      <div className="flex gap-3">
        <Button variant="blue" type="submit" disabled={isLoading}>
          {isLoading ? <><Spinner /> Saving…</> : defaultValues ? 'Update Vendor' : 'Save Vendor'}
        </Button>
        <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </form>
  );
}

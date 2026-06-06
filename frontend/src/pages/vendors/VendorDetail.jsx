import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import VendorForm from '../../components/vendors/VendorForm.jsx';
import { useVendorDetail, useUpdateVendor } from '../../hooks/useVendors.js';

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useVendorDetail(id);
  const mutation = useUpdateVendor();
  const vendor = data?.data;

  const handleSubmit = (formData) => {
    mutation.mutate({ id, data: formData }, { onSuccess: () => navigate('/vendors') });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <>
      <PageHeader title="Vendor Detail" description="View and edit vendor record." />
      <Card className="max-w-2xl p-4">
        {vendor ? <VendorForm defaultValues={vendor} onSubmit={handleSubmit} isLoading={mutation.isPending} /> : <p className="text-brand-muted">Vendor not found.</p>}
      </Card>
    </>
  );
}

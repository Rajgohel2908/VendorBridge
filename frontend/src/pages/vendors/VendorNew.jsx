import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import VendorForm from '../../components/vendors/VendorForm.jsx';
import { useCreateVendor } from '../../hooks/useVendors.js';

export default function VendorNew() {
  const navigate = useNavigate();
  const mutation = useCreateVendor();

  const handleSubmit = (data) => {
    mutation.mutate(data, { onSuccess: () => navigate('/vendors') });
  };

  return (
    <>
      <PageHeader title="Add Vendor" />
      <Card className="max-w-2xl p-4">
        <VendorForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
      </Card>
    </>
  );
}

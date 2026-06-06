import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import RFQForm from '../../components/rfq/RFQForm.jsx';
import { useCreateRFQ } from '../../hooks/useRFQ.js';

export default function RFQNew() {
  const navigate = useNavigate();
  const mutation = useCreateRFQ();

  const handleSubmit = (formData) => {
    mutation.mutate(formData, { onSuccess: () => navigate('/rfq') });
  };

  return (
    <>
      <PageHeader title="Create RFQ" />
      <RFQForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
    </>
  );
}

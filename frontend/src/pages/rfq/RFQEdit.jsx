import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import RFQForm from '../../components/rfq/RFQForm.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useRFQDetail, useUpdateRFQ } from '../../hooks/useRFQ.js';

export default function RFQEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useRFQDetail(id);
  const mutation = useUpdateRFQ();

  const rfq = data?.data;

  const handleSubmit = (formData) => {
    mutation.mutate(
      { id, data: formData },
      { onSuccess: () => navigate(`/rfq/${id}`) }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!rfq) {
    return <p className="py-10 text-center text-brand-muted">RFQ not found.</p>;
  }

  return (
    <>
      <PageHeader title="Edit RFQ" />
      <RFQForm onSubmit={handleSubmit} defaultValues={rfq} isLoading={mutation.isPending} />
    </>
  );
}

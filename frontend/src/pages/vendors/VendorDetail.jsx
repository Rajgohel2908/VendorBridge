import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import VendorForm from '../../components/vendors/VendorForm.jsx';

export default function VendorDetail() {
  return (
    <>
      <PageHeader title="Vendor Detail" description="Vendor record and edit form." />
      <Card className="max-w-2xl p-4">
        <VendorForm />
      </Card>
    </>
  );
}

import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import VendorTable from '../../components/vendors/VendorTable.jsx';

export default function VendorList() {
  return (
    <>
      <PageHeader title="Vendor Management" action={<Link to="/vendors/new"><Button variant="blue">Add Vendor</Button></Link>} />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input placeholder="Search vendors" />
        <select className="rounded border border-brand-border px-3 py-2 text-sm"><option>All categories</option></select>
        <select className="rounded border border-brand-border px-3 py-2 text-sm"><option>All statuses</option></select>
      </div>
      <VendorTable />
    </>
  );
}

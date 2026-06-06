import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { useVendors } from '../../hooks/useVendors.js';

export default function VendorList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useVendors({ search, category: category || undefined, status: status || undefined });
  const vendors = data?.data || [];

  return (
    <>
      <PageHeader title="Vendor Management" action={<Link to="/vendors/new"><Button variant="blue">Add Vendor</Button></Link>} />
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input placeholder="Search vendors…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded border border-brand-border px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option>Raw Materials</option><option>Equipment</option><option>Office Supplies</option><option>Electronics</option><option>Logistics</option>
        </select>
        <select className="rounded border border-brand-border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
        </select>
      </div>
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : vendors.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-brand-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Vendor Name</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Category</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">GST No.</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Contact</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Status</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                  <td className="border-b border-brand-border px-4 py-3 font-medium">{v.name}</td>
                  <td className="border-b border-brand-border px-4 py-3">{v.category}</td>
                  <td className="border-b border-brand-border px-4 py-3 font-mono text-xs">{v.gstNumber || '—'}</td>
                  <td className="border-b border-brand-border px-4 py-3">{v.email}</td>
                  <td className="border-b border-brand-border px-4 py-3">
                    <Badge tone={v.status === 'ACTIVE' ? 'green' : 'slate'}>{v.status}</Badge>
                  </td>
                  <td className="border-b border-brand-border px-4 py-3">
                    <Link to={`/vendors/${v._id}`} className="text-sm text-brand-primary hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

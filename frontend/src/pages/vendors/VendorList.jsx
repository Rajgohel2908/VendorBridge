import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import StarRating from '../../components/ui/StarRating.jsx';
import Card from '../../components/ui/Card.jsx';
import { useVendors } from '../../hooks/useVendors.js';

const selectClass = 'rounded-md border border-brand-border bg-white/85 px-3 py-2.5 text-sm text-brand-ink outline-none transition focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15';

export default function VendorList() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const { data, isLoading } = useVendors({ search, category: category || undefined, status: status || undefined });
  const vendors = data?.data || [];

  return (
    <>
      <PageHeader
        title="Vendor Management"
        description="Search, review, and maintain vendor records with ratings, contacts, and status at a glance."
        action={<Link to="/vendors/new"><Button variant="blue"><Plus size={16} /> Add Vendor</Button></Link>}
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_190px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-9" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option>Raw Materials</option>
            <option>Equipment</option>
            <option>Office Supplies</option>
            <option>Electronics</option>
            <option>Logistics</option>
          </select>
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </Card>

      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : vendors.length === 0 ? (
        <Card className="p-10 text-center text-brand-muted">No vendors found.</Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/80 bg-white/90 shadow-[0_18px_45px_rgba(16,32,51,0.07)] ring-1 ring-slate-900/5">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-100/90 text-left text-slate-600">
              <tr>
                {['Vendor Name', 'Category', 'Rating', 'GST No.', 'Contact', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-b border-brand-border/70 transition hover:bg-blue-50/60">
                  <td className="px-4 py-3 font-semibold text-brand-ink">{v.name}</td>
                  <td className="px-4 py-3">{v.category}</td>
                  <td className="px-4 py-3"><StarRating value={v.performanceRating || 0} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{v.gstNumber || '-'}</td>
                  <td className="px-4 py-3 text-brand-muted">{v.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={v.status === 'ACTIVE' ? 'green' : 'slate'}>{v.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/vendors/${v._id}`} className="text-sm font-semibold text-brand-primary hover:underline">View</Link>
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

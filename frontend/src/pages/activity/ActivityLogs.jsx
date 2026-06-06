import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { activityService } from '../../services/activityService.js';
import { formatDateTime } from '../../utils/formatDate.js';

const entityColors = { RFQ: 'blue', QUOTATION: 'amber', APPROVAL: 'green', PO: 'slate', INVOICE: 'green', VENDOR: 'slate' };

// Map entity types to their frontend route paths
const entityRoutes = {
  RFQ: (id) => `/rfq/${id}`,
  QUOTATION: (id) => `/quotations`,
  APPROVAL: (id) => `/approvals/${id}`,
  PO: (id) => `/purchase-orders/${id}`,
  INVOICE: (id) => `/invoices/${id}`,
  VENDOR: (id) => `/vendors/${id}`,
};

export default function ActivityLogs() {
  const [entity, setEntity] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['activity', { entity: entity || undefined, page }],
    queryFn: () => activityService.list({ entity: entity || undefined, page, limit: 20 }).then((r) => r.data),
  });
  const logs = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <>
      <PageHeader title="Activity Logs" />
      <div className="mb-4 flex gap-3">
        <select className="rounded border border-brand-border px-3 py-2 text-sm" value={entity} onChange={(e) => { setEntity(e.target.value); setPage(1); }}>
          <option value="">All entities</option>
          <option value="RFQ">RFQ</option><option value="QUOTATION">Quotation</option>
          <option value="APPROVAL">Approval</option><option value="PO">PO</option>
          <option value="INVOICE">Invoice</option><option value="VENDOR">Vendor</option>
        </select>
      </div>
      {isLoading ? <div className="flex justify-center py-10"><Spinner /></div> : logs.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No activity logs found.</p>
      ) : (
        <>
          <Card className="mb-5 p-4">
            <div className="space-y-4">
              {logs.slice(0, 5).map((log) => (
                <div key={log._id} className="flex gap-3">
                  <span className={`mt-1 h-3 w-3 shrink-0 rounded-full bg-brand-${entityColors[log.entity] || 'primary'}`} />
                  <p className="text-sm">
                    <span className="font-semibold">{log.action}</span>
                    <span className="text-brand-muted"> by {log.userId?.name || '—'} · {formatDateTime(log.createdAt)}</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
          <div className="overflow-x-auto rounded border border-brand-border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600"><tr>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Timestamp</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">User</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Action</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Entity</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Record</th>
              </tr></thead>
              <tbody>
                {logs.map((log) => {
                  const route = entityRoutes[log.entity];
                  const linkTo = route && log.entityId ? route(log.entityId) : null;
                  return (
                    <tr key={log._id} className="odd:bg-white even:bg-slate-50">
                      <td className="border-b border-brand-border px-4 py-3">{formatDateTime(log.createdAt)}</td>
                      <td className="border-b border-brand-border px-4 py-3">{log.userId?.name || '—'}</td>
                      <td className="border-b border-brand-border px-4 py-3 font-medium">{log.action}</td>
                      <td className="border-b border-brand-border px-4 py-3"><Badge tone={entityColors[log.entity] || 'slate'}>{log.entity}</Badge></td>
                      <td className="border-b border-brand-border px-4 py-3">
                        {linkTo ? (
                          <Link to={linkTo} className="text-brand-primary hover:underline">View →</Link>
                        ) : (
                          <span className="text-brand-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-brand-muted">
            <span>Page {pagination.page} of {pagination.pages || 1}</span>
            <div className="flex gap-2">
              <button className="rounded border border-brand-border px-3 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
              <button className="rounded border border-brand-border px-3 py-1 disabled:opacity-50" disabled={page >= (pagination.pages || 1)} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

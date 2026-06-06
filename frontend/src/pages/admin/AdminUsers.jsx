import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import { adminService } from '../../services/adminService.js';

const roleTone = { ADMIN: 'slate', PROCUREMENT_OFFICER: 'blue', MANAGER: 'amber', VENDOR: 'green' };
const roleLabels = { ADMIN: 'Admin', PROCUREMENT_OFFICER: 'Procurement Officer', MANAGER: 'Manager', VENDOR: 'Vendor' };

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.listUsers().then((r) => r.data),
  });
  const users = data?.data || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data: payload }) => adminService.updateUser(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const [editingRole, setEditingRole] = useState(null);

  const handleRoleChange = (userId, newRole) => {
    updateMutation.mutate({ id: userId, data: { role: newRole } });
    setEditingRole(null);
  };

  const handleToggleStatus = (userId, currentIsActive) => {
    updateMutation.mutate({ id: userId, data: { isActive: !currentIsActive } });
  };

  return (
    <>
      <PageHeader title="User Management" description="Manage user accounts, roles and access." />
      {isLoading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : users.length === 0 ? (
        <p className="py-10 text-center text-brand-muted">No users found.</p>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100/90 text-left text-slate-600">
              <tr>
                <th className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">Name</th>
                <th className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">Email</th>
                <th className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">Role</th>
                <th className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">Status</th>
                <th className="border-b border-brand-border px-4 py-3 text-xs font-bold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-brand-border/70 transition hover:bg-blue-50/60">
                  <td className="px-4 py-3 font-semibold text-brand-ink">{u.name}</td>
                  <td className="px-4 py-3 text-brand-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    {editingRole === u._id ? (
                      <select
                        className="rounded-md border border-brand-border bg-white/85 px-2 py-1.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        defaultValue={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        onBlur={() => setEditingRole(null)}
                        autoFocus
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="VENDOR">Vendor</option>
                      </select>
                    ) : (
                      <Badge tone={roleTone[u.role]} className="cursor-pointer transition hover:scale-[1.02]" onClick={() => setEditingRole(u._id)}>
                        {roleLabels[u.role] || u.role}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.isActive !== false ? 'green' : 'slate'}>
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
                        u.isActive !== false
                          ? 'bg-red-50 text-red-700 ring-1 ring-red-100 hover:bg-red-100'
                          : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100'
                      }`}
                      onClick={() => handleToggleStatus(u._id, u.isActive !== false)}
                      disabled={updateMutation.isPending}
                    >
                      {u.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

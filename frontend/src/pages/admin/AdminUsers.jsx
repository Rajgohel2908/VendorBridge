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
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Name</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Email</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Role</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Status</th>
                <th className="border-b border-brand-border px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                  <td className="border-b border-brand-border px-4 py-3 font-medium">{u.name}</td>
                  <td className="border-b border-brand-border px-4 py-3 text-brand-muted">{u.email}</td>
                  <td className="border-b border-brand-border px-4 py-3">
                    {editingRole === u._id ? (
                      <select
                        className="rounded border border-brand-border px-2 py-1 text-sm"
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
                      <Badge tone={roleTone[u.role]} className="cursor-pointer" onClick={() => setEditingRole(u._id)}>
                        {roleLabels[u.role] || u.role}
                      </Badge>
                    )}
                  </td>
                  <td className="border-b border-brand-border px-4 py-3">
                    <Badge tone={u.isActive !== false ? 'green' : 'slate'}>
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="border-b border-brand-border px-4 py-3">
                    <button
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                        u.isActive !== false
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
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

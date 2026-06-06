import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { approvalService } from '../services/approvalService.js';

export const useApprovals = (params) =>
  useQuery({ queryKey: ['approvals', params], queryFn: () => approvalService.list(params).then((r) => r.data) });

export const useApprovalDetail = (id) =>
  useQuery({ queryKey: ['approvals', id], queryFn: () => approvalService.detail(id).then((r) => r.data), enabled: !!id });

export const useUpdateApproval = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => approvalService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['approvals'] }) });
};

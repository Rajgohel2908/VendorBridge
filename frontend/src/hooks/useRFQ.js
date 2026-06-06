import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rfqService } from '../services/rfqService.js';

export const useRFQs = () =>
  useQuery({ queryKey: ['rfq'], queryFn: () => rfqService.list().then((r) => r.data) });

export const useRFQDetail = (id) =>
  useQuery({ queryKey: ['rfq', id], queryFn: () => rfqService.detail(id).then((r) => r.data), enabled: !!id });

export const useRFQQuotations = (id) =>
  useQuery({ queryKey: ['rfq', id, 'quotations'], queryFn: () => rfqService.quotations(id).then((r) => r.data), enabled: !!id });

export const useCreateRFQ = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: rfqService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['rfq'] }) });
};

export const useUpdateRFQ = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => rfqService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['rfq'] }) });
};

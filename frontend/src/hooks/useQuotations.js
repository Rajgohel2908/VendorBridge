import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quotationService } from '../services/quotationService.js';

export const useQuotations = () =>
  useQuery({ queryKey: ['quotations'], queryFn: () => quotationService.list().then((r) => r.data) });

export const useCreateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: quotationService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }) });
};

export const useUpdateQuotation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => quotationService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['quotations'] }) });
};

export const useQuotationDetail = (id) =>
  useQuery({
    queryKey: ['quotations', id],
    queryFn: () => quotationService.detail(id).then((r) => r.data),
    enabled: !!id,
  });

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoiceService.js';

export const useInvoices = () =>
  useQuery({ queryKey: ['invoices'], queryFn: () => invoiceService.list().then((r) => r.data) });

export const useInvoiceDetail = (id) =>
  useQuery({ queryKey: ['invoices', id], queryFn: () => invoiceService.detail(id).then((r) => r.data), enabled: !!id });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: invoiceService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) });
};

export const useEmailInvoice = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => invoiceService.email(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }) });
};

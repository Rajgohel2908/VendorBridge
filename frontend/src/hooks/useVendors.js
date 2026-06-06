import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '../services/vendorService.js';

export const useVendors = (params) =>
  useQuery({ queryKey: ['vendors', params], queryFn: () => vendorService.list(params).then((r) => r.data) });

export const useVendorDetail = (id) =>
  useQuery({ queryKey: ['vendors', id], queryFn: () => vendorService.detail(id).then((r) => r.data), enabled: !!id });

export const useCreateVendor = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: vendorService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['vendors'] }) });
};

export const useUpdateVendor = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => vendorService.update(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['vendors'] }) });
};

export const useDeleteVendor = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id) => vendorService.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['vendors'] }) });
};

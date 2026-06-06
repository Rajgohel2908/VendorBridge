import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { poService } from '../services/poService.js';

export const usePurchaseOrders = () =>
  useQuery({ queryKey: ['purchase-orders'], queryFn: () => poService.list().then((r) => r.data) });

export const usePODetail = (id) =>
  useQuery({ queryKey: ['purchase-orders', id], queryFn: () => poService.detail(id).then((r) => r.data), enabled: !!id });

export const useCreatePO = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: poService.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }) });
};

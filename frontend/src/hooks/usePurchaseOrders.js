import { useQuery } from '@tanstack/react-query';
import { poService } from '../services/poService.js';

export const usePurchaseOrders = () => useQuery({ queryKey: ['purchase-orders'], queryFn: poService.list });

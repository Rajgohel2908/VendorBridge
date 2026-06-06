import { useQuery } from '@tanstack/react-query';
import { vendorService } from '../services/vendorService.js';

export const useVendors = (params) =>
  useQuery({ queryKey: ['vendors', params], queryFn: () => vendorService.list(params) });

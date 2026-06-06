import { useQuery } from '@tanstack/react-query';
import { quotationService } from '../services/quotationService.js';

export const useQuotations = () => useQuery({ queryKey: ['quotations'], queryFn: quotationService.list });

import { useQuery } from '@tanstack/react-query';
import { rfqService } from '../services/rfqService.js';

export const useRFQ = () => useQuery({ queryKey: ['rfq'], queryFn: rfqService.list });

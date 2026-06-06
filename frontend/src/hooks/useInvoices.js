import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../services/invoiceService.js';

export const useInvoices = () => useQuery({ queryKey: ['invoices'], queryFn: invoiceService.list });

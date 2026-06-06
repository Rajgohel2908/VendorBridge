import { useQuery } from '@tanstack/react-query';
import { approvalService } from '../services/approvalService.js';

export const useApprovals = () => useQuery({ queryKey: ['approvals'], queryFn: approvalService.list });

import api from './api.js';

export const approvalService = {
  list: (params) => api.get('/approvals', { params }),
  detail: (id) => api.get(`/approvals/${id}`),
  update: (id, payload) => api.put(`/approvals/${id}`, payload),
  create: (payload) => api.post('/approvals', payload),
};

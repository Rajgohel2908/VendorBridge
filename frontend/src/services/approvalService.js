import api from './api.js';

export const approvalService = {
  list: () => api.get('/approvals'),
  detail: (id) => api.get(`/approvals/${id}`),
  update: (id, payload) => api.put(`/approvals/${id}`, payload),
};

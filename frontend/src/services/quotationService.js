import api from './api.js';

export const quotationService = {
  list: () => api.get('/quotations'),
  create: (payload) => api.post('/quotations', payload),
  detail: (id) => api.get(`/quotations/${id}`),
  update: (id, payload) => api.put(`/quotations/${id}`, payload),
};

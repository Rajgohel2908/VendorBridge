import api from './api.js';

export const rfqService = {
  list: () => api.get('/rfq'),
  create: (payload) => api.post('/rfq', payload),
  detail: (id) => api.get(`/rfq/${id}`),
  update: (id, payload) => api.put(`/rfq/${id}`, payload),
  remove: (id) => api.delete(`/rfq/${id}`),
  quotations: (id) => api.get(`/rfq/${id}/quotations`),
};

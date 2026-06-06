import api from './api.js';

export const vendorService = {
  list: (params) => api.get('/vendors', { params }),
  create: (payload) => api.post('/vendors', payload),
  detail: (id) => api.get(`/vendors/${id}`),
  update: (id, payload) => api.put(`/vendors/${id}`, payload),
  remove: (id) => api.delete(`/vendors/${id}`),
};

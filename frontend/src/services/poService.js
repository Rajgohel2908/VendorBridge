import api from './api.js';

export const poService = {
  list: () => api.get('/purchase-orders'),
  create: (payload) => api.post('/purchase-orders', payload),
  detail: (id) => api.get(`/purchase-orders/${id}`),
};

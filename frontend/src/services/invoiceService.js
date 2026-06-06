import api from './api.js';

export const invoiceService = {
  list: () => api.get('/invoices'),
  create: (payload) => api.post('/invoices', payload),
  detail: (id) => api.get(`/invoices/${id}`),
  pdf: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  email: (id, payload) => api.post(`/invoices/${id}/email`, payload),
};

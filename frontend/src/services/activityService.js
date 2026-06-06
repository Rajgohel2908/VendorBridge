import api from './api.js';

export const activityService = {
  list: (params) => api.get('/activity', { params }),
};

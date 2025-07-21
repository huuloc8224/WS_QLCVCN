import axiosClient from './axiosClient';

const typejobApi = {
  getAll: () => axiosClient.get('/typejob'),

  create: (data) => {
    const { name } = data;
    if (!name || typeof name !== 'string' || name.length > 50) {
      throw new Error('Name must be a string and not exceed 50 characters');
    }
    return axiosClient.post('/typejob', { name });
  },

  update: (id, data) => {
    if (isNaN(parseInt(id, 10))) {
      throw new Error('Invalid typejob ID');
    }
    const { name } = data;
    if (!name || typeof name !== 'string' || name.length > 50) {
      throw new Error('Name must be a string and not exceed 50 characters');
    }
    return axiosClient.put(`/typejob/${id}`, { name });
  },

  delete: (id) => {
    if (isNaN(parseInt(id, 10))) {
      throw new Error('Invalid typejob ID');
    }
    return axiosClient.delete(`/typejob/${id}`);
  },
};

export default typejobApi;
import axiosClient from './axiosClient';

const logApi = {
  getAll: () => axiosClient.get('/logs'),
};

export default logApi;

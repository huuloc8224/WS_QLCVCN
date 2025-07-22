// frontend/src/api/jobApi.js
import axiosClient from './axiosClient';

const jobApi = {
  // Lấy toàn bộ công việc
  getAll: () => axiosClient.get('/job/jobs'),

  // Lọc công việc theo typejob ID
  getByTypejobId: (typejob) => {
    if (!typejob || isNaN(parseInt(typejob, 10))) {
      throw new Error('Typejob ID must be a valid number');
    }
    return axiosClient.get('/job/jobs/filter', {
      params: { typejob }
    });
  },

  // Lấy công việc theo tên loại công việc
  getByTypejobName: (name) => {
    if (!name || typeof name !== 'string') {
      throw new Error('Typejob name must be a non-empty string');
    }
    return axiosClient.get(`/job/jobs/type/name/${name}`);
  },

  // Tạo công việc mới
  create: ({ title, description, status, typejob, start_date, due_date }) => {
    if (!title || typeof title !== 'string' || title.length > 50) {
      throw new Error('Title must be a string and not exceed 50 characters');
    }
    if (description && typeof description !== 'string') {
      throw new Error('Description must be a string');
    }
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
      throw new Error('Invalid status');
    }
    if (isNaN(parseInt(typejob, 10))) {
      throw new Error('Typejob must be a valid number');
    }
    if (!start_date || isNaN(Date.parse(start_date))) {
      throw new Error('Invalid start date');
    }
    if (!due_date || isNaN(Date.parse(due_date))) {
      throw new Error('Invalid due date');
    }

    return axiosClient.post('/job/jobs', {
      title,
      description,
      status,
      typejob,
      start_date,
      due_date,
    });
  },

  // Cập nhật công việc
  update: (id, { title, description, status, typejob, start_date, due_date }) => {
    if (!id || isNaN(parseInt(id, 10))) {
      throw new Error('Invalid job ID');
    }
    if (title && (typeof title !== 'string' || title.length > 50)) {
      throw new Error('Title must be a string and not exceed 50 characters');
    }
    if (description && typeof description !== 'string') {
      throw new Error('Description must be a string');
    }
    if (status && !['todo', 'in_progress', 'done'].includes(status)) {
      throw new Error('Invalid status');
    }
    if (typejob && isNaN(parseInt(typejob, 10))) {
      throw new Error('Typejob must be a valid number');
    }
    if (!start_date || isNaN(Date.parse(start_date))) {
      throw new Error('Invalid start date');
    }
    if (!due_date || isNaN(Date.parse(due_date))) {
      throw new Error('Invalid due date');
    }

    return axiosClient.put(`/job/jobs/${id}`, {
      title,
      description,
      status,
      typejob,
      start_date,
      due_date,
    });
  },

  // Xoá công việc
  delete: (id) => {
    if (!id || isNaN(parseInt(id, 10))) {
      throw new Error('Invalid job ID');
    }
    return axiosClient.delete(`/job/jobs/${id}`);
  },
};

export default jobApi;

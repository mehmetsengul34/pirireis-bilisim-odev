import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: apiBase ? `${apiBase.replace(/\/$/, '')}/api` : '/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-changed'));
    }
    return Promise.reject(error);
  }
);

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (apiBase) {
    return `${apiBase.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
  }
  return path;
};

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('auth-changed'));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-changed'));
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  fetchMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const classroomService = {
  list: async () => {
    const response = await api.get('/classrooms');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/classrooms', data);
    return response.data;
  },
  getStudents: async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}/students`);
    return response.data;
  },
  addStudent: async (classroomId, studentData) => {
    const response = await api.post(`/classrooms/${classroomId}/students`, {
      ...studentData,
      classroom_id: classroomId
    });
    return response.data;
  },
  removeStudent: async (classroomId, studentId) => {
    const response = await api.delete(`/classrooms/${classroomId}/students/${studentId}`);
    return response.data;
  },
  delete: async (classroomId) => {
    const response = await api.delete(`/classrooms/${classroomId}`);
    return response.data;
  }
};

export const assignmentService = {
  list: async (classroomId = null) => {
    const params = classroomId ? { classroom_id: classroomId } : {};
    const response = await api.get('/assignments', { params });
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/assignments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  delete: async (assignmentId) => {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  }
};

export const submissionService = {
  submit: async (formData) => {
    const response = await api.post('/submissions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getByAssignment: async (assignmentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);
    return response.data;
  },
  grade: async (submissionId, grade, feedback) => {
    const response = await api.put(`/submissions/${submissionId}/grade`, {
      grade: parseInt(grade, 10),
      feedback
    });
    return response.data;
  }
};

export default api;

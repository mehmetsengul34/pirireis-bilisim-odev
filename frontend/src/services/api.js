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
  },
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  }
};

export const teacherService = {
  list: async () => {
    const response = await api.get('/auth/teachers');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/auth/teachers', data);
    return response.data;
  },
  delete: async (teacherId) => {
    const response = await api.delete(`/auth/teachers/${teacherId}`);
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
  uploadStudentsPdf: async (classroomId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/classrooms/${classroomId}/students/upload-pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

export const systemService = {
  getStatus: async () => {
    const response = await api.get('/system/status');
    return response.data;
  },
  downloadBackup: async () => {
    const response = await api.get('/system/backup', {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    link.setAttribute('download', `pirireis_lms_yedek_${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  restoreBackup: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/system/restore', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const examService = {
  getCurriculum: async () => {
    const response = await api.get('/exams/curriculum');
    return response.data;
  },
  generateQuestions: async (data) => {
    const response = await api.post('/exams/generate-questions', data);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/exams', data);
    return response.data;
  },
  list: async (classroomId = null) => {
    const params = classroomId ? { classroom_id: classroomId } : {};
    const response = await api.get('/exams', { params });
    return response.data;
  },
  getDetail: async (examId) => {
    const response = await api.get(`/exams/${examId}`);
    return response.data;
  },
  submit: async (examId, answers) => {
    const response = await api.post(`/exams/${examId}/submit`, { answers });
    return response.data;
  },
  getAnalytics: async (examId) => {
    const response = await api.get(`/exams/${examId}/analytics`);
    return response.data;
  },
  delete: async (examId) => {
    const response = await api.delete(`/exams/${examId}`);
    return response.data;
  },
  getQuestionBank: async (params = {}) => {
    const response = await api.get('/exams/question-bank', { params });
    return response.data;
  },
  createExamFromBank: async (data) => {
    const response = await api.post('/exams/question-bank/create-exam', data);
    return response.data;
  },
  deleteFromBank: async (questionId) => {
    const response = await api.delete(`/exams/question-bank/${questionId}`);
    return response.data;
  },
  updateBankQuestion: async (questionId, data) => {
    const response = await api.put(`/exams/question-bank/${questionId}`, data);
    return response.data;
  },
  auditQuestionGates: async (questionId) => {
    const response = await api.post(`/exams/question-bank/${questionId}/gate-audit`);
    return response.data;
  },
  bulkDeleteFromBank: async (questionIds) => {
    const response = await api.post('/exams/question-bank/bulk-delete', { question_ids: questionIds });
    return response.data;
  },
  uploadTrainingPdf: async (formData) => {
    const response = await api.post('/exams/training/upload-pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  getTrainingDocuments: async (subject = null) => {
    const params = subject && subject !== 'Tümü' ? { subject } : {};
    const response = await api.get('/exams/training/documents', { params });
    return response.data;
  },
  deleteTrainingDocument: async (docId) => {
    const response = await api.delete(`/exams/training/documents/${docId}`);
    return response.data;
  },
  // Otonom AI Ajanları & Sürekli Gelişim Servisleri
  getAgentStatus: async () => {
    const response = await api.get('/exams/agents/status');
    return response.data;
  },
  getAgentActivities: async (limit = 30) => {
    const response = await api.get('/exams/agents/activities', { params: { limit } });
    return response.data;
  },
  triggerAgentCycle: async (payload = {}) => {
    const response = await api.post('/exams/agents/run-cycle', payload);
    return response.data;
  },
  judgeQuestion: async (questionPayload, subject = 'Genel') => {
    const response = await api.post('/exams/agents/judge-question', questionPayload, { params: { subject } });
    return response.data;
  }
};

export const notificationService = {
  list: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  send: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  }
};

export const bilisimService = {
  getCurrentWeek: async () => {
    const res = await api.get('/bilisim/current-week');
    return res.data;
  },
  getStarterTemplates: async () => {
    const res = await api.get('/bilisim/starter-templates');
    return res.data;
  },
  listCourses: async () => {
    const res = await api.get('/bilisim/courses');
    return res.data;
  },
  createCourse: async (courseData, starterKey = null) => {
    const res = await api.post('/bilisim/courses', courseData, {
      params: starterKey ? { starter_key: starterKey } : {}
    });
    return res.data;
  },
  deleteCourse: async (courseId) => {
    const res = await api.delete(`/bilisim/courses/${courseId}`);
    return res.data;
  },
  getPlan: async (courseId) => {
    const res = await api.get(`/bilisim/courses/${courseId}/plan`);
    return res.data;
  },
  uploadPlan: async (courseId, formData) => {
    const res = await api.post(`/bilisim/courses/${courseId}/plan`, formData);
    return res.data;
  },
  uploadNewPlan: async (formData) => {
    const res = await api.post('/bilisim/upload-new-plan', formData);
    return res.data;
  },
  listModules: async (courseId) => {
    const res = await api.get(`/bilisim/courses/${courseId}/modules`);
    return res.data;
  },
  uploadModule: async (courseId, formData) => {
    const res = await api.post(`/bilisim/courses/${courseId}/modules`, formData);
    return res.data;
  },
  uploadNewModule: async (formData) => {
    const res = await api.post('/bilisim/upload-new-module', formData);
    return res.data;
  },
  deleteModule: async (courseId, moduleId) => {
    const res = await api.delete(`/bilisim/courses/${courseId}/modules/${moduleId}`);
    return res.data;
  },
  getMaterial: async (courseId, weekNumber) => {
    const res = await api.get(`/bilisim/courses/${courseId}/materials/${weekNumber}`);
    return res.data;
  },
  generateMaterial: async (courseId, weekNumber, payload = {}) => {
    const res = await api.post(`/bilisim/courses/${courseId}/generate/${weekNumber}`, payload);
    return res.data;
  },
  downloadFile: async (relativeUrl, fallbackFilename) => {
    try {
      const response = await api.get(relativeUrl, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream'
      });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fallbackFilename || 'belge');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
      return true;
    } catch (err) {
      console.warn('Blob indirme başarısız, doğrudan bağlantı deneniyor:', err);
      const fullUrl = getFileUrl(relativeUrl);
      window.open(fullUrl, '_blank');
      return false;
    }
  },
  getDownloadUrl: (materialId) => getFileUrl(`/api/bilisim/download-presentation/${materialId}`),
  getDailyPlanDownloadUrl: (materialId) => getFileUrl(`/api/bilisim/download-daily-plan/${materialId}`),
  getTopicExampleDownloadUrl: (materialId) => getFileUrl(`/api/bilisim/download-topic-example/${materialId}`)
};

export default api;

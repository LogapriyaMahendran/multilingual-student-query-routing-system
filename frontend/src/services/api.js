import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: don't automatically redirect if already on login/register
      const isAuthPath = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPath) {
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const queryAPI = {
  submitQuery: (queryData) => api.post('/queries', queryData),
  getMyQueries: () => api.get('/queries/my'),
  getQueryDetails: (id) => api.get(`/queries/${id}`),
  reclassify: (id) => api.post(`/queries/${id}/classify`),
  reroute: (id) => api.post(`/queries/${id}/route`),
};

export const staffAPI = {
  getDepartmentQueries: (params) => api.get('/staff/queries', { params }),
  updateStatus: (id, data) => api.patch(`/staff/queries/${id}/status`, data),
  addResponse: (id, data) => api.post(`/staff/queries/${id}/responses`, data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllQueries: (params) => api.get('/admin/queries', { params }),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getAnalytics: () => api.get('/admin/analytics'),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export default api;

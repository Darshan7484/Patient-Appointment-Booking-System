import axios from 'axios';

const BASE_URL = 'http://localhost:8081';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message;

    if (status === 401 || (status === 403 && message === 'Access Denied')) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── User ──────────────────────────────────────────────
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getUserById: (id) => api.get(`/user/${id}`),
  getUserAppointments: (id) => api.get(`/user/${id}/appointments`),
  deleteUser: (id) => api.delete(`/user/${id}`),
};

// ── Doctor ────────────────────────────────────────────
export const doctorAPI = {
  getAll: () => api.get('/doctor/all'),
  getById: (id) => api.get(`/doctor/${id}`),
  addDoctor: (data) => api.post('/doctor/add', data),
  updateDoctor: (id, data) => api.put(`/doctor/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctor/${id}`),
  getDoctorAppointments: (id) => api.get(`/doctor/${id}/appointments`),
};

// ── Appointment ───────────────────────────────────────
export const appointmentAPI = {
  book: (data) => api.post('/appointment/book', data),
  getMy: () => api.get('/appointment/my'),
  getAll: () => api.get('/appointment/all'),
  getById: (id) => api.get(`/appointment/${id}`),
  getByPatient: (patientId) => api.get(`/appointment/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointment/doctor/${doctorId}`),
  getByStatus: (status) => api.get(`/appointment/status/${status}`),
  updateStatus: (id, status) => api.put(`/appointment/${id}/status`, { status }),
  cancel: (id) => api.delete(`/appointment/${id}/cancel`),
  delete: (id) => api.delete(`/appointment/${id}`),
  getQueuePosition: (patientId) => patientId
    ? api.get(`/appointment/queue/position/${patientId}`)
    : api.get('/appointment/queue/position'),
};

// ── Admin ─────────────────────────────────────────────
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllAppointments: () => api.get('/admin/appointments'),
  getPendingAppointments: () => api.get('/admin/appointments/pending'),
  getCompletedAppointments: () => api.get('/admin/appointments/completed'),
  getCancelledAppointments: () => api.get('/admin/appointments/cancelled'),
  getStatistics: () => api.get('/admin/statistics'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;

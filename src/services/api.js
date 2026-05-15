const API_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('meditrack_token');

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !path.includes('/login')) {
    localStorage.removeItem('meditrack_token');
    localStorage.removeItem('current_user');
    window.location.href = '/login';
    throw new Error('Session expirée');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
};

export const api = {
  // Auth
  checkSetup: () => request('/auth/check'),
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getMe: () => request('/auth/me'),

  // Patients
  getPatients: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/patients?${q}`);
  },
  getPatient: (id) => request(`/patients/${id}`),
  createPatient: (data) => request('/patients', { method: 'POST', body: JSON.stringify(data) }),
  updatePatient: (id, data) => request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePatient: (id) => request(`/patients/${id}`, { method: 'DELETE' }),

  // Consultations
  getConsultations: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/consultations?${q}`);
  },
  getPatientConsultations: (patientId) => request(`/consultations/patient/${patientId}`),
  getConsultation: (id) => request(`/consultations/${id}`),
  createConsultation: (data) => request('/consultations', { method: 'POST', body: JSON.stringify(data) }),
  updateConsultation: (id, data) => request(`/consultations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteConsultation: (id) => request(`/consultations/${id}`, { method: 'DELETE' }),

  // Appointments
  getAppointments: () => request('/appointments'),
  getMonthAppointments: (year, month) => request(`/appointments/month?year=${year}&month=${month}`),
  getTodayAppointments: () => request('/appointments/today'),
  getUpcomingAppointments: () => request('/appointments/upcoming'),
  getAppointment: (id) => request(`/appointments/${id}`),
  createAppointment: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id, data) => request(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAppointment: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),

  // Users
  getUsers: () => request('/users'),
  getContacts: () => request('/users/contacts'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Messages
  getMessages: () => request('/messages'),
  getUnreadMessagesCount: () => request('/messages/unread-count'),
  sendMessage: (data) => request('/messages', { method: 'POST', body: JSON.stringify(data) }),
  markMessageRead: (id) => request(`/messages/${id}/read`, { method: 'PUT' }),
  markAllMessagesRead: (senderId) => request(`/messages/read-all/${senderId}`, { method: 'PUT' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  getUnreadNotificationsCount: () => request('/notifications/unread-count'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Audit logs
  getAuditLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/audit?${q}`);
  },
  createAuditLog: (data) => request('/audit', { method: 'POST', body: JSON.stringify(data) }),

  // Stats
  getStats: () => request('/stats'),
};

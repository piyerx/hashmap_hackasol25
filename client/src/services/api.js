import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const claimsAPI = {
  submitClaim: (claimData) => api.post('/claims/submit', claimData),
  getMyClaims: () => api.get('/claims/my-claims'),
  getPendingClaims: () => api.get('/claims/pending'),
  approveClaim: (claimId) => api.put(`/claims/approve/${claimId}`),
  voteForClaim: (claimId) => api.post(`/claims/vote/${claimId}`),
};

export default api;

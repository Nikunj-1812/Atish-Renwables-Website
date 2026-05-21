import axios from 'axios';
import { clearSession, getToken } from '../auth/authStore';

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://atish-renwables-website.onrender.com/api';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

async function request(path, options = {}) {
  const response = await httpClient({
    url: path,
    method: options.method || 'GET',
    data: options.data ?? options.body,
    params: options.params,
    responseType: options.responseType,
    onUploadProgress: options.onUploadProgress,
    headers: options.headers,
  });

  if (options.responseType === 'blob') {
    return response.data;
  }

  const payload = response.data;

  if (!payload?.success) {
    throw new Error(payload?.message || 'Something went wrong.');
  }

  return payload.data;
}

export const api = {
  login: ({ username, password }) =>
    request('/auth/login', {
      method: 'POST',
      data: { username, password },
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  getLeadStats: () => request('/leads/stats'),

  getLeads: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    return request(`/leads?${searchParams.toString()}`);
  },

  getLeadDetail: (id) => request(`/leads/${id}`),

  updateLead: (id, payload) =>
    request(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteLead: (id) =>
    request(`/leads/${id}`, {
      method: 'DELETE',
    }),

  exportLeadsCsv: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    return request(`/leads/export?${searchParams.toString()}`, {
      method: 'GET',
      responseType: 'blob',
    });
  },

  uploadImage: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    return request('/upload-image', {
      method: 'POST',
      data: formData,
      onUploadProgress,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getProjects: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    return request(`/projects?${searchParams.toString()}`);
  },

  getProjectDetail: (id) => request(`/projects/${id}`),

  createProject: (payload) =>
    request('/projects', {
      method: 'POST',
      data: payload,
    }),

  updateProject: (id, payload) =>
    request(`/projects/${id}`, {
      method: 'PATCH',
      data: payload,
    }),

  deleteProject: (id) =>
    request(`/projects/${id}`, {
      method: 'DELETE',
    }),

  getTeam: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    return request(`/team?${searchParams.toString()}`);
  },

  getTeamDetail: (id) => request(`/team/${id}`),

  createTeamMember: (payload) =>
    request('/team', {
      method: 'POST',
      data: payload,
    }),

  updateTeamMember: (id, payload) =>
    request(`/team/${id}`, {
      method: 'PATCH',
      data: payload,
    }),

  deleteTeamMember: (id) =>
    request(`/team/${id}`, {
      method: 'DELETE',
    }),
};

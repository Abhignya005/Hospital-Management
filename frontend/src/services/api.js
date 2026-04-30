/**
 * API Service
 * Centralized HTTP client for all backend API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Configure headers with auth token
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Handle API errors
const handleError = (error) => {
  if (error.response?.data) {
    return error.response.data;
  }
  return { success: false, message: error.message || 'An error occurred' };
};

// ============ AUTH ENDPOINTS ============
export const authAPI = {
  signup: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(data),
      });

      // If response is not ok, try to return useful info
      if (!response.ok) {
        let body;
        try { body = await response.json(); } catch (e) { body = await response.text(); }
        console.error('Signup failed', response.status, body);
        return { success: false, status: response.status, message: body?.message || body || response.statusText };
      }

      return response.json();
    } catch (error) {
      console.error('Signup fetch error', error);
      return handleError(error);
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        let body;
        try { body = await response.json(); } catch (e) { body = await response.text(); }
        console.error('Login failed', response.status, body);
        return { success: false, status: response.status, message: body?.message || body || response.statusText };
      }

      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Login fetch error', error);
      return handleError(error);
    }
  },

  getMe: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ============ DOCTOR ENDPOINTS ============
export const doctorAPI = {
  getDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  createDoctor: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  updateDoctor: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  deleteDoctor: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },
};

// ============ APPOINTMENT ENDPOINTS ============
export const appointmentAPI = {
  getAppointments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  bookAppointment: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  updateAppointment: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  cancelAppointment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },
};

// ============ PHARMACY ENDPOINTS ============
export const pharmacyAPI = {
  getMedicines: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacy/medicines`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  getMedicineById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacy/medicines/${id}`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },
};

// ============ HEALTH RECORDS ENDPOINTS ============
export const recordAPI = {
  getUserRecords: async (type = 'all') => {
    try {
      const url = type === 'all' ? `${API_BASE_URL}/records` : `${API_BASE_URL}/records?type=${type}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  getRecord: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  createRecord: async (recordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(recordData),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  updateRecord: async (id, recordData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(recordData),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },

  deleteRecord: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return response.json();
    } catch (error) {
      return handleError(error);
    }
  },
};

const apiExport = {
  auth: authAPI,
  doctors: doctorAPI,
  appointments: appointmentAPI,
  pharmacy: pharmacyAPI,
  records: recordAPI,
};

export default apiExport;

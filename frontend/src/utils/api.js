/**
 * API Utility for frontend
 * Centralizes all API calls with error handling and loading states
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API call handler with error management
 * @param {string} endpoint - API endpoint path
 * @param {object} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: data.message || 'An error occurred',
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data.data || data,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Network error. Please try again.',
      statusCode: 0,
    };
  }
}

/**
 * Submit contact form to backend
 * @param {object} formData - Contact form data
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export async function submitContactForm(formData) {
  return apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

/**
 * Calculate solar estimate
 * @param {object} payload - {pincode: string, monthlyElectricityBill: number}
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
export async function calculateSolarEstimate(payload) {
  return apiCall('/solar/calculate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getProjects() {
  return apiCall('/projects');
}

export async function getServices() {
  return apiCall('/services');
}

export async function getTeam() {
  return apiCall('/team');
}

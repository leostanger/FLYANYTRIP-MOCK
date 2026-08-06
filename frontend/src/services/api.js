/**
 * Central API Client for FlyAnyTrip Backend Integration
 * Set VITE_API_BASE_URL in your .env file or default to localhost.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const fetchAPI = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || `API Error: ${response.status}`);
    err.responseBody = errorData; // Attach full body so callers can inspect sessionExpired, etc.
    err.status = response.status;
    throw err;
  }

  return response.json();
};

export default fetchAPI;

/**
 * Central API Client for FlyAnyTrip Backend Integration
 * Set VITE_API_BASE_URL in your .env file or default to localhost.
 */

export const getApiBaseUrl = () => {
  return (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
      ? '/api'
      : 'http://localhost:5000/api')
  );
};

const BASE_URL = getApiBaseUrl();

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

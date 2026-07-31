import axios from 'axios';

/**
 * Centralized API client for Flyanytrip.
 * Uses the VITE_API_URL environment variable if available,
 * otherwise defaults to localhost for development.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

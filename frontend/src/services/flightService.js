import { fetchAPI } from './api';

export const flightService = {
  // Search flights with criteria
  searchFlights: async (searchParams) => {
    const query = new URLSearchParams(searchParams).toString();
    return fetchAPI(`/flights/search?${query}`);
  },

  // Search locations (Airports/Cities) from Adivaha API
  searchLocations: async (term) => {
    return fetchAPI(`/flights/locations?term=${encodeURIComponent(term)}`);
  },

  // Get flight details by ID
  getFlightDetails: async (flightId) => {
    return fetchAPI(`/flights/${flightId}`);
  },

  // Get calendar fares for dates
  getCalendarFare: async (params) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/flights/calendar-fare?${query}`);
  },

  // Create flight booking
  createBooking: async (bookingData) => {
    return fetchAPI('/flights/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Verify payment
  verifyPayment: async (paymentDetails) => {
    return fetchAPI('/flights/payment/verify', {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
    });
  },
};

export default flightService;

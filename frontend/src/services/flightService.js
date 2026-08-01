import { fetchAPI } from './api';

export const flightService = {
  // Search flights with criteria (one-way / round-trip)
  searchFlights: async (searchParams) => {
    const query = new URLSearchParams(searchParams).toString();
    return fetchAPI(`/flights/search?${query}`);
  },

  // Search multi-city flights — POST with segments array
  searchMultiCity: async ({ segments, adults = 1, children = 0, infants = 0, cabinClass = 'Economy' }) => {
    return fetchAPI('/flights/search/multicity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segments, adults, children, infants, cabinClass }),
    });
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

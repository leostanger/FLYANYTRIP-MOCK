import { fetchAPI } from './api';

export const hotelService = {
  // Search hotels by destination & dates
  searchHotels: async (filters) => {
    return fetchAPI('/hotels/search', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },

  // Search locations (Cities/Regions) from Adivaha API
  searchLocations: async (term) => {
    return fetchAPI(`/hotels/locations?term=${encodeURIComponent(term)}`);
  },

  // Get hotel details and room choices
  getHotelDetails: async (hotelId) => {
    return fetchAPI(`/hotels/${hotelId}`);
  },

  // Reserve room & initialize payment
  createHotelBooking: async (bookingData) => {
    return fetchAPI('/hotels/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // Confirm booking after payment
  confirmHotelBooking: async (confirmationPayload) => {
    return fetchAPI('/hotels/confirm', {
      method: 'POST',
      body: JSON.stringify(confirmationPayload),
    });
  },
};

export default hotelService;

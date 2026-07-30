export function generatePNR() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

export function saveBooking(bookingType, bookingData) {
  try {
    const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    
    // Safely remove non-serializable properties (e.g. DOM nodes, circular refs)
    const cleanBookingData = JSON.parse(JSON.stringify(bookingData || {}, (key, value) => {
      if (typeof value === 'function' || (value && typeof value === 'object' && value.nodeType)) {
        return undefined;
      }
      return value;
    }));

    const newBooking = {
      id: Math.random().toString(36).substring(2, 9),
      pnr: generatePNR(),
      bookingType,
      date: new Date().toISOString(),
      ...cleanBookingData
    };
    
    existingBookings.unshift(newBooking);
    localStorage.setItem('user_bookings', JSON.stringify(existingBookings));
    
    return newBooking;
  } catch (err) {
    console.error("Failed to save booking to localStorage:", err);
    return {
      id: Math.random().toString(36).substring(2, 9),
      pnr: generatePNR(),
      bookingType,
      date: new Date().toISOString(),
      ...bookingData
    };
  }
}

export function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('user_bookings') || '[]');
  } catch (err) {
    console.error("Failed to get bookings:", err);
    return [];
  }
}

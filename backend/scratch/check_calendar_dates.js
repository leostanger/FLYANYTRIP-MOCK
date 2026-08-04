require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function checkCalendar() {
  try {
    console.log('Querying Adivaha calendar fares...');
    const futureDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const res = await AdivahaFlightService.getCalendarFare({
      origin: 'DEL',
      destination: 'BOM',
      departureDate: futureDate,
      cabinClass: 'Economy'
    });
    
    console.log('Raw response type:', typeof res);
    
    let fares = res?.responseData?.Response?.SearchResults ||
                res?.Response?.SearchResults ||
                res?.SearchResults ||
                res;

    console.log('Fares length:', Array.isArray(fares) ? fares.length : 'not an array');
    if (Array.isArray(fares)) {
      const activeDates = fares.map(f => ({
        date: f.DepartureDate || f.Date || f.departureDate,
        fare: f.Fare || f.fare
      })).filter(x => x.date);
      console.log('Active dates and fares in sandbox:', activeDates.slice(0, 15));
    } else {
      console.log('Fares payload:', JSON.stringify(res).substring(0, 1000));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkCalendar();

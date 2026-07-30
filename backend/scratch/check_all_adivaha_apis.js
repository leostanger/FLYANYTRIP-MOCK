require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');
const AdivahaHotelService = require('../integrations/adivaha/adivaha.hotel.service');

async function runFullAdivahaDiagnostic() {
  console.log('--------------------------------------------------');
  console.log('✈️ ADIVAHA API LIVE DIAGNOSTIC CHECK');
  console.log('--------------------------------------------------');
  console.log('PID:', process.env.ADIVAHA_PID);
  console.log('API Key Status:', process.env.ADIVAHA_API_KEY ? 'CONFIGURED ✅' : 'MISSING ❌');
  console.log('--------------------------------------------------');

  const report = {};

  // 1. Test Location Search
  try {
    const locStart = Date.now();
    const locRes = await AdivahaFlightService.searchLocations('DEL', 1);
    report.searchLocations = {
      status: 'SUCCESS ✅',
      timeMs: Date.now() - locStart,
      locationsFound: Array.isArray(locRes) ? locRes.length : (locRes ? 1 : 0)
    };
  } catch (err) {
    report.searchLocations = { status: 'FAILED ❌', error: err.message };
  }

  // 2. Test Flight Search
  try {
    const flightStart = Date.now();
    const futureDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const flightRes = await AdivahaFlightService.searchFlights({
      origin: 'DEL',
      destination: 'BOM',
      departureDate: futureDate,
      adults: "1",
      children: "0",
      infants: "0",
      tripType: "oneway",
      cabinClass: "Economy"
    });
    const flightsCount = flightRes.flights ? flightRes.flights.length : (Array.isArray(flightRes) ? flightRes.length : 0);
    report.searchFlights = {
      status: 'SUCCESS ✅',
      timeMs: Date.now() - flightStart,
      departureDate: futureDate,
      flightsFound: flightsCount,
      sampleAirline: flightRes.flights && flightRes.flights[0] ? flightRes.flights[0].name || flightRes.flights[0].airline : 'Indigo'
    };
  } catch (err) {
    report.searchFlights = { status: 'FAILED ❌', error: err.message };
  }

  // 3. Test Calendar Fare
  try {
    const calStart = Date.now();
    const calDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const calRes = await AdivahaFlightService.getCalendarFare({
      origin: 'DEL',
      destination: 'BOM',
      departureDate: calDate,
      cabinClass: "Economy"
    });
    report.getCalendarFare = {
      status: 'SUCCESS ✅',
      timeMs: Date.now() - calStart,
      hasFareData: Boolean(calRes)
    };
  } catch (err) {
    report.getCalendarFare = { status: 'FAILED ❌', error: err.message };
  }

  console.log('\n📊 ADIVAHA LIVE TEST REPORT:');
  console.log(JSON.stringify(report, null, 2));
  console.log('--------------------------------------------------');
}

runFullAdivahaDiagnostic();

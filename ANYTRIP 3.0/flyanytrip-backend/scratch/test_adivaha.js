require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function runTests() {
  console.log("=== Testing Adivaha API integration ===");
  console.log("PID:", process.env.ADIVAHA_PID);
  console.log("API Key:", process.env.ADIVAHA_API_KEY);
  
  try {
    console.log("\n1. Testing searchLocations('DEL')...");
    const locRes = await AdivahaFlightService.searchLocations('DEL', 3);
    console.log("Locations Result:", JSON.stringify(locRes, null, 2));
  } catch (err) {
    console.error("Locations API Error:", err.message);
  }

  try {
    console.log("\n2. Testing searchFlights (DEL to BOM on 2026-10-01)...");
    const flightRes = await AdivahaFlightService.searchFlights({
      origin: 'DEL',
      destination: 'BOM',
      departureDate: '2026-10-01',
      adults: '1',
      children: '0',
      infants: '0',
      tripType: 'oneway',
      cabinClass: 'Economy'
    });
    console.log("Flights Result: Found", flightRes.flights?.length, "flights");
    if (flightRes.flights?.length === 0) {
      console.log("Raw API Response:", JSON.stringify(flightRes.rawAdivahaResponse, null, 2));
    } else {
      console.log("First flight sample:", JSON.stringify(flightRes.flights[0], null, 2));
    }
  } catch (err) {
    console.error("Flights Search API Error:", err.message);
  }
}

runTests();

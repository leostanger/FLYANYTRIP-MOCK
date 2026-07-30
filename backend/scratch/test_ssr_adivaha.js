require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function testSSR() {
  try {
    const depDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    console.log(`1. Searching live flights DEL -> BOM for ${depDate}...`);
    const searchRes = await AdivahaFlightService.searchFlights({
      origin: 'DEL',
      destination: 'BOM',
      departureDate: depDate,
      adults: "1",
      children: "0",
      infants: "0",
      tripType: "oneway",
      cabinClass: 'Economy'
    });

    if (searchRes.flights && searchRes.flights.length > 0) {
      const firstFlight = searchRes.flights[0];
      console.log(`Found flight: ${firstFlight.airline} (${firstFlight.flight}), ResultIndex: ${firstFlight.resultIndex}`);

      console.log("\n2. Calling Adivaha getFlightSSR...");
      const ssrRes = await AdivahaFlightService.getFlightSSR({
        TraceId: firstFlight.traceId,
        ResultIndex: firstFlight.resultIndex,
        EndUserIp: '127.0.0.1'
      });

      console.log("\nAdivaha SSR Response:", JSON.stringify(ssrRes, null, 2).substring(0, 2000));
    } else {
      console.log("No flights returned.");
    }
  } catch (err) {
    console.error("SSR Test Error:", err.message);
  }
}

testSSR();

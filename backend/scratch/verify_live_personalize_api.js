require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function verifyPersonalizeApiData() {
  try {
    const depDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    console.log(`1. Querying live Adivaha flight search for ${depDate}...`);
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
      const flight = searchRes.flights[0];
      console.log(`Flight Found: ${flight.airline} (${flight.flight}), TraceId: ${flight.traceId}`);

      console.log("2. Revalidating session with FareQuote...");
      await AdivahaFlightService.getFlightFareQuote({
        TraceId: flight.traceId,
        ResultIndex: flight.resultIndex,
        EndUserIp: '127.0.0.1'
      });

      console.log("3. Fetching live Adivaha SSR Data (Baggage & Meals)...");
      const ssrRes = await AdivahaFlightService.getFlightSSR({
        TraceId: flight.traceId,
        ResultIndex: flight.resultIndex,
        EndUserIp: '127.0.0.1'
      });

      const responseObj = ssrRes?.responseData?.Response || ssrRes?.Response;

      console.log("\n==========================================");
      console.log("LIVE ADIVAHA BAGGAGE API DATA:");
      console.log(JSON.stringify(responseObj?.Baggage, null, 2));

      console.log("\n==========================================");
      console.log("LIVE ADIVAHA MEALDYNAMIC API DATA:");
      console.log(JSON.stringify(responseObj?.MealDynamic, null, 2));
      console.log("==========================================");
    }
  } catch (err) {
    console.error("Verification Error:", err.message);
  }
}

verifyPersonalizeApiData();

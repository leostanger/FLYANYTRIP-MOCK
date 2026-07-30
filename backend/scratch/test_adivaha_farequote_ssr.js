require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function testAdivahaRevalidateSSR() {
  try {
    const depDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    console.log(`1. Searching flights DEL -> BOM for ${depDate}...`);
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
      console.log(`Flight: ${flight.airline} (${flight.flight}), TraceId: ${flight.traceId}, ResultIndex: ${flight.resultIndex}`);

      console.log("\n2. Calling Adivaha getFlightFareQuote (Revalidate)...");
      const quoteRes = await AdivahaFlightService.getFlightFareQuote({
        TraceId: flight.traceId,
        ResultIndex: flight.resultIndex,
        EndUserIp: '127.0.0.1'
      });

      console.log("FareQuote Response Status:", quoteRes?.status || quoteRes?.Response?.ResponseStatus);

      console.log("\n3. Calling Adivaha getFlightSSR (Live Seats/Meals/Baggage)...");
      const ssrRes = await AdivahaFlightService.getFlightSSR({
        TraceId: flight.traceId,
        ResultIndex: flight.resultIndex,
        EndUserIp: '127.0.0.1'
      });

      console.log("\n--- Live Adivaha SSR Data ---");
      console.log(JSON.stringify(ssrRes, null, 2).substring(0, 3000));
    } else {
      console.log("No flights returned.");
    }
  } catch (err) {
    console.error("Test Error:", err.message);
  }
}

testAdivahaRevalidateSSR();

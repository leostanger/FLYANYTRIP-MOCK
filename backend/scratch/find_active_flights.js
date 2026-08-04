require('dotenv').config();
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');

async function scan() {
  const routes = [
    { origin: 'DEL', destination: 'BOM' },
    { origin: 'DEL', destination: 'DXB' },
    { origin: 'DEL', destination: 'LHR' },
    { origin: 'BOM', destination: 'DXB' }
  ];
  
  const dates = [
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
  ];

  console.log('Scanning routes and dates for live Adivaha search results...');
  for (const route of routes) {
    for (const date of dates) {
      try {
        console.log(`Checking ${route.origin} -> ${route.destination} on ${date}...`);
        const res = await AdivahaFlightService.searchFlights({
          origin: route.origin,
          destination: route.destination,
          departureDate: date,
          adults: "1",
          children: "0",
          infants: "0",
          tripType: "oneway",
          cabinClass: "Economy"
        });
        
        const count = res.flights ? res.flights.length : 0;
        console.log(`  Result: ${count} flights found.`);
        if (count > 0) {
          console.log(`🎉 SUCCESS! Found active flight route: ${route.origin} -> ${route.destination} on ${date}`);
          console.log('Sample flight:', res.flights[0]);
          return;
        }
      } catch (e) {
        console.log(`  Failed: ${e.message}`);
      }
    }
  }
  console.log('Scan completed. No active routes found with live flights.');
}

scan();

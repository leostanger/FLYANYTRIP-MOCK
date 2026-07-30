require('dotenv').config();
const AdivahaFlightService = require('./integrations/adivaha/adivaha.service');

async function testAdivahaApis() {
    const results = {};

    console.log('Testing Adivaha APIs...');

    // 1. searchLocations
    try {
        console.log('1. Testing searchLocations...');
        const res = await AdivahaFlightService.searchLocations('DEL', 1);
        results.searchLocations = { status: 'Success', data: res };
    } catch (e) {
        results.searchLocations = { status: 'Failed', error: e.message };
    }

    // 2. searchFlights
    try {
        console.log('2. Testing searchFlights...');
        const payload = {
            origin: 'DEL',
            destination: 'BOM',
            departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            adults: "1",
            children: "0",
            infants: "0",
            tripType: "oneway",
            cabinClass: "Economy"
        };
        const res = await AdivahaFlightService.searchFlights(payload);
        results.searchFlights = { status: 'Success', flightsCount: res.flights.length };
    } catch (e) {
        results.searchFlights = { status: 'Failed', error: e.message };
    }

    // 3. getCalendarFare
    try {
        console.log('3. Testing getCalendarFare...');
        const payload = {
            origin: 'DEL',
            destination: 'BOM',
            departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            cabinClass: "Economy"
        };
        const res = await AdivahaFlightService.getCalendarFare(payload);
        results.getCalendarFare = { status: 'Success', data: res };
    } catch (e) {
        results.getCalendarFare = { status: 'Failed', error: e.message };
    }

    console.log('\n--- Test Results ---');
    console.log(JSON.stringify(results, null, 2));
}

testAdivahaApis();

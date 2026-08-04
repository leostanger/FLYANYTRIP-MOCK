const axios = require('axios');

async function run() {
  try {
    console.log('Fetching flights from local backend server...');
    const res = await axios.get('http://localhost:5000/api/flights/search?origin=DEL&destination=BOM&departureDate=2026-08-10');
    console.log('Status:', res.status);
    console.log('Success:', res.data.success);
    console.log('Source:', res.data.source);
    console.log('Number of flights:', res.data.data?.flights?.length);
    if (res.data.data?.flights?.length > 0) {
      console.log('First flight sample:', {
        id: res.data.data.flights[0].id,
        airline: res.data.data.flights[0].airline,
        flight: res.data.data.flights[0].flight,
        price: res.data.data.flights[0].price,
        time: res.data.data.flights[0].time,
        arrival: res.data.data.flights[0].arrival
      });
    }

    console.log('\nFetching locations from local backend server...');
    const locRes = await axios.get('http://localhost:5000/api/flights/locations?term=del');
    console.log('locRes.data:', locRes.data);

    console.log('\nFetching calendar fares from local backend server...');
    const calRes = await axios.get('http://localhost:5000/api/flights/calendar-fare?origin=DEL&destination=BOM&departureDate=2026-08-10');
    console.log('Calendar fares count:', calRes.data.data?.length);
    console.log('First calendar fare sample:', calRes.data.data?.[0]);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
  }
}

run();

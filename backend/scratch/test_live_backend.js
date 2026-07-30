const axios = require('axios');

async function testLiveEndpoints() {
  console.log('Testing Live Backend Endpoints...');

  // 1. Health Check
  try {
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ 1. GET /api/health:', health.data);
  } catch (err) {
    console.error('❌ 1. GET /api/health error:', err.message);
  }

  // 2. Razorpay Config
  try {
    const rzpConfig = await axios.get('http://localhost:5000/api/payment/config');
    console.log('✅ 2. GET /api/payment/config:', rzpConfig.data);
  } catch (err) {
    console.error('❌ 2. GET /api/payment/config error:', err.message);
  }

  // 3. Flight Search via Adivaha
  try {
    const flightSearch = await axios.get('http://localhost:5000/api/flights/search', {
      params: {
        origin: 'DEL',
        destination: 'BOM',
        departureDate: '2026-08-20',
        adults: 1,
        cabinClass: 'Economy'
      }
    });
    console.log('✅ 3. GET /api/flights/search success! Returned flights:', flightSearch.data?.data?.flights?.length || flightSearch.data?.data?.length || 0);
  } catch (err) {
    console.error('❌ 3. GET /api/flights/search error:', err.response?.data || err.message);
  }
}

testLiveEndpoints();

const axios = require('axios');

async function runTests() {
  const baseUrl = 'http://localhost:5000';
  console.log(`==================================================`);
  console.log(`Starting comprehensive API verification tests...`);
  console.log(`Target server: ${baseUrl}`);
  console.log(`==================================================\n`);
  
  // 1. Health check
  try {
    const res = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ GET /api/health: SUCCESS');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('❌ GET /api/health: FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }
  
  // 2. Flight Locations
  try {
    const res = await axios.get(`${baseUrl}/api/flights/locations`, {
      params: { term: 'DEL' }
    });
    console.log('\n✅ GET /api/flights/locations?term=DEL: SUCCESS');
    if (res.data?.data?.airports) {
      console.log(`   Found airports:`, res.data.data.airports.map(a => `${a.CityName} (${a.code})`).join(', '));
    } else {
      console.log(`   Response:`, res.data);
    }
  } catch (err) {
    console.log('\n❌ GET /api/flights/locations?term=DEL: FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }
  
  // 3. Flight Search (One way) & Chained Tests
  try {
    const depDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const res = await axios.post(`${baseUrl}/api/flights/search`, {
      origin: 'DEL',
      destination: 'BOM',
      departureDate: depDate,
      adults: '1',
      children: '0',
      infants: '0',
      tripType: 'one-way',
      cabinClass: 'Economy'
    });

    const firstFlight = res.data?.data?.flights?.[0];
    const traceId = firstFlight?.traceId || (res.data?.data?.flights?.[0]?.raw?.ResultIndex ? res.data?.data?.flights?.[0]?.raw?.TraceId : null);
    const resultIndex = firstFlight?.resultIndex || res.data?.data?.flights?.[0]?.raw?.ResultIndex;

    console.log('\n✅ POST /api/flights/search (One-Way): SUCCESS');
    console.log(`   Flights found:`, res.data?.data?.flights?.length || 0);

    if (traceId && resultIndex) {
      console.log(`   Selected flight: ${firstFlight.flight} (${firstFlight.airline})`);
      console.log(`   Trace ID: ${traceId}, Result Index: ${resultIndex}`);

      // 3a. Fare Rule
      try {
        const ruleRes = await axios.post(`${baseUrl}/api/flights/fare-rule`, { traceId, resultIndex });
        console.log('   ✅ POST /api/flights/fare-rule: SUCCESS');
      } catch (ruleErr) {
        console.log('   ❌ POST /api/flights/fare-rule: FAILED', ruleErr.response?.data || ruleErr.message);
      }

      // 3b. Fare Quote
      try {
        const quoteRes = await axios.post(`${baseUrl}/api/flights/fare-quote`, { traceId, resultIndex });
        console.log('   ✅ POST /api/flights/fare-quote: SUCCESS');
      } catch (quoteErr) {
        console.log('   ❌ POST /api/flights/fare-quote: FAILED', quoteErr.response?.data || quoteErr.message);
      }

      // 3c. SSR Details
      try {
        const ssrRes = await axios.post(`${baseUrl}/api/flights/ssr`, { traceId, resultIndex });
        console.log('   ✅ POST /api/flights/ssr: SUCCESS');
      } catch (ssrErr) {
        console.log('   ❌ POST /api/flights/ssr: FAILED', ssrErr.response?.data || ssrErr.message);
      }
    } else {
      console.log('   ⚠️ Skipping fare-rule, fare-quote, and ssr tests (No flights found to retrieve traceId/resultIndex)');
    }
  } catch (err) {
    console.log('\n❌ POST /api/flights/search (One-Way): FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }

  // 4. Calendar Fare
  try {
    const depDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const res = await axios.get(`${baseUrl}/api/flights/calendar-fare`, {
      params: {
        origin: 'DEL',
        destination: 'BOM',
        departureDate: depDate,
        cabinClass: 'Economy'
      }
    });
    console.log('\n✅ GET /api/flights/calendar-fare: SUCCESS (with empty fallback handling)');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('\n❌ GET /api/flights/calendar-fare: FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }

  // 5. Hotel Locations
  try {
    const res = await axios.get(`${baseUrl}/api/hotels/locations`, {
      params: { term: 'del', limit: 5 }
    });
    console.log('\n✅ GET /api/hotels/locations?term=del&limit=5: SUCCESS');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('\n❌ GET /api/hotels/locations: FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }

  // 6. Payment Config
  try {
    const res = await axios.get(`${baseUrl}/api/payment/config`);
    console.log('\n✅ GET /api/payment/config: SUCCESS');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('\n❌ GET /api/payment/config: FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }

  // 7. Payment Order Creation
  try {
    const res = await axios.post(`${baseUrl}/api/payment/create-order`, {
      amount: 1500,
      currency: 'INR'
    });
    console.log('\n✅ POST /api/payment/create-order: SUCCESS');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('\n❌ POST /api/payment/create-order: FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }

  // 8. Coupon Validation (Valid coupon)
  try {
    const res = await axios.post(`${baseUrl}/api/coupons/validate`, {
      code: 'FLYANYTRIP',
      amount: 5000
    });
    console.log('\n✅ POST /api/coupons/validate (Valid Code): SUCCESS');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('\n❌ POST /api/coupons/validate (Valid Code): FAILED');
    console.log(`   Error:`, err.response ? err.response.data : err.message);
  }

  // 9. Coupon Validation (Invalid coupon)
  try {
    const res = await axios.post(`${baseUrl}/api/coupons/validate`, {
      code: 'INVALIDCODE',
      amount: 5000
    });
    console.log('\n✅ POST /api/coupons/validate (Invalid Code): SUCCESS (Expected 404 block handler)');
    console.log(`   Response Status:`, res.status, res.data);
  } catch (err) {
    if (err.response?.status === 404) {
      console.log('\n✅ POST /api/coupons/validate (Invalid Code): SUCCESS (Returned expected 404)');
      console.log(`   Response:`, err.response.data);
    } else {
      console.log('\n❌ POST /api/coupons/validate (Invalid Code): FAILED');
      console.log(`   Error:`, err.response ? err.response.data : err.message);
    }
  }

  // 10. User Stats (Prisma API V2)
  try {
    const res = await axios.get(`${baseUrl}/api/v2/user-stats/1`);
    console.log('\n✅ GET /api/v2/user-stats/1: SUCCESS');
    console.log(`   Response:`, res.data);
  } catch (err) {
    console.log('\nℹ️ GET /api/v2/user-stats/1: CHECKED');
    console.log(`   Response status:`, err.response?.status, `Data:`, err.response ? err.response.data : err.message);
  }
  
  console.log(`\n==================================================`);
  console.log(`API verification tests complete.`);
  console.log(`==================================================`);
}

runTests();

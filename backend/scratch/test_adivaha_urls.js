const axios = require('axios');

const ADIVAHA_URLS = [
  'https://api.adivaha.io/flights/api',
  'https://api.adivaha.com/flights/api',
  'https://tbb.adivaha.com/api'
];

const PID = '77A93722';
const API_KEY = '69EF161DEEBA7';

async function testUrls() {
  for (const url of ADIVAHA_URLS) {
    try {
      console.log(`Testing ${url} ...`);
      const res = await axios.get(url, {
        params: { action: 'flightLocations', term: 'DEL', limit: 2 },
        headers: { 'PID': PID, 'x-api-key': API_KEY },
        timeout: 5000 // 5 seconds timeout
      });
      console.log(`✅ Success with ${url} - Status: ${res.status}`);
      console.log(`Data:`, res.data);
      return; // Stop on first success
    } catch (e) {
      console.error(`❌ Failed with ${url} - ${e.message}`);
    }
  }
}

testUrls();

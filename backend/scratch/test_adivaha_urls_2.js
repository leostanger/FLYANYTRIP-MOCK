const axios = require('axios');

const ADIVAHA_URLS = [
  'https://api.adivaha.com',
  'https://api.adivaha.com/v1',
  'https://tbb.adivaha.com',
  'http://api.adivaha.io/flights/api'
];

const PID = '77A93722';
const API_KEY = '69EF161DEEBA7';

async function testUrls() {
  for (const baseUrl of ADIVAHA_URLS) {
    try {
      console.log(`Testing ${baseUrl} ...`);
      const res = await axios.get(baseUrl, {
        params: { action: 'flightLocations', term: 'DEL', limit: 2 },
        headers: { 'PID': PID, 'x-api-key': API_KEY },
        timeout: 5000 
      });
      console.log(`✅ Success with ${baseUrl} - Status: ${res.status}`);
      console.log(`Data:`, res.data);
    } catch (e) {
      console.error(`❌ Failed with ${baseUrl} - ${e.response ? e.response.status : e.message}`);
    }
  }
}

testUrls();

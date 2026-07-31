const axios = require('axios');
require('dotenv').config();

const ADIVAHA_BASE_URL = 'https://api.adivaha.io/flights/api';
const PID = process.env.ADIVAHA_PID || '77A93722';
const API_KEY = process.env.ADIVAHA_API_KEY || '69EF161DEEBA7';

async function testAdivaha() {
  try {
    console.log('Testing flightLocations...');
    const locRes = await axios.get(ADIVAHA_BASE_URL, {
      params: { action: 'flightLocations', term: 'DEL', limit: 5 },
      headers: { 'PID': PID, 'x-api-key': API_KEY }
    });
    console.log('Locations Status:', locRes.status);
    // console.log('Locations Data:', locRes.data);
    
    console.log('Testing flightSearch...');
    const searchPayload = {
      action: "flightSearch",
      adults: "1",
      children: "0",
      infants: "0",
      isoneway: "Yes",
      From_IATACODE: "DEL",
      To_IATACODE: "BOM",
      departure_date: "2026-08-01",
      return_date: "",
      Flights_category: "Economy"
    };

    const searchRes = await axios.post(ADIVAHA_BASE_URL, searchPayload, {
      headers: { 'PID': PID, 'x-api-key': API_KEY }
    });
    console.log('Search Status:', searchRes.status);
    console.log('Search Data (partial):', JSON.stringify(searchRes.data).substring(0, 500));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAdivaha();

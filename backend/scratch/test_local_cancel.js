const axios = require('axios');

async function testCancel() {
  try {
    console.log("Querying local cancel charges for booking ID BKG-1782980188649-111...");
    const res = await axios.post('http://localhost:5000/api/booking/cancel-charges', {
      bookingId: 'BKG-1782980188649-111'
    });
    console.log("Response:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testCancel();

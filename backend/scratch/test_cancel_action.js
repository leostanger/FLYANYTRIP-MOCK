const axios = require('axios');

async function testAction() {
  try {
    console.log("Triggering cancellation request for BKG-1782980188649-111...");
    const res = await axios.post('http://localhost:5000/api/booking/cancel-request', {
      bookingId: 'BKG-1782980188649-111',
      remarks: 'Test action simulation'
    });
    console.log("Response:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testAction();

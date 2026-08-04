require('dotenv').config();
const AdivahaHotelService = require('../integrations/adivaha/adivaha.hotel.service');

async function test() {
  try {
    console.log("Searching locations for 'Mumbai'...");
    const loc = await AdivahaHotelService.getLocations('Mumbai', 1);
    console.log("Location Response:", JSON.stringify(loc, null, 2));

    const regionid = loc?.cities?.find(c => c.countryCode === 'IN')?.destinationCode || 'GOO';

    console.log(`\nSearching hotels for regionid: ${regionid}...`);
    
    // Dates need to be YYYY-MM-DD
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 7);
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 9);
    
    const searchRes = await AdivahaHotelService.hotelSearch({
      regionid,
      countryCode: 'IN', // Adivaha might not need it if regionId is sufficient
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      rooms: 1,
      adults: '2',
      children: '0',
      childAge: '0',
      page: 1
    });

    console.log("\nSearch Response (partial):", JSON.stringify(searchRes).substring(0, 500) + '...');
    if(searchRes?.responseData?.HotelLists?.HotelList?.length > 0) {
      console.log(`\nAPI returned ${searchRes.responseData?.HotelLists?.HotelList?.length} hotels in the array.`);
    } else {
      console.log("\nNo hotels found in response data.");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

test();

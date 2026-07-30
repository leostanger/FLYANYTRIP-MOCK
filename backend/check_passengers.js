const prisma = require('./config/prisma');

async function checkDatabase() {
  try {
    const bookingsCount = await prisma.bookings.count();
    const flightBookingsCount = await prisma.flight_bookings.count();
    const passengersCount = await prisma.flight_booking_passengers.count();
    const travellersCount = await prisma.travellers.count();

    console.log('--- Database Record Counts ---');
    console.log(`Total Bookings: ${bookingsCount}`);
    console.log(`Total Flight Bookings: ${flightBookingsCount}`);
    console.log(`Total Flight Booking Passengers: ${passengersCount}`);
    console.log(`Total Saved Travellers: ${travellersCount}`);

    if (passengersCount > 0) {
      const passengers = await prisma.flight_booking_passengers.findMany({ take: 5 });
      console.log('\n--- Recent Passengers Saved ---');
      console.dir(passengers, { depth: null });
    } else {
      console.log('\n(No passenger records saved in the database yet)');
    }
  } catch (err) {
    console.error('Error querying database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

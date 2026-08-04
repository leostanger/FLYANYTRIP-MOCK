const prisma = require('./config/prisma');

async function testRealBookingWrite() {
  console.log('==================================================');
  console.log('Starting Test Booking Write on Neon Database...');
  console.log('==================================================\n');
  
  const testId = `TEST-BKG-${Date.now()}`;
  const pnr = `PNR${Math.floor(Math.random() * 900000 + 100000)}`;

  try {
    // 1. Create the master Booking record
    const booking = await prisma.bookings.create({
      data: {
        booking_id: testId,
        user_id: null, // Optional field, set to null for test simplicity
        booking_type: 'FLIGHT',
        status: 'CONFIRMED',
        total_amount: 5550.00,
        currency: 'INR',
      }
    });

    console.log('✅ Created master Booking record:', booking.booking_id);

    // 2. Create the Flight Booking details record
    const flightBooking = await prisma.flight_bookings.create({
      data: {
        booking_id: booking.booking_id,
        user_id: null,
        provider_booking_id: Math.floor(Math.random() * 900000 + 100000),
        provider_order_id: 'ORDER-TEST-999',
        trace_id: 'test-trace-uuid',
        pnr: pnr,
        validating_airline: '6E',
        origin_airport: 'DEL',
        destination_airport: 'BOM',
        departure_date: new Date(),
        total_fare: 5000.00,
        offered_fare: 5000.00,
        currency: 'INR',
        ticket_status: 'TICKETED',
        booking_status: 'CONFIRMED',
        is_lcc: true,
        total_passengers: 1,
        distance_km: 1150,
        raw_response: { is_test: true },
      }
    });

    console.log('✅ Created Flight Booking details record with PNR:', flightBooking.pnr);

    // 3. Create the Passenger record
    const passenger = await prisma.flight_booking_passengers.create({
      data: {
        booking_id: booking.booking_id,
        pax_index: 0,
        first_name: 'NeonTest',
        last_name: 'Database',
        gender: 'Male',
        date_of_birth: '1995-05-15',
        pax_type: 1,
        passport_no: null,
        passport_expiry: null,
        ticket_status: 'TICKETED',
        seat_number: '14B',
        seat_price: 200.00,
        meal_name: 'Veg Meal',
        meal_price: 350.00,
        baggage_weight: '15kg',
        baggage_price: 0,
      }
    });

    console.log('✅ Created Passenger details for passenger:', passenger.first_name, passenger.last_name);
    console.log('\n🎉 SUCCESS: Booking successfully stored in Neon Database!');
    console.log('==================================================');
  } catch (err) {
    console.error('❌ Failed to write booking:', err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testRealBookingWrite();

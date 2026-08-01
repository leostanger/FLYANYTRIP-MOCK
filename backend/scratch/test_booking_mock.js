const assert = require('assert');
const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');
const prisma = require('../config/prisma');

// Mock Prisma Client
prisma.$transaction = async (callback) => {
  const mockTx = {
    bookings: {
      create: async ({ data }) => ({ booking_id: 'BKG-MOCK-12345', ...data })
    },
    flight_bookings: {
      create: async ({ data }) => ({ id: 1, ...data })
    },
    flight_booking_passengers: {
      createMany: async ({ data }) => {
        mockTx.savedPassengers = data;
        return { count: data.length };
      }
    },
    travellers: {
      create: async ({ data }) => ({ id: 1, ...data })
    }
  };
  
  const result = await callback(mockTx);
  // Attach saved passengers for verification
  result.savedPassengers = mockTx.savedPassengers;
  return result;
};

prisma.users = {
  findUnique: async () => null,
  create: async ({ data }) => ({ id: 999, ...data })
};

// Import Controller
const bookingController = require('../controllers/booking.controller');

// Mock service calls tracking
let lastBookPayload = null;
let lastTicketingPayload = null;
let mockTicketingResponse = null;

AdivahaFlightService.bookFlight = async (payload) => {
  lastBookPayload = payload;
  return {
    status: "200",
    status_message: "Success",
    responseData: {
      Response: {
        PNR: "PNRHOLD123",
        BookingId: 1001,
        TicketStatus: payload.isLCC ? "TICKETED" : "BOOKED"
      }
    }
  };
};

AdivahaFlightService.issueNonLccTicket = async (payload) => {
  lastTicketingPayload = payload;
  return mockTicketingResponse || {
    status: "200",
    status_message: "Success",
    responseData: {
      Response: {
        PNR: "PNRISSUED123",
        BookingId: 1001,
        TicketStatus: "TICKETED"
      }
    }
  };
};

// Mock Response Object
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.jsonBody = data;
    return res;
  };
  return res;
};

async function runTests() {
  console.log('==================================================');
  console.log('Running Adivaha Booking Logic Validation Tests...');
  console.log('==================================================\n');

  // Test 1: LCC Booking Flow
  try {
    lastBookPayload = null;
    lastTicketingPayload = null;

    const req = {
      body: {
        isLCC: true,
        traceId: "trace-lcc-mock",
        resultIndex: "OB1",
        totalAmount: 15000,
        contactDetails: {
          Email: "john.doe@example.com",
          ContactNo: "9876543210",
          AddressLine1: "123 Main St",
          City: "Mumbai",
          CountryCode: "IN",
          CountryName: "India"
        },
        flightSnapshot: {
          from: "BOM",
          to: "DEL",
          airlineCode: "6E",
          raw: {
            IsLCC: true,
            IsDomestic: true,
            Segments: [
              [
                {
                  Origin: { Airport: { CountryCode: "IN" }, DepTime: "2026-09-10T10:00:00" },
                  Destination: { Airport: { CountryCode: "IN" } }
                }
              ]
            ]
          }
        },
        passengers: [
          {
            Title: "Mr.",
            FirstName: "John",
            LastName: "Doe",
            DateOfBirth: "1990-05-15"
          },
          {
            Title: "Master.",
            FirstName: "Billy",
            LastName: "Doe",
            DateOfBirth: "2018-08-20"
          }
        ],
        ssrSelections: {
          seats: [],
          meals: [],
          baggage: []
        }
      }
    };

    const res = mockResponse();
    await bookingController.confirmBooking(req, res, () => {});

    console.log('🧪 Test 1 (LCC Booking Flow):');
    assert.strictEqual(res.statusCode, 200, 'LCC Booking response should be 200 OK');
    assert.strictEqual(res.jsonBody.success, true, 'Response success should be true');

    // Verify booking payload sent to Adivaha Flight Service
    assert.ok(lastBookPayload, 'bookFlight payload should be tracked');
    assert.strictEqual(lastBookPayload.isLCC, true, 'isLCC flag should be true');
    assert.strictEqual(lastBookPayload.isDomestic, 'Yes', 'isDomestic should be mapped to "Yes"');
    assert.strictEqual(lastBookPayload.isoneway, 'Yes', 'isoneway should be mapped to "Yes"');
    assert.strictEqual(lastBookPayload.IsDomesticReturn, 'No', 'IsDomesticReturn should be "No"');

    // Verify Passenger Enrichment
    const enrichedPax = lastBookPayload.Passengers;
    assert.strictEqual(enrichedPax.length, 2, 'Should enrich all passengers');
    
    // Pax 1 (Adult)
    assert.strictEqual(enrichedPax[0].Title, 'Mr', 'Should clean trailing dot from Mr.');
    assert.strictEqual(enrichedPax[0].Gender, 1, 'Mr should be Male (1)');
    assert.strictEqual(enrichedPax[0].PaxType, '1', 'PaxType should be Adult (1)');
    assert.strictEqual(enrichedPax[0].DateOfBirth, '1990-05-15T00:00:00', 'Should format DOB correctly');
    assert.strictEqual(enrichedPax[0].IsLeadPax, true, 'First passenger should be lead pax');
    assert.strictEqual(enrichedPax[0].Email, 'john.doe@example.com', 'Should inherit email');
    assert.strictEqual(enrichedPax[0].ContactNo, '9876543210', 'Should inherit contact no');

    // Pax 2 (Child)
    assert.strictEqual(enrichedPax[1].Title, 'Master', 'Should clean trailing dot from Master.');
    assert.strictEqual(enrichedPax[1].Gender, 1, 'Master should be Male (1)');
    assert.strictEqual(enrichedPax[1].PaxType, '2', 'PaxType should be Child (2)');
    assert.strictEqual(enrichedPax[1].IsLeadPax, false, 'Second passenger should not be lead pax');

    assert.strictEqual(lastTicketingPayload, null, 'Ticketing issue call should NOT run for LCC');
    console.log('   ✅ PASS');

  } catch (error) {
    console.log('   ❌ FAIL:', error.message);
    console.error(error);
  }

  // Test 2: Non-LCC Booking (Two-Step Flow)
  try {
    lastBookPayload = null;
    lastTicketingPayload = null;
    mockTicketingResponse = null;

    const req = {
      body: {
        isLCC: false,
        traceId: "trace-non-lcc-mock",
        resultIndex: "OB2",
        totalAmount: 25000,
        contactDetails: {
          Email: "jane.doe@example.com",
          ContactNo: "9876543211",
          AddressLine1: "456 Side St",
          City: "Delhi",
          CountryCode: "IN",
          CountryName: "India"
        },
        flightSnapshot: {
          from: "DEL",
          to: "LHR", // International
          airlineCode: "AI",
          raw: {
            IsLCC: false,
            IsDomestic: false,
            Segments: [
              [
                {
                  Origin: { Airport: { CountryCode: "IN" }, DepTime: "2026-09-10T10:00:00" },
                  Destination: { Airport: { CountryCode: "GB" } }
                }
              ]
            ]
          }
        },
        passengers: [
          {
            Title: "Mrs.",
            FirstName: "Jane",
            LastName: "Doe",
            DateOfBirth: "1988-10-25"
          }
        ],
        ssrSelections: {
          seats: [],
          meals: [],
          baggage: []
        }
      }
    };

    const res = mockResponse();
    await bookingController.confirmBooking(req, res, () => {});

    console.log('\n🧪 Test 2 (Non-LCC Booking Two-Step Flow):');
    assert.strictEqual(res.statusCode, 200, 'Non-LCC Booking response should be 200 OK');

    // Verify bookFlight call (Step 1)
    assert.ok(lastBookPayload, 'bookFlight should be called');
    assert.strictEqual(lastBookPayload.isLCC, false);
    assert.strictEqual(lastBookPayload.isDomestic, 'No', 'isDomestic should be No for LHR destination');

    // Verify issueNonLccTicket call (Step 2)
    assert.ok(lastTicketingPayload, 'issueNonLccTicket should be called');
    assert.strictEqual(lastTicketingPayload.PNR, 'PNRHOLD123', 'Should pass Hold PNR to ticketing');
    assert.strictEqual(lastTicketingPayload.BookingId, 1001, 'Should pass Hold BookingId to ticketing');

    // Passport Fallbacks for International
    const pax = lastTicketingPayload.Passengers[0];
    assert.strictEqual(pax.Gender, 2, 'Mrs should be Female (2)');
    assert.strictEqual(pax.PaxType, '1', 'Should be Adult (1)');
    assert.ok(pax.PassportNo, 'PassportNo should be generated for international');
    assert.ok(pax.PassportExpiry, 'PassportExpiry should be generated for international');
    console.log('   ✅ PASS');

  } catch (error) {
    console.log('   ❌ FAIL:', error.message);
    console.error(error);
  }

  // Test 3: Non-LCC Ticketing Fail Handling
  try {
    lastBookPayload = null;
    lastTicketingPayload = null;
    
    // Simulate Ticketing Fail
    mockTicketingResponse = {
      status: "200",
      status_message: "Success",
      responseData: {
        Response: {
          Error: {
            ErrorCode: 105,
            ErrorMessage: "Price Mismatch or Insufficient Wallet Balance"
          }
        }
      }
    };

    const req = {
      body: {
        isLCC: false,
        traceId: "trace-non-lcc-mock-fail",
        resultIndex: "OB3",
        totalAmount: 25000,
        contactDetails: {
          Email: "jane.doe@example.com",
          ContactNo: "9876543211"
        },
        flightSnapshot: {
          from: "DEL",
          to: "BOM",
          airlineCode: "AI"
        },
        passengers: [
          {
            Title: "Ms.",
            FirstName: "Alice",
            LastName: "Smith",
            DateOfBirth: "1995-12-05"
          }
        ],
        ssrSelections: {}
      }
    };

    const res = mockResponse();
    await bookingController.confirmBooking(req, res, () => {});

    console.log('\n🧪 Test 3 (Non-LCC Ticketing Fail Handling):');
    assert.strictEqual(res.statusCode, 200, 'Even if step 2 ticketing fails, request confirms booking locally');
    
    const dbRecord = res.jsonBody.data;
    assert.ok(dbRecord, 'Should return saved booking details');
    assert.strictEqual(dbRecord.savedPassengers[0].ticket_status, 'HOLD_TICKET_FAILED', 'Database ticket status should mark hold-ticketing failure');
    console.log('   ✅ PASS');

  } catch (error) {
    console.log('   ❌ FAIL:', error.message);
    console.error(error);
  }

  console.log('\n==================================================');
  console.log('Tests complete.');
  console.log('==================================================');
}

runTests();

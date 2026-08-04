const prisma = require('./config/prisma');

async function testConfirmSimulation() {
    console.log("Starting confirmBooking database insert simulation...");
    
    // 1. Mock inputs mimicking confirmBooking controller
    const isLCC = true;
    const traceId = "0664ad78-bdd1-42a6-9e20-561e68b6e8a5";
    const resultIndex = "1";
    const totalAmount = 3915;
    const userId = null;
    
    const contactDetails = {
        Email: "guest@flyanytrip.com",
        ContactNo: "9999999999",
        AddressLine1: "Street Address",
        City: "Delhi",
        CountryCode: "IN",
        CountryName: "India",
        Nationality: "IN"
    };

    const passengers = [
        {
            title: "Mr.",
            firstName: "ALISHA",
            lastName: "PATEL",
            dob: "12/05/1995"
        },
        {
            title: "Ms.",
            firstName: "SNEHA",
            lastName: "PATEL",
            dob: "24/08/1997"
        }
    ];

    const ssrSelections = {
        seats: [
            { paxIdx: 0, code: "12A", price: 0 },
            { paxIdx: 1, code: "12B", price: 0 }
        ]
    };

    const flightSnapshot = {
        price: 3915,
        airlineCode: "6E",
        from: "DEL",
        to: "BOM",
        raw: {
            IsDomestic: true,
            Segments: [
                [
                    {
                        Origin: {
                            Airport: { AirportCode: "DEL" },
                            DepTime: "2026-06-01T10:00:00"
                        },
                        Destination: {
                            Airport: { AirportCode: "BOM" },
                            ArrTime: "2026-06-01T12:15:00"
                        }
                    }
                ]
            ]
        }
    };

    const isDomestic = "Yes";
    const ticketStatus = "TICKETED";
    const pnr = "MH7XKL";
    const providerBookingId = "1697020";
    
    // Simulate user creation/lookup
    let actualUserId = userId ? parseInt(userId, 10) : null;
    try {
        if (!actualUserId && contactDetails?.Email) {
            let user = await prisma.users.findUnique({
                where: { email: contactDetails.Email }
            });
            
            if (!user) {
                user = await prisma.users.create({
                    data: {
                        email: contactDetails.Email,
                        phone: contactDetails.ContactNo || null,
                        first_name: passengers?.[0]?.firstName || 'Guest',
                        last_name: passengers?.[0]?.lastName || 'User',
                        user_type: 'GUEST'
                    }
                });
            }
            actualUserId = user.id;
        }
        console.log("Using User ID:", actualUserId);

        // Map enriched passengers
        const enrichedPassengers = passengers.map((p, idx) => {
            const title = (p.title || "Mr").replace(/\./g, "").trim();
            let gender = 1;
            const titleLower = title.toLowerCase();
            if (["mr", "mstr", "master"].includes(titleLower)) {
                gender = 1;
            } else if (["mrs", "ms", "miss"].includes(titleLower)) {
                gender = 2;
            }
            
            let paxType = "1";
            let dobStr = p.dob || "1990-01-01";
            if (dobStr.includes("T")) {
                dobStr = dobStr.split("T")[0] + "T00:00:00";
            } else {
                dobStr = dobStr + "T00:00:00";
            }

            return {
                Title: title,
                FirstName: p.firstName || "Rahul",
                LastName: p.lastName || "Sharma",
                PaxType: paxType,
                DateOfBirth: dobStr,
                Gender: gender,
                AddressLine1: contactDetails.AddressLine1,
                AddressLine2: "",
                City: contactDetails.City,
                CountryCode: contactDetails.CountryCode.toUpperCase(),
                CountryName: contactDetails.CountryName,
                Nationality: contactDetails.Nationality.toUpperCase(),
                ContactNo: contactDetails.ContactNo,
                Email: contactDetails.Email,
                IsLeadPax: idx === 0,
                PassportNo: isDomestic === "No" ? (p.PassportNo || "P1234567") : null,
                PassportExpiry: isDomestic === "No" ? (p.PassportExpiry || "2035-12-31T00:00:00") : null,
                Seat: p.Seat
            };
        });

        // 3. Save the Booking inside a Transaction
        const savedBooking = await prisma.$transaction(async (tx) => {
            // A. Create the master Booking record
            const booking = await tx.bookings.create({
                data: {
                    booking_id: `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    user_id: actualUserId,
                    booking_type: 'FLIGHT',
                    status: 'CONFIRMED',
                    total_amount: totalAmount,
                    currency: 'INR',
                }
            });

            console.log("Master Booking record created:", booking.booking_id);

            // B. Create the Flight Booking details record
            const flightBooking = await tx.flight_bookings.create({
                data: {
                    booking_id: booking.booking_id,
                    user_id: actualUserId,
                    provider_booking_id: parseInt(providerBookingId) || 0,
                    provider_order_id: 'UNKNOWN',
                    trace_id: traceId,
                    pnr: pnr,
                    validating_airline: flightSnapshot?.airlineCode || 'XX',
                    origin_airport: flightSnapshot?.from || 'XXX',
                    destination_airport: flightSnapshot?.to || 'XXX',
                    departure_date: flightSnapshot?.raw?.Segments?.[0]?.[0]?.Origin?.DepTime 
                                    ? new Date(flightSnapshot.raw.Segments[0][0].Origin.DepTime) 
                                    : new Date(),
                    total_fare: totalAmount,
                    offered_fare: totalAmount,
                    currency: 'INR',
                    ticket_status: ticketStatus,
                    booking_status: 'CONFIRMED',
                    is_lcc: isLCC || false,
                    total_passengers: enrichedPassengers?.length || 1,
                    distance_km: 0,
                    raw_response: {
                        adivaha: { mock: true },
                        adivahaTicketing: null,
                        passengers: enrichedPassengers.map((p, idx) => {
                            const seatSel    = ssrSelections?.seats?.find(s => s.paxIdx === idx);
                            return {
                                firstName:      p.FirstName,
                                lastName:       p.LastName,
                                gender:         p.Gender === 2 ? 'Female' : 'Male',
                                dob:            p.DateOfBirth || 'N/A',
                                passportNo:     p.PassportNo  || 'N/A',
                                passportExpiry: p.PassportExpiry || 'N/A',
                                seat:    seatSel    ? seatSel.code       : 'Auto-assigned',
                                meal:    'Standard Meal',
                                baggage: 'None',
                                seatPrice:    seatSel?.price    || 0,
                                mealPrice:    0,
                                baggagePrice: 0,
                                ticketStatus: ticketStatus,
                            };
                        }),
                        flightSnapshot: flightSnapshot
                    }
                }
            });

            console.log("Flight Booking record created:", flightBooking.booking_id);

            // C. Save Passengers
            if (enrichedPassengers && enrichedPassengers.length > 0) {
                const paxRows = enrichedPassengers.map((p, idx) => {
                    const seatSel    = ssrSelections?.seats?.find(s  => s.paxIdx === idx);
                    return {
                        booking_id:      booking.booking_id,
                        pax_index:       idx,
                        first_name:      p.FirstName,
                        last_name:       p.LastName,
                        gender:          p.Gender === 2 ? 'Female' : 'Male',
                        date_of_birth:   p.DateOfBirth   || null,
                        pax_type:        parseInt(p.PaxType, 10) || 1,
                        passport_no:     p.PassportNo    || null,
                        passport_expiry: p.PassportExpiry || null,
                        ticket_status:   ticketStatus,
                        seat_number:     seatSel    ? seatSel.code       : null,
                        seat_price:      seatSel    ? (seatSel.price    || 0) : 0,
                        meal_name:       null,
                        meal_price:      0,
                        baggage_weight:  null,
                        baggage_price:   0,
                    };
                });
                await tx.flight_booking_passengers.createMany({ data: paxRows });
                console.log("Passengers records created.");
            }

            return { booking, flightBooking };
        });

        console.log("Simulation Transaction Succeeded! Saved:", savedBooking);

        // Simulate save travellers profile records OUTSIDE the transaction
        if (actualUserId && enrichedPassengers && enrichedPassengers.length > 0) {
            const travellerRows = enrichedPassengers.map(pax => ({
                user_id:              actualUserId,
                title:                pax.Title,
                first_name:           pax.FirstName,
                last_name:            pax.LastName,
                gender:               pax.Gender === 2 ? 'Female' : 'Male',
                date_of_birth:        pax.DateOfBirth ? new Date(pax.DateOfBirth) : null,
                passport_number:      pax.PassportNo || null,
                passport_expiry_date: pax.PassportExpiry ? new Date(pax.PassportExpiry) : null,
            }));

            console.log("Attempting to write travellers profile records:", travellerRows);
            await prisma.travellers.createMany({ data: travellerRows, skipDuplicates: true });
            console.log("Travellers profile records created successfully.");
        }

    } catch (dbError) {
        console.error("SIMULATION FAILED WITH DATABASE ERROR:");
        console.error(dbError);
    } finally {
        await prisma.$disconnect();
    }
}

testConfirmSimulation();

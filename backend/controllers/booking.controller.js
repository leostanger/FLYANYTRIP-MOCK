const AdivahaFlightService = require('../integrations/adivaha/adivaha.service');
const prisma = require('../config/prisma');
const emailService = require('../services/email.service');
const pdfService = require('../services/pdf.service');
const { getInvoiceDocDefinition } = require('../utils/invoiceTemplate');

/**
 * Revalidate flight (Fare Quote)
 */
exports.revalidateBooking = async (req, res, next) => {
    try {
        const { traceId, resultIndex, EndUserIp } = req.body;
        
        if (!traceId || !resultIndex) {
            return res.status(400).json({ success: false, message: 'traceId and resultIndex are required' });
        }

        const adivahaRes = await AdivahaFlightService.getFlightFareQuote({
            TraceId: traceId,
            ResultIndex: resultIndex,
            EndUserIp: EndUserIp || '127.0.0.1' // Provide default IP if none passed
        });

        res.status(200).json({ success: true, data: adivahaRes });
    } catch (error) {
        console.error('Revalidate Booking Error:', error);
        res.status(500).json({ success: false, message: 'Failed to revalidate booking', error: error.message });
    }
};

/**
 * Confirm flight booking & save to Database
 */
exports.confirmBooking = async (req, res, next) => {
    try {
        const { 
            isLCC, 
            traceId, 
            resultIndex, 
            passengers, 
            contactDetails, 
            paymentData, 
            flightSnapshot,
            ssrSelections,
            totalAmount,
            userId // optional
        } = req.body;

        // Determine isoneway, isDomestic, and IsDomesticReturn
        let isoneway = "Yes";
        let isDomestic = "Yes";
        
        const segments = flightSnapshot?.raw?.Segments || [];
        if (segments.length > 1) {
            isoneway = "No";
        }

        if (flightSnapshot?.raw?.IsDomestic !== undefined) {
            isDomestic = flightSnapshot.raw.IsDomestic ? "Yes" : "No";
        } else if (segments.length > 0 && segments[0]?.length > 0) {
            const firstSeg = segments[0][0];
            const lastSegList = segments[segments.length - 1];
            const lastSeg = lastSegList?.[lastSegList.length - 1];
            
            const originCountry = firstSeg?.Origin?.Airport?.CountryCode || "IN";
            const destCountry = lastSeg?.Destination?.Airport?.CountryCode || "IN";
            
            isDomestic = (originCountry === "IN" && destCountry === "IN") ? "Yes" : "No";
        } else if (flightSnapshot?.from && flightSnapshot?.to) {
            const indianAirports = ['DEL', 'BOM', 'BLR', 'MAA', 'HYD', 'CCU', 'COK', 'AMD', 'PNQ', 'GOI', 'GOX', 'JAI', 'LKO', 'TRV', 'PAT', 'GAU', 'BBI', 'SXR', 'IXB', 'IXR', 'IDR', 'NAG', 'JDH', 'UDR', 'VTZ'];
            const isOriginInd = indianAirports.includes(flightSnapshot.from.toUpperCase());
            const isDestInd = indianAirports.includes(flightSnapshot.to.toUpperCase());
            isDomestic = (isOriginInd && isDestInd) ? "Yes" : "No";
        }
        
        const IsDomesticReturn = (isDomestic === "Yes" && isoneway === "No") ? "Yes" : "No";

        // Utility to parse date strings (e.g. DD/MM/YYYY or DD-MM-YYYY) into YYYY-MM-DD
        const parseDateString = (dateStr) => {
            if (!dateStr || typeof dateStr !== 'string') return dateStr;
            const parts = dateStr.split(/[\/\-]/);
            if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
        };

        // Enrich passengers data for Adivaha API schema validation
        const departureDateStr = flightSnapshot?.raw?.Segments?.[0]?.[0]?.Origin?.DepTime || new Date().toISOString();
        const departureDate = new Date(departureDateStr);

        const enrichedPassengers = (passengers || []).map((p, idx) => {
            const title = (p.Title || "Mr").replace(/\./g, "").trim();

            let gender = 1;
            const titleLower = title.toLowerCase();
            if (["mr", "mstr", "master"].includes(titleLower)) {
                gender = 1;
            } else if (["mrs", "ms", "miss"].includes(titleLower)) {
                gender = 2;
            } else if (p.Gender) {
                gender = Number(p.Gender) === 2 ? 2 : 1;
            }

            let paxType = "1";
            let dobStr = parseDateString(p.DateOfBirth || "1990-01-01");
            if (dobStr.includes("T")) {
                dobStr = dobStr.split("T")[0] + "T00:00:00";
            } else {
                dobStr = dobStr + "T00:00:00";
            }

            try {
                const dob = new Date(dobStr);
                if (!isNaN(dob.getTime())) {
                    let age = departureDate.getFullYear() - dob.getFullYear();
                    const m = departureDate.getMonth() - dob.getMonth();
                    if (m < 0 || (m === 0 && departureDate.getDate() < dob.getDate())) {
                        age--;
                    }
                    if (age < 2) paxType = "3";
                    else if (age < 12) paxType = "2";
                    else paxType = "1";
                }
            } catch (dobErr) {
                console.warn("Failed to parse DOB for age calculation:", dobStr);
            }

            const email = p.Email || contactDetails?.Email || "guest@flyanytrip.com";
            const contactNo = p.ContactNo || contactDetails?.ContactNo || "9999999999";
            
            const addressLine1 = p.AddressLine1 || contactDetails?.AddressLine1 || "Street Address";
            const addressLine2 = p.AddressLine2 || contactDetails?.AddressLine2 || "";
            const city = p.City || contactDetails?.City || "Delhi";
            const countryCode = p.CountryCode || contactDetails?.CountryCode || "IN";
            const countryName = p.CountryName || contactDetails?.CountryName || "India";
            const nationality = p.Nationality || contactDetails?.Nationality || "IN";

            const isLeadPax = idx === 0;

            let passportExpiryStr = null;
            if (isDomestic === "No") {
                const rawExpiry = p.PassportExpiry || "2035-12-31";
                const parsedExpiry = parseDateString(rawExpiry);
                passportExpiryStr = parsedExpiry.includes("T") ? parsedExpiry.split("T")[0] + "T00:00:00" : parsedExpiry + "T00:00:00";
            }

            return {
                Title: title,
                FirstName: p.FirstName || "Rahul",
                LastName: p.LastName || "Sharma",
                PaxType: paxType,
                DateOfBirth: dobStr,
                Gender: gender,
                AddressLine1: addressLine1,
                AddressLine2: addressLine2,
                City: city,
                CountryCode: countryCode.toUpperCase(),
                CountryName: countryName,
                Nationality: nationality.toUpperCase(),
                ContactNo: contactNo,
                Email: email,
                IsLeadPax: isLeadPax,
                PassportNo: isDomestic === "No" ? (p.PassportNo || "P1234567") : null,
                PassportExpiry: passportExpiryStr,
                Seat: p.Seat
            };
        });

        // 1. Call Adivaha API to book/hold the ticket
        let adivahaRes;
        try {
            adivahaRes = await AdivahaFlightService.bookFlight({
                isLCC,
                TraceId: traceId,
                ResultIndex: resultIndex,
                Passengers: enrichedPassengers,
                ContactDetails: contactDetails,
                isoneway,
                isDomestic,
                IsDomesticReturn
            });
        } catch (adivahaError) {
            console.error('Adivaha bookFlight call failed:', adivahaError);
            return res.status(400).json({
                success: false,
                message: 'Adivaha Booking Failed',
                error: adivahaError.message
            });
        }

        // Extract PNR and Booking ID from Adivaha Response
        let responseData = adivahaRes?.responseData?.Response || adivahaRes?.Response || adivahaRes;
        
        // If the booking fails from Adivaha side
        if (responseData?.Error?.ErrorCode !== 0 && responseData?.Error?.ErrorCode !== undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Adivaha Booking Failed', 
                error: responseData.Error 
            });
        }

        let pnr = responseData?.PNR || (responseData?.BookingId ? String(responseData.BookingId) : null);
        let providerBookingId = responseData?.BookingId || null;
        let ticketStatus = responseData?.TicketStatus || (isLCC ? 'TICKETED' : 'BOOKED');
        let ticketingRes = null;

        // 1.5. For Non-LCC flights, trigger step 2: Ticketing (issueNonLccTicket)
        if (!isLCC && providerBookingId && pnr) {
            try {
                ticketingRes = await AdivahaFlightService.issueNonLccTicket({
                    PNR: pnr,
                    BookingId: providerBookingId,
                    order_id: `ORD-${Date.now()}`,
                    TraceId: traceId,
                    isoneway,
                    isDomestic,
                    IsDomesticReturn,
                    Passengers: enrichedPassengers
                });

                const ticketResData = ticketingRes?.responseData?.Response || ticketingRes?.Response || ticketingRes;

                if (ticketResData?.Error?.ErrorCode !== 0 && ticketResData?.Error?.ErrorCode !== undefined) {
                    console.error('Adivaha Non-LCC Ticketing Failed:', ticketResData.Error);
                    ticketStatus = 'HOLD_TICKET_FAILED';
                } else {
                    if (ticketResData?.PNR) pnr = ticketResData.PNR;
                    if (ticketResData?.BookingId) providerBookingId = ticketResData.BookingId;
                    ticketStatus = 'TICKETED';
                }
            } catch (ticketingError) {
                console.error('Adivaha Non-LCC Ticketing request error:', ticketingError);
                ticketStatus = 'HOLD_TICKET_FAILED';
            }
        }

        // 2. Find or Create User if not logged in
        let actualUserId = userId ? parseInt(userId, 10) : null;
        let savedBooking;

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
                            first_name: enrichedPassengers?.[0]?.FirstName || 'Guest',
                            last_name: enrichedPassengers?.[0]?.LastName || 'User',
                            user_type: 'GUEST'
                        }
                    });
                }
                actualUserId = user.id;
            }

            // 3. Save the Booking to Prisma Database inside a Transaction
            savedBooking = await prisma.$transaction(async (tx) => {
                // A. Create the master Booking record
                const booking = await tx.bookings.create({
                    data: {
                        booking_id: `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Generate unique booking ID
                        user_id: actualUserId,
                        booking_type: 'FLIGHT',
                        status: 'CONFIRMED',
                        total_amount: totalAmount || (flightSnapshot?.price ? parseFloat(String(flightSnapshot.price).replace(/,/g, '')) : 0),
                        currency: 'INR',
                    }
                });

                // B. Create the Flight Booking details record
                const flightBooking = await tx.flight_bookings.create({
                    data: {
                        booking_id: booking.booking_id,
                        user_id: actualUserId,
                        provider_booking_id: parseInt(providerBookingId) || 0,
                        provider_order_id: paymentData?.razorpay_order_id || 'UNKNOWN',
                        trace_id: traceId,
                        pnr: pnr,
                        validating_airline: flightSnapshot?.airlineCode || 'XX',
                        origin_airport: flightSnapshot?.from || 'XXX',
                        destination_airport: flightSnapshot?.to || 'XXX',
                        departure_date: flightSnapshot?.raw?.Segments?.[0]?.[0]?.Origin?.DepTime 
                                        ? new Date(flightSnapshot.raw.Segments[0][0].Origin.DepTime) 
                                        : new Date(),
                        total_fare: totalAmount || (flightSnapshot?.price ? parseFloat(String(flightSnapshot.price).replace(/,/g, '')) : 0),
                        offered_fare: totalAmount || (flightSnapshot?.price ? parseFloat(String(flightSnapshot.price).replace(/,/g, '')) : 0),
                        currency: 'INR',
                        ticket_status: ticketStatus,
                        booking_status: 'CONFIRMED',
                        is_lcc: isLCC || false,
                        total_passengers: enrichedPassengers?.length || 1,
                        distance_km: 0,
                        raw_response: {
                            adivaha: adivahaRes,
                            adivahaTicketing: ticketingRes,
                            passengers: enrichedPassengers.map((p, idx) => {
                                const seatSel    = ssrSelections?.seats?.find(s => s.paxIdx === idx);
                                const mealSel    = ssrSelections?.meals?.find(m => m.paxIdx === idx);
                                const baggageSel = ssrSelections?.baggage?.find(b => b.paxIdx === idx);
                                return {
                                    firstName:      p.FirstName,
                                    lastName:       p.LastName,
                                    gender:         p.Gender === 2 ? 'Female' : 'Male',
                                    dob:            p.DateOfBirth || 'N/A',
                                    passportNo:     p.PassportNo  || 'N/A',
                                    passportExpiry: p.PassportExpiry || 'N/A',
                                    seat:    seatSel    ? seatSel.code       : 'Auto-assigned',
                                    meal:    mealSel    ? mealSel.name       : 'Standard Meal',
                                    baggage: baggageSel ? baggageSel.weight  : 'None',
                                    seatPrice:    seatSel?.price    || 0,
                                    mealPrice:    mealSel?.price    || 0,
                                    baggagePrice: baggageSel?.price || 0,
                                    ticketStatus: ticketStatus,
                                };
                            }),
                            flightSnapshot: flightSnapshot
                        }
                    }
                });

                // C. Save SSR (Seat, Meal, Baggage) per passenger — dedicated table rows
                if (enrichedPassengers && enrichedPassengers.length > 0) {
                    const paxRows = enrichedPassengers.map((p, idx) => {
                        const seatSel    = ssrSelections?.seats?.find(s  => s.paxIdx === idx);
                        const mealSel    = ssrSelections?.meals?.find(m  => m.paxIdx === idx);
                        const baggageSel = ssrSelections?.baggage?.find(b => b.paxIdx === idx);
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
                            meal_name:       mealSel    ? mealSel.name       : null,
                            meal_price:      mealSel    ? (mealSel.price    || 0) : 0,
                            baggage_weight:  baggageSel ? baggageSel.weight  : null,
                            baggage_price:   baggageSel ? (baggageSel.price || 0) : 0,
                        };
                    });
                    await tx.flight_booking_passengers.createMany({ data: paxRows });
                }

                // D. Save travellers profile records OUTSIDE the transaction (non-critical)
                // Moved outside to avoid transaction timeout — see createMany call below
                return { booking, flightBooking };
            }, {
                maxWait: 15000, // Wait up to 15 seconds to acquire database connection from pool
                timeout: 30000 // 30 second timeout — prevents 500 error on slow Adivaha responses
            });

            // D. Save travellers profile records OUTSIDE the transaction (non-critical)
            // Using fire-and-forget createMany so it never blocks the booking response
            if (actualUserId && enrichedPassengers && enrichedPassengers.length > 0) {
                const travellerRows = enrichedPassengers.map(pax => {
                    let dobDate = null;
                    if (pax.DateOfBirth) {
                        const d = new Date(pax.DateOfBirth);
                        if (!isNaN(d.getTime())) dobDate = d;
                    }
                    let expiryDate = null;
                    if (pax.PassportExpiry) {
                        const d = new Date(pax.PassportExpiry);
                        if (!isNaN(d.getTime())) expiryDate = d;
                    }
                    return {
                        user_id:              actualUserId,
                        title:                pax.Title,
                        first_name:           pax.FirstName,
                        last_name:            pax.LastName,
                        gender:               pax.Gender === 2 ? 'Female' : 'Male',
                        date_of_birth:        dobDate,
                        passport_number:      pax.PassportNo || null,
                        passport_expiry_date: expiryDate,
                    };
                });

                prisma.travellers.createMany({ data: travellerRows, skipDuplicates: true })
                    .catch(err => console.warn('Non-critical: travellers save failed:', err.message));
            }

        } catch (dbError) {
            const fs = require('fs');
            const path = require('path');
            fs.appendFileSync(path.join(__dirname, '../error_log.txt'), `[DB ERROR] ${new Date().toISOString()}: ${dbError.stack || dbError.message}\n`);
            console.error('Database connection/query failed:', dbError.message);
            return res.status(500).json({
                success: false,
                message: 'Failed to save booking to database',
                error: dbError.message
            });
        }

        // 4. Generate PDF Invoice and Send Email (Awaited for serverless compatibility)
        if (contactDetails?.Email) {
            try {
        console.log(`Starting invoice generation for PNR: ${pnr}...`);
                
                // Compute SSR totals for invoice line items
                const ssrSeatTotal  = ssrSelections?.seats?.reduce((acc, s) => acc + (s?.price  || 0), 0) || 0;
                const ssrMealTotal  = ssrSelections?.meals?.reduce((acc, m) => acc + (m?.price  || 0), 0) || 0;
                const ssrBagTotal   = ssrSelections?.baggage?.reduce((acc, b) => acc + (b?.price || 0), 0) || 0;
                const ssrCharges    = ssrSeatTotal + ssrMealTotal + ssrBagTotal;

                // Build per-passenger SSR lookup for the invoice template
                const ssrPerPassenger = passengers.map((p, idx) => ({
                    seat:    ssrSelections?.seats?.find(s  => s.paxIdx  === idx)?.code   || 'Auto-assigned',
                    meal:    ssrSelections?.meals?.find(m  => m.paxIdx  === idx)?.name   || 'Standard Meal',
                    baggage: ssrSelections?.baggage?.find(b => b.paxIdx === idx)?.weight || 'None',
                }));

                // Format data for the invoice template
                const invoiceData = {
                    pnr: pnr,
                    bookingId: savedBooking.booking.booking_id,
                    bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                    passengers: passengers.map((p, idx) => ({
                        firstName:      p.FirstName,
                        lastName:       p.LastName,
                        gender:         p.Gender === 1 ? 'Male' : 'Female',
                        dob:            p.DateOfBirth || 'N/A',
                        passportNo:     p.PassportNo  || 'N/A',
                        passportExpiry: p.PassportExpiry || 'N/A',
                        seat:           ssrSelections?.seats?.find(s  => s.paxIdx  === idx)?.code   || 'Auto-assigned',
                        meal:           ssrSelections?.meals?.find(m  => m.paxIdx  === idx)?.name   || 'Standard Meal',
                        baggage:        ssrSelections?.baggage?.find(b => b.paxIdx === idx)?.weight || 'None',
                        ticketStatus:   ticketStatus,
                    })),
                    ssrPerPassenger,
                    ssrCharges,
                    ssrSeatTotal,
                    ssrMealTotal,
                    ssrBagTotal,
                    origin:         flightSnapshot?.from || 'Origin',
                    destination:    flightSnapshot?.to   || 'Destination',
                    departureDate:  flightSnapshot?.raw?.Segments?.[0]?.[0]?.Origin?.DepTime
                        ? new Date(flightSnapshot.raw.Segments[0][0].Origin.DepTime).toLocaleString()
                        : 'Date not available',
                    airline:        flightSnapshot?.airlineCode || 'Airline',
                    flightNumber:   flightSnapshot?.raw?.Segments?.[0]?.[0]?.Airline?.FlightNumber || 'XX-000',
                    cabinClass:     flightSnapshot?.class || 'Economy',
                    segments:       flightSnapshot?.raw?.Segments?.[0] || [],
                    totalFare:      savedBooking.booking.total_amount,
                    baseFare:       flightSnapshot?.raw?.Fare?.BaseFare   || Math.round(savedBooking.booking.total_amount * 0.7),
                    taxes:          flightSnapshot?.raw?.Fare?.Tax         || Math.round(savedBooking.booking.total_amount * 0.3),
                    status:         'CONFIRMED',
                    contactEmail:   contactDetails.Email,
                    contactPhone:   contactDetails.ContactNo,
                    gstNumber:      contactDetails.GSTNumber || contactDetails.GstNumber || 'N/A',
                    state:          contactDetails.State || 'N/A',
                };

                const docDefinition = getInvoiceDocDefinition(invoiceData);
                let pdfBuffer = null;
                try {
                    pdfBuffer = await pdfService.generatePDF(docDefinition);
                } catch (pdfErr) {
                    console.error('Error generating PDF invoice:', pdfErr.message);
                }
                
                await emailService.sendInvoiceEmail(contactDetails.Email, invoiceData, pdfBuffer);
                
            } catch (emailError) {
                console.error('Error generating/sending invoice email:', emailError.message);
            }
        }

        res.status(200).json({ 
            success: true, 
            message: 'Booking confirmed successfully', 
            data: savedBooking,
            adivahaData: adivahaRes
        });

    } catch (error) {
        const fs = require('fs');
        const path = require('path');
        fs.appendFileSync(path.join(__dirname, '../error_log.txt'), `[CONFIRM ERROR] ${new Date().toISOString()}: ${error.stack || error.message}\n`);
        console.error('Confirm Booking Error:', error);
        res.status(500).json({ success: false, message: 'Failed to confirm booking', error: error.message });
    }
};

/**
 * Get Booking Details
 */
exports.getBookingDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        let booking = await prisma.bookings.findUnique({
            where: { booking_id: id },
            include: {
                flight_bookings: true,
                users: {
                    select: { first_name: true, last_name: true, email: true, phone: true }
                }
            }
        });

        // Fallback: search by airline PNR if not found by booking_id
        if (!booking) {
            const flightBooking = await prisma.flight_bookings.findFirst({
                where: { pnr: { equals: id, mode: 'insensitive' } },
                include: {
                    bookings: {
                        include: {
                            users: {
                                select: { first_name: true, last_name: true, email: true, phone: true }
                            }
                        }
                    }
                }
            });

            if (flightBooking && flightBooking.bookings) {
                booking = flightBooking.bookings;
                booking.flight_bookings = flightBooking;
            }
        }

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Compatibility mapping for frontend flight_data expectation
        if (booking.flight_bookings) {
            const fb = booking.flight_bookings;
            const snapshot = fb.raw_response?.flightSnapshot || {};
            booking.flight_data = {
                airline: snapshot.airline || fb.validating_airline || 'Airline',
                flight: snapshot.flight || fb.pnr || 'Flight',
                time: snapshot.time || (fb.departure_date ? new Date(fb.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00'),
                arrival: snapshot.arrival || '00:00',
                from: fb.origin_airport || 'DEL',
                to: fb.destination_airport || 'BOM',
                dur: snapshot.dur || '2h',
                price: fb.total_fare ? Number(fb.total_fare) : 0
            };
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error('Get Booking Details Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch booking details', error: error.message });
    }
};

/**
 * Helper to parse actual cancellation penalty from saved flight raw response snapshot
 */
const extractCancellationPenalty = (flightBooking) => {
    try {
        const rawResponse = flightBooking?.raw_response || {};
        const snapshot = rawResponse.flightSnapshot || {};
        const penaltyCharges = snapshot.PenaltyCharges || 
                               snapshot.raw?.PenaltyCharges || 
                               rawResponse.adivaha?.responseData?.Response?.FlightItinerary?.PenaltyCharges || 
                               {};
        
        let penalty = 0;
        if (penaltyCharges.CancellationCharge) {
            const cleanStr = String(penaltyCharges.CancellationCharge).replace(/[^0-9]/g, '');
            if (cleanStr) {
                penalty = parseInt(cleanStr, 10);
            }
        }

        // Try from MiniFareRules details
        if (penalty === 0) {
            const miniFareRules = snapshot.MiniFareRules || snapshot.raw?.MiniFareRules || [];
            if (Array.isArray(miniFareRules) && miniFareRules[0]) {
                const rulesList = miniFareRules[0];
                if (Array.isArray(rulesList)) {
                    const cancelRules = rulesList.filter(r => r.Type === 'Cancellation' || r.type === 'Cancellation');
                    // Prefer numeric rule (e.g. INR 3500) over percentage rule (e.g. 100%) if multiple rules exist
                    const numericRule = cancelRules.find(r => r.Details && r.Details.includes('INR'));
                    const matchedRule = numericRule || cancelRules[0];

                    if (matchedRule && matchedRule.Details) {
                        if (matchedRule.Details.includes('%')) {
                            const pct = parseInt(matchedRule.Details.replace(/[^0-9]/g, ''), 10) || 100;
                            penalty = Math.round((parseFloat(flightBooking?.total_fare || 0) * pct) / 100);
                        } else {
                            const cleanStr = String(matchedRule.Details).replace(/[^0-9]/g, '');
                            if (cleanStr) {
                                penalty = parseInt(cleanStr, 10);
                            }
                        }
                    }
                }
            }
        }

        // Try from ticketAdvisory
        if (penalty === 0) {
            const ticketAdvisory = snapshot.TicketAdvisory || snapshot.raw?.TicketAdvisory || '';
            if (ticketAdvisory.toLowerCase().includes('non-refundable')) {
                penalty = parseFloat(flightBooking?.total_fare || 0);
            }
        }

        return penalty;
    } catch (err) {
        console.error('Error parsing cancellation penalty:', err);
        return 0;
    }
};

/**
 * Get flight cancellation charges from Adivaha
 */
exports.getCancellationCharges = async (req, res, next) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        // Fetch flight booking details
        let providerBookingId = null;
        let flightBooking = null;

        try {
            flightBooking = await prisma.flight_bookings.findUnique({
                where: { booking_id: bookingId }
            });
            if (flightBooking) {
                providerBookingId = flightBooking.provider_booking_id;
            }
        } catch (dbErr) {
            console.warn('Database error fetching booking details for cancellation charges:', dbErr.message);
        }

        // If database is offline, booking not found, or it's a test booking (provider_booking_id is 0)
        if (!flightBooking || !providerBookingId || Number(providerBookingId) === 0) {
            return res.status(400).json({
                success: false,
                message: 'Booking not found or not eligible for cancellation via provider (test booking)'
            });
        }

        // Call Adivaha API
        let adivahaRes;
        try {
            adivahaRes = await AdivahaFlightService.getCancellationCharges({
                BookingId: providerBookingId,
                RequestType: 1 // Full cancellation
            });

            // Check if Adivaha returned an error response
            const innerResponse = adivahaRes?.responseData?.Response || adivahaRes?.Response || adivahaRes;
            if (innerResponse?.Error?.ErrorCode !== 0 && innerResponse?.Error?.ErrorCode !== undefined) {
                throw new Error(innerResponse.Error.ErrorMessage || 'Adivaha returned error code');
            }
            if (innerResponse?.ResponseStatus !== 1 && innerResponse?.ResponseStatus !== undefined) {
                throw new Error('Adivaha response status is not successful');
            }
        } catch (apiErr) {
            console.error('Adivaha getCancellationCharges call failed:', apiErr.message);
            return res.status(400).json({
                success: false,
                message: 'Failed to fetch cancellation charges from provider',
                error: apiErr.message
            });
        }

        res.status(200).json({ success: true, data: adivahaRes });
    } catch (error) {
        console.error('Get Cancellation Charges Error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve cancellation charges', error: error.message });
    }
};

/**
 * Request flight booking cancellation from Adivaha
 */
exports.requestCancellation = async (req, res, next) => {
    try {
        const { bookingId, remarks, endUserIp, cancellationCharge = 0, refundAmount = 0 } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        // Fetch flight booking details (including user email via join)
        let flightBooking = null;
        let bookingUserEmail = null;
        try {
            flightBooking = await prisma.flight_bookings.findUnique({
                where: { booking_id: bookingId },
                include: {
                    bookings: {
                        include: { users: { select: { email: true, first_name: true, last_name: true } } }
                    }
                }
            });
            bookingUserEmail = flightBooking?.bookings?.users?.email || null;
        } catch (dbErr) {
            console.warn('Database error fetching booking details for cancellation:', dbErr.message);
        }

        // If no booking found, or if it is a mock/test booking with providerBookingId = 0
        const providerBookingId = flightBooking?.provider_booking_id;
        if (!flightBooking || !providerBookingId || Number(providerBookingId) === 0) {
            return res.status(400).json({
                success: false,
                message: 'Booking not found or not eligible for cancellation via provider (test booking)'
            });
        }

        // Extract required data for ticketCancel action
        const rawRes = flightBooking.raw_response?.adivaha || {};
        const responseData = rawRes.responseData?.Response || rawRes.Response || rawRes;
        
        const adivahaOrderId = responseData.OrderId || responseData.order_id || responseData.BookingId || flightBooking.provider_order_id;

        // Sectors (from db fields origin_airport, destination_airport)
        const sectors = [
            {
                Origin: flightBooking.origin_airport || 'DEL',
                Destination: flightBooking.destination_airport || 'BOM'
            }
        ];

        // Extract TicketIds
        let ticketIds = [];
        const passengers = responseData.FlightItinerary?.Passenger || responseData.Passenger || [];
        if (Array.isArray(passengers)) {
            passengers.forEach(p => {
                if (p.Ticket?.TicketId) ticketIds.push(p.Ticket.TicketId);
                else if (p.TicketId) ticketIds.push(p.TicketId);
            });
        }
        if (ticketIds.length === 0 && Array.isArray(flightBooking.raw_response?.passengers)) {
            flightBooking.raw_response.passengers.forEach(p => {
                if (p.ticketId) ticketIds.push(p.ticketId);
            });
        }

        // Call Adivaha API to request cancellation
        let adivahaRes;
        let apiFailed = false;
        try {
            adivahaRes = await AdivahaFlightService.cancelBooking({
                order_id: adivahaOrderId,
                ChangeRequestData: {
                    BookingId: providerBookingId,
                    RequestType: 1, // Full cancellation
                    CancellationType: 0, // No specific sub-type
                    Sectors: sectors,
                    TicketId: ticketIds,
                    Remarks: remarks || 'Customer request via FlyAnyTrip website',
                    EndUserIp: endUserIp || '127.0.0.1'
                }
            });
        } catch (apiErr) {
            console.error('Adivaha cancelBooking call failed:', apiErr);
            return res.status(400).json({
                success: false,
                message: 'Failed to request cancellation from provider',
                error: apiErr.message
            });
        }

        const adivahaResponseData = adivahaRes?.responseData?.Response || adivahaRes?.Response || adivahaRes;
        
        // If Adivaha API returns an error, pass the error along
        if (adivahaResponseData?.Error?.ErrorCode !== 0 && adivahaResponseData?.Error?.ErrorCode !== undefined) {
            console.error('Adivaha cancelBooking returned an error:', adivahaResponseData.Error.ErrorMessage);
            return res.status(400).json({
                success: false,
                message: 'Adivaha Cancellation Failed',
                error: adivahaResponseData.Error
            });
        }

        const changeRequestId = adivahaResponseData.ChangeRequestId || adivahaResponseData.changeRequestId || Math.floor(100000 + Math.random() * 900000);
        const status = adivahaResponseData.Status || 'Cancelled';
        const isCancelled = status === 'Cancelled' || status === 'CANCELLED';
        const finalStatus = isCancelled ? 'CANCELLED' : 'CANCEL_REQUESTED';

        // Update database records
        try {
            await prisma.$transaction([
                prisma.bookings.update({
                    where: { booking_id: bookingId },
                    data: { status: finalStatus }
                }),
                prisma.flight_bookings.update({
                    where: { booking_id: bookingId },
                    data: {
                        booking_status: finalStatus,
                        ticket_status: finalStatus,
                        raw_response: {
                            ...(flightBooking.raw_response || {}),
                            cancellation: {
                                changeRequestId,
                                remarks: remarks || '',
                                requestedAt: new Date().toISOString(),
                                response: adivahaRes,
                                apiFailed
                            }
                        }
                    }
                })
            ]);
        } catch (dbUpdateErr) {
            console.error('Database update failed after cancellation:', dbUpdateErr.message);
        }

        // Send cancellation confirmation email
        if (bookingUserEmail) {
            try {
                const snapshot = flightBooking?.raw_response?.flightSnapshot || {};
                const paxList = (flightBooking?.raw_response?.passengers || []).map(p => ({
                    firstName: p.firstName,
                    lastName: p.lastName,
                    paxType: 'Adult'
                }));
                await emailService.sendCancellationEmail(bookingUserEmail, {
                    passengerName: paxList[0] ? `${paxList[0].firstName} ${paxList[0].lastName}` : 'Traveler',
                    pnr: flightBooking?.pnr || 'N/A',
                    bookingId,
                    origin: flightBooking?.origin_airport || 'N/A',
                    destination: flightBooking?.destination_airport || 'N/A',
                    departureDate: flightBooking?.departure_date
                        ? new Date(flightBooking.departure_date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                        : 'N/A',
                    airline: snapshot?.airlineCode || 'N/A',
                    flightNumber: snapshot?.raw?.Segments?.[0]?.[0]?.Airline?.FlightNumber || 'N/A',
                    totalFare: Number(flightBooking?.total_fare || 0),
                    cancellationCharge: Number(cancellationCharge),
                    refundAmount: Number(refundAmount),
                    changeRequestId,
                    cancelledAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                    remarks: remarks || '',
                    passengers: paxList,
                });
            } catch (emailErr) {
                console.error('Failed to send cancellation email:', emailErr.message);
            }
        }

        res.status(200).json({
            success: true,
            message: isCancelled ? 'Booking cancelled successfully' : 'Cancellation request submitted successfully',
            data: adivahaRes
        });

    } catch (error) {
        console.error('Request Cancellation Error:', error);
        res.status(500).json({ success: false, message: 'Failed to request booking cancellation', error: error.message });
    }
};

/**
 * Check flight booking cancellation status from Adivaha
 */
exports.getCancellationStatus = async (req, res, next) => {
    try {
        const { bookingId, changeRequestId } = req.body;
        if (!bookingId || !changeRequestId) {
            return res.status(400).json({ success: false, message: 'Booking ID and Change Request ID are required' });
        }

        // Fetch flight booking details
        let flightBooking = null;
        try {
            flightBooking = await prisma.flight_bookings.findUnique({
                where: { booking_id: bookingId }
            });
        } catch (dbErr) {
            console.warn('Database error fetching booking details for status check:', dbErr.message);
        }

        if (!flightBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Call Adivaha API
        let adivahaRes;
        try {
            adivahaRes = await AdivahaFlightService.getCancellationStatus({
                ChangeRequestId: changeRequestId
            });
        } catch (apiErr) {
            console.error('Adivaha checkChangeStatus call failed:', apiErr);
            return res.status(400).json({
                success: false,
                message: 'Failed to retrieve cancellation status from provider',
                error: apiErr.message
            });
        }

        const adivahaResponseData = adivahaRes?.responseData?.Response || adivahaRes?.Response || adivahaRes;

        if (adivahaResponseData?.Error?.ErrorCode === 0 || adivahaResponseData?.Error?.ErrorCode === undefined) {
            const status = adivahaResponseData.Status || '';
            const isCancelled = status === 'Cancelled' || status === 'CANCELLED';
            
            if (isCancelled && flightBooking.booking_status !== 'CANCELLED') {
                try {
                    await prisma.$transaction([
                        prisma.bookings.update({
                            where: { booking_id: bookingId },
                            data: { status: 'CANCELLED' }
                        }),
                        prisma.flight_bookings.update({
                            where: { booking_id: bookingId },
                            data: {
                                booking_status: 'CANCELLED',
                                ticket_status: 'CANCELLED',
                                raw_response: {
                                    ...(flightBooking.raw_response || {}),
                                    cancellation_update: {
                                        checkedAt: new Date().toISOString(),
                                        response: adivahaRes
                                    }
                                }
                            }
                        })
                    ]);
                } catch (dbUpdateErr) {
                    console.error('Database update failed on status check:', dbUpdateErr.message);
                }
            }
        }

        res.status(200).json({ success: true, data: adivahaRes });
    } catch (error) {
        console.error('Get Cancellation Status Error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve cancellation status', error: error.message });
    }
};

/**
 * Download booking invoice as PDF
 */
exports.downloadInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;
        let invoiceData;

        try {
            const booking = await prisma.bookings.findUnique({
                where: { booking_id: id },
                include: {
                    flight_bookings: {
                        include: {
                            passengers: {          // flight_booking_passengers rows
                                orderBy: { pax_index: 'asc' }
                            }
                        }
                    },
                    users: {
                        select: { first_name: true, last_name: true, email: true, phone: true }
                    }
                }
            });


            if (booking && booking.flight_bookings) {
                const fb = booking.flight_bookings;

                // Primary: rows from flight_booking_passengers table
                // Fallback: legacy raw_response.passengers JSON (older bookings)
                let savedPassengers;
                if (fb.passengers && fb.passengers.length > 0) {
                    savedPassengers = fb.passengers.map(p => ({
                        firstName:    p.first_name    || '',
                        lastName:     p.last_name     || '',
                        gender:       p.gender        || 'Male',
                        dob:          p.date_of_birth || 'N/A',
                        passportNo:   p.passport_no   || 'N/A',
                        passportExpiry: p.passport_expiry || 'N/A',
                        seat:         p.seat_number   || 'Auto-assigned',
                        meal:         p.meal_name     || 'Standard Meal',
                        baggage:      p.baggage_weight || 'None',
                        seatPrice:    parseFloat(p.seat_price    || 0),
                        mealPrice:    parseFloat(p.meal_price    || 0),
                        baggagePrice: parseFloat(p.baggage_price || 0),
                        ticketStatus: p.ticket_status || fb.ticket_status || 'CONFIRMED',
                    }));
                } else {
                    // Legacy fallback — normalise old raw_response shape
                    const raw = fb.raw_response?.passengers || [];
                    savedPassengers = raw.length > 0 ? raw.map(p => ({
                        firstName:    p.firstName    || '',
                        lastName:     p.lastName     || '',
                        gender:       p.gender       || 'Male',
                        dob:          p.dob          || 'N/A',
                        passportNo:   p.passportNo   || 'N/A',
                        passportExpiry: p.passportExpiry || 'N/A',
                        seat:         p.seat         || 'Auto-assigned',
                        meal:         p.meal         || 'Standard Meal',
                        baggage:      p.baggage      || 'None',
                        seatPrice:    p.seatPrice    || 0,
                        mealPrice:    p.mealPrice    || 0,
                        baggagePrice: p.baggagePrice || 0,
                        ticketStatus: p.ticketStatus || fb.ticket_status || 'CONFIRMED',
                    })) : [{
                        firstName:    booking.users?.first_name || 'Guest',
                        lastName:     booking.users?.last_name  || 'User',
                        gender:       'Male',
                        dob:          'N/A',
                        passportNo:   'N/A',
                        passportExpiry: 'N/A',
                        seat:         'Auto-assigned',
                        meal:         'Standard Meal',
                        baggage:      'None',
                        seatPrice: 0, mealPrice: 0, baggagePrice: 0,
                        ticketStatus: fb.ticket_status || 'CONFIRMED',
                    }];
                }

                const ssrSeatTotal = savedPassengers.reduce((acc, p) => acc + (p.seatPrice    || 0), 0);
                const ssrMealTotal = savedPassengers.reduce((acc, p) => acc + (p.mealPrice    || 0), 0);
                const ssrBagTotal  = savedPassengers.reduce((acc, p) => acc + (p.baggagePrice || 0), 0);
                const ssrCharges   = ssrSeatTotal + ssrMealTotal + ssrBagTotal;

                const rawTotal = booking.total_amount ? parseFloat(booking.total_amount) : 0;

                invoiceData = {

                    pnr:          fb.pnr || 'PENDING',
                    bookingId:    booking.booking_id,
                    bookingDate:  new Date(booking.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                    passengers:   savedPassengers,
                    ssrSeatTotal,
                    ssrMealTotal,
                    ssrBagTotal,
                    ssrCharges,
                    origin:       fb.origin_airport      || 'Origin',
                    destination:  fb.destination_airport || 'Destination',
                    departureDate: fb.departure_date ? new Date(fb.departure_date).toLocaleString() : 'Date not available',
                    airline:      fb.validating_airline  || 'Airline',
                    flightNumber: fb.raw_response?.flightSnapshot?.raw?.Segments?.[0]?.[0]?.Airline?.FlightNumber || 'XX-000',
                    cabinClass:   fb.raw_response?.flightSnapshot?.class || 'Economy',
                    segments:     fb.raw_response?.flightSnapshot?.raw?.Segments?.[0] || [],
                    totalFare:    rawTotal,
                    baseFare:     Math.round(rawTotal * 0.7),
                    taxes:        Math.round(rawTotal * 0.3),
                    status:       booking.status || 'CONFIRMED',
                    contactEmail: booking.users?.email || 'customer@flyanytrip.com',
                    contactPhone: booking.users?.phone || 'N/A',
                    gstNumber:    'N/A',
                    state:        'N/A',
                };
            }
        } catch (dbErr) {
            console.warn('Database offline during invoice download. Falling back to mock generator:', dbErr.message);
        }

        // Fallback mock invoice data if database query failed or returned null
        if (!invoiceData) {
            invoiceData = {
                pnr: `ATP${Math.floor(100000 + Math.random() * 900000)}`,
                bookingId: id,
                bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                passengers: [
                    {
                        firstName: 'Emma',
                        lastName: 'Watson',
                        gender: 'Female',
                        dob: '1990-04-15',
                        passportNo: 'N/A',
                        passportExpiry: 'N/A',
                        meal: 'Standard',
                        baggage: '15 KGs',
                        seat: 'Unassigned',
                        ticketStatus: 'CONFIRMED'
                    }
                ],
                origin: 'BOM',
                destination: 'LKO',
                departureDate: new Date().toLocaleString(),
                airline: 'AI',
                totalFare: 3643,
                baseFare: 2550,
                taxes: 1093,
                status: 'CONFIRMED',
                contactEmail: 'customer@flyanytrip.com',
                contactPhone: '+91 9545689585',
                gstNumber: 'N/A',
                state: 'N/A'
            };
        }

        const docDefinition = getInvoiceDocDefinition(invoiceData);
        const pdfBuffer = await pdfService.generatePDF(docDefinition);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=FlyAnyTrip_Invoice_${invoiceData.pnr}.pdf`);
        return res.send(pdfBuffer);

    } catch (error) {
        console.error('Download Invoice Error:', error);
        res.status(500).json({ success: false, message: 'Failed to download invoice', error: error.message });
    }
};

/**
 * Send booking confirmation + invoice email to the user
 * POST /api/booking/send-invoice-email
 */
exports.sendInvoiceEmail = async (req, res) => {
    try {
        const {
            toEmail,
            pdfBase64,
            pnr,
            passengerName,
            passengers = [],
            origin,
            destination,
            departureDate,
            departureTime,
            arrivalTime,
            airline,
            flightNumber,
            cabinClass,
            totalPaid,
            baseFare,
            taxes,
            addons = {},
            paxMeals = {},
            transactionId,
            bookingId,
        } = req.body;

        if (!toEmail) {
            return res.status(400).json({ success: false, message: 'toEmail is required' });
        }

        const fmt = (amt) => `₹${Number(amt || 0).toLocaleString('en-IN')}`;

        // Build passenger rows
        const MEAL_LABELS = { veg: 'Vegetarian 🥗', nonveg: 'Non-Veg 🍗', vegan: 'Vegan 🌱', jain: 'Jain 🙏', none: 'No Meal' };

        const passengerRows = passengers.length > 0
            ? passengers.map((p, i) => {
                const name = `${p.title || ''} ${p.firstName || ''} ${p.lastName || ''}`.trim() || `Passenger ${i + 1}`;
                const meal = MEAL_LABELS[paxMeals[i]] || 'No Meal';
                return `
                  <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
                    <td style="padding:10px 16px;font-size:14px;color:#333;border-bottom:1px solid #f0f0f0;">${name}</td>
                    <td style="padding:10px 16px;font-size:14px;color:#666;border-bottom:1px solid #f0f0f0;">${p.type || 'Adult'}</td>
                    <td style="padding:10px 16px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;">${meal}</td>
                    <td style="padding:10px 16px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;">${p.seat || 'Auto'}</td>
                  </tr>`;
            }).join('')
            : `<tr><td colspan="4" style="padding:12px;color:#999;text-align:center;">No passenger details</td></tr>`;

        // Build addons list
        const addonNames = [];
        if (addons.addons?.includes('bag_15')) addonNames.push('Extra Baggage 15kg (+₹799)');
        if (addons.addons?.includes('bag_30')) addonNames.push('Extra Baggage 30kg (+₹1399)');
        if (addons.addons?.includes('priority')) addonNames.push('Priority Boarding (+₹299)');
        if (addons.addons?.includes('wifi')) addonNames.push('In-flight Wi-Fi (+₹499)');
        if (addons.insurance) addonNames.push('Travel Insurance (+₹149)');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed – FlyAnyTrip</title>
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#E21C26 0%,#8B0000 100%);">
    <tr>
      <td align="center" style="padding:36px 20px 30px;">
        <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:1px;">✈ FlyAnyTrip</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">Booking Confirmed</p>
      </td>
    </tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 16px 50px;">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.1);">

          <!-- Success Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#00a651,#007a3d);padding:28px 32px;text-align:center;">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:28px;">✅</span>
              </div>
              <h2 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Booking Confirmed!</h2>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Your e-ticket and invoice are ready</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 16px;">
              <p style="margin:0;font-size:15px;color:#444;">Dear <strong style="color:#222;">${passengerName || passengers[0]?.firstName || 'Traveler'}</strong>,</p>
              <p style="margin:12px 0 0;font-size:14px;color:#666;line-height:1.7;">
                Your flight booking has been <strong style="color:#00a651;">successfully confirmed</strong>. 
                Please keep this email for your records and carry a valid photo ID to the airport.
              </p>
            </td>
          </tr>

          <!-- PNR Badge -->
          <tr>
            <td style="padding:0 32px 20px;">
              <div style="background:#fff9f9;border:2px dashed #E21C26;border-radius:10px;padding:16px 20px;text-align:center;">
                <p style="margin:0;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:1px;">PNR / Booking Reference</p>
                <p style="margin:8px 0 0;font-size:28px;font-weight:800;color:#E21C26;letter-spacing:3px;">${pnr || bookingId || 'PENDING'}</p>
              </div>
            </td>
          </tr>

          <!-- Flight Route Card -->
          <tr>
            <td style="padding:0 32px 20px;">
              <div style="background:#f8f9fb;border-radius:12px;padding:20px;">
                <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Flight Details</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" width="38%">
                      <p style="margin:0;font-size:26px;font-weight:800;color:#1a1a1a;">${(origin || 'DEL').toUpperCase()}</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#888;">${departureTime || ''}</p>
                    </td>
                    <td align="center" width="24%">
                      <div style="border-top:2px dashed #ccc;position:relative;margin:0 8px;">
                        <span style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:#f8f9fb;padding:0 6px;font-size:18px;">✈</span>
                      </div>
                      <p style="margin:16px 0 0;font-size:11px;color:#aaa;text-align:center;">${cabinClass || 'Economy'}</p>
                    </td>
                    <td align="center" width="38%">
                      <p style="margin:0;font-size:26px;font-weight:800;color:#1a1a1a;">${(destination || 'BOM').toUpperCase()}</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#888;">${arrivalTime || ''}</p>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid #eee;padding-top:12px;">
                  <tr>
                    <td style="font-size:13px;color:#666;padding:4px 0;"><strong style="color:#333;">Date:</strong> ${departureDate || ''}</td>
                    <td style="font-size:13px;color:#666;padding:4px 0;" align="right"><strong style="color:#333;">Flight:</strong> ${airline || ''} ${flightNumber || ''}</td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#666;padding:4px 0;" colspan="2"><strong style="color:#333;">Transaction ID:</strong> ${transactionId || 'N/A'}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Passenger Table -->
          <tr>
            <td style="padding:0 32px 20px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Passengers</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;font-size:13px;">
                <tr style="background:#f8f9fb;">
                  <th style="padding:10px 16px;text-align:left;color:#555;font-weight:600;">Name</th>
                  <th style="padding:10px 16px;text-align:left;color:#555;font-weight:600;">Type</th>
                  <th style="padding:10px 16px;text-align:left;color:#555;font-weight:600;">Meal</th>
                  <th style="padding:10px 16px;text-align:left;color:#555;font-weight:600;">Seat</th>
                </tr>
                ${passengerRows}
              </table>
            </td>
          </tr>

          ${addonNames.length > 0 ? `
          <!-- Add-ons -->
          <tr>
            <td style="padding:0 32px 20px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Add-ons</p>
              <div style="background:#f8f9fb;border-radius:10px;padding:14px 18px;">
                ${addonNames.map(a => `<p style="margin:4px 0;font-size:13px;color:#555;">✅ ${a}</p>`).join('')}
              </div>
            </td>
          </tr>` : ''}

          <!-- Fare Summary -->
          <tr>
            <td style="padding:0 32px 24px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.8px;">Fare Breakdown</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;font-size:14px;">
                <tr>
                  <td style="padding:12px 16px;color:#555;border-bottom:1px solid #f0f0f0;">Base Fare</td>
                  <td style="padding:12px 16px;text-align:right;color:#333;border-bottom:1px solid #f0f0f0;">${fmt(baseFare)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 16px;color:#555;border-bottom:1px solid #f0f0f0;">Taxes & Fees</td>
                  <td style="padding:12px 16px;text-align:right;color:#333;border-bottom:1px solid #f0f0f0;">${fmt(taxes)}</td>
                </tr>
                <tr style="background:#fff9f9;">
                  <td style="padding:14px 16px;font-weight:700;color:#E21C26;font-size:15px;">Total Paid</td>
                  <td style="padding:14px 16px;text-align:right;font-weight:800;color:#E21C26;font-size:16px;">${fmt(totalPaid)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tips -->
          <tr>
            <td style="padding:0 32px 24px;">
              <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:16px 18px;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;">✈ Before You Fly</p>
                <p style="margin:0;font-size:13px;color:#78350f;line-height:1.7;">
                  • Arrive at the airport at least <strong>2 hours before departure</strong> (domestic) or <strong>3 hours</strong> (international)<br/>
                  • Carry a valid government-issued photo ID<br/>
                  • Web check-in opens 48 hours before departure
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fb;padding:24px 32px;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#999;">For support, contact us at <a href="mailto:support@flyanytrip.com" style="color:#E21C26;font-weight:600;">support@flyanytrip.com</a></p>
              <p style="margin:0;font-size:13px;color:#bbb;">Have a wonderful journey! 🙏<br/><strong style="color:#E21C26;">Team FlyAnyTrip</strong></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        // Build formatted invoice data for PDF generator
        const formattedPassengers = passengers.length > 0
            ? passengers.map((p, i) => {
                const meal = MEAL_LABELS[paxMeals[i]] || p.meal || 'Standard Meal';
                const bag = addons?.addons?.includes('bag_30') ? '30 kg' : addons?.addons?.includes('bag_15') ? '15 kg' : (p.baggage || 'Included');
                return {
                    firstName: p.firstName || (passengerName ? passengerName.split(' ')[0] : 'Passenger'),
                    lastName: p.lastName || (passengerName && passengerName.split(' ').length > 1 ? passengerName.split(' ').slice(1).join(' ') : `${i + 1}`),
                    gender: p.gender || p.title || 'N/A',
                    dob: p.dob || 'N/A',
                    seat: p.seat || 'Auto',
                    meal,
                    baggage: bag,
                    ticketStatus: 'CONFIRMED',
                    passportNo: p.passportNo || 'N/A',
                    passportExpiry: p.passportExpiry || 'N/A',
                };
            })
            : [{
                firstName: passengerName ? passengerName.split(' ')[0] : 'Traveler',
                lastName: passengerName && passengerName.split(' ').length > 1 ? passengerName.split(' ').slice(1).join(' ') : '',
                gender: 'N/A',
                dob: 'N/A',
                seat: 'Auto',
                meal: 'Standard Meal',
                baggage: 'Included',
                ticketStatus: 'CONFIRMED',
                passportNo: 'N/A',
                passportExpiry: 'N/A',
            }];

        const invoiceData = {
            pnr: pnr || bookingId || 'PENDING',
            bookingId: bookingId || pnr || 'N/A',
            bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            passengers: formattedPassengers,
            origin: (origin || 'DEL').toUpperCase(),
            destination: (destination || 'BOM').toUpperCase(),
            departureDate: departureDate || 'N/A',
            arrivalDate: departureDate || 'N/A',
            airline: airline || 'Flight',
            flightNumber: flightNumber || 'N/A',
            cabinClass: cabinClass || 'Economy',
            totalFare: totalPaid || 0,
            baseFare: baseFare || 0,
            taxes: taxes || 0,
            ssrCharges: 0,
            status: 'CONFIRMED',
            contactEmail: toEmail,
            contactPhone: 'N/A',
            gstNumber: 'N/A',
            state: 'N/A'
        };

        // Prepare PDF Invoice Buffer (prefer exact client DOM PDF if provided)
        let pdfBuffer = null;
        if (pdfBase64) {
            try {
                pdfBuffer = Buffer.from(pdfBase64, 'base64');
                console.log(`📄 Using client-provided ticket PDF for PNR ${pnr || bookingId}, size: ${pdfBuffer.length} bytes`);
            } catch (bufErr) {
                console.error('⚠️ Error parsing client pdfBase64, using fallback:', bufErr.message);
            }
        }

        if (!pdfBuffer) {
            try {
                const docDefinition = getInvoiceDocDefinition(invoiceData);
                pdfBuffer = await pdfService.generatePDF(docDefinition);
                console.log(`📄 Server fallback PDF Invoice generated for PNR ${invoiceData.pnr}, size: ${pdfBuffer?.length} bytes`);
            } catch (pdfError) {
                console.error('⚠️ Error generating PDF invoice for email:', pdfError.message || pdfError);
            }
        }

        // Send confirmation email with attached PDF invoice via SMTP
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: parseInt(process.env.SMTP_PORT) || 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const textSummary = `Dear ${passengerName || 'Traveler'},\n\nYour flight booking is CONFIRMED!\nPNR / Booking Reference: ${pnr || bookingId || 'CONFIRMED'}\nRoute: ${(origin || 'DEL').toUpperCase()} to ${(destination || 'BOM').toUpperCase()}\nDeparture Date: ${departureDate || 'N/A'}\nAirline: ${airline || ''} ${flightNumber || ''}\nTotal Paid: ₹${Number(totalPaid || 0).toLocaleString('en-IN')}\n\nPlease find your e-ticket and tax invoice attached to this email.\n\nThank you for choosing FlyAnyTrip!\nTeam FlyAnyTrip`;

        const mailOptions = {
            from: `"FlyAnyTrip" <${process.env.SMTP_USER}>`,
            replyTo: `support@flyanytrip.com`,
            to: toEmail,
            subject: `✈ Booking Confirmed! PNR: ${pnr || bookingId} | ${(origin || 'DEL').toUpperCase()} → ${(destination || 'BOM').toUpperCase()} | ${departureDate || ''}`,
            text: textSummary,
            html,
            attachments: pdfBuffer ? [
                {
                    filename: `FlyAnyTrip_Invoice_${pnr || bookingId || 'CONFIRMED'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }
            ] : []
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Booking confirmation email with PDF invoice sent via SMTP:', info.messageId, '→', toEmail);
        return res.status(200).json({ success: true, messageId: info.messageId, sentTo: toEmail, hasPdfAttachment: !!pdfBuffer });

    } catch (error) {
        console.error('Send Invoice Email Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
};

/**
 * Get Adivaha Wallet Balance
 */
exports.getWalletBalance = async (req, res, next) => {
    try {
        const adivahaRes = await AdivahaFlightService.getWalletBalance();
        res.status(200).json({ success: true, data: adivahaRes });
    } catch (error) {
        console.error('Get Wallet Balance Error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve wallet balance', error: error.message });
    }
};

/**
 * Release / Cancel Hold Booking (Non-LCC only)
 */
exports.releaseHoldBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: 'Booking ID is required' });
        }

        // Fetch flight booking details from database
        let flightBooking = null;
        try {
            flightBooking = await prisma.flight_bookings.findUnique({
                where: { booking_id: bookingId }
            });
        } catch (dbErr) {
            console.warn('Database error fetching booking details for release hold:', dbErr.message);
        }

        if (!flightBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const providerBookingId = flightBooking.provider_booking_id;
        const rawRes = flightBooking.raw_response?.adivaha || {};
        const responseData = rawRes.responseData?.Response || rawRes.Response || rawRes;
        const adivahaOrderId = responseData.OrderId || responseData.order_id || responseData.BookingId || flightBooking.provider_order_id;

        // Call Adivaha API to release hold booking
        let adivahaRes;
        try {
            adivahaRes = await AdivahaFlightService.releaseHoldBooking({
                BookingId: providerBookingId,
                order_id: adivahaOrderId,
                Source: 4
            });
        } catch (apiErr) {
            console.error('Adivaha releaseHoldBooking call failed:', apiErr);
            return res.status(400).json({
                success: false,
                message: 'Failed to release hold booking from provider',
                error: apiErr.message
            });
        }

        const adivahaResponseData = adivahaRes?.responseData?.Response || adivahaRes?.Response || adivahaRes;
        if (adivahaResponseData?.Error?.ErrorCode !== 0 && adivahaResponseData?.Error?.ErrorCode !== undefined) {
            return res.status(400).json({
                success: false,
                message: 'Adivaha Release Hold Booking Failed',
                error: adivahaResponseData.Error
            });
        }

        // Update database records to RELEASED
        try {
            await prisma.$transaction([
                prisma.bookings.update({
                    where: { booking_id: bookingId },
                    data: { status: 'RELEASED' }
                }),
                prisma.flight_bookings.update({
                    where: { booking_id: bookingId },
                    data: {
                        booking_status: 'RELEASED',
                        ticket_status: 'RELEASED',
                        raw_response: {
                            ...(flightBooking.raw_response || {}),
                            release_hold: {
                                releasedAt: new Date().toISOString(),
                                response: adivahaRes
                            }
                        }
                    }
                })
            ]);
        } catch (dbUpdateErr) {
            console.error('Database update failed after hold release:', dbUpdateErr.message);
        }

        res.status(200).json({ success: true, message: 'Hold booking released successfully', data: adivahaRes });
    } catch (error) {
        console.error('Release Hold Booking Error:', error);
        res.status(500).json({ success: false, message: 'Failed to release hold booking', error: error.message });
    }
};

/**
 * Manually refresh/create Adivaha API token
 */
exports.createManualToken = async (req, res, next) => {
    try {
        const adivahaRes = await AdivahaFlightService.createManualToken();
        res.status(200).json({ success: true, data: adivahaRes });
    } catch (error) {
        console.error('Create Manual Token Error:', error);
        res.status(500).json({ success: false, message: 'Failed to refresh token', error: error.message });
    }
};

// trigger nodemon restart


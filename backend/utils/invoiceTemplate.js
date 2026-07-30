/**
 * invoiceTemplate.js
 * Server-side PDFMake Document Definition generator.
 * Matches frontend InvoiceTemplate.jsx (2-Page GST Tax Invoice) 1:1.
 */

function amountInWords(n) {
    const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function b100(num) {
        if (num < 20) return ones[num];
        return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    }
    function b1000(num) {
        if (num < 100) return b100(num);
        return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + b100(num % 100) : "");
    }

    n = Math.round(Number(n) || 0);
    if (n === 0) return "Zero Rupees Only";

    let result = "";
    const cr = Math.floor(n / 10000000); n %= 10000000;
    const lakh = Math.floor(n / 100000); n %= 100000;
    const thou = Math.floor(n / 1000); n %= 1000;

    if (cr) result += b100(cr) + " Crore ";
    if (lakh) result += b100(lakh) + " Lakh ";
    if (thou) result += b1000(thou) + " Thousand ";
    if (n) result += b1000(n);

    return (result.trim() || ones[n]) + " Rupees Only";
}

const cityMapping = {
    DEL: "New Delhi", BOM: "Mumbai", BLR: "Bengaluru", MAA: "Chennai", CCU: "Kolkata",
    HYD: "Hyderabad", COK: "Kochi", GOI: "Goa", AMD: "Ahmedabad", PNQ: "Pune"
};

const getCityName = (code) => {
    if (!code) return "";
    return cityMapping[code.toUpperCase()] || code;
};

const getInvoiceDocDefinition = (bookingData = {}) => {
    const {
        pnr = "VG2434",
        bookingId = "FAT-100000",
        bookingDate,
        passengers = [],
        origin = "DEL",
        destination = "BOM",
        departureDate,
        arrivalDate,
        airline = "IndiGo",
        flightNumber = "6E-204",
        cabinClass = "Economy",
        totalFare = 3499,
        baseFare,
        taxes,
        ssrCharges = 0,
        ssrSeatTotal = 0,
        ssrMealTotal = 0,
        ssrBagTotal = 0,
        status = "CONFIRMED",
        contactEmail = "customer@flyanytrip.com",
        contactPhone = "+91 98765 43210",
        customerAddress = "India",
        gstNumber = "N/A",
        state = "N/A",
        transactionId = "TXN240722094823",
        paymentMethod = "Online — UPI / Card",
        couponCode = "",
        couponDiscount = 0,
        mealSelected = "No Meal",
        baggageKg = 15,
        seatLabel = "12A"
    } = bookingData;

    const invNum = bookingId || `FAT-${Math.floor(Math.random() * 900000 + 100000)}`;
    const pnrCode = (pnr || "VG2434").toUpperCase();
    const dateStr = bookingDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const flightDateStr = departureDate || dateStr;

    const fromCity = getCityName(origin);
    const toCity = getCityName(destination);

    // Is Domestic check
    const nonIndianCodes = ["DXB", "SIN", "LHR", "JFK", "CDG", "HND", "SYD", "BKK", "KUL", "USM", "NRT", "MXP", "FCO", "AUH", "DOH", "KTM", "HKG", "ICN"];
    const isDomestic = !nonIndianCodes.includes((origin || "").toUpperCase()) && !nonIndianCodes.includes((destination || "").toUpperCase());

    // Pricing calculation
    const calcTotal = Number(totalFare || 0);
    const calcBase = baseFare ? Number(baseFare) : Math.round(calcTotal * 0.7);
    const calcMeal = Number(ssrMealTotal || 0);
    const calcBag = Number(ssrBagTotal || 0);
    const calcSeat = Number(ssrSeatTotal || 0);
    const convFee = 99;

    const isBusinessOrFirst = (cabinClass || "").toLowerCase().includes("business") || (cabinClass || "").toLowerCase().includes("premium");
    const IGST_FLIGHT = isBusinessOrFirst ? 0.12 : 0.05;
    const HSN_FLIGHT = isBusinessOrFirst ? "996412" : "996411";
    const IGST_MEAL = 0.05;
    const IGST_SERV = 0.18;

    const lineItems = [
        {
            desc: `Air Ticket (${isBusinessOrFirst ? "Business/Premium" : "Economy"}) — ${airline} ${flightNumber}`,
            sub: `${fromCity} (${origin}) → ${toCity} (${destination}) · ${flightDateStr}`,
            hsn: HSN_FLIGHT, amount: calcBase, igstPct: IGST_FLIGHT
        },
        ...(calcMeal > 0 ? [{
            desc: `Meal Add-on — ${mealSelected}`,
            sub: "In-flight catering service",
            hsn: "9963", amount: calcMeal, igstPct: IGST_MEAL
        }] : []),
        ...(calcBag > 0 ? [{
            desc: `Extra Baggage — ${baggageKg} kg Check-in`,
            sub: "Pre-paid excess baggage allowance",
            hsn: "9964", amount: calcBag, igstPct: IGST_SERV
        }] : []),
        ...(calcSeat > 0 ? [{
            desc: `Seat Selection — Seat ${seatLabel}`,
            sub: "Pre-reserved seat assignment",
            hsn: "9964", amount: calcSeat, igstPct: IGST_SERV
        }] : []),
        {
            desc: "Convenience Fee",
            sub: "Travel Agency Platform Booking & Support Charge",
            hsn: "998552", amount: convFee, igstPct: IGST_SERV
        }
    ];

    const rows = lineItems.map((li) => {
        const taxable = Math.round(li.amount / (1 + li.igstPct));
        const totalTax = li.amount - taxable;
        const cgstPct = li.igstPct / 2;
        const sgstPct = li.igstPct / 2;
        const cgstAmt = Math.round(totalTax / 2);
        const sgstAmt = totalTax - cgstAmt;
        return {
            ...li,
            taxable,
            totalTax,
            cgstPct,
            sgstPct,
            cgstAmt,
            sgstAmt
        };
    });

    const totalTaxable = rows.reduce((s, r) => s + r.taxable, 0);
    const totalTax = rows.reduce((s, r) => s + r.totalTax, 0);
    const grandTotal = rows.reduce((s, r) => s + r.amount, 0);
    const cDiscount = Number(couponDiscount || 0);
    const netGrandTotal = Math.max(0, grandTotal - cDiscount);

    const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
    const pct = (p) => `${Number((p * 100).toFixed(1))}%`;

    // Passenger Rows
    const paxTableRows = passengers.length > 0 ? passengers.map((p, i) => [
        { text: (i + 1).toString(), fontSize: 8, alignment: "center" },
        { text: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Traveler", fontSize: 8, bold: true },
        { text: p.gender || "Adult", fontSize: 8 },
        { text: p.seat || seatLabel || "12A", fontSize: 8, bold: true },
        { text: p.baggage || (baggageKg > 0 ? `${baggageKg} kg` : "7 kg Cabin"), fontSize: 8 },
        { text: p.meal || mealSelected || "No Meal", fontSize: 8 }
    ]) : [
        [{ text: "1", fontSize: 8, alignment: "center" }, { text: "Valued Customer", fontSize: 8, bold: true }, { text: "Adult", fontSize: 8 }, { text: seatLabel || "12A", fontSize: 8 }, { text: `${baggageKg} kg`, fontSize: 8 }, { text: mealSelected || "No Meal", fontSize: 8 }]
    ];

    // Charges Table Rows
    const chargeTableBody = [
        [
            { text: "Description", style: "tableHeader", alignment: "left" },
            { text: "HSN/SAC", style: "tableHeader", alignment: "left" },
            { text: "Amount (₹)", style: "tableHeader", alignment: "right" },
            { text: "Taxable (₹)", style: "tableHeader", alignment: "right" },
            { text: "CGST (₹)", style: "tableHeader", alignment: "right" },
            { text: "SGST (₹)", style: "tableHeader", alignment: "right" },
            { text: "CESS (₹)", style: "tableHeader", alignment: "right" },
            { text: "Total (₹)", style: "tableHeader", alignment: "right" }
        ],
        ...rows.map(r => [
            { text: r.desc, fontSize: 8, bold: true },
            { text: r.hsn, fontSize: 8, color: '#475569' },
            { text: fmt(r.amount), fontSize: 8, alignment: "right" },
            { text: fmt(r.taxable), fontSize: 8, alignment: "right" },
            { text: `${pct(r.cgstPct)}\n${fmt(r.cgstAmt)}`, fontSize: 7, alignment: "right" },
            { text: `${pct(r.sgstPct)}\n${fmt(r.sgstAmt)}`, fontSize: 7, alignment: "right" },
            { text: `0%\n₹0`, fontSize: 7, alignment: "right" },
            { text: fmt(r.amount), fontSize: 8, bold: true, alignment: "right" }
        ]),
        [
            { text: "TOTAL", colSpan: 2, bold: true, fontSize: 8, fillColor: '#F1F5F9' },
            {},
            { text: fmt(grandTotal), bold: true, fontSize: 8, alignment: "right", fillColor: '#F1F5F9' },
            { text: fmt(totalTaxable), bold: true, fontSize: 8, alignment: "right", fillColor: '#F1F5F9' },
            { text: fmt(rows.reduce((s, r) => s + r.cgstAmt, 0)), bold: true, fontSize: 8, alignment: "right", fillColor: '#F1F5F9' },
            { text: fmt(rows.reduce((s, r) => s + r.sgstAmt, 0)), bold: true, fontSize: 8, alignment: "right", fillColor: '#F1F5F9' },
            { text: "₹0", bold: true, fontSize: 8, alignment: "right", fillColor: '#F1F5F9' },
            { text: fmt(grandTotal), bold: true, fontSize: 8, alignment: "right", color: '#FE2C1C', fillColor: '#F1F5F9' }
        ]
    ];

    return {
        pageSize: 'A4',
        pageMargins: [26, 20, 26, 20],
        content: [
            // ── PAGE 1: TAX INVOICE & BREAKDOWN ─────────────────────────────
            // Header
            {
                columns: [
                    {
                        stack: [
                            { text: 'FLYANYTRIP', fontSize: 18, bold: true, color: '#FE2C1C' },
                            { text: 'AnyTrip India Pvt Ltd', fontSize: 12, bold: true, color: '#1A1A1A', margin: [0, 2, 0, 2] },
                            { text: 'GSTIN: 24ABECA2712K1ZY | CIN: U52291GJ2025PTC170152', fontSize: 8, color: '#475569' },
                            { text: 'Shop No 16, VED TransCube Plaza, Opp Railway Station, Vadodara – 390002, Gujarat, India', fontSize: 7.5, color: '#475569', margin: [0, 1, 0, 0] }
                        ],
                        width: '*'
                    },
                    {
                        stack: [
                            { text: 'TAX INVOICE', fontSize: 15, bold: true, color: '#FE2C1C', alignment: 'right' },
                            { text: `Invoice No: ${invNum}`, fontSize: 9, bold: true, color: '#0F172A', alignment: 'right', margin: [0, 2, 0, 1] },
                            { text: `Booking Date: ${dateStr}`, fontSize: 8.5, color: '#475569', alignment: 'right' },
                            {
                                text: 'CONFIRMED E-TICKET',
                                fontSize: 7.5,
                                bold: true,
                                color: '#FE2C1C',
                                fillColor: '#FEF2F2',
                                alignment: 'right',
                                margin: [0, 4, 0, 0]
                            }
                        ],
                        width: 220
                    }
                ],
                margin: [0, 0, 0, 8]
            },

            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 543, y2: 0, lineWidth: 1.5, lineColor: '#F1F5F9' }], margin: [0, 0, 0, 8] },

            // Info Strip (Billed To | PNR | Payment)
            {
                table: {
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            {
                                stack: [
                                    { text: 'BILLED TO', fontSize: 7, bold: true, color: '#64748B' },
                                    { text: passengers[0]?.firstName ? `${passengers[0].firstName} ${passengers[0].lastName || ""}` : "Valued Customer", fontSize: 9, bold: true, color: '#0F172A', margin: [0, 2, 0, 1] },
                                    { text: customerAddress, fontSize: 8, color: '#475569' },
                                    { text: contactPhone, fontSize: 8, color: '#475569' },
                                    { text: contactEmail, fontSize: 8, color: '#475569' }
                                ],
                                fillColor: '#FFFFFF',
                                padding: [6, 6, 6, 6]
                            },
                            {
                                stack: [
                                    { text: 'BOOKING REFERENCE (PNR)', fontSize: 7, bold: true, color: '#64748B', alignment: 'center' },
                                    { text: pnrCode, fontSize: 15, bold: true, color: '#0F172A', alignment: 'center', margin: [0, 3, 0, 2] },
                                    { text: '● CONFIRMED', fontSize: 8, bold: true, color: '#059669', alignment: 'center' }
                                ],
                                fillColor: '#F8FAFC',
                                padding: [6, 6, 6, 6]
                            },
                            {
                                stack: [
                                    { text: 'PAYMENT METHOD', fontSize: 7, bold: true, color: '#64748B', alignment: 'right' },
                                    { text: paymentMethod, fontSize: 8.5, bold: true, color: '#0F172A', alignment: 'right', margin: [0, 2, 0, 1] },
                                    { text: `ID: ${transactionId}`, fontSize: 7.5, color: '#64748B', alignment: 'right' },
                                    { text: '● PAID', fontSize: 8, bold: true, color: '#059669', alignment: 'right', margin: [0, 2, 0, 0] }
                                ],
                                fillColor: '#FFFFFF',
                                padding: [6, 6, 6, 6]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#E2E8F0',
                    vLineColor: () => '#E2E8F0'
                },
                margin: [0, 0, 0, 8]
            },

            // Flight Card
            {
                table: {
                    widths: [110, '*', 110],
                    body: [
                        [
                            {
                                stack: [
                                    { text: 'DEPARTURE', fontSize: 7, bold: true, color: '#64748B' },
                                    { text: origin, fontSize: 16, bold: true, color: '#0F172A', margin: [0, 1, 0, 1] },
                                    { text: fromCity, fontSize: 9, bold: true, color: '#475569' },
                                    { text: departureDate || "06:00 AM", fontSize: 8.5, color: '#0F172A' }
                                ]
                            },
                            {
                                stack: [
                                    { text: `${airline} · ${flightNumber}`, fontSize: 10, bold: true, color: '#FE2C1C', alignment: 'center' },
                                    { text: '─── ✈ ───', fontSize: 9, color: '#CBD5E1', alignment: 'center', margin: [0, 2, 0, 2] },
                                    { text: `2h 10m · Non-stop · ${flightDateStr}`, fontSize: 8, color: '#475569', alignment: 'center' },
                                    { text: `Class: ${cabinClass} | Seat: ${seatLabel} | Baggage: ${baggageKg}kg`, fontSize: 7.5, bold: true, color: '#0F172A', alignment: 'center', margin: [0, 3, 0, 0] }
                                ]
                            },
                            {
                                stack: [
                                    { text: 'ARRIVAL', fontSize: 7, bold: true, color: '#64748B', alignment: 'right' },
                                    { text: destination, fontSize: 16, bold: true, color: '#0F172A', alignment: 'right', margin: [0, 1, 0, 1] },
                                    { text: toCity, fontSize: 9, bold: true, color: '#475569', alignment: 'right' },
                                    { text: arrivalDate || "08:10 AM", fontSize: 8.5, color: '#0F172A', alignment: 'right' }
                                ]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#E2E8F0',
                    vLineColor: () => '#E2E8F0',
                    paddingTop: () => 6,
                    paddingBottom: () => 6,
                    paddingLeft: () => 10,
                    paddingRight: () => 10,
                },
                fillColor: '#F8FAFC',
                margin: [0, 0, 0, 8]
            },

            // Passenger Details Table
            { text: 'PASSENGER DETAILS', fontSize: 9, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
            {
                table: {
                    headerRows: 1,
                    widths: [20, '*', 50, 50, 90, 80],
                    body: [
                        [
                            { text: '#', style: 'tableHeader', alignment: 'center' },
                            { text: 'PASSENGER NAME', style: 'tableHeader' },
                            { text: 'TYPE', style: 'tableHeader' },
                            { text: 'SEAT', style: 'tableHeader' },
                            { text: 'BAGGAGE ALLOWANCE', style: 'tableHeader' },
                            { text: 'MEAL PREFERENCE', style: 'tableHeader' }
                        ],
                        ...paxTableRows
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 0,
                    hLineColor: () => '#E2E8F0',
                    paddingTop: () => 4,
                    paddingBottom: () => 4,
                },
                margin: [0, 0, 0, 8]
            },

            // Itemized Tax Charges Table
            { text: 'ITEMIZED TAX INVOICE CHARGES', fontSize: 9, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', 45, 50, 50, 45, 45, 35, 55],
                    body: chargeTableBody
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 0,
                    hLineColor: () => '#E2E8F0',
                    paddingTop: () => 4,
                    paddingBottom: () => 4,
                },
                margin: [0, 0, 0, 8]
            },

            // Slabs & Grand Total Section
            {
                columns: [
                    {
                        stack: [
                            { text: `Amount in Words: ${amountInWords(netGrandTotal)}`, fontSize: 8.5, bold: true, color: '#475569', margin: [0, 4, 0, 0] }
                        ],
                        width: '*'
                    },
                    {
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                columns: [
                                                    { text: 'GRAND TOTAL', fontSize: 9, bold: true, color: '#FFFFFF' },
                                                    { text: fmt(netGrandTotal), fontSize: 13, bold: true, color: '#FFFFFF', alignment: 'right' }
                                                ]
                                            }
                                        ],
                                        fillColor: '#FE2C1C',
                                        padding: [8, 6, 8, 6]
                                    }
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                columns: [
                                                    { text: 'Gross Fare & Fees:', fontSize: 8, color: '#B91C1C' },
                                                    { text: fmt(grandTotal), fontSize: 8, bold: true, color: '#B91C1C', alignment: 'right' }
                                                ]
                                            },
                                            ...(cDiscount > 0 ? [{
                                                columns: [
                                                    { text: `Coupon (${couponCode || "Applied"}):`, fontSize: 8, color: '#15803D' },
                                                    { text: `− ${fmt(cDiscount)}`, fontSize: 8, bold: true, color: '#15803D', alignment: 'right' }
                                                ]
                                            }] : []),
                                            {
                                                columns: [
                                                    { text: 'Total GST Tax:', fontSize: 8, color: '#B91C1C' },
                                                    { text: fmt(totalTax), fontSize: 8, bold: true, color: '#B91C1C', alignment: 'right' }
                                                ]
                                            }
                                        ],
                                        fillColor: '#FEF2F2',
                                        padding: [8, 4, 8, 4]
                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 1,
                            vLineWidth: () => 1,
                            hLineColor: () => '#FE2C1C',
                            vLineColor: () => '#FE2C1C'
                        },
                        width: 210
                    }
                ],
                margin: [0, 0, 0, 10]
            },

            // Footer Page 1
            {
                columns: [
                    { text: 'AnyTrip India Pvt Ltd  |  Tax Invoice & Payment Breakdown', fontSize: 7.5, color: '#64748B' },
                    { text: 'Page 1 of 2', fontSize: 7.5, color: '#64748B', alignment: 'right' }
                ],
                margin: [0, 10, 0, 0]
            },

            // ── PAGE 2: TERMS, POLICIES & DECLARATION ───────────────────────
            { text: '', pageBreak: 'before' },

            // Header Page 2
            {
                columns: [
                    {
                        stack: [
                            { text: 'FLYANYTRIP', fontSize: 16, bold: true, color: '#FE2C1C' },
                            { text: 'Terms & Conditions / Travel Guidelines', fontSize: 9, bold: true, color: '#475569', margin: [0, 2, 0, 0] }
                        ],
                        width: '*'
                    },
                    {
                        stack: [
                            { text: `PNR: ${pnrCode}`, fontSize: 11, bold: true, color: '#FE2C1C', alignment: 'right' },
                            { text: `Invoice No: ${invNum}`, fontSize: 8.5, color: '#64748B', alignment: 'right' }
                        ],
                        width: 200
                    }
                ],
                margin: [0, 0, 0, 10]
            },

            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 543, y2: 0, lineWidth: 1.5, lineColor: '#F1F5F9' }], margin: [0, 0, 0, 10] },

            // Section 1
            { text: '1. Mandatory Passenger & Airport Guidelines', fontSize: 9.5, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
            {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            {
                                stack: [
                                    { text: 'A. Government Photo ID Requirement:', fontSize: 8, bold: true, color: '#1E293B' },
                                    { text: 'All adult passengers must present a valid government-issued photo ID (Aadhaar, Driving License, Passport, Voter ID) at airport entry. Infants require DOB verification proof.', fontSize: 7.5, color: '#64748B', margin: [0, 2, 0, 0] }
                                ],
                                padding: [6, 6, 6, 6]
                            },
                            {
                                stack: [
                                    { text: 'B. Airport Reporting & Boarding:', fontSize: 8, bold: true, color: '#1E293B' },
                                    { text: 'Check-in counters close 60 mins before domestic and 75 mins before international departures. Boarding gates close strictly 25 mins prior to scheduled departure.', fontSize: 7.5, color: '#64748B', margin: [0, 2, 0, 0] }
                                ],
                                padding: [6, 6, 6, 6]
                            }
                        ],
                        [
                            {
                                stack: [
                                    { text: 'C. Web Check-in Mandate:', fontSize: 8, bold: true, color: '#1E293B' },
                                    { text: 'Mandatory web check-in applies for all flights. Boarding pass must be generated online prior to reaching airport security checkpoint.', fontSize: 7.5, color: '#64748B', margin: [0, 2, 0, 0] }
                                ],
                                padding: [6, 6, 6, 6]
                            },
                            {
                                stack: [
                                    { text: 'D. Health & Security Protocol:', fontSize: 8, bold: true, color: '#1E293B' },
                                    { text: 'Passengers must comply with all security screening protocols, baggage restrictions, and health advisory guidelines issued by civil aviation authorities (BCAS/DGCA).', fontSize: 7.5, color: '#64748B', margin: [0, 2, 0, 0] }
                                ],
                                padding: [6, 6, 6, 6]
                            }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#E2E8F0',
                    vLineColor: () => '#E2E8F0'
                },
                fillColor: '#F8FAFC',
                margin: [0, 0, 0, 10]
            },

            // Section 2
            { text: '2. Detailed Cancellation & Refund Policy Matrix', fontSize: 9.5, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'Cancellation Timeframe', style: 'tableHeader' },
                            { text: 'Airline Cancellation Fee', style: 'tableHeader' },
                            { text: 'AnyTrip Handling Charge', style: 'tableHeader' },
                            { text: 'Net Refund Status', style: 'tableHeader', alignment: 'right' }
                        ],
                        [
                            { text: 'More than 72 hours before departure', fontSize: 8, bold: true },
                            { text: 'Standard Airline Tariff (₹2,500 – ₹3,000 / pax)', fontSize: 7.5, color: '#475569' },
                            { text: '₹300 per passenger', fontSize: 7.5, color: '#475569' },
                            { text: 'Eligible for Refund', fontSize: 8, bold: true, color: '#059669', alignment: 'right' }
                        ],
                        [
                            { text: 'Between 2 hrs & 72 hrs before departure', fontSize: 8, bold: true },
                            { text: 'Higher Tier Penalty (₹3,000 – ₹3,500 / pax)', fontSize: 7.5, color: '#475569' },
                            { text: '₹300 per passenger', fontSize: 7.5, color: '#475569' },
                            { text: 'Partial Refund', fontSize: 8, bold: true, color: '#D97706', alignment: 'right' }
                        ],
                        [
                            { text: 'Less than 2 hours / No-Show', fontSize: 8, bold: true },
                            { text: '100% Base Fare Forfeiture', fontSize: 7.5, color: '#DC2626' },
                            { text: '₹300 per passenger', fontSize: 7.5, color: '#475569' },
                            { text: 'Government Taxes Only', fontSize: 8, bold: true, color: '#DC2626', alignment: 'right' }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 0,
                    hLineColor: () => '#E2E8F0',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                },
                margin: [0, 0, 0, 10]
            },

            // Section 3
            { text: '3. Date Change & Rescheduling Terms', fontSize: 9.5, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
            {
                ul: [
                    { text: 'Rescheduling Charges: Date changes are permitted up to 4 hours prior to departure subject to airline rescheduling fee + fare difference.', fontSize: 8, color: '#334155' },
                    { text: 'Service Fee: AnyTrip service fee of ₹250 per passenger per sector applies for all date/flight modification requests.', fontSize: 8, color: '#334155' },
                    { text: 'Name Changes: Passenger name corrections/transfers are strictly non-permissible as per airline security rules. Minor spelling corrections require airline approval.', fontSize: 8, color: '#334155' }
                ],
                margin: [0, 0, 0, 10]
            },

            // Section 4
            { text: '4. Baggage Allowance & Dangerous Goods Policy', fontSize: 9.5, bold: true, color: '#0F172A', margin: [0, 0, 0, 4] },
            {
                table: {
                    widths: ['*', '*'],
                    body: [
                        [
                            { text: 'Cabin Baggage: 1 piece up to 7 kg (dimensions 55cm x 35cm x 25cm) plus 1 small laptop bag/purse per passenger.', fontSize: 7.5, color: '#334155' },
                            { text: 'Check-in Baggage: 15 kg per passenger for domestic flights (1 piece policy applies on select carriers). Excess baggage charged per kg at airport counter.', fontSize: 7.5, color: '#334155' }
                        ],
                        [
                            { text: 'Prohibited Items in Check-in: Power banks, lithium batteries, e-cigarettes, lighters, and matchboxes are strictly restricted to hand baggage only.', fontSize: 7.5, color: '#334155' },
                            { text: 'Restricted Substances: Liquids, aerosols, and gels in hand luggage must not exceed 100ml per container. Hazardous chemicals strictly banned.', fontSize: 7.5, color: '#334155' }
                        ]
                    ]
                },
                layout: {
                    hLineWidth: () => 1,
                    vLineWidth: () => 1,
                    hLineColor: () => '#E2E8F0',
                    vLineColor: () => '#E2E8F0',
                    paddingTop: () => 5,
                    paddingBottom: () => 5
                },
                fillColor: '#F8FAFC',
                margin: [0, 0, 0, 12]
            },

            // Section 5: Declaration & Stamp
            {
                columns: [
                    {
                        stack: [
                            { text: 'Enterprise Legal Declaration', fontSize: 9, bold: true, color: '#0F172A' },
                            { text: 'We declare that this tax invoice displays the complete and accurate breakdown of passenger fares, statutory taxes, and ancillary service charges collected on behalf of the operating airline. All particulars stated herein are true, correct, and verified.', fontSize: 7.5, color: '#64748B', margin: [0, 2, 0, 0] }
                        ],
                        width: '*'
                    },
                    {
                        table: {
                            widths: ['*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            { text: 'AnyTrip India Pvt Ltd', fontSize: 8, bold: true, color: '#FE2C1C', alignment: 'center' },
                                            { text: 'Computer Generated Invoice', fontSize: 7, color: '#991B1B', alignment: 'center', margin: [0, 1, 0, 2] },
                                            { text: 'VALID WITHOUT PHYSICAL SIGNATURE', fontSize: 6.5, bold: true, color: '#059669', alignment: 'center', fillColor: '#ECFDF5', padding: [2, 2, 2, 2] }
                                        ],
                                        fillColor: '#FEF2F2',
                                        padding: [6, 6, 6, 6]
                                    }
                                ]
                            ]
                        },
                        layout: {
                            hLineWidth: () => 1,
                            vLineWidth: () => 1,
                            hLineColor: () => '#FE2C1C',
                            vLineColor: () => '#FE2C1C'
                        },
                        width: 170
                    }
                ],
                margin: [0, 0, 0, 10]
            },

            // Footer Page 2
            {
                columns: [
                    { text: 'AnyTrip India Pvt Ltd  |  24/7 Helpline: +91-800-123-4567  |  Support: support@flyanytrip.com', fontSize: 7.5, color: '#64748B' },
                    { text: 'Page 2 of 2', fontSize: 7.5, color: '#64748B', alignment: 'right' }
                ],
                margin: [0, 10, 0, 0]
            }
        ],
        styles: {
            tableHeader: { fontSize: 8, bold: true, color: '#1E293B', fillColor: '#F1F5F9' }
        }
    };
};

module.exports = { getInvoiceDocDefinition };

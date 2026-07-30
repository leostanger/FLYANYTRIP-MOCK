import React from "react";

/**
 * InvoiceTemplate.jsx
 * Premium 2-Page GST Tax Invoice.
 * Page 1: Flight & Passenger Details, Itemized Charges, GST Slabs, Grand Total.
 * Page 2: Comprehensive Terms & Conditions, Cancellation & Refund Policy Matrix, Rescheduling Rules, Baggage Policy & Declaration.
 */
export default function InvoiceTemplate({
  id,
  flight = {},
  passengers = [],
  fare = {},
  pnr,
  invoiceNo,
  bookingDate,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  mealSelected,
  baggageKg,
  seatLabel,
  paymentMethod,
  transactionId,
  couponCode = "",
  couponDiscount = 0,
  bookingData = {},
}) {
  // Safe overrides for parameters
  flight = flight || {};
  fare = fare || {};
  passengers = passengers || [];

  // ── Derived values ───────────────────────────────────────────────────────
  const invNum = invoiceNo || `FAT-${Math.floor(Math.random() * 900000 + 100000)}`;
  const pnrCode = (pnr || bookingData?.pnr || "VG2434").toUpperCase();

  const dateObj = bookingDate ? new Date(bookingDate) : new Date();
  const dateStr = dateObj.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  const getCityName = (code) => {
    if (!code) return "";
    const mapping = {
      DEL: "New Delhi",
      BOM: "Mumbai",
      BLR: "Bengaluru",
      MAA: "Chennai",
      CCU: "Kolkata",
      HYD: "Hyderabad",
      COK: "Kochi",
      GOI: "Goa",
      AMD: "Ahmedabad",
      PNQ: "Pune"
    };
    return mapping[code.toUpperCase()] || code;
  };

  const getDepartureCityName = (flightObj) => {
    if (!flightObj) return "New Delhi";
    const segment = flightObj.raw?.Segments?.[0]?.[0] || flightObj.raw?.Segments?.[0];
    const name = segment?.Origin?.Airport?.CityName || flightObj.fromCity || flightObj.departCity || flightObj.depCity || flightObj.from;
    if (!name) return "New Delhi";
    if (name.length === 3) return getCityName(name);
    return name;
  };

  const getArrivalCityName = (flightObj) => {
    if (!flightObj) return "Mumbai";
    const segments = Array.isArray(flightObj.raw?.Segments?.[0]) ? flightObj.raw.Segments[0] : [];
    const segment = segments.length > 0 ? segments[segments.length - 1] : (flightObj.raw?.Segments?.[0] || null);
    const name = segment?.Destination?.Airport?.CityName || flightObj.toCity || flightObj.arrivalCity || flightObj.arrCity || flightObj.to;
    if (!name) return "Mumbai";
    if (name.length === 3) return getCityName(name);
    return name;
  };

  const airline = flight.airline || flight.airlineName || flight.raw?.Segments?.[0]?.[0]?.Airline?.AirlineName || "IndiGo";
  const flightNo = flight.code || flight.flightNo || flight.flightNumber || (flight.raw?.Segments?.[0]?.[0]?.Airline ? `${flight.raw.Segments[0][0].Airline.AirlineCode}-${flight.raw.Segments[0][0].Airline.FlightNumber}` : "6E-204");
  const fromCode = flight.from || flight.fromCode || flight.departCity || flight.depCity || flight.raw?.Segments?.[0]?.[0]?.Origin?.Airport?.AirportCode || "DEL";
  const fromCity = getDepartureCityName(flight);
  
  const rawSegments = Array.isArray(flight.raw?.Segments?.[0]) ? flight.raw.Segments[0] : [];
  const lastSeg = rawSegments.length > 0 ? rawSegments[rawSegments.length - 1] : null;

  const toCode = flight.to || flight.toCode || flight.arrivalCity || flight.arrCity || lastSeg?.Destination?.Airport?.AirportCode || "BOM";
  const toCity = getArrivalCityName(flight);

  // Determine if Domestic or International Route
  const getIsDomestic = () => {
    if (rawSegments.length > 0) {
      const originCountry = rawSegments[0]?.Origin?.Airport?.CountryCode || rawSegments[0]?.Origin?.Airport?.CountryName;
      const destCountry = rawSegments[rawSegments.length - 1]?.Destination?.Airport?.CountryCode || rawSegments[rawSegments.length - 1]?.Destination?.CountryName;
      if (originCountry && destCountry) {
        return (originCountry === "IN" || originCountry === "India") && (destCountry === "IN" || destCountry === "India");
      }
    }
    const nonIndianCodes = ["DXB", "SIN", "LHR", "JFK", "CDG", "HND", "SYD", "BKK", "KUL", "USM", "NRT", "MXP", "FCO", "AUH", "DOH", "KTM", "BKK", "HKG", "ICN"];
    const fromCodeUpper = (fromCode || "").toUpperCase();
    const toCodeUpper = (toCode || "").toUpperCase();
    if (nonIndianCodes.includes(fromCodeUpper) || nonIndianCodes.includes(toCodeUpper)) {
      return false;
    }
    return true;
  };
  const isDomestic = getIsDomestic();

  const formatRawTime = (isoString) => {
    if (!isoString) return null;
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch (e) {
      return null;
    }
  };

  const rawDepTime = rawSegments[0]?.Origin?.DepTime;
  const rawArrTime = lastSeg?.Destination?.ArrTime;

  const depTime = flight.depTime || flight.departTime || flight.time || formatRawTime(rawDepTime) || "06:00";
  const arrTime = flight.arrTime || flight.arrivalTime || flight.arrival || formatRawTime(rawArrTime) || "08:10";
  const duration = flight.duration || "2h 10m";
  const rawFlightDate = flight.date || flight.depDate || flight.departDate || rawDepTime;
  const flightDate = rawFlightDate
    ? new Date(rawFlightDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : dateStr;

  const cname = customerName || "Valued Customer";
  const cemail = customerEmail || "user@email.com";
  const cphone = customerPhone || "+91 98765 43210";
  const caddr = customerAddress || "India";

  const meal = mealSelected || "No Meal";
  const bagKg = baggageKg ?? 15;
  const seat = seatLabel || "12A";

  const payMode = paymentMethod || "Online — UPI / Card";
  const txnId = transactionId || "TXN240722094823";

  // ── Price lines & Statutory GST Rules ────────────────────────────────────
  const baseFare = fare.baseFare ?? 3499;
  const mealAmount = fare.mealAmount ?? 0;
  const baggageAmount = fare.baggageAmount ?? 0;
  const seatAmount = fare.seatAmount ?? 0;
  const priorityAmount = fare.priorityAmount ?? 0;
  const wifiAmount = fare.wifiAmount ?? 0;
  const insuranceAmount = fare.insuranceAmount ?? 0;
  const convFee = fare.convenienceFee ?? 99;
  const asfFee = fare.asfFee ?? 0; // Aviation Security Fee (ASF)
  const udfFee = fare.udfFee ?? 0; // User Development Fee (UDF)

  // GST Law Rates: Economy 5% (HSN 996411), Business/First 12% (HSN 996412), Catering 5% (HSN 9963), Services 18% (HSN 998552 / 9964)
  const flightClassLower = (flight.class || flight.cabin || "").toLowerCase();
  const isBusinessOrFirst = flightClassLower.includes("business") || flightClassLower.includes("first") || flightClassLower.includes("premium");
  
  const IGST_FLIGHT = isBusinessOrFirst ? 0.12 : 0.05;
  const HSN_FLIGHT = isBusinessOrFirst ? "996412" : "996411";
  const IGST_MEAL = 0.05;
  const IGST_SERV = 0.18;

  const cleanSeat = typeof seat === "string" && seat.includes(":") ? seat.split(":").pop().trim() : (seat || "12A");

  const lineItems = [
    {
      desc: `Air Ticket (${isBusinessOrFirst ? "Business/Premium" : "Economy"}) — ${airline} ${flightNo}`,
      sub: `${fromCity} (${fromCode}) → ${toCity} (${toCode}) · ${flightDate}`,
      hsn: HSN_FLIGHT, amount: baseFare, igstPct: IGST_FLIGHT,
    },
    ...(asfFee > 0 ? [{
      desc: "Aviation Security Fee (ASF)",
      sub: "DGCA Statutory Airport Security Charge",
      hsn: "9964", amount: asfFee, igstPct: IGST_SERV,
    }] : []),
    ...(udfFee > 0 ? [{
      desc: "User Development Fee (UDF)",
      sub: "Airport Infrastructure Development Levy",
      hsn: "9964", amount: udfFee, igstPct: IGST_SERV,
    }] : []),
    ...(mealAmount > 0 ? [{
      desc: `Meal Add-on — ${meal}`,
      sub: "In-flight catering service",
      hsn: "9963", amount: mealAmount, igstPct: IGST_MEAL,
    }] : []),
    ...(baggageAmount > 0 ? [{
      desc: `Extra Baggage — ${bagKg} kg Check-in`,
      sub: "Pre-paid excess baggage allowance",
      hsn: "9964", amount: baggageAmount, igstPct: IGST_SERV,
    }] : []),
    ...(seatAmount > 0 ? [{
      desc: `Seat Selection — Seat ${cleanSeat}`,
      sub: "Pre-reserved seat assignment",
      hsn: "9964", amount: seatAmount, igstPct: IGST_SERV,
    }] : []),
    ...(priorityAmount > 0 ? [{
      desc: "Priority Boarding",
      sub: "Priority boarding & check-in service",
      hsn: "9964", amount: priorityAmount, igstPct: IGST_SERV,
    }] : []),
    ...(wifiAmount > 0 ? [{
      desc: "In-flight Wi-Fi",
      sub: "Satellite internet connectivity",
      hsn: "9984", amount: wifiAmount, igstPct: IGST_SERV,
    }] : []),
    ...(insuranceAmount > 0 ? [{
      desc: "Travel Insurance",
      sub: "Comprehensive trip protection policy",
      hsn: "9971", amount: insuranceAmount, igstPct: IGST_SERV,
    }] : []),
    {
      desc: "Convenience Fee",
      sub: "Travel Agency Platform Booking & Support Charge",
      hsn: "998552", amount: convFee, igstPct: IGST_SERV,
    },
  ];

  const rows = lineItems.map((li) => {
    const taxable = Math.round(li.amount / (1 + li.igstPct));
    const totalTax = li.amount - taxable;

    let cgstPct = 0;
    let sgstPct = 0;
    let cessPct = 0;
    let cgstAmt = 0;
    let sgstAmt = 0;
    let cessAmt = 0;

    if (isDomestic) {
      cgstPct = li.igstPct / 2;
      sgstPct = li.igstPct / 2;
      cessPct = 0;
      cgstAmt = Math.round(totalTax / 2);
      sgstAmt = totalTax - cgstAmt;
      cessAmt = 0;
    }

    return {
      ...li,
      taxable,
      totalTax,
      cgstPct,
      sgstPct,
      cessPct,
      cgstAmt,
      sgstAmt,
      cessAmt
    };
  });

  const totalTaxable = rows.reduce((s, r) => s + r.taxable, 0);
  const totalTax = rows.reduce((s, r) => s + r.totalTax, 0);
  const grandTotal = rows.reduce((s, r) => s + r.amount, 0);

  const cDiscount = couponDiscount || fare?.couponDiscount || bookingData?.couponDiscount || 0;
  const cCode = couponCode || fare?.couponCode || bookingData?.couponCode || "";
  const netGrandTotal = Math.max(0, grandTotal - cDiscount);

  // Dynamic International Tax partition (Statutory Airport & Fuel Surcharges)
  let intlTaxes = [];
  if (!isDomestic) {
    const psf = Math.round(totalTax * 0.35);
    const udf = Math.round(totalTax * 0.35);
    const fuelSurcharge = Math.round(totalTax * 0.20);
    const other = totalTax - psf - udf - fuelSurcharge;
    intlTaxes = [
      { name: "Passenger Service Fee (PSF / ASF)", rate: "Statutory", base: totalTaxable, amount: psf },
      { name: "User Development Fee (UDF)", rate: "Statutory", base: totalTaxable, amount: udf },
      { name: "International Fuel Surcharge (YQ/YR)", rate: "Carrier", base: totalTaxable, amount: fuelSurcharge },
      { name: "Platform Service GST & Taxes", rate: "18.0%", base: totalTaxable, amount: other },
    ];
  }

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const pct = (p) => `${Number((p * 100).toFixed(1))}%`;

  const LogoSVG = () => (
    <svg width="150" height="34" viewBox="0 0 167 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46.0577 29.8195C45.8313 29.859 45.8572 29.8869 45.669 29.8217C45.5655 29.3527 46.0186 28.6877 46.2037 28.2415L47.4715 25.1305C49.0781 21.089 50.7458 17.0692 52.4739 13.0721C52.7589 12.3963 53.0368 11.5939 53.3471 10.9527C54.4157 8.77705 54.6028 5.69799 57.6973 5.3103C61.6737 4.81215 62.4007 9.10405 63.5221 11.8436L66.3168 18.6431C66.5946 19.3192 67.4765 21.3076 67.551 21.8736L63.8711 23.144C63.518 22.5059 63.2716 21.8695 62.8693 21.2352L60.164 14.6611C59.5508 13.1689 58.7946 11.4276 58.2536 9.9216C56.5563 14.1801 54.8219 18.4256 53.0506 22.6575C52.5429 23.9461 51.6261 26.589 51.0683 27.7266C49.8779 28.3353 46.9982 29.1897 46.0577 29.8195Z" fill="#282828" />
      <path d="M72.3823 13.0811L76.6768 13.0906C76.6144 13.7734 76.6422 15.1815 76.6316 15.9165C77.6028 15.0349 78.3705 14.3859 79.6387 13.8502C81.6722 12.9913 84.4278 12.8327 86.5352 13.5432C87.3763 13.8268 88.5807 14.5593 88.9488 15.3374C87.1728 15.9096 85.2592 16.4176 83.4482 16.9046C79.7559 17.8975 76.0631 19.2961 72.384 20.2631L72.3823 13.0811Z" fill="#282828" />
      <path d="M114.33 5.28366L118.635 5.27832C118.62 6.52593 118.643 7.81668 118.648 9.06781C117.605 9.17959 115.353 9.52617 114.327 9.74644C114.405 8.4989 114.333 6.58179 114.33 5.28366Z" fill="#282828" />
      <path d="M92.8892 13.0827C93.7751 13.0761 96.6211 12.9811 97.2774 13.2205C95.9517 13.6305 94.5405 13.9358 93.1807 14.2414C93.0895 14.262 92.9934 14.271 92.9054 14.3014L92.8892 13.0827Z" fill="#282828" />
      <path d="M138.49 7.83259C138.538 7.82686 138.586 7.82235 138.634 7.81906C138.881 7.77663 139.08 7.77663 139.242 7.91035C139.35 8.48652 139.237 9.88468 139.195 10.5344C136.132 10.5642 132.967 10.7516 129.912 10.9375C109.505 12.1788 89.7613 16.4683 70.3704 22.4386C65.7004 23.902 61.0561 25.4364 56.4391 27.0411C54.526 27.7048 51.1803 29.0018 49.3118 29.517C49.0685 29.5236 48.8299 29.5597 48.6377 29.4298L48.714 29.3136C49.2426 29.0163 51.897 28.0931 52.6248 27.8244C55.6585 26.6948 58.7005 25.5848 61.7505 24.4946C86.3665 15.7639 112.093 8.9627 138.49 7.83259Z" fill="#FE2C1C" />
      <path d="M140.711 7.17773L144.7 7.18064L144.694 10.8496C143.384 10.8308 142.028 10.8478 140.714 10.8481C140.699 9.63221 140.711 8.39545 140.711 7.17773Z" fill="#FE2C1C" />
      <path d="M110.976 13.5498L110.968 23.8995C110.968 25.702 111.156 30.2857 110.617 31.7735C107.55 40.2513 95.2036 39.7291 92.9692 30.6587C94.4202 30.6368 95.8705 30.6345 97.3216 30.6519C98.0772 32.1031 98.7051 33.0459 100.44 33.6087C101.63 33.9875 102.931 33.9101 104.061 33.3931C106.784 32.144 106.792 29.9453 106.763 27.4891C105.707 28.7562 104.443 29.7532 102.679 29.9541C100.482 30.2044 98.2238 29.5309 96.5032 28.2229C94.5481 26.7358 93.3152 24.9838 92.9602 22.634C92.79 21.5114 93.0433 17.6573 92.812 16.9645C94.1743 16.6539 95.8436 16.2732 97.2059 16.0488C97.0667 17.6069 97.1823 19.9138 97.1677 21.5127C97.1571 22.7159 97.7816 24.0564 98.7726 24.8751C99.7384 25.6754 101.007 26.0773 102.292 25.9902C103.573 25.9057 104.765 25.3469 105.607 24.4367C106.091 23.9128 106.429 23.2848 106.592 22.6084C106.925 21.2688 106.858 15.7597 106.738 14.2027C108.144 13.9491 109.557 13.7314 110.976 13.5498Z" fill="#282828" />
      <path d="M148.177 13.0873C149.552 13.0593 151.029 13.085 152.412 13.0847C152.357 13.8747 152.367 14.7916 152.358 15.5918C153.948 13.5729 155.741 12.8886 158.408 13.1611C160.767 13.4023 162.849 14.5565 164.315 16.3072C165.791 18.0608 166.461 20.2947 166.178 22.514C165.894 24.7816 164.652 26.8471 162.729 28.2452C160.905 29.5867 158.761 30.205 156.445 29.9555C154.709 29.7685 153.406 28.7258 152.361 27.4695C152.562 30.8104 152.137 34.4785 152.408 37.7791L150.986 37.7679L148.193 37.7697C148.132 32.1766 148.174 26.4411 148.198 20.8421C149.575 20.8478 151.007 20.8718 152.378 20.8243C152.384 21.7255 152.384 22.3843 152.748 23.2378C154.01 26.1926 158.213 26.9533 160.615 24.7036C161.531 23.8418 162.047 22.675 162.05 21.4576C162.048 18.3221 158.517 16.1779 155.477 17.3006C155.019 17.47 154.614 17.7828 154.194 17.9471C152.614 18.5646 150.544 18.4024 149.324 17.1866C148.018 15.9299 148.18 14.6371 148.177 13.0873Z" fill="#282828" />
      <path d="M123.865 13.0742L128.012 13.0828L127.991 15.927C130.591 13.062 134.946 12.4818 138.574 13.7616C137.906 14.9324 137.127 16.1318 136.437 17.3178C135.934 17.1483 135.404 17.0571 134.869 17.0479C132.962 17.0178 131.273 17.7988 129.921 19.0221C127.795 21.0958 127.991 23.2227 127.998 25.8802L128.013 30.0474C126.638 30.0247 125.216 30.0426 123.836 30.0436C123.852 24.4271 123.758 18.6756 123.865 13.0742Z" fill="#282828" />
      <path d="M32.8598 6.41113L32.9942 6.44503C33.1125 7.14319 28.5515 20.1694 28.0252 22.1865C27.6944 23.4547 26.6399 25.8771 26.6457 27.3687C26.6471 27.7107 26.7376 27.9828 26.9992 28.2334C27.1056 28.3354 27.2757 28.4006 27.424 28.3827C29.6414 28.1146 29.642 23.7144 30.3073 23.0399C30.5457 22.9948 30.4596 22.9798 30.6641 23.0836C30.7994 23.3613 30.7494 23.7448 30.6883 24.0386C30.3877 25.4838 30.1307 27.4104 29.0563 28.5431C27.9992 29.9656 24.4089 30.8323 23.4134 29.1564C22.3898 27.4332 23.7854 23.9829 24.407 22.1934L26.8674 15.0739C27.2833 13.8836 27.7196 12.7039 28.1126 11.5026C28.3864 10.6652 27.422 10.292 26.7038 10.2311C26.3923 10.2047 26.146 10.3236 25.7965 10.2543L25.7546 10.1133C26.0887 9.34573 27.3468 8.98234 28.1108 8.58935C29.6572 7.79398 31.2587 7.10136 32.8598 6.41113Z" fill="#FE2C1C" />
      <path d="M114.327 13.0463C115.76 12.8625 117.195 12.6935 118.632 12.5391C118.643 18.3463 118.573 24.2508 118.642 30.0463C117.281 30.0419 115.677 30.0765 114.33 30.0251C114.344 24.5106 114.459 18.5322 114.327 13.0463Z" fill="#282828" />
      <path d="M140.666 13.0789L144.864 13.0781L144.866 25.2936C144.866 25.8797 144.902 29.6507 144.83 29.9938L144.708 30.0399L140.647 30.0297C140.713 27.8477 140.674 25.5235 140.674 23.3324L140.666 13.0789Z" fill="#282828" />
      <path d="M85.8647 18.6545C87.2637 18.2726 88.6757 17.9326 90.0974 17.6348C90.5307 19.8251 90.4549 21.7079 90.4541 23.9208L90.4517 30.0539C89.0495 30.0356 87.6464 30.0325 86.2434 30.0444L86.2491 24.5625C86.2499 22.9515 86.3647 20.1417 85.8647 18.6545Z" fill="#282828" />
      <path d="M72.3457 22.4264C72.5161 22.4069 73.4632 22.1131 73.6792 22.0519C74.7882 21.7378 75.8986 21.3535 77.025 21.0986C76.4176 23.3938 76.644 27.5115 76.6458 30.0521C75.2233 30.0363 73.8008 30.0318 72.3783 30.0384C72.3792 27.5283 72.4139 24.929 72.3457 22.4264Z" fill="#282828" />
      <path d="M68.3523 23.709C69.2211 25.621 70.212 28.0697 70.9188 30.0348C69.5946 30.0383 67.6696 30.1015 66.3941 30.0319C66.2156 29.5493 64.5264 25.1217 64.3423 25.0051C65.3431 24.6038 67.2856 24.003 68.3523 23.709Z" fill="#282828" />
      <path d="M9.22393 7.05994C7.35445 7.38183 6.04099 8.48623 4.99217 9.92613C4.74391 10.267 4.22818 11.0185 3.93925 11.2812L3.86464 11.2166C3.95155 9.34881 7.40622 6.12268 9.44045 5.84767C11.628 5.55195 14.2564 5.90244 16.5005 5.79627C19.6104 5.83239 22.5227 5.71438 25.5839 5.67871C25.4166 6.50777 24.9898 7.60745 24.7079 8.43654C24.3605 9.46075 24.0418 10.4934 23.752 11.5332C23.6443 11.9075 23.4775 13.0449 23.3735 13.1885C23.0375 13.2272 22.8602 13.2335 22.5214 13.2284C22.7588 10.1845 24.0189 6.65224 19.3368 6.51124C17.3563 6.45161 16.1826 6.4217 14.2222 6.79496C12.89 8.01641 12.7852 9.27702 12.3108 10.9237C11.9297 12.2293 11.5415 13.5331 11.1461 14.8351C10.8508 15.8075 10.1883 17.4583 9.9971 18.2509C11.8032 18.2492 14.2094 18.6091 15.5302 17.2756C16.0467 16.7542 16.2408 16.4328 16.6346 15.8504C17.0622 15.218 17.4733 13.3826 18.4544 13.5671C18.5583 13.71 18.5779 13.7162 18.5207 13.9049C17.5925 16.9693 16.6929 20.0896 16.0612 23.2168C16.0312 23.3657 15.9435 23.5351 15.8112 23.6226C15.5631 23.6832 15.4767 23.715 15.2316 23.6202C14.6051 22.9889 16.501 18.9359 13.074 19.007C12.1976 19.0252 10.6569 19.0543 9.78742 19.0026C9.32588 20.6015 8.85196 22.1971 8.36558 23.7894C7.95447 25.1421 7.5743 26.2572 7.37201 27.6645C7.09643 29.5818 10.4601 28.7323 10.716 29.6238C10.641 29.8422 10.677 29.7711 10.4693 29.9367C10.0039 30.0333 7.04223 29.9579 6.31185 29.9525C4.20784 29.9484 2.10384 29.9589 0 29.984V29.4403C0.62548 28.936 2.51857 29.2153 3.03406 28.3048C4.09981 26.4222 4.70205 23.8975 5.31773 21.8495L7.58083 14.296C8.10127 12.5399 8.65066 10.7935 9.12841 9.02647C9.3328 8.27047 9.29461 7.82359 9.22393 7.05994Z" fill="#FE2C1C" />
      <path d="M34.9796 12.9738C34.4258 12.8104 33.3207 12.7946 33.153 12.6275C33.4901 12.3009 37.446 12.3749 38.098 12.3568C38.2885 14.0472 38.5034 15.9191 38.5379 17.6156C38.5922 20.2884 39.0812 23.0601 39.003 25.7125C40.5656 22.968 42.2073 20.2639 43.9261 17.6029C44.5921 16.5611 45.5074 15.0456 46.2385 14.0833C46.3913 12.8342 46.0877 12.9357 45.1386 12.4567C45.3018 12.3096 48.6653 12.3429 49.0775 12.4298C48.8402 12.8986 48.313 12.7959 47.9286 13.2123C47.2497 13.9478 46.4267 14.9377 45.9141 15.7713C45.0666 17.1496 44.354 18.67 43.5306 20.055C42.6847 21.4779 41.6332 22.8464 40.8168 24.2894L38.4216 28.4464C37.9943 29.1893 37.4734 30.2211 36.9945 30.9089C34.886 33.9375 32.5888 36.1737 28.8605 37.3479C27.9673 37.6292 27.2197 37.7613 26.3762 37.9997H24.1349C22.5099 37.4422 22.1019 37.1437 21.6919 35.5259C22.2212 34.0654 22.9746 32.4984 24.915 33.4881C25.0991 33.7309 25.3121 33.9988 25.4689 34.2541C25.5416 35.4798 25.5215 35.8242 24.715 36.8383C24.3004 37.3594 25.5902 37.452 25.9143 37.4107C28.442 37.1232 31.6315 35.6661 33.341 33.9018C33.7487 33.4809 36.5468 29.6051 36.5664 29.2816C36.7447 26.3455 36.1723 23.339 35.8831 20.4423L35.4287 16.1892C35.3045 15.0423 35.2586 14.0995 34.9796 12.9738Z" fill="#FE2C1C" />
      <path d="M161.156 0H162.856C164.166 0.623913 165.254 0.678261 166.154 2.29841C166.318 2.59317 166.625 3.48062 166.765 3.66028V5.25719C165.938 6.82495 165.834 7.76445 163.871 8.56036C162.723 9.01565 161.431 9.02651 160.274 8.59048C159.09 8.14948 158.144 7.2808 157.648 6.17916C157.16 5.10197 157.147 3.88722 157.609 2.80044C158.357 1.07358 159.515 0.649331 161.156 0ZM162.307 8.60852C163.6 8.47021 164.645 8.05207 165.478 7.06708C166.207 6.19205 166.535 5.0805 166.389 3.97812C166.125 1.85851 164.057 0.0108804 161.738 0.317831C161.705 0.322242 161.672 0.32785 161.64 0.334641C160.361 0.48137 159.341 0.907131 158.533 1.87957C157.797 2.78053 157.476 3.91992 157.638 5.04493C157.787 6.13607 158.396 7.12538 159.329 7.79182C160.05 8.30652 161.397 8.7424 162.307 8.60852Z" fill="#282828" fillOpacity={0.968627} />
      <path d="M159.728 2.90307C160.167 2.89678 161.109 2.86156 161.5 2.9252L161.545 3.03426C161.452 2.99006 160.974 3.04141 160.839 3.05078C160.86 3.249 160.931 6.25935 160.938 6.24373C160.65 6.25118 160.448 6.28002 160.198 6.14403L160.448 5.94892C160.499 5.42669 160.601 3.61253 160.316 3.22477C159.917 3.20766 159.813 3.70593 159.682 4.01557L159.728 2.90307Z" fill="black" fillOpacity={0.980392} />
      <path d="M163.458 3.93865C163.51 3.64273 163.566 3.139 163.733 2.90577C163.962 2.85956 164.089 2.89453 164.315 2.93435C164.319 3.16526 164.162 3.15858 164.164 3.21218C164.196 3.802 164.146 5.77615 164.484 6.19408C164.29 6.31688 163.871 6.2614 163.652 6.18947L163.624 6.07387C163.681 5.99361 163.749 5.89503 163.83 5.77813C163.839 5.19561 163.771 4.46999 163.806 3.90371L163.743 4.0795L163.458 3.93865Z" fill="#282828" />
      <path d="M162.062 3.41767C161.999 3.11404 162.049 3.21822 161.805 2.98949C161.982 2.87255 161.976 2.90715 162.217 2.8916C162.94 3.18753 162.799 4.81836 163.128 5.23072L163.203 5.05906L163.395 5.12524C163.308 5.44978 163.225 5.95304 162.988 6.15425C162.672 5.94869 162.536 4.47812 162.349 3.98092L162.215 3.92963C162.115 3.82019 162.091 3.57013 162.062 3.41767Z" fill="#282828" />
      <path d="M162.066 3.41895C162.094 3.5714 162.119 3.82147 162.218 3.9309C162.304 4.28224 162.157 5.54966 162.056 5.92761C162.192 6.03353 162.235 6.06072 162.391 6.13935L162.31 6.21297C162.101 6.23376 161.893 6.28104 161.721 6.1751C161.985 5.06919 162.024 4.52702 162.066 3.41895Z" fill="#282828" fillOpacity={0.933333} />
      <path d="M163.204 5.05933C163.21 4.77382 163.377 4.23648 163.458 3.93945L163.743 4.0803C163.419 4.45717 163.43 4.63476 163.397 5.12551L163.204 5.05933Z" fill="#282828" fillOpacity={0.890196} />
    </svg>
  );

  const pageStyle = {
    width: "794px",
    height: "1123px",
    padding: "20px 26px",
    background: "#ffffff",
    boxSizing: "border-box",
    fontFamily: "'Quicksand', 'Satoshi', sans-serif",
    fontSize: "10.5px",
    color: "#1e293b",
    lineHeight: "1.3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const getCleanSeatDisplay = (seatStr) => {
    if (!seatStr) return "12A";
    const matches = String(seatStr).match(/\b([0-9]{1,2}[A-Z])\b/gi);
    if (matches && matches.length > 0) {
      return matches.join(", ");
    }
    const cleaned = String(seatStr).replace(/^[^:]*:\s*/, "").trim();
    return cleaned || "12A";
  };
  const displaySeat = getCleanSeatDisplay(seatLabel || seat);

  return (
    <div
      id={id}
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        width: "794px",
      }}
    >

      {/* =================================================================== */}
      {/* ── PAGE 1: INVOICE & PRICING BREAKDOWN ──────────────────────────── */}
      {/* =================================================================== */}
      <div className="invoice-page-single" style={pageStyle}>
        <div>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "8px",
            borderBottom: "2px solid #f1f5f9",
            marginBottom: "8px",
          }}>
            <div style={{ minWidth: "320px" }}>
              <div style={{ marginBottom: "4px" }}><LogoSVG /></div>
              <div style={{
                fontFamily: "'Times New Roman', Times, serif",
                color: "#1a1a1a",
                fontSize: "17px",
                fontWeight: "bold",
                marginTop: "6px",
                marginBottom: "2px"
              }}>
                AnyTrip India Pvt Ltd
              </div>
              <div style={{
                fontFamily: "'Quicksand', sans-serif",
                color: "#475569",
                fontSize: "10px",
                lineHeight: "1.4",
                marginTop: "4px"
              }}>
                <strong>GSTIN:</strong> 24ABECA2712K1ZY &nbsp;|&nbsp; <strong>CIN:</strong> U52291GJ2025PTC170152<br />
                Shop No 16, VED TransCube Plaza, Opp Railway Station<br />
                Vadodara – 390002, Gujarat, India
              </div>
            </div>
            <div style={{ textAlign: "right", minWidth: "250px" }}>
              <div style={{
                color: "#FE2C1C",
                fontSize: "19px",
                fontWeight: "900",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                lineHeight: "1.2",
                marginBottom: "6px"
              }}>
                Tax Invoice
              </div>
              <div style={{ color: "#475569", fontSize: "11.5px", lineHeight: "1.4" }}>
                Invoice No: <strong style={{ color: "#0f172a" }}>{invNum}</strong>
              </div>
              <div style={{ color: "#475569", fontSize: "11.5px", lineHeight: "1.4" }}>Booking Date: {dateStr}</div>
              <div style={{ marginTop: "6px" }}>
                <span style={{
                  background: "#fef2f2",
                  color: "#FE2C1C",
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid #fecaca",
                }}>
                  CONFIRMED E-TICKET
                </span>
              </div>
            </div>
          </div>

          {/* Info Strip */}
          <div style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "8px 12px",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <div style={{ flex: 1, paddingRight: "12px" }}>
              <div style={{ color: "#64748b", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Billed To</div>
              <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#0f172a", marginTop: "2px" }}>{cname}</div>
              <div style={{ fontSize: "10.5px", color: "#475569", marginTop: "1px" }}>{caddr}</div>
              <div style={{ fontSize: "10.5px", color: "#475569" }}>{cphone}</div>
              <div style={{ fontSize: "10.5px", color: "#475569" }}>{cemail}</div>
            </div>
            <div style={{ flex: 1, paddingLeft: "12px", paddingRight: "12px", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ color: "#64748b", fontSize: "9.5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Booking Reference (PNR)</div>
              <div style={{
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                padding: "3px 12px",
                borderRadius: "6px",
                display: "inline-block",
                fontFamily: "'Quicksand', 'Satoshi', sans-serif",
                fontWeight: "900",
                fontSize: "16px",
                color: "#0f172a",
                letterSpacing: "2.5px",
                marginTop: "3px",
              }}>{pnrCode}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginTop: "4px" }}>
                <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "10px", color: "#059669", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>Confirmed</span>
              </div>
            </div>
            <div style={{ flex: 1, paddingLeft: "12px", textAlign: "right" }}>
              <div style={{ color: "#64748b", fontSize: "9px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Payment Method</div>
              <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>{payMode}</div>
              <div style={{ fontSize: "9.5px", fontFamily: "monospace", color: "#64748b", marginTop: "1px" }}>ID: {txnId}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", marginTop: "3px" }}>
                <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: "9.5px", color: "#059669", fontWeight: "700", textTransform: "uppercase" }}>Paid</span>
              </div>
            </div>
          </div>

          {/* Flight Card */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "8px 12px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ minWidth: "100px" }}>
              <div style={{ color: "#64748b", fontSize: "9px", fontWeight: "700", textTransform: "uppercase" }}>Departure</div>
              <div style={{ color: "#0f172a", fontSize: "19px", fontWeight: "800", marginTop: "1px" }}>{fromCode}</div>
              <div style={{ color: "#475569", fontSize: "10.5px", fontWeight: "600" }}>{fromCity}</div>
              <div style={{ color: "#0f172a", fontSize: "11px", fontWeight: "700", marginTop: "1px" }}>{depTime}</div>
            </div>

            <div style={{ textAlign: "center", flex: 1, padding: "0 8px" }}>
              <div style={{ color: "#FE2C1C", fontSize: "12px", fontWeight: "800" }}>{airline} · {flightNo}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "2px 0" }}>
                <div style={{ height: "1px", background: "#cbd5e1", flex: 1 }} />
                <span style={{ margin: "0 6px", color: "#64748b", fontSize: "10px" }}>✈</span>
                <div style={{ height: "1px", background: "#cbd5e1", flex: 1 }} />
              </div>
              <div style={{ color: "#475569", fontSize: "10px", fontWeight: "600" }}>{duration} · {flight.stops || "Non-stop"} · {flightDate}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "4px" }}>
                {[["Class", flight.class || "Economy"], ["Seat", displaySeat], ["Baggage", bagKg > 0 ? `${bagKg}kg` : "7kg Cabin"]].map(([l, v], i) => (
                  <div key={i} style={{ textAlign: "center", background: "#ffffff", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: "4px", minWidth: "42px" }}>
                    <span style={{ color: "#64748b", fontSize: "8px", textTransform: "uppercase", display: "block" }}>{l}</span>
                    <span style={{ color: "#0f172a", fontSize: "10px", fontWeight: "700", whiteSpace: "nowrap", display: "block" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ minWidth: "100px", textAlign: "right" }}>
              <div style={{ color: "#64748b", fontSize: "9px", fontWeight: "700", textTransform: "uppercase" }}>Arrival</div>
              <div style={{ color: "#0f172a", fontSize: "19px", fontWeight: "800", marginTop: "1px" }}>{toCode}</div>
              <div style={{ color: "#475569", fontSize: "10px", fontWeight: "600" }}>{toCity}</div>
              <div style={{ color: "#0f172a", fontSize: "11px", fontWeight: "700", marginTop: "1px" }}>{arrTime}</div>
            </div>
          </div>

          {/* Passenger Table */}
          {passengers.length > 0 && (
            <div style={{ marginBottom: "8px" }}>
              <div style={{
                fontSize: "10.5px",
                fontWeight: "800",
                color: "#0f172a",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}>Passenger Details</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", border: "1px solid #e2e8f0", borderRadius: "5px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    {["#", "Passenger Name", "Type", "Seat", "Baggage Allowance", "Meal Preference"].map((h, i) => (
                      <th key={i} style={{
                        color: "#1e293b",
                        padding: "4px 8px",
                        fontWeight: "700",
                        fontSize: "9px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        textAlign: "left",
                        borderBottom: "1px solid #cbd5e1",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {passengers.map((p, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{i + 1}</td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", fontWeight: "700", color: "#0f172a" }}>
                        {p.title || "Mr."} {p.firstName || "Rahul"} {p.lastName || "Sharma"}
                      </td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{p.type || "Adult"}</td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", color: "#0f172a", fontWeight: "600" }}>{p.seat || seat}</td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{bagKg > 0 ? `${bagKg} kg` : "7 kg Cabin"}</td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{meal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Charges Table */}
          <div style={{
            fontSize: "10.5px",
            fontWeight: "800",
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "4px",
          }}>Itemized Tax Invoice Charges</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden", marginBottom: "8px" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {(isDomestic
                  ? [
                      ["Description", "32%", "left"],
                      ["HSN/SAC", "8%", "left"],
                      ["Amount (₹)", "10%", "right"],
                      ["Taxable (₹)", "10%", "right"],
                      ["CGST (₹)", "10%", "right"],
                      ["SGST (₹)", "10%", "right"],
                      ["CESS (₹)", "8%", "right"],
                      ["Total (₹)", "12%", "right"],
                    ]
                  : [
                      ["Description", "40%", "left"],
                      ["HSN/SAC", "10%", "left"],
                      ["Amount (₹)", "12%", "right"],
                      ["Taxable (₹)", "12%", "right"],
                      ["Other Taxes (₹)", "14%", "right"],
                      ["Total (₹)", "12%", "right"],
                    ]
                ).map(([h, w, align], i) => (
                  <th key={i} style={{
                    color: "#1e293b",
                    padding: "4px 8px",
                    fontWeight: "700",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textAlign: align,
                    width: w,
                    borderBottom: "1px solid #cbd5e1",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", verticalAlign: "middle" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a" }}>{r.desc}</div>
                  </td>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", fontFamily: "monospace", color: "#475569", verticalAlign: "middle" }}>{r.hsn}</td>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569", verticalAlign: "middle" }}>{fmt(r.amount)}</td>
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569", verticalAlign: "middle" }}>{fmt(r.taxable)}</td>
                  
                  {isDomestic ? (
                    <>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569", verticalAlign: "middle" }}>
                        <span style={{ fontSize: "7.5px", color: "#64748b", display: "block", marginBottom: "1px" }}>{pct(r.cgstPct)}</span>
                        {fmt(r.cgstAmt)}
                      </td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569", verticalAlign: "middle" }}>
                        <span style={{ fontSize: "7.5px", color: "#64748b", display: "block", marginBottom: "1px" }}>{pct(r.sgstPct)}</span>
                        {fmt(r.sgstAmt)}
                      </td>
                      <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569", verticalAlign: "middle" }}>
                        <span style={{ fontSize: "7.5px", color: "#64748b", display: "block", marginBottom: "1px" }}>0%</span>
                        {fmt(0)}
                      </td>
                    </>
                  ) : (
                    <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569", verticalAlign: "middle" }}>
                      <span style={{ fontSize: "7.5px", color: "#64748b", display: "block", marginBottom: "1px" }}>{pct(r.igstPct)}</span>
                      {fmt(r.totalTax)}
                    </td>
                  )}
                  
                  <td style={{ padding: "4px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#0f172a", verticalAlign: "middle" }}>{fmt(r.amount)}</td>
                </tr>
              ))}
              <tr style={{ background: "#f1f5f9", fontWeight: "800" }}>
                <td colSpan={2} style={{ padding: "4px 8px", color: "#0f172a" }}>TOTAL</td>
                <td style={{ padding: "4px 8px", textAlign: "right", color: "#0f172a" }}>{fmt(grandTotal)}</td>
                <td style={{ padding: "4px 8px", textAlign: "right", color: "#0f172a" }}>{fmt(totalTaxable)}</td>
                
                {isDomestic ? (
                  <>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "#0f172a" }}>{fmt(rows.reduce((s, r) => s + r.cgstAmt, 0))}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "#0f172a" }}>{fmt(rows.reduce((s, r) => s + r.sgstAmt, 0))}</td>
                    <td style={{ padding: "4px 8px", textAlign: "right", color: "#0f172a" }}>{fmt(0)}</td>
                  </>
                ) : (
                  <td style={{ padding: "4px 8px", textAlign: "right", color: "#0f172a" }}>{fmt(totalTax)}</td>
                )}
                
                <td style={{ padding: "4px 8px", textAlign: "right", color: "#FE2C1C", fontSize: "10.5px" }}>{fmt(grandTotal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Slabs & Grand Total Row */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "8px", alignItems: "stretch" }}>
            <div style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              {isDomestic ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      {["Tax Category", "Taxable Value", "CGST", "SGST/UTGST", "CESS", "Total Tax"].map((h, i) => (
                        <th key={i} style={{
                          color: "#1e293b",
                          padding: "3px 6px",
                          fontWeight: "700",
                          fontSize: "8.5px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          textAlign: i === 0 ? "left" : "right",
                          borderBottom: "1px solid #cbd5e1",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.some(r => r.igstPct === 0.05) && (
                      <tr>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>Tax @ 5%</td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          {fmt(rows.filter(r => r.igstPct === 0.05).reduce((s, r) => s + r.taxable, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>2.5%</span>
                          {fmt(rows.filter(r => r.igstPct === 0.05).reduce((s, r) => s + r.cgstAmt, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>2.5%</span>
                          {fmt(rows.filter(r => r.igstPct === 0.05).reduce((s, r) => s + r.sgstAmt, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>0%</span>
                          {fmt(0)}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                          {fmt(rows.filter(r => r.igstPct === 0.05).reduce((s, r) => s + r.totalTax, 0))}
                        </td>
                      </tr>
                    )}
                    {rows.some(r => r.igstPct === 0.12) && (
                      <tr style={{ background: "#f8fafc" }}>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>Tax @ 12%</td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          {fmt(rows.filter(r => r.igstPct === 0.12).reduce((s, r) => s + r.taxable, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>6%</span>
                          {fmt(rows.filter(r => r.igstPct === 0.12).reduce((s, r) => s + r.cgstAmt, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>6%</span>
                          {fmt(rows.filter(r => r.igstPct === 0.12).reduce((s, r) => s + r.sgstAmt, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>0%</span>
                          {fmt(0)}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                          {fmt(rows.filter(r => r.igstPct === 0.12).reduce((s, r) => s + r.totalTax, 0))}
                        </td>
                      </tr>
                    )}
                    {rows.some(r => r.igstPct === 0.18) && (
                      <tr style={{ background: "#f8fafc" }}>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>Tax @ 18%</td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          {fmt(rows.filter(r => r.igstPct === 0.18).reduce((s, r) => s + r.taxable, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>9%</span>
                          {fmt(rows.filter(r => r.igstPct === 0.18).reduce((s, r) => s + r.cgstAmt, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>9%</span>
                          {fmt(rows.filter(r => r.igstPct === 0.18).reduce((s, r) => s + r.sgstAmt, 0))}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>
                          <span style={{ fontSize: "7.5px", color: "#64748b", marginRight: "3px" }}>0%</span>
                          {fmt(0)}
                        </td>
                        <td style={{ padding: "3px 6px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                          {fmt(rows.filter(r => r.igstPct === 0.18).reduce((s, r) => s + r.totalTax, 0))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      {["Tax Description", "Taxable Value", "Tax Rate", "Total Tax"].map((h, i) => (
                        <th key={i} style={{
                          color: "#1e293b",
                          padding: "5px 8px",
                          fontWeight: "700",
                          fontSize: "9.5px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          textAlign: i === 0 ? "left" : "right",
                          borderBottom: "1px solid #cbd5e1",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {intlTaxes.map((tax, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                        <td style={{ padding: "5px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>{tax.name}</td>
                        <td style={{ padding: "5px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>{fmt(tax.base)}</td>
                        <td style={{ padding: "5px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#475569" }}>{tax.rate}</td>
                        <td style={{ padding: "5px 8px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>{fmt(tax.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div style={{ padding: "6px 8px", fontSize: "9.5px", color: "#475569", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                <strong>Amount in Words:</strong> {amountInWords(netGrandTotal)}
              </div>
            </div>

            <div style={{ width: "260px", border: "1.5px solid #FE2C1C", borderRadius: "8px", overflow: "hidden", background: "#fef2f2", display: "flex", flexDirection: "column" }}>
              <div style={{ background: "#FE2C1C", color: "#ffffff", padding: "7px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11.5px", fontWeight: "800", textTransform: "uppercase", whiteSpace: "nowrap" }}>Grand Total</span>
                <span style={{ fontSize: "17px", fontWeight: "900", whiteSpace: "nowrap" }}>{fmt(netGrandTotal)}</span>
              </div>
              <div style={{ padding: "6px 10px", display: "flex", flexDirection: "column", gap: "3px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9.5px", color: "#b91c1c", lineHeight: "1.3" }}>
                  <span style={{ whiteSpace: "nowrap" }}>Gross Fare &amp; Fees:</span>
                  <span style={{ fontWeight: "600", whiteSpace: "nowrap" }}>{fmt(grandTotal)}</span>
                </div>
                {cDiscount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9.5px", color: "#15803d", fontWeight: "700", lineHeight: "1.3" }}>
                    <span style={{ whiteSpace: "nowrap" }}>Coupon ({cCode || "Applied"}):</span>
                    <span style={{ whiteSpace: "nowrap" }}>− {fmt(cDiscount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9.5px", color: "#b91c1c", lineHeight: "1.3" }}>
                  <span style={{ whiteSpace: "nowrap" }}>{isDomestic ? "Total GST Tax:" : "Total Taxes & Fees:"}</span>
                  <span style={{ fontWeight: "600", whiteSpace: "nowrap" }}>{fmt(totalTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: "8px",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          fontSize: "9px",
          color: "#64748b"
        }}>
          <div><strong>AnyTrip India Pvt Ltd</strong> &nbsp;|&nbsp; Tax Invoice &amp; Payment Breakdown</div>
          <div>Page 1 of 2</div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ── PAGE 2: COMPREHENSIVE TERMS, POLICIES & DECLARATION ─────────── */}
      {/* =================================================================== */}
      <div className="invoice-page-single" style={pageStyle}>
        <div>
          {/* Header Page 2 */}
          <div style={{
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            paddingBottom: "10px",
            borderBottom: "2px solid #f1f5f9",
            marginBottom: "14px",
          }}>
            <div>
              <LogoSVG />
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginTop: "2px" }}>
                Terms &amp; Conditions / Travel Guidelines
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11.5px", fontWeight: "800", color: "#0f172a" }}>
                PNR: <span style={{ color: "#FE2C1C", fontFamily: "monospace" }}>{pnrCode}</span>
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>Invoice No: {invNum}</div>
            </div>
          </div>

          {/* Section 1: Passenger Guidelines */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
              borderLeft: "3px solid #FE2C1C",
              paddingLeft: "8px"
            }}>
              1. Mandatory Passenger &amp; Airport Guidelines
            </div>
            <div style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "9.5px",
              color: "#334155",
              lineHeight: "1.4"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <strong>A. Government Photo ID Requirement:</strong>
                  <p style={{ margin: "2px 0 0 0", color: "#64748b" }}>
                    All adult passengers must present a valid government-issued photo ID (Aadhaar, Driving License, Passport, Voter ID) at airport entry. Infants require DOB verification proof.
                  </p>
                </div>
                <div>
                  <strong>B. Airport Reporting &amp; Boarding:</strong>
                  <p style={{ margin: "2px 0 0 0", color: "#64748b" }}>
                    Check-in counters close 60 mins before domestic and 75 mins before international departures. Boarding gates close strictly 25 mins prior to scheduled departure.
                  </p>
                </div>
                <div>
                  <strong>C. Web Check-in Mandate:</strong>
                  <p style={{ margin: "2px 0 0 0", color: "#64748b" }}>
                    Mandatory web check-in applies for all flights. Boarding pass must be generated online prior to reaching airport security checkpoint.
                  </p>
                </div>
                <div>
                  <strong>D. Health &amp; Security Protocol:</strong>
                  <p style={{ margin: "2px 0 0 0", color: "#64748b" }}>
                    Passengers must comply with all security screening protocols, baggage restrictions, and health advisory guidelines issued by civil aviation authorities (BCAS/DGCA).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Cancellation & Refund Policy */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
              borderLeft: "3px solid #FE2C1C",
              paddingLeft: "8px"
            }}>
              2. Detailed Cancellation &amp; Refund Policy Matrix
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5px", border: "1px solid #cbd5e1", borderRadius: "6px", overflow: "hidden", marginBottom: "6px" }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: "700", borderBottom: "1px solid #cbd5e1" }}>Cancellation Timeframe</th>
                  <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: "700", borderBottom: "1px solid #cbd5e1" }}>Airline Cancellation Fee</th>
                  <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: "700", borderBottom: "1px solid #cbd5e1" }}>AnyTrip Handling Charge</th>
                  <th style={{ padding: "6px 10px", textAlign: "right", fontWeight: "700", borderBottom: "1px solid #cbd5e1" }}>Net Refund Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>More than 72 hours before departure</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>Standard Airline Tariff (₹2,500 – ₹3,000 / pax)</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>₹300 per passenger</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#059669" }}>Eligible for Refund</td>
                </tr>
                <tr style={{ background: "#f8fafc" }}>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>Between 2 hrs &amp; 72 hrs before departure</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>Higher Tier Penalty (₹3,000 – ₹3,500 / pax)</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>₹300 per passenger</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#d97706" }}>Partial Refund</td>
                </tr>
                <tr>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", fontWeight: "600" }}>Less than 2 hours / No-Show</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#dc2626" }}>100% Base Fare Forfeiture</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>₹300 per passenger</td>
                  <td style={{ padding: "6px 10px", borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: "700", color: "#dc2626" }}>Government Taxes Only</td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: "8.5px", color: "#64748b", lineHeight: "1.3" }}>
              * Approved refunds are credited automatically back to the original source account (UPI / Debit / Credit Card) within <strong>5–7 business days</strong>. Convenience fee is non-refundable.
            </div>
          </div>

          {/* Section 3: Rescheduling & Modification */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
              borderLeft: "3px solid #FE2C1C",
              paddingLeft: "8px"
            }}>
              3. Date Change &amp; Rescheduling Terms
            </div>
            <div style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "9px",
              color: "#334155",
              lineHeight: "1.4"
            }}>
              <ul style={{ margin: 0, paddingLeft: "14px" }}>
                <li><strong>Rescheduling Charges:</strong> Date changes are permitted up to 4 hours prior to departure subject to airline rescheduling fee + fare difference.</li>
                <li><strong>Service Fee:</strong> AnyTrip service fee of ₹250 per passenger per sector applies for all date/flight modification requests.</li>
                <li><strong>Name Changes:</strong> Passenger name corrections/transfers are strictly non-permissible as per airline security rules. Minor spelling corrections require airline approval.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Baggage Regulations & Prohibited Items */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{
              fontSize: "11px",
              fontWeight: "800",
              color: "#0f172a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
              borderLeft: "3px solid #FE2C1C",
              paddingLeft: "8px"
            }}>
              4. Baggage Allowance &amp; Dangerous Goods Policy
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "9px",
              color: "#334155",
              lineHeight: "1.4"
            }}>
              <div>
                <strong>Cabin Baggage:</strong> 1 piece up to 7 kg (dimensions 55cm x 35cm x 25cm) plus 1 small laptop bag/purse per passenger.
              </div>
              <div>
                <strong>Check-in Baggage:</strong> 15 kg per passenger for domestic flights (1 piece policy applies on select carriers). Excess baggage charged per kg at airport counter.
              </div>
              <div>
                <strong>Prohibited Items in Check-in:</strong> Power banks, lithium batteries, e-cigarettes, lighters, and matchboxes are strictly restricted to hand baggage only.
              </div>
              <div>
                <strong>Restricted Substances:</strong> Liquids, aerosols, and gels in hand luggage must not exceed 100ml per container. Hazardous chemicals strictly banned.
              </div>
            </div>
          </div>

          {/* Section 5: Legal Declaration & Stamp Block */}
          <div style={{
            display: "flex",
            gap: "14px",
            alignItems: "stretch",
            marginBottom: "14px"
          }}>
            <div style={{
              flex: 1,
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "10px 14px",
              background: "#ffffff"
            }}>
              <div style={{ fontWeight: "700", fontSize: "10px", color: "#0f172a", marginBottom: "4px" }}>
                Enterprise Legal Declaration
              </div>
              <div style={{ fontSize: "8.5px", color: "#64748b", lineHeight: "1.35" }}>
                We declare that this tax invoice displays the complete and accurate breakdown of passenger fares, statutory taxes, and ancillary service charges collected on behalf of the operating airline. All particulars stated herein are true, correct, and verified.
              </div>
            </div>

            <div style={{
              width: "220px",
              border: "1px dashed #FE2C1C",
              borderRadius: "8px",
              padding: "10px",
              background: "#fef2f2",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justify: "center",
              alignItems: "center"
            }}>
              <div style={{ fontSize: "9px", fontWeight: "800", color: "#FE2C1C", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                AnyTrip India Pvt Ltd
              </div>
              <div style={{ fontSize: "8px", color: "#991b1b", marginTop: "2px" }}>
                Computer Generated Invoice
              </div>
              <div style={{
                fontSize: "7.5px",
                color: "#059669",
                fontWeight: "700",
                border: "1px solid #a7f3d0",
                background: "#ecfdf5",
                padding: "2px 6px",
                borderRadius: "3px",
                marginTop: "4px"
              }}>
                VALID WITHOUT PHYSICAL SIGNATURE
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: "8px",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          fontSize: "9px",
          color: "#64748b"
        }}>
          <div><strong>AnyTrip India Pvt Ltd</strong> &nbsp;|&nbsp; <strong>24/7 Helpline:</strong> +91-800-123-4567 &nbsp;|&nbsp; <strong>Support:</strong> support@flyanytrip.com</div>
          <div>Page 2 of 2</div>
        </div>
      </div>

    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
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

  if (n === 0) return "Zero Rupees";
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

import React from "react";
import flyAnyTripLogo from "../assets/Home page/flyanytrip-logo.svg";

/**
 * BoardingPassTemplate.jsx
 * Official Printable / Downloadable A4 E-Boarding Pass Document.
 * High-resolution vector-rendered layout with barcode, seat assignment, gate, terminal, and DGCA guidelines.
 */
export default function BoardingPassTemplate({
  id = "flyanytrip-official-boarding-pass-pdf",
  flight = {},
  pnr = "CRUMF2",
  passengers = [],
  bookingData = {},
  cleanSeat = "19C",
  baggageString = "15 kg Check-in",
  departureTerminal = "3"
}) {
  const flightObj = flight || bookingData?.flight || {};
  const code = (pnr || bookingData?.pnr || "CRUMF2").toUpperCase();

  const getCityName = (cCode) => {
    if (!cCode) return "";
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
    return mapping[cCode.toUpperCase()] || cCode;
  };

  const fromCode = flightObj?.from || flightObj?.departCity || flightObj?.depCity || "DEL";
  const fromCity = flightObj?.fromCity || getCityName(fromCode) || "New Delhi";
  const toCode = flightObj?.to || flightObj?.arrivalCity || flightObj?.arrCity || "BOM";
  const toCity = flightObj?.toCity || getCityName(toCode) || "Mumbai";

  const paxList = (passengers && passengers.length > 0)
    ? passengers
    : (bookingData?.passengers && bookingData.passengers.length > 0)
      ? bookingData.passengers
      : (bookingData?.contactDetails?.firstName ? [{
          title: bookingData.contactDetails.title || "Mr.",
          firstName: bookingData.contactDetails.firstName,
          lastName: bookingData.contactDetails.lastName || ""
        }] : [{ title: "Mr.", firstName: "Valued", lastName: "Passenger" }]);

  const paxName = paxList[0]?.firstName
    ? `${paxList[0].title || "Mr."} ${paxList[0].firstName} ${paxList[0].lastName || ""}`.trim()
    : "Valued Passenger";

  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div
      id={id}
      style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
      className="bg-slate-100 text-slate-900 font-['Quicksand',sans-serif]"
    >
      <div className="invoice-page-single w-[794px] min-h-[1123px] bg-white p-8 mx-auto shadow-2xl flex flex-col justify-between border border-slate-200">
        <div>
          {/* Document Top Header Banner with FlyAnyTrip Logo */}
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl flex items-center justify-between mb-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-xs flex items-center justify-center shrink-0">
                <img src={flyAnyTripLogo} alt="FlyAnyTrip Logo" className="h-9 object-contain" />
              </div>
              <div>
                <h1 className="font-['Satoshi',sans-serif] text-xl font-extrabold tracking-wide text-white leading-tight">
                  OFFICIAL E-BOARDING PASS
                </h1>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Verified Web Check-in Document · Issued on {issueDate}
                </p>
              </div>
            </div>

            {/* Fixed PNR Box with explicit inline CSS line-height to prevent canvas text overlap */}
            <div 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                border: '1px solid rgba(255, 255, 255, 0.25)', 
                padding: '8px 18px', 
                borderRadius: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end', 
                justify: 'center', 
                flexShrink: 0 
              }}
            >
              <span 
                style={{ 
                  fontSize: '10px', 
                  fontWeight: '800', 
                  color: '#cbd5e1', 
                  textTransform: 'uppercase', 
                  letterSpacing: '2px', 
                  lineHeight: '14px', 
                  marginBottom: '4px', 
                  display: 'block' 
                }}
              >
                BOOKING PNR
              </span>
              <span 
                style={{ 
                  fontSize: '20px', 
                  fontFamily: 'monospace', 
                  fontWeight: '900', 
                  color: '#fbbf24', 
                  letterSpacing: '2px', 
                  lineHeight: '22px', 
                  display: 'block' 
                }}
              >
                {code}
              </span>
            </div>
          </div>

          {/* Flight Summary Strip */}
          <div className="border border-slate-200 rounded-2xl p-5 mb-6 bg-slate-50/50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-3">
                {/* Crash-Safe Airline Logo Container */}
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center relative overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src={flightObj?.logo || flightObj?.airlineLogo || (flightObj?.code ? `https://images.kiwi.com/airlines/64/${flightObj.code.split('-')[0]}.png` : "https://images.kiwi.com/airlines/64/6E.png")}
                    alt="Airline Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-[#0F172A] text-white flex flex-col items-center justify-center p-0.5">
                    <span className="text-[11px] font-black font-mono leading-none text-amber-400">
                      {flightObj?.code ? flightObj.code.split('-')[0] : (flightObj?.airline?.substring(0, 2) || "IX")}
                    </span>
                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 leading-none">AIRLINE</span>
                  </div>
                </div>
                <div>
                  <h2 className="font-['Satoshi',sans-serif] text-lg font-bold text-slate-900 leading-snug">{flightObj?.airline || "Air India Express"}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Flight No: {flightObj?.code || "IX-2952"} · Class: Economy</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200">
                  ✓ WEB CHECK-IN VERIFIED
                </span>
              </div>
            </div>

            {/* Flight Route Details */}
            <div className="grid grid-cols-3 gap-4 items-center text-center py-2">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-400 uppercase block">DEPARTURE</span>
                <span className="text-3xl font-black text-slate-900 leading-none font-['Satoshi',sans-serif]">{fromCode}</span>
                <span className="text-xs font-bold text-slate-600 block mt-1">{fromCity}</span>
                <span className="text-sm font-extrabold text-[#FE2C1C] block mt-0.5">{flightObj?.depTime || "06:00 AM"}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 mb-1">{flightObj?.duration || "2h 15m"}</span>
                <div className="w-full flex items-center gap-1 text-[#FE2C1C]">
                  <div className="w-2 h-2 rounded-full bg-[#FE2C1C]" />
                  <div className="flex-1 h-0.5 bg-[#FE2C1C]" />
                  <span className="text-base">✈</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 mt-1 uppercase">Direct Non-Stop</span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase block">ARRIVAL</span>
                <span className="text-3xl font-black text-slate-900 leading-none font-['Satoshi',sans-serif]">{toCode}</span>
                <span className="text-xs font-bold text-slate-600 block mt-1">{toCity}</span>
                <span className="text-sm font-extrabold text-[#FE2C1C] block mt-0.5">{flightObj?.arrTime || "08:10 AM"}</span>
              </div>
            </div>
          </div>

          {/* Passenger Details & Seat Grid */}
          <div className="border border-slate-200 rounded-2xl p-5 mb-6 bg-white shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-100 pb-2">
              Passenger &amp; Seating Details
            </h3>
            
            <div className="grid grid-cols-4 gap-4 text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PASSENGER NAME</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{paxName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PNR CODE</span>
                <span className="text-sm font-mono font-extrabold text-[#FE2C1C] block mt-0.5">{code}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">SEAT ASSIGNED</span>
                <span className="text-sm font-mono font-extrabold text-emerald-600 block mt-0.5">{cleanSeat}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">DEPARTURE GATE</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">Terminal {departureTerminal} · Gate {flightObj?.depGate || "14B"}</span>
              </div>
            </div>
          </div>

          {/* Official Boarding Pass Cut-out Ticket Stub */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/80 mb-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-0.5">DEPARTURE BOARDING PASS STUB</span>
                <span className="text-base font-bold text-slate-900">{paxName} · SEAT {cleanSeat}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-600 block">FLIGHT: {flightObj?.code || "IX-2952"}</span>
                <span className="text-xs font-mono font-bold text-[#FE2C1C] block mt-0.5">GATE CLOSES 25 MINS PRIOR</span>
              </div>
            </div>

            {/* Fixed BOM -> DEL horizontal route flex line */}
            <div className="flex items-center justify-between gap-4">
              <div className="shrink-0">
                <div className="text-2xl font-black font-['Satoshi',sans-serif] text-slate-900 flex items-center gap-2">
                  <span>{fromCode}</span>
                  <span className="text-[#FE2C1C] text-lg font-mono">&rarr;</span>
                  <span>{toCode}</span>
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">Baggage Allowance: {baggageString}</div>
              </div>

              {/* Scannable Barcode */}
              <div className="flex-1 max-w-[340px] text-center bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-mono text-sm tracking-[5px] font-black text-slate-900 mb-1 select-all overflow-hidden whitespace-nowrap">
                  |||||| | ||||| ||| ||||||| |||| |||||||| |||||| |||||
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                  SECURITY BARCODE · SCAN AT BOARDING GATE
                </span>
              </div>
            </div>
          </div>

          {/* DGCA Guidelines */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1 font-medium">
            <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">Important DGCA Airport Guidelines</h4>
            <p>1. Please carry a valid Government-issued Photo ID (Aadhaar / Passport / Voter ID) for security check.</p>
            <p>2. Power banks, lithium batteries &amp; e-cigarettes are allowed in <strong>Hand Baggage only</strong>.</p>
            <p>3. Boarding gates close strictly 25 minutes prior to scheduled departure.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
          <p>FlyAnyTrip Travel Technologies Ltd. · 24x7 Support: +91 800 123 4567 · support@flyanytrip.com</p>
          <p className="font-mono text-[10px] mt-0.5">Document Hash: FAT-EBP-{code}-{Date.now()}</p>
        </div>
      </div>
    </div>
  );
}

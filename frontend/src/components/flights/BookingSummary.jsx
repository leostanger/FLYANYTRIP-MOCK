/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingSummary.jsx
 * DESCRIPTION: Right-column booking summary panel with official airline logos.
 * ============================================================================
 */

import React from "react";
import { Plane } from "lucide-react";

export const getAirlineLogoUrl = (flight) => {
  if (flight?.logo && !flight.logo.includes("unsplash.com")) {
    return flight.logo;
  }
  const airlineStr = String(flight?.airline || flight?.airlineName || flight?.name || "").toLowerCase();
  const codeStr = String(flight?.code || flight?.flightNo || flight?.airlineCode || "").toUpperCase();

  // Extract 2-character IATA code prefix (e.g. 6E-204 -> 6E, AI-101 -> AI, EK-505 -> EK)
  const iataMatch = codeStr.match(/^([A-Z0-9]{2})/);
  const codePrefix = iataMatch ? iataMatch[1] : "";

  if (airlineStr.includes("indigo") || codePrefix === "6E") return "https://images.kiwi.com/airlines/64/6E.png";
  if (airlineStr.includes("air india express") || codePrefix === "IX") return "https://images.kiwi.com/airlines/64/IX.png";
  if (airlineStr.includes("air india") || codePrefix === "AI") return "https://images.kiwi.com/airlines/64/AI.png";
  if (airlineStr.includes("spicejet") || codePrefix === "SG") return "https://images.kiwi.com/airlines/64/SG.png";
  if (airlineStr.includes("vistara") || codePrefix === "UK") return "https://images.kiwi.com/airlines/64/UK.png";
  if (airlineStr.includes("akasa") || codePrefix === "QP") return "https://images.kiwi.com/airlines/64/QP.png";
  if (airlineStr.includes("airasia") || codePrefix === "I5") return "https://images.kiwi.com/airlines/64/I5.png";
  if (airlineStr.includes("go first") || airlineStr.includes("goair") || codePrefix === "G8") return "https://images.kiwi.com/airlines/64/G8.png";

  // Major International Airlines
  if (airlineStr.includes("emirates") || codePrefix === "EK") return "https://images.kiwi.com/airlines/64/EK.png";
  if (airlineStr.includes("qatar") || codePrefix === "QR") return "https://images.kiwi.com/airlines/64/QR.png";
  if (airlineStr.includes("etihad") || codePrefix === "EY") return "https://images.kiwi.com/airlines/64/EY.png";
  if (airlineStr.includes("singapore") || codePrefix === "SQ") return "https://images.kiwi.com/airlines/64/SQ.png";
  if (airlineStr.includes("thai") || codePrefix === "TG") return "https://images.kiwi.com/airlines/64/TG.png";
  if (airlineStr.includes("lufthansa") || codePrefix === "LH") return "https://images.kiwi.com/airlines/64/LH.png";
  if (airlineStr.includes("british") || codePrefix === "BA") return "https://images.kiwi.com/airlines/64/BA.png";
  if (airlineStr.includes("air france") || codePrefix === "AF") return "https://images.kiwi.com/airlines/64/AF.png";
  if (airlineStr.includes("klm") || codePrefix === "KL") return "https://images.kiwi.com/airlines/64/KL.png";
  if (airlineStr.includes("flydubai") || codePrefix === "FZ") return "https://images.kiwi.com/airlines/64/FZ.png";
  if (airlineStr.includes("gulf air") || codePrefix === "GF") return "https://images.kiwi.com/airlines/64/GF.png";
  if (airlineStr.includes("oman air") || codePrefix === "WY") return "https://images.kiwi.com/airlines/64/WY.png";
  if (airlineStr.includes("saudia") || codePrefix === "SV") return "https://images.kiwi.com/airlines/64/SV.png";
  if (airlineStr.includes("malaysia") || codePrefix === "MH") return "https://images.kiwi.com/airlines/64/MH.png";
  if (airlineStr.includes("vietjet") || codePrefix === "VJ") return "https://images.kiwi.com/airlines/64/VJ.png";

  if (codePrefix && codePrefix.length === 2) {
    return `https://images.kiwi.com/airlines/64/${codePrefix}.png`;
  }

  return "https://images.kiwi.com/airlines/64/6E.png";
};

export default function BookingSummary({ flight }) {
  const flightObj = flight || {};
  const depTime = flightObj.departTime || flightObj.depTime || "06:00";
  const arrTime = flightObj.arrivalTime || flightObj.arrTime || "08:10";
  const duration = flightObj.duration || "2h 10m";
  const stops    = flightObj.stops    || "Non-stop";
  const airlineLogo = getAirlineLogoUrl(flightObj);

  return (
    <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] font-['Quicksand'] select-none text-left">
      
      {/* Title */}
      <h3 className="font-['Satoshi'] font-bold text-[18px] text-[#1A1A1A]">Booking Summary</h3>
      <p className="font-['Quicksand'] text-[12px] text-[#999999] font-medium mt-0.5 mb-4">
        Review your trip details
      </p>

      {/* Airline Row */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0F0]">
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#EAEAEA] flex items-center justify-center bg-white flex-shrink-0 p-1">
          <img
            src={airlineLogo}
            alt={flightObj.airline || "IndiGo"}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.kiwi.com/airlines/64/6E.png";
            }}
          />
        </div>
        <div>
          <p className="font-['Satoshi'] font-bold text-[14.5px] text-[#1A1A1A] leading-tight">
            {flightObj.airline || "IndiGo"} &ndash; {flightObj.code || "6E-204"}
          </p>
          <p className="font-['Quicksand'] text-[12px] text-[#888888] font-medium mt-0.5">
            {flightObj.departCity || "DEL"} &rarr; {flightObj.arrivalCity || "BOM"}
          </p>
          <p className="font-['Quicksand'] text-[12px] text-[#888888] font-medium mt-0.5">
            15 Dec 2026 &bull; Economy
          </p>
        </div>
      </div>

      {/* Time / Duration Row */}
      <div className="flex items-center justify-between gap-3 pt-4">
        {/* Departure */}
        <div>
          <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none block">
            {depTime}
          </span>
        </div>

        {/* Timeline */}
        <div className="flex-grow text-center flex flex-col items-center gap-0.5 mx-2">
          <span className="font-['Quicksand'] text-[11px] font-semibold text-[#999999]">{duration}</span>
          <div className="relative w-full flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC] flex-shrink-0" />
            <div className="h-[1px] flex-grow bg-[#E0E0E0]" />
            <div className="w-2 h-2 rounded-full bg-[#BBBBBB] flex-shrink-0" />
          </div>
          <span className="font-['Quicksand'] text-[11px] font-medium text-[#999999]">{stops}</span>
        </div>

        {/* Arrival */}
        <div className="text-right">
          <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none block">
            {arrTime}
          </span>
        </div>
      </div>

    </div>
  );
}

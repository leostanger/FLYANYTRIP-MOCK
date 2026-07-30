/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/FlightSummaryCard.jsx
 * DESCRIPTION: Replicates Figma Flight Summary Card.svg design with exact typography.
 * ============================================================================
 */

import React from "react";
import { Plane, Clock, ShieldCheck, Tag } from "lucide-react";

export default function FlightSummaryCard({ flight, fare, onContinue, onChangeFlight }) {
  const airlineName = flight?.airline || "IndiGo";
  const flightCode = flight?.code || "6E-204";
  const logoUrl = flight?.logo || "https://images.kiwi.com/airlines/64/6E.png";
  const depTime = flight?.departTime || flight?.depTime || "06:00";
  const arrTime = flight?.arrivalTime || flight?.arrTime || "08:15";
  const duration = flight?.duration || "02h 15m";
  const price = flight?.price || fare?.price || "₹3,499";

  return (
    <div className="w-full bg-white border border-[#EAEAEA] border-[1.16px] rounded-[13.88px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none font-['Quicksand'] text-left">
      
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-[#EAEAEA] bg-white flex items-center justify-center p-1">
            <img src={logoUrl} alt={airlineName} className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-['Satoshi'] font-bold text-[16px] text-[#1A1A1A] leading-tight">
              {airlineName}
            </h4>
            <span className="font-['Quicksand'] text-[12px] text-[#999999] font-medium block">
              {flightCode} • Economy
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-['Quicksand'] text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FFF1F2] text-[#F12B19]">
            Selected Flight
          </span>
        </div>
      </div>

      {/* Flight Details Center */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-4 py-2">
        {/* Departure */}
        <div>
          <span className="font-['Satoshi'] font-bold text-[20px] text-[#1A1A1A] block leading-none">
            {depTime}
          </span>
          <span className="font-['Quicksand'] text-[13px] text-[#666666] font-semibold block mt-1">
            DEL - New Delhi
          </span>
        </div>

        {/* Duration Visual */}
        <div className="flex flex-col items-center px-4">
          <span className="font-['Quicksand'] text-[11px] text-[#666666] font-medium block mb-1">
            {duration}
          </span>
          <div className="relative w-24 flex items-center justify-between">
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
            <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
            <Plane size={14} className="text-[#999999] rotate-45" />
            <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
          </div>
          <span className="font-['Quicksand'] text-[11px] text-[#999999] block mt-1">
            Non-stop
          </span>
        </div>

        {/* Arrival */}
        <div>
          <span className="font-['Satoshi'] font-bold text-[20px] text-[#1A1A1A] block leading-none">
            {arrTime}
          </span>
          <span className="font-['Quicksand'] text-[13px] text-[#666666] font-semibold block mt-1">
            BOM - Mumbai
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
          <div className="text-left md:text-right">
            <span className="font-['Quicksand'] font-medium text-[22px] text-[#1A1A1A] leading-none block tracking-[0.5px]">
              {price.toString().startsWith("₹") ? price : `₹${price}`}
            </span>
            <span className="font-['Quicksand'] text-[11px] text-[#999999] font-normal block mt-1">
              per traveler
            </span>
          </div>

          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[13.5px] px-6 py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Book Now
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

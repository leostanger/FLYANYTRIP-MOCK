/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/Card.jsx
 * DESCRIPTION: Flight Result Card component matching exact Figma Flight 1.svg design.
 * ============================================================================
 */

import React, { useState } from "react";
import { Plane, ChevronDown, ChevronUp, Luggage, ShieldCheck } from "lucide-react";
import FlightDetailsContainer from "./FlightDetailsContainer";

export default function Card({ flight, onSelect }) {
  const [showDetails, setShowDetails] = useState(false);

  const priceVal = flight?.price ? String(flight.price) : "3,499";
  const priceText = priceVal.startsWith("₹") ? priceVal : `₹${priceVal}`;

  const isCheapest = Boolean(flight?.badge?.toLowerCase()?.includes("cheapest"));

  return (
    <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] select-none font-['Quicksand'] transition-all hover:shadow-md text-left overflow-hidden">
      
      {/* Primary Row Details */}
      <div className="p-5 md:px-[23.13px] md:py-[20px] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-4">
        
        {/* 1. Airline Logo & Name */}
        <div className="flex items-center gap-3.5 min-w-[180px]">
          <div className="w-[42px] h-[42px] rounded-lg overflow-hidden border border-[#EAEAEA] flex-shrink-0 bg-white flex items-center justify-center p-1">
            <img 
              src={flight.logo} 
              alt={flight.airline} 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <h4 className="font-['Satoshi'] font-bold text-[16px] text-[#333333] leading-tight">
              {flight.airline}
            </h4>
            <span className="font-['Quicksand'] text-[12px] text-[#999999] font-medium block mt-0.5">
              {flight.code}
            </span>
          </div>
        </div>

        {/* 2. Departure Time & City */}
        <div className="text-center min-w-[70px]">
          <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none block">
            {flight.departTime || flight.depTime}
          </span>
          <span className="font-['Quicksand'] text-[13px] text-[#666666] font-medium block mt-1.5">
            {flight.departCity || flight.depCity || "DEL"}
          </span>
        </div>

        {/* 3. Duration & Route Visual */}
        <div className="flex-grow max-w-xs w-full text-center px-2 flex flex-col items-center">
          <span className="font-['Quicksand'] text-[12px] text-[#666666] font-medium block mb-1">
            {flight.duration}
          </span>

          <div className="relative w-full flex items-center justify-between my-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC] flex-shrink-0" />
            <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC] flex-shrink-0" />
            
            {/* Plane Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white px-2">
                <Plane className="w-3.5 h-3.5 text-[#999999] rotate-90" />
              </div>
            </div>
          </div>

          <span className="font-['Quicksand'] text-[12px] text-[#999999] font-normal block mt-1">
            {flight.stops}
          </span>
        </div>

        {/* 4. Arrival Time & City */}
        <div className="text-center min-w-[70px]">
          <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none block">
            {flight.arrivalTime || flight.arrTime}
          </span>
          <span className="font-['Quicksand'] text-[13px] text-[#666666] font-medium block mt-1.5">
            {flight.arrivalCity || flight.arrCity || "BOM"}
          </span>
        </div>

        {/* 5. Price & Select CTA */}
        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div className="text-left md:text-right">
            <span className="font-['Satoshi'] text-[24px] font-bold text-[#1A1A1A] leading-none block tracking-[0.8px]">
              {priceText}
            </span>
            <span className="font-['Quicksand'] text-[11px] text-[#999999] font-normal block mt-1">
              per adult
            </span>
          </div>

          <button
            type="button"
            onClick={onSelect}
            className="bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[14px] px-7 py-2.5 rounded-lg shadow-sm transition-all duration-150 cursor-pointer active:scale-95 flex-shrink-0"
          >
            Select
          </button>
        </div>

      </div>

      {/* Secondary Strip - Dashed Divider */}
      <div className="bg-[#FBFBFB] border-t border-dashed border-[#EAEAEA] px-5 md:px-[23.13px] py-2.5 flex flex-wrap items-center justify-between gap-3 text-[12px]">
        
        {/* Left Amenities Tags */}
        <div className="flex flex-wrap items-center gap-4 text-[#666666]">
          {flight.baggage && (
            <div className="flex items-center gap-1.5">
              <Luggage size={14} className="text-[#999999]" />
              <span>{flight.baggage}</span>
            </div>
          )}

          {flight.refundable && (
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#34A853]" />
              <span className="text-[#34A853] font-medium">{flight.refundable}</span>
            </div>
          )}

          {flight.seatsLeft && (
            <div className="flex items-center gap-1 text-[#F12B19] font-semibold">
              <span>{flight.seatsLeft} seats left at this price</span>
            </div>
          )}
        </div>

        {/* Right Badge & Details Expand */}
        <div className="flex items-center gap-3.5 ml-auto">
          {flight.badge && (
            <span
              className={`text-[11px] font-bold px-3 py-0.5 rounded-full ${
                isCheapest
                  ? "bg-[#FFF1F2] text-[#F12B19] border border-[#FDE8E8]"
                  : "bg-[#F5F5F5] text-[#333333]"
              }`}
            >
              {flight.badge}
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="font-['Quicksand'] font-bold text-[12.5px] text-[#F12B19] hover:text-red-700 bg-transparent border-none cursor-pointer flex items-center gap-1 transition-colors"
          >
            <span>Flight Details</span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

      </div>

      {/* Expandable Flight Details Drawer (Matching Container.svg) */}
      {showDetails && (
        <div className="p-4 bg-gray-50/50 border-t border-[#EAEAEA]">
          <FlightDetailsContainer 
            flight={flight} 
            onClose={() => setShowDetails(false)}
            onSelect={onSelect}
          />
        </div>
      )}

    </div>
  );
}

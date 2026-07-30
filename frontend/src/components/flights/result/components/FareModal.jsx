/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/FareModal.jsx
 * DESCRIPTION: Compact fare selection modal overlay matching exact Figma design without scrolling.
 * ============================================================================
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, Calendar, User, Plane, Clock, ShieldCheck, Tag, 
  Briefcase, Luggage, ChevronRight, Check 
} from "lucide-react";

export default function FareModal({ flight, onClose, onContinue }) {
  const navigate = useNavigate();

  const handleHotelClick = () => {
    if (onClose) onClose();
    const dest = flight?.arrivalCity || flight?.to || "Goa";
    navigate(`/hotels?dest=${encodeURIComponent(dest)}`);
  };
  // Parse base price number
  const rawPriceStr = flight?.price ? String(flight.price) : "3499";
  const basePriceNum = parseInt(rawPriceStr.replace(/[^\d]/g, ""), 10) || 3499;

  // Selected fare class state: 'saver', 'value', 'flexi'
  const [selectedFare, setSelectedFare] = useState("saver");

  // Dynamic calculations matching user's exact screenshot
  const fareDetails = {
    saver: {
      id: "saver",
      title: "Anytrip Special",
      badge: "CHEAPEST",
      badgeType: "red",
      price: basePriceNum,
      cabin: flight?.cabin || "1 × 7 kg",
      checkIn: flight?.baggage || "1 × 15 kg",
      cancel: flight?.refundable === "Non-Refundable" ? "Non-Refundable" : "₹3,500 fee",
      change: "₹3,000 fee",
      perks: []
    },
    value: {
      id: "value",
      title: "Economy Value",
      badge: "POPULAR",
      badgeType: "gray",
      price: basePriceNum + 800,
      cabin: "1 × 7 kg",
      checkIn: "1 × 15 kg",
      cancel: "₹2,000 fee",
      change: "₹1,500 fee",
      perks: ["Seat selection included"]
    },
    flexi: {
      id: "flexi",
      title: "Economy Flexi",
      badge: "BEST VALUE",
      badgeType: "gray",
      price: basePriceNum + 2200,
      cabin: "1 × 7 kg",
      checkIn: "2 × 15 kg",
      cancel: "Free cancellation",
      change: "Free date change",
      perks: ["Seat selection included", "Priority boarding", "Free meal"]
    }
  };

  const currentFare = fareDetails[selectedFare];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs font-['Quicksand'] p-3 md:p-4 select-none">
      {/* Modal Container card */}
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative text-left border border-gray-100 flex flex-col my-auto">
        
        {/* ========================================================================= */}
        {/* 1. HEADER SECTION                                                         */}
        {/* ========================================================================= */}
        <div className="p-4 md:px-6 md:py-4 border-b border-gray-100 relative bg-white">
          
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors absolute right-4 top-4 z-10 cursor-pointer shadow-2xs"
          >
            <X size={16} strokeWidth={2} />
          </button>

          {/* Primary Route Detail */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr] items-center gap-3 pr-8">
            {/* Airline Info */}
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-lg overflow-hidden border border-gray-200 p-0.5 flex-shrink-0 bg-white flex items-center justify-center">
                <img 
                  src={flight.logo || "https://images.kiwi.com/airlines/64/6E.png"} 
                  alt={flight.airline} 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h3 className="font-['Satoshi'] font-bold text-[16px] text-[#1A1A1A] leading-tight">
                  {flight.airline || "IndiGo"} &bull; {flight.code || "6E-204"}
                </h3>
                <p className="font-['Quicksand'] text-[11.5px] text-gray-400 font-medium mt-0.5">
                  Airbus A320 &bull; Economy
                </p>
                <div className="flex items-center gap-1 text-amber-500 text-[10.5px] font-bold mt-0.5">
                  <span>★</span>
                  <span className="text-gray-600 font-semibold">4.2 &middot; 1,248 ratings</span>
                </div>
              </div>
            </div>

            {/* Departure */}
            <div className="text-left md:text-center">
              <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none block">
                {flight.departTime || flight.depTime || "06:00"}
              </span>
              <span className="font-['Quicksand'] text-[11px] font-bold text-gray-500 uppercase block mt-1">
                {flight.departCity || "DEL"} &middot; TERMINAL 2
              </span>
            </div>

            {/* Timeline Progress */}
            <div className="text-center px-2 hidden md:block">
              <span className="font-['Quicksand'] text-[11.5px] font-semibold text-gray-400 block mb-0.5">
                {flight.duration || "2h 10m"}
              </span>
              <div className="relative w-full flex items-center justify-between my-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <div className="h-[1px] flex-grow bg-gray-200 mx-1" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane className="w-3.5 h-3.5 text-gray-400 rotate-45 bg-white px-1" />
                </div>
              </div>
              <span className="font-['Quicksand'] text-[10.5px] text-gray-400 font-medium block">
                {flight.stops || "Non-stop"}
              </span>
            </div>

            {/* Arrival */}
            <div className="text-left md:text-center">
              <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none block">
                {flight.arrivalTime || flight.arrTime || "08:10"}
              </span>
              <span className="font-['Quicksand'] text-[11px] font-bold text-gray-500 uppercase block mt-1">
                {flight.arrivalCity || "BOM"} &middot; TERMINAL 1
              </span>
            </div>
          </div>

          {/* Sub-strip row with icons */}
          <div className="flex flex-wrap items-center gap-5 mt-3 pt-2.5 border-t border-gray-100 text-[11.5px] font-semibold text-gray-600">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <span>15 Dec 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-gray-400" />
              <span>{currentFare.title}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Plane size={13} className="text-gray-400 rotate-45" />
              <span>{flight.code || "6E-204"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-gray-400" />
              <span>On-time 92%</span>
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. FARE SELECTION GRID (Compact, No Scrolling Needed)                    */}
        {/* ========================================================================= */}
        <div className="p-4 md:px-6 md:py-4 bg-[#FBFBFB]">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
            SELECT A FARE CLASS
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {Object.keys(fareDetails).map((key) => {
              const item = fareDetails[key];
              const isSelected = selectedFare === key;
              const isRedBadge = item.badgeType === "red";

              return (
                <div
                  key={key}
                  onClick={() => setSelectedFare(key)}
                  className={`bg-white rounded-xl p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between relative text-left border ${
                    isSelected 
                      ? "border-[#F12B19] border-[2px] shadow-sm" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  
                  {/* Top Radio & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      {/* Check dot / Radio */}
                      {isSelected ? (
                        <div className="w-4.5 h-4.5 rounded-full bg-[#F12B19] flex items-center justify-center text-white text-[9px] font-bold shadow-2xs">
                          <Check size={11} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border border-gray-300 flex-shrink-0 bg-white" />
                      )}

                      {/* Badge */}
                      <span className={`text-[9.5px] font-bold uppercase px-2 py-0.5 rounded ${
                        isRedBadge ? "bg-[#F12B19] text-white" : "bg-gray-100 text-gray-600 font-semibold"
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="font-['Satoshi'] font-bold text-[16px] text-[#1A1A1A] mb-2.5">
                      {item.title}
                    </h4>

                    {/* Features checklist */}
                    <div className="space-y-2 text-[12px] text-gray-700">
                      {/* Baggage */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[11.5px]">
                          <Luggage size={14} />
                          <span className="text-gray-500">Baggage</span>
                        </div>
                        <p className="text-gray-700 font-medium pl-5">Cabin: {item.cabin}</p>
                        <p className="text-gray-700 font-medium pl-5">{item.checkIn}</p>
                      </div>
                      
                      {/* Flexibility */}
                      <div className="space-y-0.5 pt-0.5">
                        <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[11.5px]">
                          <Briefcase size={14} />
                          <span className="text-gray-500">Flexibility</span>
                        </div>
                        <p className="text-gray-700 font-medium pl-5">Cancel: {item.cancel}</p>
                        <p className="text-gray-700 font-medium pl-5">Change: {item.change}</p>
                      </div>

                      {/* Extra Perks */}
                      {item.perks.map((perk, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5 text-[#34A853] font-semibold pt-0.5">
                          <Check size={14} className="text-[#34A853] flex-shrink-0" strokeWidth={2.5} />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card pricing bottom row */}
                  <div className="border-t border-gray-100 pt-3 mt-3 text-left">
                    <span className="text-[10px] text-gray-400 font-medium block mb-0.5">per adult</span>
                    <span className="font-['Satoshi'] font-bold text-[22px] text-[#1A1A1A] leading-none tracking-[0.8px]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. HOTEL PROMO STRIP                                                     */}
        {/* ========================================================================= */}
        <div 
          onClick={handleHotelClick}
          className="px-5 py-2.5 bg-[#FFF1F2] border-t border-b border-[#FDE8E8] flex items-center justify-between text-[11.5px] font-semibold text-[#F12B19] cursor-pointer hover:bg-[#FFE4E6] transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Tag size={14} className="text-[#F12B19] flex-shrink-0" />
            <span>Book a hotel &amp; save up to 22% on bundled bookings – exclusive for Flight passengers!</span>
          </div>
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); handleHotelClick(); }}
            className="font-bold hover:underline flex items-center gap-0.5 bg-transparent border-none text-[#F12B19] cursor-pointer"
          >
            <span>View</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODAL ACTION FOOTER                                                    */}
        {/* ========================================================================= */}
        <div className="p-4 md:px-6 bg-white flex items-center justify-between border-t border-gray-100">
          <div className="text-left">
            <span className="text-[11.5px] text-gray-500 font-semibold block mb-0.5">
              Selected {currentFare.title}
            </span>
            <span className="font-['Satoshi'] font-bold text-[24px] text-[#1A1A1A] leading-none tracking-[0.8px]">
              ₹{currentFare.price.toLocaleString("en-IN")}
            </span>
          </div>

          <button 
            type="button"
            onClick={() => onContinue(currentFare)}
            className="bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[13.5px] px-8 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <span>Continue</span>
            <span className="text-base leading-none">&rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
}

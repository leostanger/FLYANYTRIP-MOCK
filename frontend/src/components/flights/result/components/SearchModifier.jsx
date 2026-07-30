/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/SearchModifier.jsx
 * DESCRIPTION: Header flight search modification console matching Figma layout.
 * ============================================================================
 */

import React from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";

export default function SearchModifier({ 
  fareType, 
  setFareType, 
  onModify 
}) {
  const fares = [
    { id: "regular", label: "Regular" },
    { id: "student", label: "Student" },
    { id: "armed", label: "Armed Forces" },
    { id: "senior", label: "Senior Citizen" }
  ];

  return (
    <section className="bg-white border-b border-gray-200/60 py-3.5 shadow-2xs font-sans text-left select-none">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Modifier input row matching Figma spacing */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-1.5 w-full">
          
          {/* From Input */}
          <div className="border border-gray-200 rounded-md px-2.5 py-2 bg-white flex items-center justify-between flex-grow lg:flex-grow-0 lg:w-[180px] text-[12px]">
            <span className="text-gray-400 font-bold">From</span>
            <span className="text-gray-800 font-bold truncate">New Delhi,India</span>
          </div>

          {/* Location Swapper Button */}
          <button className="w-7 h-7 rounded-full border border-gray-200 bg-[#FFF1F2] hover:bg-red-50 flex items-center justify-center text-gray-500 hover:text-[#E53935] transition-colors active:scale-95 shadow-3xs flex-shrink-0 -mx-0.5 z-10">
            <ArrowLeftRight className="w-3 h-3" />
          </button>

          {/* To Input */}
          <div className="border border-gray-200 rounded-md px-2.5 py-2 bg-white flex items-center justify-between flex-grow lg:flex-grow-0 lg:w-[200px] text-[12px]">
            <span className="text-gray-400 font-bold">To</span>
            <span className="text-gray-800 font-bold truncate">Bengaluru, India</span>
          </div>

          {/* Departure Date */}
          <div className="border border-gray-200 rounded-md px-2.5 py-2 bg-white flex items-center justify-between flex-grow lg:flex-grow-0 lg:w-[210px] text-[12px]">
            <span className="text-gray-400 font-bold">departure</span>
            <span className="text-gray-800 font-bold truncate">Thu, 25 Jun 26</span>
          </div>

          {/* Travelers */}
          <div className="border border-gray-200 rounded-md px-2.5 py-2 bg-white flex items-center justify-between flex-grow lg:flex-grow-0 lg:w-[140px] text-[12px]">
            <span className="text-gray-400 font-bold">Traveller</span>
            <span className="text-gray-800 font-bold truncate">1 Adult</span>
          </div>

          {/* Cabin Class */}
          <div className="border border-gray-200 rounded-md px-2.5 py-2 bg-white flex items-center justify-between flex-grow lg:flex-grow-0 lg:w-[210px] text-[12px]">
            <span className="text-gray-400 font-bold">Cabin Class</span>
            <span className="text-gray-800 font-bold truncate">Econonomy</span>
          </div>

          {/* Modify Search CTA Button */}
          <button 
            onClick={onModify}
            className="bg-[#E53935] hover:bg-red-750 text-white font-extrabold text-[11px] px-4.5 rounded-md flex items-center space-x-1.5 transition-colors shadow-sm active:scale-95 group h-[34px] flex-shrink-0"
          >
            <RefreshCw className="w-3 h-3 transition-transform group-hover:rotate-180 duration-500" />
            <span>Modify Search</span>
          </button>
        </div>

        {/* Fare Types pill row exactly like the screenshot */}
        <div className="flex items-center space-x-3.5 mt-3.5 text-[11px] font-bold text-gray-500">
          <span className="text-gray-400 font-medium">Fare Type:</span>
          {fares.map((fare) => {
            const isActive = fareType === fare.id;
            return (
              <button
                key={fare.id}
                onClick={() => setFareType(fare.id)}
                className={`flex items-center space-x-1.5 border rounded px-3 py-1 bg-white hover:bg-gray-50 transition-all text-xs font-semibold ${
                  isActive ? "border-gray-300 text-gray-800 bg-gray-50/20" : "border-gray-200 text-gray-400"
                }`}
              >
                {isActive ? (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E53935] flex items-center justify-center text-white text-[8px] font-black select-none">✓</span>
                ) : (
                  <span className="w-3 h-3 rounded-full border border-gray-350 flex-shrink-0"></span>
                )}
                <span className="leading-none text-[11px] font-bold">{fare.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

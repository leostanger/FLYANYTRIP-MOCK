/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/FlightDetailsContainer.jsx
 * DESCRIPTION: Multi-tab Flight Details modal/container matching Figma Container.svg.
 * ============================================================================
 */

import React, { useState } from "react";
import { Plane, Briefcase, FileText, X, ChevronRight, Check } from "lucide-react";

export default function FlightDetailsContainer({ flight, onClose, onSelect }) {
  const [activeTab, setActiveTab] = useState("flightInfo");

  const tabs = [
    { id: "flightInfo", label: "Flight Info" },
    { id: "fareDetails", label: "Fare Details" },
    { id: "baggagePolicy", label: "Baggage Policy" },
    { id: "cancellation", label: "Cancellation & Refund" }
  ];

  const airlineName = flight?.airline || "IndiGo";
  const flightCode = flight?.code || "6E-204";
  const price = flight?.price || "₹3,499";
  const logoUrl = flight?.logo || "https://images.kiwi.com/airlines/64/6E.png";

  return (
    <div className="w-full bg-white border border-[#EAEAEA] border-[1.16px] rounded-[13.88px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] font-['Quicksand'] select-none text-left overflow-hidden">
      
      {/* Header Bar */}
      <div className="bg-[#FBFBFB] border-b border-[#EAEAEA] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt={airlineName} className="w-6 h-6 object-contain" />
          <h3 className="font-['Satoshi'] font-bold text-[16px] text-[#1A1A1A]">
            {airlineName} ({flightCode}) &bull; New Delhi to Mumbai
          </h3>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer border-none"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-[#EAEAEA] bg-white px-5 gap-6 text-[13px] font-semibold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 cursor-pointer transition-colors bg-transparent border-none ${
                isActive
                  ? "border-[#F12B19] text-[#F12B19] font-bold"
                  : "border-transparent text-[#666666] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-5 md:p-6 min-h-[220px]">
        {/* Tab 1: Flight Info */}
        {activeTab === "flightInfo" && (
          <div className="space-y-4">
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt={airlineName} className="w-10 h-10 object-contain" />
                <div>
                  <h4 className="font-['Satoshi'] font-bold text-[15px] text-[#1A1A1A]">{airlineName} {flightCode}</h4>
                  <p className="text-xs text-gray-500">Airbus A320 • Economy Class</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                On-time Guarantee
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-2 text-left">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">DEPARTURE</p>
                <p className="font-['Satoshi'] font-bold text-xl text-[#1A1A1A]">{flight?.departTime || "06:00"}</p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">Indira Gandhi Intl Airport (DEL)</p>
                <p className="text-[11px] text-gray-400">Terminal 3, Gate 12</p>
              </div>

              <div className="text-center">
                <span className="text-xs text-gray-500 font-semibold">{flight?.duration || "02h 15m"}</span>
                <div className="relative w-full flex items-center justify-between my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
                  <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
                  <Plane size={14} className="text-[#999999] rotate-45" />
                  <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
                </div>
                <span className="text-[11px] text-gray-400">{flight?.stops || "Non-stop"}</span>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400 font-bold uppercase">ARRIVAL</p>
                <p className="font-['Satoshi'] font-bold text-xl text-[#1A1A1A]">{flight?.arrivalTime || "08:15"}</p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">{flight?.arrivalCity || "BOM"} Airport</p>
                <p className="text-[11px] text-gray-400">Terminal 2</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fare Details */}
        {activeTab === "fareDetails" && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Base Fare (1 Adult)</span>
              <span className="font-bold text-gray-900">{price.toString().startsWith("₹") ? price : `₹${price}`}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Convenience Fee</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-sm text-[#1A1A1A] pt-3">
              <span>Total Price</span>
              <span className="text-[#F12B19] text-base">{price.toString().startsWith("₹") ? price : `₹${price}`}</span>
            </div>
          </div>
        )}

        {/* Tab 3: Baggage Policy */}
        {activeTab === "baggagePolicy" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                <Briefcase size={16} className="text-[#F12B19]" />
                <span>Cabin Baggage</span>
              </div>
              <p className="text-gray-600 font-medium">{flight?.cabin || "7 Kgs (1 piece only per passenger)"}</p>
              <p className="text-[11px] text-gray-400 mt-1">Included per passenger allowance.</p>
            </div>

            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-800">
                <FileText size={16} className="text-[#F12B19]" />
                <span>Check-in Baggage</span>
              </div>
              <p className="text-gray-600 font-medium">{flight?.baggage || "15 Kgs (1 piece only per passenger)"}</p>
              <p className="text-[11px] text-gray-400 mt-1">Additional weight subject to airline fees.</p>
            </div>
          </div>
        )}

        {/* Tab 4: Cancellation */}
        {activeTab === "cancellation" && (
          <div className="space-y-3 text-xs">
            <div className={`p-3 border rounded-lg font-semibold flex items-center gap-2 ${
              flight?.refundable === "Refundable" || flight?.refundable?.toLowerCase()?.includes("refundable")
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-amber-50 border-amber-100 text-amber-800"
            }`}>
              <Check size={16} />
              <span>{flight?.refundable || "Refundable"} Ticket Policy</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 border border-gray-100 rounded-lg">
                <p className="font-bold text-gray-800">Cancellation Timeline</p>
                <p className="text-gray-500 mt-1">Up to 2 hrs before departure</p>
              </div>
              <div className="p-3 border border-gray-100 rounded-lg text-right">
                <p className="font-bold text-gray-800">Cancellation Penalty</p>
                <p className="text-red-600 font-semibold mt-1">₹3,000 / passenger</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-[#FBFBFB] border-t border-[#EAEAEA] px-5 py-3.5 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 font-medium block">Total Amount</span>
          <span className="font-['Quicksand'] font-bold text-xl text-[#1A1A1A]">
            {price.toString().startsWith("₹") ? price : `₹${price}`}
          </span>
        </div>

        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[14px] px-8 py-2.5 rounded-lg transition-all cursor-pointer"
          >
            Select Flight
          </button>
        )}
      </div>

    </div>
  );
}

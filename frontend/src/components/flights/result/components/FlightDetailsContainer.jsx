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

  const originCity = flight?.departCity || flight?.from || "Delhi";
  const destinationCity = flight?.arrivalCity || flight?.to || "Mumbai";

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return String(dateStr).trim();
    }
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (mins) => {
    if (!mins || isNaN(mins)) return "0m";
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  return (
    <div className="w-full bg-white border border-[#EAEAEA] border-[1.16px] rounded-[13.88px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] font-['Quicksand'] select-none text-left overflow-hidden">
      
      {/* Header Bar */}
      <div className="bg-[#FBFBFB] border-b border-[#EAEAEA] px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt={airlineName} className="w-6 h-6 object-contain" />
          <h3 className="font-['Satoshi'] font-bold text-[16px] text-[#1A1A1A]">
            {airlineName} ({flightCode}) &bull; {originCity} to {destinationCity}
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
          <div className="space-y-6">
            {flight.raw?.Segments && flight.raw.Segments.length > 0 ? (
              flight.raw.Segments.map((leg, legIdx) => {
                const segmentsList = Array.isArray(leg) ? leg : [leg];
                if (segmentsList.length === 0) return null;

                const firstSeg = segmentsList[0];
                const lastSeg = segmentsList[segmentsList.length - 1];

                return (
                  <div key={legIdx} className="space-y-4 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                    <h5 className="font-['Satoshi'] font-bold text-[13px] text-[#F12B19] uppercase tracking-wide flex items-center gap-1.5">
                      <span>Flight {legIdx + 1}:</span>
                      <span>{firstSeg.Origin?.Airport?.CityName || firstSeg.Origin?.Airport?.AirportCode || flight.departCity}</span>
                      <ChevronRight size={12} className="text-gray-400" />
                      <span>{lastSeg.Destination?.Airport?.CityName || lastSeg.Destination?.Airport?.AirportCode || flight.arrivalCity}</span>
                    </h5>

                    {segmentsList.map((seg, segIdx) => {
                      const segAirlineName = seg.Airline?.AirlineName || airlineName;
                      const segAirlineCode = seg.Airline?.AirlineCode || airlineCode;
                      const segFlightCode = `${segAirlineCode}-${seg.Airline?.FlightNumber || ''}`;
                      const depTime = formatTime(seg.Origin?.DepTime) || flight.departTime;
                      const arrTime = formatTime(seg.Destination?.ArrTime) || flight.arrivalTime;
                      const depAirport = seg.Origin?.Airport?.AirportName || `${seg.Origin?.Airport?.AirportCode || "DEL"} Airport`;
                      const arrAirport = seg.Destination?.Airport?.AirportName || `${seg.Destination?.Airport?.AirportCode || "BOM"} Airport`;
                      const depCity = seg.Origin?.Airport?.CityName || seg.Origin?.Airport?.AirportCode || flight.departCity;
                      const arrCity = seg.Destination?.Airport?.CityName || seg.Destination?.Airport?.AirportCode || flight.arrivalCity;
                      const depTerminal = seg.Origin?.Terminal ? `Terminal ${seg.Origin.Terminal}` : "";
                      const arrTerminal = seg.Destination?.Terminal ? `Terminal ${seg.Destination.Terminal}` : "";
                      const segmentDuration = formatDuration(seg.Duration) || flight.duration;

                      return (
                        <div key={segIdx} className="space-y-4 pt-2 first:pt-0 border-t first:border-t-0 border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={`https://images.kiwi.com/airlines/64/${segAirlineCode}.png`} alt={segAirlineName} className="w-8 h-8 object-contain" />
                              <div>
                                <h4 className="font-['Satoshi'] font-bold text-[14px] text-[#1A1A1A]">{segAirlineName} {segFlightCode}</h4>
                                <p className="text-xs text-gray-500">{seg.Craft || "Airbus"} • {flight.class || "Economy Class"}</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                              On-time Guarantee
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center py-2 text-left">
                            <div>
                              <p className="text-xs text-gray-400 font-bold uppercase">DEPARTURE</p>
                              <p className="font-['Satoshi'] font-bold text-lg text-[#1A1A1A]">{depTime}</p>
                              <p className="text-xs font-semibold text-gray-700 mt-0.5">{depAirport}</p>
                              {depTerminal && <p className="text-[11px] text-gray-400">{depTerminal}</p>}
                            </div>

                            <div className="text-center">
                              <span className="text-xs text-gray-500 font-semibold">{segmentDuration}</span>
                              <div className="relative w-full flex items-center justify-between my-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
                                <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
                                <Plane size={14} className="text-[#999999] rotate-45" />
                                <div className="h-[1px] flex-grow bg-[#EAEAEA] mx-1" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]" />
                              </div>
                              <span className="text-[11px] text-gray-400">Direct</span>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-gray-400 font-bold uppercase">ARRIVAL</p>
                              <p className="font-['Satoshi'] font-bold text-lg text-[#1A1A1A]">{arrTime}</p>
                              <p className="text-xs font-semibold text-gray-700 mt-0.5">{arrAirport}</p>
                              {arrTerminal && <p className="text-[11px] text-gray-400">{arrTerminal}</p>}
                            </div>
                          </div>

                          {segIdx < segmentsList.length - 1 && (
                            <div className="bg-amber-50/75 text-amber-800 text-xs px-4 py-2 rounded-lg border border-amber-100/50 font-medium text-center">
                              Layover at {arrCity} ({seg.Destination?.Airport?.AirportCode}) for {formatDuration(seg.GroundTime || 0)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
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

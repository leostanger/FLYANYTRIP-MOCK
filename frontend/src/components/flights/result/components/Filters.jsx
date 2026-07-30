/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/Filters.jsx
 * DESCRIPTION: Flight Sidebar Filter component matching Hotel section filter code & structure.
 * ============================================================================
 */

import React, { useState, useMemo } from "react";
import { Check, SlidersHorizontal } from "lucide-react";

export default function Filters({
  flights = [],
  selectedStops: propStops,
  setSelectedStops: propSetStops,
  selectedAirlines: propAirlines,
  setSelectedAirlines: propSetAirlines,
  minPrice: propMinPrice,
  setMinPrice: propSetMinPrice,
  maxPrice: propMaxPrice,
  setMaxPrice: propSetMaxPrice,
  selectedDeparture: propDeparture,
  setSelectedDeparture: propSetDeparture,
  selectedArrival: propArrival,
  setSelectedArrival: propSetArrival,
  onReset
}) {
  // Internal fallback states if props not passed
  const [internalStops, setInternalStops] = useState([]);
  const [internalAirlines, setInternalAirlines] = useState([]);
  const [internalMinPrice, setInternalMinPrice] = useState(1000);
  const [internalMaxPrice, setInternalMaxPrice] = useState(50000);
  const [internalDeparture, setInternalDeparture] = useState([]);
  const [internalArrival, setInternalArrival] = useState([]);

  const selectedStops = propStops !== undefined ? propStops : internalStops;
  const setSelectedStops = propSetStops || setInternalStops;
  const selectedAirlines = propAirlines !== undefined ? propAirlines : internalAirlines;
  const setSelectedAirlines = propSetAirlines || setInternalAirlines;
  const minPrice = propMinPrice !== undefined ? propMinPrice : internalMinPrice;
  const setMinPrice = propSetMinPrice || setInternalMinPrice;
  const maxPrice = propMaxPrice !== undefined ? propMaxPrice : internalMaxPrice;
  const setMaxPrice = propSetMaxPrice || setInternalMaxPrice;
  const selectedDeparture = propDeparture !== undefined ? propDeparture : internalDeparture;
  const setSelectedDeparture = propSetDeparture || setInternalDeparture;
  const selectedArrival = propArrival !== undefined ? propArrival : internalArrival;
  const setSelectedArrival = propSetArrival || setInternalArrival;

  // Collapsible accordion state for each section
  const [openSections, setOpenSections] = useState({
    stops: true,
    airlines: true,
    price: true,
    departure: true,
    arrival: true
  });

  const [airlineSearch, setAirlineSearch] = useState("");
  const [showAllAirlines, setShowAllAirlines] = useState(false);

  // Toggle collapse/expand for a section
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle helper for multi-choice checkbox arrays
  const handleToggle = (item, state, setState) => {
    if (state.includes(item)) {
      setState(state.filter((i) => i !== item));
    } else {
      setState([...state, item]);
    }
  };

  // Reset all filters to default state
  const handleResetFilters = () => {
    if (onReset) {
      onReset();
    } else {
      setSelectedStops([]);
      setSelectedAirlines([]);
      setAirlineSearch("");
      setShowAllAirlines(false);
      setMinPrice(1000);
      setMaxPrice(50000);
      setSelectedDeparture([]);
      setSelectedArrival([]);
    }
  };

  // Master list of domestic and international airlines with default logos
  const MASTER_AIRLINES = [
    { id: "indigo", label: "IndiGo", logo: "https://images.kiwi.com/airlines/64/6E.png" },
    { id: "airindia", label: "Air India", logo: "https://images.kiwi.com/airlines/64/AI.png" },
    { id: "spicejet", label: "SpiceJet", logo: "https://images.kiwi.com/airlines/64/SG.png" },
    { id: "vistara", label: "Vistara", logo: "https://images.kiwi.com/airlines/64/UK.png" },
    { id: "akasa", label: "Akasa Air", logo: "https://images.kiwi.com/airlines/64/QP.png" },
    { id: "airasia", label: "AirAsia / AIX Express", logo: "https://images.kiwi.com/airlines/64/I5.png" },
    { id: "alliance", label: "Alliance Air", logo: "https://images.kiwi.com/airlines/64/9I.png" },
    { id: "emirates", label: "Emirates", logo: "https://images.kiwi.com/airlines/64/EK.png" },
    { id: "qatar", label: "Qatar Airways", logo: "https://images.kiwi.com/airlines/64/QR.png" },
    { id: "etihad", label: "Etihad Airways", logo: "https://images.kiwi.com/airlines/64/EY.png" },
    { id: "flydubai", label: "flydubai", logo: "https://images.kiwi.com/airlines/64/FZ.png" },
    { id: "airarabia", label: "Air Arabia", logo: "https://images.kiwi.com/airlines/64/G9.png" },
    { id: "singapore", label: "Singapore Airlines", logo: "https://images.kiwi.com/airlines/64/SQ.png" },
    { id: "gulfair", label: "Gulf Air", logo: "https://images.kiwi.com/airlines/64/GF.png" },
    { id: "omanair", label: "Oman Air", logo: "https://images.kiwi.com/airlines/64/WY.png" },
    { id: "saudia", label: "Saudia", logo: "https://images.kiwi.com/airlines/64/SV.png" },
    { id: "kuwait", label: "Kuwait Airways", logo: "https://images.kiwi.com/airlines/64/KU.png" },
    { id: "jazeera", label: "Jazeera Airways", logo: "https://images.kiwi.com/airlines/64/J9.png" },
    { id: "thai", label: "Thai Airways", logo: "https://images.kiwi.com/airlines/64/TG.png" },
    { id: "malaysia", label: "Malaysia Airlines", logo: "https://images.kiwi.com/airlines/64/MH.png" },
    { id: "batik", label: "Batik Air", logo: "https://images.kiwi.com/airlines/64/OD.png" },
    { id: "vietjet", label: "VietJet Air", logo: "https://images.kiwi.com/airlines/64/VJ.png" },
    { id: "british", label: "British Airways", logo: "https://images.kiwi.com/airlines/64/BA.png" },
    { id: "lufthansa", label: "Lufthansa", logo: "https://images.kiwi.com/airlines/64/LH.png" },
    { id: "airfrance", label: "Air France", logo: "https://images.kiwi.com/airlines/64/AF.png" },
    { id: "klm", label: "KLM Royal Dutch", logo: "https://images.kiwi.com/airlines/64/KL.png" },
    { id: "cathay", label: "Cathay Pacific", logo: "https://images.kiwi.com/airlines/64/CX.png" },
    { id: "jal", label: "Japan Airlines", logo: "https://images.kiwi.com/airlines/64/JL.png" },
    { id: "ana", label: "All Nippon Airways", logo: "https://images.kiwi.com/airlines/64/NH.png" },
    { id: "united", label: "United Airlines", logo: "https://images.kiwi.com/airlines/64/UA.png" },
    { id: "american", label: "American Airlines", logo: "https://images.kiwi.com/airlines/64/AA.png" },
    { id: "delta", label: "Delta Air Lines", logo: "https://images.kiwi.com/airlines/64/DL.png" },
    { id: "turkish", label: "Turkish Airlines", logo: "https://images.kiwi.com/airlines/64/TK.png" },
    { id: "ethiopian", label: "Ethiopian Airlines", logo: "https://images.kiwi.com/airlines/64/ET.png" },
    { id: "egyptair", label: "EgyptAir", logo: "https://images.kiwi.com/airlines/64/MS.png" }
  ];

  // Dynamically compute list of airlines from live flights or master list
  const ALL_AIRLINES = useMemo(() => {
    const liveMap = {};
    if (Array.isArray(flights) && flights.length > 0) {
      flights.forEach((f) => {
        if (!f?.airline) return;
        const name = f.airline.trim();
        const id = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const rawPrice = parseInt(String(f.price || "0").replace(/[^\d]/g, ""), 10) || 0;
        if (!liveMap[id] || (rawPrice > 0 && rawPrice < liveMap[id].rawPrice)) {
          liveMap[id] = {
            id,
            label: name,
            price: rawPrice ? `₹${rawPrice.toLocaleString("en-IN")}` : "",
            rawPrice,
            logo: f.logo || `https://images.kiwi.com/airlines/64/6E.png`,
            isLive: true
          };
        }
      });
    }

    const merged = [...Object.values(liveMap)];
    const liveIds = new Set(merged.map((m) => m.id));

    MASTER_AIRLINES.forEach((item) => {
      if (!liveIds.has(item.id)) {
        merged.push({
          ...item,
          price: "",
          isLive: false
        });
      }
    });

    return merged;
  }, [flights]);

  // Filter airlines by search keyword
  const filteredAirlines = ALL_AIRLINES.filter((airline) =>
    airline.label.toLowerCase().includes(airlineSearch.toLowerCase())
  );

  // Determine displayed airlines count
  const displayedAirlines = showAllAirlines
    ? filteredAirlines
    : filteredAirlines.slice(0, 5);

  const PRICE_MIN = 1000;
  const PRICE_MAX = 50000;
  const minPct = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <aside className="w-full space-y-4 select-none sticky top-[90px] font-['Quicksand']">
      
      {/* ── 1. Top Header Card (Matching Hotel Section Header) ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] px-[23.13px] flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-[57px] md:h-[64.773px]">
        <div className="flex items-center gap-[6px]">
          <SlidersHorizontal size={18} className="text-[#333]" />
          <span className="font-['Satoshi'] font-bold text-[18.507px] text-[#333]">Filters</span>
        </div>
        <button
          type="button"
          onClick={handleResetFilters}
          className="font-['Quicksand'] font-semibold text-[15.037px] text-[#f12b19] hover:text-red-700 bg-transparent border-none cursor-pointer transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* ── 2. Filter Options Sidebar Card (Matching Hotel Section Body) ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-[23px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">

        {/* ========================================================================= */}
        {/* 1. PRICE RANGE FILTER                                                     */}
        {/* ========================================================================= */}
        <div className="space-y-3 select-none">
          <style>{`
            .price-thumb::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18.507px;
              height: 18.507px;
              border-radius: 50%;
              background: white;
              border: 2.313px solid #f12b19;
              cursor: pointer;
              pointer-events: auto;
              box-shadow: 0px 1.157px 3.47px 0px rgba(0,0,0,0.2);
            }
            .price-thumb::-moz-range-thumb {
              width: 18.507px;
              height: 18.507px;
              border: 2.313px solid #f12b19;
              border-radius: 50%;
              background: white;
              cursor: pointer;
              pointer-events: auto;
              box-shadow: 0px 1.157px 3.47px 0px rgba(0,0,0,0.2);
            }
            .price-thumb::-webkit-slider-runnable-track { background: transparent; }
            .price-thumb::-moz-range-track { background: transparent; }
          `}</style>

          <button
            type="button"
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between font-['Satoshi'] font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer mb-4"
          >
            <span>Price Range</span>
            {openSections.price ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            )}
          </button>

          {openSections.price && (
            <div className="pt-2 px-1">
              <div className="flex items-center justify-between mb-3 font-['Quicksand'] text-[14px] font-bold text-[#333]">
                <span>₹{minPrice.toLocaleString("en-IN")}</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="relative h-[20px] flex items-center mb-2">
                <div className="absolute inset-x-0 h-[4px] rounded-full bg-[#EAEAEA]" />
                <div
                  className="absolute h-[4px] rounded-full bg-[#F12B19]"
                  style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={250}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value), maxPrice - 250))}
                  className="absolute inset-x-0 w-full h-full appearance-none bg-transparent price-thumb"
                  style={{ zIndex: minPrice > PRICE_MAX - 2000 ? 20 : 10 }}
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={250}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value), minPrice + 250))}
                  className="absolute inset-x-0 w-full h-full appearance-none bg-transparent price-thumb"
                  style={{ zIndex: 20 }}
                />
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* ========================================================================= */}
        {/* 2. STOPS FILTER                                                           */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleSection("stops")}
            className="w-full flex items-center justify-between font-['Satoshi'] font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
          >
            <span>Stops</span>
            {openSections.stops ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            )}
          </button>

          {openSections.stops && (
            <div className="space-y-0 pt-1">
              {[
                { id: "non-stop", label: "Non-Stop", price: "₹3,499" },
                { id: "1-stop", label: "1 Stop", price: "₹2,599" },
                { id: "2-stops", label: "2+ Stops", price: "₹2,999" }
              ].map((option) => {
                const isChecked = selectedStops.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleToggle(option.id, selectedStops, setSelectedStops)}
                    className="flex items-center justify-between cursor-pointer select-none group py-[9px] border-b border-[#F5F5F5]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: isChecked ? "1.16px solid #F12B19" : "1.16px solid #CCCCCC",
                          background: isChecked ? "#F12B19" : "white",
                          boxShadow: isChecked ? "0 1px 3px rgba(241,43,25,0.25)" : "none",
                        }}
                      >
                        {isChecked && <Check size={11} strokeWidth={3} color="white" />}
                      </div>
                      <span className="font-['Quicksand'] text-[13px] text-[#333333] font-normal">{option.label}</span>
                    </div>
                    <span className="font-['Quicksand'] text-[14px] text-[#666666] font-medium tracking-[0.6px]">{option.price}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* ========================================================================= */}
        {/* 3. AIRLINES FILTER                                                        */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleSection("airlines")}
            className="w-full flex items-center justify-between font-['Satoshi'] font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
          >
            <span>Airlines</span>
            {openSections.airlines ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            )}
          </button>

          {openSections.airlines && (
            <div className="space-y-0 pt-1">
              {/* Search Box matching Hotel amenities search style */}
              <div
                className="flex items-center gap-2 mb-3"
                style={{
                  background: "#F8F9FA",
                  border: "1.16px solid #EAEAEA",
                  borderRadius: "6.36px",
                  padding: "10px 12px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search Airlines"
                  value={airlineSearch}
                  onChange={(e) => setAirlineSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-['Quicksand'] text-xs text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Airline Checkbox Options */}
              <div className="space-y-0">
                {displayedAirlines.map((airline) => {
                  const isChecked = selectedAirlines.includes(airline.id);
                  return (
                    <div
                      key={airline.id}
                      onClick={() => handleToggle(airline.id, selectedAirlines, setSelectedAirlines)}
                      className="flex items-center justify-between cursor-pointer select-none group py-[9px] border-b border-[#F5F5F5]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "4px",
                            border: isChecked ? "1.16px solid #F12B19" : "1.16px solid #CCCCCC",
                            background: isChecked ? "#F12B19" : "white",
                            boxShadow: isChecked ? "0 1px 3px rgba(241,43,25,0.25)" : "none",
                          }}
                        >
                          {isChecked && <Check size={11} strokeWidth={3} color="white" />}
                        </div>

                        {/* Airline Logo */}
                        {airline.logo && (
                          <img 
                            src={airline.logo} 
                            alt={airline.label} 
                            className="w-5 h-5 object-contain flex-shrink-0"
                          />
                        )}

                        <span className="font-['Quicksand'] text-[13px] text-[#333333] font-normal leading-tight">{airline.label}</span>
                      </div>
                      <span className="font-['Quicksand'] text-[14px] text-[#666666] font-medium tracking-[0.6px]">{airline.price}</span>
                    </div>
                  );
                })}
              </div>


              {/* View All expand link */}
              {filteredAirlines.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllAirlines(prev => !prev)}
                  className="flex items-center gap-1 mt-2 border-none bg-transparent cursor-pointer p-0 text-[#F12B19] text-[13px] font-semibold"
                >
                  {showAllAirlines ? "View Less" : "View All"}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F12B19"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: showAllAirlines ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* ========================================================================= */}
        {/* 4. DEPARTURE TIME FILTER                                                  */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleSection("departure")}
            className="w-full flex items-center justify-between font-['Satoshi'] font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
          >
            <span>Departure Time</span>
            {openSections.departure ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            )}
          </button>

          {openSections.departure && (
            <div className="space-y-0 pt-1">
              {[
                { id: "dep-early", label: "Early Morning (00:00 - 06:00)" },
                { id: "dep-morning", label: "Morning (06:00 - 12:00)" },
                { id: "dep-afternoon", label: "Afternoon (12:00 - 18:00)" },
                { id: "dep-evening", label: "Evening (18:00 - 24:00)" }
              ].map((time) => {
                const isChecked = selectedDeparture.includes(time.id);
                return (
                  <div
                    key={time.id}
                    onClick={() => handleToggle(time.id, selectedDeparture, setSelectedDeparture)}
                    className="flex items-center cursor-pointer select-none group py-[9px] border-b border-[#F5F5F5]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: isChecked ? "1.16px solid #F12B19" : "1.16px solid #CCCCCC",
                          background: isChecked ? "#F12B19" : "white",
                          boxShadow: isChecked ? "0 1px 3px rgba(241,43,25,0.25)" : "none",
                        }}
                      >
                        {isChecked && <Check size={11} strokeWidth={3} color="white" />}
                      </div>
                      <span className="font-['Quicksand'] text-[13px] text-[#333333] font-normal">{time.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* ========================================================================= */}
        {/* 5. ARRIVAL TIME FILTER                                                    */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleSection("arrival")}
            className="w-full flex items-center justify-between font-['Satoshi'] font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
          >
            <span>Arrival Time</span>
            {openSections.arrival ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            )}
          </button>

          {openSections.arrival && (
            <div className="space-y-0 pt-1">
              {[
                { id: "arr-early", label: "Early Morning (00:00 - 06:00)" },
                { id: "arr-morning", label: "Morning (06:00 - 12:00)" },
                { id: "arr-afternoon", label: "Afternoon (12:00 - 18:00)" },
                { id: "arr-evening", label: "Evening (18:00 - 24:00)" }
              ].map((time) => {
                const isChecked = selectedArrival.includes(time.id);
                return (
                  <div
                    key={time.id}
                    onClick={() => handleToggle(time.id, selectedArrival, setSelectedArrival)}
                    className="flex items-center cursor-pointer select-none group py-[9px] border-b border-[#F5F5F5]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: isChecked ? "1.16px solid #F12B19" : "1.16px solid #CCCCCC",
                          background: isChecked ? "#F12B19" : "white",
                          boxShadow: isChecked ? "0 1px 3px rgba(241,43,25,0.25)" : "none",
                        }}
                      >
                        {isChecked && <Check size={11} strokeWidth={3} color="white" />}
                      </div>
                      <span className="font-['Quicksand'] text-[13px] text-[#333333] font-normal">{time.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </aside>
  );
}

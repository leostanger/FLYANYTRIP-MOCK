import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Pencil, Search, ArrowLeftRight, Calendar, User, ChevronUp } from "lucide-react";
import TopLoadingBar from "../../../common/TopLoadingBar";

export default function SearchSummary({ onModify, loading }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  // Form states initialized from URL params
  const [origin, setOrigin] = useState(searchParams.get("origin") || "DEL");
  const [destination, setDestination] = useState(searchParams.get("destination") || "BOM");
  const [departureDate, setDepartureDate] = useState(searchParams.get("departureDate") || new Date().toISOString().split("T")[0]);
  const [adults, setAdults] = useState(searchParams.get("adults") || "1");
  const [cabinClass, setCabinClass] = useState(searchParams.get("cabinClass") || "Economy");

  const returnDate = searchParams.get("returnDate");
  const tripType = searchParams.get("tripType") || "one-way";
  const totalTravellers = parseInt(adults, 10);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (origin.trim().toUpperCase() === destination.trim().toUpperCase()) {
      alert("Origin and destination airport cannot be the same.");
      return;
    }
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("origin", origin.toUpperCase());
    currentParams.set("destination", destination.toUpperCase());
    currentParams.set("departureDate", departureDate);
    currentParams.set("adults", adults);
    currentParams.set("cabinClass", cabinClass);

    setIsEditing(false);
    navigate(`/flights?${currentParams.toString()}`);
  };

  return (
    <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-4 md:px-[23.13px] md:py-[15px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] font-['Quicksand'] mb-5 transition-all relative">
      {/* Top Title & Subtitle */}
      <div className="flex items-center gap-2 mb-2 select-none">
        <span className="font-['Satoshi'] font-bold text-[11.5px] md:text-[12px] text-[#F12B19] tracking-wider uppercase">
          SEARCH SUMMARY
        </span>
        <span className="font-['Quicksand'] text-[11.5px] md:text-[12px] text-[#999999] font-normal hidden sm:inline">
          Live Adivaha Search Query
        </span>
      </div>

      {/* Main Content Details Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
        {/* Left Side: Route, Date, Passengers & Class */}
        <div className="flex items-center flex-wrap gap-3 md:gap-4 lg:gap-5 text-[#333333]">
          
          {/* Departure & Destination Cities */}
          <div className="flex items-center gap-3 font-['Satoshi'] font-bold text-[17.5px] md:text-[18.5px] text-[#1A1A1A]">
            <span>{searchParams.get("origin") || "DEL"}</span>
            <span className="text-[#999999] text-[15px] font-normal">→</span>
            <span>{searchParams.get("destination") || "BOM"}</span>
          </div>

          <div className="h-[18px] w-[1px] bg-[#EAEAEA] hidden sm:block" />

          {/* Travel Date */}
          <span className="font-['Quicksand'] text-[13.5px] md:text-[14.5px] font-medium text-[#333333]">
            {searchParams.get("departureDate") || departureDate} {tripType === 'round-trip' && returnDate ? ` - ${returnDate}` : ''}
          </span>

          <div className="h-[18px] w-[1px] bg-[#EAEAEA] hidden sm:block" />

          {/* Passenger Count & Cabin Class */}
          <span className="font-['Quicksand'] text-[13.5px] md:text-[14.5px] font-medium text-[#333333]">
            {searchParams.get("adults") || "1"} Traveller • {searchParams.get("cabinClass") || "Economy"}
          </span>

          <div className="h-[18px] w-[1px] bg-[#EAEAEA] hidden sm:block" />

          {/* Trip Type Badge Pill */}
          <span className="bg-[#F5F5F5] text-[#666666] text-[12px] font-['Quicksand'] font-semibold px-3 py-1 rounded-full capitalize">
            {tripType === 'round-trip' ? 'Round Trip' : 'One Way'}
          </span>
        </div>

        {/* Right Side: Modify Search Toggle Button */}
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 border font-['Quicksand'] font-bold text-[13px] px-4 py-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all cursor-pointer flex-shrink-0 self-start md:self-auto ${
            isEditing 
              ? "bg-[#F12B19] border-[#F12B19] text-white" 
              : "bg-white border-[#E0E0E0] hover:border-gray-400 text-[#333333] hover:bg-gray-50"
          }`}
        >
          {isEditing ? (
            <>
              <ChevronUp size={14} />
              <span>Close</span>
            </>
          ) : (
            <>
              <Pencil size={13} />
              <span>Modify Search</span>
            </>
          )}
        </button>
      </div>

      {/* EXPANDABLE INLINE SEARCH MODIFIER FORM */}
      {isEditing && (
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* From City */}
          <div className="lg:col-span-3 relative">
            <label className="text-[11px] font-bold text-gray-400 block mb-1 uppercase">From</label>
            <input 
              type="text" 
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. DEL"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 uppercase focus:outline-none focus:border-[#F12B19]"
              required
            />
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-1 flex items-end justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap From / To"
              className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-red-50 text-gray-600 hover:text-[#F12B19] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>

          {/* To City */}
          <div className="lg:col-span-3 relative">
            <label className="text-[11px] font-bold text-gray-400 block mb-1 uppercase">To</label>
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. BOM"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-800 uppercase focus:outline-none focus:border-[#F12B19]"
              required
            />
          </div>

          {/* Departure Date */}
          <div className="lg:col-span-2">
            <label className="text-[11px] font-bold text-gray-400 block mb-1 uppercase">Departure</label>
            <input 
              type="date" 
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#F12B19]"
              required
            />
          </div>

          {/* Travellers & Class */}
          <div className="lg:col-span-2">
            <label className="text-[11px] font-bold text-gray-400 block mb-1 uppercase">Class</label>
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#F12B19]"
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>

          {/* Submit Search Button */}
          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-[#F12B19] hover:bg-red-700 text-white font-bold text-xs py-2.5 px-3 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search size={14} />
              <span>Search</span>
            </button>
          </div>
        </form>
      )}

      {/* Airplane Loading Bar */}
      <TopLoadingBar searching={loading} />
    </div>
  );
}


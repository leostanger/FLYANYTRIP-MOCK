/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/components/FareCalendar.jsx
 * DESCRIPTION: Date fare calendar strip matching exact Figma design & typography.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, X } from "lucide-react";
import flightService from "../../../../services/flightService";

const parseLocalDate = (dateVal) => {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date) return new Date(dateVal);
  const str = String(dateVal).split("T")[0].split(" ")[0];
  const parts = str.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d);
    }
  }
  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const getYYYYMMDD = (dateVal) => {
  if (!dateVal) return "";
  if (typeof dateVal === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateVal.trim())) {
    return dateVal.trim();
  }
  const dObj = parseLocalDate(dateVal);
  const y = dObj.getFullYear();
  const m = String(dObj.getMonth() + 1).padStart(2, "0");
  const d = String(dObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function FareCalendar({
  currentDepartureDate,
  origin = "DEL",
  destination = "BOM",
  cabinClass = "Economy",
  onSelectDate
}) {
  const [startDate, setStartDate] = useState(() => {
    if (currentDepartureDate) {
      const d = parseLocalDate(currentDepartureDate);
      if (!isNaN(d.getTime())) {
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 3);
        const today = new Date();
        today.setHours(0,0,0,0);
        return prev < today ? today : prev;
      }
    }
    return new Date();
  });

  const [calendarFares, setCalendarFares] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [fullCalMonth, setFullCalMonth] = useState(() => new Date());

  // Update startDate strip when currentDepartureDate prop changes
  useEffect(() => {
    if (currentDepartureDate) {
      const d = parseLocalDate(currentDepartureDate);
      if (!isNaN(d.getTime())) {
        const prev = new Date(d);
        prev.setDate(prev.getDate() - 3);
        const today = new Date();
        today.setHours(0,0,0,0);
        setStartDate(prev < today ? today : prev);
      }
    }
  }, [currentDepartureDate]);

  // Generate 7 consecutive dates starting from startDate for the strip
  const dateList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Fetch live calendar fares from API when date range / route changes
  useEffect(() => {
    let isMounted = true;
    const fetchFares = async () => {
      setLoading(true);
      try {
        const startIso = getYYYYMMDD(startDate);
        const res = await flightService.getCalendarFare({
          origin,
          destination,
          departureDate: startIso,
          cabinClass
        });

        if (isMounted) {
          const faresMap = {};
          let rawFares = [];
          if (Array.isArray(res?.data)) rawFares = res.data;
          else if (Array.isArray(res?.fares)) rawFares = res.fares;
          else if (Array.isArray(res)) rawFares = res;

          rawFares.forEach((item) => {
            if (!item || typeof item !== "object") return;
            const rawDate = item.DepartureDate || item.departureDate || item.Date || item.date || item.depDate;
            const rawPrice = item.Fare || item.fare || item.Price || item.price || item.TotalFare || item.totalFare || item.OfferedFare || item.offeredFare;
            
            if (rawDate && rawPrice) {
              const dateKey = getYYYYMMDD(rawDate);
              const numericFare = Math.ceil(parseFloat(String(rawPrice).replace(/[^\d.]/g, "")));
              if (!isNaN(numericFare) && numericFare > 0) {
                faresMap[dateKey] = numericFare;
              }
            }
          });
          setCalendarFares((prev) => ({ ...prev, ...faresMap }));
        }
      } catch (err) {
        console.error("Failed to fetch calendar fares:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFares();
    return () => { isMounted = false; };
  }, [startDate, origin, destination, cabinClass]);

  // Pagination / Slide handlers
  const handlePrev = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() - 7);
    if (newStart < today) {
      setStartDate(today);
    } else {
      setStartDate(newStart);
    }
  };

  const handleNext = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + 7);
    setStartDate(newStart);
  };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const canGoPrev = startDate > todayDate;

  // Render Full Calendar Modal Grid
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const currentYear = fullCalMonth.getFullYear();
  const currentMonth = fullCalMonth.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = fullCalMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] font-['Quicksand'] select-none text-left">
      
      {/* Calendar Header Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="font-['Satoshi'] font-bold text-[17.35px] text-[#333333]">
            Fare Calendar
          </span>
          <span className="font-['Quicksand'] text-[12px] text-[#999999] font-normal hidden sm:inline">
            Date-wise price strip – find cheapest fares easily
          </span>
          {loading && <Loader2 size={16} className="text-[#F12B19] animate-spin ml-2" />}
        </div>
        
        <button 
          type="button"
          onClick={() => setShowFullCalendar(true)}
          className="text-[#F12B19] hover:text-red-700 font-['Quicksand'] font-semibold text-[13px] border-none bg-transparent cursor-pointer flex items-center gap-1 transition-colors"
        >
          <span>View Full Calendar</span>
          <ChevronRight size={15} strokeWidth={2.5} className="text-[#F12B19]" />
        </button>
      </div>

      {/* Date Cards Row */}
      <div className="flex items-center gap-2">
        {/* Scroll Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          title="Previous 7 Days"
          className={`w-9 h-9 rounded-full border border-[#EAEAEA] bg-white hover:bg-gray-50 flex items-center justify-center text-[#333333] transition-colors shadow-2xs cursor-pointer flex-shrink-0 ${!canGoPrev ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>        <div className="grid grid-cols-7 gap-2 flex-grow">
          {dateList.map((dObj) => {
            const isoStr = getYYYYMMDD(dObj);
            const isSelected = getYYYYMMDD(currentDepartureDate) === isoStr;
            const dateDisplay = dObj.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
            const dayDisplay = dObj.toLocaleDateString("en-US", { weekday: "short" });

            const fareValue = calendarFares[isoStr];
            let formattedPrice = "";
            if (fareValue) {
              formattedPrice = `₹${Number(fareValue).toLocaleString("en-IN")}`;
            } else {
              formattedPrice = "-";
            }

            return (
              <div
                key={isoStr}
                onClick={() => onSelectDate && onSelectDate(isoStr)}
                className={`border rounded-[10.5px] p-2.5 md:p-3 text-center cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-[#F12B19] border-[#F12B19] text-white shadow-sm"
                    : "bg-white border-[#EAEAEA] hover:border-gray-300 hover:bg-gray-50/50 text-[#333333]"
                }`}
              >
                <span className="font-['Quicksand'] text-[12.5px] font-semibold block leading-tight">
                  {dateDisplay}
                </span>
                <span className={`font-['Quicksand'] text-[11px] block mt-0.5 leading-tight ${isSelected ? "text-white/80" : "text-[#999999] font-medium"}`}>
                  {dayDisplay}
                </span>
                <span className="font-['Satoshi'] text-[12.5px] font-bold block mt-2 leading-none tracking-[0.5px] truncate">
                  {formattedPrice}
                </span>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          title="Next 7 Days"
          className="w-9 h-9 rounded-full border border-[#EAEAEA] bg-white hover:bg-gray-50 flex items-center justify-center text-[#333333] transition-colors shadow-2xs cursor-pointer flex-shrink-0"
        >
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* FULL MONTH CALENDAR MODAL */}
      {showFullCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#F12B19]" />
                <h3 className="font-bold font-satoshi text-lg text-gray-800">
                  Fare Calendar ({origin} → {destination})
                </h3>
              </div>
              <button
                onClick={() => setShowFullCalendar(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Month Selector Bar */}
            <div className="flex justify-between items-center my-4 px-2">
              <button
                onClick={() => {
                  const prevM = new Date(fullCalMonth);
                  prevM.setMonth(prevM.getMonth() - 1);
                  setFullCalMonth(prevM);
                }}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-bold text-gray-800 text-base">{monthName}</span>
              <button
                onClick={() => {
                  const nextM = new Date(fullCalMonth);
                  nextM.setMonth(nextM.getMonth() + 1);
                  setFullCalMonth(nextM);
                }}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty padding days for month start offset */}
              {Array.from({ length: firstDay }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-14 rounded-lg bg-gray-50/30" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const d = new Date(currentYear, currentMonth, dayNum);
                const isoStr = getYYYYMMDD(d);
                const isSelected = getYYYYMMDD(currentDepartureDate) === isoStr;
                
                const isPast = d < todayDate;
                const fareValue = calendarFares[isoStr];

                const displayPrice = fareValue ? `₹${Number(fareValue).toLocaleString("en-IN")}` : `-`;

                return (
                  <button
                    key={isoStr}
                    disabled={isPast}
                    onClick={() => {
                      if (!isPast && onSelectDate) {
                        onSelectDate(isoStr);
                        setShowFullCalendar(false);
                      }
                    }}
                    className={`h-14 rounded-lg p-1 flex flex-col items-center justify-between border text-center transition-all ${
                      isPast 
                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#F12B19] border-[#F12B19] text-white shadow-md font-bold"
                          : "bg-white border-gray-200 hover:border-[#F12B19] hover:bg-red-50/30 text-gray-800"
                    }`}
                  >
                    <span className="text-xs font-semibold">{dayNum}</span>
                    <span className={`text-[10px] font-bold truncate w-full ${isSelected ? "text-white" : isPast ? "text-gray-300" : "text-[#F12B19]"}`}>
                      {isPast ? "-" : displayPrice}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span>* Fares subject to live availability</span>
              <button
                onClick={() => setShowFullCalendar(false)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

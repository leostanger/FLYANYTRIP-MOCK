/*
 * Flyanytrip
 * FareCalendarStrip.jsx
 *
 * A premium scrollable strip that shows flight fares for nearby dates.
 * It uses the calendar fares fetched from the backend.
 */
import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FareCalendarStrip = ({ 
  calendarFares, 
  fetchingFares, 
  departureDate, 
  onDateSelect 
}) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the selected date when loaded
    if (scrollContainerRef.current && calendarFares && calendarFares.length > 0) {
      const selectedDateStr = new Date(departureDate).toISOString().split('T')[0];
      const selectedIndex = calendarFares.findIndex(f => new Date(f.DepartureDate).toISOString().split('T')[0] === selectedDateStr);
      
      if (selectedIndex >= 0) {
        const itemWidth = 120; // approximate width of one item
        const scrollPos = (selectedIndex * itemWidth) - (scrollContainerRef.current.clientWidth / 2) + (itemWidth / 2);
        scrollContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, [calendarFares, departureDate]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (fetchingFares) {
    return (
      <div className="w-full h-[88px] bg-white rounded-2xl border border-black/5 flex items-center justify-center shadow-sm mb-6">
        <Loader2 className="w-6 h-6 text-brand-black/20 animate-spin" />
      </div>
    );
  }

  if (!calendarFares || calendarFares.length === 0) {
    return null;
  }

  const selectedDateStr = new Date(departureDate).toISOString().split('T')[0];

  return (
    <div className="relative w-full mb-6 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex items-center group">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 z-10 w-12 h-full flex items-center justify-center bg-gradient-to-r from-white via-white to-transparent text-brand-black/30 hover:text-[#448AFF] transition-colors"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto no-scrollbar px-10 flex items-center"
      >
        {calendarFares.map((fare, idx) => {
          const fareDate = new Date(fare.DepartureDate);
          const dateStr = fareDate.toISOString().split('T')[0];
          const isSelected = dateStr === selectedDateStr;
          
          const dayName = fareDate.toLocaleDateString('en-US', { weekday: 'short' });
          const monthName = fareDate.toLocaleDateString('en-US', { month: 'short' });
          const dayNum = fareDate.getDate();

          return (
            <div 
              key={dateStr}
              onClick={() => onDateSelect(fareDate)}
              className={`flex-shrink-0 flex flex-col items-center justify-center py-4 cursor-pointer border-b-[3px] transition-all min-w-[120px] ${
                isSelected 
                  ? 'border-[#448AFF] bg-[#448AFF]/[0.03]' 
                  : 'border-transparent hover:bg-black/[0.02]'
              }`}
            >
              <div className={`text-sm font-bold mb-1 ${isSelected ? 'text-[#448AFF]' : 'text-brand-black/60'}`}>
                {dayName}, {monthName} {dayNum}
              </div>
              <div className={`text-base font-black ${
                isSelected ? 'text-[#448AFF]' : 
                fare.IsLowestFareOfMonth ? 'text-green-500' : 
                'text-brand-black/80'
              }`}>
                ₹{Math.ceil(fare.Fare).toLocaleString('en-IN')}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 z-10 w-12 h-full flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent text-brand-black/30 hover:text-[#448AFF] transition-colors"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default FareCalendarStrip;

/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Flight search form component. Lets the user pick:
 * - Trip type (one-way or round trip)
 * - Departure and destination airports (with live search dropdown)
 * - Travel date(s) using a date picker
 * - Number of travelers and cabin class
 * All state is managed externally and passed in as props.
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Search, ArrowRightLeft, ChevronDown, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Full flight search form.
 * Renders the FROM/TO airport pickers, date picker, traveler selector,
 * and the main Search button.
 *
 * @param tripType           - 'round' or 'one' (trip mode)
 * @param setTripType        - Updates the trip type
 * @param from               - Selected departure airport object
 * @param to                 - Selected destination airport object
 * @param departureDate      - Selected date for one-way trips
 * @param setDepartureDate   - Updates the departure date
 * @param dateRange          - [startDate, endDate] for round trips
 * @param setDateRange       - Updates the date range
 * @param adults             - Number of adult travelers
 * @param children           - Number of child travelers
 * @param infants            - Number of infant travelers
 * @param travelClass        - Selected cabin class (e.g. 'Economy')
 * @param searching          - True while a search is in progress
 * @param handleSearch       - Runs the search when the button is clicked
 * @param showFromMenu       - Whether the FROM airport dropdown is open
 * @param setShowFromMenu    - Opens/closes the FROM dropdown
 * @param showToMenu         - Whether the TO airport dropdown is open
 * @param setShowToMenu      - Opens/closes the TO dropdown
 * @param showTravelersMenu  - Whether the traveler picker panel is open
 * @param setShowTravelersMenu - Opens/closes the traveler panel
 * @param filteredAirports   - List of airports matching the user's search query
 * @param handleAirportSearch - Filters airports as the user types
 * @param selectAirport      - Sets the chosen airport for FROM or TO
 * @param swapAirports       - Swaps the FROM and TO airports
 */

const FlightSearch = (props) => {
  const {
    tripType, setTripType, from, setFrom, to, setTo,
    departureDate, setDepartureDate, dateRange, setDateRange,
    multiCitySegments = [], setMultiCitySegments,
    adults, setAdults, children, setChildren, infants, setInfants,
    travelClass, setTravelClass, searching, handleSearch,
    showFromMenu, setShowFromMenu, showToMenu, setShowToMenu,
    showTravelersMenu, setShowTravelersMenu, filteredAirports,
    handleAirportSearch, selectAirport, swapAirports,
    calendarFares = [], fetchingFares = false, fetchCalendarFares,
    isCompact = false
  } = props;
  // Destructure the date range array into named start and end dates
  const [startDate, endDate] = dateRange;
  const [activeMultiMenu, setActiveMultiMenu] = React.useState(null);

  const containerRef = useRef(null);
  const departureRef = useRef(null);
  const returnRef = useRef(null);
  const mainDepartureRef = useRef(null);
  const mainRangeRef = useRef(null);

  const formatDateCompact = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    }).format(date);
  };

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredAirports, showFromMenu, showToMenu, activeMultiMenu]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      const el = document.getElementById('selected-airport-item');
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e, type, index = null) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredAirports.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredAirports.length) {
        const selected = filteredAirports[selectedIndex];
        if (type === 'from') {
          selectAirport('from', selected);
          setShowFromMenu(false);
        } else if (type === 'to') {
          selectAirport('to', selected);
          setShowToMenu(false);
        } else if (type === 'multi-from') {
          const newSegs = [...multiCitySegments];
          newSegs[index].from = selected;
          setMultiCitySegments(newSegs);
          setActiveMultiMenu(null);
        } else if (type === 'multi-to') {
          const newSegs = [...multiCitySegments];
          newSegs[index].to = selected;
          if (index + 1 < newSegs.length) {
            newSegs[index + 1].from = selected;
          }
          setMultiCitySegments(newSegs);
          setActiveMultiMenu(null);
        }
      }
    }
  };

  const formatDateMultiCity = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear().toString().slice(-2);
    return `${day} ${month}, ${year}`;
  };

  /**
   * Helper to render the price on each calendar day.
   */
  const renderDayContents = (day, date) => {
    const fareObj = calendarFares.find(f => {
      const fDate = new Date(f.DepartureDate);
      return fDate.getDate() === day &&
        fDate.getMonth() === date.getMonth() &&
        fDate.getFullYear() === date.getFullYear();
    });

    return (
      <div className="flex flex-col items-center py-0.5">
        <span className="text-[13px]">{day}</span>
        {fareObj && (
          <span className={`text-[8.5px] font-black leading-none mt-0.5 ${fareObj.IsLowestFareOfMonth ? 'text-green-600' : 'text-brand-red'}`}>
            ₹{Math.round(fareObj.Fare / 1000)}k
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowFromMenu(false);
        setShowToMenu(false);
        setShowTravelersMenu(false);
        setActiveMultiMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowFromMenu, setShowToMenu, setShowTravelersMenu]);

  if (isCompact) {
    return (
      <div ref={containerRef} className="w-full">
        {tripType === 'multi' ? (
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            {/* Trip Type Selector */}
            <div className="relative group/compact min-w-[140px]" onClick={() => setIsEditModalOpen(true)}>
              <div className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">TRIP TYPE</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-brand-black">Multi City</span>
                  <ChevronDown size={14} className="text-brand-black/30" />
                </div>
              </div>
            </div>

            {/* FROM Box */}
            <div className="relative flex-1 min-w-[200px]" onClick={() => setIsEditModalOpen(true)}>
              <div className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">FROM</div>
                <div className="text-sm font-black text-brand-black truncate">
                  {multiCitySegments[0]?.from?.city || from.city}, {multiCitySegments[0]?.from?.country || from.country}
                </div>
              </div>
            </div>

            {/* TO Box */}
            <div className="relative flex-1 min-w-[200px]" onClick={() => setIsEditModalOpen(true)}>
              <div className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">TO</div>
                <div className="text-sm font-black text-brand-black truncate">
                  {multiCitySegments[multiCitySegments.length - 1]?.to?.city || to.city}, {multiCitySegments[multiCitySegments.length - 1]?.to?.country || to.country}
                </div>
              </div>
            </div>

            {/* VIA Box */}
            {multiCitySegments.length > 1 && (
              <div 
                className="relative flex-[1.5] min-w-[180px]" 
                onClick={() => setIsEditModalOpen(true)}
                title={multiCitySegments.slice(0, -1).map(seg => seg.to?.city).join(' → ')}
              >
                <div className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                  <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">VIA</div>
                  <div className="text-sm font-black text-brand-black truncate max-w-[150px] lg:max-w-[250px]">
                    {multiCitySegments.slice(0, -1).map(seg => seg.to?.city).join(' → ')}
                  </div>
                </div>
              </div>
            )}

            {/* DEPART & RETURN Box */}
            <div className="relative min-w-[200px]" onClick={() => setIsEditModalOpen(true)}>
              <div className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all flex flex-col justify-center">
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">DEPART & RETURN</div>
                <div className="text-sm font-black text-brand-black">
                  {(() => {
                    const firstDate = formatDateMultiCity(multiCitySegments[0]?.departureDate);
                    const lastDate = formatDateMultiCity(multiCitySegments[multiCitySegments.length - 1]?.departureDate);
                    return firstDate === lastDate ? firstDate : `${firstDate} – ${lastDate}`;
                  })()}
                </div>
              </div>
            </div>

            {/* PASSENGER Box */}
            <div className="relative min-w-[200px]" onClick={() => setIsEditModalOpen(true)}>
              <div className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all">
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">PASSENGER & CLASS</div>
                <div className="text-sm font-black text-brand-black truncate">
                  {adults + children + infants} Traveler{adults + children + infants > 1 ? 's' : ''}, {travelClass}
                </div>
              </div>
            </div>

            {/* SEARCH Button */}
            <button
              onClick={handleSearch}
              disabled={searching}
              className="flex-1 min-w-[120px] h-[52px] bg-gradient-to-r from-[#82B1FF] to-[#448AFF] text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {searching ? '...' : 'SEARCH'}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            {/* Trip Type Selector */}
            <div className="relative group/compact min-w-[140px]">
              <div
                onClick={() => setTripType(tripType === 'one' ? 'round' : 'one')}
                className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">TRIP TYPE</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-brand-black">{tripType === 'one' ? 'One Way' : 'Round Trip'}</span>
                  <ChevronDown size={14} className="text-brand-black/30" />
                </div>
              </div>
            </div>

            {/* FROM Box */}
            <div className="relative flex-1 min-w-[200px]">
              <div
                onClick={() => {
                  setShowFromMenu(!showFromMenu); setShowToMenu(false); setShowTravelersMenu(false);
                  departureRef.current?.setOpen(false); returnRef.current?.setOpen(false);
                  mainDepartureRef.current?.setOpen(false); mainRangeRef.current?.setOpen(false);
                }}
                className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">FROM</div>
                <div className="text-sm font-black text-brand-black truncate">{from.city}, {from.country}</div>
              </div>
              <AnimatePresence>
                {showFromMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-black/8 z-[200] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-black/5">
                      <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl px-3 py-2">
                        <Search size={14} className="text-brand-black/30 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search city or airport..."
                          autoFocus
                          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-brand-black/30 text-brand-black"
                          onChange={(e) => handleAirportSearch(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, 'from')}
                        />
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto pb-2">
                      {filteredAirports.map((a, idx) => (
                        <div id={selectedIndex === idx ? "selected-airport-item" : ""} key={`${a.iata}-${idx}`} className={`mx-2 mb-0.5 p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl group ${selectedIndex === idx ? 'bg-brand-red/10' : 'hover:bg-brand-red/[0.05]'}`} onMouseDown={(e) => { e.preventDefault(); selectAirport('from', a); }} onMouseEnter={() => setSelectedIndex(idx)}>
                          <div className={`w-10 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedIndex === idx ? 'bg-brand-red/20' : 'bg-black/[0.04] group-hover:bg-brand-red/10'}`}>
                            <span className={`text-[10px] font-black tracking-wider transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black/60 group-hover:text-brand-red'}`}>{a.iata}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black group-hover:text-brand-red'}`}>{a.city}, {a.country}</span>
                            <span className={`text-[10px] font-semibold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red/80' : 'text-brand-black/40 group-hover:text-brand-red/60'}`}>{a.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Swap Button */}
            <button onClick={swapAirports} className="w-8 h-8 flex items-center justify-center text-[#448AFF] hover:bg-blue-50 rounded-full transition-colors shrink-0">
              <ArrowRightLeft size={16} />
            </button>

            {/* TO Box */}
            <div className="relative flex-1 min-w-[200px]">
              <div
                onClick={() => {
                  setShowToMenu(!showToMenu); setShowFromMenu(false); setShowTravelersMenu(false);
                  departureRef.current?.setOpen(false); returnRef.current?.setOpen(false);
                  mainDepartureRef.current?.setOpen(false); mainRangeRef.current?.setOpen(false);
                }}
                className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">TO</div>
                <div className="text-sm font-black text-brand-black truncate">{to.city}, {to.country}</div>
              </div>
              <AnimatePresence>
                {showToMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-2xl border border-black/8 z-[200] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-black/5">
                      <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl px-3 py-2">
                        <Search size={14} className="text-brand-black/30 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search city or airport..."
                          autoFocus
                          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-brand-black/30 text-brand-black"
                          onChange={(e) => handleAirportSearch(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, 'to')}
                        />
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto pb-2">
                      {filteredAirports.map((a, idx) => (
                        <div id={selectedIndex === idx ? "selected-airport-item" : ""} key={`${a.iata}-${idx}`} className={`mx-2 mb-0.5 p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl group ${selectedIndex === idx ? 'bg-brand-red/10' : 'hover:bg-brand-red/[0.05]'}`} onMouseDown={(e) => { e.preventDefault(); selectAirport('to', a); }} onMouseEnter={() => setSelectedIndex(idx)}>
                          <div className={`w-10 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedIndex === idx ? 'bg-brand-red/20' : 'bg-black/[0.04] group-hover:bg-brand-red/10'}`}>
                            <span className={`text-[10px] font-black tracking-wider transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black/60 group-hover:text-brand-red'}`}>{a.iata}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black group-hover:text-brand-red'}`}>{a.city}, {a.country}</span>
                            <span className={`text-[10px] font-semibold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red/80' : 'text-brand-black/40 group-hover:text-brand-red/60'}`}>{a.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DEPART Box */}
            <div className="relative min-w-[150px]">
              <div
                onClick={() => {
                  setShowFromMenu(false);
                  setShowToMenu(false);
                  setShowTravelersMenu(false);
                  departureRef.current?.setOpen(true);
                }}
                className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all flex flex-col justify-center"
              >
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">DEPART</div>
                <div className="relative">
                  <DatePicker
                    ref={departureRef}
                    showPopperArrow={false}
                    selected={departureDate}
                    minDate={new Date()}
                    onChange={(date) => setDepartureDate(date)}
                    dateFormat="dd MMM, yy"
                    className="w-full bg-transparent outline-none cursor-pointer text-sm font-black text-brand-black"
                  />
                </div>
              </div>
            </div>

            {/* RETURN Box */}
            <div className="relative min-w-[150px]">
              <div
                onClick={() => {
                  setShowFromMenu(false);
                  setShowToMenu(false);
                  setShowTravelersMenu(false);
                  if (tripType === 'one') {
                    setTripType('round');
                    setTimeout(() => returnRef.current?.setOpen(true), 10);
                  } else {
                    returnRef.current?.setOpen(true);
                  }
                }}
                className={`bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all flex flex-col justify-center ${tripType === 'one' ? 'opacity-50' : ''}`}
              >
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">RETURN</div>
                <div className="relative">
                  {tripType === 'one' ? (
                    <div className="text-sm font-bold text-brand-black/30">Select Return</div>
                  ) : (
                    <DatePicker
                      ref={returnRef}
                      showPopperArrow={false}
                      selected={endDate}
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate || new Date()}
                      onChange={(update) => setDateRange(update)}
                      selectsRange={true}
                      className="w-full bg-transparent outline-none cursor-pointer text-sm font-black text-brand-black"
                      placeholderText="Select Return"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* PASSENGER Box */}
            <div className="relative min-w-[200px]">
              <div
                onClick={() => {
                  setShowTravelersMenu(!showTravelersMenu); setShowFromMenu(false); setShowToMenu(false);
                  departureRef.current?.setOpen(false); returnRef.current?.setOpen(false);
                  mainDepartureRef.current?.setOpen(false); mainRangeRef.current?.setOpen(false);
                }}
                className="bg-[#F2F2F2] border border-black/5 hover:border-black/10 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
              >
                <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-wider mb-0.5">PASSENGER & CLASS</div>
                <div className="text-sm font-black text-brand-black truncate">
                  {adults + children + infants} Traveler{adults + children + infants > 1 ? 's' : ''}, {travelClass}
                </div>
              </div>
              <AnimatePresence>
                {showTravelersMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-black/5 z-[100] p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-brand-black">Adults</div>
                          <div className="text-[11px] font-semibold text-brand-black/50">Aged 12+ yrs</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            disabled={adults <= 1}
                          >-</button>
                          <span className="w-4 text-center font-bold text-sm">{adults}</span>
                          <button
                            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setAdults(adults + 1)}
                            disabled={adults + children + infants >= 9}
                          >+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-brand-black">Children</div>
                          <div className="text-[11px] font-semibold text-brand-black/50">Aged 2-12 yrs</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setChildren(Math.max(0, children - 1))}
                            disabled={children <= 0}
                          >-</button>
                          <span className="w-4 text-center font-bold text-sm">{children}</span>
                          <button
                            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setChildren(children + 1)}
                            disabled={adults + children + infants >= 9}
                          >+</button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-brand-black">Infants</div>
                          <div className="text-[11px] font-semibold text-brand-black/50">Below 2 yrs</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setInfants(Math.max(0, infants - 1))}
                            disabled={infants <= 0}
                          >-</button>
                          <span className="w-4 text-center font-bold text-sm">{infants}</span>
                          <button
                            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => setInfants(infants + 1)}
                            disabled={infants >= adults || adults + children + infants >= 9}
                          >+</button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-black/5">
                        <div className="text-[11px] font-bold mb-3 uppercase tracking-wider">Travel Class</div>
                        <div className="grid grid-cols-2 gap-2">
                          {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                            <button
                              key={cls}
                              className={`py-2 px-3 rounded-xl text-[12px] font-bold transition-all flex flex-col items-center justify-center leading-[1.2] min-h-[52px] ${travelClass === cls ? 'bg-[#448AFF] text-white shadow-md' : 'bg-black/5 hover:bg-black/10'}`}
                              onClick={() => setTravelClass(cls)}
                            >
                              {cls === 'Premium Economy' ? (
                                <>
                                  <span>Premium</span>
                                  <span>Economy</span>
                                </>
                              ) : (
                                cls
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        className="w-full mt-2 bg-brand-black text-white py-3 rounded-xl text-xs font-bold hover:bg-[#448AFF] transition-all active:scale-95 shadow-lg"
                        onClick={() => {
                          setShowTravelersMenu(false);
                          handleSearch();
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SEARCH Button */}
            <button
              onClick={handleSearch}
              disabled={searching}
              className="flex-1 min-w-[120px] h-[52px] bg-gradient-to-r from-[#82B1FF] to-[#448AFF] text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {searching ? '...' : 'SEARCH'}
            </button>
          </div>
        )}

        {/* Edit Modal Overlay */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white rounded-[32px] p-8 max-w-5xl w-full shadow-2xl relative border border-black/5 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 text-brand-black/40 hover:text-brand-black transition-colors bg-black/[0.04] p-2 rounded-full hover:bg-black/[0.08]"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-black text-brand-black mb-6 tracking-tight">Edit Search Itinerary</h3>
              <div className="p-1">
                <FlightSearch
                  {...props}
                  handleSearch={() => {
                    setIsEditModalOpen(false);
                    handleSearch();
                  }}
                  isCompact={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <div className="flex gap-6 mb-6">
        <label className={`flex items-center gap-2 text-sm font-bold cursor-pointer ${tripType === 'one' ? 'text-brand-black' : 'text-brand-black/60'}`}>
          <input type="radio" name="trip" checked={tripType === 'one'} onChange={() => setTripType('one')} className="w-5 h-5 accent-brand-red" /> One Way
        </label>
        <label className={`flex items-center gap-2 text-sm font-bold cursor-pointer ${tripType === 'round' ? 'text-brand-black' : 'text-brand-black/60'}`}>
          <input type="radio" name="trip" checked={tripType === 'round'} onChange={() => setTripType('round')} className="w-5 h-5 accent-brand-red" /> Round Trip
        </label>
        <label className={`flex items-center gap-2 text-sm font-bold cursor-pointer ${tripType === 'multi' ? 'text-brand-black' : 'text-brand-black/60'}`}>
          <input type="radio" name="trip" checked={tripType === 'multi'} onChange={() => setTripType('multi')} className="w-5 h-5 accent-brand-red" /> Multi City
        </label>
      </div>

      {tripType === 'multi' ? (
        <div className="flex flex-col gap-4">
          {/* Passenger & Class for Multi City moved to bottom */}

          <div className="flex flex-col gap-3">
            {multiCitySegments.map((seg, idx) => (
              <div key={idx} className="flex gap-4 items-end relative">
                <div className="flex flex-1 items-center bg-white border border-black/10 rounded-2xl transition-all hover:shadow-md hover:border-brand-red focus-within:border-brand-red focus-within:shadow-md h-[82px]">

                  {/* FROM */}
                  <div
                    className="flex-1 min-w-0 h-full pl-6 pr-8 cursor-pointer hover:bg-black/[0.02] flex flex-col justify-center transition-colors relative"
                    onClick={() => {
                      setActiveMultiMenu(activeMultiMenu?.index === idx && activeMultiMenu?.type === 'from' ? null : { index: idx, type: 'from' });
                      setShowTravelersMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-1 rounded-full bg-brand-red" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/30">FROM</span>
                    </div>
                    <div className="text-xl font-black text-brand-black leading-none mb-0.5 truncate">{seg.from.city}</div>
                    <div className="text-[11px] font-bold text-brand-black/40 truncate">[{seg.from.iata}] {seg.from.name}</div>

                    <AnimatePresence>
                      {activeMultiMenu?.index === idx && activeMultiMenu?.type === 'from' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          className="absolute top-[calc(100%+12px)] left-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-black/8 z-[200] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-3 border-b border-black/5">
                            <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl px-3 py-2">
                              <Search size={14} className="text-brand-black/30 shrink-0" />
                              <input
                                type="text"
                                placeholder="Search city or airport..."
                                autoFocus
                                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-brand-black/30 text-brand-black"
                                onChange={(e) => handleAirportSearch(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 'multi-from', idx)}
                              />
                            </div>
                          </div>
                          <div className="max-h-80 overflow-y-auto pb-2">
                            {filteredAirports.map((a, aIdx) => (
                              <div
                                id={selectedIndex === aIdx ? "selected-airport-item" : ""}
                                key={`${a.iata}-${aIdx}`}
                                className={`mx-2 mb-0.5 p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl group ${selectedIndex === aIdx ? 'bg-brand-red/10' : 'hover:bg-brand-red/[0.05]'}`}
                                onMouseEnter={() => setSelectedIndex(aIdx)}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const newSegs = [...multiCitySegments];
                                  newSegs[idx].from = a;
                                  setMultiCitySegments(newSegs);
                                  setActiveMultiMenu(null);
                                }}
                              >
                                <div className={`w-12 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedIndex === aIdx ? 'bg-brand-red/20' : 'bg-black/[0.04] group-hover:bg-brand-red/10'}`}>
                                  <span className={`text-[11px] font-black tracking-wider transition-colors ${selectedIndex === aIdx ? 'text-brand-red' : 'text-brand-black/60 group-hover:text-brand-red'}`}>{a.iata}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-sm font-bold truncate transition-colors ${selectedIndex === aIdx ? 'text-brand-red' : 'text-brand-black group-hover:text-brand-red'}`}>{a.city}, {a.country}</span>
                                  <span className={`text-[11px] font-semibold truncate transition-colors ${selectedIndex === aIdx ? 'text-brand-red/80' : 'text-brand-black/40 group-hover:text-brand-red/60'}`}>{a.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="w-[1px] h-10 bg-black/5 shrink-0" />

                  {/* TO */}
                  <div
                    className="flex-1 min-w-0 h-full pl-8 pr-6 cursor-pointer hover:bg-black/[0.02] flex flex-col justify-center transition-colors relative"
                    onClick={() => {
                      setActiveMultiMenu(activeMultiMenu?.index === idx && activeMultiMenu?.type === 'to' ? null : { index: idx, type: 'to' });
                      setShowTravelersMenu(false);
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-1 rounded-full bg-brand-red opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/30">TO</span>
                    </div>
                    <div className="text-xl font-black text-brand-black leading-none mb-0.5 truncate">{seg.to.city}</div>
                    <div className="text-[11px] font-bold text-brand-black/40 truncate">[{seg.to.iata}] {seg.to.name}</div>

                    <AnimatePresence>
                      {activeMultiMenu?.index === idx && activeMultiMenu?.type === 'to' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.97 }}
                          className="absolute top-[calc(100%+12px)] left-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-black/8 z-[200] overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-3 border-b border-black/5">
                            <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl px-3 py-2">
                              <Search size={14} className="text-brand-black/30 shrink-0" />
                              <input
                                type="text"
                                placeholder="Search city or airport..."
                                autoFocus
                                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-brand-black/30 text-brand-black"
                                onChange={(e) => handleAirportSearch(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, 'multi-to', idx)}
                              />
                            </div>
                          </div>
                          <div className="max-h-80 overflow-y-auto pb-2">
                            {filteredAirports.map((a, aIdx) => (
                              <div
                                id={selectedIndex === aIdx ? "selected-airport-item" : ""}
                                key={`${a.iata}-${aIdx}`}
                                className={`mx-2 mb-0.5 p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl group ${selectedIndex === aIdx ? 'bg-brand-red/10' : 'hover:bg-brand-red/[0.05]'}`}
                                onMouseEnter={() => setSelectedIndex(aIdx)}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  const newSegs = [...multiCitySegments];
                                  newSegs[idx].to = a;
                                  if (idx + 1 < newSegs.length) {
                                    newSegs[idx + 1].from = a;
                                  }
                                  setMultiCitySegments(newSegs);
                                  setActiveMultiMenu(null);
                                }}
                              >
                                <div className={`w-12 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedIndex === aIdx ? 'bg-brand-red/20' : 'bg-black/[0.04] group-hover:bg-brand-red/10'}`}>
                                  <span className={`text-[11px] font-black tracking-wider transition-colors ${selectedIndex === aIdx ? 'text-brand-red' : 'text-brand-black/60 group-hover:text-brand-red'}`}>{a.iata}</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-sm font-bold truncate transition-colors ${selectedIndex === aIdx ? 'text-brand-red' : 'text-brand-black group-hover:text-brand-red'}`}>{a.city}, {a.country}</span>
                                  <span className={`text-[11px] font-semibold truncate transition-colors ${selectedIndex === aIdx ? 'text-brand-red/80' : 'text-brand-black/40 group-hover:text-brand-red/60'}`}>{a.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-white border border-black/10 p-3 rounded-xl font-bold text-brand-black flex items-center gap-3 transition-all hover:border-brand-red hover:shadow-md h-[82px] min-w-[200px]">
                  <div className="relative w-full h-full flex flex-col justify-center">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-black/40 mb-1 ml-1">Departure</label>
                    <DatePicker
                      selected={seg.departureDate}
                      minDate={idx === 0 ? new Date() : multiCitySegments[idx - 1].departureDate}
                      onChange={(date) => {
                        const newSegs = [...multiCitySegments];
                        newSegs[idx].departureDate = date;
                        setMultiCitySegments(newSegs);
                      }}
                      className="w-full outline-none bg-transparent cursor-pointer text-lg font-black text-brand-black"
                      dateFormat="dd MMM, yyyy"
                    />
                  </div>
                </div>

                {idx > 0 && multiCitySegments.length > 2 ? (
                  <button
                    onClick={() => {
                      const newSegs = multiCitySegments.filter((_, i) => i !== idx);
                      // If we deleted a middle segment, sync the broken chain
                      if (idx < multiCitySegments.length - 1 && idx > 0) {
                        newSegs[idx].from = newSegs[idx - 1].to;
                      }
                      setMultiCitySegments(newSegs);
                    }}
                    className="h-[82px] w-12 flex items-center justify-center text-brand-black/30 hover:text-brand-red transition-colors font-bold shrink-0"
                  >
                    X
                  </button>
                ) : (
                  <div className="w-12 h-[82px] shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end mt-2">
            {multiCitySegments.length < 5 ? (
              <button
                onClick={() => setMultiCitySegments([
                  ...multiCitySegments,
                  {
                    from: multiCitySegments[multiCitySegments.length - 1].to,
                    to: { iata: '', name: '', city: 'Select City', country: '' },
                    departureDate: new Date(new Date(multiCitySegments[multiCitySegments.length - 1].departureDate).setDate(multiCitySegments[multiCitySegments.length - 1].departureDate.getDate() + 1))
                  }
                ])}
                className="flex items-center gap-2 text-[#448AFF] font-bold text-sm border border-[#448AFF] px-4 py-2 rounded-xl hover:bg-[#448AFF]/10 transition-colors h-[60px]"
              >
                + ADD ANOTHER CITY
              </button>
            ) : <div />}

            <div className="flex items-end gap-4">
              <div className="relative min-w-[240px]">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-black/40 mb-2 ml-1">Travelers & Class</label>
                <div
                  className="bg-white border border-black/10 p-3 rounded-xl font-bold text-brand-black flex items-center justify-between gap-2 cursor-pointer transition-all hover:border-brand-red hover:shadow-md h-[60px]"
                  onClick={() => {
                    setShowTravelersMenu(!showTravelersMenu);
                    setActiveMultiMenu(null);
                  }}
                >
                  <span className="truncate text-sm">
                    {adults + children + infants} Traveler{adults + children + infants > 1 ? 's' : ''}, {travelClass}
                  </span>
                  <ChevronDown size={14} className="text-brand-black/40" />
                </div>
                <AnimatePresence>
                  {showTravelersMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-[calc(100%+12px)] right-0 w-80 bg-white rounded-xl shadow-2xl border border-black/5 z-[100] p-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-brand-black">Adults</div>
                            <div className="text-[11px] font-semibold text-brand-black/50">Aged 12+ yrs</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              disabled={adults <= 1}
                            >-</button>
                            <span className="w-4 text-center font-bold text-sm">{adults}</span>
                            <button
                              className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => setAdults(adults + 1)}
                              disabled={adults + children + infants >= 9}
                            >+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-brand-black">Children</div>
                            <div className="text-[11px] font-semibold text-brand-black/50">Aged 2-12 yrs</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              disabled={children <= 0}
                            >-</button>
                            <span className="w-4 text-center font-bold text-sm">{children}</span>
                            <button
                              className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => setChildren(children + 1)}
                              disabled={adults + children + infants >= 9}
                            >+</button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-brand-black">Infants</div>
                            <div className="text-[11px] font-semibold text-brand-black/50">Below 2 yrs</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => setInfants(Math.max(0, infants - 1))}
                              disabled={infants <= 0}
                            >-</button>
                            <span className="w-4 text-center font-bold text-sm">{infants}</span>
                            <button
                              className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              onClick={() => setInfants(infants + 1)}
                              disabled={infants >= adults || adults + children + infants >= 9}
                            >+</button>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-black/5">
                          <div className="text-[13px] font-bold text-black mb-3 uppercase tracking-wider">Travel Class</div>
                          <div className="grid grid-cols-2 gap-3">
                            {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                              <button
                                key={cls}
                                className={`py-2 px-3 rounded-xl text-[14px] font-semibold transition-all flex flex-col items-center justify-center leading-[1.2] min-h-[64px] ${travelClass === cls ? 'bg-[#ce3131] text-white shadow-sm' : 'bg-[#f4f4f4] text-[#333333] hover:bg-[#ebebeb]'}`}
                                onClick={() => setTravelClass(cls)}
                              >
                                {cls === 'Premium Economy' ? (
                                  <>
                                    <span>Premium</span>
                                    <span>Economy</span>
                                  </>
                                ) : (
                                  cls
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          className="w-full mt-2 bg-brand-black text-white py-3 rounded-xl text-sm font-bold transition-all hover:bg-brand-red hover:shadow-lg active:scale-95"
                          onClick={() => {
                            setShowTravelersMenu(false);
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                className="bg-brand-black text-white h-[60px] min-w-[140px] px-8 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-brand-red hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                onClick={handleSearch}
                disabled={searching}
              >
                <Search size={20} strokeWidth={3} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_auto] gap-4 items-end">
          <div className="relative flex items-center bg-white border border-black/10 rounded-2xl transition-all hover:shadow-md hover:border-brand-red focus-within:border-brand-red focus-within:shadow-md h-[82px] group/container">
            {/* From Section */}
            <div
              className="flex-1 min-w-0 h-full pl-6 pr-8 cursor-pointer hover:bg-black/[0.02] flex flex-col justify-center transition-colors relative"
              onClick={() => {
                setShowFromMenu(!showFromMenu);
                setShowToMenu(false);
                setShowTravelersMenu(false);
                departureRef.current?.setOpen(false);
                returnRef.current?.setOpen(false);
                mainDepartureRef.current?.setOpen(false);
                mainRangeRef.current?.setOpen(false);
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1 h-1 rounded-full bg-brand-red" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/30">FROM</span>
              </div>
              <div className="text-xl font-black text-brand-black leading-none mb-0.5 truncate">{from.city}</div>
              <div className="text-[11px] font-bold text-brand-black/40 truncate">[{from.iata}] {from.name}</div>

              <AnimatePresence>
                {showFromMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    className="absolute top-[calc(100%+12px)] left-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-black/8 z-[200] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-black/5">
                      <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl px-3 py-2">
                        <Search size={14} className="text-brand-black/30 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search city or airport..."
                          autoFocus
                          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-brand-black/30 text-brand-black"
                          onChange={(e) => handleAirportSearch(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, 'from')}
                        />
                      </div>
                    </div>
                    <div className="px-3 pt-2 pb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-black/30">
                        {filteredAirports.length} airports found
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto pb-2">
                      {filteredAirports.map((a, idx) => (
                        <div
                          id={selectedIndex === idx ? "selected-airport-item" : ""}
                          key={`${a.iata}-${idx}`}
                          className={`mx-2 mb-0.5 p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl group ${selectedIndex === idx ? 'bg-brand-red/10' : 'hover:bg-brand-red/[0.05]'}`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectAirport('from', a);
                          }}
                        >
                          <div className={`w-12 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedIndex === idx ? 'bg-brand-red/20' : 'bg-black/[0.04] group-hover:bg-brand-red/10'}`}>
                            <span className={`text-[11px] font-black tracking-wider transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black/60 group-hover:text-brand-red'}`}>{a.iata}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-sm font-bold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black group-hover:text-brand-red'}`}>{a.city}, {a.country}</span>
                            <span className={`text-[11px] font-semibold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red/80' : 'text-brand-black/40 group-hover:text-brand-red/60'}`}>{a.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); swapAirports(); }}
                className="w-8 h-8 bg-white border border-black/5 rounded-full shadow-lg flex items-center justify-center text-brand-red transition-all hover:scale-110 active:scale-95 hover:shadow-xl group/swap"
              >
                <ArrowRightLeft size={14} className="transition-transform group-hover/swap:rotate-180 duration-500" />
              </button>
            </div>

            <div className="w-[1px] h-10 bg-black/5 shrink-0" />

            {/* To Section */}
            <div
              className="flex-1 min-w-0 h-full pr-6 pl-8 cursor-pointer hover:bg-black/[0.02] flex flex-col justify-center transition-colors relative"
              onClick={() => {
                setShowToMenu(!showToMenu);
                setShowFromMenu(false);
                setShowTravelersMenu(false);
                departureRef.current?.setOpen(false);
                returnRef.current?.setOpen(false);
                mainDepartureRef.current?.setOpen(false);
                mainRangeRef.current?.setOpen(false);
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1 h-1 rounded-full bg-brand-red opacity-40" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-black/30">TO</span>
              </div>
              <div className="text-xl font-black text-brand-black leading-none mb-0.5 truncate">{to.city}</div>
              <div className="text-[11px] font-bold text-brand-black/40 truncate">[{to.iata}] {to.name}</div>

              <AnimatePresence>
                {showToMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    className="absolute top-[calc(100%+12px)] right-0 w-[420px] bg-white rounded-2xl shadow-2xl border border-black/8 z-[200] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-black/5">
                      <div className="flex items-center gap-2 bg-black/[0.03] rounded-xl px-3 py-2">
                        <Search size={14} className="text-brand-black/30 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search city or airport..."
                          autoFocus
                          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-brand-black/30 text-brand-black"
                          onChange={(e) => handleAirportSearch(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, 'to')}
                        />
                      </div>
                    </div>
                    <div className="px-3 pt-2 pb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-black/30">
                        {filteredAirports.length} airports found
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto pb-2">
                      {filteredAirports.map((a, idx) => (
                        <div
                          id={selectedIndex === idx ? "selected-airport-item" : ""}
                          key={`${a.iata}-${idx}`}
                          className={`mx-2 mb-0.5 p-3 flex items-center gap-3 cursor-pointer transition-all rounded-xl group ${selectedIndex === idx ? 'bg-brand-red/10' : 'hover:bg-brand-red/[0.05]'}`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectAirport('to', a);
                          }}
                        >
                          <div className={`w-12 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selectedIndex === idx ? 'bg-brand-red/20' : 'bg-black/[0.04] group-hover:bg-brand-red/10'}`}>
                            <span className={`text-[11px] font-black tracking-wider transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black/60 group-hover:text-brand-red'}`}>{a.iata}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-sm font-bold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red' : 'text-brand-black group-hover:text-brand-red'}`}>{a.city}, {a.country}</span>
                            <span className={`text-[11px] font-semibold truncate transition-colors ${selectedIndex === idx ? 'text-brand-red/80' : 'text-brand-black/40 group-hover:text-brand-red/60'}`}>{a.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-black/40 mb-2 ml-1">{tripType === 'round' ? 'Departure - Return' : 'Departure'}</label>
            <div
              onClick={() => {
                setShowFromMenu(false);
                setShowToMenu(false);
                setShowTravelersMenu(false);
                if (tripType === 'round') mainRangeRef.current?.setOpen(true);
                else mainDepartureRef.current?.setOpen(true);
              }}
              className="bg-white border border-black/10 p-3 rounded-xl font-bold text-brand-black flex items-center gap-3 transition-all hover:border-brand-red hover:shadow-md h-[] cursor-pointer"
            >
              {tripType === 'round' ? (
                <div className="relative w-full">
                  <DatePicker
                    ref={mainRangeRef}
                    showPopperArrow={false}
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    onChange={(update) => setDateRange(update)}
                    onCalendarOpen={() => fetchCalendarFares(startDate || new Date())}
                    onMonthChange={(date) => fetchCalendarFares(date)}
                    renderDayContents={renderDayContents}
                    className="w-full outline-none bg-transparent cursor-pointer text-sm"
                    dateFormat="dd MMM"
                    placeholderText="Select range"
                  />
                  {fetchingFares && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />}
                </div>
              ) : (
                <div className="relative w-full">
                  <DatePicker
                    ref={mainDepartureRef}
                    showPopperArrow={false}
                    selected={departureDate}
                    minDate={new Date()}
                    onChange={(date) => setDepartureDate(date)}
                    onCalendarOpen={() => fetchCalendarFares(departureDate)}
                    onMonthChange={(date) => fetchCalendarFares(date)}
                    renderDayContents={renderDayContents}
                    className="w-full outline-none bg-transparent cursor-pointer text-sm"
                    dateFormat="dd MMM, yyyy"
                  />
                  {fetchingFares && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-brand-black/40 mb-2 ml-1">Travelers</label>
            <div
              className="bg-white border border-black/10 p-3 rounded-xl font-bold text-brand-black flex items-center justify-between gap-2 cursor-pointer transition-all hover:border-brand-red hover:shadow-md h-[]"
              onClick={() => {
                setShowTravelersMenu(!showTravelersMenu);
                setShowFromMenu(false);
                setShowToMenu(false);
                departureRef.current?.setOpen(false);
                returnRef.current?.setOpen(false);
                mainDepartureRef.current?.setOpen(false);
                mainRangeRef.current?.setOpen(false);
              }}
            >
              <span className="truncate text-sm">
                {adults + children + infants} Traveler{adults + children + infants > 1 ? 's' : ''}, {travelClass}
              </span>
              <ChevronDown size={14} className="text-brand-black/40" />
            </div>
            <AnimatePresence>
              {showTravelersMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-black/5 z-[100] p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-brand-black">Adults</div>
                        <div className="text-[11px] font-semibold text-brand-black/50">Aged 12+ yrs</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                        >-</button>
                        <span className="w-4 text-center font-bold text-sm">{adults}</span>
                        <button
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => setAdults(adults + 1)}
                          disabled={adults + children + infants >= 9}
                        >+</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-brand-black">Children</div>
                        <div className="text-[11px] font-semibold text-brand-black/50">Aged 2-12 yrs</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                        >-</button>
                        <span className="w-4 text-center font-bold text-sm">{children}</span>
                        <button
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => setChildren(children + 1)}
                          disabled={adults + children + infants >= 9}
                        >+</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-brand-black">Infants</div>
                        <div className="text-[11px] font-semibold text-brand-black/50">Below 2 yrs</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          disabled={infants <= 0}
                        >-</button>
                        <span className="w-4 text-center font-bold text-sm">{infants}</span>
                        {/* Infants cannot exceed the number of adults (1 adult per infant) */}
                        <button
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center font-bold text-brand-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => setInfants(infants + 1)}
                          disabled={infants >= adults || adults + children + infants >= 9}
                        >+</button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/5">
                      <div className="text-[13px] font-bold text-black mb-3 uppercase tracking-wider">Travel Class</div>
                      <div className="grid grid-cols-2 gap-3">
                        {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                          <button
                            key={cls}
                            className={`py-2 px-3 rounded-xl text-[14px] font-semibold transition-all flex flex-col items-center justify-center leading-[1.2] min-h-[64px] ${travelClass === cls ? 'bg-[#ce3131] text-white shadow-sm' : 'bg-[#f4f4f4] text-[#333333] hover:bg-[#ebebeb]'}`}
                            onClick={() => setTravelClass(cls)}
                          >
                            {cls === 'Premium Economy' ? (
                              <>
                                <span>Premium</span>
                                <span>Economy</span>
                              </>
                            ) : (
                              cls
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      className="w-full mt-2 bg-brand-black text-white py-3 rounded-xl text-sm font-bold transition-all hover:bg-brand-red hover:shadow-lg active:scale-95"
                      onClick={() => {
                        setShowTravelersMenu(false);
                        handleSearch();
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="bg-brand-black text-white h-[82px] min-w-[140px] px-8 rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-brand-red hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            onClick={handleSearch}
            disabled={searching}
          >
            <Search size={24} strokeWidth={3} />
            <span>Search</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;

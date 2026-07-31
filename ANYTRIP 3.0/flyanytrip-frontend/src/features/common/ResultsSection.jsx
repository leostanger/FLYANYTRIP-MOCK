/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Renders the list of search result cards on the results page.
 * Handles four different card layouts depending on the result type:
 * - 'flight'       → Flight card with airline, times, price
 * - 'tour'         → Tour package card with image and rating
 * - 'activity'     → Activity card with image, city, and price
 * - 'status/info'  → Simple status card (used for train, PNR, visa)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Compass, Globe2, MapPin, ShieldCheck, ArrowRightLeft, Search, X, ChevronUp, ArrowRight, Loader2 } from 'lucide-react';
import FlightFilters from '../flights/FlightFilters';
import FlightSortBar from '../flights/FlightSortBar';
import FareCalendarStrip from '../flights/FareCalendarStrip';
import { useSearchContext } from '../../context/SearchContext';
import FlightDetailsTabs from '../flights/FlightDetailsTabs';
import { SoldOutModal, FlightFareModal } from '../flights/FlightModals';
import api from '../../services/api';

const AirlineLogo = React.memo(({ airlineCode, airlineName }) => {
  const [hasError, setHasError] = React.useState(false);
  const [useFallback, setUseFallback] = React.useState(false);

  if (!airlineCode || hasError) {
    return (
      <div className="w-16 h-16 bg-brand-red/5 text-brand-red rounded-xl flex items-center justify-center shrink-0">
        <Plane size={32} />
      </div>
    );
  }

  const logoSrc = useFallback 
    ? `https://daisycon.io/images/airline/?width=200&height=200&color=ffffff&iata=${airlineCode}`
    : `/assets/airlines/${airlineCode}.png`;

  return (
    <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 bg-white border border-black/5 overflow-hidden shadow-sm">
      <img 
        src={logoSrc} 
        alt={airlineName}
        className="w-full h-full object-contain p-1"
        loading="lazy"
        onError={() => {
          if (!useFallback) {
            setUseFallback(true);
          } else {
            setHasError(true);
          }
        }}
      />
    </div>
  );
});

const FlightSkeleton = () => (
  <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden transition-all">
    <div className="flex flex-col md:flex-row">
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
            <div className="space-y-2">
              <div className="h-[22px] w-[140px] rounded-lg skeleton-shimmer" />
              <div className="h-4 w-[60px] rounded-md skeleton-shimmer" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-12">
          <div className="text-center flex flex-col items-center">
            <div className="h-8 w-[80px] rounded-xl skeleton-shimmer mb-2" />
            <div className="h-[14px] w-[40px] rounded-md skeleton-shimmer" />
          </div>

          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="h-3 w-[60px] rounded-md skeleton-shimmer relative z-10" />
            <div className="w-full h-[2px] bg-black/5 relative flex justify-center items-center">
              <div className="w-2 h-2 rounded-full skeleton-shimmer" />
            </div>
            <div className="h-2.5 w-[50px] rounded-md skeleton-shimmer" />
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="h-8 w-[80px] rounded-xl skeleton-shimmer mb-2" />
            <div className="h-[14px] w-[40px] rounded-md skeleton-shimmer" />
          </div>
        </div>
      </div>

      <div className="bg-black/[0.02] border-l border-black/5 p-8 w-full md:w-72 flex flex-col justify-center items-center text-center">
        <div className="h-[14px] w-[70px] rounded-md skeleton-shimmer mb-2" />
        <div className="h-[36px] w-[110px] rounded-xl skeleton-shimmer mb-6" />
        <div className="w-full h-[56px] rounded-xl skeleton-shimmer" />
      </div>
    </div>
  </div>
);

const ResultCard = React.memo(({ r, isExpanded, onToggleExpand, onContinue, revalidating }) => (
  <div className={`bg-white rounded-3xl border transition-all ${isExpanded ? 'border-brand-red/30 shadow-2xl ring-4 ring-brand-red/5' : 'border-black/5 shadow-sm hover:shadow-xl hover:border-brand-red/20'} overflow-hidden group`}>
    {r.type === 'flight' && (
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row flex-1">
          <div className="p-4 md:p-6 flex-1 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative">
            
            <div className="flex items-center gap-4 w-full md:w-[220px] shrink-0">
              <AirlineLogo airlineCode={r.airlineCode} airlineName={r.airline} />
              <div className="flex flex-col">
                <div className="text-[16px] font-bold text-brand-black leading-tight">{r.airline}</div>
                <div className="text-[12px] font-semibold text-brand-black/40 uppercase tracking-wider mt-0.5">{r.flight}</div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-between w-full mt-4 md:mt-0">
              <div className="text-right flex flex-col items-end">
                <div className="text-2xl font-black text-brand-black mb-1">{r.time}</div>
                <div className="text-[13px] font-bold text-brand-black/40 uppercase tracking-widest">{r.from}</div>
              </div>

              <div className="flex-1 max-w-[200px] px-4 flex flex-col items-center justify-center gap-2">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-brand-black/40 bg-white px-2 relative z-10">{r.dur}</div>
                <div className="w-full h-[2px] bg-black/10 relative flex items-center">
                  <div className="w-1.5 h-1.5 bg-brand-red/30 rounded-full absolute left-0" />
                  {(!r.stops || r.stops === 0 || r.stops === '0') ? null : (
                     <div className="w-1.5 h-1.5 bg-amber-500 rounded-full absolute left-1/2 -translate-x-1/2 z-10" />
                  )}
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full absolute right-0" />
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap text-center ${!r.stops || r.stops === 0 || r.stops === '0' ? 'text-green-600' : 'text-amber-500'}`}>
                  {r.layover ? r.layover : (!r.stops || r.stops === 0 || r.stops === '0' ? 'Non-stop' : r.stops === 1 || r.stops === '1' ? '1 Stop' : `${r.stops} Stops`)}
                </div>
              </div>

              <div className="text-left flex flex-col items-start">
                <div className="text-2xl font-black text-brand-black mb-1">{r.arrival}</div>
                <div className="text-[13px] font-bold text-brand-black/40 uppercase tracking-widest">{r.to}</div>
              </div>
            </div>

            <div className="hidden lg:block absolute top-6 right-6">
               <span className="bg-black/[0.04] text-brand-black/60 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">{r.class}</span>
            </div>
          </div>

          <div className={`border-t md:border-t-0 md:border-l border-black/5 p-4 md:p-6 w-full md:w-[220px] shrink-0 flex flex-col justify-center items-center text-center transition-colors relative ${isExpanded ? 'bg-brand-red/[0.03]' : 'group-hover:bg-brand-red/[0.01]'}`}>
            <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Ticket Price</div>
            <div className="text-[26px] font-black text-brand-black mb-4 leading-none">₹{r.price}</div>
            <button 
              onClick={() => onToggleExpand(r)}
              className="w-full h-11 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 bg-brand-black text-white hover:bg-brand-red"
            >
              Select Flight
            </button>
          </div>
        </div>
        <div className="bg-[#FFF8F8] border-t border-brand-red/10 px-4 md:px-6 py-3 flex flex-wrap gap-2 items-center justify-between mt-auto cursor-pointer" onClick={() => onToggleExpand(r)}>
          <div className="text-[11px] font-bold text-brand-red uppercase tracking-wider">
            {r.promo || 'Use Code FLYNEW for 10% OFF'}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold text-brand-black/50 uppercase tracking-wider flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5">🧳 {r.baggage || '15 KGS CHECK-IN'}</span>
              <span className="flex items-center gap-1.5 text-[#448AFF]">🛡️ PARTIALLY REFUNDABLE</span>
            </div>
            <div className="text-[11px] font-bold text-brand-red flex items-center gap-1">
              VIEW DETAILS <ChevronUp size={14} className="rotate-180" />
            </div>
          </div>
        </div>
      </div>
    )}

    {(r.type === 'tour' || r.type === 'tour_custom') && (
      <div className={`flex flex-col md:flex-row h-full md:h-64 bg-white rounded-3xl overflow-hidden border transition-all ${r.type === 'tour_custom' ? 'border-brand-red/30 shadow-lg relative' : 'border-black/5 shadow-sm hover:shadow-xl group hover:border-brand-red/20'}`}>
        {r.type === 'tour_custom' && (
          <div className="absolute top-4 -right-12 bg-white text-brand-red text-[10px] font-black uppercase shadow-xl tracking-widest py-1.5 px-12 rotate-45 z-20 pointer-events-none">
            Top Pick
          </div>
        )}
        <div 
          onClick={() => navigate(`/tours/${r.id}`)}
          className="w-full md:w-80 h-48 md:h-auto overflow-hidden relative cursor-pointer"
        >
          <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f8f9fa/a8a29e?text=Image+Unavailable'; }} />
          {r.type === 'tour_custom' && <div className="absolute inset-0 bg-gradient-to-t from-brand-red/60 via-transparent to-transparent mix-blend-multiply" />}
        </div>
        <div className="p-8 flex-1 flex flex-col relative z-10 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 
                onClick={() => navigate(`/tours/${r.id}`)}
                className={`text-2xl font-extrabold mb-2 cursor-pointer hover:underline ${r.type === 'tour_custom' ? 'text-brand-red' : 'text-brand-black'}`}
              >
                {r.name}
              </h3>
              <div className="flex items-center gap-4 text-brand-black/40 font-bold text-sm">
                <span className="flex items-center gap-1.5"><Compass size={16} /> {r.duration}</span>
                <span className="flex items-center gap-1.5 font-bold"><Globe2 size={16} /> ⭐ {r.rating}</span>
              </div>
            </div>
          </div>
          {r.desc && <p className="text-brand-black/60 font-medium text-sm leading-relaxed mb-4">{r.desc}</p>}
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/5">
            <div>
              <div className="text-[11px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Package Price</div>
              <div className={`font-black ${r.type === 'tour_custom' ? 'text-brand-red text-2xl tracking-tight' : 'text-brand-black text-3xl'}`}>{r.type === 'tour_custom' ? r.price : `₹${r.price}`}</div>
            </div>
            <button 
              onClick={() => navigate(`/tours/${r.id}`)}
              className={`px-8 h-14 rounded-xl font-bold transition-all hover:bg-brand-black active:scale-95 flex items-center gap-2 border ${r.type === 'tour_custom' ? 'bg-brand-red text-white hover:text-white border-transparent shadow-md' : 'bg-transparent border-brand-black/20 text-brand-black hover:border-brand-black'}`}
            >
              {r.type === 'tour_custom' ? 'Start Customizing' : 'Book Tour Now'}
            </button>
          </div>
        </div>
      </div>
    )}

    {r.type === 'activity' && (
      <div className="flex bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm hover:shadow-xl transition-all h-[280px]">
        <div className="w-1/3 h-full relative overflow-hidden group">
          <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/f8f9fa/a8a29e?text=Image+Unavailable'; }} />
          <div className="absolute top-4 left-4">
            <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
              {r.tag}
            </span>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-black text-brand-black mb-2 tracking-tight">{r.name}</h3>
              <div className="flex items-center gap-4 text-brand-black/40 font-bold text-sm">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-brand-red" /> {r.city}</span>
                <span className="flex items-center gap-1.5 text-brand-black">⭐ <span className="text-brand-black/60">{r.rating}</span></span>
              </div>
            </div>
          </div>
          <p className="text-brand-black/60 font-medium text-sm leading-relaxed mb-6 line-clamp-2">{r.desc}</p>
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/5">
            <div>
              <div className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1">Ticket Price</div>
              <div className="text-3xl font-black text-brand-black">₹{r.price}</div>
            </div>
            <button className="bg-brand-black text-white px-8 h-12 rounded-xl font-bold transition-all hover:bg-brand-red hover:shadow-lg active:scale-95 flex items-center gap-2">
              Book Now <ArrowRightLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    )}

    {(r.type === 'status' || r.type === 'info') && (
      <div className="p-8 flex items-center gap-8 border-l-8 border-brand-red h-full">
        <div className="w-16 h-16 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-brand-black mb-2 tracking-tight">{r.title}</h3>
          <p className="text-brand-black/60 font-medium text-lg leading-relaxed">{r.desc}</p>
        </div>
      </div>
    )}
  </div>
), (prevProps, nextProps) => {
  return prevProps.revalidating === nextProps.revalidating &&
         prevProps.isExpanded === nextProps.isExpanded &&
         prevProps.r.id === nextProps.r.id &&
         prevProps.r.price === nextProps.r.price;
});

const ResultsSection = () => {
  const { from, to, departureDate, results, activeTab, searching, filters, setFilters, navigate, isFarePopupOpen, setIsFarePopupOpen, adults, children, infants, searchError, calendarFares, fetchingFares, setDepartureDate, handleSearch } = useSearchContext();
  const showSkeletons = searching && activeTab === 'flights';
  const skeletonArray = Array(6).fill(0);

  const [sortOption, setSortOption] = React.useState('cheapest');
  const [quickFilters, setQuickFilters] = React.useState([]);
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const [expandedId, setExpandedId] = React.useState(null);
  const [revalidatingId, setRevalidatingId] = React.useState(null);
  
  const [soldOutModal, setSoldOutModal] = React.useState(false);
  const [fareModal, setFareModal] = React.useState({ open: false, flight: null });

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleExpand = React.useCallback((flight) => {
    setFareModal({ open: true, flight });
    setIsFarePopupOpen(true);
  }, [setIsFarePopupOpen]);

  const handleContinue = React.useCallback(async (flight) => {
    setRevalidatingId(flight.id);
    try {
      const response = await api.post('/api/flights/fare-quote', {
        traceId: flight.traceId,
        resultIndex: flight.resultIndex,
        tokenId: flight.tokenId
      });

      if (response.data.success) {
        const quoteData = response.data.data;
        const responseData = quoteData?.responseData || quoteData;
        const status = responseData?.Response?.ResponseStatus;
        const error = responseData?.Response?.Error;

        if (status === 3 || (error && error.ErrorCode !== 0)) {
           setSoldOutModal(true);
           return;
        }

        const newFareObj = responseData?.Response?.Results?.Fare;
        const newFare = Math.ceil(newFareObj?.OfferedFare || newFareObj?.PublishedFare || 0);

        setIsFarePopupOpen(false);
        const flightData = { ...flight, price: newFare > 0 ? newFare.toLocaleString('en-IN') : flight.price, rawQuote: responseData };
        
        // Minimize data for URL to avoid 431 error
        const minimalFlightData = {
           id: flight.id,
           traceId: flight.traceId,
           resultIndex: flight.resultIndex,
           tokenId: flight.tokenId,
           from: from.iata,
           to: to.iata,
           fromCity: from.city,
           toCity: to.city,
           fromAirport: from.name,
           toAirport: to.name,
           departureDate: departureDate instanceof Date ? departureDate.toISOString() : departureDate,
           airline: flight.airline,
           airlineCode: flight.airlineCode,
           flightNo: flight.flightNo,
           time: flight.time,
           arrival: flight.arrival,
           dur: flight.dur,
           price: newFare > 0 ? newFare.toLocaleString('en-IN') : flight.price,
           class: flight.class,
           selectedFare: flight.selectedFare || 'SAVER',
           adults,
           children,
           infants
        };

        const encodedData = btoa(encodeURIComponent(JSON.stringify(minimalFlightData)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
        navigate(`/checkout/${from.iata}-${to.iata}?data=${encodeURIComponent(encodedData)}`, { state: { flight: flightData } });
      } else {
        alert('Revalidation failed. Please try again.');
      }
    } catch (err) {
      console.error('Revalidation error:', err);
      alert('Error validating flight details. Please try again.');
    } finally {
      setRevalidatingId(null);
    }
  }, [from, to, departureDate, navigate, setIsFarePopupOpen, adults, children, infants]);


  const displayResults = React.useMemo(() => {
    if (activeTab !== 'flights') return results;

    const parseHour = (timeStr) => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const ampm = match[3] ? match[3].toUpperCase() : null;
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h;
    };

    const getSlot = (h) => {
      if (h >= 0 && h < 6) return 'early_morning';
      if (h >= 6 && h < 12) return 'morning';
      if (h >= 12 && h < 18) return 'afternoon';
      return 'evening';
    };

    const parseDur = (durStr) => {
      if (!durStr) return 0;
      const parts = durStr.match(/(\d+)h\s*(\d+)m/);
      if (parts) return parseInt(parts[1]) * 60 + parseInt(parts[2]);
      const hOnly = durStr.match(/(\d+)h/);
      if (hOnly) return parseInt(hOnly[1]) * 60;
      return 0;
    };

    let filtered = results.filter(r => {
      if (r.type !== 'flight') return true;

      const p = parseInt(String(r.price).replace(/,/g, ''), 10) || 0;
      if (p < filters.priceRange[0] || p > filters.priceRange[1]) return false;

      if (filters.airlines.length > 0 && !filters.airlines.includes(r.airline)) return false;

      let numStops = 0;
      if (r.stops !== undefined && r.stops !== null) {
        numStops = parseInt(r.stops, 10) || 0;
      } else if (r.raw && r.raw.Segments) {
        numStops = r.raw.Segments[0].length - 1;
      }
      
      if (filters.stops.length > 0) {
        if (!filters.stops.includes(numStops) && !(filters.stops.includes(2) && numStops >= 2)) {
          return false;
        }
      }

      const depSlot = getSlot(parseHour(r.time));
      if (filters.depTime.length > 0 && !filters.depTime.includes(depSlot)) return false;

      const arrSlot = getSlot(parseHour(r.arrival));
      if (filters.arrTime.length > 0 && !filters.arrTime.includes(arrSlot)) return false;

      if (quickFilters.includes('nonstop') && numStops !== 0) return false;
      if (quickFilters.includes('morning') && depSlot !== 'morning') return false;

      return true;
    });

    filtered.sort((a, b) => {
      const pA = parseInt(String(a.price).replace(/,/g, ''), 10) || 0;
      const pB = parseInt(String(b.price).replace(/,/g, ''), 10) || 0;
      const durA = parseDur(a.dur);
      const durB = parseDur(b.dur);

      const activeSort = quickFilters.includes('cheapest') ? 'cheapest' : sortOption;

      if (activeSort === 'cheapest') return pA - pB;
      if (activeSort === 'fastest') return durA - durB;
      if (activeSort === 'best') return (pA * durA) - (pB * durB);
      if (activeSort === 'dep_early') return parseHour(a.time) - parseHour(b.time);
      if (activeSort === 'arr_early') return parseHour(a.arrival) - parseHour(b.arrival);

      return 0;
    });

    return filtered;
  }, [results, activeTab, filters, sortOption, quickFilters]);

  const handleDateSelect = React.useCallback((date) => {
    if (departureDate && date.getTime() === new Date(departureDate).getTime()) return;
    setDepartureDate(date);
    setTimeout(() => {
      handleSearch();
    }, 0);
  }, [departureDate, setDepartureDate, handleSearch]);

  return (
    <AnimatePresence>
      {(results.length > 0 || searching || activeTab === 'flights') && (
        <motion.section key="results-main-section" id="search-results-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FBFBFB] min-h-screen">
          <div className="w-full py-8 px-6 xl:px-10">
            <div className="flex justify-between items-end mb-6 border-b border-black/5 pb-3">
              <div>
                <h2 className="text-xl font-black text-brand-black mb-0.5">{
                  { flights: 'Flights', tours: 'Tours', visa: 'Visa', activity: 'Activity', train: 'Train Status', pnr: 'PNR Status' }[activeTab]
                }</h2>
                <p className="text-[11px] font-bold text-brand-black/40 uppercase tracking-wider">
                  {searching ? 'Searching available options...' : (
                    <>Showing <span className="text-brand-red">{displayResults.length}</span> professional results</>
                  )}
                </p>
              </div>
            </div>

            {activeTab === 'flights' ? (
              <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                <div className={`w-full lg:w-[320px] shrink-0 transition-transform z-50 ${showMobileFilters ? 'fixed inset-0 bg-black/50 backdrop-blur-sm p-4 flex flex-col justify-end' : 'hidden lg:block lg:sticky lg:top-[88px] lg:h-[calc(100vh-88px)]'}`}>
                  {showMobileFilters && (
                    <div className="absolute inset-0" onClick={() => setShowMobileFilters(false)} />
                  )}
                  <div className={`relative bg-white rounded-3xl lg:border border-black/5 p-6 shadow-xl lg:shadow-sm w-full h-full max-h-[85vh] lg:max-h-full overflow-y-auto no-scrollbar`}>
                    {showMobileFilters && (
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 lg:hidden sticky top-0 bg-white z-10 pt-2">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setShowMobileFilters(false)} className="bg-black/5 p-2 rounded-full">
                            <X size={20} />
                          </button>
                          <h3 className="text-xl font-extrabold text-brand-black tracking-tight">Filters</h3>
                        </div>
                        <button 
                          onClick={() => setFilters({ priceRange: [0, 100000], airlines: [], depTime: [], arrTime: [], stops: [], duration: 100 })} 
                          className="text-sm font-bold text-brand-red hover:underline"
                        >
                          Reset All
                        </button>
                      </div>
                    )}
                    <FlightFilters results={results} filters={filters} setFilters={setFilters} />
                  </div>
                </div>

                <div className="flex-1 w-full min-w-0">
                  <FareCalendarStrip 
                    calendarFares={calendarFares}
                    fetchingFares={fetchingFares}
                    departureDate={departureDate}
                    onDateSelect={handleDateSelect}
                  />
                  
                  <FlightSortBar 
                    sortOption={sortOption} setSortOption={setSortOption} 
                    totalResults={displayResults.length}
                    setShowMobileFilters={setShowMobileFilters}
                  />
                  
                  <div className="flex flex-col gap-6">
                    {searching ? (
                      skeletonArray.map((_, idx) => <FlightSkeleton key={`skeleton-${idx}`} />)
                    ) : displayResults.length > 0 ? (
                      displayResults.map((r, idx) => (
                        <motion.div
                          key={`flight-card-${r.id || idx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <ResultCard 
                            r={r} 
                            onToggleExpand={toggleExpand}
                            onContinue={handleContinue}
                            revalidating={revalidatingId === r.id}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white rounded-3xl border border-black/5 px-6"
                      >
                        <Plane size={64} className="mx-auto text-brand-black/10 mb-6" />
                        {searchError ? (
                          <>
                            <h3 className="text-2xl font-bold text-brand-red mb-2">Search Failed</h3>
                            <p className="text-brand-black/50 font-medium max-w-md mx-auto">{searchError}</p>
                            <p className="text-xs text-brand-black/30 mt-4">This could be due to a temporary network lag, request timeout (Vercel limit is 10s), or an issue with the flight provider API. Please try searching again.</p>
                          </>
                        ) : (
                          <>
                            <h3 className="text-2xl font-bold text-brand-black mb-2">No Flights Found</h3>
                            <p className="text-brand-black/50 font-medium">Try adjusting your filters or search criteria.</p>
                            <button 
                              onClick={() => setFilters({ priceRange: [0, 500000], airlines: [], depTime: [], arrTime: [], stops: [], duration: 100 })}
                              className="mt-8 text-brand-red font-bold hover:underline"
                            >
                              Reset All Filters
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {results.map((r, idx) => (
                  <ResultCard key={`result-${idx}-${r.id || 'new'}`} r={r} />
                ))}
              </div>
            )}
          </div>
        </motion.section>
      )}

      <SoldOutModal 
        key="sold-out-modal"
        isOpen={soldOutModal}
        onClose={() => setSoldOutModal(false)}
      />
      <FlightFareModal 
        key="fare-options-modal"
        isOpen={fareModal.open}
        onClose={() => {
           setFareModal({ open: false, flight: null });
           setIsFarePopupOpen(false);
        }}
        flight={fareModal.flight}
        onContinue={handleContinue}
        revalidating={revalidatingId === (fareModal.flight?.id)}
      />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            key="scroll-top-button"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-brand-black text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-brand-red hover:shadow-brand-red/30 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center"
          >
            <ChevronUp size={24} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ResultsSection;

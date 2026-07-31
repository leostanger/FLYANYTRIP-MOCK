import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Wifi, Coffee, Car, Dumbbell, Building2,
  SlidersHorizontal, Search, ArrowUpDown, AlertCircle, Loader2, Moon, X
} from 'lucide-react';
import api from '../services/api';
import { formatPrice, toINR, detectCurrency } from '../utils/currency';
import HotelSearch from '../features/hotels/HotelSearch';

const boardLabels = { BB: 'Bed & Breakfast', RO: 'Room Only', HB: 'Half Board', FB: 'Full Board', AI: 'All Inclusive' };

const HotelSearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const destinationCode = searchParams.get('destinationCode') || '';
  const countryCode = searchParams.get('countryCode') || 'IN';
  const destinationName = searchParams.get('destinationName') || 'Hotels';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const rooms = searchParams.get('rooms') || '1';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';

  const nightCount = checkIn && checkOut
    ? Math.max(1, Math.floor((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 1;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiCurrency, setApiCurrency] = useState('INR'); // raw currency from API

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchPanelExpanded, setSearchPanelExpanded] = useState(false);

  // Filter state — prices always in INR after conversion
  const [starFilter, setStarFilter] = useState([]);
  const [maxPriceINR, setMaxPriceINR] = useState(null);
  const [boardFilter, setBoardFilter] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  useEffect(() => {
    const fetchHotels = async () => {
      if (!destinationCode) { setError('No destination selected.'); setLoading(false); return; }
      try {
        setLoading(true);
        setError('');
        setStarFilter([]);
        setBoardFilter('');
        setMaxPriceINR(null);

        const res = await api.post('/api/hotels/search', {
          regionid: destinationCode,
          countryCode,
          checkIn,
          checkOut,
          rooms: parseInt(rooms),
          adults,
          children,
          childAge: '0',
          page: 1,
        });

        const hotelList = res.data?.data?.responseData?.HotelLists?.HotelList || [];
        setHotels(hotelList);

        // Detect currency — pass the FULL data object so detectCurrency
        // can find responseData.currency or responseData.HotelLists.HotelList[0].Currency
        const detectedFromResponse = detectCurrency(res.data?.data);
        const detectedFromList = detectCurrency(hotelList);
        // Adivaha commonly returns USD unless you're on an INR account.
        // Default to USD (not INR) so prices get properly converted.
        const detected = detectedFromResponse || detectedFromList || 'USD';

        console.log('[Hotel Pricing Debug — Search Results]', {
          step: '1. Currency detection',
          detectedFromResponse,
          detectedFromList,
          finalCurrency: detected,
          sampleHotel: hotelList[0]?.Name,
          sampleLowRate: hotelList[0]?.LowRate,
          note: 'LowRate = TOTAL stay price (all nights), NOT per-night',
          nightCount,
          sampleLowRateConverted: `${hotelList[0]?.LowRate} ${detected} × ${detected === 'EUR' ? 91 : detected === 'USD' ? 84 : 1} = ₹${toINR(parseFloat(hotelList[0]?.LowRate) || 0, detected)} TOTAL`,
          samplePerNight: `₹${Math.ceil(toINR(parseFloat(hotelList[0]?.LowRate) || 0, detected) / nightCount)} per night`,
        });

        setApiCurrency(detected);

        // Set slider max to highest INR-converted price
        // LowRate is total stay price — derive per-night for filter slider
        if (hotelList.length > 0) {
          const perNightPrices = hotelList
            .map(h => Math.ceil(toINR(parseFloat(h.LowRate) || 0, detected) / nightCount))
            .filter(p => p > 0);
          if (perNightPrices.length > 0) {
            setMaxPriceINR(Math.ceil(Math.max(...perNightPrices)));
          }
        }
      } catch (err) {
        setError('Failed to load hotels. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [destinationCode, countryCode, checkIn, checkOut, rooms, adults, children]);

  // INR prices for each hotel
  // NOTE: LowRate from Hotelbeds API is the TOTAL STAY price, not per-night
  const hotelsWithINR = hotels.map(h => {
    const totalStayINR = toINR(parseFloat(h.LowRate) || 0, apiCurrency);
    const perNightINR = Math.ceil(totalStayINR / nightCount);
    return {
      ...h,
      _inrTotal: totalStayINR,    // total stay price in INR
      _inrPerNight: perNightINR,  // per-night price in INR
      _starNum: parseInt(h.StarRating) || 0,
    };
  });

  const allPerNightPrices = hotelsWithINR.map(h => h._inrPerNight).filter(p => p > 0);
  const minINR = allPerNightPrices.length > 0 ? Math.floor(Math.min(...allPerNightPrices)) : 0;
  const maxINR = allPerNightPrices.length > 0 ? Math.ceil(Math.max(...allPerNightPrices)) : 100000;
  const sliderMax = maxPriceINR !== null ? Math.max(maxINR, maxPriceINR) : maxINR;

  const filtered = hotelsWithINR
    .filter((h) => {
      if (starFilter.length > 0 && !starFilter.includes(h._starNum)) return false;
      if (maxPriceINR !== null && h._inrPerNight > maxPriceINR) return false;
      if (boardFilter) {
        const boardCode = h.RoomTypes?.[0]?.rates?.[0]?.boardCode || '';
        const boardName = h.boardName || '';
        if (!boardCode.includes(boardFilter) && !boardName.includes(boardFilter)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a._inrPerNight - b._inrPerNight;
      if (sortBy === 'price_desc') return b._inrPerNight - a._inrPerNight;
      if (sortBy === 'stars_desc') return b._starNum - a._starNum;
      return 0;
    });

  const toggleStar = (s) =>
    setStarFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const activeFilterCount = starFilter.length + (boardFilter ? 1 : 0) + (maxPriceINR !== null && maxPriceINR < maxINR ? 1 : 0);

  const handleSelectHotel = (hotel) => {
    const params = new URLSearchParams({
      hotelId: hotel.EANHotelID,
      checkIn, checkOut, rooms, adults, children,
      destinationCode, countryCode,
      apiCurrency,
    });
    navigate(`/hotels/${hotel.EANHotelID}?${params.toString()}`, { state: { hotel, apiCurrency } });
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar (sticky, high z-index) ── */}
      <div className="bg-white border-b border-black/5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-black text-xl text-brand-black tracking-tight">
              Hotels in {destinationName.split(',')[0]}
            </h1>
            <p className="text-sm text-black/40 font-medium">
              {formatDate(checkIn)} → {formatDate(checkOut)} · {nightCount} night{nightCount > 1 ? 's' : ''} ·{' '}
              {adults} adult{parseInt(adults) > 1 ? 's' : ''} · {rooms} room{parseInt(rooms) > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Modify Search */}
            <button
              onClick={() => {
                setShowSearchBar(v => !v);
                setShowFilters(false);
                // Reset expanded state when toggling closed
                if (showSearchBar) setSearchPanelExpanded(false);
              }}
              className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${showSearchBar ? 'border-brand-red text-brand-red bg-brand-red/5' : 'border-black/15 text-brand-black hover:border-brand-red hover:text-brand-red'}`}
            >
              <Search size={14} />
              {showSearchBar ? 'Close' : 'Modify Search'}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-black/10 rounded-xl px-4 py-2.5 pr-9 text-sm font-bold text-brand-black focus:outline-none focus:border-brand-red cursor-pointer"
              >
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="stars_desc">Stars: High → Low</option>
              </select>
              <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => { setShowFilters(!showFilters); setShowSearchBar(false); }}
              className="flex items-center gap-2 bg-brand-black text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-red transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-brand-red text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* ── Modify Search Panel ── */}
        <AnimatePresence>
          {showSearchBar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              // Switch to overflow-visible ONLY when fully open so inner
              // dropdowns (suggestions, guest picker) are not clipped.
              // During exit animation keep overflow-hidden so height collapses.
              onAnimationComplete={(def) => {
                if (def?.height === 'auto') setSearchPanelExpanded(true);
                else setSearchPanelExpanded(false);
              }}
              style={{
                overflow: searchPanelExpanded ? 'visible' : 'hidden',
              }}
              className="border-t border-black/5 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 py-5">
                <HotelSearch
                  initialValues={{
                    destinationName,
                    destinationCode,
                    countryCode,
                    checkIn,
                    checkOut,
                    rooms,
                    adults,
                    children,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Filter panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-black/5 bg-white"
            >
              <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap gap-8 items-end">
                {/* Star filter */}
                <div>
                  <p className="text-xs font-black uppercase text-black/40 mb-2 tracking-wider">Star Rating</p>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((s) => (
                      <button key={s}
                        onClick={() => toggleStar(s)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${starFilter.includes(s) ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-black/60 border-black/10 hover:border-brand-red/50'}`}
                      >
                        {s}<Star size={10} className="fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max price slider in INR */}
                {maxPriceINR !== null && (
                  <div className="min-w-[240px]">
                    <p className="text-xs font-black uppercase text-black/40 mb-2 tracking-wider">
                      Max Price / Night:{' '}
                      <span className="text-brand-black">₹{maxPriceINR.toLocaleString('en-IN')}</span>
                    </p>
                    <input
                      type="range"
                      min={minINR || 0}
                      max={sliderMax}
                      step={Math.max(100, Math.floor(sliderMax / 100))}
                      value={maxPriceINR}
                      onChange={(e) => setMaxPriceINR(Number(e.target.value))}
                      className="w-full accent-brand-red"
                    />
                    <div className="flex justify-between text-xs text-black/30 mt-1">
                      <span>₹{minINR.toLocaleString('en-IN')}</span>
                      <span>₹{sliderMax.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Board type */}
                <div>
                  <p className="text-xs font-black uppercase text-black/40 mb-2 tracking-wider">Board Type</p>
                  <div className="flex gap-2 flex-wrap">
                    {['', 'BB', 'RO', 'HB', 'FB'].map((b) => (
                      <button key={b}
                        onClick={() => setBoardFilter(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${boardFilter === b ? 'bg-brand-red text-white border-brand-red' : 'bg-white text-black/60 border-black/10 hover:border-brand-red/50'}`}
                      >
                        {b === '' ? 'All' : (boardLabels[b] || b)}
                      </button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setStarFilter([]); setBoardFilter(''); setMaxPriceINR(maxINR); }}
                    className="flex items-center gap-1 text-xs font-bold text-brand-red hover:underline self-end pb-0.5"
                  >
                    <X size={12} /> Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">


        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                <Building2 size={28} className="text-brand-red" />
              </div>
              <Loader2 size={20} className="text-brand-red animate-spin absolute -top-2 -right-2" />
            </div>
            <p className="font-bold text-brand-black">Searching {destinationName.split(',')[0]}...</p>
            <p className="text-sm text-black/40">Checking live rates from 1000+ hotels</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <AlertCircle size={40} className="text-red-400" />
            <p className="font-bold text-brand-black">{error}</p>
            <button onClick={() => window.location.reload()}
              className="text-sm text-brand-red font-bold hover:underline">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && hotels.length > 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <SlidersHorizontal size={40} className="text-black/20" />
            <p className="font-bold text-brand-black">No hotels match your filters</p>
            <p className="text-sm text-black/40">Try adjusting your filters</p>
            <button
              onClick={() => { setStarFilter([]); setBoardFilter(''); setMaxPriceINR(maxINR); }}
              className="text-sm text-brand-red font-bold hover:underline mt-1"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Building2 size={40} className="text-black/20" />
            <p className="font-bold text-brand-black">No hotels found</p>
            <p className="text-sm text-black/40">Try different dates or destination</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-black/40">
                {filtered.length} of {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} shown
                {apiCurrency !== 'INR' && (
                  <span className="ml-2 text-xs bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                    Prices converted from {apiCurrency} to ₹
                  </span>
                )}
              </p>
            </div>
            <div className="space-y-4">
              {filtered.map((hotel, i) => {
                // LowRate is already the TOTAL stay price — use derived values
                const inrPerNight = hotel._inrPerNight;
                const inrTotal = hotel._inrTotal;
                const boardCode = hotel.RoomTypes?.[0]?.rates?.[0]?.boardCode || 'RO';
                const board = hotel.boardName || boardLabels[boardCode] || 'Room Only';

                return (
                  <motion.div
                    key={hotel.EANHotelID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.5) }}
                    className="bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
                  >
                    {/* Thumbnail */}
                    <div className="md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                      {hotel.thumbnail ? (
                        <img
                          src={hotel.thumbnail}
                          alt={hotel.Name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 size={40} className="text-slate-400" />
                        </div>
                      )}
                      {hotel._starNum > 0 && (
                        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold backdrop-blur-sm">
                          {hotel._starNum}<Star size={10} className="fill-yellow-400 text-yellow-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-5 flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <h2 className="font-black text-brand-black text-lg leading-tight mb-1">{hotel.Name}</h2>
                        <p className="flex items-center gap-1 text-sm text-black/40 font-medium mb-3">
                          <MapPin size={13} className="shrink-0" />
                          {hotel.Address1?.replace(/,$/, '')}{hotel.City ? `, ${hotel.City}` : ''}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
                            ✓ {boardLabels[boardCode] || board}
                          </span>
                          {hotel.currentAllotment > 0 && hotel.currentAllotment <= 5 && (
                            <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-semibold">
                              Only {hotel.currentAllotment} rooms left!
                            </span>
                          )}
                          {hotel.nonRefundable === 0 && (
                            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">
                              Free Cancellation
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3 text-black/30">
                          <Wifi size={16} /><Coffee size={16} /><Car size={16} /><Dumbbell size={16} />
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex flex-col items-end justify-between gap-3 min-w-[160px] shrink-0">
                        <div className="text-right">
                          <p className="text-2xl font-black text-brand-black">
                            ₹{inrPerNight.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-black/40 font-medium">per night</p>
                          {nightCount > 1 && (
                            <p className="text-sm font-semibold text-black/60 mt-1">
                              ₹{Math.ceil(inrTotal).toLocaleString('en-IN')} total
                            </p>
                          )}
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <Moon size={11} className="text-black/30" />
                            <span className="text-xs text-black/30">{nightCount} night{nightCount > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectHotel(hotel)}
                          className="w-full bg-brand-black text-white py-3 px-6 rounded-xl font-bold text-sm hover:bg-brand-red transition-colors shadow-sm"
                        >
                          View Rooms
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HotelSearchResults;

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Calendar, Users, Search, MapPin, ChevronDown, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Safely extracts a meaningful string from a city suggestion object.
 * The Adivaha API may return different field structures, so we try multiple keys.
 */
const extractCityField = (city, ...keys) => {
  for (const key of keys) {
    if (city[key] && typeof city[key] === 'string' && city[key].trim()) {
      return city[key].trim();
    }
  }
  return '';
};

const HotelSearch = ({ initialValues } = {}) => {
  const navigate = useNavigate();

  // --- Destination state ---
  const [destination, setDestination] = useState(initialValues?.destinationName || '');
  const [destinationCode, setDestinationCode] = useState(initialValues?.destinationCode || '');
  const [countryCode, setCountryCode] = useState(initialValues?.countryCode || 'IN');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const suggestRef = useRef(null);

  // --- Date state ---
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = today.toISOString().split('T')[0];
  const defaultCheckOut = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(initialValues?.checkIn || defaultCheckIn);
  const [checkOut, setCheckOut] = useState(initialValues?.checkOut || defaultCheckOut);

  // --- Guests & Rooms state ---
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [rooms, setRooms] = useState(parseInt(initialValues?.rooms) || 1);
  const [adults, setAdults] = useState(parseInt(initialValues?.adults) || 1);
  const [children, setChildren] = useState(parseInt(initialValues?.children) || 0);
  const guestRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) setShowSuggestions(false);
      if (guestRef.current && !guestRef.current.contains(e.target)) setShowGuestPicker(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Autocomplete fetch
  useEffect(() => {
    if (destination.length < 2) { setSuggestions([]); return; }
    // Don't re-fetch if user has already selected a destination (code is set)
    if (destinationCode) return;

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const res = await api.get(`/api/hotels/locations?term=${encodeURIComponent(destination)}&limit=8`);
        // The API may return cities under res.data.data.cities or res.data.cities
        const rawCities = res.data?.data?.cities || res.data?.cities || [];
        setSuggestions(rawCities);
        setShowSuggestions(rawCities.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [destination, destinationCode]);

  const handleSelectSuggestion = (city) => {
    // Robustly extract field values regardless of API field naming convention
    const name = extractCityField(city,
      'destinationName', 'cityName', 'name', 'city', 'CityName', 'destination'
    );
    const country = extractCityField(city,
      'countryName', 'country', 'CountryName', 'countryDesc'
    );
    const code = extractCityField(city,
      'destinationCode', 'regionId', 'regionid', 'code', 'DestinationCode', 'CityCode', 'cityCode', 'id'
    );
    const cCode = extractCityField(city,
      'countryCode', 'CountryCode', 'country_code'
    ) || 'IN';

    // Build the display name — only append country if it's not empty
    const displayName = country ? `${name}, ${country}` : name;

    setDestination(displayName || JSON.stringify(city));
    setDestinationCode(code);
    setCountryCode(cCode);
    setShowSuggestions(false);
  };

  const handleCheckInChange = (e) => {
    const val = e.target.value;
    setCheckIn(val);
    if (checkOut <= val) {
      const next = new Date(val);
      next.setDate(next.getDate() + 1);
      setCheckOut(next.toISOString().split('T')[0]);
    }
  };

  const formatGuestLabel = () => {
    const parts = [];
    parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    parts.push(`${rooms} Room${rooms > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const handleSearch = () => {
    if (!destinationCode) {
      alert('Please select a destination from the suggestions.');
      return;
    }
    const params = new URLSearchParams({
      destinationCode,
      countryCode,
      destinationName: destination,
      checkIn,
      checkOut,
      rooms: String(rooms),
      adults: String(adults),
      children: String(children),
    });
    navigate(`/hotels/search?${params.toString()}`);
  };

  const nightCount = Math.max(
    1,
    Math.floor((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-2"
    >
      <div className="flex flex-wrap gap-3 items-end">

        {/* ── Destination ── */}
        <div className="flex-[2] min-w-[220px]" ref={suggestRef}>
          <label className="block text-xs font-bold text-brand-black/60 uppercase mb-2 tracking-wider">
            Destination
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" size={18} />
            <input
              type="text"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setDestinationCode(''); }}
              onFocus={() => destination.length >= 2 && !destinationCode && setShowSuggestions(true)}
              placeholder="City, Area or Hotel name"
              className="w-full bg-white border border-black/10 rounded-xl py-3.5 pl-11 pr-4 text-brand-black font-semibold text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all placeholder:font-normal placeholder:text-black/30"
            />
            {destination && (
              <button onClick={() => { setDestination(''); setDestinationCode(''); setSuggestions([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
                <X size={14} />
              </button>
            )}

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-2xl shadow-2xl z-[200] overflow-hidden"
                >
                  {loadingSuggestions ? (
                    <div className="px-4 py-3 text-sm text-black/40 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-red/40 border-t-brand-red rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-black/40">No destinations found</div>
                  ) : (
                    suggestions.map((city, i) => {
                      const name = extractCityField(city,
                        'destinationName', 'cityName', 'name', 'city', 'CityName', 'destination'
                      );
                      const country = extractCityField(city,
                        'countryName', 'country', 'CountryName', 'countryDesc'
                      );
                      const code = extractCityField(city,
                        'destinationCode', 'regionId', 'regionid', 'code', 'DestinationCode', 'CityCode', 'cityCode', 'id'
                      );
                      return (
                        <button key={i} onMouseDown={() => handleSelectSuggestion(city)}
                          className="w-full text-left px-4 py-3 hover:bg-brand-red/5 transition-colors flex items-center gap-3 border-b border-black/5 last:border-0">
                          <MapPin size={14} className="text-brand-red shrink-0" />
                          <div>
                            <p className="font-semibold text-sm text-brand-black">{name || 'Unknown City'}</p>
                            <p className="text-xs text-black/40">
                              {country || ''}
                              {country && code ? ' · ' : ''}
                              {code || ''}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Check In ── */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-brand-black/60 uppercase mb-2 tracking-wider">
            Check In
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" size={18} />
            <input
              type="date"
              value={checkIn}
              min={defaultCheckIn}
              onChange={handleCheckInChange}
              className="w-full bg-white border border-black/10 rounded-xl py-3.5 pl-11 pr-3 text-brand-black font-semibold text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            />
          </div>
        </div>

        {/* ── Check Out ── */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-brand-black/60 uppercase mb-2 tracking-wider">
            Check Out <span className="text-brand-red font-normal">({nightCount} night{nightCount > 1 ? 's' : ''})</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" size={18} />
            <input
              type="date"
              value={checkOut}
              min={(() => { const d = new Date(checkIn); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-white border border-black/10 rounded-xl py-3.5 pl-11 pr-3 text-brand-black font-semibold text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            />
          </div>
        </div>

        {/* ── Guests & Rooms ── */}
        <div className="flex-1 min-w-[200px]" ref={guestRef}>
          <label className="block text-xs font-bold text-brand-black/60 uppercase mb-2 tracking-wider">
            Guests &amp; Rooms
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40 pointer-events-none" size={18} />
            <button
              onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="w-full bg-white border border-black/10 rounded-xl py-3.5 pl-11 pr-9 text-brand-black font-semibold text-sm text-left focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all"
            >
              {formatGuestLabel()}
            </button>
            <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-black/40 transition-transform ${showGuestPicker ? 'rotate-180' : ''}`} />

            <AnimatePresence>
              {showGuestPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-2xl shadow-2xl z-[200] p-4 space-y-4"
                >
                  {[
                    { label: 'Rooms', sub: 'Number of rooms', value: rooms, set: setRooms, min: 1, max: 8 },
                    { label: 'Adults', sub: 'Ages 18+', value: adults, set: setAdults, min: 1, max: rooms * 8 },
                    { label: 'Children', sub: 'Ages 0–17', value: children, set: setChildren, min: 0, max: rooms * 4 },
                  ].map(({ label, sub, value, set, min, max }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-brand-black text-sm">{label}</p>
                        <p className="text-xs text-black/40">{sub}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => set(Math.max(min, value - 1))}
                          className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors disabled:opacity-30"
                          disabled={value <= min}>
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-brand-black">{value}</span>
                        <button onClick={() => set(Math.min(max, value + 1))}
                          className="w-8 h-8 rounded-full border border-black/15 flex items-center justify-center hover:border-brand-red hover:text-brand-red transition-colors disabled:opacity-30"
                          disabled={value >= max}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setShowGuestPicker(false)}
                    className="w-full py-2.5 bg-brand-black text-white text-sm font-bold rounded-xl hover:bg-brand-red transition-colors">
                    Done
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Search Button ── */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="h-[51px] px-8 bg-brand-black text-white rounded-xl font-bold hover:bg-brand-red transition-colors flex items-center gap-2 shadow-lg shadow-black/10 whitespace-nowrap"
          >
            <Search size={18} />
            Search Hotels
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelSearch;

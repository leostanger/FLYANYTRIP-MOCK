import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, MapPin, Phone, Globe, Mail, Bed, Users, ChevronLeft,
  Check, Loader2, AlertCircle, Calendar, Moon, Building2,
  ImageOff, Tag, Shield, Info
} from 'lucide-react';
import api from '../services/api';
import { toINR } from '../utils/currency';

const boardLabels = {
  BB: 'Bed & Breakfast', RO: 'Room Only', HB: 'Half Board',
  FB: 'Full Board', AI: 'All Inclusive'
};

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const rooms = searchParams.get('rooms') || '1';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const destinationCode = searchParams.get('destinationCode') || '';
  const countryCode = searchParams.get('countryCode') || 'IN';
  const apiCurrency = searchParams.get('apiCurrency') || location.state?.apiCurrency || 'INR';

  const nightCount = checkIn && checkOut
    ? Math.max(1, Math.floor((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 1;

  const hotelFromState = location.state?.hotel;

  const [details, setDetails] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [errorDetails, setErrorDetails] = useState('');
  const [errorRooms, setErrorRooms] = useState('');
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(null);
  const [checkingRate, setCheckingRate] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // --- Fetch hotel details ---
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        const res = await api.post('/api/hotels/details', { hotelId });
        setDetails(res.data?.data?.responseData?.hotel || null);
      } catch {
        setErrorDetails('Could not load hotel details.');
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [hotelId]);

  // --- Fetch room availability ---
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await api.post('/api/hotels/room-availability', {
          hotelId, checkIn, checkOut,
          rooms, adults, children, childAge: '0',
        });
        setRoomTypes(res.data?.data?.responseData?.RoomTypes || []);
      } catch {
        // Fallback to rooms from the search state hotel
        if (hotelFromState?.RoomTypes) {
          setRoomTypes(hotelFromState.RoomTypes);
        } else {
          setErrorRooms('Could not load room availability.');
        }
      } finally {
        setLoadingRooms(false);
      }
    };
    if (checkIn && checkOut) fetchRooms();
  }, [hotelId, checkIn, checkOut, rooms, adults, children]);

  // Hotel basic info from search state (immediate display while details load)
  const hotelName = details?.name?.content || hotelFromState?.Name || 'Hotel Details';
  const hotelStars = details?.category?.description?.content?.replace(' STARS', '') || hotelFromState?.StarRating || '';
  const hotelAddress = details?.address?.content || hotelFromState?.Address1 || '';
  const hotelCity = details?.city?.content || hotelFromState?.City || '';
  const hotelDesc = details?.description?.content || '';
  const images = details?.images || [];
  const boards = details?.boards || [];

  const IMAGE_BASE = 'https://photos.hotelbeds.com/giata/';

  const handleSelectRoom = async (roomIdx, rate) => {
    try {
      setCheckingRate(true);
      setSelectedRoomIdx(roomIdx);
      // Scroll to top so loading overlay is fully visible
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const res = await api.post('/api/hotels/check-rates', { rateKey: rate.rateKey });
      const rateResponse = res.data?.data?.responseData?.RateResponse;

      // Rate net is in the API's original currency — it's the TOTAL stay price (all nights)
      const rawNet = parseFloat(rateResponse?.rooms?.[0]?.rates?.[0]?.net || rate.net || 0);
      const rateCurrencyFromResponse = rateResponse?.rooms?.[0]?.rates?.[0]?.currency || rate.currency || apiCurrency;
      const inrTotal = toINR(rawNet, rateCurrencyFromResponse);

      console.log('[Hotel Pricing Debug — Room Selection]', {
        step: '2. handleSelectRoom (Book Now click)',
        rawNet,
        rateCurrency: rateCurrencyFromResponse,
        note: 'rate.net = TOTAL stay price (all nights), NOT per-night',
        inrTotal,
        nightCount,
        inrPerNight: Math.ceil(inrTotal / nightCount),
      });

      navigate('/hotel-checkout', {
        state: {
          rateResponse,
          rateKey: rate.rateKey,
          apiCurrency: rateCurrencyFromResponse,
          inrTotal,
          hotelSnapshot: {
            hotelId,
            hotelName,
            checkIn,
            checkOut,
            rooms: parseInt(rooms),
            adults: parseInt(adults),
            children: parseInt(children),
            destinationCode,
            countryCode,
            starRating: hotelStars,
            address: `${hotelAddress}, ${hotelCity}`,
            boardCode: rate.boardCode,
            boardName: rate.boardName,
            roomName: roomTypes[roomIdx]?.name || 'Room',
            nightCount,
            apiCurrency: rateCurrencyFromResponse,
          },
        },
      });
    } catch (err) {
      alert('Could not verify room rate. Please try again.');
      console.error(err);
    } finally {
      setCheckingRate(false);
      setSelectedRoomIdx(null);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Full-page loading overlay during rate verification ── */}
      <AnimatePresence>
        {checkingRate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-5"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-brand-red/10 flex items-center justify-center"
            >
              <Loader2 size={32} className="text-brand-red" />
            </motion.div>
            <div className="text-center">
              <p className="font-black text-brand-black text-lg">Verifying Room Rate</p>
              <p className="text-sm text-black/40 font-medium mt-1">Confirming live pricing with the hotel...</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 rounded-full bg-brand-red/60"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-brand-red/60"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-brand-red/60"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Breadcrumb / Back ── */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-black/50 hover:text-brand-red transition-colors"
          >
            <ChevronLeft size={16} /> Back to Results
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── Image Gallery ── */}
        <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm">
          <div className="flex gap-2 h-72 md:h-96 overflow-hidden">
            {images.length > 0 ? (
              <>
                <div className="flex-[3] relative cursor-pointer overflow-hidden"
                  onClick={() => setActiveImageIdx((i) => (i + 1) % images.length)}>
                  <img
                    src={`${IMAGE_BASE}${images[activeImageIdx]?.path}`}
                    alt={hotelName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.src = ''; e.target.className = 'hidden'; }}
                  />
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                    {activeImageIdx + 1} / {images.length}
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex flex-col gap-2 w-32 overflow-y-auto pr-1">
                    {images.slice(0, 6).map((img, i) => (
                      <div key={i} className={`h-24 rounded-xl overflow-hidden cursor-pointer shrink-0 border-2 transition-all ${activeImageIdx === i ? 'border-brand-red' : 'border-transparent'}`}
                        onClick={() => setActiveImageIdx(i)}>
                        <img src={`${IMAGE_BASE}${img.path}`} alt="" className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                  <Building2 size={48} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 font-medium">No images available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Hotel Info ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header card */}
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              {loadingDetails ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                  <div className="h-16 bg-slate-100 rounded-lg" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h1 className="font-black text-2xl text-brand-black leading-tight">{hotelName}</h1>
                    <div className="flex items-center gap-1 shrink-0 bg-yellow-50 border border-yellow-200 px-2.5 py-1.5 rounded-xl">
                      {[...Array(parseInt(hotelStars) || 0)].map((_, i) => (
                        <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-sm text-black/50 font-medium mb-4">
                    <MapPin size={14} className="text-brand-red shrink-0" />
                    {hotelAddress && `${hotelAddress}, `}{hotelCity}
                    {details?.country?.description?.content && `, ${details.country.description.content}`}
                  </p>

                  {hotelDesc && (
                    <p className="text-sm text-black/60 leading-relaxed border-t border-black/5 pt-4">{hotelDesc}</p>
                  )}

                  {/* Contact row */}
                  <div className="flex flex-wrap gap-4 mt-4 border-t border-black/5 pt-4">
                    {details?.email && (
                      <a href={`mailto:${details.email}`} className="flex items-center gap-2 text-xs text-black/40 hover:text-brand-red transition-colors">
                        <Mail size={12} />{details.email}
                      </a>
                    )}
                    {details?.web && (
                      <a href={`https://${details.web}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-black/40 hover:text-brand-red transition-colors">
                        <Globe size={12} />{details.web}
                      </a>
                    )}
                    {details?.phones?.[0]?.phoneNumber && (
                      <span className="flex items-center gap-2 text-xs text-black/40">
                        <Phone size={12} />{details.phones[0].phoneNumber}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Board types */}
            {boards.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
                <h3 className="font-black text-brand-black mb-3 flex items-center gap-2">
                  <Tag size={16} className="text-brand-red" /> Meal Plans Available
                </h3>
                <div className="flex flex-wrap gap-2">
                  {boards.map((b) => (
                    <span key={b.code} className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full font-semibold">
                      {boardLabels[b.code] || b.description?.content || b.code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Room types */}
            {details?.rooms && details.rooms.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
                <h3 className="font-black text-brand-black mb-3 flex items-center gap-2">
                  <Bed size={16} className="text-brand-red" /> Room Types at This Hotel
                </h3>
                <div className="space-y-2">
                  {details.rooms.map((r) => (
                    <div key={r.roomCode} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                      <div>
                        <p className="font-semibold text-sm text-brand-black">{r.description}</p>
                        <p className="text-xs text-black/40">Max {r.maxAdults} adults, {r.maxChildren} children</p>
                      </div>
                      <span className="text-xs text-black/40 font-mono bg-black/5 px-2 py-0.5 rounded">{r.roomCode}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Booking sidebar ── */}
          <div className="space-y-4">

            {/* Stay summary */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <h3 className="font-black text-brand-black mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-brand-red" /> Your Stay
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50 font-medium">Check In</span>
                  <span className="font-bold text-brand-black">{formatDate(checkIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50 font-medium">Check Out</span>
                  <span className="font-bold text-brand-black">{formatDate(checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50 font-medium">Duration</span>
                  <span className="font-bold text-brand-black flex items-center gap-1">
                    <Moon size={12} />{nightCount} night{nightCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50 font-medium">Guests</span>
                  <span className="font-bold text-brand-black flex items-center gap-1">
                    <Users size={12} />{adults} Adult{parseInt(adults) > 1 ? 's' : ''}
                    {parseInt(children) > 0 && `, ${children} Child${parseInt(children) > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50 font-medium">Rooms</span>
                  <span className="font-bold text-brand-black">{rooms} room{parseInt(rooms) > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Free cancellation badge */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
              <Shield size={18} className="text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-800 text-sm">Most rooms include free cancellation</p>
                <p className="text-xs text-green-700 mt-0.5">Check cancellation policy for each room below</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Available Rooms ── */}
        <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
          <h2 className="font-black text-xl text-brand-black mb-5 flex items-center gap-2">
            <Bed size={20} className="text-brand-red" /> Available Rooms
          </h2>

          {loadingRooms && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={22} className="text-brand-red animate-spin" />
              <p className="font-semibold text-black/50">Checking room availability...</p>
            </div>
          )}

          {!loadingRooms && errorRooms && (
            <div className="flex items-center gap-3 py-8 text-red-500">
              <AlertCircle size={20} />
              <p className="font-semibold">{errorRooms}</p>
            </div>
          )}

          {!loadingRooms && roomTypes.length === 0 && !errorRooms && (
            <div className="flex flex-col items-center py-16 gap-3">
              <Bed size={36} className="text-black/15" />
              <p className="font-bold text-black/40">No rooms available for selected dates</p>
              <p className="text-sm text-black/30">Try different dates or contact the hotel</p>
            </div>
          )}

          {!loadingRooms && roomTypes.length > 0 && (
            <div className="space-y-4">
              {roomTypes.map((room, roomIdx) => (
                <div key={`${room.code}-${roomIdx}`}
                  className="border border-black/8 rounded-2xl overflow-hidden hover:border-brand-red/30 transition-colors">
                  {/* Room header */}
                  <div className="bg-slate-50 px-5 py-3 border-b border-black/5">
                    <h3 className="font-black text-brand-black text-sm">{room.name}</h3>
                    <p className="text-xs text-black/40 font-mono mt-0.5">{room.code}</p>
                  </div>

                  {/* Rate rows */}
                  <div className="divide-y divide-black/5">
                    {(room.rates || []).map((rate, rateIdx) => {
                      // rate.net from Hotelbeds = TOTAL stay price (all nights combined)
                      const rawNet = parseFloat(rate.net) || 0;
                      const rateCurrency = rate.currency || apiCurrency || 'INR';
                      const inrTotal = toINR(rawNet, rateCurrency);           // total stay in INR
                      const inrPerNight = Math.ceil(inrTotal / nightCount);   // per-night in INR
                      const isSelected = selectedRoomIdx === roomIdx;

                      return (
                        <div key={rateIdx}
                          className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">
                                {boardLabels[rate.boardCode] || rate.boardName || rate.boardCode}
                              </span>
                              {rate.cancellationPolicies?.length > 0 && (
                                <span className="text-xs text-green-700 flex items-center gap-1">
                                  <Check size={10} className="text-green-600" />
                                  Free cancellation available
                                </span>
                              )}
                              <span className="text-xs text-black/40">
                                {rate.adults} adult{rate.adults > 1 ? 's' : ''}
                                {rate.children > 0 && `, ${rate.children} children`}
                              </span>
                            </div>

                            {rate.cancellationPolicies?.length > 0 && (
                              <p className="text-xs text-black/40 flex items-center gap-1">
                                <Info size={10} />
                                Cancel by {new Date(rate.cancellationPolicies[0].from).toLocaleString('en-IN', { dateStyle: 'medium' })} for free
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <p className="text-xl font-black text-brand-black">
                                ₹{inrPerNight.toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-black/40">per night{rateCurrency !== 'INR' ? ` (${rateCurrency} converted)` : ''}</p>
                              {nightCount > 1 && (
                                <p className="text-sm font-semibold text-black/60">
                                  ₹{Math.ceil(inrTotal).toLocaleString('en-IN')} total
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleSelectRoom(roomIdx, rate)}
                              disabled={checkingRate}
                              className="bg-brand-red text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-brand-red/20 min-w-[120px] justify-center"
                            >
                              {checkingRate && isSelected ? (
                                <><Loader2 size={14} className="animate-spin" /> Verifying...</>
                              ) : (
                                'Book Now'
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;

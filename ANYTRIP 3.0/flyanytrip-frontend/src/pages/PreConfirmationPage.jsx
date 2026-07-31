import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, User, CheckCircle2, ArrowRight, ArrowLeft, Info, 
  Ticket, AlertCircle, CreditCard, Mail, Phone, MapPin, 
  Calendar, Clock, Armchair, Coffee, Luggage, ShieldCheck, 
  Edit3, ShieldAlert, Check, X, ShieldAlert as AlertIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { popularAirports } from '../utils/airportsData';

const PreConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Read complete packaged booking state
  const {
    flight,
    grandTotal,
    ssrTotal,
    travellers = [],
    selectedSeats = [],
    selectedMeals = [],
    selectedBaggage = [],
    couponCode = '',
    couponDiscount = 0,
    showGST = false,
    gstData = { companyName: '', registrationNo: '' },
    selectedState = '',
    baseFare = 0,
    tax = 0,
    convenienceFee = 0
  } = location.state || {};

  const [flightCollapsed, setFlightCollapsed] = useState(false);
  const [passengerCollapsed, setPassengerCollapsed] = useState(false);
  const [addonsCollapsed, setAddonsCollapsed] = useState(false);

  // If page is refreshed or state is missing, fallback gracefully
  if (!flight || travellers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5] pt-24 pb-16 px-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-black/5 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-brand-black mb-2">Booking Session Expired</h2>
          <p className="text-xs font-bold text-brand-black/40 mb-6">We could not retrieve your booking information. Please try checkout again.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-3 bg-brand-red text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-red/90 transition-all"
          >
             Go back to Search
          </button>
        </div>
      </div>
    );
  }

  // Segment references
  const segments = flight.segments || [];
  // Helper to find country of an airport
  const getAirportCountry = (iataCode) => {
    if (!iataCode) return '';
    const airport = popularAirports.find(a => a.iata?.toUpperCase() === iataCode.toUpperCase());
    return airport ? airport.country : '';
  };

  const isInternational = (() => {
    // 1. Check if any segment in segments crosses countries
    if (segments.length > 0) {
      const hasIntlSegment = segments.some(seg => {
        const originCountry = seg.Origin?.Airport?.CountryCode || seg.Origin?.Airport?.CountryName || getAirportCountry(seg.Origin?.Airport?.AirportCode);
        const destCountry = seg.Destination?.Airport?.CountryCode || seg.Destination?.Airport?.CountryName || getAirportCountry(seg.Destination?.Airport?.AirportCode);
        if (originCountry && destCountry) {
          return originCountry.trim().toUpperCase() !== destCountry.trim().toUpperCase();
        }
        return false;
      });
      if (hasIntlSegment) return true;
    }

    // 2. Simple comparison of flight origin/destination countries
    const originCountry = flight?.fromCountry || getAirportCountry(flight?.from);
    const destCountry = flight?.toCountry || getAirportCountry(flight?.to);
    if (originCountry && destCountry) {
      return originCountry.trim().toUpperCase() !== destCountry.trim().toUpperCase();
    }

    // 3. Fallback to existing flag
    return flight.isInternational || flight.IsInternational || false;
  })();

  // Passenger counts breakdown
  const adults = travellers.filter(t => t.type === 'adult').length;
  const children = travellers.filter(t => t.type === 'child').length;
  const infants = travellers.filter(t => t.type === 'infant').length;

  // Seat details mapper
  const getSeatType = (code = '') => {
    const letter = code.slice(-1).toUpperCase();
    if (['A', 'F'].includes(letter)) return 'Window';
    if (['C', 'D'].includes(letter)) return 'Aisle';
    return 'Middle';
  };

  const isExtraLegroom = (code = '', price = 0) => {
    const row = parseInt(code.match(/\d+/)?.[0] || '99');
    return row === 1 || row === 12 || row === 13 || price > 499;
  };

  // Seat totals & allocation mapper
  const totalSeatCost = selectedSeats.reduce((acc, s) => acc + (s?.price || 0), 0);
  const totalBaggageCost = selectedBaggage.reduce((acc, b) => acc + (b?.price || 0), 0);
  const totalMealsCost = selectedMeals.reduce((acc, m) => acc + (m?.price || 0), 0);

  // Edit action handler
  const handleEdit = (sectionName) => {
    navigate('/checkout', {
      state: {
        ...location.state,
        editSection: sectionName
      }
    });
  };

  // Format money helper
  const formatPrice = (p) => Math.ceil(p || 0).toLocaleString('en-IN');

  const proceedToPayment = () => {
    // Navigate securely to Payment.jsx passing complete packaged state
    navigate('/payment', {
      state: {
        flight,
        grandTotal,
        ssrTotal,
        travellers,
        selectedSeats,
        selectedMeals,
        selectedBaggage,
        couponCode,
        couponDiscount,
        showGST,
        gstData,
        selectedState,
        baseFare,
        tax,
        convenienceFee
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Dynamic Navigation Progress Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
           <button 
             onClick={() => handleEdit('travellers')}
             className="flex items-center gap-2 text-brand-black/60 hover:text-brand-black font-black text-xs uppercase tracking-widest transition-all"
           >
              <ArrowLeft size={16} /> Back to Checkout
           </button>
           
           {/* Steps Indicator */}
           <div className="hidden md:flex items-center gap-3">
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12} /> 1. Search</span>
              <span className="text-[10px] font-black text-green-600/30 uppercase tracking-widest">›</span>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={12} /> 2. Checkout</span>
              <span className="text-[10px] font-black text-green-600/30 uppercase tracking-widest">›</span>
              <span className="text-[10px] font-black text-brand-red uppercase tracking-widest bg-brand-red/5 px-2.5 py-1 rounded-md">3. Review Details</span>
              <span className="text-[10px] font-black text-brand-black/20 uppercase tracking-widest">›</span>
              <span className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest">4. Payment</span>
           </div>
        </div>

        {/* Heading */}
        <div className="mb-8">
           <h1 className="text-2xl md:text-3xl font-black text-brand-black tracking-tight">Confirm Your Booking Details</h1>
           <p className="text-xs font-bold text-brand-black/40 uppercase tracking-widest mt-1">Please review everything carefully before making payment</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT CONTENT COL - REVIEW CARDS */}
          <div className="flex-1 space-y-6 w-full">

            {/* 1. FLIGHT SUMMARY CARD */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               <div className="bg-black/[0.02] px-6 py-4 border-b border-black/5 flex justify-between items-center">
                  <button 
                     onClick={() => setFlightCollapsed(!flightCollapsed)}
                     className="flex items-center gap-3 focus:outline-none"
                  >
                     <div className="w-2.5 h-6 rounded-full bg-[#E61E2A]" />
                     <h3 className="text-xs font-black text-brand-black uppercase tracking-widest text-left">Flight Summary</h3>
                     <span className="text-[10px] font-bold text-brand-black/30 lowercase">({flightCollapsed ? 'tap to expand' : 'tap to collapse'})</span>
                  </button>
                  <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded tracking-widest">
                     {flight.selectedFare || 'SAVER'}
                  </span>
               </div>
               
               <AnimatePresence initial={false}>
                 {!flightCollapsed && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-6 space-y-6 overflow-hidden"
                    >
                       {/* Segment breakdown */}
                       {segments.length > 0 ? (
                          segments.map((seg, idx) => {
                             const depTime = new Date(seg.Origin.DepTime);
                             const arrTime = new Date(seg.Destination.ArrTime);
                             return (
                                <div key={idx} className="pb-6 last:pb-0 border-b border-black/[0.03] last:border-0">
                                   <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-2">
                                         <div className="w-6 h-6 bg-black/[0.03] rounded p-0.5 flex items-center justify-center">
                                            <img src={`/assets/airlines/${seg.Airline.AirlineCode}.png`} alt="" className="object-contain w-full h-full" onError={(e) => { e.target.src = '/assets/airlines/AI.png'; }} />
                                         </div>
                                         <span className="text-xs font-black text-brand-black">{seg.Airline.AirlineName} <span className="text-brand-black/40 font-bold ml-1">{seg.Airline.AirlineCode}-{seg.Airline.FlightNumber}</span></span>
                                      </div>
                                      <span className="text-[10px] font-black text-brand-black/50 uppercase tracking-widest">{flight.class || 'Economy'}</span>
                                   </div>

                                   {/* Timeline Layout */}
                                   <div className="flex justify-between items-start gap-4">
                                      <div className="flex-1">
                                         <div className="text-lg font-black text-brand-black">{depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                         <div className="text-xs font-black text-brand-black/80 uppercase tracking-widest mt-0.5">{seg.Origin.Airport.CityName} ({seg.Origin.Airport.AirportCode})</div>
                                         <div className="text-[9px] font-bold text-brand-black/30 mt-1 max-w-[150px] leading-tight truncate">{seg.Origin.Airport.AirportName}</div>
                                         {seg.Origin.Airport.Terminal && <div className="text-[9px] font-black text-brand-red uppercase tracking-wider mt-1">Terminal {seg.Origin.Airport.Terminal}</div>}
                                      </div>

                                      <div className="flex flex-col items-center justify-center px-4 pt-2 shrink-0">
                                         <span className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest">{Math.floor(seg.Duration / 60)}h {seg.Duration % 60}m</span>
                                         <div className="w-16 h-[2px] bg-black/10 relative my-2">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-red" />
                                         </div>
                                         <span className="text-[9px] font-black text-brand-red uppercase tracking-widest bg-brand-red/5 px-2 py-0.5 rounded-full">Non-Stop</span>
                                      </div>

                                      <div className="flex-1 text-right">
                                         <div className="text-lg font-black text-brand-black">{arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                         <div className="text-xs font-black text-brand-black/80 uppercase tracking-widest mt-0.5">{seg.Destination.Airport.CityName} ({seg.Destination.Airport.AirportCode})</div>
                                         <div className="text-[9px] font-bold text-brand-black/30 mt-1 max-w-[150px] leading-tight truncate ml-auto">{seg.Destination.Airport.AirportName}</div>
                                         {seg.Destination.Airport.Terminal && <div className="text-[9px] font-black text-brand-red uppercase tracking-wider mt-1">Terminal {seg.Destination.Airport.Terminal}</div>}
                                      </div>
                                   </div>
                                </div>
                             );
                          })
                       ) : (
                          // Fallback
                          <div className="flex justify-between items-center">
                             <div>
                                <div className="text-2xl font-black text-brand-black">{flight.time}</div>
                                <div className="text-sm font-black text-brand-black/60 uppercase">{flight.from}</div>
                             </div>
                             <div className="flex flex-col items-center">
                                <span className="text-[9px] font-black text-brand-black/30 uppercase">{flight.dur}</span>
                                <div className="w-24 h-[1px] bg-black/10 my-1 relative">
                                   <div className="absolute w-1.5 h-1.5 rounded-full bg-brand-red left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
                                </div>
                                <span className="text-[9px] font-black text-brand-black/40 uppercase">{flight.layover || 'Non-Stop'}</span>
                             </div>
                             <div className="text-right">
                                <div className="text-2xl font-black text-brand-black">{flight.arrival}</div>
                                <div className="text-sm font-black text-brand-black/60 uppercase">{flight.to}</div>
                             </div>
                          </div>
                       )}
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* 2. PASSENGER DETAILS CARD */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               <div className="bg-black/[0.02] px-6 py-4 border-b border-black/5 flex justify-between items-center">
                  <button 
                     onClick={() => setPassengerCollapsed(!passengerCollapsed)}
                     className="flex items-center gap-3 focus:outline-none"
                  >
                     <div className="w-2.5 h-6 rounded-full bg-[#E61E2A]" />
                     <h3 className="text-xs font-black text-brand-black uppercase tracking-widest text-left">Traveller Details</h3>
                     <span className="text-[10px] font-bold text-brand-black/30 lowercase">({passengerCollapsed ? 'tap to expand' : 'tap to collapse'})</span>
                  </button>
                  <button 
                     onClick={() => handleEdit('travellers')}
                     className="flex items-center gap-1.5 text-[10px] font-black text-[#008CFF] uppercase tracking-wider hover:underline"
                  >
                     <Edit3 size={12} /> Edit
                  </button>
               </div>

               <AnimatePresence initial={false}>
                 {!passengerCollapsed && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-6 space-y-4 overflow-hidden"
                    >
                       {/* Breakdown summary bar */}
                       <div className="bg-[#F0F2F5] px-4 py-2.5 rounded-xl border border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-brand-black/60">
                          <span>Total Passengers: {travellers.length}</span>
                          <span className="flex gap-3">
                             {adults > 0 && <span>{adults} Adult{adults > 1 ? 's' : ''}</span>}
                             {children > 0 && <span>{children} Child{children > 1 ? 'ren' : ''}</span>}
                             {infants > 0 && <span>{infants} Infant{infants > 1 ? 's' : ''}</span>}
                          </span>
                       </div>

                       <div className="space-y-3 pt-2">
                          {travellers.map((traveller, idx) => (
                             <div key={idx} className="bg-white border border-black/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 bg-brand-red/5 rounded-xl flex items-center justify-center text-brand-red">
                                      <User size={16} />
                                   </div>
                                   <div>
                                      <div className="text-sm font-black text-brand-black">{traveller.title} {traveller.firstName} {traveller.lastName}</div>
                                      <div className="text-[9px] font-bold text-brand-black/30 uppercase tracking-widest mt-0.5">
                                         {traveller.type} • {traveller.gender} {traveller.dob && `• DOB: ${traveller.dob}`}
                                      </div>
                                   </div>
                                </div>

                                {/* Nationality & Passport Columns for International route */}
                                <div className="flex flex-col md:items-end justify-center text-left md:text-right">
                                   {isInternational ? (
                                      <div className="space-y-1">
                                         <div className="text-[10px] font-black text-brand-red uppercase tracking-wider flex items-center md:justify-end gap-1">
                                            <ShieldCheck size={12} /> Passport Required
                                         </div>
                                         <div className="text-[11px] font-bold text-brand-black/60">
                                            No: <span className="font-black text-brand-black">{traveller.passportNumber || 'N/A'}</span>
                                         </div>
                                         {traveller.passportExpiry && (
                                            <div className="text-[9px] font-bold text-brand-black/40">
                                               Expiry: {traveller.passportExpiry}
                                            </div>
                                         )}
                                      </div>
                                   ) : (
                                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                         No Passport Required (Domestic)
                                      </span>
                                   )}
                                </div>
                             </div>
                          ))}
                       </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* 3. PASSENGER ADD-ONS (SEATS, MEALS & BAGGAGE) */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               <div className="bg-black/[0.02] px-6 py-4 border-b border-black/5 flex justify-between items-center">
                  <button 
                     onClick={() => setAddonsCollapsed(!addonsCollapsed)}
                     className="flex items-center gap-3 focus:outline-none"
                  >
                     <div className="w-2.5 h-6 rounded-full bg-[#E61E2A]" />
                     <h3 className="text-xs font-black text-brand-black uppercase tracking-widest text-left">Seats, Meals & Extra Baggage</h3>
                     <span className="text-[10px] font-bold text-brand-black/30 lowercase">({addonsCollapsed ? 'tap to expand' : 'tap to collapse'})</span>
                  </button>
                  <button 
                     onClick={() => handleEdit('addons')}
                     className="flex items-center gap-1.5 text-[10px] font-black text-[#008CFF] uppercase tracking-wider hover:underline"
                  >
                     <Edit3 size={12} /> Edit
                  </button>
               </div>

               <AnimatePresence initial={false}>
                 {!addonsCollapsed && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-6 space-y-6 overflow-hidden"
                    >
                       {/* Standard baggage info banner */}
                       <div className="flex gap-4 p-4 bg-[#E7F3FF]/30 border border-[#B3D9FF]/30 rounded-2xl">
                          <div className="flex-1">
                             <span className="text-[8px] font-black text-[#008CFF] uppercase tracking-widest block mb-0.5">Standard Cabin</span>
                             <span className="text-xs font-black text-brand-black">{flight.cabinBaggage || '7 Kgs'}</span>
                          </div>
                          <div className="w-px bg-[#B3D9FF]/30" />
                          <div className="flex-1">
                             <span className="text-[8px] font-black text-[#008CFF] uppercase tracking-widest block mb-0.5">Standard Check-In</span>
                             <span className="text-xs font-black text-brand-black">{flight.checkInBaggage || '15 Kgs'}</span>
                          </div>
                       </div>

                       <div className="space-y-4">
                          {travellers.map((t, idx) => {
                             const seat = selectedSeats.find(s => s.paxIdx === idx);
                             const meal = selectedMeals.find(m => m.paxIdx === idx);
                             const bag = selectedBaggage.find(b => b.paxIdx === idx);

                             return (
                               <div key={idx} className="bg-black/[0.02] border border-black/5 rounded-2xl p-5 relative">
                                  <div className="flex items-center gap-3 mb-4">
                                     <div className="w-7 h-7 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center font-bold text-xs">
                                        {idx + 1}
                                     </div>
                                     <div className="font-bold text-brand-black text-sm">{t.firstName} {t.lastName}</div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                     {/* Seat */}
                                     <div className="bg-white p-3 rounded-xl border border-black/5">
                                        <div className="flex items-center gap-1.5 mb-2">
                                           <Armchair size={12} className="text-brand-black/40" />
                                           <div className="text-[9px] font-black text-brand-black/40 uppercase tracking-widest">Seat</div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                           <div className="font-black text-brand-black text-sm">{seat ? seat.code : 'Free/Auto'}</div>
                                           {seat && seat.price > 0 && <div className="text-[10px] font-black text-brand-red">₹{formatPrice(seat.price)}</div>}
                                        </div>
                                     </div>

                                     {/* Meal */}
                                     <div className="bg-white p-3 rounded-xl border border-black/5">
                                        <div className="flex items-center gap-1.5 mb-2">
                                           <Coffee size={12} className="text-brand-black/40" />
                                           <div className="text-[9px] font-black text-brand-black/40 uppercase tracking-widest">Meal</div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                           <div className="font-bold text-brand-black text-[11px] truncate">{meal ? meal.name : 'Standard'}</div>
                                           {meal && meal.price > 0 && <div className="text-[10px] font-black text-brand-red">₹{formatPrice(meal.price)}</div>}
                                        </div>
                                     </div>

                                     {/* Baggage */}
                                     <div className="bg-white p-3 rounded-xl border border-black/5">
                                        <div className="flex items-center gap-1.5 mb-2">
                                           <Luggage size={12} className="text-brand-black/40" />
                                           <div className="text-[9px] font-black text-brand-black/40 uppercase tracking-widest">Extra Baggage</div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                           <div className="font-bold text-brand-black text-[11px]">{bag ? `+ ${bag.weight}` : 'None'}</div>
                                           {bag && bag.price > 0 && <div className="text-[10px] font-black text-brand-red">₹{formatPrice(bag.price)}</div>}
                                        </div>
                                     </div>
                                  </div>
                               </div>
                             );
                          })}
                       </div>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* 6. CONTACT & BILLING CARD */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-6 md:p-8 space-y-6">
               <h3 className="text-sm font-black text-brand-black uppercase tracking-widest flex items-center gap-2">
                  <Mail size={16} className="text-brand-red" /> Contact & Billing Information
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                     <span className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest block mb-1">Email Address</span>
                     <span className="text-sm font-black text-brand-black">{travellers[0]?.email || 'customer@flyanytrip.com'}</span>
                  </div>
                  <div>
                     <span className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest block mb-1">Mobile Number</span>
                     <span className="text-sm font-black text-brand-black">+91 {travellers[0]?.phone || '98765 43210'}</span>
                  </div>
                  <div>
                     <span className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest block mb-1">Billing State / Country</span>
                     <span className="text-sm font-black text-brand-black">{selectedState || 'Gujarat'}, India</span>
                  </div>
               </div>

               {/* GST invoice details if active */}
               {showGST && gstData.companyName && (
                  <div className="mt-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 flex items-center gap-3">
                     <ShieldCheck size={18} className="text-blue-600" />
                     <div className="text-[11px] font-bold text-blue-900">
                        GST Invoice to: <span className="font-black text-brand-black">{gstData.companyName}</span> (Reg No: <span className="font-black text-brand-black">{gstData.registrationNo}</span>)
                     </div>
                  </div>
               )}
            </div>

            {/* CANCELLATION & FARE POLICY CARD */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/5 p-6 md:p-8 space-y-6">
               <h3 className="text-sm font-black text-brand-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-red" /> Cancellation & Refund Rules
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50/20 border border-green-100 rounded-2xl">
                     <span className="text-[9px] font-black text-green-700 uppercase tracking-widest block mb-1">Cancellation Policy</span>
                     <p className="text-[11px] font-bold text-green-900/70 leading-relaxed">
                        Cancellation request submitted 24+ hours before departure: Refundable with airline penalty of ₹3,500. Changes inside 24 hours of departure are strictly non-refundable.
                     </p>
                  </div>
                  <div className="p-4 bg-amber-50/20 border border-amber-100 rounded-2xl">
                     <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest block mb-1">Date-Change Policy</span>
                     <p className="text-[11px] font-bold text-amber-900/70 leading-relaxed">
                        Changes requested 24+ hours before flight: Permissible with date-change fees of ₹2,500 plus any applicable fare difference.
                     </p>
                  </div>
               </div>

               {/* IMPORTANT WARNING WARNING MSG */}
               <div className="bg-amber-100/50 rounded-2xl p-4 border border-amber-200 flex gap-3">
                  <AlertIcon size={20} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs font-black text-amber-900 leading-relaxed">
                     “Please verify all passenger and travel details carefully before proceeding with payment. Changes after ticket issuance may incur additional charges.”
                  </div>
               </div>
            </div>

          </div>

          {/* RIGHT STICKY FARE SIDEBAR CARD */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky top-24">
             <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-2xl">
                <h3 className="text-xl font-black text-brand-black mb-8 tracking-tight">Fare Breakdown</h3>

                <div className="space-y-4 mb-8 pb-8 border-b border-black/5 font-bold text-brand-black/60 text-xs">
                   <div className="flex justify-between">
                      <span>Base Fare ({travellers.length} Pax)</span>
                      <span className="text-brand-black font-black">₹{formatPrice(baseFare)}</span>
                   </div>
                   
                   <div className="flex justify-between">
                      <span>Taxes & Surcharges</span>
                      <span className="text-brand-black font-black">₹{formatPrice(tax)}</span>
                   </div>

                   {totalSeatCost > 0 && (
                      <div className="flex justify-between">
                         <span>Seat Selection charges</span>
                         <span className="text-brand-black font-black">₹{formatPrice(totalSeatCost)}</span>
                      </div>
                   )}

                   {totalBaggageCost > 0 && (
                      <div className="flex justify-between">
                         <span>Extra Baggage charges</span>
                         <span className="text-brand-black font-black">₹{formatPrice(totalBaggageCost)}</span>
                      </div>
                   )}

                   {totalMealsCost > 0 && (
                      <div className="flex justify-between">
                         <span>Meal Add-ons charges</span>
                         <span className="text-brand-black font-black">₹{formatPrice(totalMealsCost)}</span>
                      </div>
                   )}

                   <div className="flex justify-between">
                      <span>Convenience Fee</span>
                      <span className="text-brand-black font-black">₹{formatPrice(convenienceFee)}</span>
                   </div>

                   {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                         <span>Coupon discount</span>
                         <span className="font-black">- ₹{formatPrice(couponDiscount)}</span>
                      </div>
                   )}
                </div>

                {/* Total amount section prominently highlighted */}
                <div className="mb-10 flex justify-between items-end bg-[#F0F2F5] p-4 rounded-2xl border border-black/5 shadow-inner">
                   <div>
                      <span className="text-[9px] font-black text-brand-black/40 uppercase tracking-widest mb-0.5 block">Grand Total Payable</span>
                      <div className="text-3xl font-black text-brand-black tracking-tighter">₹{formatPrice(grandTotal)}</div>
                   </div>
                   <span className="text-[9px] font-black text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1 uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0">
                      <ShieldCheck size={10} /> Secure Pay
                   </span>
                </div>

                {/* Proceed button */}
                <button 
                  onClick={proceedToPayment}
                  className="w-full bg-brand-red text-white py-4 rounded-xl font-black text-base uppercase tracking-widest shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                   Proceed to Payment <ArrowRight size={18} />
                </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PreConfirmationPage;

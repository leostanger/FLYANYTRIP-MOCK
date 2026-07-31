import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Calendar, Users, Moon, ChevronLeft, Star,
  User, CreditCard, Shield, Loader2, AlertCircle, Check, MapPin
} from 'lucide-react';
import api from '../services/api';
import { toINR } from '../utils/currency';

const boardLabels = { BB: 'Bed & Breakfast', RO: 'Room Only', HB: 'Half Board', FB: 'Full Board', AI: 'All Inclusive' };

/**
 * Reusable form field — defined OUTSIDE the component to avoid losing focus.
 * If this were inside HotelCheckout, every keystroke would re-create Field as a
 * new component type, causing React to unmount/remount the <input> (focus lost).
 */
const Field = ({ label, field, placeholder, type = 'text', half, value, error, onChange }) => (
  <div className={half ? 'flex-1 min-w-[160px]' : 'w-full'}>
    <label className="block text-xs font-bold text-black/50 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className={`w-full border rounded-xl py-3 px-4 text-sm font-semibold text-brand-black placeholder:font-normal placeholder:text-black/30 focus:outline-none transition-all ${error ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-black/10 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 bg-white'}`}
    />
    {error && (
      <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
        <AlertCircle size={10} />{error}
      </p>
    )}
  </div>
);

const HotelCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { rateResponse, rateKey, hotelSnapshot, apiCurrency: passedCurrency, inrTotal: passedINR } = location.state || {};

  if (!rateKey || !hotelSnapshot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-bold text-brand-black">No booking data found.</p>
        <button onClick={() => navigate('/hotels')} className="text-brand-red font-bold hover:underline text-sm">
          Search Hotels
        </button>
      </div>
    );
  }

  // Determine INR price — use pre-converted value if passed, else convert now
  // NOTE: rawNet / totalPriceINR is the TOTAL stay price (all nights), NOT per-night
  const bookingCurrency = passedCurrency || hotelSnapshot?.apiCurrency || 'INR';
  const rawNet = parseFloat(rateResponse?.totalNet || rateResponse?.rooms?.[0]?.rates?.[0]?.net || 0);
  const totalPriceINR = passedINR || toINR(rawNet, bookingCurrency);

  console.log('[Hotel Pricing Debug — Checkout]', {
    step: '3. HotelCheckout price calculation',
    passedINR,
    rawNet,
    bookingCurrency,
    note: 'totalPriceINR = TOTAL stay price (all nights)',
    totalPriceINR,
    nightCount: hotelSnapshot?.nightCount,
    perNight: Math.ceil(totalPriceINR / (hotelSnapshot?.nightCount || 1)),
  });

  const [form, setForm] = useState({
    holderName: '', holderSurname: '', holderEmail: '', holderPhone: '',
    guestName: '', guestSurname: '', guestAge: '30',
  });
  const [formErrors, setFormErrors] = useState({});
  const [validating, setValidating] = useState(false);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.holderName.trim()) errors.holderName = 'First name is required';
    if (!form.holderSurname.trim()) errors.holderSurname = 'Last name is required';
    if (!form.holderEmail.trim() || !/\S+@\S+\.\S+/.test(form.holderEmail)) errors.holderEmail = 'Valid email is required';
    if (!form.guestName.trim()) errors.guestName = 'Guest name is required';
    if (!form.guestSurname.trim()) errors.guestSurname = 'Guest surname is required';
    return errors;
  };

  const handleProceedToPayment = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setValidating(true);
    // Navigate to payment page with all required data
    navigate('/hotel-payment', {
      state: {
        rateKey,
        rateResponse,
        hotelSnapshot,
        bookingCurrency,
        totalPriceINR,
        holder: {
          name: form.holderName,
          surname: form.holderSurname,
          email: form.holderEmail,
          phone: form.holderPhone,
        },
        guestPax: {
          name: form.guestName,
          surname: form.guestSurname,
          age: parseInt(form.guestAge) || 30,
        },
      },
    });
    setValidating(false);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-black/50 hover:text-brand-red transition-colors mb-1">
            <ChevronLeft size={16} />Back to Room Selection
          </button>
          <h1 className="font-black text-xl text-brand-black">Guest Details</h1>
          <p className="text-xs text-black/40 mt-0.5">Fill in details to proceed to payment</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Forms ── */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <h2 className="font-black text-brand-black text-lg mb-5 flex items-center gap-2">
                <CreditCard size={18} className="text-brand-red" />
                Booking Contact Details
                <span className="text-xs font-normal text-black/40 ml-1">(confirmation sent here)</span>
              </h2>
              <div className="flex flex-wrap gap-4">
                <Field label="First Name" field="holderName" placeholder="e.g. Rahul" half value={form.holderName} error={formErrors.holderName} onChange={updateForm} />
                <Field label="Last Name" field="holderSurname" placeholder="e.g. Sharma" half value={form.holderSurname} error={formErrors.holderSurname} onChange={updateForm} />
                <Field label="Email Address" field="holderEmail" placeholder="email@example.com" type="email" value={form.holderEmail} error={formErrors.holderEmail} onChange={updateForm} />
                <Field label="Phone Number (optional)" field="holderPhone" placeholder="+91 9876543210" type="tel" value={form.holderPhone} error={formErrors.holderPhone} onChange={updateForm} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <h2 className="font-black text-brand-black text-lg mb-5 flex items-center gap-2">
                <User size={18} className="text-brand-red" /> Primary Guest (Room 1)
              </h2>
              <div className="flex flex-wrap gap-4">
                <Field label="Guest First Name" field="guestName" placeholder="e.g. Rahul" half value={form.guestName} error={formErrors.guestName} onChange={updateForm} />
                <Field label="Guest Last Name" field="guestSurname" placeholder="e.g. Sharma" half value={form.guestSurname} error={formErrors.guestSurname} onChange={updateForm} />
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-bold text-black/50 uppercase tracking-wider mb-1.5">Age</label>
                  <input
                    type="number" min="18" max="100" value={form.guestAge}
                    onChange={(e) => updateForm('guestAge', e.target.value)}
                    className="w-full border border-black/10 rounded-xl py-3 px-4 text-sm font-semibold text-brand-black focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 transition-all bg-white"
                  />
                </div>
              </div>
            </motion.div>

            {rateResponse?.rooms?.[0]?.rates?.[0]?.rateComments && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                  <AlertCircle size={14} />Important Hotel Information
                </h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {rateResponse.rooms[0].rates[0].rateComments.substring(0, 300)}
                  {rateResponse.rooms[0].rates[0].rateComments.length > 300 ? '...' : ''}
                </p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handleProceedToPayment}
              disabled={validating}
              className="w-full bg-brand-red text-white py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-3 shadow-lg shadow-brand-red/25"
            >
              {validating ? <><Loader2 size={20} className="animate-spin" />Validating...</> : <><Check size={20} />Continue to Payment · ₹{Math.ceil(totalPriceINR).toLocaleString('en-IN')}</>}
            </motion.button>
            <p className="text-xs text-center text-black/40 font-medium">
              <Shield size={10} className="inline mr-1" />
              Secure payment on next step via Razorpay
            </p>
          </div>

          {/* ── Right: Price Summary ── */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-black/5">
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-brand-red" />
                </div>
                <div>
                  <h3 className="font-black text-brand-black text-sm leading-tight">{hotelSnapshot.hotelName}</h3>
                  {hotelSnapshot.starRating && (
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(parseInt(hotelSnapshot.starRating) || 0)].map((_, i) => (
                        <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                  {hotelSnapshot.address && (
                    <p className="text-xs text-black/40 mt-1 flex items-center gap-1">
                      <MapPin size={10} />{hotelSnapshot.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                {[
                  ['Check In', formatDate(hotelSnapshot.checkIn)],
                  ['Check Out', formatDate(hotelSnapshot.checkOut)],
                  ['Duration', `${hotelSnapshot.nightCount} night${hotelSnapshot.nightCount > 1 ? 's' : ''}`],
                  ['Guests', `${hotelSnapshot.adults} adult${hotelSnapshot.adults > 1 ? 's' : ''}`],
                  ['Room Type', hotelSnapshot.roomName],
                  ['Meal Plan', boardLabels[hotelSnapshot.boardCode] || hotelSnapshot.boardName || 'Room Only'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-black/50">{k}</span>
                    <span className="font-semibold text-brand-black text-right max-w-[140px]">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
              <h3 className="font-black text-brand-black mb-4">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">Rate per night</span>
                  <span className="font-semibold">₹{Math.ceil(totalPriceINR / (hotelSnapshot.nightCount || 1)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">{hotelSnapshot.nightCount} night{hotelSnapshot.nightCount > 1 ? 's' : ''} × {hotelSnapshot.rooms} room{hotelSnapshot.rooms > 1 ? 's' : ''}</span>
                  <span className="font-semibold">₹{Math.ceil(totalPriceINR).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-black/30">
                  <span>Taxes & fees</span><span>Included</span>
                </div>
                <div className="border-t border-black/5 pt-3 mt-2 flex justify-between items-center">
                  <span className="font-black text-brand-black">Total (INR)</span>
                  <span className="font-black text-2xl text-brand-red">₹{Math.ceil(totalPriceINR).toLocaleString('en-IN')}</span>
                </div>
                {bookingCurrency !== 'INR' && (
                  <p className="text-xs text-black/30 text-center">Converted from {bookingCurrency} to INR</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCheckout;

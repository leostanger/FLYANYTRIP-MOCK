import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, Wallet, ShieldCheck, CheckCircle2, Loader2,
  ArrowLeft, Building2, AlertCircle, Star, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const HotelPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    rateKey, rateResponse, hotelSnapshot,
    bookingCurrency, totalPriceINR,
    holder, guestPax,
  } = location.state || {};

  const [method, setMethod] = useState('razorpay');
  const [demoStatus, setDemoStatus] = useState('success');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!rateKey || !hotelSnapshot || !holder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-black/5">
          <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-black text-brand-black mb-2">Payment Session Expired</h2>
          <p className="text-sm text-black/50 mb-4">Please start your hotel booking again.</p>
          <button onClick={() => navigate('/hotels')} className="text-brand-red font-bold underline text-sm">
            Search Hotels
          </button>
        </div>
      </div>
    );
  }

  const amountINR = Math.ceil(totalPriceINR || 0);

  console.log('[Hotel Pricing Debug — Payment]', {
    step: '4. HotelPayment final amount',
    totalPriceINR,
    amountINR,
    note: 'amountINR = TOTAL stay price (all nights) sent to Razorpay',
    nightCount: hotelSnapshot?.nightCount,
    perNight: Math.ceil(amountINR / (hotelSnapshot?.nightCount || 1)),
    rooms: hotelSnapshot?.rooms,
    adults: hotelSnapshot?.adults,
  });

  // ── Confirm booking with Adivaha after payment ──
  const confirmHotelBooking = async (paymentData) => {
    const payload = {
      holder: {
        name: holder.name,
        surname: holder.surname,
        email: holder.email,
        phone: holder.phone,
      },
      rooms: [{
        rateKey,
        paxes: [{
          roomId: 1,
          type: 'AD',
          age: guestPax?.age || 30,
          name: guestPax?.name || holder.name,
          surname: guestPax?.surname || holder.surname,
        }],
      }],
      isTolerance: 'Yes',
      chargablePrice: amountINR,
      currency: 'INR',
      hotelSnapshot: { ...hotelSnapshot, totalNet: amountINR },
      paymentData,
    };

    const res = await api.post('/api/hotels/book', payload);
    return res.data;
  };

  // ── Load Razorpay SDK ──
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // ── Demo Flow ──
      if (method === 'demo') {
        if (demoStatus === 'failure') {
          navigate('/hotel-booking-failed', {
            state: { error: 'Demo transaction failed. Use Razorpay or choose Success flow.' },
          });
          return;
        }

        // Demo success: call book API with mock payment
        const bookResult = await confirmHotelBooking({ method: 'demo', status: 'success', mockPayment: true });

        if (bookResult.success) {
          navigate('/hotel-booking-success', {
            state: {
              bookingData: bookResult,
              hotelSnapshot,
              holderName: `${holder.name} ${holder.surname}`,
              holderEmail: holder.email,
              holderPhone: holder.phone,
              totalPriceINR: amountINR,
            },
          });
        } else {
          setErrorMsg('Booking failed: ' + (bookResult.message || 'Unknown error'));
        }
        return;
      }

      // ── Razorpay Flow ──
      const loaded = await loadRazorpay();
      if (!loaded) {
        setErrorMsg('Failed to load Razorpay. Check your internet connection.');
        return;
      }

      // 1. Create Razorpay order (amount in INR)
      const [orderRes, configRes] = await Promise.all([
        api.post('/api/payment/create-order', { amount: amountINR, currency: 'INR' }),
        api.get('/api/payment/config').catch(() => ({ data: { data: { keyId: 'rzp_test_RH0I6LBnmc0Ziz' } } })),
      ]);

      if (!orderRes.data.success) {
        setErrorMsg('Could not initiate payment. Please try again.');
        return;
      }

      const orderData = orderRes.data.data;
      const razorpayKey = configRes.data?.data?.keyId || 'rzp_test_RH0I6LBnmc0Ziz';

      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FlyAnyTrip Hotels',
        description: `${hotelSnapshot.hotelName} · ${hotelSnapshot.nightCount} night${hotelSnapshot.nightCount > 1 ? 's' : ''}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          setIsProcessing(true);
          try {
            // 3. Verify payment
            const verifyRes = await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data.success) {
              navigate('/hotel-booking-failed', { state: { error: 'Payment signature verification failed.' } });
              return;
            }

            // 4. Confirm booking
            const bookResult = await confirmHotelBooking({
              method: 'razorpay',
              status: 'success',
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });

            if (bookResult.success) {
              navigate('/hotel-booking-success', {
                state: {
                  bookingData: bookResult,
                  hotelSnapshot,
                  holderName: `${holder.name} ${holder.surname}`,
                  holderEmail: holder.email,
                  holderPhone: holder.phone,
                  totalPriceINR: amountINR,
                },
              });
            } else {
              navigate('/hotel-booking-failed', { state: { error: bookResult.message || 'Booking confirmation failed.' } });
            }
          } catch (err) {
            navigate('/hotel-booking-failed', { state: { error: err.response?.data?.message || err.message } });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${holder.name} ${holder.surname}`,
          email: holder.email || 'customer@flyanytrip.com',
          contact: holder.phone || '9999999999',
        },
        theme: { color: '#E63946' },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        navigate('/hotel-booking-failed', {
          state: { error: response.error?.description || 'Payment failed. Please try again.' },
        });
      });
      rzp.open();

    } catch (err) {
      console.error('Hotel payment error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      if (method !== 'razorpay') setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/[0.02] py-12">
      <div className="max-w-[1000px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-brand-black/60 hover:text-brand-black transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-brand-black tracking-tight">Secure Payment</h1>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">
              {hotelSnapshot.hotelName} · {hotelSnapshot.nightCount} night{hotelSnapshot.nightCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">{errorMsg}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left: Payment method ── */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-xl shadow-black/5">
              <h3 className="text-sm font-black text-brand-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={16} className="text-brand-red" /> Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { id: 'razorpay', icon: CreditCard, label: 'Razorpay (Test Mode)' },
                  { id: 'demo', icon: Wallet, label: 'Demo Simulator' },
                ].map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => setMethod(id)}
                    className={`py-4 flex flex-col items-center gap-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${method === id ? 'border-brand-red text-brand-red bg-brand-red/5' : 'border-black/5 text-brand-black/40 hover:border-black/20'}`}>
                    <Icon size={20} />{label}
                  </button>
                ))}
              </div>

              <div className="bg-black/[0.02] p-6 rounded-2xl border border-black/5 mb-6">
                {method === 'razorpay' && (
                  <div className="py-8 text-center">
                    <p className="text-[11px] font-black text-brand-black/60 uppercase tracking-widest mb-2">
                      Razorpay Sandbox Gateway
                    </p>
                    <p className="text-xs text-brand-black/40 max-w-md mx-auto mb-6">
                      Pay securely via Razorpay. Supports Cards, Net Banking, UPI, and Wallets in test mode.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-brand-red/5 text-brand-red text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider">
                      Sandbox Credentials Active
                    </div>
                  </div>
                )}

                {method === 'demo' && (
                  <div className="py-4 text-center">
                    <p className="text-[10px] font-black text-brand-black/50 uppercase tracking-widest mb-4">
                      Demo Payment Simulator
                    </p>
                    <div className="flex justify-center gap-4 max-w-sm mx-auto mb-4">
                      {['success', 'failure'].map((s) => (
                        <button key={s} onClick={() => setDemoStatus(s)}
                          className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all ${demoStatus === s
                            ? s === 'success' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25' : 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25'
                            : 'bg-white border-black/5 text-brand-black/40 hover:border-black/10'}`}>
                          {s === 'success' ? '✓ Success Flow' : '✗ Failure Flow'}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-brand-black/30 font-bold uppercase tracking-wider">
                      Simulates success or failure without real payment
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <ShieldCheck size={20} className="text-green-600" />
                <div className="text-[10px] font-bold text-green-700 leading-tight">
                  Your payment is secured with <span className="font-black">256-bit AES encryption</span>. We do not store your card details.
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Hotel Summary + Pay button ── */}
          <div className="w-full lg:w-[360px] shrink-0 sticky top-24">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-xl shadow-black/5">

              {/* Hotel card */}
              <div className="flex items-start gap-3 mb-5 pb-5 border-b border-black/5">
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-brand-red" />
                </div>
                <div>
                  <p className="font-black text-brand-black text-sm leading-tight">{hotelSnapshot.hotelName}</p>
                  {hotelSnapshot.starRating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(parseInt(hotelSnapshot.starRating) || 0)].map((_, i) => (
                        <Star key={i} size={9} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}
                  {hotelSnapshot.address && (
                    <p className="text-xs text-black/40 mt-0.5 flex items-center gap-1">
                      <MapPin size={9} />{hotelSnapshot.address}
                    </p>
                  )}
                  <p className="text-xs text-black/50 mt-1 font-medium">
                    {hotelSnapshot.nightCount} night{hotelSnapshot.nightCount > 1 ? 's' : ''} · {hotelSnapshot.adults} guest{hotelSnapshot.adults > 1 ? 's' : ''} · {hotelSnapshot.rooms} room{hotelSnapshot.rooms > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 mb-6 pb-6 border-b border-black/5 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/50">Room rate</span>
                  <span className="font-semibold">₹{Math.ceil(amountINR / (hotelSnapshot.nightCount || 1)).toLocaleString('en-IN')}/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/50">{hotelSnapshot.nightCount} night{hotelSnapshot.nightCount > 1 ? 's' : ''}</span>
                  <span className="font-semibold">₹{amountINR.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-black/30">
                  <span>Taxes & fees</span><span>Included</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Total Amount</div>
                <div className="text-4xl font-black text-brand-black tracking-tight">
                  ₹{amountINR.toLocaleString('en-IN')}
                </div>
                {bookingCurrency !== 'INR' && (
                  <p className="text-xs text-black/30 mt-1">Converted from {bookingCurrency}</p>
                )}
              </div>

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-brand-red text-white h-16 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-brand-red/20 flex items-center justify-center gap-3 disabled:bg-brand-red/50 disabled:active:scale-100"
              >
                {isProcessing
                  ? <><Loader2 size={20} className="animate-spin" />Processing...</>
                  : <><CheckCircle2 size={20} />Pay ₹{amountINR.toLocaleString('en-IN')}</>
                }
              </button>

              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="flex items-center gap-4 opacity-30 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" className="h-4" alt="UPI" />
                </div>
                <p className="text-[9px] text-brand-black/30 font-bold text-center">
                  By clicking Pay, you agree to our booking terms & cancellation policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPayment;

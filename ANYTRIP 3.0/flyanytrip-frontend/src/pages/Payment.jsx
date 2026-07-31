import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Building, ShieldCheck, CheckCircle2, Loader2, ArrowLeft, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    flight, grandTotal, travellers, ssrTotal = 0, selectedSeats = [], selectedMeals = [], selectedBaggage = [],
    baseFare = 0, tax = 0, convenienceFee = 0, couponDiscount = 0
  } = location.state || {};

  const ssrSeatTotal = selectedSeats.reduce((acc, s) => acc + (s?.price || 0), 0);
  const ssrMealTotal = selectedMeals.reduce((acc, m) => acc + (m?.price || 0), 0);
  const ssrBagTotal = selectedBaggage.reduce((acc, b) => acc + (b?.price || 0), 0);

  const [method, setMethod] = useState('razorpay');
  const [demoStatus, setDemoStatus] = useState('success');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-black/5">
          <h2 className="text-2xl font-black text-brand-black mb-4">Payment Session Expired</h2>
          <button onClick={() => navigate('/')} className="text-brand-red font-bold underline uppercase tracking-widest text-xs">Go back home</button>
        </div>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      if (method === 'demo') {
        if (demoStatus === 'failure') {
          // Redirect to booking failed immediately as requested
          navigate('/booking-failed', {
            state: { error: "Demo transaction failed by choice. Try again or choose a successful flow." }
          });
          return;
        }

        // Success path for simulator
        const bookingRes = await api.post('/api/booking/confirm', {
          isLCC: flight.raw?.IsLCC || flight.isLCC,
          traceId: flight.traceId,
          resultIndex: flight.resultIndex,
          passengers: travellers.map(t => {
            const pax = {
              Title: t.title || 'Mr',
              FirstName: t.firstName,
              LastName: t.lastName,
              PaxType: t.type === 'adult' ? 1 : (t.type === 'child' ? 2 : 3),
              Gender: t.gender === 'Male' ? 1 : 2,
              DateOfBirth: t.dob || (t.type === 'adult' ? "1990-01-01" : (t.type === 'child' ? "2015-01-01" : "2025-01-01"))
            };
            if (t.passportNumber) pax.PassportNo = t.passportNumber;
            if (t.passportExpiry) pax.PassportExpiry = t.passportExpiry;
            return pax;
          }),
          contactDetails: { Email: travellers[0].email, ContactNo: travellers[0].phone },
          paymentData: { method: 'demo_simulator', status: 'success', mockPayment: true },
          flightSnapshot: flight,
          totalAmount: grandTotal,
          ssrSelections: { seats: selectedSeats, meals: selectedMeals, baggage: selectedBaggage },
        });

        if (bookingRes.data.success) {
          const dbBooking = bookingRes.data.data.booking;
          const mockBookingForUI = {
            bookingId: dbBooking.booking_id,
            pnr: bookingRes.data.data.flightBooking?.pnr || bookingRes.data.data.pnr || 'PENDING',
            status: dbBooking.status,
            totalAmount: bookingRes.data.data.totalAmount || grandTotal,
            passengers: travellers.map(t => ({
              Title: t.title, FirstName: t.firstName, LastName: t.lastName,
              email: travellers[0].email, phone: travellers[0].phone
            }))
          };

          const finalData = { 
            booking: mockBookingForUI, 
            flight: flight,
            pricingDetails: { baseFare, tax, ssrTotal, ssrSeatTotal, ssrMealTotal, ssrBagTotal, convenienceFee, couponDiscount, grandTotal }
          };
          sessionStorage.setItem('lastBooking', JSON.stringify(finalData));

          const shortId = btoa(dbBooking.booking_id).substring(0, 12);
          navigate(`/booking-success?id=${shortId}`);
        } else {
          alert("Booking failed: " + bookingRes.data.message);
        }
      } else {
        // Razorpay Payment Flow
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Failed to load Razorpay SDK. Check your internet connection.");
          return;
        }

        // 1. Create order and fetch configuration from server
        const [orderRes, configRes] = await Promise.all([
          api.post('/api/payment/create-order', {
            amount: grandTotal,
            currency: 'INR'
          }),
          api.get('/api/payment/config').catch(err => {
            console.warn("Could not fetch config from server, falling back to client defaults:", err);
            return { data: { data: { keyId: "rzp_test_RH0I6LBnmc0Ziz" } } };
          })
        ]);

        if (!orderRes.data.success) {
          alert("Failed to initiate transaction with Razorpay. Try again.");
          return;
        }

        const orderData = orderRes.data.data;
        const razorpayKey = configRes.data?.data?.keyId || "rzp_test_RH0I6LBnmc0Ziz";

        // 2. Open Razorpay checkout
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "FlyAnyTrip",
          description: "Secure Flight Booking Payment",
          order_id: orderData.orderId,
          handler: async function (response) {
            setIsProcessing(true);
            try {
              // 3. Verify Payment
              const verifyRes = await api.post('/api/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.data.success) {
                // 4. Confirm Booking
                const bookingRes = await api.post('/api/booking/confirm', {
                  isLCC: flight.raw?.IsLCC || flight.isLCC,
                  traceId: flight.traceId,
                  resultIndex: flight.resultIndex,
                  passengers: travellers.map(t => {
                    const pax = {
                      Title: t.title || 'Mr',
                      FirstName: t.firstName,
                      LastName: t.lastName,
                      PaxType: t.type === 'adult' ? 1 : (t.type === 'child' ? 2 : 3),
                      Gender: t.gender === 'Male' ? 1 : 2,
                      DateOfBirth: t.dob || (t.type === 'adult' ? "1990-01-01" : (t.type === 'child' ? "2015-01-01" : "2025-01-01"))
                    };
                    if (t.passportNumber) pax.PassportNo = t.passportNumber;
                    if (t.passportExpiry) pax.PassportExpiry = t.passportExpiry;
                    return pax;
                  }),
                  contactDetails: { Email: travellers[0].email, ContactNo: travellers[0].phone },
                  paymentData: {
                    method: 'razorpay',
                    status: 'success',
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id
                  },
                  flightSnapshot: flight,
                  totalAmount: grandTotal,
                  ssrSelections: { seats: selectedSeats, meals: selectedMeals, baggage: selectedBaggage },
                });

                if (bookingRes.data.success) {
                  const dbBooking = bookingRes.data.data.booking;
                  const mockBookingForUI = {
                    bookingId: dbBooking.booking_id,
                    pnr: bookingRes.data.data.flightBooking?.pnr || bookingRes.data.data.pnr || 'PENDING',
                    status: dbBooking.status,
                    totalAmount: bookingRes.data.data.totalAmount || grandTotal,
                    passengers: travellers.map(t => ({
                      Title: t.title, FirstName: t.firstName, LastName: t.lastName,
                      email: travellers[0].email, phone: travellers[0].phone
                    }))
                  };

                  const finalData = { 
                    booking: mockBookingForUI, 
                    flight: flight,
                    pricingDetails: { baseFare, tax, ssrTotal, ssrSeatTotal, ssrMealTotal, ssrBagTotal, convenienceFee, couponDiscount, grandTotal }
                  };
                  sessionStorage.setItem('lastBooking', JSON.stringify(finalData));

                  const shortId = btoa(dbBooking.booking_id).substring(0, 12);
                  navigate(`/booking-success?id=${shortId}`);
                } else {
                  navigate('/booking-failed', { state: { error: bookingRes.data.message || 'Booking confirmation failed' } });
                }
              } else {
                navigate('/booking-failed', { state: { error: 'Razorpay signature verification failed' } });
              }
            } catch (err) {
              console.error("Razorpay verification/booking error:", err);
              navigate('/booking-failed', { state: { error: err.response?.data?.message || err.message } });
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${travellers[0]?.firstName || ''} ${travellers[0]?.lastName || ''}`,
            email: travellers[0]?.email || 'customer@flyanytrip.com',
            contact: travellers[0]?.phone || '9999999999'
          },
          theme: {
            color: "#FF3366"
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          navigate('/booking-failed', { state: { error: response.error?.description || 'Razorpay payment failed' } });
        });
        rzp.open();
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error confirming booking: " + (error.response?.data?.message || error.message));
    } finally {
      if (method !== 'razorpay') {
        setIsProcessing(false);
      }
    }
  };

  const formatPrice = (p) => Math.ceil(p || 0).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-black/[0.02] py-12">
      <div className="max-w-[1000px] mx-auto px-6">

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center text-brand-black/60 hover:text-brand-black transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-brand-black tracking-tight">Secure Payment</h1>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Complete your booking for {flight.from} → {flight.to}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-xl shadow-black/5">
              <h3 className="text-sm font-black text-brand-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={16} className="text-brand-red" /> Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setMethod('razorpay')}
                  className={`py-4 flex flex-col items-center gap-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${method === 'razorpay' ? 'border-brand-red text-brand-red bg-brand-red/5' : 'border-black/5 text-brand-black/40 hover:border-black/20'}`}
                >
                  <CreditCard size={20} /> Razorpay (Test Mode)
                </button>
                <button
                  onClick={() => setMethod('demo')}
                  className={`py-4 flex flex-col items-center gap-2 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${method === 'demo' ? 'border-brand-red text-brand-red bg-brand-red/5' : 'border-black/5 text-brand-black/40 hover:border-black/20'}`}
                >
                  <Wallet size={20} /> Demo Simulator
                </button>
              </div>

              <div className="bg-black/[0.02] p-6 rounded-2xl border border-black/5 mb-6">
                {method === 'razorpay' && (
                  <div className="py-8 text-center">
                    <p className="text-[11px] font-black text-brand-black/60 uppercase tracking-widest mb-2">Razorpay Sandbox Gateway</p>
                    <p className="text-xs text-brand-black/40 max-w-md mx-auto mb-6">
                      Pay securely using Razorpay. Supports Cards, Net Banking, UPI/VPA, and popular Mobile Wallets in test environment.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-brand-red/5 text-brand-red text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider">
                      Active Sandbox Credentials Loaded
                    </div>
                  </div>
                )}

                {method === 'demo' && (
                  <div className="py-4 text-center">
                    <p className="text-[10px] font-black text-brand-black/50 uppercase tracking-widest mb-4">Demo Payment Simulator Status</p>
                    <div className="flex justify-center gap-4 max-w-sm mx-auto mb-4">
                      <button
                        onClick={() => setDemoStatus('success')}
                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all ${demoStatus === 'success' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/25' : 'bg-white border-black/5 text-brand-black/40 hover:border-black/10'}`}
                      >
                        Success Flow
                      </button>
                      <button
                        onClick={() => setDemoStatus('failure')}
                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all ${demoStatus === 'failure' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25' : 'bg-white border-black/5 text-brand-black/40 hover:border-black/10'}`}
                      >
                        Failure Flow
                      </button>
                    </div>
                    <p className="text-[9px] text-brand-black/30 font-bold uppercase tracking-wider">
                      Based on selection, the application will redirect to the corresponding success/failure page.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <ShieldCheck size={20} className="text-green-600" />
                <div className="text-[10px] font-bold text-green-700 leading-tight">
                  Your payment is secured with <span className="font-black">256-bit AES encryption</span>. We do not store your full card details.
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-xl shadow-black/5">
              <h3 className="text-sm font-black text-brand-black uppercase tracking-widest mb-6">Fare Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-black/5">
                <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                  <span>Base Fare ({travellers?.length || 1} Pax)</span>
                  <span className="text-brand-black font-black">₹{formatPrice(grandTotal - ssrTotal)}</span>
                </div>
                {ssrTotal > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                    <span>Add-ons (Seats/Meals)</span>
                    <span className="text-brand-black font-black">₹{formatPrice(ssrTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                  <span>Convenience Fee</span>
                  <span className="text-green-600 font-black">FREE</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Total Amount</div>
                <div className="text-4xl font-black text-brand-black tracking-tight">₹{formatPrice(grandTotal)}</div>
              </div>

              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-brand-red text-white h-16 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-brand-red/20 flex items-center justify-center gap-3 disabled:bg-brand-red/50 disabled:active:scale-100"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Pay ₹{formatPrice(grandTotal)}
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 opacity-30 grayscale">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo.png/1200px-UPI-Logo.png" className="h-4" alt="UPI" />
                </div>
                <p className="text-[9px] text-brand-black/30 font-bold text-center">By clicking pay, you agree to our booking policies & conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

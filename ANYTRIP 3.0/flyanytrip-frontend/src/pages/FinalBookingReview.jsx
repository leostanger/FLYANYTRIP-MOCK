import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, User, CheckCircle2, ShieldCheck, ArrowRight, Info, 
  ChevronDown, Ticket, AlertCircle, Loader2, CreditCard,
  Phone, Mail, MapPin, Calendar, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { SoldOutModal } from '../features/flights/FlightModals';

const FinalBookingReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, travellers, ssrSelections } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const [fareQuote, setFareQuote] = useState(null);
  const [soldOutModal, setSoldOutModal] = useState(false);

  useEffect(() => {
    if (!flight || !travellers) {
      navigate('/');
      return;
    }
  }, [flight, travellers, navigate]);

  if (!flight || !travellers) return null;

  const formatPrice = (p) => Math.ceil(p || 0).toLocaleString('en-IN');

  const initialFare = fareQuote?.Fare || flight.raw?.Fare || {};
  const baseFare = initialFare.BaseFare || 0;
  const tax = (initialFare.Tax || 0) + (initialFare.OtherCharges || 0);
  const ssrTotal = (ssrSelections?.seats?.reduce((acc, s) => acc + (s.price || 0), 0) || 0) +
                   (ssrSelections?.meals?.reduce((acc, m) => acc + (m.price || 0), 0) || 0) +
                   (ssrSelections?.baggage?.reduce((acc, b) => acc + (b.price || 0), 0) || 0);
  
  const convenienceFee = 350; // Standard convenience fee
  const grandTotal = baseFare + tax + ssrTotal + convenienceFee - couponDiscount;

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;

    try {
      const res = await api.post('/api/coupons/validate', {
        code: couponCode,
        amount: baseFare + tax + ssrTotal + convenienceFee
      });

      if (res.data.success) {
        setCouponDiscount(res.data.data.discount);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setCouponDiscount(0);
    }
  };

  const handleProceedToPayment = async () => {
    if (!agreed) {
      alert('Please agree to the Terms and Conditions');
      return;
    }

    setRevalidating(true);
    try {
      // Step 1: Final Fare Revalidation
      const quoteRes = await api.post('/api/booking/revalidate', {
        traceId: flight.traceId,
        resultIndex: flight.resultIndex,
        tokenId: flight.tokenId
      });

      if (quoteRes.data.success) {
        const responseData = quoteRes.data.data?.responseData || quoteRes.data.data;
        const status = responseData?.Response?.ResponseStatus;
        
        if (status === 3) {
          setSoldOutModal(true);
          setRevalidating(false);
          return;
        }

        const newFareObj = responseData?.Response?.Results?.Fare;
        const newFare = Math.ceil(newFareObj?.OfferedFare || newFareObj?.PublishedFare || 0);
        
        // Update local fare quote but proceed to payment directly
        setFareQuote(responseData?.Response?.Results);

        // Step 2: Create Payment Order
        const orderRes = await api.post('/api/payment/create-order', {
          amount: grandTotal,
          receipt: `rcpt_${Date.now()}`
        });

        if (orderRes.data.success) {
          const order = orderRes.data.data;
          initiateRazorpay(order);
        }
      }
    } catch (err) {
      console.error("Revalidation/Payment Error:", err);
      alert('Something went wrong. Please try again.');
    } finally {
      setRevalidating(false);
    }
  };

  const initiateRazorpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: order.amount,
      currency: order.currency,
      name: 'FlyAnyTrip',
      description: 'Flight Booking Payment',
      order_id: order.orderId,
      handler: async (response) => {
        setLoading(true);
        try {
          // Step 3: Verify Payment and Confirm Booking
          const verifyRes = await api.post('/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.data.success) {
            // Step 4: Trigger Final Booking API
            const bookingRes = await api.post('/api/booking/confirm', {
              isLCC: flight.raw?.IsLCC,
              traceId: flight.traceId,
              resultIndex: flight.resultIndex,
              passengers: travellers.map(t => ({
                Title: t.title || 'Mr',
                FirstName: t.firstName,
                LastName: t.lastName,
                PaxType: t.type === 'child' ? 2 : (t.type === 'infant' ? 3 : 1),
                DateOfBirth: t.dob,
                Gender: t.gender === 'Male' ? 1 : 2,
                PassportNo: t.passportNo,
                PassportExpiry: t.passportExpiry
              })),
              ssrSelections: ssrSelections, // Added missing ssrSelections
              contactDetails: {
                Email: travellers[0].email,
                ContactNo: travellers[0].phone // Changed from Phone to ContactNo to match backend expectation
              },
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              flightSnapshot: flight,
              totalAmount: grandTotal
            });

            if (bookingRes.data.success) {
              navigate('/booking-success', { state: { booking: bookingRes.data.data, flight } });
            } else {
              navigate('/booking-failed', { state: { error: bookingRes.data.message } });
            }
          }
        } catch (err) {
          console.error("Payment Verification Error:", err);
          navigate('/booking-failed');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: `${travellers[0].firstName} ${travellers[0].lastName}`,
        email: travellers[0].email,
        contact: travellers[0].phone
      },
      theme: {
        color: '#E52D2D'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Stepper (Simplified) */}
        <div className="flex items-center justify-center mb-12">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                 <span className="text-xs font-bold text-brand-black/40 uppercase">Review</span>
              </div>
              <div className="w-12 h-[2px] bg-green-500" />
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                 <span className="text-xs font-bold text-brand-black/40 uppercase">Traveller</span>
              </div>
              <div className="w-12 h-[2px] bg-green-500" />
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-brand-red/30">3</div>
                 <span className="text-xs font-bold text-brand-black uppercase">Final Review</span>
              </div>
           </div>
        </div>

        <h1 className="text-3xl font-black text-brand-black mb-8 tracking-tight">Review & Pay</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            
            {/* 1. Flight Summary */}
            <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
               <div className="bg-black/[0.02] px-8 py-4 border-b border-black/5 flex justify-between items-center">
                  <h3 className="text-sm font-black text-brand-black uppercase tracking-widest flex items-center gap-2">
                    <Plane size={16} className="text-brand-red" /> Flight Summary
                  </h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Refundable</span>
               </div>
               <div className="p-8">
                  <div className="flex items-center gap-6 mb-8">
                     <div className="w-16 h-16 bg-black/[0.03] rounded-2xl flex items-center justify-center font-black text-brand-red text-xl">
                        {flight.airlineCode}
                     </div>
                     <div>
                        <div className="text-xl font-bold text-brand-black">{flight.airline}</div>
                        <div className="text-sm font-bold text-brand-black/40">{flight.flight} • {flight.class}</div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center">
                     <div>
                        <div className="text-3xl font-black text-brand-black">{flight.time}</div>
                        <div className="text-sm font-bold text-brand-black/60">{flight.from}</div>
                     </div>
                     <div className="flex flex-col items-center flex-1 px-12">
                        <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">{flight.dur}</div>
                        <div className="w-full h-[2px] bg-black/5 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-red" />
                        </div>
                        <div className="text-[10px] font-black text-brand-red uppercase tracking-widest mt-1">{flight.layover || 'Non-Stop'}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-3xl font-black text-brand-black">{flight.arrival}</div>
                        <div className="text-sm font-bold text-brand-black/60">{flight.to}</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Traveller Summary */}
            <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
               <div className="bg-black/[0.02] px-8 py-4 border-b border-black/5 flex justify-between items-center">
                  <h3 className="text-sm font-black text-brand-black uppercase tracking-widest flex items-center gap-2">
                    <User size={16} className="text-brand-red" /> Traveller Details
                  </h3>
                  <button onClick={() => navigate(-1)} className="text-[10px] font-black text-brand-red uppercase underline">Edit</button>
               </div>
               <div className="p-8 space-y-6">
                  {travellers.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-6 border-b border-black/5 last:border-0 last:pb-0">
                       <div className="w-10 h-10 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                       </div>
                       <div>
                          <div className="text-lg font-bold text-brand-black">{t.title} {t.firstName} {t.lastName}</div>
                          <div className="text-sm font-semibold text-brand-black/40 uppercase tracking-wider">
                            {t.type} • {t.gender} • DOB: {t.dob}
                          </div>
                          {t.passportNo && (
                            <div className="text-xs font-bold text-brand-black/60 mt-1">Passport: {t.passportNo} (Exp: {t.passportExpiry})</div>
                          )}
                       </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 flex flex-wrap gap-6 text-sm">
                     <div className="flex items-center gap-2">
                        <Mail size={16} className="text-brand-black/40" />
                        <span className="font-bold text-brand-black/60">{travellers[0].email}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Phone size={16} className="text-brand-black/40" />
                        <span className="font-bold text-brand-black/60">{travellers[0].phone}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. Passenger-wise Add-ons Summary */}
            {ssrSelections && (
              <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm">
                 <div className="bg-black/[0.02] px-8 py-4 border-b border-black/5 flex justify-between items-center">
                    <h3 className="text-sm font-black text-brand-black uppercase tracking-widest">Seats & Meals Assignments</h3>
                 </div>
                 <div className="p-8 space-y-6">
                    {travellers.map((t, idx) => {
                      const seat = ssrSelections.seats?.[idx];
                      const meal = ssrSelections.meals?.[idx];
                      
                      return (
                        <div key={idx} className="bg-black/[0.02] border border-black/5 rounded-2xl p-6 relative">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center font-bold text-xs">
                                 {idx + 1}
                              </div>
                              <div className="font-bold text-brand-black">{t.firstName} {t.lastName}</div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Seat Assignment */}
                              <div className="bg-white p-4 rounded-xl border border-black/5 flex justify-between items-center">
                                 <div>
                                    <div className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1">Seat</div>
                                    <div className="font-bold text-brand-black">
                                      {seat ? seat.code : 'Not Assigned'}
                                    </div>
                                    {seat && <div className="text-xs text-brand-black/60 mt-1">₹{seat.price}</div>}
                                 </div>
                                 <button 
                                   onClick={() => navigate('/seat-selection', { state: { flight, fareQuote, travellers, ssrSelections } })}
                                   className="text-xs font-bold text-brand-red uppercase underline"
                                 >
                                   Edit
                                 </button>
                              </div>

                              {/* Meal Assignment */}
                              <div className="bg-white p-4 rounded-xl border border-black/5 flex justify-between items-center">
                                 <div>
                                    <div className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1">Meal</div>
                                    <div className="font-bold text-brand-black">
                                      {meal ? meal.name : 'Not Assigned'}
                                    </div>
                                    {meal && <div className="text-xs text-brand-black/60 mt-1">₹{meal.price || meal.Price}</div>}
                                 </div>
                                 <button 
                                   onClick={() => navigate('/addons', { state: { flight, fareQuote, travellers, ssrSelections } })}
                                   className="text-xs font-bold text-brand-red uppercase underline"
                                 >
                                   Edit
                                 </button>
                              </div>
                           </div>
                        </div>
                      );
                    })}

                    {/* Baggage Summary */}
                    {ssrSelections.baggage?.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-black/5">
                        <div className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-3">Excess Baggage</div>
                        <div className="space-y-2">
                           {ssrSelections.baggage.map((b, i) => (
                             <div key={i} className="flex justify-between items-center text-sm font-bold">
                                <span className="text-brand-black/60">Extra Weight: {b.weight}</span>
                                <span className="text-brand-black">₹{b.price}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* 4. Coupon Section */}
            <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
               <h3 className="text-sm font-black text-brand-black uppercase tracking-widest mb-6">Apply Coupon</h3>
               <div className="flex gap-4">
                  <div className="flex-1 relative">
                     <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30" size={20} />
                     <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter Promo Code" 
                        className="w-full bg-black/[0.02] border border-black/10 rounded-2xl py-4 pl-12 pr-4 font-black uppercase tracking-widest focus:outline-none focus:border-brand-red focus:bg-white transition-all"
                     />
                  </div>
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-8 bg-brand-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-red transition-all"
                  >
                    Apply
                  </button>
               </div>
               {couponError && <div className="text-brand-red text-xs font-bold mt-2 ml-2">{couponError}</div>}
               {couponDiscount > 0 && <div className="text-green-600 text-xs font-bold mt-2 ml-2">Coupon applied successfully! You saved ₹{couponDiscount}</div>}
            </div>

            {/* 5. Terms & Conditions */}
            <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
               <div className="flex items-start gap-4">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-black/20 text-brand-red focus:ring-brand-red cursor-pointer" 
                  />
                  <div className="text-sm font-bold text-brand-black/60 leading-relaxed">
                     By proceeding, I agree to FlyAnyTrip's <span className="text-brand-red underline cursor-pointer">User Agreement</span>, 
                     <span className="text-brand-red underline cursor-pointer">Terms of Service</span> and 
                     <span className="text-brand-red underline cursor-pointer">Cancellation & Refund Policy</span>. 
                     I also confirm that the traveller details provided are correct and match my passport.
                  </div>
               </div>
            </div>

          </div>

          {/* Right Column (Sticky Fare Sidebar) */}
          <div className="lg:w-[400px]">
             <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-2xl sticky top-24">
                <h3 className="text-xl font-black text-brand-black mb-8">Fare Breakup</h3>
                
                <div className="space-y-4 mb-8 pb-8 border-b border-black/5 font-bold">
                   <div className="flex justify-between text-brand-black/60">
                      <span>Base Fare ({travellers.length} Traveller)</span>
                      <span className="text-brand-black font-black">₹{formatPrice(baseFare)}</span>
                   </div>
                   <div className="flex justify-between text-brand-black/60">
                      <span>Taxes & Surcharges</span>
                      <span className="text-brand-black font-black">₹{formatPrice(tax)}</span>
                   </div>
                   {ssrTotal > 0 && (
                     <div className="flex justify-between text-brand-black/60">
                        <span>SSR Charges (Seats/Meals)</span>
                        <span className="text-brand-black font-black">₹{formatPrice(ssrTotal)}</span>
                     </div>
                   )}
                   <div className="flex justify-between text-brand-black/60">
                      <span>Convenience Fee</span>
                      <span className="text-brand-black font-black">₹{formatPrice(convenienceFee)}</span>
                   </div>
                   {couponDiscount > 0 && (
                     <div className="flex justify-between text-green-600">
                        <span>Promo Discount</span>
                        <span className="font-black">- ₹{formatPrice(couponDiscount)}</span>
                     </div>
                   )}
                </div>

                <div className="flex justify-between items-end mb-10">
                   <div>
                      <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Grand Total</div>
                      <div className="text-4xl font-black text-brand-black tracking-tighter">₹{formatPrice(grandTotal)}</div>
                   </div>
                </div>

                <button 
                  onClick={handleProceedToPayment}
                  disabled={revalidating || loading}
                  className="w-full bg-brand-red text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {revalidating ? (
                    <> <Loader2 className="animate-spin" size={24} /> Validating... </>
                  ) : loading ? (
                    <> <Loader2 className="animate-spin" size={24} /> Processing... </>
                  ) : (
                    <> Proceed to Payment <ArrowRight size={20} /> </>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-xs font-black text-brand-black/30 uppercase tracking-widest">
                   <ShieldCheck size={16} className="text-green-500" /> Secure SSL Encryption
                </div>
             </div>
          </div>

        </div>

      </div>


      <SoldOutModal 
        isOpen={soldOutModal} 
        onClose={() => {
          setSoldOutModal(false);
          navigate('/results');
        }} 
      />

      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center"
          >
             <div className="w-24 h-24 mb-8">
                <div className="w-full h-full border-8 border-brand-red/10 border-t-brand-red rounded-full animate-spin" />
             </div>
             <h2 className="text-2xl font-black text-brand-black mb-2">Finalizing Your Booking</h2>
             <p className="text-brand-black/40 font-bold uppercase tracking-widest text-sm">Please do not refresh the page...</p>
             
             <div className="mt-12 space-y-4 w-64">
                <div className="flex items-center gap-3 text-sm font-bold text-green-600">
                   <CheckCircle2 size={18} /> Payment Verified
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-brand-black">
                   <Loader2 size={18} className="animate-spin" /> Generating E-Ticket...
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FinalBookingReview;

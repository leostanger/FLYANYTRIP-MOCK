import React, { useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Home, Share2, Plane, MapPin, Calendar, Clock, User, ShieldCheck, Printer, Mail, Phone, Luggage, MapPinned } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse data from SessionStorage to fix 431 error
  const bookingData = useMemo(() => {
    const saved = sessionStorage.getItem('lastBooking');
    if (saved) {
       try {
          return JSON.parse(saved);
       } catch (e) {
          console.error("Failed to parse booking data from storage", e);
       }
    }
    return location.state;
  }, [location]);

  const { booking, flight, pricingDetails } = bookingData || {};

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!booking || !flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f9]">
        <div className="text-center p-12 bg-white rounded-[2rem] shadow-xl border border-black/5">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-brand-black mb-2">Booking Not Found</h2>
          <p className="text-sm font-bold text-brand-black/40 mb-8">Session might have expired. Please check your email for the ticket.</p>
          <button onClick={() => navigate('/')} className="px-8 h-12 bg-brand-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-red transition-all">Go to Home</button>
        </div>
      </div>
    );
  }

  const pnr = booking.pnr || "FL-PENDING";
  const segments = flight.segments || flight.raw?.Segments?.[0] || [];
  
  const formatDate = (dateStr) => {
     if (!dateStr) return '';
     return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
     if (!dateStr) return '';
     return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculateLayover = (arrTime, depTime) => {
    const diff = new Date(depTime) - new Date(arrTime);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  // Safe price formatting
  const getDisplayPrice = (p) => {
     if (!p) return '0';
     const num = typeof p === 'string' ? parseFloat(p.replace(/,/g, '')) : p;
     return isNaN(num) ? '0' : Math.ceil(num).toLocaleString('en-IN');
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/api/booking/invoice/${booking.bookingId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `FlyAnyTrip_Invoice_${pnr}.pdf`;
      link.click();
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download invoice PDF.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Success Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
           <div className="flex items-center gap-6">
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20"
              >
                <CheckCircle size={32} />
              </motion.div>
              <div>
                 <h1 className="text-2xl font-black text-brand-black tracking-tight mb-0.5">Booking Confirmed!</h1>
                 <p className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} className="text-green-600" /> Secure E-Ticket Generated Successfully
                 </p>
              </div>
           </div>
           {/* <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-brand-black/60 hover:bg-brand-black hover:text-white transition-all">
                 <Share2 size={18} />
              </button>
              <button onClick={() => window.print()} className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center text-brand-black/60 hover:bg-brand-black hover:text-white transition-all">
                 <Printer size={18} />
              </button>
           </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left Column: Itinerary */}
           <div className="lg:col-span-8 space-y-6">
              
              {/* PNR Card */}
              <div className="bg-brand-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                       <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">Airline PNR Number</div>
                       <div className="text-5xl font-black tracking-tighter text-brand-red leading-none">{pnr}</div>
                    </div>
                    <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                    <div>
                       <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">Booking ID</div>
                       <div className="text-xl font-black tracking-tight uppercase">{booking.bookingId}</div>
                    </div>
                 </div>
              </div>

              {/* Dynamic Flight Itinerary */}
              <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
                 <div className="p-6 bg-black/[0.02] border-b border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <MapPinned size={16} className="text-brand-red" />
                       <span className="text-[10px] font-black text-brand-black uppercase tracking-widest">Confirmed Itinerary</span>
                    </div>
                    <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest">
                       {segments.length > 1 ? `${segments.length - 1} Stop(s)` : 'Non-Stop'} Flight
                    </div>
                 </div>
                 
                 <div className="p-8 space-y-10">
                    {segments.map((segment, idx) => (
                       <React.Fragment key={idx}>
                          <div className="relative">
                             <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-32">
                                   <div className="flex items-center gap-3 mb-4">
                                      <div className="w-8 h-8 bg-white rounded-lg border border-black/5 p-1 flex items-center justify-center shadow-sm">
                                         <img 
                                           src={`https://pics.avs.io/60/60/${segment.Airline.AirlineCode}.png`} 
                                           alt={segment.Airline.AirlineName}
                                           className="h-full w-full object-contain"
                                           onError={(e) => { e.target.src = 'https://pics.avs.io/60/60/AI.png' }} // Fallback
                                         />
                                      </div>
                                      <span className="text-[10px] font-black text-brand-black">{segment.Airline.AirlineCode}-{segment.Airline.FlightNumber}</span>
                                   </div>
                                   <div className="text-[9px] font-bold text-brand-black/40 uppercase bg-black/5 px-2 py-1 rounded inline-block">
                                      {segment.Craft || 'Boeing 737'}
                                   </div>
                                </div>
                                
                                <div className="flex-1 flex justify-between items-start">
                                   <div className="flex-1">
                                      <div className="text-2xl font-black text-brand-black leading-none mb-1">{formatTime(segment.Origin.DepTime)}</div>
                                      <div className="text-xs font-black text-brand-black/60 uppercase">{segment.Origin.Airport.AirportCode}</div>
                                      <div className="text-[10px] font-medium text-brand-black/40 truncate max-w-[150px]">{segment.Origin.Airport.AirportName}</div>
                                      <div className="text-[9px] font-black text-brand-black/20 mt-1 uppercase">Terminal {segment.Origin.Airport.Terminal || '1'}</div>
                                   </div>
                                   
                                   <div className="flex-1 flex flex-col items-center px-4 pt-2">
                                      <div className="text-[9px] font-black text-brand-black/20 uppercase tracking-widest mb-2">
                                         {Math.floor(segment.Duration / 60)}h {segment.Duration % 60}m
                                      </div>
                                      <div className="w-full h-[2px] bg-black/5 relative flex items-center justify-center">
                                         <div className="absolute w-2 h-2 rounded-full bg-brand-red shadow-sm" />
                                      </div>
                                   </div>

                                   <div className="flex-1 text-right">
                                      <div className="text-2xl font-black text-brand-black leading-none mb-1">{formatTime(segment.Destination.ArrTime)}</div>
                                      <div className="text-xs font-black text-brand-black/60 uppercase">{segment.Destination.Airport.AirportCode}</div>
                                      <div className="text-[10px] font-medium text-brand-black/40 truncate max-w-[150px]">{segment.Destination.Airport.AirportName}</div>
                                      <div className="text-[9px] font-black text-brand-black/20 mt-1 uppercase">Terminal {segment.Destination.Airport.Terminal || '1'}</div>
                                   </div>
                                </div>
                             </div>

                             {/* Layover Info */}
                             {idx < segments.length - 1 && (
                                <div className="mt-10 py-3 bg-brand-red/[0.03] border-y border-brand-red/5 flex items-center justify-center gap-4">
                                   <div className="w-6 h-[1px] bg-brand-red/20" />
                                   <span className="text-[9px] font-black text-brand-red uppercase tracking-widest flex items-center gap-2">
                                      <Clock size={10} /> Layover {calculateLayover(segment.Destination.ArrTime, segments[idx+1].Origin.DepTime)} in {segment.Destination.Airport.CityName} ({segment.Destination.Airport.AirportCode})
                                   </span>
                                   <div className="w-6 h-[1px] bg-brand-red/20" />
                                </div>
                             )}
                          </div>
                       </React.Fragment>
                    ))}

                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-black/5">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/[0.03] rounded-xl flex items-center justify-center text-brand-black/40">
                             <Luggage size={18} />
                          </div>
                          <div>
                             <div className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest">Check-In</div>
                             <div className="text-[11px] font-black text-brand-black">{flight.checkInBaggage || '15 KGs'}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/[0.03] rounded-xl flex items-center justify-center text-brand-black/40">
                             <Calendar size={18} />
                          </div>
                          <div>
                             <div className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest">Journey Date</div>
                             <div className="text-[11px] font-black text-brand-black">{formatDate(segments[0]?.Origin.DepTime)}</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black/[0.03] rounded-xl flex items-center justify-center text-brand-black/40">
                             <Clock size={18} />
                          </div>
                          <div>
                             <div className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest">Cabin Class</div>
                             <div className="text-[11px] font-black text-brand-black">{flight.class || 'Economy'}</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Travellers Section */}
              <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
                 <div className="p-6 bg-black/[0.02] border-b border-black/5">
                    <span className="text-[10px] font-black text-brand-black uppercase tracking-widest">Confirmed Travellers</span>
                 </div>
                 <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {booking.passengers?.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-black/[0.02] rounded-2xl border border-black/5 hover:border-brand-red/20 transition-all group">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-red border border-black/5 shadow-sm group-hover:bg-brand-red group-hover:text-white transition-all">
                                   <User size={20} />
                                </div>
                                <div>
                                   <div className="text-sm font-black text-brand-black leading-tight">{p.Title} {p.FirstName} {p.LastName}</div>
                                   <div className="text-[9px] font-bold text-brand-black/30 uppercase tracking-widest mt-1">
                                      Adult • Confirmed {p.passportNumber && `• Passport: ${p.passportNumber}`}
                                   </div>
                                </div>
                             </div>
                             <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                                <CheckCircle size={14} />
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              {/* Cancellation & Refund Policy Card */}
              <div className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden mt-6">
                 <div className="p-6 bg-black/[0.02] border-b border-black/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-brand-black uppercase tracking-widest">Cancellation & Refund Policy</span>
                    <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full tracking-wider uppercase">Refundable Flight</span>
                 </div>
                 <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-brand-black/60 font-semibold leading-relaxed">
                       <ul className="list-disc pl-4 space-y-2">
                          <li><strong>Cancellation Penalty:</strong> Standard airline penalty starting from ₹3,000 applies per passenger depending on departure time.</li>
                          <li><strong>Refund Process:</strong> Once initiated, refunds are processed directly back to your FlyAnyTrip wallet or original payment source within 5-7 working days.</li>
                       </ul>
                       <ul className="list-disc pl-4 space-y-2">
                          <li><strong>Convenience Fee:</strong> Please note that any convenience fee paid at the time of booking is non-refundable.</li>
                          <li><strong>How to Cancel:</strong> You can manage this booking anytime via your user dashboard or by visiting the <strong>Manage Booking</strong> section using your PNR.</li>
                       </ul>
                    </div>

                    <div className="pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                       <div>
                          <h4 className="text-sm font-black text-brand-black mb-1">Need to cancel this booking?</h4>
                          <p className="text-[10px] font-medium text-brand-black/40">You can check refund eligibility and cancel the flight instantly.</p>
                       </div>
                       <button 
                          onClick={() => navigate('/manage-booking', { state: { searchPnr: pnr || booking?.bookingId || booking?.booking_id } })}
                          className="px-6 h-12 bg-red-50 text-brand-red border border-brand-red/10 hover:bg-brand-red hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all active:scale-95 shrink-0"
                       >
                          Cancel Booking Instantly
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Contact & Fare */}
           <div className="lg:col-span-4 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl shadow-black/5">
                 <h3 className="text-[10px] font-black text-brand-black uppercase tracking-widest mb-6">Booking Contacts</h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                          <Mail size={18} />
                       </div>
                       <div>
                          <div className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest mb-0.5">Email</div>
                          <div className="text-xs font-black text-brand-black truncate max-w-[180px]">{booking.passengers?.[0]?.email || 'customer@flyanytrip.com'}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                          <Phone size={18} />
                       </div>
                       <div>
                          <div className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest mb-0.5">Mobile</div>
                          <div className="text-xs font-black text-brand-black">+91 {booking.passengers?.[0]?.phone || '98765 43210'}</div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Fare Breakdown */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl shadow-black/5">
                 <h3 className="text-[10px] font-black text-brand-black uppercase tracking-widest mb-6">Payment Summary</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                       <span>Base Fare</span>
                       <span className="text-brand-black font-black">₹{getDisplayPrice(pricingDetails?.baseFare || Math.round((booking?.totalAmount || flight?.price || 0) * 0.7))}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                       <span>Taxes & Airline Fees</span>
                       <span className="text-brand-black font-black">₹{getDisplayPrice(pricingDetails?.tax || Math.round((booking?.totalAmount || flight?.price || 0) * 0.3))}</span>
                    </div>
                    {pricingDetails?.ssrMealTotal > 0 && (
                       <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                          <span>Meal Add-ons</span>
                          <span className="text-brand-black font-black">₹{getDisplayPrice(pricingDetails.ssrMealTotal)}</span>
                       </div>
                    )}
                    {pricingDetails?.ssrBagTotal > 0 && (
                       <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                          <span>Extra Baggage</span>
                          <span className="text-brand-black font-black">₹{getDisplayPrice(pricingDetails.ssrBagTotal)}</span>
                       </div>
                    )}
                    {pricingDetails?.ssrSeatTotal > 0 && (
                       <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                          <span>Seat Selection</span>
                          <span className="text-brand-black font-black">₹{getDisplayPrice(pricingDetails.ssrSeatTotal)}</span>
                       </div>
                    )}
                    {pricingDetails?.ssrTotal > 0 && !pricingDetails.ssrMealTotal && !pricingDetails.ssrBagTotal && !pricingDetails.ssrSeatTotal && (
                       <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                          <span>Add-ons</span>
                          <span className="text-brand-black font-black">₹{getDisplayPrice(pricingDetails.ssrTotal)}</span>
                       </div>
                    )}
                    <div className="flex justify-between items-center text-xs font-bold text-brand-black/60">
                       <span>Convenience Fee</span>
                       <span className="text-green-600 font-black">{pricingDetails?.convenienceFee > 0 ? `₹${getDisplayPrice(pricingDetails.convenienceFee)}` : 'FREE'}</span>
                    </div>
                    {pricingDetails?.couponDiscount > 0 && (
                       <div className="flex justify-between items-center text-xs font-bold text-green-600">
                          <span>Discounts</span>
                          <span className="font-black">- ₹{getDisplayPrice(pricingDetails.couponDiscount)}</span>
                       </div>
                    )}
                    <div className="pt-5 border-t border-black/5">
                       <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Grand Total</div>
                       <div className="text-4xl font-black text-brand-black tracking-tighter leading-none">₹{getDisplayPrice(booking?.totalAmount || pricingDetails?.grandTotal || flight?.price)}</div>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-green-600 bg-green-50 p-4 rounded-2xl mt-4 border border-green-100">
                       <ShieldCheck size={14} /> TRANSACTION SECURE & VERIFIED
                    </div>
                 </div>
              </div>

              {/* Sidebar Action */}
              <button onClick={handleDownloadInvoice} className="w-full h-16 bg-brand-black text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-brand-red active:scale-95 shadow-xl">
                 <Download size={20} /> Download Ticket PDF
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full h-14 bg-white text-brand-black border border-black/10 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-black/[0.02] active:scale-95"
              >
                 <Home size={18} /> Back to Search
              </button>

           </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center">
           <p className="text-[10px] font-bold text-brand-black/30 uppercase tracking-widest">
              Need Help? Contact our 24/7 Support at <span className="text-brand-red">support@flyanytrip.com</span>
           </p>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccess;

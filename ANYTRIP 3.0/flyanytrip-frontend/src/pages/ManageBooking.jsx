import React, { useState, useEffect } from 'react';
import { Search, Plane, Clock, User, CheckCircle, ChevronRight, FileText, PhoneCall, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ManageBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchType, setSearchType] = useState('search'); // 'search' or 'history'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);

  // Cancellation States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelCharges, setCancelCharges] = useState(null);
  const [cancelRemarks, setCancelRemarks] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  useEffect(() => {
    if (location.state?.searchPnr) {
      setQuery(location.state.searchPnr);
      const autoSearch = async () => {
        setLoading(true);
        setError('');
        setBooking(null);
        try {
          const res = await api.get(`/api/booking/details/${location.state.searchPnr}`);
          if (res.data.success) {
            setBooking(res.data.data);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Booking not found.');
        } finally {
          setLoading(false);
        }
      };
      autoSearch();
    }
  }, [location.state]);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setBooking(null);
    try {
      const res = await api.get(`/api/booking/details/${query}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found. Please check your PNR/ID.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCancellationCharges = async (bookingId) => {
    setCancelLoading(true);
    setCancelError('');
    setCancelCharges(null);
    try {
      const res = await api.post('/api/booking/cancel-charges', { bookingId });
      if (res.data.success) {
        setCancelCharges(res.data.data);
      
      } else {
        setCancelError(res.data.message || 'Failed to fetch cancellation charges.');
      }
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Error communicating with cancellation service.');
    } finally {
      setCancelLoading(false);
    }
  };

  const submitCancellation = async () => {
    if (!booking) return;
    setCancelLoading(true);
    setCancelError('');
    try {
      // Extract charges from the state (populated by fetchCancellationCharges step)
      const resObj = cancelCharges?.Response || cancelCharges || {};
      const cancellationCharge = Number(resObj.CancellationCharge ?? 0);
      const refundAmount = Number(resObj.RefundAmount ?? 0);

      const res = await api.post('/api/booking/cancel-request', {
        bookingId: booking.booking_id,
        remarks: cancelRemarks,
        cancellationCharge,
        refundAmount,
      });
      if (res.data.success) {
        setCancelSuccess(res.data.message || 'Cancellation request submitted successfully.');
      } else {
        setCancelError(res.data.message || 'Failed to submit cancellation request.');
      }
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Error processing cancellation.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-6">
      <div className="max-w-[900px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
           <h1 className="text-5xl font-black text-brand-black mb-4 tracking-tighter">Manage Your Trip</h1>
           <p className="text-brand-black/40 font-bold uppercase tracking-widest text-sm">View, modify, or download tickets for your bookings</p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-10">
           <div className="bg-black/[0.03] p-1.5 rounded-2xl flex gap-1">
              <button 
                onClick={() => setSearchType('search')}
                className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${searchType === 'search' ? 'bg-white text-brand-black shadow-md' : 'text-brand-black/40 hover:text-brand-black'}`}
              >
                Search Booking
              </button>
              <button 
                onClick={() => setSearchType('history')}
                className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${searchType === 'history' ? 'bg-white text-brand-black shadow-md' : 'text-brand-black/40 hover:text-brand-black'}`}
              >
                Recent History
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {searchType === 'search' ? (
            <motion.div 
              key="search-pane"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[40px] p-10 border border-black/5 shadow-2xl shadow-black/5"
            >
               <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-black/30" size={24} />
                     <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter Airline PNR or Booking ID" 
                        className="w-full bg-black/[0.02] border border-black/5 rounded-2xl py-5 pl-14 pr-6 font-black uppercase tracking-widest text-lg focus:outline-none focus:border-brand-red focus:bg-white transition-all placeholder:text-brand-black/20"
                     />
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-10 bg-brand-black text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-brand-red transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? <Clock className="animate-spin" /> : <Search size={20} />} Search
                  </button>
               </div>

               {error && (
                 <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                    <AlertCircle size={18} /> {error}
                 </div>
               )}

               {booking && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="mt-12 pt-12 border-t border-black/5"
                 >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                       <div>
                          <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Current Booking</div>
                          <h2 className="text-3xl font-black text-brand-black tracking-tight">{booking.pnr || booking.booking_id}</h2>
                       </div>
                       <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                           booking.status === 'CANCELLED' 
                              ? 'bg-red-50 text-red-600 border border-red-100' 
                              : booking.status === 'CANCEL_REQUESTED'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                              : 'bg-green-50 text-green-600 border border-green-100'
                        }`}>
                          <CheckCircle size={14} /> {booking.status || 'Confirmed'}
                       </div>
                    </div>

                    <div className="bg-black/[0.02] rounded-3xl p-8 mb-8 border border-black/5">
                       <div className="flex items-center gap-4 mb-6 text-brand-black/40">
                          <Plane size={20} />
                          <span className="text-sm font-black uppercase tracking-widest">{booking.flight_data?.airline} • {booking.flight_data?.flight}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex-1">
                             <div className="text-2xl font-black text-brand-black">{booking.flight_data?.time}</div>
                             <div className="text-sm font-bold text-brand-black/40">{booking.flight_data?.from}</div>
                          </div>
                          <div className="flex-1 flex flex-col items-center px-4">
                             <div className="text-[10px] font-black text-brand-black/20 uppercase mb-1">{booking.flight_data?.dur}</div>
                             <div className="w-full h-[2px] bg-black/5 relative" />
                          </div>
                          <div className="flex-1 text-right">
                             <div className="text-2xl font-black text-brand-black">{booking.flight_data?.arrival}</div>
                             <div className="text-sm font-bold text-brand-black/40">{booking.flight_data?.to}</div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <button 
                          onClick={() => window.open(`${api.defaults.baseURL || ''}/api/booking/invoice/${booking.booking_id}/download`)}
                          disabled={booking.status === 'CANCELLED'}
                          className="flex items-center justify-center gap-3 bg-brand-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red transition-all shadow-lg disabled:opacity-50 disabled:pointer-events-none"
                       >
                          <FileText size={16} /> Download Ticket
                       </button>

                       {booking.status !== 'CANCELLED' && booking.status !== 'CANCEL_REQUESTED' ? (
                          <button 
                             onClick={() => {
                                setShowCancelModal(true);
                                fetchCancellationCharges(booking.booking_id);
                             }}
                             className="flex items-center justify-center gap-3 bg-red-50 text-brand-red border border-brand-red/10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red hover:text-white transition-all shadow-sm"
                          >
                             <AlertCircle size={16} /> Cancel Booking
                          </button>
                       ) : (
                          <button 
                             disabled
                             className="flex items-center justify-center gap-3 bg-black/[0.03] text-brand-black/30 border border-black/5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed"
                          >
                             <AlertCircle size={16} /> {booking.status === 'CANCELLED' ? 'Cancelled' : 'Cancel Requested'}
                          </button>
                       )}

                       <button className="flex items-center justify-center gap-3 bg-white text-brand-black border border-black/10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black/[0.02] transition-all shadow-sm">
                          <PhoneCall size={16} /> Contact Support
                       </button>
                    </div>
                 </motion.div>
               )}
            </motion.div>
          ) : (
            <motion.div 
              key="history-pane"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
               {/* Mock History Item */}
               <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-xl transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-brand-red/5 text-brand-red rounded-2xl flex items-center justify-center shrink-0">
                     <Plane size={32} />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-black text-brand-red uppercase tracking-widest">BOM → DXB</span>
                        <span className="text-[10px] font-bold text-brand-black/30">• 24 OCT, 2024</span>
                     </div>
                     <h3 className="text-xl font-black text-brand-black">AI-102 • Air India</h3>
                     <div className="flex items-center gap-4 mt-2 text-xs font-bold text-brand-black/40">
                        <span className="flex items-center gap-1.5"><User size={14} /> 2 Travellers</span>
                        <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Confirmed</span>
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">PNR</div>
                     <div className="text-2xl font-black text-brand-black group-hover:text-brand-red transition-colors">XR7Q9L</div>
                  </div>
                  <ChevronRight className="text-brand-black/20 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
               </div>

               {/* Empty State Mock */}
               <div className="bg-white/40 border border-dashed border-black/10 rounded-3xl p-12 text-center">
                  <p className="text-sm font-bold text-brand-black/30 italic">No other recent bookings found</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <div className="mt-16 bg-brand-black rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
           <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-brand-red/10 rounded-full blur-3xl" />
           <div className="relative z-10">
              <h4 className="text-2xl font-black mb-2">Need help with your trip?</h4>
              <p className="text-white/60 font-medium">Our 24/7 customer support is here to help you with cancellations, date changes and more.</p>
           </div>
           <button className="relative z-10 px-8 py-4 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-black transition-all shadow-xl shadow-brand-red/20 active:scale-95">
              Chat with Us
           </button>
        </div>

      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              if (!cancelLoading) {
                setShowCancelModal(false);
                setCancelCharges(null);
                setCancelRemarks('');
                setCancelError('');
                setCancelSuccess('');
              }
            }}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[32px] p-8 w-full max-w-[500px] border border-black/5 shadow-2xl relative z-10 overflow-hidden text-left"
          >
             <h3 className="text-2xl font-black text-brand-black tracking-tight mb-2">Cancel Flight Booking</h3>
             <p className="text-sm font-semibold text-brand-black/40 mb-6">
                Are you sure you want to cancel this booking? Let's check the cancellation policy and charges.
             </p>

             {cancelLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                   <Clock className="animate-spin text-brand-red mb-4" size={36} />
                   <p className="text-sm font-black text-brand-black">Processing request...</p>
                   <p className="text-xs text-brand-black/40 mt-1">Contacting Adivaha API and Airline servers</p>
                </div>
             ) : (
                <div>
                   {cancelError && (
                      <div className="p-4 mb-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-xs">
                         <AlertCircle size={16} /> {cancelError}
                      </div>
                   )}

                   {cancelSuccess ? (
                      <div className="text-center py-6">
                         <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 font-black">
                            ✓
                         </div>
                         <h4 className="text-lg font-black text-brand-black mb-1">Request Submitted</h4>
                         <p className="text-xs text-brand-black/40 font-semibold mb-6">{cancelSuccess}</p>
                         <button 
                            onClick={() => {
                               setShowCancelModal(false);
                               setCancelCharges(null);
                               setCancelRemarks('');
                               setCancelError('');
                               setCancelSuccess('');
                               handleSearch(); // Refresh booking details
                            }}
                            className="w-full bg-brand-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red transition-all"
                         >
                            Close
                         </button>
                      </div>
                   ) : (
                      <>
                         {cancelCharges && (() => {
                             const resObj = cancelCharges.responseData?.Response || cancelCharges.Response || cancelCharges;
                             return (
                                <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-6 mb-6">
                                   <div className="flex justify-between items-center mb-3">
                                      <span className="text-xs font-bold text-brand-black/40">Status:</span>
                                      <span className="text-xs font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                         {resObj.Status || (resObj.ResponseStatus === 1 ? 'Allowed' : 'Pending')}
                                      </span>
                                    </div>
                                   <div className="flex justify-between items-center mb-3">
                                      <span className="text-xs font-bold text-brand-black/40">Cancellation Charge (Penalty):</span>
                                      <span className="text-sm font-black text-brand-black">
                                         ₹{Number(resObj.CancellationCharge ?? 0).toLocaleString('en-IN')}
                                      </span>
                                   </div>
                                   <div className="w-full h-[1px] bg-black/5 my-3" />
                                   <div className="flex justify-between items-center">
                                      <span className="text-xs font-bold text-brand-black/40">Estimated Refund Amount:</span>
                                      <span className="text-lg font-black text-brand-red">
                                         ₹{Number(resObj.RefundAmount ?? 0).toLocaleString('en-IN')}
                                      </span>
                                   </div>
                                </div>
                             );
                          })()}

                         <div className="mb-6">
                            <label className="block text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-2">
                               Reason for Cancellation
                            </label>
                            <textarea 
                               value={cancelRemarks}
                               onChange={(e) => setCancelRemarks(e.target.value)}
                               placeholder="e.g. Health issues, change of travel plans..."
                               className="w-full bg-black/[0.02] border border-black/5 rounded-xl p-4 font-bold text-sm focus:outline-none focus:border-brand-red focus:bg-white transition-all placeholder:text-brand-black/20"
                               rows={3}
                            />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <button 
                               onClick={() => {
                                  setShowCancelModal(false);
                                  setCancelCharges(null);
                                  setCancelRemarks('');
                                  setCancelError('');
                               }}
                               className="bg-white text-brand-black border border-black/10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-black/[0.02] transition-all"
                            >
                               Keep Booking
                            </button>
                            <button 
                               onClick={submitCancellation}
                               className="bg-brand-red text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-brand-black transition-all shadow-lg shadow-brand-red/10 flex items-center justify-center gap-2"
                            >
                               Confirm Cancel
                            </button>
                         </div>
                      </>
                   )}
                </div>
             )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageBooking;

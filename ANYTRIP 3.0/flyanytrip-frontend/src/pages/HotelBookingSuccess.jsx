import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Building2, Calendar, Users, Moon, MapPin,
  Copy, Check, Star, Tag, Home, Download, X, Loader2,
  AlertCircle, Phone, Mail, Shield, ChevronRight
} from 'lucide-react';
import api from '../services/api';

const boardLabels = {
  BB: 'Bed & Breakfast', RO: 'Room Only', HB: 'Half Board',
  FB: 'Full Board', AI: 'All Inclusive'
};

const HotelBookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingData, hotelSnapshot, holderName, holderEmail, holderPhone, totalPriceINR } = location.state || {};

  // Guard
  if (!bookingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-bold text-brand-black">No booking information found.</p>
        <button onClick={() => navigate('/hotels')} className="text-brand-red font-bold text-sm hover:underline">
          Search Hotels
        </button>
      </div>
    );
  }

  const bookingRef = bookingData?.bookingReference || bookingData?.adivahaData?.booking?.reference || '—';
  const orderId = bookingData?.orderId || bookingData?.adivahaData?.order_id || '—';
  const localBookingId = bookingData?.data?.booking?.booking_id || '';
  const bookingStatus = bookingData?.adivahaData?.booking?.status || 'CONFIRMED';

  const [copied, setCopied] = useState('');
  const [liveDetail, setLiveDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch live booking detail from Adivaha
  useEffect(() => {
    const fetchDetail = async () => {
      if (!bookingRef || bookingRef === '—') return;
      try {
        setLoadingDetail(true);
        const res = await api.post('/api/hotels/booking-detail', {
          bookingReference: bookingRef,
          orderId,
        });
        setLiveDetail(res.data?.data);
      } catch (err) {
        console.error('Could not fetch live booking detail:', err.message);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [bookingRef, orderId]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setCancelError('');
      await api.post('/api/hotels/cancel', {
        orderId,
        bookingReference: bookingRef,
        reason: 'others',
        bookingId: localBookingId,
      });
      setCancelled(true);
      setShowCancelConfirm(false);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Cancellation failed. Please contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!localBookingId) return;
    try {
      const res = await api.get(`/api/hotels/invoice/${localBookingId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Hotel_Invoice_${localBookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download Invoice Error:', err);
      alert('Failed to download invoice. Please try again later.');
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const hotel = liveDetail?.responseData?.booking?.hotel || bookingData?.adivahaData?.booking?.hotel;
  const liveStatus = liveDetail?.responseData?.booking?.status || bookingStatus;
  const hotelName = hotelSnapshot?.hotelName || hotel?.name || 'Hotel';
  const checkIn = hotelSnapshot?.checkIn || hotel?.checkIn || '';
  const checkOut = hotelSnapshot?.checkOut || hotel?.checkOut || '';
  const nightCount = hotelSnapshot?.nightCount || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* ── Success Header ── */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center mb-8"
        >
          {cancelled ? (
            <>
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <X size={36} className="text-orange-500" />
              </div>
              <h1 className="text-3xl font-black text-brand-black mb-2">Booking Cancelled</h1>
              <p className="text-black/50 font-medium">Your hotel booking has been cancelled successfully</p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200"
              >
                <CheckCircle2 size={44} className="text-green-600" />
              </motion.div>
              <h1 className="text-3xl font-black text-brand-black mb-2">Hotel Booking Confirmed!</h1>
              <p className="text-black/50 font-medium">
                Your reservation at <span className="font-bold text-brand-black">{hotelName}</span> is confirmed.
                {holderEmail && <> Confirmation sent to <span className="text-brand-red">{holderEmail}</span></>}
              </p>
            </>
          )}
        </motion.div>

        {/* ── Reference Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Booking Reference', value: bookingRef, key: 'ref', icon: Shield },
            { label: 'Order ID', value: orderId, key: 'order', icon: Tag },
          ].map(({ label, value, key, icon: Icon }) => (
            <motion.div key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: key === 'ref' ? 0.1 : 0.15 }}
              className="bg-white border border-black/5 rounded-2xl p-5 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                  <Icon size={18} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-xs text-black/40 font-bold uppercase tracking-wider">{label}</p>
                  <p className="font-black text-brand-black text-sm mt-0.5 font-mono">{value}</p>
                </div>
              </div>
              <button onClick={() => handleCopy(value, key)}
                className="p-2 rounded-xl hover:bg-black/5 transition-colors text-black/30 hover:text-brand-red">
                {copied === key ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </motion.div>
          ))}
        </div>

        {/* ── Status Badge ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className={`w-fit mx-auto mb-6 px-5 py-2 rounded-full text-sm font-black flex items-center gap-2 ${
            cancelled || liveStatus === 'CANCELLED' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
            liveStatus === 'CONFIRMED' ? 'bg-green-100 text-green-700 border border-green-200' :
            'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
          <div className={`w-2 h-2 rounded-full ${cancelled || liveStatus === 'CANCELLED' ? 'bg-orange-500' : liveStatus === 'CONFIRMED' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
          {cancelled || liveStatus === 'CANCELLED' ? 'Cancelled' : liveStatus || 'Confirmed'}
          {loadingDetail && <Loader2 size={12} className="animate-spin ml-1" />}
        </motion.div>

        {/* ── Booking Detail Card ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden mb-6">

          {/* Hotel header */}
          <div className="bg-gradient-to-r from-brand-black to-slate-800 text-white p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Building2 size={26} className="text-white" />
              </div>
              <div>
                <h2 className="font-black text-xl leading-tight">{hotelName}</h2>
                {hotelSnapshot?.starRating && (
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(parseInt(hotelSnapshot.starRating) || 0)].map((_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
                {hotelSnapshot?.address && (
                  <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
                    <MapPin size={12} />{hotelSnapshot.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking details grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
              {[
                { icon: Calendar, label: 'Check In', value: formatDate(checkIn) },
                { icon: Calendar, label: 'Check Out', value: formatDate(checkOut) },
                { icon: Moon, label: 'Duration', value: `${nightCount} night${nightCount > 1 ? 's' : ''}` },
                { icon: Users, label: 'Guests', value: `${hotelSnapshot?.adults || 1} adult${hotelSnapshot?.adults > 1 ? 's' : ''}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-brand-red/8 flex items-center justify-center mx-auto mb-2">
                    <Icon size={16} className="text-brand-red" />
                  </div>
                  <p className="text-xs text-black/40 font-bold uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-black text-brand-black text-sm">{value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Room Type', value: hotelSnapshot?.roomName || '—' },
                { label: 'Meal Plan', value: boardLabels[hotelSnapshot?.boardCode] || hotelSnapshot?.boardName || 'Room Only' },
                { label: 'Guest Name', value: holderName || '—' },
                { label: 'Total Paid', value: `₹${Math.ceil(totalPriceINR || 0).toLocaleString('en-IN')} INR` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-black/5 last:border-0">
                  <span className="text-sm text-black/40 font-medium">{label}</span>
                  <span className="text-sm font-bold text-brand-black text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Live Detail from Adivaha ── */}
        {liveDetail?.responseData?.booking && !cancelled && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
            <h3 className="font-black text-blue-800 text-sm mb-3 flex items-center gap-2">
              <Shield size={14} />Live Confirmation from Provider
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-blue-500 font-bold uppercase tracking-wider">Status</span>
                <p className="font-black text-blue-800 mt-0.5">{liveDetail.responseData.booking.status}</p>
              </div>
              <div>
                <span className="text-blue-500 font-bold uppercase tracking-wider">Created</span>
                <p className="font-black text-blue-800 mt-0.5">{formatDate(liveDetail.responseData.booking.creationDate)}</p>
              </div>
              {liveDetail.responseData.booking.modificationPolicies && (
                <>
                  <div>
                    <span className="text-blue-500 font-bold uppercase tracking-wider">Cancellation</span>
                    <p className="font-semibold text-blue-800 mt-0.5">
                      {liveDetail.responseData.booking.modificationPolicies.cancellation ? 'Allowed' : 'Not Allowed'}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-500 font-bold uppercase tracking-wider">Total Net</span>
                    <p className="font-black text-blue-800 mt-0.5">
                      ₹{parseFloat(liveDetail.responseData.booking.totalNet || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Cancel Error ── */}
        {cancelError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-semibold text-red-700">{cancelError}</p>
          </div>
        )}

        {/* ── Cancel Confirm Modal ── */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="font-black text-brand-black text-lg mb-2">Cancel Booking?</h3>
              <p className="text-sm text-black/50 mb-6">
                Are you sure you want to cancel booking <span className="font-bold text-brand-black">{bookingRef}</span>?
                This action may be subject to cancellation fees.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-black/10 font-bold text-sm text-brand-black hover:bg-black/5 transition-colors">
                  Keep Booking
                </button>
                <button onClick={handleCancel} disabled={cancelling}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {cancelling ? <><Loader2 size={14} className="animate-spin" />Cancelling...</> : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-brand-black text-white rounded-xl font-bold text-sm hover:bg-brand-red transition-colors shadow-sm">
            <Home size={16} />Back to Home
          </button>
          <button onClick={() => navigate('/hotels')}
            className="flex items-center gap-2 px-6 py-3 border border-black/10 text-brand-black rounded-xl font-bold text-sm hover:bg-black/5 transition-colors">
            <Building2 size={16} />Search More Hotels
          </button>
          {localBookingId && (
            <button onClick={handleDownloadInvoice}
              className="flex items-center gap-2 px-6 py-3 border border-brand-red text-brand-red rounded-xl font-bold text-sm hover:bg-brand-red/5 transition-colors">
              <Download size={16} />Download Invoice
            </button>
          )}
          {!cancelled && liveStatus === 'CONFIRMED' && (
            <button onClick={() => setShowCancelConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-500 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors">
              <X size={16} />Cancel Booking
            </button>
          )}
        </div>

        {/* ── Support info ── */}
        {!cancelled && (
          <div className="mt-8 text-center">
            <p className="text-xs text-black/30 font-medium">
              Need help? Contact us at{' '}
              <a href="mailto:bookings@flyanytrip.com" className="text-brand-red hover:underline font-semibold">
                bookings@flyanytrip.com
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBookingSuccess;

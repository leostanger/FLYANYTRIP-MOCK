import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Plane, Building2, Calendar, X, User,
  MapPin, Moon, Tag, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

const boardLabels = {
  BB: 'Bed & Breakfast', RO: 'Room Only', HB: 'Half Board',
  FB: 'Full Board', AI: 'All Inclusive'
};

const statusColor = (s) => {
  if (!s) return 'bg-gray-100 text-gray-600';
  const lower = s.toLowerCase();
  if (lower === 'confirmed') return 'bg-green-100 text-green-700';
  if (lower === 'cancelled') return 'bg-red-100 text-red-600';
  if (lower === 'pending') return 'bg-yellow-100 text-yellow-700';
  return 'bg-blue-100 text-blue-700';
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const MyBookings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Flight bookings — static sample + live placeholders
  const flightBookings = [
    {
      id: 'B123456', type: 'Flight',
      from: 'Mumbai (BOM)', to: 'Dubai (DXB)',
      date: '15 May 2026', status: 'Confirmed', amount: '₹24,500'
    },
    {
      id: 'B789012', type: 'Flight',
      from: 'London (LHR)', to: 'New York (JFK)',
      date: '20 June 2026', status: 'Upcoming', amount: '₹85,200'
    }
  ];

  // Hotel bookings from DB
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelError, setHotelError] = useState('');

  // Get userId from localStorage (simple auth approach used in this project)
  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

  const fetchHotelBookings = async () => {
    if (!userId) return;
    try {
      setLoadingHotels(true);
      setHotelError('');
      const { default: api } = await import('../services/api');
      const res = await api.get(`/api/hotels/my-bookings?userId=${userId}`);
      setHotelBookings(res.data?.data || []);
    } catch (err) {
      setHotelError('Could not load hotel bookings.');
    } finally {
      setLoadingHotels(false);
    }
  };

  useEffect(() => {
    fetchHotelBookings();
  }, [userId]);

  const tabs = [
    { id: 'all', label: 'All Bookings', count: flightBookings.length + hotelBookings.length },
    { id: 'flights', label: 'Flights', count: flightBookings.length, icon: Plane },
    { id: 'hotels', label: 'Hotels', count: hotelBookings.length, icon: Building2 },
  ];

  const visibleFlights = activeTab === 'all' || activeTab === 'flights' ? flightBookings : [];
  const visibleHotels = activeTab === 'all' || activeTab === 'hotels' ? hotelBookings : [];

  return (
    <DashboardLayout
      title="My Bookings"
      subtitle="View and manage your travel history"
      icon={CheckCircle2}
    >
      <div className="space-y-6">

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 bg-black/[0.03] p-1.5 rounded-2xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-brand-black shadow-sm'
                  : 'text-brand-black/40 hover:text-brand-black/70'
              }`}
            >
              {tab.icon && <tab.icon size={13} />}
              {tab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === tab.id ? 'bg-brand-red text-white' : 'bg-black/10 text-black/50'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}

          {/* Hotel refresh */}
          {(activeTab === 'hotels' || activeTab === 'all') && (
            <button onClick={fetchHotelBookings} disabled={loadingHotels}
              className="ml-1 p-2 rounded-xl text-black/30 hover:text-brand-red hover:bg-brand-red/5 transition-colors">
              <RefreshCw size={14} className={loadingHotels ? 'animate-spin' : ''} />
            </button>
          )}
        </div>

        {/* ── Flight Bookings ── */}
        {visibleFlights.map((booking) => (
          <motion.div key={booking.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-black/[0.02] border border-black/5 rounded-3xl p-6 hover:border-brand-red/20 transition-all duration-300 group">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-brand-red/5 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Plane size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                      ID: {booking.id}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${statusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-brand-black tracking-tight">
                    {booking.from} → {booking.to}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-brand-black/40 mb-1">
                    <Calendar size={13} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">{booking.date}</span>
                  </div>
                  <p className="text-lg font-black text-brand-black">{booking.amount}</p>
                </div>
                <button onClick={() => setSelectedBooking({ ...booking, kind: 'flight' })}
                  className="h-11 px-5 bg-white border border-black/10 hover:border-brand-red hover:text-brand-red rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ── Hotel Bookings ── */}
        {loadingHotels && (activeTab === 'hotels' || activeTab === 'all') && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <Loader2 size={20} className="text-brand-red animate-spin" />
            <p className="text-sm font-semibold text-black/50">Loading hotel bookings...</p>
          </div>
        )}
        {hotelError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="font-semibold text-red-700">{hotelError}</span>
          </div>
        )}

        {visibleHotels.map((booking) => {
          const status = booking.booking_status || booking.bookings?.status || 'CONFIRMED';
          const checkIn = booking.check_in;
          const checkOut = booking.check_out;
          const nights = checkIn && checkOut
            ? Math.max(1, Math.floor((new Date(checkOut) - new Date(checkIn)) / 86400000))
            : 1;
          const amount = booking.total_fare
            ? `₹${parseFloat(booking.total_fare).toLocaleString('en-IN')}`
            : '—';

          return (
            <motion.div key={booking.id || booking.booking_id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-black/[0.02] border border-black/5 rounded-3xl p-6 hover:border-brand-red/20 transition-all duration-300 group">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-black/40">
                        {booking.booking_id}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md ${statusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-brand-black tracking-tight">
                      {booking.hotel_name || 'Hotel Booking'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-black/40 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />{formatDate(checkIn)} → {formatDate(checkOut)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Moon size={11} />{nights} night{nights > 1 ? 's' : ''}
                      </span>
                      {booking.adults > 0 && (
                        <span className="flex items-center gap-1">
                          <User size={11} />{booking.adults} adult{booking.adults > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total Paid</p>
                    <p className="text-lg font-black text-brand-black">{amount}</p>
                  </div>
                  <button onClick={() => setSelectedBooking({ ...booking, kind: 'hotel', nights, amount })}
                    className="h-11 px-5 bg-white border border-black/10 hover:border-brand-red hover:text-brand-red rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ── Empty state ── */}
        {!loadingHotels && visibleFlights.length === 0 && visibleHotels.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-black/[0.03] rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'hotels'
                ? <Building2 size={32} className="text-brand-black/20" />
                : <Plane size={32} className="text-brand-black/20" />}
            </div>
            <h3 className="text-xl font-black text-brand-black mb-2">No bookings found</h3>
            <p className="text-brand-black/40 font-bold text-sm mb-5">
              {activeTab === 'hotels' ? "You haven't made any hotel bookings yet." : "You haven't made any bookings yet."}
            </p>
            {activeTab === 'hotels' && (
              <button onClick={() => navigate('/hotels')}
                className="px-6 py-3 bg-brand-red text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                Search Hotels
              </button>
            )}
          </div>
        )}

        {/* ── Modal ── */}
        <AnimatePresence>
          {selectedBooking && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedBooking(null)}
                className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-2xl p-8 md:p-10 max-w-lg w-full z-10 overflow-hidden border border-white"
              >
                <button onClick={() => setSelectedBooking(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-black/5 hover:bg-brand-red/10 hover:text-brand-red rounded-full flex items-center justify-center transition-colors">
                  <X size={20} />
                </button>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                      selectedBooking.kind === 'hotel' ? 'bg-blue-100 text-blue-700' : 'bg-brand-red/10 text-brand-red'
                    }`}>
                      {selectedBooking.kind === 'hotel' ? 'Hotel' : 'Flight'}
                    </span>
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${statusColor(selectedBooking.status || selectedBooking.booking_status)}`}>
                      {selectedBooking.status || selectedBooking.booking_status}
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-brand-black tracking-tight">
                    {selectedBooking.kind === 'hotel'
                      ? (selectedBooking.hotel_name || 'Hotel Booking')
                      : `${selectedBooking.from} → ${selectedBooking.to}`}
                  </h2>
                  <p className="text-[13px] font-bold text-brand-black/40 mt-1">
                    {selectedBooking.booking_id || selectedBooking.id}
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedBooking.kind === 'hotel' ? (
                    <div className="p-5 bg-black/[0.03] rounded-2xl space-y-3">
                      {[
                        ['Check In', formatDate(selectedBooking.check_in)],
                        ['Check Out', formatDate(selectedBooking.check_out)],
                        ['Duration', `${selectedBooking.nights} night${selectedBooking.nights > 1 ? 's' : ''}`],
                        ['Guests', `${selectedBooking.adults} adults, ${selectedBooking.children} children`],
                        ['Rooms', selectedBooking.rooms],
                        ['Booking Ref', selectedBooking.provider_reference || '—'],
                        ['Order ID', selectedBooking.provider_order_id || '—'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-black/40 font-bold">{label}</span>
                          <span className="font-black text-brand-black text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 bg-black/[0.03] rounded-2xl space-y-3">
                      {[
                        ['From', selectedBooking.from],
                        ['To', selectedBooking.to],
                        ['Date', selectedBooking.date],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-black/40 font-bold">{label}</span>
                          <span className="font-black text-brand-black">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-5 bg-black/[0.03] rounded-2xl">
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[14px] font-black text-brand-black">Total Amount</span>
                      <span className="text-[20px] font-black text-brand-red">
                        {selectedBooking.amount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                  {selectedBooking.kind === 'hotel' && selectedBooking.provider_reference && (
                    <button
                      onClick={() => navigate('/hotel-booking-success', {
                        state: {
                          bookingData: {
                            bookingReference: selectedBooking.provider_reference,
                            orderId: selectedBooking.provider_order_id,
                            data: { booking: { booking_id: selectedBooking.booking_id } },
                          },
                          hotelSnapshot: {
                            hotelId: selectedBooking.hotel_id,
                            hotelName: selectedBooking.hotel_name,
                            checkIn: selectedBooking.check_in,
                            checkOut: selectedBooking.check_out,
                            rooms: selectedBooking.rooms,
                            adults: selectedBooking.adults,
                            children: selectedBooking.children,
                            nightCount: selectedBooking.nights,
                          },
                          totalPrice: parseFloat(selectedBooking.total_fare || 0),
                        }
                      })}
                      className="h-12 px-6 bg-brand-red hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-red/20"
                    >
                      View Confirmation
                    </button>
                  )}
                  <button onClick={() => setSelectedBooking(null)}
                    className="h-12 px-6 bg-black/5 hover:bg-black/10 text-brand-black rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;

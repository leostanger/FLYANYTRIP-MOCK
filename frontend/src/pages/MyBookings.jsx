import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plane,
  Plus,
  Check,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

// Helper for calculating refund arrival date
const calculateExpectedRefundDate = (dateStr) => {
  try {
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      dateObj.setDate(dateObj.getDate() + 7);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return dateObj.toLocaleDateString('en-GB', options);
    }
  } catch (e) {
    // fallback
  }
  return '22 Dec 2026';
};

const INITIAL_TRIPS = [
  {
    id: 'tr-1',
    airline: 'INDIGO',
    airlineCode: 'IndiGo',
    logoBg: 'bg-[#002B66]',
    flightNum: 'FLY8K2M4',
    depTime: '06:00',
    depCity: 'DEL',
    depCityFull: 'New Delhi (Indira Gandhi Int.)',
    arrTime: '08:10',
    arrCity: 'BOM',
    arrCityFull: 'Mumbai (Chhatrapati Shivaji Int.)',
    date: '15 Dec 2026',
    price: '₹3,919',
    priceRaw: 3919,
    cancellationFee: 1000,
    status: 'Confirmed',
    tab: 'upcoming',
    passenger: 'Rahul Sharma',
    seat: '14A (Window)',
    terminal: 'T3 → T2',
    duration: '2h 10m (Direct)',
    baggage: '15kg Check-in · 7kg Cabin',
    pnr: 'FLY8K2M4',
  },
  {
    id: 'tr-2',
    airline: 'AIR INDIA',
    airlineCode: 'AI',
    logoBg: 'bg-[#E31837]',
    flightNum: 'FLY3X9P1',
    depTime: '10:30',
    depCity: 'BLR',
    depCityFull: 'Bengaluru (Kempegowda Int.)',
    arrTime: '12:00',
    arrCity: 'GOI',
    arrCityFull: 'Goa (Dabolim Int.)',
    date: '22 Dec 2026',
    price: '₹5,499',
    priceRaw: 5499,
    cancellationFee: 1200,
    status: 'Confirmed',
    tab: 'upcoming',
    passenger: 'Rahul Sharma',
    seat: '04C (Aisle)',
    terminal: 'T1 → T1',
    duration: '1h 30m (Direct)',
    baggage: '25kg Check-in · 7kg Cabin',
    pnr: 'FLY3X9P1',
  },
  {
    id: 'tr-3',
    airline: 'VISTARA',
    airlineCode: 'UK',
    logoBg: 'bg-[#582C83]',
    flightNum: 'FLY9A7R2',
    depTime: '14:15',
    depCity: 'DEL',
    depCityFull: 'New Delhi (Indira Gandhi Int.)',
    arrTime: '17:00',
    arrCity: 'CCU',
    arrCityFull: 'Kolkata (Netaji Subhash Chandra Bose)',
    date: '10 Nov 2026',
    price: '₹6,250',
    priceRaw: 6250,
    cancellationFee: 1500,
    status: 'Completed',
    tab: 'past',
    passenger: 'Rahul Sharma',
    seat: '09F (Window)',
    terminal: 'T3 → T2',
    duration: '2h 45m (Direct)',
    baggage: '15kg Check-in · 7kg Cabin',
    pnr: 'FLY9A7R2',
  },
  {
    id: 'tr-4',
    airline: 'AKASA AIR',
    airlineCode: 'QP',
    logoBg: 'bg-[#FF6600]',
    flightNum: 'FLY5L8W3',
    depTime: '07:45',
    depCity: 'PNQ',
    depCityFull: 'Pune (Lohegaon Int.)',
    arrTime: '09:15',
    arrCity: 'AMD',
    arrCityFull: 'Ahmedabad (Sardar Vallabhbhai Patel)',
    date: '28 Oct 2026',
    price: '₹2,899',
    priceRaw: 2899,
    cancellationFee: 800,
    status: 'Completed',
    tab: 'past',
    passenger: 'Rahul Sharma',
    seat: '12B (Middle)',
    terminal: 'T1 → T1',
    duration: '1h 30m (Direct)',
    baggage: '15kg Check-in · 7kg Cabin',
    pnr: 'FLY5L8W3',
  },
  {
    id: 'tr-5',
    airline: 'SPICEJET',
    airlineCode: 'SG',
    logoBg: 'bg-[#ED1C24]',
    flightNum: 'FLY1Q6Z9',
    depTime: '18:30',
    depCity: 'BOM',
    depCityFull: 'Mumbai (Chhatrapati Shivaji Int.)',
    arrTime: '20:45',
    arrCity: 'DEL',
    arrCityFull: 'New Delhi (Indira Gandhi Int.)',
    date: '04 Oct 2026',
    price: '₹4,120',
    priceRaw: 4120,
    cancellationFee: 500,
    status: 'Cancelled',
    tab: 'cancelled',
    passenger: 'Rahul Sharma',
    seat: '18A (Window)',
    terminal: 'T1 → T3',
    duration: '2h 15m (Direct)',
    baggage: '15kg Check-in · 7kg Cabin',
    pnr: 'FLY1Q6Z9',
    refundAmount: '₹3,620',
    paymentMethod: 'HDFC Card · XXXX 4521',
    expectedRefundDate: '11 Oct 2026',
    refundStep: 1,
  },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedTripId, setExpandedTripId] = useState(null);

  // Modal states
  const [cancelModalTrip, setCancelModalTrip] = useState(null);
  const [dateModalTrip, setDateModalTrip] = useState(null);
  const [newDateInput, setNewDateInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Trigger toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Counts for tabs
  const upcomingCount = trips.filter((t) => t.tab === 'upcoming').length;
  const pastCount = trips.filter((t) => t.tab === 'past').length;
  const cancelledCount = trips.filter((t) => t.tab === 'cancelled').length;

  const filteredTrips = trips.filter((t) => t.tab === activeTab);
  const cancelledTrips = trips.filter((t) => t.status === 'Cancelled');

  const handleToggleExpand = (id) => {
    setExpandedTripId((prev) => (prev === id ? null : id));
  };

  const handleDownloadTicket = (trip) => {
    showToast(`Downloading e-Ticket for ${trip.flightNum} (${trip.depCity} → ${trip.arrCity})...`);
  };

  // Handle Esc key close
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (cancelModalTrip) setCancelModalTrip(null);
        if (dateModalTrip) setDateModalTrip(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelModalTrip, dateModalTrip]);

  const handleConfirmCancel = () => {
    if (!cancelModalTrip) return;
    const feeRaw = cancelModalTrip.cancellationFee || 1000;
    const refundRaw = Math.max(0, cancelModalTrip.priceRaw - feeRaw);
    const formattedRefund = `₹${refundRaw.toLocaleString('en-IN')}`;
    const expectedDate = calculateExpectedRefundDate(cancelModalTrip.date);

    setTrips((prev) =>
      prev.map((t) =>
        t.id === cancelModalTrip.id
          ? {
              ...t,
              status: 'Cancelled',
              tab: 'cancelled',
              refundAmount: formattedRefund,
              paymentMethod: t.paymentMethod || 'HDFC Card · XXXX 4521',
              expectedRefundDate: expectedDate,
              refundStep: 1,
            }
          : t
      )
    );
    showToast(`Booking ${cancelModalTrip.flightNum} cancelled successfully. ${formattedRefund} refund initiated.`);
    setCancelModalTrip(null);
  };

  const handleConfirmDateChange = (e) => {
    e.preventDefault();
    if (!dateModalTrip || !newDateInput) return;
    
    // Format date nicely
    const dateObj = new Date(newDateInput);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', options);

    setTrips((prev) =>
      prev.map((t) =>
        t.id === dateModalTrip.id
          ? { ...t, date: formattedDate }
          : t
      )
    );
    showToast(`Date changed for ${dateModalTrip.flightNum} to ${formattedDate}!`);
    setDateModalTrip(null);
    setNewDateInput('');
  };

  return (
    <div className="font-quicksand flex flex-col min-h-screen bg-[#F7F7F8] text-gray-800">
      {/* 1. TOP UTILITY BAR */}
      <Navbar />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 text-sm font-medium animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* 3. PAGE HEADER SECTION */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[24px] sm:text-[26px] font-bold text-[#1F2937] tracking-tight leading-tight font-satoshi">
              My Trips
            </h1>
            <p className="text-xs sm:text-[13px] font-normal text-gray-500 mt-1">
              Manage all your flight bookings in one place
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-[#E8442D] hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 text-xs sm:text-[13px] cursor-pointer active:scale-95 self-start sm:self-center shrink-0"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Book New Flight</span>
          </button>
        </section>

        {/* 4. TABS SECTION (Trip filter tabs) */}
        <section className="border-b border-gray-200 mb-6">
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            
            {/* Tab 1: Upcoming Trips */}
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'upcoming'
                  ? 'text-[#1F2937] font-bold border-b-2 border-[#1F2937]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Upcoming Trips</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-[#1F2937] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {upcomingCount}
              </span>
            </button>

            {/* Tab 2: Past Trips */}
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'past'
                  ? 'text-[#1F2937] font-bold border-b-2 border-[#1F2937]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Past Trips</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'bg-[#1F2937] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {pastCount}
              </span>
            </button>

            {/* Tab 3: Cancelled */}
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-3 flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap relative ${
                activeTab === 'cancelled'
                  ? 'text-[#1F2937] font-bold border-b-2 border-[#1F2937]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>Cancelled</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                  activeTab === 'cancelled'
                    ? 'bg-[#1F2937] text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {cancelledCount}
              </span>
            </button>
          </div>
        </section>

        {/* 5. TRIP CARDS LIST */}
        <section className="space-y-4 sm:space-y-5">
          {filteredTrips.length === 0 ? (
            <div className="bg-white border border-gray-200/80 rounded-xl p-8 sm:p-10 text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <Plane size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1F2937] mb-1">No trips found in this category</h3>
              <p className="text-xs sm:text-[13px] text-gray-500 font-normal mb-5 max-w-sm mx-auto">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming flights. Ready to plan your next journey?"
                  : activeTab === 'past'
                  ? "You haven't completed any trips with us yet."
                  : "No cancelled bookings to show."}
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#E8442D] text-white font-medium px-5 py-2 rounded-lg text-xs sm:text-[13px] hover:bg-red-600 transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
              >
                <span>Search Flights</span>
              </button>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const isExpanded = expandedTripId === trip.id;
              const isConfirmed = trip.status === 'Confirmed';
              const isCompleted = trip.status === 'Completed';
              const isCancelled = trip.status === 'Cancelled';

              return (
                <div
                  key={trip.id}
                  className="bg-white border border-gray-200/90 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all duration-300 text-left"
                >
                  {/* TOP ROW: Airline | Timeline | Price & Status */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
                    
                    {/* Left: Airline Logo Box & Name */}
                    <div className="flex items-center gap-3.5 shrink-0">
                      <div
                        className={`${trip.logoBg} w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shadow-inner tracking-tight px-1 text-center leading-tight select-none`}
                      >
                        {trip.airlineCode}
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-[#1F2937] tracking-wider uppercase leading-snug">
                          {trip.airline}
                        </div>
                        <div className="text-[11px] font-normal text-gray-500 uppercase tracking-wider mt-0.5 font-jetbrains">
                          {trip.flightNum}
                        </div>
                      </div>
                    </div>

                    {/* Center: Flight Timeline Visual */}
                    <div className="flex items-center justify-between lg:justify-center flex-grow max-w-xl mx-auto w-full px-1 sm:px-4">
                      
                      {/* Departure */}
                      <div className="text-left sm:text-center min-w-[64px]">
                        <div className="text-[20px] sm:text-[22px] font-bold text-[#1F2937] leading-none font-jetbrains">
                          {trip.depTime}
                        </div>
                        <div className="text-xs sm:text-[13px] font-normal text-gray-500 tracking-wide mt-1">
                          {trip.depCity}
                        </div>
                      </div>

                      {/* Line connecting with Plane icon & Date below */}
                      <div className="flex-1 flex flex-col items-center px-3 sm:px-6">
                        <div className="w-full relative flex items-center justify-center my-1.5">
                          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                          <div className="absolute bg-white px-2 text-[#E8442D] flex items-center justify-center">
                            <Plane size={15} className="rotate-90" />
                          </div>
                        </div>
                        <div className="text-xs sm:text-[13px] font-medium text-[#E8442D] tracking-wide whitespace-nowrap mt-1">
                          {trip.date}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-right sm:text-center min-w-[64px]">
                        <div className="text-[20px] sm:text-[22px] font-bold text-[#1F2937] leading-none font-jetbrains">
                          {trip.arrTime}
                        </div>
                        <div className="text-xs sm:text-[13px] font-normal text-gray-500 tracking-wide mt-1">
                          {trip.arrCity}
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Status Badge */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                      <div className="text-[16px] sm:text-[18px] font-bold text-[#1F2937] tracking-tight font-jetbrains">
                        {trip.price}
                      </div>
                      <div className="mt-1 lg:mt-1.5">
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-medium text-[11px] sm:text-[12px] tracking-wide font-jetbrains">
                            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                            <span>Confirmed</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-300 font-medium text-[11px] sm:text-[12px] tracking-wide font-jetbrains">
                            <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                            <span>Completed</span>
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#E8442D] border border-[#E8442D] font-medium text-[11px] sm:text-[12px] tracking-wide shadow-xs font-jetbrains">
                            <XCircle size={13} className="text-[#E8442D] shrink-0" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW: Action Buttons */}
                  <div className="pt-3.5 mt-1 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full">
                      
                      {/* Button 1: View Details */}
                      <button
                        onClick={() => handleToggleExpand(trip.id)}
                        className={`px-3.5 py-1.5 rounded-lg border font-medium text-xs sm:text-[13px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap h-[36px] sm:h-[38px] ${
                          isExpanded
                            ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      </button>

                      {/* Button 2: Download Ticket */}
                      <button
                        onClick={() => handleDownloadTicket(trip)}
                        className="px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-[13px] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap h-[36px] sm:h-[38px]"
                      >
                        <Download size={15} strokeWidth={2} />
                        <span>Download Ticket</span>
                      </button>

                      {/* Button 3: Date Change */}
                      <button
                        disabled={!isConfirmed}
                        onClick={() => {
                          if (isConfirmed) {
                            setDateModalTrip(trip);
                            setNewDateInput('');
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-lg border font-medium text-xs sm:text-[13px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap h-[36px] sm:h-[38px] ${
                          isConfirmed
                            ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer active:scale-95'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Calendar size={15} strokeWidth={2} />
                        <span>Date Change</span>
                      </button>

                      {/* Button 4: Cancel Booking */}
                      <button
                        disabled={!isConfirmed}
                        onClick={() => {
                          if (isConfirmed) setCancelModalTrip(trip);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg border font-medium text-xs sm:text-[13px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap h-[36px] sm:h-[38px] ${
                          isConfirmed
                            ? 'border-red-200 bg-red-50/60 hover:bg-red-100 text-red-700 cursor-pointer active:scale-95'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <XCircle size={15} strokeWidth={2} />
                        <span>Cancel Booking</span>
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE DETAILS PANEL */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 bg-gray-50/70 rounded-xl p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-[11px] sm:text-xs font-normal animate-fadeIn text-left">
                      <div>
                        <div className="text-gray-400 font-medium uppercase text-[11px] tracking-wider mb-1">
                          Passenger Details
                        </div>
                        <div className="font-semibold text-[#1F2937]">{trip.passenger}</div>
                        <div className="text-gray-500 mt-0.5">Seat: <span className="font-medium text-gray-700">{trip.seat}</span></div>
                      </div>

                      <div>
                        <div className="text-gray-400 font-medium uppercase text-[11px] tracking-wider mb-1">
                          Booking Reference
                        </div>
                        <div className="font-semibold text-[#1F2937]">PNR: <span className="font-jetbrains">{trip.pnr}</span></div>
                        <div className="text-gray-500 mt-0.5">Terminal: <span className="font-medium text-gray-700">{trip.terminal}</span></div>
                      </div>

                      <div>
                        <div className="text-gray-400 font-medium uppercase text-[11px] tracking-wider mb-1">
                          Flight Info
                        </div>
                        <div className="font-semibold text-[#1F2937]">{trip.duration}</div>
                        <div className="text-gray-500 mt-0.5">{trip.depCityFull} → {trip.arrCityFull}</div>
                      </div>

                      <div>
                        <div className="text-gray-400 font-medium uppercase text-[11px] tracking-wider mb-1">
                          Baggage & Extras
                        </div>
                        <div className="font-semibold text-[#1F2937]">{trip.baggage}</div>
                        {trip.refundAmount && (
                          <div className="text-red-600 font-medium mt-0.5">Refund: <span className="font-jetbrains">{trip.refundAmount}</span></div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* 6. "Quick Help" SECTION */}
        <section className="mt-8 mb-12 bg-white border border-gray-200/90 rounded-xl p-5 sm:p-6 lg:p-8 shadow-xs text-left">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-[#1F2937] mb-4 tracking-tight flex items-center gap-2">
            <span>Quick Help</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Card 1 */}
            <div className="bg-[#F7F7F8] border border-gray-200/80 rounded-xl p-4 sm:p-5 hover:shadow-xs hover:border-gray-300 transition-all">
              <h3 className="text-[14px] font-semibold text-[#1F2937] mb-1.5">
                How to cancel a booking?
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
                Open the trip → Click 'Cancel Booking' → Review refund policy → Confirm cancellation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F7F7F8] border border-gray-200/80 rounded-xl p-4 sm:p-5 hover:shadow-xs hover:border-gray-300 transition-all">
              <h3 className="text-[14px] font-semibold text-[#1F2937] mb-1.5">
                When will I get my refund?
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
                Refunds are processed in 5-7 business days after airline confirmation.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F7F7F8] border border-gray-200/80 rounded-xl p-4 sm:p-5 hover:shadow-xs hover:border-gray-300 transition-all">
              <h3 className="text-[14px] font-semibold text-[#1F2937] mb-1.5">
                Can I modify my booking?
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed font-normal">
                Date changes and name corrections are available for eligible fare types only.
              </p>
            </div>
          </div>
        </section>

        {/* 7. "Refund Requested" TRACKER SECTION (Conditional Rendering) */}
        {cancelledTrips.length > 0 && (
          <section className="space-y-4 sm:space-y-5 mt-8 mb-12 animate-fadeIn text-left">
            {cancelledTrips.map((trip) => {
              const currentStep = trip.refundStep || 1;
              return (
                <div
                  key={`refund-${trip.id}`}
                  className="bg-white border border-gray-200/90 rounded-xl p-5 sm:p-6 shadow-xs transition-all"
                >
                  {/* HEADER ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#fceded] text-[#E8442D] border border-[#fbdcd9] flex items-center justify-center shrink-0 shadow-xs select-none">
                        <Clock size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[16px] sm:text-[18px] font-bold text-[#1F2937] tracking-tight leading-snug">
                            Refund Requested
                          </h3>
                          <span className="text-[11px] font-medium text-[#E8442D] bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            <span className="font-jetbrains">{trip.flightNum}</span> ({trip.depCity} → {trip.arrCity})
                          </span>
                        </div>
                        <p className="text-[12px] font-normal text-gray-500 mt-1 leading-relaxed">
                          Your cancellation request has been received. Refund will be processed within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STATUS STEPPER ROW */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 mb-5 overflow-x-auto pb-1 no-scrollbar">
                    {/* Step 1: Cancellation Requested */}
                    <div
                      className={`font-medium px-3 py-1.5 rounded-full text-xs sm:text-[13px] flex items-center gap-1.5 shadow-xs whitespace-nowrap border ${
                        currentStep >= 1
                          ? 'bg-[#E8442D] text-[#ffffff] border-[#E8442D]'
                          : 'bg-white text-gray-600 border-gray-300 font-normal'
                      }`}
                    >
                      <Check size={14} strokeWidth={2.5} />
                      <span>Cancellation Requested</span>
                    </div>

                    {/* Step 2: Airline Confirmation */}
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] flex items-center gap-1.5 whitespace-nowrap border ${
                        currentStep >= 2
                          ? 'bg-[#E8442D] text-[#ffffff] border-[#E8442D] font-medium shadow-xs'
                          : 'bg-white text-gray-600 border-gray-300 font-normal'
                      }`}
                    >
                      {currentStep >= 2 && <Check size={14} strokeWidth={2.5} />}
                      <span>Airline Confirmation</span>
                    </div>

                    {/* Step 3: Refund Initiated */}
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] flex items-center gap-1.5 whitespace-nowrap border ${
                        currentStep >= 3
                          ? 'bg-[#E8442D] text-[#ffffff] border-[#E8442D] font-medium shadow-xs'
                          : 'bg-white text-gray-600 border-gray-300 font-normal'
                      }`}
                    >
                      {currentStep >= 3 && <Check size={14} strokeWidth={2.5} />}
                      <span>Refund Initiated</span>
                    </div>

                    {/* Step 4: Refund Credited */}
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-[13px] flex items-center gap-1.5 whitespace-nowrap border ${
                        currentStep >= 4
                          ? 'bg-[#E8442D] text-[#ffffff] border-[#E8442D] font-medium shadow-xs'
                          : 'bg-white text-gray-600 border-gray-300 font-normal'
                      }`}
                    >
                      {currentStep >= 4 && <Check size={14} strokeWidth={2.5} />}
                      <span>Refund Credited</span>
                    </div>
                  </div>

                  {/* INFO BOXES ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                    {/* Box 1: Refund Amount */}
                    <div className="bg-[#F7F7F8] border border-gray-200/80 rounded-xl p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Refund Amount
                      </div>
                      <div className="text-[15px] sm:text-[16px] font-bold text-[#1F2937] tracking-tight font-jetbrains">
                        {trip.refundAmount || `₹${Math.max(0, trip.priceRaw - (trip.cancellationFee || 1000)).toLocaleString('en-IN')}`}
                      </div>
                    </div>

                    {/* Box 2: Refund to */}
                    <div className="bg-[#F7F7F8] border border-gray-200/80 rounded-xl p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Refund to
                      </div>
                      <div className="text-[14px] sm:text-[15px] font-semibold text-[#1F2937] tracking-tight">
                        {trip.paymentMethod || 'HDFC Card · XXXX 4521'}
                      </div>
                    </div>

                    {/* Box 3: Expected by */}
                    <div className="bg-[#F7F7F8] border border-gray-200/80 rounded-xl p-3.5 sm:p-4">
                      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Expected by
                      </div>
                      <div className="text-[14px] sm:text-[15px] font-semibold text-[#1F2937] tracking-tight">
                        {trip.expectedRefundDate || calculateExpectedRefundDate(trip.date)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* FOOTER SECTION */}
      <Footer />

      {/* ================= MODALS ================= */}

      {/* CANCELLATION MODAL */}
      {cancelModalTrip && (() => {
        const feeRaw = cancelModalTrip.cancellationFee || 1000;
        const refundRaw = Math.max(0, cancelModalTrip.priceRaw - feeRaw);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fadeIn"
            onClick={() => setCancelModalTrip(null)}
          >
            {/* Modal Container */}
            <div
              className="bg-white rounded-xl max-w-[440px] w-full p-5 sm:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.15)] border border-gray-100 relative text-left animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. HEADER SECTION */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#fceded] text-[#E8442D] border border-[#f8cbcb] flex items-center justify-center shrink-0 shadow-xs select-none">
                  <AlertCircle size={22} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1F2937] tracking-tight leading-snug">
                    Cancel Booking?
                  </h3>
                  <p className="text-xs sm:text-[13px] font-normal text-gray-500 mt-0.5">
                    PNR: <span className="font-jetbrains">{cancelModalTrip.pnr || cancelModalTrip.flightNum}</span>
                  </p>
                </div>
              </div>

              {/* 2. CANCELLATION CHARGES BOX */}
              <div className="bg-[#F2F2F3] border border-gray-200/80 rounded-xl p-4 mb-4">
                <div className="text-[13px] sm:text-[14px] font-semibold text-[#1F2937] mb-3 tracking-tight">
                  Cancellation Charges
                </div>
                
                {/* Row 1: Total paid */}
                <div className="flex justify-between items-center text-xs sm:text-[13px] font-normal mb-2">
                  <span className="text-gray-500">Total paid</span>
                  <span className="font-semibold text-[#1F2937] font-jetbrains">
                    ₹{cancelModalTrip.priceRaw.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Row 2: Cancellation fee */}
                <div className="flex justify-between items-center text-xs sm:text-[13px] font-normal mb-2.5">
                  <span className="text-gray-500">Cancellation fee</span>
                  <span className="font-semibold text-[#1F2937] font-jetbrains">
                    ₹{feeRaw.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Horizontal divider line */}
                <div className="border-t border-gray-300/80 pt-2.5 mt-1"></div>

                {/* Final row: Refund amount */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1F2937] text-xs sm:text-[13px]">
                    Refund amount
                  </span>
                  <span className="font-bold text-[#1F2937] text-[15px] sm:text-[16px] tracking-tight font-jetbrains">
                    ₹{refundRaw.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 3. DISCLAIMER TEXT */}
              <p className="text-[12px] text-gray-500 font-normal leading-relaxed mb-5">
                Refund will be credited to your original payment method within 5-7 business days.
              </p>

              {/* 4. ACTION BUTTONS */}
              <div className="flex items-center gap-2.5 w-full">
                {/* Left button: Keep Booking */}
                <button
                  type="button"
                  onClick={() => setCancelModalTrip(null)}
                  className="flex-1 py-2 px-3.5 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-[13px] transition-all cursor-pointer text-center active:scale-95 whitespace-nowrap shadow-xs"
                >
                  Keep Booking
                </button>

                {/* Right button: Confirm Cancel */}
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2 px-3.5 rounded-lg bg-[#E8442D] hover:bg-red-600 text-white font-medium text-xs sm:text-[13px] transition-all shadow-xs hover:shadow-sm cursor-pointer text-center active:scale-95 whitespace-nowrap"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DATE CHANGE MODAL */}
      {dateModalTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-gray-100 relative text-left">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1F2937] mb-1.5">
              Modify Travel Date
            </h3>
            <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed mb-5">
              Select a new departure date for <span className="font-semibold text-[#1F2937]">{dateModalTrip.flightNum}</span> ({dateModalTrip.depCity} → {dateModalTrip.arrCity}).
            </p>

            <form onSubmit={handleConfirmDateChange} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Current Departure Date
                </label>
                <div className="px-3.5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-xs sm:text-[13px] border border-gray-200">
                  {dateModalTrip.date} ({dateModalTrip.depTime})
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  New Departure Date <span className="text-[#E8442D]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:border-[#E8442D] focus:outline-none focus:ring-2 focus:ring-[#E8442D]/20 font-normal text-xs sm:text-[13px] transition-all"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDateModalTrip(null);
                    setNewDateInput('');
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-[13px] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E8442D] hover:bg-red-600 text-white font-medium text-xs sm:text-[13px] cursor-pointer shadow-xs transition-colors"
                >
                  Confirm Date Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

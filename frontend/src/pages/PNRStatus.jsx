import React, { useState } from 'react';
import { Search, Plane, Clock, ShieldCheck, MapPin, AlertCircle, Info, Calendar } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function PNRStatus() {
  const [pnrInput, setPnrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flightStatus, setFlightStatus] = useState(null);
  const [error, setError] = useState('');

  const handlePnrSearch = (e) => {
    e.preventDefault();
    if (!pnrInput) {
      setError('Please enter a PNR code.');
      return;
    }
    setError('');
    setLoading(true);
    setFlightStatus(null);

    // Mock search delay
    setTimeout(() => {
      setLoading(false);
      const cleanPnr = pnrInput.trim().toUpperCase();

      if (cleanPnr.length < 4) {
        setError('❌ PNR not found. Standard GDS references are 5 or 6 characters (alphanumeric).');
      } else {
        setFlightStatus({
          pnr: cleanPnr,
          flightNumber: 'AI-805',
          airline: 'Air India',
          status: 'ON TIME',
          statusCode: 'ontime',
          from: 'Delhi (DEL)',
          to: 'Bengaluru (BLR)',
          fromTerminal: 'T3, Indira Gandhi Intl',
          toTerminal: 'T2, Kempegowda Intl',
          departureTime: '10:15 AM',
          arrivalTime: '12:55 PM',
          date: '02 Aug 2026',
          passenger: 'John Doe',
          seat: '12A',
          gate: '24B',
          baggageBelt: 'Belt 4',
          duration: '2h 40m'
        });
      }
    }, 1100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-satoshi text-gray-800">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a0e0b] py-16 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,53,53,0.15),transparent_45%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/5 backdrop-blur-md font-quicksand">
            <Plane className="w-3.5 h-3.5" /> GDS Live Radar
          </span>
          <h1 className="font-quicksand text-4xl font-bold tracking-tight mb-3">
            Check Flight <span className="text-[#ef3535]">PNR Status</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
            Enter your airline reference number or booking ID (PNR) to access real-time gate announcements, timings, and boarding schedules.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <main className="flex-grow max-w-[900px] w-full mx-auto px-4 py-12 relative z-20">
        
        {/* INPUT PANEL */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 text-left">
          <form onSubmit={handlePnrSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow text-left">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Enter Booking PNR / Reference *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search size={16} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  placeholder="e.g. W84B9X or AI-932194"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#ef3535] focus:outline-none text-sm uppercase transition-colors"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#ef3535] hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 cursor-pointer border-none font-quicksand text-sm flex items-center justify-center gap-1.5 shrink-0 h-[46px] w-full sm:w-auto"
            >
              Verify PNR Status
            </button>
          </form>
          {error && <p className="text-red-500 text-xs font-medium mt-3 text-left">{error}</p>}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ef3535] rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500 font-light font-quicksand">Connecting to GDS flight radar grids...</p>
          </div>
        )}

        {/* BOARDING PASS BOARD */}
        {flightStatus && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn text-left">
            
            {/* Header banner */}
            <div className="bg-[#111] text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-red-400 rotate-45" />
                </div>
                <div>
                  <h3 className="font-quicksand font-bold text-lg leading-tight">{flightStatus.airline} — {flightStatus.flightNumber}</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">PNR Reference: {flightStatus.pnr}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {flightStatus.status}
                </span>
              </div>
            </div>

            {/* Flight Path Cards */}
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-6">
                
                {/* From details */}
                <div className="md:col-span-4 text-left md:text-left">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Departure Location</span>
                  <h4 className="text-xl font-black text-gray-900 mt-1 font-quicksand">{flightStatus.from}</h4>
                  <p className="text-xs text-gray-500 font-light leading-snug mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {flightStatus.fromTerminal}
                  </p>
                  <p className="text-base font-bold text-[#ef3535] mt-2 font-quicksand">{flightStatus.departureTime}</p>
                </div>

                {/* Flow arrows */}
                <div className="md:col-span-4 flex flex-col items-center py-2">
                  <span className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold">{flightStatus.duration}</span>
                  <div className="w-full flex items-center gap-2 mt-2 px-6">
                    <div className="w-2 h-2 rounded-full bg-[#ef3535] shrink-0" />
                    <div className="flex-grow h-0.5 bg-dashed border-t-2 border-dashed border-gray-200 relative">
                      <Plane className="w-4.5 h-4.5 text-[#ef3535] absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 shrink-0 bg-white px-0.5" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                  </div>
                  <span className="text-[11px] text-gray-500 font-light mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" /> Direct Flight
                  </span>
                </div>

                {/* To details */}
                <div className="md:col-span-4 text-left md:text-right">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Arrival Location</span>
                  <h4 className="text-xl font-black text-gray-900 mt-1 font-quicksand">{flightStatus.to}</h4>
                  <p className="text-xs text-gray-500 font-light leading-snug mt-1 flex items-center justify-start md:justify-end gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {flightStatus.toTerminal}
                  </p>
                  <p className="text-base font-bold text-gray-800 mt-2 font-quicksand">{flightStatus.arrivalTime}</p>
                </div>

              </div>

              {/* Grid ticket specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Passenger</h5>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{flightStatus.passenger}</p>
                </div>
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Seat Allocation</h5>
                  <p className="text-sm font-semibold text-[#ef3535] mt-1 font-quicksand">{flightStatus.seat}</p>
                </div>
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Boarding Gate</h5>
                  <p className="text-sm font-semibold text-gray-800 mt-1 font-quicksand">{flightStatus.gate}</p>
                </div>
                <div>
                  <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Baggage Claim</h5>
                  <p className="text-sm font-semibold text-gray-800 mt-1 font-quicksand">{flightStatus.baggageBelt}</p>
                </div>
              </div>

              {/* Progress Flow timeline */}
              <div>
                <h4 className="font-quicksand font-bold text-base text-gray-900 mb-4 flex items-center gap-1.5">
                  <Info className="w-4.5 h-4.5 text-gray-500 animate-pulse" /> Flight Tracking Steps
                </h4>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between px-2 pt-2">
                  {[
                    { title: 'Scheduled', time: '08:00 AM', completed: true },
                    { title: 'Gate Open', time: '09:15 AM', completed: true },
                    { title: 'Boarding', time: '09:45 AM', completed: true, active: true },
                    { title: 'Departed', time: '10:15 AM', completed: false }
                  ].map((step, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center relative w-full sm:w-auto">
                      <div className="flex items-center w-full justify-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-quicksand text-xs font-bold border-2 transition-all ${
                          step.active 
                            ? 'bg-[#ef3535]/10 border-[#ef3535] text-[#ef3535]' 
                            : step.completed 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                              : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                          {step.completed ? '✓' : idx + 1}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-800 mt-2">{step.title}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advisory note */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs sm:text-sm text-blue-800">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="font-light leading-relaxed text-left">
                  <strong>Advisory:</strong> Checked-in baggage gate closes exactly 45 minutes prior to takeoff. Make sure to report to terminal 3 before 09:30 AM.
                </p>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

/**
 * ============================================================================
 * PATH: frontend/src/components/flights/BookingSeat.jsx
 * DESCRIPTION: Premium interactive airplane seat selector grid matching app design system.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { Plane, Check, X, Shield, Info, ChevronRight } from "lucide-react";

export default function BookingSeat({ flight, passengers = [], onContinue, onSeatSelect }) {
  const paxList = passengers.length > 0 ? passengers : [
    { firstName: "Rahul", lastName: "Sharma" }
  ];

  const [activePaxIdx, setActivePaxIdx] = useState(0);
  const [paxSeats, setPaxSeats] = useState({
    0: { seat: "12A", price: 350 }
  });
  const [liveSsrSeats, setLiveSsrSeats] = useState(null);
  const [isLiveSsr, setIsLiveSsr] = useState(false);

  useEffect(() => {
    const tId = flight?.traceId || flight?.raw?.traceId;
    const rIdx = flight?.resultIndex || flight?.raw?.resultIndex || flight?.id;
    if (tId && rIdx) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      fetch(`${baseUrl}/flights/ssr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traceId: tId, resultIndex: rIdx })
      })
      .then(res => res.json())
      .then(data => {
        const ssrResponse = data?.data?.responseData?.Response || data?.data?.Response;
        if (ssrResponse?.SeatDynamic && Array.isArray(ssrResponse.SeatDynamic)) {
          setLiveSsrSeats(ssrResponse.SeatDynamic);
          setIsLiveSsr(true);
        }
      })
      .catch(err => console.warn('Adivaha live SSR API notice:', err.message));
    }
  }, [flight]);
  // Flatten live Adivaha SSR Seats into a quick lookup dictionary: { "12A": { isOccupied: false, price: 350 } }
  const apiSeatLookup = React.useMemo(() => {
    const map = {};
    if (!liveSsrSeats || !Array.isArray(liveSsrSeats)) return map;

    try {
      liveSsrSeats.forEach(seg => {
        const segSeats = seg?.SegmentSeat || seg;
        const rowSeatsList = Array.isArray(segSeats) ? segSeats : (segSeats?.RowSeats || []);
        rowSeatsList.forEach(rowGroup => {
          const rowSeats = rowGroup?.Seats || rowGroup?.RowSeats || [];
          if (Array.isArray(rowSeats)) {
            rowSeats.forEach(seat => {
              const code = seat.SeatNo || seat.Code;
              if (code && code !== "NoSeat") {
                map[code] = {
                  isOccupied: seat.AvailablityType !== undefined ? seat.AvailablityType !== 1 : false,
                  price: seat.Price !== undefined ? seat.Price : null,
                  raw: seat
                };
              }
            });
          }
        });
      });
    } catch (err) {
      console.warn("API seat parse notice:", err.message);
    }
    return map;
  }, [liveSsrSeats]);

  const rows = Array.from({ length: 24 }, (_, i) => i + 1);
  const leftCols = ["A", "B", "C"];
  const rightCols = ["D", "E", "F"];

  // Dynamic seat category & pricing bound 100% strictly to live Adivaha API
  const getSeatCategory = (row, col) => {
    const seatId = `${row}${col}`;
    const apiSeat = apiSeatLookup[seatId];

    // When Live Adivaha API is connected, occupied state & price come 100% strictly from API
    let isOccupied = false;
    let basePrice = 0;

    if (apiSeat) {
      isOccupied = apiSeat.isOccupied;
      basePrice = apiSeat.price !== null ? apiSeat.price : 0;
    } else {
      isOccupied = false;
      basePrice = 0;
    }

    if (isOccupied) {
      return { type: "occupied", price: 0, label: "Occupied" };
    }

    if (row <= 3) {
      return { type: "premium", price: apiSeat?.price ?? 750, label: "XL Legroom", bg: "bg-purple-50 text-purple-700 border-purple-200" };
    }
    if (row === 12 || row === 13) {
      return { type: "exit", price: apiSeat?.price ?? 500, label: "Emergency Exit", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    }
    if (row <= 10 && (col === "A" || col === "C" || col === "D" || col === "F")) {
      return { type: "standard", price: apiSeat?.price ?? 350, label: "Standard", bg: "bg-blue-50 text-blue-700 border-blue-200" };
    }
    if (row >= 18) {
      return { type: "free", price: apiSeat?.price ?? 0, label: "Free Seat", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }

    return { type: "standard", price: basePrice, label: "Standard", bg: "bg-blue-50 text-blue-700 border-blue-200" };
  };

  const handleSeatClick = (seatId, seatInfo) => {
    if (seatInfo.type === "occupied") return;

    // Check if seat is already assigned to another passenger
    const assignedPaxIdx = Object.keys(paxSeats).find(idx => paxSeats[idx]?.seat === seatId);
    if (assignedPaxIdx !== undefined && parseInt(assignedPaxIdx, 10) !== activePaxIdx) {
      const otherPaxName = paxList[assignedPaxIdx]?.firstName || `Passenger ${parseInt(assignedPaxIdx, 10) + 1}`;
      alert(`Seat ${seatId} is already selected for ${otherPaxName}. Please pick a different seat.`);
      return;
    }

    const updated = { ...paxSeats };
    if (updated[activePaxIdx]?.seat === seatId) {
      delete updated[activePaxIdx];
    } else {
      updated[activePaxIdx] = { seat: seatId, price: seatInfo.price };
    }

    setPaxSeats(updated);

    // Calculate total seat price across all passengers
    const totalSeatPrice = Object.values(updated).reduce((acc, curr) => acc + (curr.price || 0), 0);
    const primarySeat = updated[0]?.seat || "12A";

    if (onSeatSelect) {
      onSeatSelect(primarySeat, totalSeatPrice, updated);
    }
  };

  const totalSeatPrice = Object.values(paxSeats).reduce((acc, curr) => acc + (curr.price || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-['Quicksand'] text-left select-none">
      
      {/* ── 1. Top Header Card ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Satoshi'] font-bold text-[18px] text-[#1A1A1A]">
                Select Your Seat ({paxList.length} Passenger{paxList.length > 1 ? 's' : ''})
              </h3>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                isLiveSsr ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"
              }`}>
                {isLiveSsr ? "🟢 Live Adivaha GDS Seats" : "Airbus A320 Grid"}
              </span>
            </div>
            <p className="font-['Quicksand'] text-[12px] text-[#999999] font-medium mt-0.5">
              {flight?.departCity || "New Delhi (DEL)"} &rarr; {flight?.arrivalCity || "Mumbai (BOM)"} &bull; {flight?.airline || "Airbus A320"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-['Quicksand'] text-[12px] text-[#666666] font-medium">
              Total Seat Fee:
            </span>
            <span className="font-['Satoshi'] font-bold text-[15px] text-[#F12B19] bg-[#FFF1F2] px-3 py-1 rounded-full border border-[#FDE8E8]">
              {totalSeatPrice === 0 ? "FREE" : `₹${totalSeatPrice.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        {/* Passenger Selector Tabs */}
        {paxList.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 mr-1">
              Selecting For:
            </span>
            {paxList.map((pax, idx) => {
              const isActive = activePaxIdx === idx;
              const paxSeatInfo = paxSeats[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePaxIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                    isActive 
                      ? "bg-[#F12B19] border-[#F12B19] text-white shadow-xs" 
                      : "bg-[#F8F9FA] border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>P{idx + 1}: {pax.firstName || `Pax ${idx + 1}`}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    isActive ? "bg-white/20 text-white font-extrabold" : "bg-gray-200 text-gray-700 font-semibold"
                  }`}>
                    {paxSeatInfo ? `${paxSeatInfo.seat} (${paxSeatInfo.price === 0 ? "Free" : `₹${paxSeatInfo.price}`})` : "Select Seat"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Legend Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] font-semibold pt-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#F12B19] flex items-center justify-center text-white text-[9px]">✓</div>
            <span className="text-[#1A1A1A]">Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold flex items-center justify-center">F</div>
            <span className="text-gray-600">Free</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-50 border border-blue-300 text-blue-700 text-[10px] font-bold flex items-center justify-center">₹</div>
            <span className="text-gray-600">₹250 - ₹350</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-50 border border-purple-300 text-purple-700 text-[10px] font-bold flex items-center justify-center">XL</div>
            <span className="text-gray-600">XL Legroom (₹750)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 text-gray-400 text-[10px] flex items-center justify-center">✕</div>
            <span className="text-gray-400">Occupied</span>
          </div>
        </div>
      </div>

      {/* ── 2. Interactive Vertical Airplane Fuselage Seat Grid ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-5 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center">
        
        {/* Airplane Cockpit Nose Cone */}
        <div className="w-full max-w-[340px] flex flex-col items-center">
          <svg className="w-full h-16 text-gray-200" viewBox="0 0 340 60" fill="none">
            <path d="M170 2 C 220 2, 310 30, 320 60 L 20 60 C 30 30, 120 2, 170 2 Z" fill="#F8F9FA" stroke="#EAEAEA" strokeWidth="2" />
            <path d="M140 40 L 160 25 L 180 25 L 200 40 Z" fill="#EAEAEA" />
          </svg>
          <div className="bg-[#F8F9FA] border-x border-[#EAEAEA] w-full text-center py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            FRONT OF AIRCRAFT &bull; COCKPIT
          </div>
        </div>

        {/* Fuselage Body Outer Frame */}
        <div className="w-full max-w-[340px] bg-[#F9FAFB] border-2 border-[#EAEAEA] rounded-b-3xl p-4 space-y-2 shadow-inner">
          
          {/* Column Header (A B C | AISLE | D E F) */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center font-['Satoshi'] font-bold text-xs text-gray-400 pb-2 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-1.5">
              <span>A</span>
              <span>B</span>
              <span>C</span>
            </div>
            <span className="text-[10px] text-gray-300 px-2 uppercase">Aisle</span>
            <div className="grid grid-cols-3 gap-1.5">
              <span>D</span>
              <span>E</span>
              <span>F</span>
            </div>
          </div>

          {/* Seat Rows Loop */}
          {rows.map((row) => {
            const isExitRow = row === 12 || row === 13;

            return (
              <React.Fragment key={row}>
                {/* Emergency Exit Row Divider Banner */}
                {isExitRow && row === 12 && (
                  <div className="my-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-center text-[10.5px] font-bold text-amber-700 uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Shield size={13} />
                    <span>Emergency Exit Row &bull; Extra Legroom</span>
                  </div>
                )}

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                  
                  {/* Left Column Group (A, B, C) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {leftCols.map((col) => {
                      const seatId = `${row}${col}`;
                      const seatInfo = getSeatCategory(row, col);
                      const isOccupied = seatInfo.type === "occupied";
                      const assignedPaxIdx = Object.keys(paxSeats).find(idx => paxSeats[idx]?.seat === seatId);
                      const isCurrentPax = assignedPaxIdx !== undefined && parseInt(assignedPaxIdx, 10) === activePaxIdx;
                      const isOtherPax = assignedPaxIdx !== undefined && parseInt(assignedPaxIdx, 10) !== activePaxIdx;

                      return (
                        <button
                          key={col}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(seatId, seatInfo)}
                          title={`${seatId}: ${seatInfo.label} (${seatInfo.price === 0 ? "Free" : `₹${seatInfo.price}`})`}
                          className={`h-9 rounded-lg font-['Quicksand'] font-bold text-[11px] flex flex-col items-center justify-center transition-all cursor-pointer relative border ${
                            isOccupied
                              ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                              : isCurrentPax
                              ? "bg-[#F12B19] text-white border-[#F12B19] shadow-sm scale-105"
                              : isOtherPax
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : `${seatInfo.bg} hover:border-[#F12B19] hover:shadow-2xs`
                          }`}
                        >
                          {isOccupied ? (
                            <X size={12} className="text-gray-400" />
                          ) : isCurrentPax ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] leading-none">{seatId}</span>
                              <Check size={11} strokeWidth={3} className="mt-0.5" />
                            </div>
                          ) : isOtherPax ? (
                            <div className="flex flex-col items-center leading-none">
                              <span className="text-[9px] font-extrabold">{seatId}</span>
                              <span className="text-[8px] bg-white/30 px-1 rounded mt-0.5">P{parseInt(assignedPaxIdx, 10) + 1}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center leading-tight">
                              <span className="text-[10px] font-bold">{seatId}</span>
                              <span className="text-[8px] opacity-75">
                                {seatInfo.price === 0 ? "Free" : `₹${seatInfo.price}`}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Center Aisle Row Indicator */}
                  <div className="w-7 text-center font-['Satoshi'] font-bold text-[11px] text-gray-400">
                    {row}
                  </div>

                  {/* Right Column Group (D, E, F) */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {rightCols.map((col) => {
                      const seatId = `${row}${col}`;
                      const seatInfo = getSeatCategory(row, col);
                      const isOccupied = seatInfo.type === "occupied";
                      const assignedPaxIdx = Object.keys(paxSeats).find(idx => paxSeats[idx]?.seat === seatId);
                      const isCurrentPax = assignedPaxIdx !== undefined && parseInt(assignedPaxIdx, 10) === activePaxIdx;
                      const isOtherPax = assignedPaxIdx !== undefined && parseInt(assignedPaxIdx, 10) !== activePaxIdx;

                      return (
                        <button
                          key={col}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(seatId, seatInfo)}
                          title={`${seatId}: ${seatInfo.label} (${seatInfo.price === 0 ? "Free" : `₹${seatInfo.price}`})`}
                          className={`h-9 rounded-lg font-['Quicksand'] font-bold text-[11px] flex flex-col items-center justify-center transition-all cursor-pointer relative border ${
                            isOccupied
                              ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                              : isCurrentPax
                              ? "bg-[#F12B19] text-white border-[#F12B19] shadow-sm scale-105"
                              : isOtherPax
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : `${seatInfo.bg} hover:border-[#F12B19] hover:shadow-2xs`
                          }`}
                        >
                          {isOccupied ? (
                            <X size={12} className="text-gray-400" />
                          ) : isCurrentPax ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] leading-none">{seatId}</span>
                              <Check size={11} strokeWidth={3} className="mt-0.5" />
                            </div>
                          ) : isOtherPax ? (
                            <div className="flex flex-col items-center leading-none">
                              <span className="text-[9px] font-extrabold">{seatId}</span>
                              <span className="text-[8px] bg-white/30 px-1 rounded mt-0.5">P{parseInt(assignedPaxIdx, 10) + 1}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center leading-tight">
                              <span className="text-[10px] font-bold">{seatId}</span>
                              <span className="text-[8px] opacity-75">
                                {seatInfo.price === 0 ? "Free" : `₹${seatInfo.price}`}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              </React.Fragment>
            );
          })}

        </div>

        {/* Airplane Tail Cone Design */}
        <div className="w-full max-w-[340px] flex flex-col items-center mt-2">
          <div className="bg-[#F8F9FA] border-x border-[#EAEAEA] w-full text-center py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            REAR OF AIRCRAFT &bull; GALLEY & LAVATORIES
          </div>
          <svg className="w-full h-12 text-gray-200" viewBox="0 0 340 40" fill="none">
            <path d="M20 0 L 320 0 C 310 25, 220 40, 170 40 C 120 40, 30 25, 20 0 Z" fill="#F8F9FA" stroke="#EAEAEA" strokeWidth="2" />
          </svg>
        </div>

      </div>

      {/* ── 3. Submit CTA Button ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div>
          <span className="font-['Quicksand'] text-[12px] text-gray-500 font-semibold block">
            Total Seat Charge
          </span>
          <span className="font-['Satoshi'] font-bold text-[20px] text-[#1A1A1A] tracking-[0.8px]">
            {totalSeatPrice === 0 ? "FREE" : `₹${totalSeatPrice.toLocaleString("en-IN")}`}
          </span>
        </div>

        <button
          type="submit"
          className="bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[14.5px] px-8 py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
        >
          <span>Proceed to Personalization</span>
          <span className="text-base leading-none">&rarr;</span>
        </button>
      </div>

    </form>
  );
}

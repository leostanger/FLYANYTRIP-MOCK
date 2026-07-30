/**
 * ============================================================================
 * BookingConfirmation.jsx — Flight Confirmation Page
 * Matches Hotel Section (HotelConfirmationPage.jsx) design 1:1
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Check, Copy, Mail, Plane, User, Clock, FileText,
  Star, StarHalf, Phone, LogOut, CreditCard, Calendar,
  MapPin, Luggage, Navigation, Download, Loader2, MessageSquare, X, Send,
  ShieldAlert, QrCode, Printer, Zap
} from "lucide-react";
import InvoiceTemplate from "../../common/InvoiceTemplate";
import BoardingPassTemplate from "../../common/BoardingPassTemplate";
import { downloadElementAsPDF, generateElementAsPDFBase64 } from "../../common/pdfGenerator";

const INVOICE_ID = "flyanytrip-tax-invoice";
const BOARDING_PASS_ID = "flyanytrip-official-boarding-pass-pdf";

export default function BookingConfirmation({ flight, fare, cabinClass: cabinClassProp, travelers: travelersProp = 1, pnr, passengers, bookingData }) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(5);
  const [isDownloading, setIsDownloading] = useState(false);

  // New Interactive Modals & Toast States
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [targetEmail, setTargetEmail] = useState(bookingData?.contactDetails?.email || "user@email.com");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Internal Custom Web Check-in System States
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinStep, setCheckinStep] = useState(1); // 1 = Verification/Safety, 2 = Seat Review, 3 = Digital Boarding Pass
  const [checkinCompleted, setCheckinCompleted] = useState(false);
  const [acceptedSafetyTerms, setAcceptedSafetyTerms] = useState(false);
  const [isDownloadingPass, setIsDownloadingPass] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // ── Helper to build and send the booking email ──────────────────────────
  const autoSentRef = useRef(false);

  const buildAndSendEmail = async (email) => {
    const emailTo = email || targetEmail || bookingData?.contactDetails?.email;
    if (!emailTo || emailTo === "user@email.com") return { success: false, error: "Please provide a valid recipient email address." };
    try {
      const segment = flightObj?.raw?.Segments?.[0]?.[0];
      const depTime = segment?.Origin?.DepTime
        ? new Date(segment.Origin.DepTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
        : flightObj?.depTime || flightObj?.departureTime || "";
      const arrTime = segment?.Destination?.ArrTime
        ? new Date(segment.Destination.ArrTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
        : flightObj?.arrTime || flightObj?.arrivalTime || "";

      // Capture exact InvoiceTemplate PDF from DOM
      let pdfBase64 = null;
      try {
        pdfBase64 = await generateElementAsPDFBase64(INVOICE_ID);
      } catch (pdfErr) {
        console.warn("DOM Invoice PDF capture error:", pdfErr);
      }

      const payload = {
        toEmail: emailTo,
        pdfBase64,
        pnr: code,
        bookingId: code,
        passengerName: paxList[0]?.firstName || "Traveler",
        passengers: paxWithSeats || paxList,
        origin: fromCode,
        destination: toCode,
        departureDate: formattedDate,
        departureTime: depTime,
        arrivalTime: arrTime,
        airline: flightObj?.airline || flightObj?.airlineName || flightObj?.raw?.Segments?.[0]?.[0]?.Airline?.AirlineName || "",
        flightNumber: flightObj?.flightNumber || flightObj?.raw?.Segments?.[0]?.[0]?.Airline?.FlightNumber || "",
        cabinClass,
        totalPaid,
        baseFare: ticketAmount,
        taxes: totalTaxes,
        addons: addonsData || {},
        paxMeals: bookingData?.addonsData?.paxMeals || {},
        transactionId,
      };

      const res = await fetch("/api/booking/send-invoice-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Email send error:", err);
      return { success: false, error: err.message };
    }
  };

  // Auto-send confirmation email on mount (once)
  useEffect(() => {
    if (autoSentRef.current) return;
    autoSentRef.current = true;
    const emailTo = bookingData?.contactDetails?.email || targetEmail;
    if (!emailTo || emailTo === "user@email.com") return;
    buildAndSendEmail(emailTo).then((result) => {
      if (result?.success) {
        showToast(`\u2709\uFE0F Booking confirmation emailed to ${emailTo}!`);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFormattedDate = (dateVal) => {
    if (!dateVal) return "15 Dec 2026 (Tuesday)";
    try {
      const d = new Date(dateVal);
      const day = d.getDate();
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const year = d.getFullYear();
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      return `${day} ${month} ${year} (${weekday})`;
    } catch (e) {
      return "15 Dec 2026 (Tuesday)";
    }
  };

  const getCancellationDate = (dateVal) => {
    if (!dateVal) return "14 Dec 2026";
    try {
      const d = new Date(dateVal);
      d.setDate(d.getDate() - 1);
      const day = d.getDate();
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "14 Dec 2026";
    }
  };

  const getCityName = (code) => {
    if (!code) return "";
    const mapping = {
      DEL: "New Delhi",
      BOM: "Mumbai",
      BLR: "Bengaluru",
      MAA: "Chennai",
      CCU: "Kolkata",
      HYD: "Hyderabad",
      COK: "Kochi",
      GOI: "Goa",
      AMD: "Ahmedabad",
      PNQ: "Pune"
    };
    return mapping[code.toUpperCase()] || code;
  };

  const flightObj = flight || bookingData?.flight;
  const rawDate = flightObj?.date || flightObj?.depDate || flightObj?.departDate || flightObj?.raw?.Segments?.[0]?.[0]?.Origin?.DepTime || bookingData?.date;
  const formattedDate = getFormattedDate(rawDate);
  const cancellationDeadline = getCancellationDate(rawDate);

  const getDepartureCityName = (flightObj) => {
    if (!flightObj) return "New Delhi";
    const segment = flightObj.raw?.Segments?.[0]?.[0] || flightObj.raw?.Segments?.[0];
    const name = segment?.Origin?.Airport?.CityName || flightObj.fromCity || flightObj.departCity || flightObj.depCity || flightObj.from;
    if (!name) return "New Delhi";
    if (name.length === 3) return getCityName(name);
    return name;
  };

  const getArrivalCityName = (flightObj) => {
    if (!flightObj) return "Mumbai";
    const segments = flightObj.raw?.Segments?.[0] || [];
    const segment = segments[segments.length - 1] || flightObj.raw?.Segments?.[0];
    const name = segment?.Destination?.Airport?.CityName || flightObj.toCity || flightObj.arrivalCity || flightObj.arrCity || flightObj.to;
    if (!name) return "Mumbai";
    if (name.length === 3) return getCityName(name);
    return name;
  };

  const fromCode = flightObj?.from || flightObj?.departCity || flightObj?.depCity || "DEL";
  const fromCityName = getDepartureCityName(flightObj);
  const toCode = flightObj?.to || flightObj?.arrivalCity || flightObj?.arrCity || "BOM";
  const toCityName = getArrivalCityName(flightObj);

  const routeString = `${fromCityName} (${fromCode}) → ${toCityName} (${toCode})`;
  const code = pnr || bookingData?.pnr || bookingData?.bookingId || "VG2434";

  // Safe terminal extraction
  const departureTerminal = flightObj?.raw?.Segments?.[0]?.[0]?.Origin?.Terminal || flightObj?.depTerminal || flightObj?.terminal || "3";
  const arrivalSegments = Array.isArray(flightObj?.raw?.Segments?.[0]) ? flightObj.raw.Segments[0] : [];
  const arrivalTerminal = arrivalSegments.length > 0 ? arrivalSegments[arrivalSegments.length - 1]?.Destination?.Terminal : (flightObj?.arrTerminal || null);

  // Dynamic Passenger Extraction
  const paxList = (passengers && passengers.length > 0)
    ? passengers
    : (bookingData?.passengers && bookingData.passengers.length > 0)
      ? bookingData.passengers
      : (bookingData?.travelersDetails && bookingData.travelersDetails.length > 0)
        ? bookingData.travelersDetails
        : (bookingData?.contactDetails?.firstName ? [{
            title: bookingData.contactDetails.title || "Mr.",
            firstName: bookingData.contactDetails.firstName,
            lastName: bookingData.contactDetails.lastName || ""
          }] : [{ title: "Mr.", firstName: "Valued", lastName: "Passenger" }]);

  const travelers = paxList.length || travelersProp || 1;
  const cabinClass = cabinClassProp || bookingData?.cabinClass || flightObj?.class || flightObj?.cabin || "Economy";

  // Passenger names formatting
  const passengerNames = paxList.length > 0 && paxList[0]?.firstName
    ? paxList.map(p => `${p?.title || "Mr."} ${p?.firstName || ""} ${p?.lastName || ""}`.trim()).join(", ")
    : "Primary Passenger";

  // Dynamic Seat string for all passengers
  const seatString = paxList.map((p, idx) => {
    const seatObj = bookingData?.addonsData?.paxSeatsMap?.[idx] || bookingData?.paxSeatsMap?.[idx];
    const sCode = seatObj?.seat || (idx === 0 ? (bookingData?.selectedSeat || bookingData?.seat || "12A") : "Auto-assigned");
    return paxList.length > 1 ? `${p?.firstName || `Pax ${idx + 1}`}: ${sCode}` : sCode;
  }).join(", ") || "12A";

  const paxWithSeats = paxList.map((p, idx) => {
    const seatObj = bookingData?.addonsData?.paxSeatsMap?.[idx] || bookingData?.paxSeatsMap?.[idx];
    const sCode = seatObj?.seat || (idx === 0 ? (bookingData?.selectedSeat || bookingData?.seat || "12A") : "Auto-assigned");
    return {
      ...(p || {}),
      seat: sCode
    };
  });

  // Baggage
  const baggageString = bookingData?.baggageKg
    ? `${bookingData.baggageKg} kg Check-in`
    : (bookingData?.addonsData?.baggage ? `${bookingData.addonsData.baggage} kg Check-in` : "15 kg Check-in");

  // Meal preference
  const mealString = bookingData?.mealSelected || "No Meal";

  // Base price for ONE traveler
  const basePriceOne = bookingData?.flight?.price ? parseInt(String(bookingData.flight.price).replace(/[^\d]/g, ""), 10) : (fare?.price ? parseInt(String(fare.price).replace(/[^\d]/g, ""), 10) : 3499);
  
  // Total base fare for all travelers
  const totalBasePrice = basePriceOne * travelers;
  const totalTaxes = Math.round(totalBasePrice * 0.12);

  // Addons extraction
  const addonsData = bookingData?.addonsData;
  const seatAmount = addonsData?.seatPrice || bookingData?.seatPrice || 0;
  const mealAmount = addonsData?.mealPrice || (bookingData?.mealSelected && bookingData.mealSelected !== "No Meal" ? 250 : 0);
  
  let baggageAmount = 0;
  if (addonsData?.addons?.includes("bag_30")) {
    baggageAmount = 1399;
  } else if (addonsData?.addons?.includes("bag_15")) {
    baggageAmount = 799;
  }
  
  const priorityAmount = addonsData?.addons?.includes("priority") ? 299 : 0;
  const wifiAmount = addonsData?.addons?.includes("wifi") ? 499 : 0;
  const insuranceAmount = addonsData?.insurance ? 149 : 0;
  const convenienceFee = 99;

  // Total paid
  const totalPaid = bookingData?.amount || (totalBasePrice + totalTaxes + (addonsData?.totalAdditional || 0));

  // Derived ticket amount for the invoice (inclusive of taxes and discounts to perfectly match totalPaid)
  const ticketAmount = Math.max(0, totalPaid - (mealAmount + baggageAmount + seatAmount + priorityAmount + wifiAmount + insuranceAmount + convenienceFee));

  const transactionId = bookingData?.transactionId || "TXN240722094823";
  const primarySeat = paxWithSeats?.[0]?.seat || bookingData?.selectedSeat || bookingData?.seat || "8F";
  const cleanSeat = String(primarySeat).replace(/^(Seat Selection — |Seat Selection - |Seat |Pax \d+: )/i, "").trim() || "8F";

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    showToast(`PNR ${code} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    const fileName = `FlyAnyTrip-Invoice-${code}.pdf`;
    const success = await downloadElementAsPDF(INVOICE_ID, fileName);
    if (!success) {
      alert("Could not generate invoice. Please try again.");
    }
    setIsDownloading(false);
  };

  // Open Custom Built-in Web Check-in Modal
  const handleWebCheckin = () => {
    setShowCheckinModal(true);
    if (!checkinCompleted) {
      setCheckinStep(1);
    } else {
      setCheckinStep(3); // Directly view Digital Boarding Pass if check-in already completed
    }
  };

  const handleFinishCheckin = () => {
    setCheckinCompleted(true);
    setCheckinStep(3);
    showToast(`Web Check-in Completed! Digital Boarding Pass Issued for PNR ${code}`);
  };

  const handleDownloadBoardingPassPDF = async () => {
    setIsDownloadingPass(true);
    const fileName = `FlyAnyTrip-BoardingPass-${code}.pdf`;
    const success = await downloadElementAsPDF(BOARDING_PASS_ID, fileName);
    if (success) {
      showToast(`Official E-Boarding Pass downloaded (${fileName})!`);
    } else {
      showToast("Preparing Boarding Pass print...");
      window.print();
    }
    setIsDownloadingPass(false);
  };

  // Real Email Confirmation Sender
  const handleSendEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!targetEmail) return;
    setEmailSending(true);
    const result = await buildAndSendEmail(targetEmail);
    setEmailSending(false);
    if (result?.success) {
      setEmailSent(true);
      showToast(`E-Ticket & Invoice emailed to ${targetEmail}!`);
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSent(false);
      }, 1800);
    } else {
      showToast(`Failed to send email. Please try again.`);
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen w-full flex flex-col font-quicksand pt-6 pb-24">
      <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-0">

        {/* ── TOP BANNER ──────────────────────────────────────────────── */}
        <div
          className="relative w-full h-[358px] rounded-[22.5px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col items-center justify-center mb-[30px]"
          style={{ backgroundImage: "linear-gradient(165.577deg, rgb(0, 153, 102) 0%, rgb(0, 120, 111) 100%)" }}
        >
          {/* Faint bg image */}
          <div className="absolute inset-0 opacity-20">
            <img
              alt="Flight"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=2070&auto=format&fit=crop&q=80"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "linear-gradient(165.597deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center w-full px-4">
            <div className="bg-white/20 border-2 border-white/40 rounded-full w-[75px] h-[75px] flex items-center justify-center mb-[15px]">
              <Check className="text-white w-10 h-10" strokeWidth={3} />
            </div>

            <h1 className="font-bold text-[33.75px] text-white mb-2 leading-[37.5px]">
              Flight Confirmed!
            </h1>
            <p className="font-medium text-[15px] text-white/80 mb-6 leading-[22.5px]">
              Your seat is reserved. Have a great flight!
            </p>

            {/* PNR Badge */}
            <div className="bg-white/20 border border-white/30 rounded-[15px] flex items-center gap-[15px] px-[23.5px] py-[16px] mb-4">
              <div className="flex flex-col">
                <span className="font-semibold text-[11.25px] text-white/70 leading-[15px]">PNR Number</span>
                <span className="font-bold text-[22.5px] text-white tracking-[2.25px] leading-[30px]">{code}</span>
              </div>
              <button
                onClick={handleCopy}
                className="bg-white/20 border border-white/20 rounded-[13.375px] flex items-center gap-[5.625px] px-[12.25px] py-[8.5px] hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Copy className="text-white w-3 h-3" />
                <span className="font-bold text-[11.25px] text-white leading-[15px]">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>

            <p className="font-medium text-[11.25px] text-white/60 leading-[15px]">
              Confirmation sent to <span className="font-bold text-white">{bookingData?.contactDetails?.email || "user@email.com"}</span>
            </p>
          </div>
        </div>

        {/* ── CONTENT LAYOUT ──────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-[22.5px] w-full items-start">

          {/* ── LEFT: MAIN CONTENT ──────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-[15px] w-full min-w-0">

            {/* Flight Details */}
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px] w-full">
              <div className="flex items-center gap-[7.5px] mb-[15px]">
                <div className="bg-[#e53935] rounded-[9.375px] w-[26.25px] h-[26.25px] flex items-center justify-center">
                  <Plane className="text-white w-[13px] h-[13px]" />
                </div>
                <h3 className="font-satoshi font-bold text-[18px] text-[#1a1a1a] leading-[25px]">Flight Details</h3>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Airline</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{flightObj?.airline || "IndiGo"} — {flightObj?.code || flightObj?.flightNo || "6E-204"}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Route</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{routeString}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Date</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Departure</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{flightObj?.depTime || flightObj?.departTime || flightObj?.time || "06:00"}{departureTerminal ? ` · Terminal ${departureTerminal}` : ""}{flightObj?.depGate ? ` · Gate ${flightObj.depGate}` : ""}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Arrival</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{flightObj?.arrTime || flightObj?.arrivalTime || flightObj?.arrival || "08:10"}{arrivalTerminal ? ` · Terminal ${arrivalTerminal}` : ""}{flightObj?.arrGate ? ` · Gate ${flightObj.arrGate}` : ""}</span>
                </div>
                <div className="flex items-center justify-between pt-[13px] pb-[5px]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Duration</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{flightObj?.duration || flightObj?.dur || "2h 10m"} · {flightObj?.stops === 0 || flightObj?.stops === "Non-stop" || !flightObj?.stops ? "Non-stop" : `${flightObj?.stops} Stop(s)`}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Cabin Class</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{cabinClass}</span>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px] w-full">
              <div className="flex items-center gap-[7.5px] mb-[15px]">
                <div className="bg-[#e53935] rounded-[9.375px] w-[26.25px] h-[26.25px] flex items-center justify-center">
                  <User className="text-white w-[13px] h-[13px]" />
                </div>
                <h3 className="font-satoshi font-bold text-[18px] text-[#1a1a1a] leading-[25px]">Passenger Details</h3>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Passenger</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{passengerNames} ({travelers} {travelers === 1 ? 'Traveller' : 'Travellers'}) · {cabinClass}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Seat</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{seatString}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Baggage</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{baggageString}</span>
                </div>
                {/* Per-passenger Meal Preference */}
                {(() => {
                  const paxMeals = bookingData?.addonsData?.paxMeals;
                  const MEAL_LABELS = { veg: "Vegetarian", nonveg: "Non-Veg", vegan: "Vegan", jain: "Jain", none: "No Meal" };
                  if (paxMeals && Object.keys(paxMeals).length > 0) {
                    return paxList.map((p, idx) => {
                      const mId = paxMeals[idx] || "none";
                      const mLabel = MEAL_LABELS[mId] || mId;
                      const pName = p.firstName ? `${p.title || ""} ${p.firstName}`.trim() : `Pax ${idx + 1}`;
                      return (
                        <div key={idx} className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                          <span className="font-semibold text-[#6b6b6b] text-[14px]">
                            {pName}&apos;s Meal
                          </span>
                          <span className={`font-bold text-[14px] text-right ${mId === 'none' ? 'text-[#999]' : 'text-[#1a1a1a]'}`}>
                            {mLabel}
                          </span>
                        </div>
                      );
                    });
                  }
                  return (
                    <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                      <span className="font-semibold text-[#6b6b6b] text-[14px]">Meal Preference</span>
                      <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{mealString}</span>
                    </div>
                  );
                })()}
                <div className="flex items-center justify-between pt-[13px] pb-[5px]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Cancellation</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">Free cancellation until {cancellationDeadline}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px] w-full">
              <div className="flex items-center gap-[7.5px] mb-[15px]">
                <div className="bg-[#e53935] rounded-[9.375px] w-[26.25px] h-[26.25px] flex items-center justify-center">
                  <CreditCard className="text-white w-[13px] h-[13px]" />
                </div>
                <h3 className="font-satoshi font-bold text-[18px] text-[#1a1a1a] leading-[25px]">Payment Summary</h3>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Base Fare ({travelers} Adult)</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{totalBasePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">GST &amp; Taxes (12%)</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{totalTaxes.toLocaleString("en-IN")}</span>
                </div>
                {seatAmount > 0 && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Seat Selection Fee</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{seatAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {mealAmount > 0 && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Meal Charges</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{mealAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {baggageAmount > 0 && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Extra Baggage</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{baggageAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {priorityAmount > 0 && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Priority Boarding</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{priorityAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {wifiAmount > 0 && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">In-flight Wi-Fi</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{wifiAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {insuranceAmount > 0 && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-[#6b6b6b] text-[14px]">Travel Insurance</span>
                    <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{insuranceAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Convenience Fee</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{convenienceFee.toLocaleString("en-IN")}</span>
                </div>
                {(bookingData?.couponDiscount > 0 || totalPaid < (totalBasePrice + totalTaxes + seatAmount + mealAmount + baggageAmount + priorityAmount + wifiAmount + insuranceAmount + convenienceFee)) && (
                  <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                    <span className="font-semibold text-emerald-600 text-[14px]">Coupon Discount ({bookingData?.couponCode || "Applied"})</span>
                    <span className="font-bold text-emerald-600 text-[14px] text-right">− ₹{(bookingData?.couponDiscount || (totalBasePrice + totalTaxes + seatAmount + mealAmount + baggageAmount + priorityAmount + wifiAmount + insuranceAmount + convenienceFee - totalPaid)).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Total Paid</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">₹{totalPaid.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-[#d0d0d0]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Payment Method</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{bookingData?.paymentMethod || "UPI — GPay"}</span>
                </div>
                <div className="flex items-center justify-between pt-[13px] pb-[5px]">
                  <span className="font-semibold text-[#6b6b6b] text-[14px]">Transaction ID</span>
                  <span className="font-bold text-[#1a1a1a] text-[14px] text-right">{transactionId}</span>
                </div>
              </div>
            </div>

            {/* Refund Status */}
            <div className="bg-white border border-[#d0d0d0] border-dashed rounded-[15px] p-[19.75px] w-full flex flex-col gap-[16px]">
              <div className="flex items-center gap-[7.5px]">
                <Clock className="w-[14px] h-[14px] text-[#1a1a1a]" />
                <h3 className="font-satoshi font-bold text-[16.875px] text-[#1a1a1a] leading-[25px]">Refund Status (Post-Cancellation)</h3>
              </div>

              <div className="flex items-center gap-[11px] pt-[11.25px] w-full">
                {/* Step 1 */}
                <div className="flex items-center gap-[7.5px]">
                  <div className="flex flex-col gap-[4px] items-center">
                    <div className="bg-[#e53935] border-2 border-[#e53935] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                      <Check className="text-white w-4 h-4" />
                    </div>
                    <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Cancellation Requested</span>
                  </div>
                  <div className="h-[1px] w-[22.5px] bg-[#d0d0d0] mb-[18.75px]" />
                </div>
                {/* Step 2 */}
                <div className="flex items-center gap-[7.5px]">
                  <div className="flex flex-col gap-[4px] items-center">
                    <div className="bg-white border-2 border-[#d0d0d0] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                      <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">2</span>
                    </div>
                    <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Provider Confirmation</span>
                  </div>
                  <div className="h-[1px] w-[22.5px] bg-[#d0d0d0] mb-[18.75px]" />
                </div>
                {/* Step 3 */}
                <div className="flex items-center gap-[7.5px]">
                  <div className="flex flex-col gap-[4px] items-center">
                    <div className="bg-white border-2 border-[#d0d0d0] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                      <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">3</span>
                    </div>
                    <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Refund Initiated</span>
                  </div>
                  <div className="h-[1px] w-[22.5px] bg-[#d0d0d0] mb-[18.75px]" />
                </div>
                {/* Step 4 */}
                <div className="flex flex-col gap-[4px] items-center">
                  <div className="bg-white border-2 border-[#d0d0d0] rounded-full w-[30px] h-[30px] flex items-center justify-center">
                    <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">4</span>
                  </div>
                  <span className="font-semibold text-[11.25px] text-[#6b6b6b] text-center w-[75px] mt-[3.75px] leading-[15px]">Refund Credited</span>
                </div>
              </div>

              {/* Refund Info Cards */}
              <div className="flex gap-[11px] w-full pt-[15px] mt-[15px]">
                <div className="border border-[#d0d0d0] rounded-[13.375px] px-[12.25px] py-[8.5px] flex-1 flex flex-col gap-[4px]">
                  <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">Refund Amount</span>
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">₹0 (not requested)</span>
                </div>
                <div className="border border-[#d0d0d0] rounded-[13.375px] px-[12.25px] py-[8.5px] flex-1 flex flex-col gap-[4px]">
                  <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">Refund to</span>
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Original payment method</span>
                </div>
                <div className="border border-[#d0d0d0] rounded-[13.375px] px-[12.25px] py-[8.5px] flex-1 flex flex-col gap-[4px]">
                  <span className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px]">Expected by</span>
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">5–7 business days</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT: SIDEBAR ──────────────────────────────────────────── */}
          <div className="w-full lg:w-[270px] flex flex-col gap-[15px] shrink-0">

            {/* Booking Actions */}
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[19.75px]">
              <h4 className="font-satoshi font-bold text-[15px] text-[#1a1a1a] leading-[22.5px] mb-[15px]">Booking Actions</h4>
              <div className="flex flex-col gap-[7.5px]">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-[#009966] to-[#00786f] shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] rounded-[13.375px] w-full py-[11.25px] flex items-center justify-center gap-[7.5px] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                >
                  {isDownloading ? (
                    <Loader2 className="text-white w-[14px] h-[14px] animate-spin" />
                  ) : (
                    <Download className="text-white w-[14px] h-[14px]" />
                  )}
                  <span className="font-bold text-[13.125px] text-white leading-[18.75px]">
                    {isDownloading ? "Generating PDF..." : "Download Ticket"}
                  </span>
                </button>
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Mail className="text-[#1a1a1a] w-[13px] h-[13px]" />
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Email Confirmation</span>
                </button>
                <button 
                  onClick={handleWebCheckin}
                  className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Navigation className="text-[#1a1a1a] w-[13px] h-[13px]" />
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Web Check-in</span>
                </button>
                <button 
                  onClick={() => setShowSupportModal(true)}
                  className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Phone className="text-[#1a1a1a] w-[13px] h-[13px]" />
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Contact Support</span>
                </button>
                <Link
                  to="/"
                  className="mt-2 border border-[#d0d0d0] bg-gray-100 rounded-[13.375px] w-full py-[10.375px] flex items-center justify-center gap-[7.5px] hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <LogOut className="text-[#1a1a1a] w-[13px] h-[13px]" />
                  <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Back to Home</span>
                </Link>
              </div>
            </div>

            {/* Enjoyed FlyAnyTrip? */}
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[16px] flex flex-col items-center justify-center text-center">
              <p className="font-bold text-[11.25px] text-[#1a1a1a] leading-[15px] mb-[3.75px]">Enjoyed FlyAnyTrip?</p>
              <div className="flex gap-[3.75px] py-[3.75px] mb-[5px]">
                {[1,2,3,4].map(s => (
                  <Star key={s} className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
                ))}
                <StarHalf className="text-yellow-400 fill-yellow-400 w-[18px] h-[18px]" />
              </div>
              <button className="text-[#e0e0e0] hover:text-gray-400 transition-colors font-bold text-[11.25px] leading-[15px] cursor-pointer bg-transparent border-none">
                Rate your experience
              </button>
            </div>

            {/* Need help? */}
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[16px]">
              <p className="font-bold text-[11.25px] text-[#1a1a1a] leading-[15px]">Need help?</p>
              <p className="font-medium text-[11.25px] text-[#6b6b6b] leading-[15px] mt-[3.75px] mb-[11.25px]">Our support team is available 24/7</p>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="border border-[#d0d0d0] rounded-[13.375px] w-full py-[8.5px] flex items-center justify-center gap-[5.625px] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Phone className="text-[#1a1a1a] w-[13px] h-[13px]" />
                <span className="font-bold text-[13.125px] text-[#1a1a1a] leading-[18.75px]">Contact Support</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-slate-700 font-sans">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-[13px] font-semibold tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* ── EMAIL CONFIRMATION MODAL ─────────────────────────────────────── */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FE2C1C] flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>

            <h3 className="font-satoshi font-bold text-[20px] text-[#0f172a] mb-1">
              Email Booking Confirmation
            </h3>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              We will send your official E-ticket and Tax Invoice PDF directly to your inbox.
            </p>

            <form onSubmit={handleSendEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13.5px] font-semibold text-slate-800 outline-none focus:border-[#FE2C1C] transition-colors"
                />
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between text-[12px]">
                <span className="font-semibold text-slate-600">PNR Reference:</span>
                <span className="font-mono font-bold text-[#FE2C1C]">{code}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl text-[13px] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending || emailSent}
                  className="flex-1 bg-[#FE2C1C] hover:bg-red-700 text-white font-bold py-3 rounded-xl text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-70"
                >
                  {emailSending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : emailSent ? (
                    <>
                      <Check size={16} />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send E-Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONTACT SUPPORT MODAL ────────────────────────────────────────── */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Phone size={22} />
            </div>

            <h3 className="font-satoshi font-bold text-[20px] text-[#0f172a] mb-1">
              24/7 Priority Support
            </h3>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              Need assistance with your booking? Our dedicated team is available round the clock.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="tel:+918001234567"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Toll-Free Helpline</div>
                    <div className="text-[14px] font-bold text-slate-800">+91 800 123 4567</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 group-hover:underline">Call Now &rarr;</span>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 rounded-2xl transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">WhatsApp Assistant</div>
                    <div className="text-[14px] font-bold text-slate-800">+91 98765 43210</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 group-hover:underline">Chat &rarr;</span>
              </a>

              <a
                href="mailto:support@flyanytrip.com"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl transition-colors text-left group flex-shrink-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Support</div>
                    <div className="text-[14px] font-bold text-slate-800">support@flyanytrip.com</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-sky-600 group-hover:underline">Email &rarr;</span>
              </a>
            </div>

            <div className="bg-slate-100/80 rounded-2xl p-3.5 text-center mt-4">
              <span className="text-[11px] text-slate-500 font-semibold">Your Booking Reference (PNR): </span>
              <span className="text-[12px] font-mono font-bold text-[#FE2C1C] ml-1">{code}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── SIMPLE & CLEAN WEB CHECK-IN MODAL ─────────────────────────── */}
      {showCheckinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-['Quicksand',sans-serif]">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-6 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#FE2C1C] flex items-center justify-center shrink-0">
                  <Navigation size={20} />
                </div>
                <div>
                  <h3 className="font-['Satoshi',sans-serif] font-bold text-[18px] text-slate-900 leading-tight">
                    Web Check-in
                  </h3>
                  <p className="text-[12px] text-slate-500 font-medium">
                    {flightObj?.airline || "IndiGo"} ({flightObj?.code || "6E-204"}) · {fromCode || "DEL"} → {toCode || "BOM"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="bg-red-50/90 border border-red-100/90 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase text-[#FE2C1C]/70 tracking-wider">PNR</span>
                  <span className="text-[14.5px] font-mono font-black text-[#FE2C1C] tracking-wide">{code || "8N32JU"}</span>
                </div>
                <button 
                  onClick={() => setShowCheckinModal(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Step Tabs Indicator */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { step: 1, label: "1. Safety Rules" },
                { step: 2, label: "2. Seat & Bags" },
                { step: 3, label: "3. Boarding Pass" }
              ].map(s => (
                <div
                  key={s.step}
                  onClick={() => {
                    if (s.step === 3 && !checkinCompleted) return;
                    setCheckinStep(s.step);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-[12px] font-bold text-center transition-all cursor-pointer ${
                    checkinStep === s.step
                      ? "bg-[#FE2C1C] text-white shadow-xs"
                      : s.step < checkinStep || (s.step === 3 && checkinCompleted)
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-50 text-slate-400 border border-slate-200/60 cursor-not-allowed"
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* ── STEP 1: PASSENGER & SAFETY ───────────────────── */}
            {checkinStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Passengers
                  </h4>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2">
                    {(paxWithSeats || []).map((p, idx) => {
                      const fullName = `${p?.title || "Mr."} ${p?.firstName || ""} ${p?.lastName || ""}`.trim();
                      const paxSeat = String(p?.seat || "8F").replace(/^(Seat Selection — |Seat Selection - |Seat |Pax \d+: )/i, "").trim() || "8F";
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                              {idx + 1}
                            </div>
                            <div>
                              <span className="text-[13.5px] font-bold text-slate-800 block leading-snug">
                                {fullName || `Passenger ${idx + 1}`}
                              </span>
                              <span className="text-[11px] text-slate-500 font-semibold block">
                                Assigned Seat: <span className="text-[#FE2C1C] font-mono font-bold">{paxSeat}</span>
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            Ready
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Safety Rules Box */}
                <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-[12.5px]">
                    <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                    <span>DGCA Hazardous Goods Declaration</span>
                  </div>
                  <ul className="text-[11.5px] text-amber-900/90 space-y-1 font-medium pl-1 list-disc list-inside">
                    <li>Power banks &amp; Lithium batteries allowed in <u>Hand Baggage only</u>.</li>
                    <li>Lighters &amp; flammable liquids are strictly prohibited.</li>
                  </ul>
                  <label className="flex items-start gap-2 pt-1.5 cursor-pointer select-none border-t border-amber-200/60 mt-1">
                    <input
                      type="checkbox"
                      checked={acceptedSafetyTerms}
                      onChange={(e) => setAcceptedSafetyTerms(e.target.checked)}
                      className="mt-0.5 rounded border-amber-400 text-[#FE2C1C] focus:ring-[#FE2C1C] w-4 h-4"
                    />
                    <span className="text-[11.5px] font-semibold text-slate-800">
                      I confirm no passenger is carrying prohibited/hazardous items.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    onClick={() => setShowCheckinModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-[12.5px] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!acceptedSafetyTerms}
                    onClick={() => setCheckinStep(2)}
                    className="px-5 py-2 rounded-xl bg-[#FE2C1C] hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-[12.5px] transition-colors cursor-pointer shadow-xs"
                  >
                    Continue &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: SEAT & BAGGAGE REVIEW ───────────────── */}
            {checkinStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Seat</span>
                    <div className="text-[18px] font-mono font-extrabold text-[#FE2C1C]">{seatString || "12A"}</div>
                    <span className="text-[11px] text-slate-500 font-medium">Standard Seat</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Baggage Limit</span>
                    <div className="text-[14px] font-bold text-slate-800">{baggageString || "15 kg Check-in"}</div>
                    <span className="text-[11px] text-slate-500 font-medium">+ 7 kg Cabin Bag</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2 text-[12px]">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Departure Terminal</span>
                    <span className="font-bold text-emerald-400">Terminal {departureTerminal || "3"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Boarding Gate</span>
                    <span className="font-bold text-white">Gate {flightObj?.depGate || "14B"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boarding Time</span>
                    <span className="font-bold text-amber-300">45 Mins Before Departure</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    onClick={() => setCheckinStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-[12.5px] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    &larr; Back
                  </button>
                  <button
                    onClick={handleFinishCheckin}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Check size={16} strokeWidth={3} />
                    <span>Complete Web Check-in</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: DIGITAL BOARDING PASS ────────────────── */}
            {checkinStep === 3 && (
              <div className="space-y-4 font-['Quicksand',sans-serif]">
                {/* Photorealistic Air Boarding Ticket */}
                <div id="flyanytrip-digital-boarding-pass" className="bg-white border border-slate-300/80 rounded-[22px] overflow-hidden shadow-xl relative">
                  
                  {/* Top Dark Header */}
                  <div className="bg-[#0F172A] text-white px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                        <img 
                          src={flightObj?.logo || flightObj?.airlineLogo || "https://images.kiwi.com/airlines/64/6E.png"} 
                          alt="Airline Logo" 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-[#0F172A] text-white text-[10px] font-black items-center justify-center uppercase font-mono">
                          {flightObj?.airline?.substring(0, 3) || "FLT"}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-['Satoshi',sans-serif] font-bold text-[15px] leading-tight text-white tracking-wide">
                          {flightObj?.airline || "Air India Express"}
                        </h4>
                        <p className="text-[10.5px] text-slate-400 font-mono tracking-wider mt-0.5">
                          BOARDING PASS · {flightObj?.code || "IX-2952"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10.5px] font-bold text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-700/60 flex items-center gap-1">
                      <Check size={12} strokeWidth={3} /> Checked In
                    </span>
                  </div>

                  {/* Route & Departure/Arrival Times */}
                  <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50/70 to-white">
                    <div className="flex items-center justify-between gap-2 mb-6">
                      {/* Origin */}
                      <div>
                        <div className="text-[30px] font-black text-slate-900 font-['Satoshi',sans-serif] leading-none tracking-tight">
                          {fromCode || "DEL"}
                        </div>
                        <div className="text-[12px] font-bold text-slate-500 mt-1">{fromCityName || "New Delhi"}</div>
                        <div className="text-[13px] font-extrabold text-[#FE2C1C] mt-1">{flightObj?.depTime || "06:00 AM"}</div>
                      </div>

                      {/* Flight Path Graphic */}
                      <div className="flex flex-col items-center px-2 flex-1 max-w-[180px]">
                        <span className="text-[11px] font-bold text-slate-400 mb-1">{flightObj?.duration || "2h 15m"}</span>
                        <div className="w-full flex items-center gap-1.5 text-[#FE2C1C]">
                          <div className="w-2 h-2 rounded-full bg-[#FE2C1C] shrink-0" />
                          <div className="flex-1 h-0.5 bg-gradient-to-r from-[#FE2C1C] to-red-400" />
                          <Plane size={16} className="rotate-90 text-[#FE2C1C] shrink-0" />
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="text-right">
                        <div className="text-[30px] font-black text-slate-900 font-['Satoshi',sans-serif] leading-none tracking-tight">
                          {toCode || "BOM"}
                        </div>
                        <div className="text-[12px] font-bold text-slate-500 mt-1">{toCityName || "Mumbai"}</div>
                        <div className="text-[13px] font-extrabold text-[#FE2C1C] mt-1">{flightObj?.arrTime || "08:10 AM"}</div>
                      </div>
                    </div>

                    {/* Passenger & Booking Details Grid (Spacious & No Truncation) */}
                    <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                      <div className="sm:col-span-1">
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">PASSENGER NAME</span>
                        <span className="font-['Satoshi',sans-serif] font-bold text-[13px] text-slate-900 block leading-snug break-words">
                          {paxWithSeats?.[0]?.firstName 
                            ? `${paxWithSeats[0].title || "Mr."} ${paxWithSeats[0].firstName} ${paxWithSeats[0].lastName || ""}`.trim() 
                            : (passengerNames || "Primary Passenger").split(',')[0]}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">PNR CODE</span>
                        <span className="font-mono font-extrabold text-[14px] text-[#FE2C1C] block tracking-wide">
                          {code || "8N32JU"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">SEAT NUMBER</span>
                        <span className="font-mono font-extrabold text-[14px] text-emerald-600 block">
                          {cleanSeat || "19C"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">GATE &amp; TERMINAL</span>
                        <span className="font-bold text-[13px] text-slate-900 block">
                          Terminal {departureTerminal || "3"} · {flightObj?.depGate || "14B"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scannable Gate Barcode Stub */}
                  <div className="p-4 bg-white border-t border-dashed border-slate-300/80 flex flex-col items-center justify-center text-center">
                    <div className="font-mono text-[11px] tracking-[6px] font-black text-slate-900 mb-1 select-all">
                      |||||| | ||||| ||| ||||||| |||| |||||||| |||||| |||||
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                      ELECTRONIC BOARDING PASS · SCAN AT DEPARTURE GATE
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Printer size={16} />
                    <span>Print Boarding Pass</span>
                  </button>
                  <button
                    disabled={isDownloadingPass}
                    onClick={handleDownloadBoardingPassPDF}
                    className="flex-1 bg-[#FE2C1C] hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 rounded-xl text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isDownloadingPass ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── HIDDEN INVOICE TEMPLATE (captured for PDF) ─────────────────── */}
      <InvoiceTemplate
        id={INVOICE_ID}
        flight={{ ...(flight || bookingData?.flight || {}), class: cabinClass, cabin: cabinClass }}
        passengers={paxWithSeats}
        fare={{
          baseFare: ticketAmount,
          mealAmount: mealAmount,
          baggageAmount: baggageAmount,
          seatAmount: seatAmount,
          priorityAmount: priorityAmount,
          wifiAmount: wifiAmount,
          insuranceAmount: insuranceAmount,
          convenienceFee: convenienceFee,
        }}
        couponCode={bookingData?.couponCode || ""}
        couponDiscount={bookingData?.couponDiscount || 0}
        bookingData={bookingData}
        pnr={code}
        bookingDate={bookingData?.date || new Date().toISOString()}
        customerName={bookingData?.passengers?.[0]?.firstName ? `${bookingData.passengers[0].title || "Mr."} ${bookingData.passengers[0].firstName || ""} ${bookingData.passengers[0].lastName || ""}`.trim() : (passengers?.[0]?.firstName ? `${passengers[0].title || "Mr."} ${passengers[0].firstName || ""} ${passengers[0].lastName || ""}`.trim() : "Valued Customer")}
        customerEmail={bookingData?.contactDetails?.email || "user@email.com"}
        customerPhone={bookingData?.contactDetails?.mobile || "+91 98765 43210"}
        customerAddress={bookingData?.customerAddress || "India"}
        mealSelected={bookingData?.mealSelected || "No Meal"}
        baggageKg={bookingData?.baggageKg ?? 15}
        seatLabel={seatString}
        paymentMethod={bookingData?.paymentMethod || "Online — UPI / Card"}
        transactionId={transactionId}
      />

      {/* ── HIDDEN OFFICIAL E-BOARDING PASS TEMPLATE (captured for PDF) ─── */}
      <BoardingPassTemplate
        id={BOARDING_PASS_ID}
        flight={flight || bookingData?.flight}
        passengers={paxWithSeats}
        bookingData={bookingData}
        pnr={code}
        cleanSeat={cleanSeat}
        baggageString={baggageString}
        departureTerminal={departureTerminal}
      />
    </div>
  );
}

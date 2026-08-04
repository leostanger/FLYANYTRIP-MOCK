/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/BookingPage.jsx
 * DESCRIPTION: Flights booking step-by-step layout assembler page.
 * ============================================================================
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Home, Loader2, Plane } from "lucide-react";
import DownloadInvoiceButton from "../../common/DownloadInvoiceButton";
import { saveBooking } from "../../common/useBookings";
import { fetchAPI } from "../../services/api";

// Global layout wrappers
import Header from "../../common/Header";
import Footer from '../common/Footer';

// Step forms
import BookingSteps from "./BookingSteps";
import BookingInfo from "./BookingInfo";
import BookingSeat from "./BookingSeat";
import BookingPersonalize from "./BookingPersonalize";
import BookingPayment from "./BookingPayment";
import BookingSummary from "./BookingSummary";
import FareSummary from "./FareSummary";
import BookingConfirmation from "./BookingConfirmation";
import SearchSummary from "./result/components/SearchSummary";

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback default flight configuration
  const defaultFlight = {
    id: 1,
    logo: "https://images.kiwi.com/airlines/64/6E.png",
    airline: "IndiGo",
    code: "6E-204",
    depTime: "06:00",
    arrTime: "08:10",
    duration: "2h 10m",
    stops: "Non-stop",
    price: "₹3,499",
    save: "Save ₹500",
    flexi: "Flexi ₹3,399",
    business: "Business ₹7,797",
    badge: "Cheapest",
    isLCC: true
  };

  // Retrieve parameters passed from the flight list page with sessionStorage caching fallback
  const getInitialFlight = () => {
    const stateFlight = location.state?.flight;
    if (stateFlight) {
      sessionStorage.setItem("selectedFlight", JSON.stringify(stateFlight));
      return stateFlight;
    }
    const cachedFlight = sessionStorage.getItem("selectedFlight");
    if (cachedFlight) {
      try {
        return JSON.parse(cachedFlight);
      } catch (e) {
        console.warn("Failed to parse cached flight:", e);
      }
    }
    return defaultFlight;
  };

  const getInitialFare = () => {
    const stateFare = location.state?.fare;
    if (stateFare) {
      sessionStorage.setItem("selectedFare", JSON.stringify(stateFare));
      return stateFare;
    }
    const cachedFare = sessionStorage.getItem("selectedFare");
    if (cachedFare) {
      try {
        return JSON.parse(cachedFare);
      } catch (e) {
        console.warn("Failed to parse cached fare:", e);
      }
    }
    return { title: "Anytrip Special", price: 3499 };
  };

  const getInitialSearchContext = () => {
    const stateContext = location.state?.searchContext;
    if (stateContext) {
      sessionStorage.setItem("searchContext", JSON.stringify(stateContext));
      return stateContext;
    }
    const cachedContext = sessionStorage.getItem("searchContext");
    if (cachedContext) {
      try {
        return JSON.parse(cachedContext);
      } catch (e) {
        console.warn("Failed to parse cached searchContext:", e);
      }
    }
    return {};
  };

  const flight = getInitialFlight();
  const fare = getInitialFare();
  const searchContext = getInitialSearchContext();
  const searchAdults = Math.max(1, parseInt(searchContext.adults || 1, 10));
  const searchChildren = Math.max(0, parseInt(searchContext.children || 0, 10));
  const cabinClass = searchContext.cabinClass || "Economy";

  // Stepper state: 1 = Info, 2 = Seat, 3 = Personalize, 4 = Payment
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [addonsData, setAddonsData] = useState({
    meal: "none",
    addons: [],
    insurance: false,
    totalAdditional: 0
  });
  const [bookingData, setBookingData] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmStage, setConfirmStage] = useState(0);

  const loadingStages = [
    { title: "Verifying Payment", desc: "Confirming your transaction details securely..." },
    { title: "Contacting Airline", desc: "Securing your seats and checking availability..." },
    { title: "Registering Passengers", desc: "Saving passenger details and issuing e-ticket..." },
    { title: "Finalizing Booking", desc: "Creating your booking record and generating invoice..." }
  ];

  React.useEffect(() => {
    if (!isConfirming) {
      setConfirmStage(0);
      return;
    }
    const interval = setInterval(() => {
      setConfirmStage(prev => (prev < 3 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [isConfirming]);

  // Passenger & Contact info state from Step 1
  // Auto-populate passenger slots based on search query (adults + children)
  const buildInitialPassengers = () => {
    const paxList = [];
    for (let i = 0; i < searchAdults; i++) {
      paxList.push({ id: i + 1, title: "Mr.", firstName: "", lastName: "", dob: "", nationality: "Indian", type: "Adult" });
    }
    for (let i = 0; i < searchChildren; i++) {
      paxList.push({ id: searchAdults + i + 1, title: "Master", firstName: "", lastName: "", dob: "", nationality: "Indian", type: "Child" });
    }
    return paxList.length > 0 ? paxList : [{ id: 1, title: "Mr.", firstName: "", lastName: "", dob: "", nationality: "Indian", type: "Adult" }];
  };
  const [contactDetails, setContactDetails] = useState({ mobile: "", email: "" });
  const [passengers, setPassengers] = useState(() => buildInitialPassengers());

  // Dynamic Fare Calculations
  const basePriceOne = fare.price ? parseInt(String(fare.price).replace(/[^\d]/g, ""), 10) || 3499 : 3499;
  const paxCount = passengers.length || 1;
  const basePrice = basePriceOne * paxCount;
  const taxes = Math.round(basePrice * 0.12); // ~12% Taxes & Fees
  const additionalAmount = addonsData.totalAdditional || 0;
  const couponDiscount = addonsData.couponDiscount || 0;
  const totalAmount = Math.max(0, basePrice + taxes + additionalAmount - couponDiscount);

  // Setup history interception on mount
  React.useEffect(() => {
    window.history.replaceState({ step: 1 }, "");

    const handlePopState = (event) => {
      if (event.state && typeof event.state.step === "number") {
        setStep(event.state.step);
      } else {
        navigate("/flights");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Auto instant jump to top on step change (no animation)
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Custom step transition helper that pushes state to browser history
  const goToStep = (targetStep) => {
    setStep(targetStep);
    window.history.pushState({ step: targetStep }, "");
    window.scrollTo(0, 0);
  };

  const handleStep1Continue = ({ contactInfo, passengers: paxList }) => {
    if (contactInfo) setContactDetails(contactInfo);
    if (paxList) setPassengers(paxList);
    goToStep(2);
  };

  const handleSeatSelect = (primarySeat, totalSeatFee = 0, paxSeatsMap = {}) => {
    setSelectedSeat(primarySeat || "12A");
    setAddonsData(prev => {
      const currentAddons = prev.totalAdditional - (prev.seatPrice || 0);
      return {
        ...prev,
        seatPrice: totalSeatFee,
        paxSeatsMap: paxSeatsMap,
        totalAdditional: currentAddons + totalSeatFee
      };
    });
  };

  const handlePay = async (paymentResult) => {
    const finalAmount = paymentResult?.amount || totalAmount;
    const finalCouponCode = paymentResult?.couponCode || addonsData?.couponCode || "";
    const finalCouponDiscount = paymentResult?.couponDiscount || addonsData?.couponDiscount || 0;

    setIsConfirming(true);

    try {
      // 1. Sync to backend first and wait for response using unified fetchAPI helper
      console.log("Sending confirmation via fetchAPI to /booking/confirm...");
      
      const resJson = await fetchAPI("/booking/confirm", {
        method: "POST",
        body: JSON.stringify({
          traceId: flight?.traceId || flight?.raw?.traceId || "mock_trace_default",
          resultIndex: flight?.resultIndex || flight?.raw?.resultIndex || "1",
          isLCC: flight?.isLCC !== undefined ? flight?.isLCC : (flight?.raw?.isLCC !== undefined ? flight?.raw?.isLCC : (flight?.raw?.IsLCC !== undefined ? flight?.raw?.IsLCC : false)),
          passengers: passengers.map((p, idx) => {
            const pSeat = addonsData.paxSeatsMap?.[idx]?.seat || (idx === 0 ? selectedSeat : null);
            const rawTitle = p.title || "Mr";
            const cleanTitle = rawTitle.replace(/\./g, ""); // Strip any dot
            return {
              Title: cleanTitle,
              FirstName: p.firstName || "Rahul",
              LastName: p.lastName || "Sharma",
              DateOfBirth: p.dob || "1990-08-15",
              Seat: pSeat ? { Code: pSeat } : undefined
            };
          }),
          contactDetails,
          ssrSelections: {
            seats: passengers.map((p, idx) => {
              const pSeatObj = addonsData.paxSeatsMap?.[idx];
              return {
                paxIdx: idx,
                code: pSeatObj?.seat || (idx === 0 ? selectedSeat : "Auto-assigned"),
                price: pSeatObj?.price || 0
              };
            }),
            meals: passengers.map((p, idx) => {
              const mealSel = addonsData.mealSelections?.find(m => m.paxIdx === idx);
              return {
                paxIdx: idx,
                name: mealSel ? mealSel.name : "No Meal",
                price: mealSel ? mealSel.price : 0
              };
            }),
            baggage: passengers.map((p, idx) => {
              const baggageSel = addonsData.baggageSelections?.find(b => b.paxIdx === idx);
              return {
                paxIdx: idx,
                weight: baggageSel ? baggageSel.weight : "None",
                price: baggageSel ? baggageSel.price : 0
              };
            })
          },
          flightSnapshot: flight,
          totalAmount: finalAmount
        })
      });

      console.log("Confirmation Response:", resJson);

      if (resJson.success && resJson.data) {
        const backendBooking = resJson.data.booking;
        const backendFlightBooking = resJson.data.flightBooking;

        // 2. Save locally with the REAL booking ID and PNR from database
        const saved = saveBooking("Flight", {
          id: backendBooking.booking_id,
          pnr: backendFlightBooking.pnr,
          flight,
          fare,
          contactDetails,
          passengers,
          cabinClass,
          selectedSeat: selectedSeat || "12A",
          seatPrice: addonsData.seatPrice || 0,
          travelers: passengers.length || 1,
          amount: finalAmount,
          addonsData: addonsData,
          couponCode: finalCouponCode,
          couponDiscount: finalCouponDiscount,
          couponApplied: !!finalCouponCode,
          mealSelected: addonsData.mealSelections?.find(m => m.price > 0)?.name || (addonsData.meal === "veg" ? "Vegetarian Meal" : addonsData.meal === "nonveg" ? "Non-Vegetarian Meal" : addonsData.meal === "vegan" ? "Vegan Meal" : addonsData.meal === "jain" ? "Jain Meal" : "No Meal"),
          baggageKg: (() => {
            const hasBag30 = addonsData.addons?.some(a => a.includes("bag_30"));
            const hasBag15 = addonsData.addons?.some(a => a.includes("bag_15"));
            if (hasBag30) return 30;
            if (hasBag15) return 15;
            if (addonsData.baggageSelections?.length > 0) {
              const weightStr = addonsData.baggageSelections[0].weight;
              const weightVal = parseInt(weightStr, 10);
              if (!isNaN(weightVal)) return weightVal;
            }
            return 15;
          })(),
          seatLabel: selectedSeat ? `${selectedSeat} - ${cabinClass}` : `12A - ${cabinClass}`,
        });

        const finalBooking = {
          ...saved,
          id: backendBooking.booking_id,
          pnr: backendFlightBooking.pnr,
          flight,
          passengers,
          amount: finalAmount,
          date: backendBooking.created_at || new Date().toISOString()
        };

        setBookingData(finalBooking);
        goToStep(5);
      } else {
        alert("Booking confirmation failed: " + (resJson.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      let extraInfo = "";
      if (err.message.includes("fetch") || err.message.includes("API Error")) {
        extraInfo = "\n\nTroubleshooting tips:\n" +
          "1. Ensure the backend server is running in the terminal on port 5000.\n" +
          "2. If the frontend is loaded over HTTPS (e.g. on Vercel), the browser will block requests to HTTP localhost. Run the frontend locally on http://localhost:5173 for testing.\n" +
          "3. Restart the frontend Vite dev server (Ctrl+C and npm run dev) so it picks up the latest environment configuration.";
      }
      alert("Error confirming booking: " + err.message + extraInfo);
    } finally {
      setIsConfirming(false);
    }
  };

  // If step 5, render confirmation full-page (same as HotelConfirmationPage)
  if (step === 5) {
    const currentData = bookingData || { pnr: "VG2434", flight, passengers };
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <div className="flex-grow">
          <BookingConfirmation
            flight={flight}
            fare={fare}
            cabinClass={cabinClass}
            travelers={passengers?.length || 1}
            pnr={currentData?.pnr || "VG2434"}
            passengers={passengers}
            bookingData={currentData}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // If database save/ticketing is in progress, render a premium loading screen with skeletons
  if (isConfirming) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between font-sans text-gray-800 relative overflow-hidden">
        <Header />
        
        {/* Main Content Area with Skeleton Shimmer */}
        <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow relative">
          
          {/* Mock Search Summary skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Mock Step Navigation skeleton */}
          <div className="mb-6 bg-white border border-gray-100 rounded-xl p-3 animate-pulse flex justify-around">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>

          {/* Mock Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative opacity-45 select-none pointer-events-none">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Flight details card skeleton */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-32 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Passenger Card skeleton */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="w-36 h-5 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Fare Summary skeleton */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="w-28 h-5 bg-gray-200 rounded"></div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between"><div className="w-20 h-4 bg-gray-200 rounded"></div><div className="w-12 h-4 bg-gray-200 rounded"></div></div>
                  <div className="flex justify-between"><div className="w-16 h-4 bg-gray-200 rounded"></div><div className="w-12 h-4 bg-gray-200 rounded"></div></div>
                  <div className="border-t pt-3 flex justify-between"><div className="w-24 h-5 bg-gray-200 rounded"></div><div className="w-16 h-5 bg-gray-200 rounded"></div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Floating Loading Spinner & Alert over Skeleton */}
          <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center p-4 gap-6">
            <Loader2 className="w-12 h-12 text-[#F12B19] animate-spin" />
            <div className="flex items-center gap-2.5 bg-white border border-gray-100/80 px-4 py-2.5 rounded-full shadow-md text-gray-600 font-satoshi text-[12px] font-bold tracking-wide uppercase select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F12B19] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F12B19]"></span>
              </span>
              <span>Do not close or refresh this page</span>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between font-sans">
      
      {/* 1. Global Header (Unmodified) */}
      <Header />

      {/* 2. Main Page Layout Wrapper */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
        
        {/* Search Summary Top Bar */}
        <SearchSummary onModify={() => navigate("/flights")} />

        {/* Step Navigation Indicator */}
        <div className="mb-6">
          <BookingSteps currentStep={step} />
        </div>

        {/* Form and Summary grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column - Stepper Form Console */}
          <div className="lg:col-span-8 space-y-4">
            
            {step === 1 && (
              <BookingInfo 
                onContinue={handleStep1Continue} 
                initialContact={contactDetails}
                initialPassengers={passengers}
              />
            )}

            {step === 2 && (
              <BookingSeat 
                flight={flight}
                passengers={passengers}
                onContinue={() => goToStep(3)} 
                onSeatSelect={handleSeatSelect} 
              />
            )}

            {step === 3 && (
              <BookingPersonalize 
                flight={flight}
                passengers={passengers}
                onContinue={() => goToStep(4)} 
                onAddonsUpdate={setAddonsData}
              />
            )}

            {step === 4 && (
              <BookingPayment 
                flight={flight} 
                selectedFare={fare} 
                passengers={passengers}
                contactDetails={contactDetails}
                addonsData={addonsData}
                totalAmount={basePrice + taxes + additionalAmount} 
                onCouponUpdate={(cData) => {
                  setAddonsData(prev => ({
                    ...prev,
                    couponCode: cData.couponCode,
                    couponDiscount: cData.couponDiscount,
                    couponApplied: cData.couponApplied
                  }));
                }}
                onPay={handlePay} 
              />
            )}

          </div>

          {/* Right Column - Booking Summary & Fare Summary separated */}
          <div className="lg:col-span-4 space-y-4">
            <BookingSummary flight={flight} />
            
            <FareSummary 
              basePrice={basePrice} 
              taxes={taxes} 
              additionalAmount={additionalAmount} 
              couponCode={addonsData?.couponCode}
              couponDiscount={addonsData?.couponDiscount}
              couponApplied={addonsData?.couponApplied}
              totalAmount={totalAmount} 
            />
          </div>

        </div>

      </div>

      {/* 3. Global Footer (Unmodified) */}
      <Footer />

    </div>
  );
}

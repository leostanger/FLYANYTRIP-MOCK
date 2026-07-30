/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/BookingPage.jsx
 * DESCRIPTION: Flights booking step-by-step layout assembler page.
 * ============================================================================
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Home } from "lucide-react";
import DownloadInvoiceButton from "../../common/DownloadInvoiceButton";
import { saveBooking } from "../../common/useBookings";

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
    badge: "Cheapest"
  };

  // Retrieve parameters passed from the flight list page
  const flight = location.state?.flight || defaultFlight;
  const fare = location.state?.fare || { title: "Anytrip Special", price: 3499 };
  const searchContext = location.state?.searchContext || {};
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

    // 1. Save locally for instant E-Ticket & My Bookings rendering
    const saved = saveBooking("Flight", {
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
      mealSelected: addonsData.meal === "veg" ? "Vegetarian Meal" : addonsData.meal === "nonveg" ? "Non-Vegetarian Meal" : addonsData.meal === "vegan" ? "Vegan Meal" : addonsData.meal === "jain" ? "Jain Meal" : "No Meal",
      baggageKg: addonsData.addons?.includes("bag_30") ? 30 : addonsData.addons?.includes("bag_15") ? 15 : 15,
      seatLabel: selectedSeat ? `${selectedSeat} - ${cabinClass}` : `12A - ${cabinClass}`,
    });

    const finalBooking = saved || {
      id: Math.random().toString(36).substring(2, 9),
      pnr: "VG2434",
      flight,
      passengers,
      amount: finalAmount,
      date: new Date().toISOString()
    };

    // 2. INSTANT UI STEP TRANSITION (Do NOT await network request)
    setBookingData(finalBooking);
    goToStep(5);

    // 3. Asynchronously sync to backend in background
    fetch("/api/booking/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        traceId: flight?.traceId || "trace_live_01",
        resultIndex: flight?.resultIndex || "1",
        passengers: passengers.map((p, idx) => {
          const pSeat = addonsData.paxSeatsMap?.[idx]?.seat || (idx === 0 ? selectedSeat : null);
          return {
            Title: p.title || "Mr.",
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
          })
        },
        flightSnapshot: flight,
        totalAmount: finalAmount
      })
    }).catch(err => console.warn("Backend API sync warning:", err.message));
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

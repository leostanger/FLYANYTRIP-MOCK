/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingPayment.jsx
 * DESCRIPTION: Pre-Confirmation Payment page with Razorpay & Demo Payment Options
 *              and working Coupon Code discount integration.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import {
  Lock, Smartphone, CreditCard, Building2, Wallet,
  Tag, ChevronRight, Check, Info, Shield, Zap
} from "lucide-react";

import gpayLogo from '../../assets/hotels/gpay.svg';
import bhimLogo from '../../assets/hotels/bhim.svg';
import phonepayLogo from '../../assets/hotels/phonepay.svg';
import paytmLogo from '../../assets/hotels/paytm.svg';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function BookingPayment({ flight, selectedFare, passengers = [], contactDetails = {}, addonsData = {}, totalAmount = 3499, onCouponUpdate, onPay }) {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("razorpay"); // 'razorpay' or 'demo'
  const [couponCode, setCouponCode]                       = useState(addonsData?.couponCode || "");
  const [couponDiscount, setCouponDiscount]               = useState(addonsData?.couponDiscount || 0);
  const [couponApplied, setCouponApplied]                 = useState(!!addonsData?.couponApplied);
  const [couponError, setCouponError]                     = useState("");
  const [couponSuccessMsg, setCouponSuccessMsg]           = useState(addonsData?.couponCode ? `Coupon '${addonsData.couponCode}' applied!` : "");
  const [loading, setLoading]                             = useState(false);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const primaryPax = passengers?.[0];
  const paxName = primaryPax?.firstName ? `${primaryPax.title || "Mr."} ${primaryPax.firstName} ${primaryPax.lastName}`.trim() : "Primary Passenger";
  const paxCount = passengers.length || 1;

  const basePriceOne = selectedFare?.price ? parseInt(String(selectedFare.price).replace(/[^\d]/g, ""), 10) || 3499 : 3499;
  const basePrice = basePriceOne * paxCount;
  const taxes = Math.round(basePrice * 0.12);
  const addonsTotal = addonsData?.totalAdditional || 0;
  
  // Dynamic Final Amount calculation
  const finalPayAmount = couponApplied ? Math.max(0, totalAmount - couponDiscount) : totalAmount;

  // Coupon Handlers
  const handleApplyCoupon = (codeToApply = null) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a valid coupon code.");
      setCouponApplied(false);
      setCouponDiscount(0);
      if (onCouponUpdate) onCouponUpdate({ couponCode: "", couponDiscount: 0, couponApplied: false });
      return;
    }

    let discount = 200;
    if (code === "HDFC15") {
      discount = 500;
    } else if (code === "FIRSTFLY") {
      discount = 300;
    } else if (code === "FLY200") {
      discount = 200;
    }

    setCouponCode(code);
    setCouponDiscount(discount);
    setCouponApplied(true);
    setCouponError("");
    setCouponSuccessMsg(`Coupon '${code}' applied successfully! You saved ₹${discount}.`);

    if (onCouponUpdate) {
      onCouponUpdate({ couponCode: code, couponDiscount: discount, couponApplied: true });
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponError("");
    setCouponSuccessMsg("");
    if (onCouponUpdate) {
      onCouponUpdate({ couponCode: "", couponDiscount: 0, couponApplied: false });
    }
  };

  // 1. Razorpay Gateway Handler
  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();
      
      let orderId = null;
      let orderAmount = Math.round(finalPayAmount * 100);

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
        const res = await fetch(`${baseUrl}/payment/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalPayAmount })
        });
        const data = await res.json();
        if (data?.success && data?.data?.orderId) {
          orderId = data.data.orderId;
          orderAmount = data.data.amount;
        }
      } catch (e) {
        console.warn("Backend order creation warning:", e.message);
      }

      if (window.Razorpay) {
        const options = {
          key: "rzp_test_RH0I6LBnmc0Ziz",
          amount: orderAmount,
          currency: "INR",
          name: "FlyAnyTrip",
          description: `Flight Ticket - ${flight?.from || flight?.departCity || 'DEL'} → ${flight?.to || flight?.arrivalCity || 'BOM'}`,
          order_id: orderId || undefined,
          prefill: {
            name: paxName,
            email: contactDetails?.email || "user@email.com",
            contact: contactDetails?.mobile || "9876543210"
          },
          theme: { color: "#F12B19" },
          handler: async function (response) {
            console.log("Razorpay Payment Success:", response);
            if (onPay) await onPay({ ...response, amount: finalPayAmount, couponApplied, couponCode, couponDiscount });
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay payment gateway loading... Please try again.");
      }
    } catch (err) {
      console.error("Razorpay initiation error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Instant Demo Payment Handler
  const handleDemoPayment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const demoResponse = {
        razorpay_payment_id: "pay_demo_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        razorpay_order_id: "order_demo_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        razorpay_signature: "demo_signature",
        amount: finalPayAmount,
        couponApplied,
        couponCode,
        couponDiscount,
        isDemo: true
      };
      if (onPay) {
        await onPay(demoResponse);
      }
    } catch (err) {
      console.error("Demo payment execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Main Submit Router
  const handleMainPayClick = () => {
    if (selectedPaymentOption === "razorpay") {
      handleRazorpayPayment();
    } else {
      handleDemoPayment();
    }
  };

  return (
    <div className="space-y-5 font-['Quicksand'] text-left select-none">

      {/* ── 1. PASSENGER & TRIP CONFIRMATION STRIP ─────────────────────── */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-[#00C950] flex items-center justify-center flex-shrink-0">
            <Check size={11} strokeWidth={3} className="text-white" />
          </div>
          <span className="font-['Satoshi'] font-bold text-[14px] text-[#1A1A1A]">Trip &amp; Passenger Details Confirmed</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#F8F8F8] rounded-xl px-4 py-3">
            <p className="font-['Quicksand'] text-[10.5px] text-[#999999] font-semibold uppercase tracking-wide mb-0.5">Passenger</p>
            <p className="font-['Satoshi'] font-bold text-[13.5px] text-[#1A1A1A]">
              {paxName} {paxCount > 1 ? `(+${paxCount - 1} more)` : ''}
            </p>
          </div>
          <div className="bg-[#F8F8F8] rounded-xl px-4 py-3">
            <p className="font-['Quicksand'] text-[10.5px] text-[#999999] font-semibold uppercase tracking-wide mb-0.5">Flight</p>
            <p className="font-['Satoshi'] font-bold text-[13.5px] text-[#1A1A1A]">
              {flight?.airline || "Airlines"} · {flight?.flight || flight?.code || "Flight"}
            </p>
          </div>
          <div className="bg-[#F8F8F8] rounded-xl px-4 py-3">
            <p className="font-['Quicksand'] text-[10.5px] text-[#999999] font-semibold uppercase tracking-wide mb-0.5">Route &amp; Date</p>
            <p className="font-['Satoshi'] font-bold text-[13.5px] text-[#1A1A1A]">
              {flight?.from || flight?.departCity || "DEL"} → {flight?.to || flight?.arrivalCity || "BOM"} · {flight?.date || "Departure"}
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. FARE BREAKDOWN ──────────────────────────────────────────── */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <h3 className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A] mb-4">Price Breakdown</h3>
        <div className="space-y-3 text-[13.5px]">
          <div className="flex justify-between items-center">
            <span className="font-['Quicksand'] font-medium text-[#555555]">Base Fare ({paxCount} Passenger{paxCount > 1 ? 's' : ''})</span>
            <span className="font-['Satoshi'] font-bold text-[#1A1A1A] tracking-[0.5px]">₹{basePrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-['Quicksand'] font-medium text-[#555555]">Taxes &amp; Fees</span>
            <span className="font-['Satoshi'] font-bold text-[#1A1A1A] tracking-[0.5px]">₹{taxes.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-['Quicksand'] font-medium text-[#555555]">Seats &amp; Add-on Services</span>
            <span className="font-['Satoshi'] font-bold text-[#1A1A1A] tracking-[0.5px]">₹{addonsTotal.toLocaleString("en-IN")}</span>
          </div>
          {couponApplied && (
            <div className="flex justify-between items-center text-emerald-600">
              <span className="font-['Quicksand'] font-semibold">Coupon Discount ({couponCode})</span>
              <span className="font-['Satoshi'] font-bold tracking-[0.5px]">− ₹{couponDiscount.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>
        <div className="border-t border-[#F0F0F0] mt-4 pt-4 flex justify-between items-center">
          <span className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A]">Total Payable</span>
          <span className="font-['Satoshi'] font-bold text-[24px] text-[#1A1A1A] tracking-[0.8px]">
            ₹{finalPayAmount.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* ── 3. COUPON CODE SECTION ─────────────────────────────────────── */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] px-5 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-[#F12B19]" />
            <h3 className="font-['Satoshi'] font-bold text-[15px] text-[#1A1A1A]">Apply Coupon</h3>
          </div>
          {couponApplied && (
            <button 
              type="button" 
              onClick={handleRemoveCoupon} 
              className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
            >
              Remove Coupon
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={couponCode}
            onChange={e => {
              setCouponCode(e.target.value.toUpperCase());
              if (couponApplied) handleRemoveCoupon();
              setCouponError("");
            }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyCoupon();
              }
            }}
            placeholder="Enter coupon code (e.g. HDFC15, FLY200)"
            className="flex-1 border border-[#E0E0E0] rounded-xl px-4 py-3 font-['Quicksand'] text-[13px] font-semibold text-[#333333] placeholder-[#BBBBBB] outline-none focus:border-[#F12B19] uppercase tracking-wider transition-colors"
          />
          <button
            type="button"
            onClick={() => handleApplyCoupon()}
            className="bg-[#F12B19] text-white font-['Quicksand'] font-bold px-6 py-3 rounded-xl text-[13px] hover:bg-red-700 transition-colors cursor-pointer flex-shrink-0 shadow-xs"
          >
            Apply
          </button>
        </div>

        {/* Coupon Suggestion Badges (Clicking populates input box only; coupon applies on clicking Apply button) */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          {[
            { code: "HDFC15", label: "HDFC15 (₹500 OFF)" },
            { code: "FLY200", label: "FLY200 (₹200 OFF)" },
            { code: "FIRSTFLY", label: "FIRSTFLY (₹300 OFF)" }
          ].map(item => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setCouponCode(item.code);
                setCouponError("");
              }}
              className={`border text-[11px] px-3 py-1.5 rounded-lg cursor-pointer uppercase tracking-wider font-bold transition-all ${
                couponCode === item.code
                  ? "border-[#F12B19] bg-[#FFF8F8] text-[#F12B19] shadow-xs"
                  : "border-[#EAEAEA] text-[#777777] hover:border-[#F12B19] hover:text-[#F12B19]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Success / Error Notifications */}
        {couponApplied && couponSuccessMsg && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check size={15} className="text-emerald-600" strokeWidth={2.5} />
              <span className="font-['Quicksand'] text-[12.5px] font-semibold text-emerald-700">{couponSuccessMsg}</span>
            </div>
          </div>
        )}

        {couponError && (
          <p className="text-[11.5px] text-red-500 font-semibold mt-2 flex items-center gap-1">
            ⚠️ {couponError}
          </p>
        )}
      </div>

      {/* ── 4. PAYMENT OPTIONS SECTION (RAZORPAY & DEMO) ──────────────── */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A]">Select Payment Mode</h3>
            <p className="font-['Quicksand'] text-[12px] text-[#888888] font-medium mt-0.5">
              Choose Razorpay Gateway or Instant Demo Payment
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            🔒 100% Secure
          </span>
        </div>

        {/* OPTION 1: RAZORPAY PAYMENT GATEWAY */}
        <div 
          onClick={() => setSelectedPaymentOption("razorpay")}
          className={`border-2 rounded-2xl p-4 md:p-5 transition-all cursor-pointer relative ${
            selectedPaymentOption === "razorpay"
              ? "border-[#F12B19] bg-[#FFF8F8] shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPaymentOption === "razorpay" ? "border-[#F12B19] bg-[#F12B19]" : "border-gray-300"
              }`}>
                {selectedPaymentOption === "razorpay" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-['Satoshi'] font-bold text-[15px] text-[#1A1A1A]">
                    Razorpay Gateway Option
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#E8F0FE] text-[#1A73E8]">
                    UPI / Cards / NetBanking
                  </span>
                </div>
                <p className="font-['Quicksand'] text-[12px] text-[#666666] font-medium mt-1">
                  Pay securely using Google Pay, PhonePe, Paytm, Credit/Debit Cards, or NetBanking via Razorpay.
                </p>
              </div>
            </div>
          </div>

          {/* Popular Payment Icons */}
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-gray-100">
            <img src={gpayLogo} alt="GPay" className="h-5 w-auto object-contain" />
            <img src={phonepayLogo} alt="PhonePe" className="h-5 w-auto object-contain" />
            <img src={paytmLogo} alt="Paytm" className="h-5 w-auto object-contain" />
            <img src={bhimLogo} alt="BHIM" className="h-5 w-auto object-contain" />
            <span className="text-[11px] font-semibold text-gray-500 ml-auto">+ Cards &amp; NetBanking</span>
          </div>

          {selectedPaymentOption === "razorpay" && (
            <button
              type="button"
              disabled={loading}
              onClick={(e) => { e.stopPropagation(); handleRazorpayPayment(); }}
              className="w-full mt-4 bg-[#F12B19] hover:bg-red-700 disabled:bg-gray-400 text-white font-['Quicksand'] font-bold text-[15px] py-3.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              <span>{loading ? "Opening Razorpay..." : `Pay ₹${finalPayAmount.toLocaleString("en-IN")} via Razorpay`}</span>
              <span className="text-base leading-none">&rarr;</span>
            </button>
          )}
        </div>

        {/* OPTION 2: INSTANT DEMO PAYMENT */}
        <div 
          onClick={() => setSelectedPaymentOption("demo")}
          className={`border-2 rounded-2xl p-4 md:p-5 transition-all cursor-pointer relative ${
            selectedPaymentOption === "demo"
              ? "border-emerald-500 bg-emerald-50/40 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedPaymentOption === "demo" ? "border-emerald-600 bg-emerald-600" : "border-gray-300"
              }`}>
                {selectedPaymentOption === "demo" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-['Satoshi'] font-bold text-[15px] text-[#1A1A1A]">
                    Demo Payment Option
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Instant Test Mode
                  </span>
                </div>
                <p className="font-['Quicksand'] text-[12px] text-[#666666] font-medium mt-1">
                  Bypasses payment gateway for instant testing &amp; immediate E-ticket booking generation.
                </p>
              </div>
            </div>
          </div>

          {selectedPaymentOption === "demo" && (
            <button
              type="button"
              disabled={loading}
              onClick={(e) => { e.stopPropagation(); handleDemoPayment(); }}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-['Quicksand'] font-bold text-[15px] py-3.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Check size={18} strokeWidth={3} />
              <span>{loading ? "Processing Demo Payment..." : `Complete Demo Payment (₹${finalPayAmount.toLocaleString("en-IN")})`}</span>
              <span className="text-base leading-none">&rarr;</span>
            </button>
          )}
        </div>

      </div>

      {/* ── 5. SECURITY NOTICE ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-1">
        <Shield size={15} className="text-emerald-500 flex-shrink-0" />
        <p className="font-['Quicksand'] text-[11.5px] text-[#999999] font-medium">
          256-bit SSL encryption · PCI DSS Level 1 certified · Your payment is 100% secure
        </p>
      </div>

      {/* ── 6. MAIN PAY CTA BUTTON ─────────────────────────────────────────── */}
      <button
        type="button"
        disabled={loading}
        onClick={handleMainPayClick}
        className={`w-full text-white font-['Quicksand'] font-bold text-[16px] py-4 rounded-2xl transition-all cursor-pointer shadow-md active:scale-[0.99] flex items-center justify-center gap-2.5 ${
          selectedPaymentOption === "razorpay"
            ? "bg-[#F12B19] hover:bg-red-700"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {selectedPaymentOption === "razorpay" ? <Lock size={17} /> : <Zap size={17} fill="currentColor" />}
        <span>
          {loading 
            ? "Processing Payment..." 
            : selectedPaymentOption === "razorpay"
              ? `Pay ₹${finalPayAmount.toLocaleString("en-IN")} via Razorpay`
              : `Complete Demo Payment (₹${finalPayAmount.toLocaleString("en-IN")})`
          }
        </span>
        <span className="text-lg leading-none">&rarr;</span>
      </button>

      <p className="text-center font-['Quicksand'] text-[11px] text-[#BBBBBB] font-medium pb-2">
        By proceeding you agree to our Terms &amp; Conditions and Privacy Policy
      </p>

    </div>
  );
}

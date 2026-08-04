/**
 * ============================================================================
 * PATH: client/src/pages/flights/booking/components/BookingInfo.jsx
 * DESCRIPTION: Passenger details and contact info form matching exact Flight Passenger Detail.svg.
 *              Includes auto / formatting for DOB & full validation for Mobile, Email, and DOB.
 *              Page transition occurs ONLY on explicit Proceed button click.
 * ============================================================================
 */

import React, { useState } from "react";
import { Mail, Phone, User, Calendar, Plus, ChevronDown, Check, AlertCircle } from "lucide-react";

// Cookie helper functions
const setCookie = (name, value, days = 30) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  try {
    const val = document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
};

export default function BookingInfo({ onContinue, initialContact, initialPassengers }) {
  const [mobile, setMobile] = useState(() => {
    if (initialContact?.mobile) return initialContact.mobile;
    const cookieData = getCookie("saved_contact_info");
    if (cookieData?.mobile) return cookieData.mobile;
    try {
      const saved = JSON.parse(localStorage.getItem("saved_contact_info") || "{}");
      return saved.mobile || "";
    } catch {
      return "";
    }
  });

  const [email, setEmail] = useState(() => {
    if (initialContact?.email) return initialContact.email;
    const cookieData = getCookie("saved_contact_info");
    if (cookieData?.email) return cookieData.email;
    try {
      const saved = JSON.parse(localStorage.getItem("saved_contact_info") || "{}");
      return saved.email || "";
    } catch {
      return "";
    }
  });

  const [passengers, setPassengers] = useState(() => {
    if (initialPassengers && initialPassengers.length > 0 && initialPassengers.some(p => p.firstName || p.lastName)) {
      return initialPassengers;
    }
    const saved = getCookie("saved_passenger_info") || (() => {
      try {
        return JSON.parse(localStorage.getItem("saved_passenger_info") || "[]");
      } catch {
        return [];
      }
    })();

    if (Array.isArray(saved) && saved.length > 0 && initialPassengers && initialPassengers.length > 0) {
      return initialPassengers.map((pax, idx) => {
        if (saved[idx]) {
          return {
            ...pax,
            title: saved[idx].title || pax.title,
            firstName: saved[idx].firstName || pax.firstName,
            lastName: saved[idx].lastName || pax.lastName,
            dob: saved[idx].dob || pax.dob,
            nationality: saved[idx].nationality || pax.nationality
          };
        }
        return pax;
      });
    }

    return initialPassengers && initialPassengers.length > 0
      ? initialPassengers
      : [{ id: 1, title: "Mr.", firstName: "", lastName: "", dob: "", nationality: "Indian" }];
  });

  const [errors, setErrors] = useState({});

  // ── Auto slash formatting for DOB ──────────────────────────────────────────
  const formatDOB = (val) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 8);
    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    let finalVal = value;

    if (field === "dob") {
      finalVal = formatDOB(value);
    }

    updated[index] = { ...updated[index], [field]: finalVal };
    setPassengers(updated);

    // Clear specific error on edit
    if (errors[`pax_${index}_${field}`]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[`pax_${index}_${field}`];
        return copy;
      });
    }
  };

  const handleMobileChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(val);
    if (errors.mobile) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.mobile;
        return copy;
      });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.email;
        return copy;
      });
    }
  };

  const handleAddPassenger = () => {
    setPassengers(prev => [
      ...prev,
      { id: prev.length + 1, title: "Mr.", firstName: "", lastName: "", dob: "", nationality: "Indian" }
    ]);
  };

  // ── Validation Helpers ───────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    // Mobile Validation
    const mobDigits = mobile.replace(/\D/g, "");
    if (!mobDigits) {
      newErrors.mobile = "Mobile number is required";
    } else if (mobDigits.length !== 10) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    } else if (!/^[6-9]\d{9}$/.test(mobDigits)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Email Validation
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Passengers Validation
    passengers.forEach((p, idx) => {
      if (!p.firstName.trim()) {
        newErrors[`pax_${idx}_firstName`] = "First name is required";
      } else if (p.firstName.trim().length < 2) {
        newErrors[`pax_${idx}_firstName`] = "Min 2 characters required";
      }

      if (!p.lastName.trim()) {
        newErrors[`pax_${idx}_lastName`] = "Last name is required";
      }

      // DOB Validation
      if (!p.dob.trim()) {
        newErrors[`pax_${idx}_dob`] = "Date of birth is required";
      } else {
        const dobMatch = p.dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!dobMatch) {
          newErrors[`pax_${idx}_dob`] = "Format must be DD/MM/YYYY";
        } else {
          const day = parseInt(dobMatch[1], 10);
          const month = parseInt(dobMatch[2], 10);
          const year = parseInt(dobMatch[3], 10);

          if (month < 1 || month > 12) {
            newErrors[`pax_${idx}_dob`] = "Invalid month (01-12)";
          } else {
            const maxDays = new Date(year, month, 0).getDate();
            if (day < 1 || day > maxDays) {
              newErrors[`pax_${idx}_dob`] = `Invalid day (01-${maxDays})`;
            } else {
              const currentYear = new Date().getFullYear();
              if (year < 1920 || year > currentYear) {
                newErrors[`pax_${idx}_dob`] = `Year must be 1920-${currentYear}`;
              } else {
                const birthDate = new Date(year, month - 1, day);
                if (birthDate > new Date()) {
                  newErrors[`pax_${idx}_dob`] = "DOB cannot be in the future";
                }
              }
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    // Save details to cookie & localStorage
    setCookie("saved_contact_info", { mobile, email });
    setCookie("saved_passenger_info", passengers);
    try {
      localStorage.setItem("saved_contact_info", JSON.stringify({ mobile, email }));
      localStorage.setItem("saved_passenger_info", JSON.stringify(passengers));
    } catch (err) {
      console.warn("Storage write blocked:", err);
    }

    if (onContinue) {
      onContinue({
        contactInfo: { mobile, email },
        passengers
      });
    }
  };

  return (
    <form 
      onSubmit={(e) => e.preventDefault()} 
      onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} 
      className="space-y-5 font-['Quicksand'] text-left select-none" 
      noValidate
    >
      
      {/* ── 1. Contact Information Card ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div>
          <h3 className="font-['Satoshi'] font-bold text-[18px] text-[#1A1A1A]">
            Contact Information
          </h3>
          <p className="font-['Quicksand'] text-[12px] text-[#999999] font-medium mt-0.5">
            Booking confirmation & e-tickets will be sent to this contact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Mobile input */}
          <div>
            <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
              Mobile Number *
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-28 flex-shrink-0">
                <select className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none appearance-none cursor-pointer">
                  <option>+91 (IND)</option>
                  <option>+1 (USA)</option>
                  <option>+44 (UK)</option>
                </select>
                <ChevronDown size={14} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <input
                type="tel"
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Enter 10-digit mobile"
                maxLength={10}
                className={`w-full bg-[#F8F9FA] border ${errors.mobile ? "border-red-500 focus:border-red-500" : "border-[#EAEAEA] focus:border-[#F12B19]"} rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none placeholder-gray-400 transition-colors`}
              />
            </div>
            {errors.mobile && (
              <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.mobile}
              </p>
            )}
          </div>

          {/* Email input */}
          <div>
            <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
              Email Address *
            </label>
            <div className={`flex items-center bg-[#F8F9FA] border ${errors.email ? "border-red-500 focus-within:border-red-500" : "border-[#EAEAEA] focus-within:border-[#F12B19]"} rounded-lg px-3 py-2.5 transition-colors`}>
              <Mail size={15} className="text-gray-400 mr-2 flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter email address"
                className="w-full bg-transparent border-none outline-none text-xs font-semibold text-[#1A1A1A] placeholder-gray-400"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.email}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2.5 pt-1 text-[12px] font-medium text-[#666666] cursor-pointer select-none">
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#F12B19] rounded cursor-pointer" />
          <span>Send SMS & WhatsApp booking updates to this mobile number</span>
        </label>
      </div>

      {/* ── 2. Passenger Details Cards ── */}
      <div className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Satoshi'] font-bold text-[18px] text-[#1A1A1A]">
                Passenger Details
              </h3>
              <p className="font-['Quicksand'] text-[12px] text-[#999999] font-medium mt-0.5">
                Please enter names exactly as printed on your government-issued ID
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#F12B19] bg-[#FFF1F2] px-3 py-1 rounded-full border border-[#FFCDD2]">
              {passengers.length} Traveller{passengers.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {passengers.map((p, idx) => (
          <div 
            key={p.id} 
            className="border border-[#EAEAEA] rounded-xl p-4 md:p-5 bg-[#FBFBFB] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#FFF1F2] text-[#F12B19] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="font-['Satoshi'] font-bold text-[15px] text-[#1A1A1A]">
                  Passenger {idx + 1} ({p.type || 'Adult'})
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#F12B19] bg-[#FFF1F2] px-2.5 py-0.5 rounded-full">
                {idx === 0 ? "Primary Passenger" : `Passenger ${idx + 1}`}
              </span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[110px_1fr_1fr] gap-4">
              {/* Title */}
              <div>
                <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Title *
                </label>
                <div className="relative">
                  <select 
                    value={p.title}
                    onChange={(e) => handlePassengerChange(idx, 'title', e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none appearance-none cursor-pointer"
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                  </select>
                  <ChevronDown size={14} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  First & Middle Name *
                </label>
                <input
                  type="text"
                  value={p.firstName}
                  onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                  placeholder="e.g. Rahul"
                  className={`w-full bg-white border ${errors[`pax_${idx}_firstName`] ? "border-red-500 focus:border-red-500" : "border-[#EAEAEA] focus:border-[#F12B19]"} rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none placeholder-gray-400 transition-colors`}
                />
                {errors[`pax_${idx}_firstName`] && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors[`pax_${idx}_firstName`]}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={p.lastName}
                  onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                  placeholder="e.g. Sharma"
                  className={`w-full bg-white border ${errors[`pax_${idx}_lastName`] ? "border-red-500 focus:border-red-500" : "border-[#EAEAEA] focus:border-[#F12B19]"} rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none placeholder-gray-400 transition-colors`}
                />
                {errors[`pax_${idx}_lastName`] && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors[`pax_${idx}_lastName`]}
                  </p>
                )}
              </div>
            </div>

            {/* DOB & Nationality */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Date of Birth *
                </label>
                <div className={`flex items-center bg-white border ${errors[`pax_${idx}_dob`] ? "border-red-500 focus-within:border-red-500" : "border-[#EAEAEA] focus-within:border-[#F12B19]"} rounded-lg px-3 py-2.5 transition-colors`}>
                  <Calendar size={15} className="text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={p.dob}
                    onChange={(e) => handlePassengerChange(idx, 'dob', e.target.value)}
                    placeholder="DD / MM / YYYY"
                    maxLength={10}
                    className="w-full bg-transparent border-none outline-none text-xs font-semibold text-[#1A1A1A] placeholder-gray-400"
                  />
                </div>
                {errors[`pax_${idx}_dob`] && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors[`pax_${idx}_dob`]}
                  </p>
                )}
              </div>

              <div>
                <label className="font-['Quicksand'] text-[11px] font-bold uppercase tracking-wider text-[#666666] block mb-1.5">
                  Nationality *
                </label>
                <div className="relative">
                  <select 
                    value={p.nationality}
                    onChange={(e) => handlePassengerChange(idx, 'nationality', e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1A1A] outline-none appearance-none cursor-pointer"
                  >
                    <option>Indian</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canadian</option>
                  </select>
                  <ChevronDown size={14} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Passenger CTA */}
        <button
          type="button"
          onClick={handleAddPassenger}
          className="w-full border border-dashed border-[#F12B19] bg-[#FFF1F2]/40 hover:bg-[#FFF1F2] text-[#F12B19] font-['Quicksand'] font-bold text-[13px] py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus size={16} />
          <span>Add Adult / Child Passenger</span>
        </button>
      </div>

      {/* ── 3. Submit / Continue CTA ── */}
      <button
        type="button"
        onClick={handleProceed}
        className="w-full bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[15px] py-3.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-2"
      >
        <span>Proceed to Seat Selection</span>
        <span className="text-base leading-none">&rarr;</span>
      </button>

    </form>
  );
}

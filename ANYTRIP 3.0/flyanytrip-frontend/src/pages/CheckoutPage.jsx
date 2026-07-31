import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plane, User, CheckCircle2, Check, ShieldCheck, ArrowRight, Info, 
  ChevronDown, Ticket, AlertCircle, Loader2, CreditCard,
  Phone, Mail, MapPin, Calendar, Clock, Armchair, Coffee, Luggage,
  ShieldAlert, ChevronRight, X, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useSearchContext } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { popularAirports } from '../utils/airportsData';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataParam = queryParams.get('data');

  // Decode flight from URL if state is missing
  let flightFromUrl = null;
  if (dataParam) {
    try {
      // Decode URL-encoded base64 and handle Unicode
      const decodedData = decodeURIComponent(atob(dataParam).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      flightFromUrl = JSON.parse(decodedData);
    } catch (e) {
      console.error("Error decoding flight data from URL:", e);
      // Fallback for simple base64 if the above fails
      try {
        flightFromUrl = JSON.parse(atob(dataParam));
      } catch (err) {
        console.error("Fallback decoding also failed:", err);
      }
    }
  }

  const { user } = useAuth();
  
  // Use try/catch fallback context in case it is rendered outside SearchProvider (though App.jsx wraps it)
  let searchCtx = null;
  try {
    searchCtx = useSearchContext();
  } catch (e) {
    console.warn("SearchContext not available:", e);
  }
  const { adults: ctxAdults = 1, children: ctxChildren = 0, infants: ctxInfants = 0 } = searchCtx || {};

  const adultsCount = flightFromUrl?.adults !== undefined ? Number(flightFromUrl.adults) : Number(ctxAdults);
  const childrenCount = flightFromUrl?.children !== undefined ? Number(flightFromUrl.children) : Number(ctxChildren);
  const infantsCount = flightFromUrl?.infants !== undefined ? Number(flightFromUrl.infants) : Number(ctxInfants);
  const totalTravellersCount = adultsCount + childrenCount + infantsCount;

  // Define default/empty/lead values helper:
  const getInitialTravellers = () => {
    // Check sessionStorage first
    const savedState = sessionStorage.getItem('checkout_travellers_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.length === totalTravellersCount) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved traveller state from sessionStorage:", e);
      }
    }

    // Default pre-fill for lead traveller
    let leadFirstName = '';
    let leadLastName = '';
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length > 1) {
        leadLastName = parts.pop();
        leadFirstName = parts.join(' ');
      } else {
        leadFirstName = parts[0];
      }
    }
    const leadEmail = user?.email || '';
    const leadPhone = user?.mobile || '';

    const list = [];
    // Adults
    for (let i = 0; i < adultsCount; i++) {
      if (i === 0) {
        list.push({
          type: 'adult',
          title: 'Mr',
          firstName: leadFirstName,
          lastName: leadLastName,
          gender: 'Male',
          dob: '',
          email: leadEmail,
          phone: leadPhone,
          passportNumber: '',
          passportExpiry: '',
          passportIssuingCountry: ''
        });
      } else {
        list.push({
          type: 'adult',
          title: 'Mr',
          firstName: '',
          lastName: '',
          gender: 'Male',
          dob: '',
          email: '',
          phone: '',
          passportNumber: '',
          passportExpiry: '',
          passportIssuingCountry: ''
        });
      }
    }
    // Children
    for (let i = 0; i < childrenCount; i++) {
      list.push({
        type: 'child',
        title: 'Mr',
        firstName: '',
        lastName: '',
        gender: 'Male',
        dob: '',
        passportNumber: '',
        passportExpiry: '',
        passportIssuingCountry: ''
      });
    }
    // Infants
    for (let i = 0; i < infantsCount; i++) {
      list.push({
        type: 'infant',
        title: 'Mr',
        firstName: '',
        lastName: '',
        gender: 'Male',
        dob: '',
        passportNumber: '',
        passportExpiry: '',
        passportIssuingCountry: ''
      });
    }

    return list;
  };

  const { flight: initialFlightState } = location.state || {};
  const initialFlight = initialFlightState || flightFromUrl;

  // Core Data State
  const [flight, setFlight] = useState(initialFlight);
  const [fareQuote, setFareQuote] = useState(null);
  const [fareRule, setFareRule] = useState(null);
  const [ssrData, setSsrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [travellers, setTravellers] = useState(getInitialTravellers);
  const [selectedSeats, setSelectedSeats] = useState(location.state?.selectedSeats || []);
  const [activeSeatTravellerIdx, setActiveSeatTravellerIdx] = useState(0);
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState(location.state?.selectedMeals || []);
  const [selectedBaggage, setSelectedBaggage] = useState(location.state?.selectedBaggage || []);
  const [activeAddonTravellerIdx, setActiveAddonTravellerIdx] = useState(0);
  const [couponCode, setCouponCode] = useState(location.state?.couponCode || '');
  const [couponDiscount, setCouponDiscount] = useState(location.state?.couponDiscount || 0);
  const [couponError, setCouponError] = useState('');
  const [agreed, setAgreed] = useState(location.state?.agreed || false);
  const [showGST, setShowGST] = useState(location.state?.showGST || false);
  const [gstData, setGstData] = useState(location.state?.gstData || { companyName: '', registrationNo: '' });
  const [selectedState, setSelectedState] = useState(location.state?.selectedState || 'Gujarat');

  const handleToggleMeal = (name, price, travellerIdx) => {
    const newMeals = [...selectedMeals];
    const existingIdx = newMeals.findIndex(m => m.paxIdx === travellerIdx);
    
    if (existingIdx !== -1) {
      if (newMeals[existingIdx].name === name) {
        // Remove if clicking the same meal
        newMeals.splice(existingIdx, 1);
      } else {
        // Replace with new meal
        newMeals[existingIdx] = { name, price, paxIdx: travellerIdx };
      }
    } else {
      newMeals.push({ name, price, paxIdx: travellerIdx });
      
      // Auto-advance
      const seatTravellers = travellers.filter(t => t.type !== 'infant');
      if (seatTravellers.length > 1) {
         let nextIdx = -1;
         const currentSubIdx = seatTravellers.findIndex((_, idx) => travellers.indexOf(seatTravellers[idx]) === travellerIdx);
         for (let i = 1; i <= seatTravellers.length; i++) {
            const checkSubIdx = (currentSubIdx + i) % seatTravellers.length;
            const absIdx = travellers.indexOf(seatTravellers[checkSubIdx]);
            if (!newMeals.some(m => m.paxIdx === absIdx)) {
               nextIdx = absIdx;
               break;
            }
         }
         if (nextIdx !== -1) setActiveAddonTravellerIdx(nextIdx);
      }
    }
    setSelectedMeals(newMeals);
  };

  const handleToggleBaggage = (weight, price, code, travellerIdx) => {
    const newBags = [...selectedBaggage];
    const existingIdx = newBags.findIndex(b => b.paxIdx === travellerIdx);
    
    if (existingIdx !== -1) {
      if (newBags[existingIdx].code === code) {
        newBags.splice(existingIdx, 1);
      } else {
        newBags[existingIdx] = { weight, price, code, paxIdx: travellerIdx };
      }
    } else {
      newBags.push({ weight, price, code, paxIdx: travellerIdx });
      
      // Auto-advance
      const seatTravellers = travellers.filter(t => t.type !== 'infant');
      if (seatTravellers.length > 1) {
         let nextIdx = -1;
         const currentSubIdx = seatTravellers.findIndex((_, idx) => travellers.indexOf(seatTravellers[idx]) === travellerIdx);
         for (let i = 1; i <= seatTravellers.length; i++) {
            const checkSubIdx = (currentSubIdx + i) % seatTravellers.length;
            const absIdx = travellers.indexOf(seatTravellers[checkSubIdx]);
            if (!newBags.some(m => m.paxIdx === absIdx)) {
               nextIdx = absIdx;
               break;
            }
         }
         if (nextIdx !== -1) setActiveAddonTravellerIdx(nextIdx);
      }
    }
    setSelectedBaggage(newBags);
  };

  // UI State
  const [activeSection, setActiveSection] = useState(location.state?.editSection || 'flight'); // 'flight', 'travellers', 'seats', 'addons'
  const [unlockedSections, setUnlockedSections] = useState(
    location.state?.selectedSeats?.length > 0 || location.state?.selectedMeals?.length > 0 || location.state?.selectedBaggage?.length > 0 || location.state?.editSection
      ? ['flight', 'travellers', 'seats', 'addons']
      : ['flight', 'travellers']
  );
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [savedTravellers, setSavedTravellers] = useState([]);
  
  const travellerSectionRef = useRef(null);
  const seatSectionRef = useRef(null);

  // Re-sync travellers array if query counts change
  useEffect(() => {
    const currentAdults = travellers.filter(t => t.type === 'adult').length;
    const currentChildren = travellers.filter(t => t.type === 'child').length;
    const currentInfants = travellers.filter(t => t.type === 'infant').length;
    
    if (currentAdults !== adultsCount || currentChildren !== childrenCount || currentInfants !== infantsCount) {
      setTravellers(getInitialTravellers());
    }
  }, [adultsCount, childrenCount, infantsCount]);

  // Persist travellers state
  useEffect(() => {
    if (travellers.length > 0) {
      sessionStorage.setItem('checkout_travellers_state', JSON.stringify(travellers));
    }
  }, [travellers]);

  // Load user profile details to Lead Traveller
  useEffect(() => {
    if (user && travellers.length > 0) {
      setTravellers(prev => {
        const copy = [...prev];
        if (copy[0] && copy[0].type === 'adult') {
          let updated = false;
          let leadFirstName = '';
          let leadLastName = '';
          if (user?.name) {
            const parts = user.name.trim().split(/\s+/);
            if (parts.length > 1) {
              leadLastName = parts.pop();
              leadFirstName = parts.join(' ');
            } else {
              leadFirstName = parts[0];
            }
          }
          if (!copy[0].firstName) {
            copy[0].firstName = leadFirstName;
            updated = true;
          }
          if (!copy[0].lastName) {
            copy[0].lastName = leadLastName;
            updated = true;
          }
          if (!copy[0].email) {
            copy[0].email = user.email || '';
            updated = true;
          }
          if (!copy[0].phone) {
            copy[0].phone = user.mobile || '';
            updated = true;
          }
          return updated ? copy : prev;
        }
        return prev;
      });
    }
  }, [user]);

  // Load saved cotravellers
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cotravellers');
      if (stored) {
        setSavedTravellers(JSON.parse(stored));
      } else {
        setSavedTravellers([
          { id: 1, firstName: 'Emma', lastName: 'Watson', gender: 'Female', dob: '1990-04-15', passportNo: 'A1234567', passportExpiry: '2030-10-15', issuingCountry: 'India', relationship: 'Friend' },
          { id: 2, firstName: 'Daniel', lastName: 'Daniel', gender: 'Male', dob: '1989-07-23', passportNo: 'B9876543', passportExpiry: '2032-05-20', issuingCountry: 'UK', relationship: 'Colleague' }
        ]);
      }
    } catch (e) {
      console.error("Error reading saved travellers:", e);
    }
  }, []);

  useEffect(() => {
    if (!initialFlight) {
      navigate('/');
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [quoteRes, ruleRes, ssrRes] = await Promise.all([
          api.post('/api/flights/fare-quote', { 
            traceId: initialFlight.traceId, 
            resultIndex: initialFlight.resultIndex,
            tokenId: initialFlight.tokenId 
          }),
          api.post('/api/flights/fare-rule', { 
            traceId: initialFlight.traceId, 
            resultIndex: initialFlight.resultIndex,
            tokenId: initialFlight.tokenId 
          }),
          api.post('/api/flights/ssr', { 
            traceId: initialFlight.traceId, 
            resultIndex: initialFlight.resultIndex,
            tokenId: initialFlight.tokenId 
          })
        ]);

        if (quoteRes.data.success) {
          const qData = quoteRes.data.data?.Response?.Results || quoteRes.data.data?.responseData?.Response?.Results;
          setFareQuote(qData);
        }
        if (ruleRes.data.success) {
          const rData = ruleRes.data.data?.Response?.FareRules || ruleRes.data.data?.responseData?.Response?.FareRules;
          setFareRule(rData);
        } else {
          console.error('fetch api fare rules failed', ruleRes.data);
        }
        if (ssrRes.data.success) {
          const sData = ssrRes.data.data?.Response || ssrRes.data.data?.responseData?.Response || ssrRes.data.data;
          // TBO ResponseStatus: 1 = Success, 4 = Failed/No Data
          if (sData?.ResponseStatus === 1) {
            setSsrData(sData);
            if (sData?.SeatDynamic?.[0]?.SegmentSeat?.[0]?.RowSeats?.length > 0) {
              console.log('%c [API SUCCESS] LIVE SEAT MAP LOADED! ', 'background: #27ae60; color: #fff; font-weight: bold; padding: 2px 5px; rounded: 3px;');
              console.log('Seat Data:', sData.SeatDynamic[0].SegmentSeat[0].RowSeats);
            } else {
              console.log('%c [API INFO] SEAT DATA NOT FOUND IN SUCCESS RESPONSE. USING DEFAULT MAP. ', 'background: #f39c12; color: #fff; font-weight: bold; padding: 2px 5px; rounded: 3px;');
            }
          } else {
            console.log('%c [API NOTICE] STATUS 4: AIRLINE HAS NO SSR DATA (SEATS/MEALS) FOR THIS FLIGHT. ', 'background: #e74c3c; color: #fff; font-weight: bold; padding: 2px 5px; rounded: 3px;');
            console.log('Note: We are using a default layout for testing so the UI does not look empty.');
            setSsrData(null);
          }
        }
      } catch (err) {
        console.error("Checkout Data Fetch Error:", err);
        console.error('fetch api fare rules failed', err);
        setError("Failed to fetch live flight details. The fare might have expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [initialFlight, navigate]);

  useEffect(() => {
    if (location.state?.editSection) {
      const section = location.state.editSection;
      if (section === 'travellers') {
        setActiveSection('travellers');
        setTimeout(() => {
          travellerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else if (section === 'seats') {
        if (!unlockedSections.includes('seats')) {
          setUnlockedSections(prev => [...new Set([...prev, 'seats', 'addons'])]);
        }
        setActiveSection('seats');
        setTimeout(() => {
          seatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else if (section === 'addons') {
        if (!unlockedSections.includes('seats')) {
          setUnlockedSections(prev => [...new Set([...prev, 'seats', 'addons'])]);
        }
        setActiveSection('addons');
        setTimeout(() => {
          seatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [location.state?.editSection]);

  if (!initialFlight) return null;

  // Price Calculations
  const formatPrice = (p) => Math.ceil(p || 0).toLocaleString('en-IN');
  const fareData = fareQuote?.Fare || {};
  const baseFare = Math.ceil(fareData.BaseFare || (parseFloat(String(flight.price || 0).replace(/,/g, '')) * 0.7) || 0);
  const tax = Math.ceil(fareData.Tax || (parseFloat(String(flight.price || 0).replace(/,/g, '')) * 0.3) || 0);
  const otherCharges = 0;
  const convenienceFee = 0;
  
  // Extract dynamic flight details from fareQuote if available (flattens multi-city legs and layovers)
  const apiSegments = fareQuote?.Segments 
    ? (Array.isArray(fareQuote.Segments[0]) ? fareQuote.Segments.flat() : fareQuote.Segments)
    : [];
  const firstSegment = apiSegments[0];
  const lastSegment = apiSegments[apiSegments.length - 1];
  
  const dynamicFlight = {
    ...flight,
    segments: apiSegments,
    departureDate: firstSegment ? firstSegment.Origin.DepTime : (flight.departureDate || flight.date),
    time: firstSegment ? new Date(firstSegment.Origin.DepTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : flight.time,
    arrival: lastSegment ? new Date(lastSegment.Destination.ArrTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : flight.arrival,
    airline: firstSegment?.Airline?.AirlineName || flight.airline,
    airlineCode: firstSegment?.Airline?.AirlineCode || flight.airlineCode,
    flightNo: firstSegment?.Airline?.FlightNumber || flight.flightNo,
    dur: apiSegments.length > 1 ? flight.dur : (firstSegment?.Duration ? `${Math.floor(firstSegment.Duration / 60)}h ${firstSegment.Duration % 60}m` : flight.dur),
    cabinBaggage: fareQuote?.FareBreakdown?.[0]?.SegmentDetails?.[0]?.CabinBaggage?.FreeText || (typeof fareQuote?.FareBreakdown?.[0]?.SegmentDetails?.[0]?.CabinBaggage === 'string' ? fareQuote?.FareBreakdown?.[0]?.SegmentDetails?.[0]?.CabinBaggage : '7 Kgs'),
    checkInBaggage: fareQuote?.FareBreakdown?.[0]?.SegmentDetails?.[0]?.CheckedInBaggage?.FreeText || (typeof fareQuote?.FareBreakdown?.[0]?.SegmentDetails?.[0]?.CheckedInBaggage === 'string' ? fareQuote?.FareBreakdown?.[0]?.SegmentDetails?.[0]?.CheckedInBaggage : '15 Kgs')
  };

  const ssrSeatTotal = selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);
  const ssrMealTotal = selectedMeals.reduce((acc, m) => acc + (m.price || 0), 0);
  const ssrBaggageTotal = selectedBaggage.reduce((acc, b) => acc + (b.price || 0), 0);
  const ssrTotal = ssrSeatTotal + ssrMealTotal + ssrBaggageTotal;

  const grandTotal = baseFare + tax + otherCharges + ssrTotal + convenienceFee - couponDiscount;

  // Helper to find country of an airport
  const getAirportCountry = (iataCode) => {
    if (!iataCode) return '';
    const airport = popularAirports.find(a => a.iata?.toUpperCase() === iataCode.toUpperCase());
    return airport ? airport.country : '';
  };

  // Check if flight is international (comparing origin and destination countries of segments or main route)
  const checkIfInternational = () => {
    // 1. If we have fareQuote Segments, check if any segment crosses countries:
    if (apiSegments && apiSegments.length > 0) {
      const isIntl = apiSegments.some(seg => {
        const originCountry = seg.Origin?.Airport?.CountryCode || seg.Origin?.Airport?.CountryName;
        const destCountry = seg.Destination?.Airport?.CountryCode || seg.Destination?.Airport?.CountryName;
        if (originCountry && destCountry) {
          return originCountry.trim().toUpperCase() !== destCountry.trim().toUpperCase();
        }
        return false;
      });
      if (isIntl) return true;
    }
    
    // 2. If it is a multi-city segment in flight or search params:
    if (flight?.tripType === 'multi' && flight?.multiCitySegments) {
      const isIntl = flight.multiCitySegments.some(seg => {
        const originCountry = seg.from?.country || getAirportCountry(seg.from?.iata);
        const destCountry = seg.to?.country || getAirportCountry(seg.to?.iata);
        if (originCountry && destCountry) {
          return originCountry.trim().toUpperCase() !== destCountry.trim().toUpperCase();
        }
        return false;
      });
      if (isIntl) return true;
    }
    
    // 3. Simple comparison of flight origin/destination countries
    const originCountry = flight?.fromCountry || getAirportCountry(flight?.from);
    const destCountry = flight?.toCountry || getAirportCountry(flight?.to);
    if (originCountry && destCountry) {
      return originCountry.trim().toUpperCase() !== destCountry.trim().toUpperCase();
    }
    
    // 4. Fallback to existing flag
    if (flight?.isInternational || flight?.IsInternational) return true;
    if (flight?.isDomestic === false) return true;
    
    return false;
  };
  
  const isInternational = checkIfInternational();

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;
    try {
      const res = await api.post('/api/coupons/validate', {
        code: couponCode,
        amount: baseFare + tax + otherCharges + ssrTotal + convenienceFee
      });
      if (res.data.success) {
        setCouponDiscount(res.data.data.discount);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setCouponDiscount(0);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newTravellers = [...travellers];
    newTravellers[index][field] = value;
    setTravellers(newTravellers);
  };

  const handleSelectSavedTraveller = (idx, savedId) => {
    const selected = savedTravellers.find(st => st.id === Number(savedId));
    if (!selected) return;
    const newTravellers = [...travellers];
    newTravellers[idx] = {
      ...newTravellers[idx],
      firstName: selected.firstName || '',
      lastName: selected.lastName || '',
      gender: selected.gender || 'Male',
      dob: selected.dob || '',
      passportNumber: isInternational ? (selected.passportNo || '') : '',
      passportExpiry: isInternational ? (selected.passportExpiry || '') : '',
      passportIssuingCountry: isInternational ? (selected.issuingCountry || '') : ''
    };
    setTravellers(newTravellers);
  };

  const copyFromLead = (index) => {
    const newTravellers = [...travellers];
    const lead = newTravellers[0];
    newTravellers[index].lastName = lead.lastName;
    if (isInternational) {
      newTravellers[index].passportIssuingCountry = lead.passportIssuingCountry;
    }
    setTravellers(newTravellers);
  };

  const isTravellerSectionValid = (t, idx) => {
    const nameRegex = /^[A-Za-z\s-]+$/;
    if (!t.firstName?.trim() || !nameRegex.test(t.firstName.trim())) return false;
    if (!t.lastName?.trim() || !nameRegex.test(t.lastName.trim())) return false;
    
    // DOB validation
    if (t.dob) {
      const depDate = new Date(flight.departureDate || flight.date || new Date());
      const dobDate = new Date(t.dob);
      let age = depDate.getFullYear() - dobDate.getFullYear();
      const m = depDate.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && depDate.getDate() < dobDate.getDate())) {
        age--;
      }
      if (t.type === 'adult' && age < 12) return false;
      if (t.type === 'child' && (age < 2 || age > 11)) return false;
      if (t.type === 'infant' && age >= 2) return false;
    } else {
      if (t.type === 'infant' || isInternational) return false;
    }
    
    // Passport validation
    if (isInternational) {
      if (!t.passportNumber?.trim()) return false;
      if (!t.passportExpiry?.trim()) return false;
      if (!t.passportIssuingCountry) return false;
      
      const depDate = new Date(flight.departureDate || flight.date || new Date());
      const expiryDate = new Date(t.passportExpiry);
      if (expiryDate <= depDate) return false;
    }
    
    return true;
  };

  const allSectionsValid = travellers.length > 0 && travellers.every((t, idx) => isTravellerSectionValid(t, idx)) && !!selectedState;

  const validateTravellers = () => {
    const newErrors = {};
    const newWarnings = {};
    const nameRegex = /^[A-Za-z\s-]+$/;
    const depDate = new Date(flight.departureDate || flight.date || new Date());

    if (infantsCount > adultsCount) {
      newErrors[`global_pax`] = "The number of infants cannot exceed the number of adults.";
    }

    const passportNumbers = {};

    travellers.forEach((t, idx) => {
      // 1. Name validation
      if (!t.firstName?.trim()) {
        newErrors[`traveller_${idx}_firstName`] = "First name is required";
      } else if (!nameRegex.test(t.firstName.trim())) {
        newErrors[`traveller_${idx}_firstName`] = "First name can only contain letters, spaces, and hyphens";
      }

      if (!t.lastName?.trim()) {
        newErrors[`traveller_${idx}_lastName`] = "Last name is required";
      } else if (!nameRegex.test(t.lastName.trim())) {
        newErrors[`traveller_${idx}_lastName`] = "Last name can only contain letters, spaces, and hyphens";
      }

      // 2. DOB validation
      if (t.dob) {
        const dobDate = new Date(t.dob);
        let age = depDate.getFullYear() - dobDate.getFullYear();
        const m = depDate.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && depDate.getDate() < dobDate.getDate())) {
          age--;
        }

        if (t.type === 'adult' && age < 12) {
          newErrors[`traveller_${idx}_dob`] = "Adult must be 12 years or older on departure date";
        } else if (t.type === 'child' && (age < 2 || age > 11)) {
          newErrors[`traveller_${idx}_dob`] = "Child must be between 2 and 11 years old on departure date";
        } else if (t.type === 'infant' && age >= 2) {
          newErrors[`traveller_${idx}_dob`] = "Infant must be under 2 years old on departure date";
        }

        // Warning: Infant turns 2 before return date (round trip only)
        if (t.type === 'infant' && flight.tripType === 'round') {
          const retDateStr = flight.returnDate || (flight.dateRange && flight.dateRange[1]);
          if (retDateStr) {
            const retDate = new Date(retDateStr);
            let ageAtReturn = retDate.getFullYear() - dobDate.getFullYear();
            const mRet = retDate.getMonth() - dobDate.getMonth();
            if (mRet < 0 || (mRet === 0 && retDate.getDate() < dobDate.getDate())) {
              ageAtReturn--;
            }
            if (ageAtReturn >= 2) {
              newWarnings[`traveller_${idx}_dob`] = "Warning: Infant will turn 2 years old before the return flight and may require a child ticket.";
            }
          }
        }
      } else {
        if (t.type === 'infant' || isInternational) {
          newErrors[`traveller_${idx}_dob`] = "Date of birth is required";
        }
      }

      // 3. Passport validations (only if international)
      if (isInternational) {
        if (!t.passportNumber?.trim()) {
          newErrors[`traveller_${idx}_passportNumber`] = "Passport number is required";
        } else {
          // Check duplicate passport numbers
          const num = t.passportNumber.trim().toUpperCase();
          if (passportNumbers[num] !== undefined) {
            newErrors[`traveller_${idx}_passportNumber`] = "Duplicate passport number";
            newErrors[`traveller_${passportNumbers[num]}_passportNumber`] = "Duplicate passport number";
          } else {
            passportNumbers[num] = idx;
          }
        }

        if (!t.passportExpiry?.trim()) {
          newErrors[`traveller_${idx}_passportExpiry`] = "Passport expiry date is required";
        } else {
          const expiryDate = new Date(t.passportExpiry);
          if (expiryDate <= depDate) {
            newErrors[`traveller_${idx}_passportExpiry`] = "Passport has expired";
          } else {
            // Check if less than 6 months (180 days) remaining from departure date
            const diffTime = expiryDate.getTime() - depDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 180) {
              newWarnings[`traveller_${idx}_passportExpiry`] = "Warning: Passport has less than 6 months of validity remaining from departure date.";
            }
          }
        }

        if (!t.passportIssuingCountry) {
          newErrors[`traveller_${idx}_passportIssuingCountry`] = "Passport issuing country is required";
        }
      }

      // 4. Contact details for Lead Traveller (idx === 0)
      if (idx === 0) {
        if (!t.email?.trim()) {
          newErrors[`contact_email`] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(t.email)) {
          newErrors[`contact_email`] = "Invalid email format";
        }
        if (!t.phone?.trim()) {
          newErrors[`contact_phone`] = "Mobile number is required";
        }
      }
    });

    if (!selectedState) {
      newErrors[`selectedState`] = "Please select your state";
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }
    return true;
  };

  const handleSeatClick = (seatCode, price, travellerIdx, segmentIdx) => {
    const newSeats = [...selectedSeats];
    
    // Find if this seat is already selected by someone on the same segment
    const seatTakenIdx = newSeats.findIndex(s => s?.code === seatCode && s?.segmentIdx === segmentIdx);
    
    let selected = false;
    if (seatTakenIdx !== -1) {
      // If selected by the current traveler, release it
      if (newSeats[seatTakenIdx].paxIdx === travellerIdx) {
        newSeats.splice(seatTakenIdx, 1);
      } else {
        // Already taken by someone else - do nothing (prevents duplicate selection)
        return;
      }
    } else {
      // Find if the current traveler already has a seat on this segment
      const currentTravellerSeatIdx = newSeats.findIndex(s => s?.paxIdx === travellerIdx && s?.segmentIdx === segmentIdx);
      
      const newSeatObj = { code: seatCode, price: price || 0, paxIdx: travellerIdx, segmentIdx };
      
      if (currentTravellerSeatIdx !== -1) {
        newSeats[currentTravellerSeatIdx] = newSeatObj;
      } else {
        newSeats.push(newSeatObj);
      }
      selected = true;
    }
    
    setSelectedSeats(newSeats);

    // Auto-advance to the next traveler without an assigned seat on this segment
    const seatTravellers = travellers.filter(t => t.type !== 'infant');
    const seatTravellersCount = seatTravellers.length;
    
    if (selected && seatTravellersCount > 1) {
      let nextSeatTravellerIdx = -1;
      const currentSeatTravellerSubIdx = seatTravellers.findIndex((_, idx) => {
        const absIdx = travellers.indexOf(seatTravellers[idx]);
        return absIdx === travellerIdx;
      });

      for (let i = 1; i <= seatTravellersCount; i++) {
        const checkSubIdx = (currentSeatTravellerSubIdx + i) % seatTravellersCount;
        const absIdx = travellers.indexOf(seatTravellers[checkSubIdx]);
        // Check if this traveler has a seat on the current segment
        const hasSeat = newSeats.some(s => s?.paxIdx === absIdx && s?.segmentIdx === segmentIdx);
        if (!hasSeat) {
          nextSeatTravellerIdx = absIdx;
          break;
        }
      }
      
      if (nextSeatTravellerIdx !== -1) {
        setActiveSeatTravellerIdx(nextSeatTravellerIdx);
      }
    }
  };

  const handleSkipSeat = (travellerIdx, segmentIdx) => {
    // Remove the seat selected by this traveler on this segment
    const newSeats = selectedSeats.filter(s => !(s?.paxIdx === travellerIdx && s?.segmentIdx === segmentIdx));
    setSelectedSeats(newSeats);
    
    // Auto-advance to the next traveler without an assigned seat on this segment
    const seatTravellers = travellers.filter(t => t.type !== 'infant');
    const seatTravellersCount = seatTravellers.length;
    
    if (seatTravellersCount > 1) {
      let nextSeatTravellerIdx = -1;
      const currentSeatTravellerSubIdx = seatTravellers.findIndex((_, idx) => {
        const absIdx = travellers.indexOf(seatTravellers[idx]);
        return absIdx === travellerIdx;
      });

      for (let i = 1; i <= seatTravellersCount; i++) {
        const checkSubIdx = (currentSeatTravellerSubIdx + i) % seatTravellersCount;
        const absIdx = travellers.indexOf(seatTravellers[checkSubIdx]);
        const hasSeat = newSeats.some(s => s?.paxIdx === absIdx && s?.segmentIdx === segmentIdx);
        if (!hasSeat) {
          nextSeatTravellerIdx = absIdx;
          break;
        }
      }
      
      if (nextSeatTravellerIdx !== -1) {
        setActiveSeatTravellerIdx(nextSeatTravellerIdx);
      }
    }
  };

  const handleContinueToSeats = () => {
    if (validateTravellers()) {
      setUnlockedSections([...unlockedSections, 'seats', 'addons']);
      setActiveSection('seats');
      setTimeout(() => {
        seatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const proceedToPayment = async () => {
    if (!agreed) {
       alert("Please agree to the Terms & Conditions");
       return;
    }

    // Final Validation using reusable function
    if (!validateTravellers()) {
       alert("Please complete all traveller details correctly");
       travellerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
       return;
    }

    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       navigate('/pre-confirmation', { 
          state: { 
             flight: dynamicFlight,
             grandTotal,
             ssrTotal,
             travellers,
             selectedSeats,
             selectedMeals,
             selectedBaggage,
             couponCode,
             couponDiscount,
             showGST,
             gstData,
             selectedState,
             baseFare,
             tax,
             convenienceFee
          } 
       });
    }, 600);
  };

  const initiateRazorpay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'FlyAnyTrip',
      description: 'Flight Booking Payment',
      order_id: order.orderId,
      handler: async (response) => {
        setLoading(true);
        try {
          const verifyRes = await api.post('/api/payment/verify', response);
          if (verifyRes.data.success) {
            const bookingRes = await api.post('/api/booking/confirm', {
              isLCC: flight.raw?.IsLCC || flight.isLCC,
              traceId: flight.traceId,
              resultIndex: flight.resultIndex,
              passengers: travellers.map(t => {
                const pax = {
                  Title: t.title || 'Mr',
                  FirstName: t.firstName,
                  LastName: t.lastName,
                  PaxType: t.type === 'adult' ? 1 : (t.type === 'child' ? 2 : 3),
                  Gender: t.gender === 'Male' ? 1 : 2,
                  DateOfBirth: t.dob || (t.type === 'adult' ? "1990-01-01" : (t.type === 'child' ? "2015-01-01" : "2025-01-01"))
                };
                if (isInternational) {
                  pax.PassportNo = t.passportNumber || null;
                  pax.PassportExpiry = t.passportExpiry || null;
                  pax.PassportIssuingCountry = t.passportIssuingCountry || null;
                }
                return pax;
              }),
              contactDetails: { Email: travellers[0].email, ContactNo: travellers[0].phone },
              paymentData: response,
              flightSnapshot: flight,
              totalAmount: grandTotal,
              ssrSelections: { seats: selectedSeats, meals: selectedMeals, baggage: selectedBaggage }
            });

            if (bookingRes.data.success) {
               navigate('/booking-success', { state: { booking: bookingRes.data.data, flight } });
            } else {
               navigate('/booking-failed', { state: { error: bookingRes.data.message } });
            }
          }
        } catch (err) {
          navigate('/booking-failed');
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: `${travellers[0].firstName} ${travellers[0].lastName}`,
        email: travellers[0].email,
        contact: travellers[0].phone
      },
      theme: { color: '#E52D2D' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const getInitials = (t) => {
    if (!t) return '';
    const f = t.firstName?.trim().charAt(0) || '';
    const l = t.lastName?.trim().charAt(0) || '';
    return `${f}${l}`.toUpperCase() || `P${travellers.indexOf(t) + 1}`;
  };

  const getSeatTitle = (seatCode, price) => {
    const selectedSeatObj = selectedSeats.find(s => s?.code === seatCode && s?.segmentIdx === activeSegmentIdx);
    if (selectedSeatObj) {
      const t = travellers[selectedSeatObj.paxIdx];
      const name = t ? `${t.firstName || 'Pax'} ${t.lastName || ''}`.trim() : `Pax ${selectedSeatObj.paxIdx + 1}`;
      return `${seatCode} - Selected by ${name}`;
    }
    return `${seatCode} - ₹${price || 0}`;
  };

  const isSeatSelected = (code) => selectedSeats.some(s => s?.code === code && s?.segmentIdx === activeSegmentIdx);

  return (
    <div className="min-h-screen bg-[#F0F2F5] pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
               <ShieldAlert size={20} /> {error}
               <button onClick={() => navigate('/results')} className="ml-auto bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs">Return to Search</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT: MAIN FLOW */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* 1. FLIGHT SUMMARY - MMT STYLE */}
            <div className="bg-white rounded-[1.2rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               {/* Header Row */}
               <div className="bg-black/[0.02] p-4 md:p-6 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-brand-red text-white w-1 h-6 rounded-full" />
                     <h2 className="text-lg font-black text-brand-black">{dynamicFlight.fromCity || dynamicFlight.from || 'New Delhi'} → {dynamicFlight.toCity || dynamicFlight.to || 'London'}</h2>
                     <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                        {dynamicFlight.departureDate ? new Date(dynamicFlight.departureDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                     </span>
                     <span className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">{dynamicFlight.layover || 'Non-stop'} • {dynamicFlight.dur}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded">Cancellation Fees Apply</span>
                     <button className="text-[10px] font-black text-brand-red uppercase tracking-widest hover:underline">View Fare Rules</button>
                  </div>
               </div>

               <div className="p-4 md:p-6">
                  {/* Airline Info - Tighter spacing */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/[0.03]">
                     <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md overflow-hidden border border-black/5 p-1 bg-white">
                           <img src={`/assets/airlines/${dynamicFlight.airlineCode}.png`} alt={dynamicFlight.airline} className="w-full h-full object-contain" />
                        </div>
                        <div>
                           <div className="text-xs font-black text-brand-black">{dynamicFlight.airline} <span className="text-brand-black/40 font-bold ml-1">{dynamicFlight.airlineCode} {dynamicFlight.flightNo}</span></div>
                        </div>
                     </div>
                     <div className="text-[10px] font-black text-brand-black/60">
                        {dynamicFlight.class} <span className="text-brand-red mx-1 text-[8px]">›</span> <span className="text-green-600">{dynamicFlight.selectedFare || 'SAVER'}</span>
                     </div>
                  </div>

                  {/* Timeline View - Dynamic Segments (MMT Style) */}
                  <div className="space-y-0 relative">
                     {apiSegments && apiSegments.length > 0 ? (
                        apiSegments.map((segment, idx) => {
                           const depTime = new Date(segment.Origin.DepTime);
                           const arrTime = new Date(segment.Destination.ArrTime);
                           const nextSegment = apiSegments[idx + 1];
                           
                           // Calculate layover if there's a next segment
                           let layoverText = null;
                           if (nextSegment) {
                              const nextDepTime = new Date(nextSegment.Origin.DepTime);
                              const diffMs = nextDepTime - arrTime;
                              const diffHrs = Math.floor(diffMs / 3600000);
                              const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                              layoverText = `${diffHrs}h ${diffMins}m layover in ${segment.Destination.Airport.CityName} (${segment.Destination.Airport.AirportCode})`;
                           }

                           return (
                              <React.Fragment key={idx}>
                                 {/* Segment Row */}
                                 <div className="flex items-start gap-6">
                                    {/* Column 1: Times */}
                                    <div className="flex flex-col justify-between py-1 h-[100px] shrink-0 w-20">
                                       <div className="text-[15px] font-black text-brand-black whitespace-nowrap">
                                          {depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                       </div>
                                       <div className="text-[15px] font-black text-brand-black whitespace-nowrap">
                                          {arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                       </div>
                                    </div>

                                    {/* Column 2: Vertical Line/Dots */}
                                    <div className="flex flex-col items-center py-2 h-[100px] shrink-0">
                                       <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-red bg-white z-10" />
                                       <div className="flex-1 w-[2px] bg-gradient-to-b from-brand-red to-brand-black/20 my-1" />
                                       <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-black/20 bg-white z-10" />
                                    </div>

                                    {/* Column 3: Segment Content */}
                                    <div className="flex flex-col justify-between h-[100px] flex-1">
                                       <div>
                                          <div className="text-sm font-black text-brand-black flex items-center gap-2">
                                             {segment.Origin.Airport.CityName} 
                                             <span className="text-[10px] bg-black/5 px-1.5 py-0.5 rounded text-brand-black/40 font-bold">{segment.Origin.Airport.AirportCode}</span>
                                             {segment.Origin.Airport.Terminal && <span className="text-[9px] text-brand-red font-black uppercase">Terminal {segment.Origin.Airport.Terminal}</span>}
                                          </div>
                                          <div className="text-[10px] font-bold text-brand-black/40 mt-0.5">{segment.Origin.Airport.AirportName}</div>
                                       </div>

                                       <div className="flex items-center gap-1.5">
                                          <div className="text-[10px] font-bold text-brand-black/30 flex items-center gap-1.5">
                                             <Clock size={12} className="text-brand-black/15" /> 
                                             {Math.floor(segment.Duration / 60)}h {segment.Duration % 60}m
                                             <span className="mx-1">•</span>
                                             {segment.Airline.AirlineName} {segment.Airline.AirlineCode}-{segment.Airline.FlightNumber}
                                          </div>
                                       </div>

                                       <div>
                                          <div className="text-sm font-black text-brand-black flex items-center gap-2">
                                             {segment.Destination.Airport.CityName}
                                             <span className="text-[10px] bg-black/5 px-1.5 py-0.5 rounded text-brand-black/40 font-bold">{segment.Destination.Airport.AirportCode}</span>
                                             {segment.Destination.Airport.Terminal && <span className="text-[9px] text-brand-red font-black uppercase">Terminal {segment.Destination.Airport.Terminal}</span>}
                                          </div>
                                          <div className="text-[10px] font-bold text-brand-black/40 mt-0.5">{segment.Destination.Airport.AirportName}</div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Layover Row */}
                                 {layoverText && (
                                    <div className="flex items-center gap-6 my-4">
                                       <div className="w-20 shrink-0" />
                                       <div className="w-2.5 shrink-0 flex justify-center">
                                          <div className="w-1 h-1 rounded-full bg-brand-black/20" />
                                       </div>
                                       <div className="flex-1 bg-brand-red/[0.03] border border-brand-red/5 rounded-xl px-4 py-2 flex items-center gap-3">
                                          <AlertCircle size={14} className="text-brand-red" />
                                          <span className="text-[11px] font-black text-brand-black uppercase tracking-tight">{layoverText}</span>
                                       </div>
                                    </div>
                                 )}
                              </React.Fragment>
                           );
                        })
                     ) : (
                        /* Fallback to simple view if no segments */
                        <div className="flex items-start gap-6">
                           <div className="flex flex-col justify-between py-1 h-[140px] shrink-0 w-20">
                              <div className="text-[15px] font-black text-brand-black whitespace-nowrap">{dynamicFlight.time}</div>
                              <div className="text-[15px] font-black text-brand-black whitespace-nowrap">{dynamicFlight.arrival}</div>
                           </div>
                           <div className="flex flex-col items-center py-2 h-[140px] shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-black/20 bg-white z-10" />
                              <div className="flex-1 w-[1px] border-l border-dashed border-black/20 my-1" />
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-black/20 bg-white z-10" />
                           </div>
                           <div className="flex flex-col justify-between h-[140px] flex-1">
                              <div className="pt-0.5">
                                 <div className="text-sm font-black text-brand-black">{dynamicFlight.fromCity || dynamicFlight.from}</div>
                                 <div className="text-[10px] font-bold text-brand-black/40 mt-1">{dynamicFlight.fromAirport}</div>
                              </div>
                              <div className="flex items-center gap-1.5 py-2">
                                 <div className="text-[10px] font-bold text-brand-black/30 flex items-center gap-1.5">
                                    <Clock size={12} className="text-brand-black/15" /> {dynamicFlight.dur}
                                 </div>
                              </div>
                              <div className="pb-0.5">
                                 <div className="text-sm font-black text-brand-black">{dynamicFlight.toCity || dynamicFlight.to}</div>
                                 <div className="text-[10px] font-bold text-brand-black/40 mt-1">{dynamicFlight.toAirport}</div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Baggage Row - Tighter */}
                  <div className="pt-4 border-t border-black/5 flex flex-wrap gap-6 items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-black/[0.03] rounded-lg flex items-center justify-center text-brand-black/40">
                           <Luggage size={16} />
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-brand-black/40 uppercase tracking-widest">Cabin</div>
                           <div className="text-[11px] font-black text-brand-black">{dynamicFlight.cabinBaggage}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-black/[0.03] rounded-lg flex items-center justify-center text-brand-black/40">
                           <Luggage size={16} />
                        </div>
                        <div>
                           <div className="text-[9px] font-black text-brand-black/40 uppercase tracking-widest">Check-In</div>
                           <div className="text-[11px] font-black text-brand-black">{dynamicFlight.checkInBaggage}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Excess Baggage Upsell Banner */}
               <div className="bg-blue-50/50 p-4 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <Luggage size={14} className="text-blue-600" />
                     </div>
                     <div className="text-[11px] font-bold text-brand-black/70 italic">
                        Got excess baggage? Don't stress, buy extra check-in baggage at fab rates!
                     </div>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Add Baggage</button>
               </div>
            </div>

            {/* 2. POLICIES & FARE RULES - MMT STYLE */}
            <div className="bg-white rounded-[1.2rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               <div className="p-4 md:p-6 border-b border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                        <ShieldCheck size={14} />
                     </div>
                     <h3 className="text-sm font-black text-brand-black uppercase tracking-widest">Cancellation & Date Change Policy</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Policy</button>
               </div>

               <div className="p-6 md:p-8">
                  <div className="mb-8">
                     <div className="text-[11px] font-black text-brand-black/40 uppercase tracking-[0.2em] mb-4">{flight.fromCity || flight.from} - {flight.toCity || flight.to}</div>
                     
                     {/* Visual Timeline Bar */}
                     <div className="relative pt-8 pb-4">
                        <div className="h-1.5 w-full bg-gradient-to-r from-green-500 via-amber-500 to-brand-red rounded-full relative">
                           {/* Markers */}
                           <div className="absolute left-0 -top-6 text-[10px] font-black text-brand-black">Now</div>
                           <div className="absolute left-1/2 -top-6 -translate-x-1/2 text-[10px] font-black text-brand-black">24 hrs before</div>
                           <div className="absolute right-0 -top-6 text-[10px] font-black text-brand-black">Departure</div>
                           
                           {/* Pointer */}
                           <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-brand-black rounded-full" />
                        </div>
                        <div className="flex justify-between mt-4">
                           <div className="text-[11px] font-black text-green-600">₹3,500 penalty</div>
                           <div className="text-[11px] font-black text-amber-600">₹5,500 penalty</div>
                           <div className="text-[11px] font-black text-brand-red">Non-Refundable</div>
                        </div>
                     </div>
                  </div>

                  {/* Benefits Comparison Upgrade Section */}
                  <div className="bg-blue-50/30 rounded-2xl border border-blue-100 p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[12px] font-black text-brand-black uppercase tracking-widest">Upgrade your selection for more benefits</h4>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                           <div className="flex items-center gap-2 mb-3">
                              <div className="w-4 h-4 rounded-full border-4 border-blue-600"></div>
                              <span className="text-xs font-black text-brand-black">Your Selection</span>
                              <span className="text-xs font-black text-brand-black ml-auto">₹{formatPrice(baseFare + tax)}</span>
                           </div>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> Cancellation fees apply
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> Date change fees apply
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/30">
                                 <X size={12} className="text-brand-red/30" /> Free seats not included
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> Cabin bag 7 Kgs included
                              </div>
                           </div>
                        </div>

                        <div className="p-4 bg-white/[0.6] rounded-xl border border-black/5 opacity-60">
                           <div className="flex items-center gap-2 mb-3">
                              <div className="w-4 h-4 rounded-full border border-black/20"></div>
                              <span className="text-xs font-black text-brand-black">Premium Flex</span>
                              <span className="text-xs font-black text-brand-black ml-auto">+₹2,499</span>
                           </div>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> Free Cancellation
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> Free Date Change
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> Free Seats included
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/60">
                                 <Check size={12} className="text-green-500" /> 20 Kgs Check-in bag
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. IMPORTANT INFORMATION - MMT STYLE */}
            <div className="bg-white rounded-[1.2rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               <div className="p-6 md:p-8 space-y-6">
                  <h3 className="text-base font-black text-brand-black">Important Information</h3>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-5 h-5 mt-0.5 bg-brand-red rounded-full flex items-center justify-center text-white shrink-0">
                           <ShieldAlert size={10} />
                        </div>
                        <div>
                           <h4 className="text-[13px] font-black text-brand-black mb-2">Check travel guidelines and baggage information below:</h4>
                           <ul className="list-disc list-inside text-[11px] font-bold text-brand-black/60 space-y-1.5 ml-1">
                              <li>Carry no more than 1 check-in baggage and 1 hand baggage per passenger. If violated, airline may levy extra charges.</li>
                           </ul>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <div className="w-5 h-5 mt-0.5 bg-brand-red rounded-full flex items-center justify-center text-white shrink-0">
                           <ShieldAlert size={10} />
                        </div>
                        <div>
                           <h4 className="text-[13px] font-black text-brand-black mb-2">Availability of Boarding Pass:</h4>
                           <ul className="list-disc list-inside text-[11px] font-bold text-brand-black/60 space-y-1.5 ml-1">
                              <li>Once web check-in is completed, your boarding pass will be available within 6 hours of your flight departure.</li>
                           </ul>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <div className="w-5 h-5 mt-0.5 bg-brand-red rounded-full flex items-center justify-center text-white shrink-0">
                           <ShieldAlert size={10} />
                        </div>
                        <div>
                           <h4 className="text-[13px] font-black text-brand-black mb-2">Unaccompanied Minors Travelling:</h4>
                           <ul className="list-disc list-inside text-[11px] font-bold text-brand-black/60 space-y-1.5 ml-1">
                              <li>An unaccompanied minor usually refers to a child traveling without an adult aged 18 or older.</li>
                              <li>Please check with the airline for their rules and regulations regarding unaccompanied minors, as these can differ between airlines.</li>
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
                  {/* 4. TRAVELLER DETAILS - MMT STYLE */}
            <div ref={travellerSectionRef} className="bg-white rounded-[1.2rem] border border-black/5 shadow-xl shadow-black/5 overflow-hidden">
               {/* Login Banner */}
               <div className="bg-blue-50/50 p-4 border-b border-blue-100/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        <User size={16} />
                     </div>
                     <span className="text-[11px] font-bold text-brand-black/70">Log in to view your <span className="font-black">saved traveller list</span>, unlock <span className="font-black text-brand-red">amazing deals</span> & much more!</span>
                  </div>
                  <button className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline">Login Now</button>
               </div>

               <div className="p-6 md:p-8">
                   {/* Traveller Header */}
                   <div className="flex flex-col gap-3 mb-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-brand-black/5 rounded-full flex items-center justify-center text-brand-black/40">
                               <User size={14} />
                            </div>
                            <h3 className="text-sm font-black text-brand-black uppercase tracking-tight">
                               Travellers ({adultsCount} Adult{adultsCount > 1 ? 's' : ''}
                               {childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}` : ''}
                               {infantsCount > 0 ? `, ${infantsCount} Infant${infantsCount > 1 ? 's' : ''}` : ''})
                            </h3>
                         </div>
                         <div className="text-[11px] font-black text-brand-black/40">
                            Completed: <span className="text-brand-black">{travellers.filter((t, idx) => isTravellerSectionValid(t, idx)).length}/{travellers.length}</span>
                         </div>
                      </div>
                      
                      {/* Global Progress Bar */}
                      <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                         <div 
                            className="bg-green-500 h-full transition-all duration-500" 
                            style={{ width: `${Math.round((travellers.filter((t, idx) => isTravellerSectionValid(t, idx)).length / travellers.length) * 100)}%` }}
                         />
                      </div>
                   </div>

                   {/* Important Note */}
                   <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-6 flex items-center gap-2">
                      <Info size={14} className="text-amber-600" />
                      <span className="text-[11px] font-bold text-amber-900"><span className="font-black">Important:</span> Enter name as mentioned on your passport or Government approved IDs.</span>
                   </div>

                   {errors[`global_pax`] && (
                      <div className="bg-red-50 text-red-700 border border-red-100 rounded-lg p-3 mb-4 text-xs font-bold flex items-center gap-2 animate-pulse">
                         <AlertCircle size={16} />
                         <span>{errors[`global_pax`]}</span>
                      </div>
                   )}

                   <div className="space-y-4 mb-8">
                      {travellers.map((traveller, index) => {
                         const isExpanded = expandedIndex === index;
                         const isValid = isTravellerSectionValid(traveller, index);
                         
                         return (
                            <div key={index} className={`bg-white border ${isExpanded ? 'border-brand-black/20 shadow-md' : 'border-black/10 shadow-sm'} rounded-xl overflow-hidden hover:border-brand-red/35 transition-all mb-4`}>
                               {/* Accordion Trigger Header */}
                               <div 
                                  onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                                  className="bg-black/[0.02] p-4 border-b border-black/5 flex items-center gap-3 cursor-pointer select-none"
                               >
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isValid ? 'bg-green-500 text-white' : 'bg-black/5 text-brand-black/30'}`}>
                                     <Check size={12} strokeWidth={3} />
                                  </div>
                                  <span className="text-[11px] font-black text-brand-black uppercase tracking-widest">
                                     {traveller.type === 'adult' ? 'ADULT' : (traveller.type === 'child' ? 'CHILD' : 'INFANT')} {index + 1}
                                     {index === 0 && <span className="text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded ml-2 normal-case font-bold">Lead Traveller</span>}
                                  </span>
                                  
                                  <div className="ml-auto flex items-center gap-3">
                                     {isValid ? (
                                        <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Completed</span>
                                     ) : (
                                        <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Incomplete</span>
                                     )}
                                     <ChevronDown size={16} className={`text-brand-black/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </div>
                               </div>
                               
                               <AnimatePresence initial={false}>
                                  {isExpanded && (
                                     <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                     >
                                        <div className="p-6 space-y-6">
                                           {/* Select Saved Traveller Dropdown */}
                                           <div className="flex flex-col md:flex-row md:items-center gap-4 bg-black/[0.01] p-4 rounded-xl border border-black/5">
                                              {savedTravellers.length > 0 && (
                                                 <div className="flex items-center gap-2">
                                                    <label className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest shrink-0">Select Saved Traveller:</label>
                                                    <select 
                                                       onChange={(e) => handleSelectSavedTraveller(index, e.target.value)}
                                                       defaultValue=""
                                                       className="bg-white border border-black/10 rounded-lg py-1.5 px-3 text-xs font-bold outline-none cursor-pointer"
                                                    >
                                                       <option value="" disabled>-- Select Profile --</option>
                                                       {savedTravellers.map(st => (
                                                          <option key={st.id} value={st.id}>{st.firstName} {st.lastName} ({st.relationship})</option>
                                                       ))}
                                                    </select>
                                                 </div>
                                              )}
                                              
                                              {/* Copy details from Lead (only for index > 0) */}
                                              {index > 0 && (
                                                 <button 
                                                    type="button"
                                                    onClick={() => copyFromLead(index)}
                                                    className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline md:ml-auto"
                                                 >
                                                    Copy details from Lead Traveller
                                                 </button>
                                              )}
                                           </div>

                                           {/* Name & Gender inputs */}
                                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                              <div className="md:col-span-1">
                                                 <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">Title</label>
                                                 <select 
                                                    value={traveller.title || 'Mr'}
                                                    onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                                                    className="w-full bg-white border border-black/10 rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none cursor-pointer"
                                                 >
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                    <option value="Ms">Ms</option>
                                                    <option value="Mstr">Mstr</option>
                                                 </select>
                                              </div>
                                              <div className="md:col-span-1">
                                                 <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">First Name</label>
                                                 <input 
                                                   type="text" 
                                                   value={traveller.firstName} 
                                                   onChange={(e) => handleInputChange(index, 'firstName', e.target.value)} 
                                                   placeholder="First Name" 
                                                   className={`w-full bg-white border ${errors[`traveller_${index}_firstName`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none`} 
                                                 />
                                                 {errors[`traveller_${index}_firstName`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`traveller_${index}_firstName`]}</p>}
                                              </div>
                                              <div className="md:col-span-1">
                                                 <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">Last Name</label>
                                                 <input 
                                                   type="text" 
                                                   value={traveller.lastName} 
                                                   onChange={(e) => handleInputChange(index, 'lastName', e.target.value)} 
                                                   placeholder="Last Name" 
                                                   className={`w-full bg-white border ${errors[`traveller_${index}_lastName`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none`} 
                                                 />
                                                 {errors[`traveller_${index}_lastName`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`traveller_${index}_lastName`]}</p>}
                                              </div>
                                              <div className="md:col-span-1">
                                                 <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">Gender</label>
                                                 <div className="flex border border-black/10 rounded-lg overflow-hidden h-[42px]">
                                                    <button 
                                                      type="button"
                                                      onClick={() => handleInputChange(index, 'gender', 'Male')}
                                                      className={`flex-1 text-[11px] font-black transition-all ${traveller.gender === 'Male' ? 'bg-brand-black text-white' : 'bg-white text-brand-black/40 hover:bg-black/5'}`}
                                                    >
                                                       MALE
                                                    </button>
                                                    <div className="w-[1px] bg-black/10" />
                                                    <button 
                                                      type="button"
                                                      onClick={() => handleInputChange(index, 'gender', 'Female')}
                                                      className={`flex-1 text-[11px] font-black transition-all ${traveller.gender === 'Female' ? 'bg-brand-black text-white' : 'bg-white text-brand-black/40 hover:bg-black/5'}`}
                                                    >
                                                       FEMALE
                                                    </button>
                                                 </div>
                                              </div>
                                           </div>

                                           {/* Conditional DOB row */}
                                           {(traveller.type === 'infant' || isInternational) && (
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                                 <div>
                                                    <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">
                                                       Date of Birth <span className="text-brand-red">*</span>
                                                    </label>
                                                    <input 
                                                      type="date" 
                                                      value={traveller.dob || ''} 
                                                      onChange={(e) => handleInputChange(index, 'dob', e.target.value)} 
                                                      className={`w-full bg-white border ${errors[`traveller_${index}_dob`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none`} 
                                                    />
                                                    {errors[`traveller_${index}_dob`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`traveller_${index}_dob`]}</p>}
                                                    {warnings[`traveller_${index}_dob`] && <p className="text-[9px] text-amber-600 font-bold mt-1">{warnings[`traveller_${index}_dob`]}</p>}
                                                 </div>
                                              </div>
                                           )}

                                           {/* Conditional Passport details row (only for international) */}
                                           {isInternational && (
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                                 <div>
                                                    <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">
                                                       Passport Number <span className="text-brand-red">*</span>
                                                    </label>
                                                    <input 
                                                      type="text" 
                                                      value={traveller.passportNumber || ''} 
                                                      onChange={(e) => handleInputChange(index, 'passportNumber', e.target.value)} 
                                                      placeholder="Passport Number" 
                                                      className={`w-full bg-white border ${errors[`traveller_${index}_passportNumber`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none uppercase`} 
                                                    />
                                                    {errors[`traveller_${index}_passportNumber`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`traveller_${index}_passportNumber`]}</p>}
                                                 </div>
                                                 <div>
                                                    <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">
                                                       Passport Expiry Date <span className="text-brand-red">*</span>
                                                    </label>
                                                    <input 
                                                      type="date" 
                                                      value={traveller.passportExpiry || ''} 
                                                      onChange={(e) => handleInputChange(index, 'passportExpiry', e.target.value)} 
                                                      className={`w-full bg-white border ${errors[`traveller_${index}_passportExpiry`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none`} 
                                                    />
                                                    {errors[`traveller_${index}_passportExpiry`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`traveller_${index}_passportExpiry`]}</p>}
                                                    {warnings[`traveller_${index}_passportExpiry`] && <p className="text-[9px] text-amber-600 font-bold mt-1">{warnings[`traveller_${index}_passportExpiry`]}</p>}
                                                 </div>
                                                 <div>
                                                    <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-1.5">
                                                       Issuing Country <span className="text-brand-red">*</span>
                                                    </label>
                                                    <select 
                                                       value={traveller.passportIssuingCountry || ''}
                                                       onChange={(e) => handleInputChange(index, 'passportIssuingCountry', e.target.value)}
                                                       className={`w-full bg-white border ${errors[`traveller_${index}_passportIssuingCountry`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none cursor-pointer`}
                                                    >
                                                       <option value="" disabled>Select Country</option>
                                                       <option value="India">India</option>
                                                       <option value="USA">USA</option>
                                                       <option value="UK">UK</option>
                                                       <option value="Canada">Canada</option>
                                                       <option value="Australia">Australia</option>
                                                       <option value="Other">Other</option>
                                                    </select>
                                                    {errors[`traveller_${index}_passportIssuingCountry`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`traveller_${index}_passportIssuingCountry`]}</p>}
                                                 </div>
                                              </div>
                                           )}

                                           <div className="flex items-center gap-2 pt-2">
                                              <input type="checkbox" className="w-4 h-4 rounded text-brand-red" />
                                              <span className="text-[11px] font-bold text-brand-black/60">I require wheelchair <span className="text-black/30 font-medium">(Optional)</span></span>
                                           </div>
                                        </div>
                                     </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
                         );
                      })}
                   </div>

                  {/* Contact Information Section */}
                  <div className="mt-10 pt-8 border-t border-black/5">
                     <h4 className="text-sm font-black text-brand-black mb-6">Booking details will be sent to</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                           <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2">Country Code</label>
                           <select className="w-full bg-white border border-black/10 rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none appearance-none cursor-pointer">
                              <option>India(91)</option>
                              <option>United Kingdom(44)</option>
                              <option>USA(1)</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2">Mobile No</label>
                           <input 
                             type="tel" 
                             value={travellers[0].phone} 
                             onChange={(e) => handleInputChange(0, 'phone', e.target.value)} 
                             placeholder="Mobile No" 
                             className={`w-full bg-white border ${errors[`contact_phone`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none`} 
                           />
                           {errors[`contact_phone`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`contact_phone`]}</p>}
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2">Email</label>
                           <input 
                             type="email" 
                             value={travellers[0].email} 
                             onChange={(e) => handleInputChange(0, 'email', e.target.value)} 
                             placeholder="Email" 
                             className={`w-full bg-white border ${errors[`contact_email`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none`} 
                           />
                           {errors[`contact_email`] && <p className="text-[9px] text-brand-red font-bold mt-1">{errors[`contact_email`]}</p>}
                        </div>
                     </div>

                     <div className="mt-6">
                        <div className="flex items-center gap-2">
                           <input 
                             type="checkbox" 
                             id="gst-check"
                             checked={showGST} 
                             onChange={(e) => setShowGST(e.target.checked)} 
                             className="w-4 h-4 rounded text-brand-red cursor-pointer" 
                           />
                           <label htmlFor="gst-check" className="text-[11px] font-bold text-brand-black/60 cursor-pointer">
                              I have a GST number <span className="text-black/30 font-medium">(Optional)</span>
                           </label>
                        </div>

                        <AnimatePresence>
                           {showGST && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }} 
                                animate={{ height: 'auto', opacity: 1 }} 
                                exit={{ height: 0, opacity: 0 }} 
                                className="mt-6 overflow-hidden"
                              >
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-black/[0.01] rounded-xl border border-black/5">
                                    <div>
                                       <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2">Company Name</label>
                                       <input 
                                         type="text" 
                                         value={gstData.companyName} 
                                         onChange={(e) => setGstData({...gstData, companyName: e.target.value})} 
                                         placeholder="Company Name" 
                                         className="w-full bg-white border border-black/10 rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none" 
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2">Registration No</label>
                                       <input 
                                         type="text" 
                                         value={gstData.registrationNo} 
                                         onChange={(e) => setGstData({...gstData, registrationNo: e.target.value})} 
                                         placeholder="Registration No" 
                                         className="w-full bg-white border border-black/10 rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none" 
                                       />
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                     {/* Your State Section - MMT Style */}
                     <div className="mt-8 pt-8 border-t border-black/5">
                        <div className="flex items-baseline gap-2 mb-4">
                           <h4 className="text-sm font-black text-brand-black">Your State</h4>
                           <span className="text-[10px] font-bold text-brand-black/30">(Required for GST purpose on your tax invoice. You can edit this anytime later in your profile section.)</span>
                        </div>
                        
                        <div className="max-w-md">
                           <label className="block text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2">Select the State</label>
                           <select 
                             className={`w-full bg-white border ${errors[`selectedState`] ? 'border-brand-red' : 'border-black/10'} rounded-lg py-2.5 px-3 text-sm font-bold focus:border-brand-red outline-none appearance-none cursor-pointer shadow-sm`}
                             value={selectedState}
                             onChange={(e) => setSelectedState(e.target.value)}
                           >
                              <option value="">Select State</option>
                              <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                              <option value="Assam">Assam</option>
                              <option value="Bihar">Bihar</option>
                              <option value="Chandigarh">Chandigarh</option>
                              <option value="Chhattisgarh">Chhattisgarh</option>
                              <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Pradesh">Himachal Pradesh</option>
                              <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Ladakh">Ladakh</option>
                              <option value="Lakshadweep">Lakshadweep</option>
                              <option value="Madhya Pradesh">Madhya Pradesh</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Manipur">Manipur</option>
                              <option value="Meghalaya">Meghalaya</option>
                              <option value="Mizoram">Mizoram</option>
                              <option value="Nagaland">Nagaland</option>
                              <option value="Odisha">Odisha</option>
                              <option value="Puducherry">Puducherry</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Sikkim">Sikkim</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Tripura">Tripura</option>
                              <option value="Uttar Pradesh">Uttar Pradesh</option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>
                              {/* Add more states as needed */}
                           </select>
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                           <input type="checkbox" id="save-billing" className="w-4 h-4 rounded border-black/20 text-brand-red cursor-pointer" />
                           <label htmlFor="save-billing" className="text-[11px] font-bold text-brand-black/60 cursor-pointer hover:underline">Confirm and save billing details to your profile</label>
                        </div>
                     </div>

                     {/* Lock Price Banner - MMT Style */}
                     <div className="mt-8 bg-[#E7F3FF] border border-[#B3D9FF] rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#008CFF] shadow-sm">
                              <Lock size={20} />
                           </div>
                           <div>
                              <div className="text-sm font-black text-brand-black flex items-center gap-1.5">
                                 Still unsure about this trip? <span className="text-[#008CFF]">Lock this price!</span>
                              </div>
                           </div>
                        </div>
                        <button className="px-6 py-2 border border-[#008CFF] text-[#008CFF] text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-[#008CFF] hover:text-white transition-all">
                           Lock Now
                        </button>
                     </div>

                     {/* Continue Button for Travellers */}
                     <div className="mt-8 flex justify-start">
                        <button 
                          onClick={handleContinueToSeats}
                          className="bg-[#008CFF] text-white px-12 py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-blue-500/20 hover:bg-[#0070CC] active:scale-95 transition-all"
                        >
                           Continue
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Collapsed Stage Bars - MMT Style */}
            {!unlockedSections.includes('seats') && (
               <div className="space-y-3">
                  <div className="bg-white/50 border border-black/5 p-5 rounded-2xl flex items-center justify-between opacity-40">
                     <span className="text-sm font-black text-brand-black/40">Seats & Meals</span>
                  </div>
                  <div className="bg-white/50 border border-black/5 p-5 rounded-2xl flex items-center justify-between opacity-40">
                     <span className="text-sm font-black text-brand-black/40">Cabs</span>
                  </div>
                  <div className="bg-white/50 border border-black/5 p-5 rounded-2xl flex items-center justify-between opacity-40">
                     <span className="text-sm font-black text-brand-black/40">Add-ons</span>
                  </div>
               </div>
            )}
       </div>

            <AnimatePresence>
               {unlockedSections.includes('seats') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-4"
                  >
                     {/* 5. SEAT & MEAL SELECTION */}
                     <div ref={seatSectionRef} className="bg-white rounded-[1.5rem] p-6 md:p-8 border border-black/5 shadow-xl shadow-black/5">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-8 h-8 bg-[#008CFF]/10 text-[#008CFF] rounded-lg flex items-center justify-center font-black text-sm">4</div>
                           <h2 className="text-xl font-black text-brand-black tracking-tight">Seats & Meals</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <button 
                             onClick={() => setActiveSection(activeSection === 'seats' ? 'flight' : 'seats')} 
                             className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${activeSection === 'seats' ? 'border-brand-red bg-brand-red/5' : 'border-black/5 bg-black/[0.01] hover:border-brand-red/20'}`}
                           >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${activeSection === 'seats' ? 'bg-brand-red text-white' : 'bg-white text-brand-black/40 shadow-sm'}`}>
                                 <Armchair size={24} />
                              </div>
                              <div className="text-lg font-black text-brand-black mb-0.5">Choose Seats</div>
                              <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-widest">
                                 {selectedSeats.filter(Boolean).length > 0 ? `${selectedSeats.filter(Boolean).length} Selected` : 'Tap to select'}
                              </div>
                           </button>

                           <button 
                             onClick={() => setActiveSection(activeSection === 'addons' ? 'flight' : 'addons')} 
                             className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${activeSection === 'addons' ? 'border-brand-red bg-brand-red/5' : 'border-black/5 bg-black/[0.01] hover:border-brand-red/20'}`}
                           >
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${activeSection === 'addons' ? 'bg-brand-red text-white' : 'bg-white text-brand-black/40 shadow-sm'}`}>
                                 <Coffee size={24} />
                              </div>
                              <div className="text-lg font-black text-brand-black mb-0.5">Meals & Bags</div>
                              <div className="text-[9px] font-bold text-brand-black/40 uppercase tracking-widest">
                                 {selectedMeals.length + selectedBaggage.length > 0 ? `${selectedMeals.length + selectedBaggage.length} Selected` : 'Customize trip'}
                              </div>
                           </button>
                        </div>

                        <AnimatePresence>
                           {activeSection === 'seats' && (
                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 overflow-hidden">
                                <div className="bg-black/[0.02] rounded-2xl p-6 border border-black/5">
                                   <div className="flex flex-col items-center">
                                      {ssrData?.SeatDynamic?.[activeSegmentIdx]?.SegmentSeat?.[0]?.RowSeats?.length > 0 && (
                                         <div className="mb-4 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Live Airline Seats</span>
                                         </div>
                                      )}
                                      <div className="flex gap-4 mb-6 text-[8px] font-black uppercase tracking-widest text-brand-black/40">
                                         <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-white border border-black/10"></div> Available</div>
                                         <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-red"></div> Selected</div>
                                         <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-black/10"></div> Booked</div>
                                      </div>

                                                                             {/* Segment Tabs Selector */}
                                       {apiSegments.length > 1 && (
                                          <div className="flex gap-2 mb-6 w-full max-w-[360px] border-b border-black/5 pb-2">
                                             {apiSegments.map((seg, idx) => {
                                                const isActive = activeSegmentIdx === idx;
                                                return (
                                                   <button
                                                      key={idx}
                                                      type="button"
                                                      onClick={() => {
                                                         setActiveSegmentIdx(idx);
                                                         // Reset active traveler to the first seat traveler
                                                         const firstSeatTraveller = travellers.find(t => t.type !== 'infant');
                                                         if (firstSeatTraveller) {
                                                            setActiveSeatTravellerIdx(travellers.indexOf(firstSeatTraveller));
                                                         } else {
                                                            setActiveSeatTravellerIdx(0);
                                                         }
                                                      }}
                                                      className={`flex-1 py-1.5 px-3 rounded-xl border text-center transition-all ${
                                                         isActive 
                                                            ? 'border-[#008CFF] bg-[#008CFF]/5 text-[#008CFF] font-black' 
                                                            : 'border-black/5 bg-white text-brand-black/60 font-bold hover:border-black/20'
                                                      }`}
                                                   >
                                                      <div className="text-[7px] uppercase tracking-widest text-brand-black/35 mb-0.5">
                                                         Leg {idx + 1}
                                                      </div>
                                                      <div className="text-[9px] font-bold">
                                                         {seg.Origin.Airport.AirportCode} → {seg.Destination.Airport.AirportCode}
                                                      </div>
                                                   </button>
                                                );
                                             })}
                                          </div>
                                       )}

                                       {/* Traveller Tabs Selector */}
                                       <div className="flex flex-col items-center w-full max-w-[360px] gap-2 mb-6">
                                          <div className="flex gap-2 overflow-x-auto w-full pb-2 px-1 scrollbar-thin">
                                             {travellers.filter(t => t.type !== 'infant').map((t) => {
                                                const originalIdx = travellers.indexOf(t);
                                                const seat = selectedSeats.find(s => s?.paxIdx === originalIdx && s?.segmentIdx === activeSegmentIdx);
                                                const isSelected = activeSeatTravellerIdx === originalIdx;
                                                return (
                                                   <button
                                                      key={originalIdx}
                                                      type="button"
                                                      onClick={() => setActiveSeatTravellerIdx(originalIdx)}
                                                      className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl border text-center transition-all ${
                                                         isSelected 
                                                            ? 'border-brand-red bg-brand-red/5 text-brand-red font-black shadow-sm' 
                                                            : 'border-black/5 bg-white text-brand-black/60 font-bold hover:border-black/20'
                                                      }`}
                                                   >
                                                      <div className="text-[8px] uppercase tracking-widest text-brand-black/35 mb-0.5">
                                                         {t.type === 'adult' 
                                                            ? `Adult ${travellers.filter((p, i) => p.type === 'adult' && i <= originalIdx).length}` 
                                                            : `Child ${travellers.filter((p, i) => p.type === 'child' && i <= originalIdx).length}`
                                                         }
                                                      </div>
                                                      <div className="text-[10px] truncate max-w-[80px] font-bold">
                                                         {t.firstName ? `${t.firstName}` : `Pax ${originalIdx + 1}`}
                                                      </div>
                                                      <div className="text-[8px] font-black mt-0.5 flex items-center justify-center gap-1">
                                                         <span className={seat ? 'text-brand-red' : 'text-brand-black/20'}>
                                                            {seat ? seat.code : '—'}
                                                         </span>
                                                         {seat && (
                                                            <span 
                                                               onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  handleSkipSeat(originalIdx, activeSegmentIdx);
                                                               }}
                                                               className="w-3.5 h-3.5 rounded-full bg-[#E52D2D]/10 text-[#E52D2D] hover:bg-[#E52D2D] hover:text-white flex items-center justify-center font-bold text-[8px] transition-all cursor-pointer"
                                                            >
                                                               ×
                                                            </span>
                                                         )}
                                                      </div>
                                                   </button>
                                                );
                                             })}
                                          </div>
                                          {/* Skip / No Seat button for the active traveller */}
                                          <button
                                             type="button"
                                             onClick={() => handleSkipSeat(activeSeatTravellerIdx, activeSegmentIdx)}
                                             className="text-[9px] font-black text-brand-black/40 hover:text-brand-black/60 uppercase tracking-widest border border-dashed border-black/10 px-3 py-1.5 rounded-lg hover:border-black/25 transition-all"
                                          >
                                             Skip Seat / No Seat
                                          </button>
                                       </div>

                                      <div className="w-full max-w-[360px] bg-white rounded-[60px] p-8 border border-black/5 shadow-inner">
                                         <div className="flex flex-col gap-2">
                                             {(ssrData?.SeatDynamic?.[activeSegmentIdx]?.SegmentSeat?.[0]?.RowSeats || []).length > 0 ? ssrData.SeatDynamic[activeSegmentIdx].SegmentSeat[0].RowSeats.map((row, idx) => {
                                                const rowNum = row.RowNo || idx + 1;
                                                const seats = row.Seats || [];
                                                return (
                                                   <div key={idx} className="flex gap-3 items-center justify-center">
                                                      {seats.map((seat, sIdx) => (
                                                         <React.Fragment key={sIdx}>
                                                            {/* Add aisle in the middle of seats */}
                                                            {sIdx === Math.floor(seats.length / 2) && <div className="w-4 text-[8px] font-black text-brand-black/20 text-center">{rowNum}</div>}
                                                            <button 
                                                               disabled={!seat.AvailablityType || seat.AvailablityType !== 1}
                                                               onClick={() => handleSeatClick(seat.Code, seat.Price, activeSeatTravellerIdx, activeSegmentIdx)}
                                                               title={getSeatTitle(seat.Code, seat.Price)}
                                                               className={`w-8 h-8 rounded-md flex flex-col items-center justify-center border-2 transition-all relative group/seat ${isSeatSelected(seat.Code) ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-black/5 text-brand-black/40 hover:border-brand-red/30 disabled:bg-black/5 disabled:text-black/10 disabled:cursor-not-allowed'}`}
                                                            >
                                                               <span className={`text-[8px] font-black ${isSeatSelected(seat.Code) ? 'text-white' : 'text-brand-black'}`}>{seat.Code}</span>
                                                               {isSeatSelected(seat.Code) ? (
                                                                  <span className="text-[7px] font-black bg-white/20 px-1 rounded text-white mt-0.5">
                                                                     {getInitials(travellers[selectedSeats.find(s => s?.code === seat.Code && s?.segmentIdx === activeSegmentIdx)?.paxIdx])}
                                                                  </span>
                                                               ) : (
                                                                  <Armchair size={10} className="opacity-40" />
                                                               )}
                                                            </button>
                                                         </React.Fragment>
                                                      ))}
                                                   </div>
                                                );
                                             }) : (
                                                /* Fallback for loading or empty API data */
                                                [1,2,3,4,5,6,7,8].map((rowNum) => (
                                                   <div key={rowNum} className="flex gap-3 items-center justify-center">
                                                      <div className="flex gap-1.5">
                                                                                                                   {['A','B','C'].map(c => {
                                                             const seatCode = `${rowNum}${c}`;
                                                             const isSelected = isSeatSelected(seatCode);
                                                             const selectedSeatObj = selectedSeats.find(s => s?.code === seatCode && s?.segmentIdx === activeSegmentIdx);
                                                             return (
                                                                <button 
                                                                  key={c} 
                                                                  onClick={() => handleSeatClick(seatCode, 0, activeSeatTravellerIdx, activeSegmentIdx)} 
                                                                  title={getSeatTitle(seatCode, 0)}
                                                                  className={`w-8 h-8 rounded-md flex flex-col items-center justify-center border-2 transition-all ${isSelected ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-black/5 text-brand-black/40 hover:border-brand-red/30'}`}
                                                                >
                                                                   <span className={`text-[8px] font-black ${isSelected ? 'text-white' : 'text-brand-black'}`}>{seatCode}</span>
                                                                   {isSelected ? (
                                                                      <span className="text-[7px] font-black bg-white/20 px-1 rounded text-white mt-0.5">
                                                                         {getInitials(travellers[selectedSeatObj?.paxIdx])}
                                                                      </span>
                                                                   ) : (
                                                                      <Armchair size={10} className="opacity-40" />
                                                                   )}
                                                                </button>
                                                             );
                                                          })}
                                                      </div>
                                                      <div className="w-4 text-[8px] font-black text-brand-black/20 text-center">{rowNum}</div>
                                                      <div className="flex gap-1.5">
                                                                                                                   {['D','E','F'].map(c => {
                                                             const seatCode = `${rowNum}${c}`;
                                                             const isSelected = isSeatSelected(seatCode);
                                                             const selectedSeatObj = selectedSeats.find(s => s?.code === seatCode && s?.segmentIdx === activeSegmentIdx);
                                                             return (
                                                                <button 
                                                                  key={c} 
                                                                  onClick={() => handleSeatClick(seatCode, 0, activeSeatTravellerIdx, activeSegmentIdx)} 
                                                                  className={`w-8 h-8 rounded-md flex flex-col items-center justify-center border-2 transition-all ${isSelected ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-black/5 text-brand-black/40 hover:border-brand-red/30'}`}
                                                                  title={getSeatTitle(seatCode, 0)}
                                                                >
                                                                   <span className={`text-[8px] font-black ${isSelected ? 'text-white' : 'text-brand-black'}`}>{seatCode}</span>
                                                                   {isSelected ? (
                                                                      <span className="text-[7px] font-black bg-white/20 px-1 rounded text-white mt-0.5">
                                                                         {getInitials(travellers[selectedSeatObj?.paxIdx])}
                                                                      </span>
                                                                   ) : (
                                                                      <Armchair size={10} className="opacity-40" />
                                                                   )}
                                                                </button>
                                                             );
                                                          })}
                                                      </div>
                                                   </div>
                                                ))
                                             )}
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             </motion.div>
                           )}
                           {activeSection === 'addons' && (
                             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 overflow-hidden">
                                 <div className="flex flex-col items-center w-full mb-6">
                                    <div className="flex gap-2 overflow-x-auto w-full pb-2 px-1 scrollbar-thin">
                                       {travellers.filter(t => t.type !== 'infant').map((t) => {
                                          const originalIdx = travellers.indexOf(t);
                                          const meal = selectedMeals.find(m => m.paxIdx === originalIdx);
                                          const bag = selectedBaggage.find(b => b.paxIdx === originalIdx);
                                          const isSelected = activeAddonTravellerIdx === originalIdx;
                                          return (
                                             <button
                                                key={originalIdx}
                                                type="button"
                                                onClick={() => setActiveAddonTravellerIdx(originalIdx)}
                                                className={`flex-1 min-w-[95px] py-2 px-3 rounded-xl border text-center transition-all ${
                                                   isSelected 
                                                      ? 'border-brand-red bg-brand-red/5 text-brand-red font-black shadow-sm' 
                                                      : 'border-black/5 bg-white text-brand-black/60 font-bold hover:border-black/20'
                                                }`}
                                             >
                                                <div className="text-[8px] uppercase tracking-widest text-brand-black/35 mb-0.5">
                                                   {t.type === 'adult' 
                                                      ? `Adult ${travellers.filter((p, i) => p.type === 'adult' && i <= originalIdx).length}` 
                                                      : `Child ${travellers.filter((p, i) => p.type === 'child' && i <= originalIdx).length}`
                                                   }
                                                </div>
                                                <div className="text-[10px] truncate max-w-[80px] font-bold">
                                                   {t.firstName ? `${t.firstName}` : `Pax ${originalIdx + 1}`}
                                                </div>
                                                <div className="text-[8px] font-black mt-0.5 flex items-center justify-center gap-1">
                                                   <span className={meal || bag ? 'text-brand-red' : 'text-brand-black/20'}>
                                                      {meal ? 'M' : ''}{meal && bag ? ' + ' : ''}{bag ? 'B' : ''}{!meal && !bag ? '—' : ''}
                                                   </span>
                                                </div>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Meals */}
                                    <div className="bg-black/[0.02] rounded-2xl p-6 border border-black/5">
                                       <h4 className="text-xs font-black text-brand-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Coffee size={14} /> Meal Options
                                       </h4>
                                       <div className="space-y-2">
                                           {(ssrData?.Meal?.[0] || [{ Description: 'Standard Veg Meal', Price: 450 }, { Description: 'Non-Veg Meal', Price: 550 }]).map((meal, idx) => {
                                              const mName = meal.Description || meal.name;
                                              const mPrice = meal.Price || meal.price;
                                              const isSelected = selectedMeals.some(m => m.name === mName && m.paxIdx === activeAddonTravellerIdx);

                                              return (
                                                 <div key={idx} 
                                                      onClick={() => handleToggleMeal(mName, mPrice, activeAddonTravellerIdx)}
                                                      className={`bg-white p-3 rounded-xl border flex items-center justify-between group transition-all cursor-pointer ${isSelected ? 'border-brand-red ring-1 ring-brand-red/20' : 'border-black/5 hover:border-brand-red/30'}`}>
                                                    <div>
                                                       <div className="text-[10px] font-bold text-brand-black">{mName}</div>
                                                       <div className="text-[9px] font-black text-brand-red mt-0.5">₹{mPrice}</div>
                                                    </div>
                                                    <div className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-brand-red' : 'text-brand-black/20 group-hover:text-brand-red/50'}`}>
                                                       {isSelected ? 'Added' : 'Add'}
                                                    </div>
                                                 </div>
                                              );
                                           })}
                                       </div>
                                    </div>

                                    {/* Baggage */}
                                    <div className="bg-black/[0.02] rounded-2xl p-6 border border-black/5">
                                       <h4 className="text-xs font-black text-brand-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                          <Luggage size={14} /> Extra Baggage
                                       </h4>
                                       <div className="space-y-2">
                                          {(ssrData?.Baggage?.[0] || [
                                            { Weight: '5 KG', Price: 1200, Code: 'B5' }, 
                                            { Weight: '10 KG', Price: 2200, Code: 'B10' },
                                            { Weight: '15 KG', Price: 3200, Code: 'B15' }
                                          ]).map((bag, idx) => {
                                             const isSelected = selectedBaggage.some(b => b.code === (bag.Code || bag.Weight) && b.paxIdx === activeAddonTravellerIdx);
                                             return (
                                                <div 
                                                  key={idx} 
                                                  onClick={() => handleToggleBaggage(bag.Weight, bag.Price, bag.Code || bag.Weight, activeAddonTravellerIdx)}
                                                  className={`bg-white p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${isSelected ? 'border-brand-red ring-1 ring-brand-red/20' : 'border-black/5 hover:border-brand-red/30'}`}
                                                >
                                                   <div className="flex items-center gap-3">
                                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-brand-red text-white' : 'bg-black/5 text-brand-black/40'}`}>
                                                         <Luggage size={16} />
                                                      </div>
                                                      <div>
                                                         <div className="text-[11px] font-black text-brand-black">{bag.Weight || bag.weight} Extra</div>
                                                      </div>
                                                   </div>
                                                   <div className="text-right">
                                                      <div className="text-[11px] font-black text-brand-red">₹{bag.Price || bag.price}</div>
                                                      <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isSelected ? 'text-brand-red' : 'text-brand-black/20'}`}>
                                                         {isSelected ? 'Added' : 'Add'}
                                                      </div>
                                                   </div>
                                                </div>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 </div>
                             </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                     {/* 5. T&C */}
                     <div className="p-6 bg-black/5 rounded-2xl flex items-start gap-3">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-black/20 text-brand-red" />
                        <div className="text-xs font-bold text-brand-black/60 leading-relaxed">
                           I agree to the <span className="text-brand-red underline cursor-pointer">Fare Rules</span>, <span className="text-brand-red underline cursor-pointer">Terms</span> and <span className="text-brand-red underline cursor-pointer">Privacy Policy</span>.
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

          </div>

          {/* RIGHT: STICKY FARE SIDEBAR */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky top-24">
             <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black text-brand-black tracking-tight">Fare Summary</h3>
                   <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <ShieldCheck size={16} />
                   </div>
                </div>

                <div className="space-y-4 mb-8 pb-8 border-b border-black/5 font-bold text-brand-black/60 text-xs">
                   <div className="flex justify-between">
                      <span>Base Fare ({travellers.length} Pax)</span>
                      <span className="text-brand-black font-black">₹{formatPrice(baseFare)}</span>
                   </div>
                   <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span className="text-brand-black font-black">₹{formatPrice(tax)}</span>
                   </div>
                   {ssrTotal > 0 && (
                     <div className="flex justify-between text-brand-red">
                        <span>Add-ons</span>
                        <span className="font-black">₹{formatPrice(ssrTotal)}</span>
                     </div>
                   )}
                   <div className="flex justify-between">
                      <span>Convenience Fee</span>
                      <span className="text-brand-black font-black">₹{formatPrice(convenienceFee)}</span>
                   </div>
                   {couponDiscount > 0 && (
                     <div className="flex justify-between text-green-600">
                        <span>Promo Discount</span>
                        <span className="font-black">- ₹{formatPrice(couponDiscount)}</span>
                     </div>
                   )}
                </div>

                {/* Coupon Input */}
                <div className="mb-8">
                   <div className="flex gap-2 mb-2">
                      <div className="flex-1 relative">
                         <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/30" size={16} />
                         <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="PROMO CODE" className="w-full bg-black/[0.02] border border-black/10 rounded-lg py-2 pl-9 pr-3 font-black uppercase tracking-widest text-[10px] focus:border-brand-red outline-none" />
                      </div>
                      <button onClick={handleApplyCoupon} className="px-4 bg-brand-black text-white rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-brand-red transition-all">Apply</button>
                   </div>
                   {couponError && <div className="text-[9px] font-bold text-red-500 ml-2">{couponError}</div>}
                </div>

                <div className="flex justify-between items-end mb-8">
                   <div>
                      <div className="text-[9px] font-black text-brand-black/30 uppercase tracking-widest mb-0.5">Total Amount</div>
                      <div className="text-3xl font-black text-brand-black tracking-tighter">₹{formatPrice(grandTotal)}</div>
                   </div>
                </div>

                <button onClick={proceedToPayment} disabled={loading || !allSectionsValid} className="w-full bg-brand-red text-white py-4 rounded-xl font-black text-base uppercase tracking-widest shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                   {loading ? <Loader2 className="animate-spin" size={20} /> : <>Continue <ArrowRight size={20} /></>}
                </button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;

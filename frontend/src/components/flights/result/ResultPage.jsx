/**
 * ============================================================================
 * PATH: client/src/pages/flights/result/ResultPage.jsx
 * DESCRIPTION: Main assembler page for flight search results.
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, ChevronDown, Zap, Star, Tag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import flightService from "../../../services/flightService";

// Global Layout Components
import Header from "../../../common/Header";
import Footer from '../../common/Footer';

// Assets
import searchSummarySvg from "../../../assets/flights/search-summary.svg";

// Modular Section Components
import SearchSummary from "./components/SearchSummary";
import Filters from "./components/Filters";
import FareCalendar from "./components/FareCalendar";
import Card from "./components/Card";
import FareModal from "./components/FareModal";
import FlightSkeleton from "./components/FlightSkeleton";

export default function ResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Modal selector states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // State for fare type selections
  const [fareType, setFareType] = useState("regular");

  // State for sidebar filter selections
  const [selectedStops, setSelectedStops] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedDeparture, setSelectedDeparture] = useState([]);
  const [selectedArrival, setSelectedArrival] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  // State for active calendar date index & sorting
  const [selectedDateIdx, setSelectedDateIdx] = useState(3);
  const [sortBy, setSortBy] = useState("cheapest");

  // Loading & Live Flight list states
  const [loading, setLoading] = useState(false);
  const [liveFlights, setLiveFlights] = useState([]);
  
  // Domestic Return specific states
  const [isDomesticReturn, setIsDomesticReturn] = useState(false);
  const [liveOutboundFlights, setLiveOutboundFlights] = useState([]);
  const [liveInboundFlights, setLiveInboundFlights] = useState([]);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
  const [selectedInboundFlight, setSelectedInboundFlight] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  // Reset all filters callback
  const handleResetFilters = () => {
    setSelectedStops([]);
    setSelectedAirlines([]);
    setMinPrice(1000);
    setMaxPrice(50000);
    setSelectedDeparture([]);
    setSelectedArrival([]);
  };

  // Filter & Sort Pipeline Function
  const applyFiltersAndSort = (flightsArray) => {
    if (!flightsArray || !Array.isArray(flightsArray)) return [];
    
    const filtered = flightsArray.filter((flight) => {
      // 1. Price filter
      const rawPrice = parseInt(String(flight.price || "0").replace(/[^\d]/g, ""), 10) || 0;
      if (rawPrice > maxPrice || rawPrice < minPrice) return false;
  
      // 2. Stops filter
      if (selectedStops.length > 0) {
        const stopsStr = (flight.stops || "").toLowerCase();
        const matchesStop = selectedStops.some((s) => {
          if (s === "non-stop") return stopsStr.includes("non") || stopsStr === "0" || stopsStr === "0 stop";
          if (s === "1-stop") return stopsStr.includes("1") || stopsStr.includes("one");
          if (s === "2-stops") return stopsStr.includes("2") || stopsStr.includes("multi") || stopsStr.includes("2+");
          return true;
        });
        if (!matchesStop) return false;
      }
  
      // 3. Airline filter
      if (selectedAirlines.length > 0) {
        const airlineName = (flight.airline || "").toLowerCase();
        const code = (flight.code || "").toLowerCase();
        const matchesAirline = selectedAirlines.some((a) => {
          const id = String(a).toLowerCase();
          if (id === "indigo") return airlineName.includes("indigo") || code.includes("6e");
          if (id === "airindia") return airlineName.includes("air india") || code.includes("ai");
          if (id === "spicejet") return airlineName.includes("spice") || code.includes("sg");
          if (id === "vistara") return airlineName.includes("vistara") || code.includes("uk");
          if (id === "akasa") return airlineName.includes("akasa") || code.includes("qp");
          if (id === "airasia") return airlineName.includes("airasia") || code.includes("i5") || code.includes("ix");
          if (id === "alliance") return airlineName.includes("alliance") || code.includes("9i");
          if (id === "emirates") return airlineName.includes("emirates") || code.includes("ek");
          if (id === "qatar") return airlineName.includes("qatar") || code.includes("qr");
          if (id === "etihad") return airlineName.includes("etihad") || code.includes("ey");
          if (id === "flydubai") return airlineName.includes("flydubai") || code.includes("fz");
          if (id === "airarabia") return airlineName.includes("arabia") || code.includes("g9");
          if (id === "singapore") return airlineName.includes("singapore") || code.includes("sq");
          if (id === "gulfair") return airlineName.includes("gulf") || code.includes("gf");
          if (id === "omanair") return airlineName.includes("oman") || code.includes("wy");
          if (id === "saudia") return airlineName.includes("saud") || code.includes("sv");
          if (id === "kuwait") return airlineName.includes("kuwait") || code.includes("ku");
          if (id === "jazeera") return airlineName.includes("jazeera") || code.includes("j9");
          if (id === "thai") return airlineName.includes("thai") || code.includes("tg");
          if (id === "malaysia") return airlineName.includes("malaysia") || code.includes("mh");
          if (id === "batik") return airlineName.includes("batik") || airlineName.includes("malindo") || code.includes("od");
          if (id === "vietjet") return airlineName.includes("vietjet") || code.includes("vj");
          if (id === "british") return airlineName.includes("british") || code.includes("ba");
          if (id === "lufthansa") return airlineName.includes("lufthansa") || code.includes("lh");
          if (id === "airfrance") return airlineName.includes("france") || code.includes("af");
          if (id === "klm") return airlineName.includes("klm") || code.includes("kl");
          if (id === "cathay") return airlineName.includes("cathay") || code.includes("cx");
          if (id === "jal") return airlineName.includes("japan") || code.includes("jl");
          if (id === "ana") return airlineName.includes("nippon") || code.includes("nh");
          if (id === "united") return airlineName.includes("united") || code.includes("ua");
          if (id === "american") return airlineName.includes("american") || code.includes("aa");
          if (id === "delta") return airlineName.includes("delta") || code.includes("dl");
          if (id === "turkish") return airlineName.includes("turkish") || code.includes("tk");
          if (id === "ethiopian") return airlineName.includes("ethiopian") || code.includes("et");
          if (id === "egyptair") return airlineName.includes("egypt") || code.includes("ms");
  
          return airlineName.includes(id) || code.includes(id);
        });
        if (!matchesAirline) return false;
      }
  
      // Helper to accurately parse hour from 12-hour (AM/PM) or 24-hour time strings
      const parseHour = (timeStr) => {
        if (!timeStr) return 0;
        const str = String(timeStr).trim().toUpperCase();
        const isPM = str.includes("PM");
        const isAM = str.includes("AM");
        const match = str.match(/(\d{1,2}):(\d{2})/);
        if (!match) return 0;
        let h = parseInt(match[1], 10);
        if (isPM && h < 12) h += 12;
        if (isAM && h === 12) h = 0;
        return h;
      };

      // 4. Departure Time filter
      if (selectedDeparture.length > 0) {
        const hour = parseHour(flight.departTime || flight.time);
        const matchesDep = selectedDeparture.some((d) => {
          if (d === "dep-early") return hour >= 0 && hour < 6;
          if (d === "dep-morning") return hour >= 6 && hour < 12;
          if (d === "dep-afternoon") return hour >= 12 && hour < 18;
          if (d === "dep-evening") return hour >= 18 && hour < 24;
          return true;
        });
        if (!matchesDep) return false;
      }
  
      // 5. Arrival Time filter
      if (selectedArrival.length > 0) {
        const hour = parseHour(flight.arrivalTime || flight.arrival);
        const matchesArr = selectedArrival.some((a) => {
          if (a === "arr-early") return hour >= 0 && hour < 6;
          if (a === "arr-morning") return hour >= 6 && hour < 12;
          if (a === "arr-afternoon") return hour >= 12 && hour < 18;
          if (a === "arr-evening") return hour >= 18 && hour < 24;
          return true;
        });
        if (!matchesArr) return false;
      }
  
      return true;
    });

    return filtered.sort((a, b) => {
      const priceA = parseInt(String(a.price || "0").replace(/[^\d]/g, ""), 10) || 0;
      const priceB = parseInt(String(b.price || "0").replace(/[^\d]/g, ""), 10) || 0;
      if (sortBy === "cheapest") return priceA - priceB;
      if (sortBy === "fastest") {
        const durA = parseInt(String(a.duration || "0").replace(/[^\d]/g, ""), 10) || 120;
        const durB = parseInt(String(b.duration || "0").replace(/[^\d]/g, ""), 10) || 120;
        return durA - durB;
      }
      return priceA - priceB;
    });
  };

  const displayedFlights = isDomesticReturn ? [] : applyFiltersAndSort(liveFlights);
  const displayedOutboundFlights = isDomesticReturn ? applyFiltersAndSort(liveOutboundFlights) : [];
  const displayedInboundFlights = isDomesticReturn ? applyFiltersAndSort(liveInboundFlights) : [];

  // Fetch Live Flights from Adivaha API via Backend
  useEffect(() => {
    const tripType = searchParams.get("tripType") || "one-way";
    const adults = searchParams.get("adults") || "1";
    const children = searchParams.get("children") || "0";
    const infants = searchParams.get("infants") || searchParams.get("infant") || "0";
    const cabinClass = searchParams.get("cabinClass") || "Economy";

    const fetchLiveSearch = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        let response;
        let origin = "";
        let destination = "";
        let departureDate = "";

        if (tripType === "multi-city") {
          // Parse segments JSON from URL
          const rawSegments = searchParams.get("segments") || "[]";
          let segments = [];
          try { segments = JSON.parse(decodeURIComponent(rawSegments)); } catch { segments = []; }

          if (segments.length > 0) {
            origin = segments[0].from || "DEL";
            destination = segments[segments.length - 1].to || "DXB";
            departureDate = segments[0].departureDate || new Date().toISOString().split("T")[0];
          } else {
            origin = "DEL";
            destination = "BOM";
            departureDate = new Date().toISOString().split("T")[0];
          }

          response = await flightService.searchMultiCity({
            segments,
            adults: parseInt(adults, 10) || 1,
            children: parseInt(children, 10) || 0,
            infants: parseInt(infants, 10) || 0,
            cabinClass
          });
        } else {
          origin = searchParams.get("origin") || "DEL";
          destination = searchParams.get("destination") || "BOM";
          departureDate = searchParams.get("departureDate") || new Date().toISOString().split("T")[0];
          const returnDate = searchParams.get("returnDate") || "";
          response = await flightService.searchFlights({ origin, destination, departureDate, adults, children, infants, cabinClass, tripType, returnDate });
        }


        let rawList = [];
        const responseTraceId = response?.traceId || response?.data?.traceId || null;
        if (Array.isArray(response?.data?.flights)) rawList = response.data.flights;
        else if (Array.isArray(response?.data)) rawList = response.data;
        else if (Array.isArray(response?.flights)) rawList = response.flights;
        else if (Array.isArray(response)) rawList = response;

        const transformFlights = (list, responseTraceId) => {
          if (!list || !Array.isArray(list) || list.length === 0) return [];
          return list.map((f, idx) => {
            if (!f || typeof f !== 'object') return null;

            const airlineCode = f.airlineCode || f.AirlineCode || f.validatingAirline || "6E";

            const parseTime = (val) => {
              if (!val) return "";
              const s = String(val).trim();
              if (s.includes("T")) {
                const parts = s.split("T");
                return parts[1] ? parts[1].substring(0, 5) : "";
              }
              const lowerS = s.toLowerCase();
              if (s.includes(" ") && (lowerS.includes("am") || lowerS.includes("pm"))) {
                const parts = s.split(" ");
                // If the first part is a time like 10:30, return it
                return parts[0] ? parts[0].substring(0, 5) + " " + (parts[1] || "").toUpperCase() : s;
              }
              if (s.includes(" ")) {
                const parts = s.split(" ");
                return parts[0] ? parts[0].substring(0, 5) : "";
              }
              if (/^\d{2}:\d{2}/.test(s)) {
                return s.substring(0, 5);
              }
              return s;
            };

            const parseDuration = (val) => {
              if (!val) return "02h 15m";
              if (typeof val === 'number') {
                const h = Math.floor(val / 60);
                const m = val % 60;
                return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
              }
              const s = String(val).trim();
              if (/^\d+$/.test(s)) {
                const mins = parseInt(s, 10);
                const h = Math.floor(mins / 60);
                const m = mins % 60;
                return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
              }
              return s;
            };

            // Extract real departure/arrival time from Adivaha API response fields
            const rawDepTime = f.time || f.depTime || f.departTime || f.DepartureTime || (f.Segments && f.Segments[0] ? f.Segments[0][0]?.Origin?.DepTime : null);
            const rawArrTime = f.arrival || f.arrTime || f.arrivalTime || f.ArrivalTime || (f.Segments && f.Segments[0] ? f.Segments[0][f.Segments[0].length - 1]?.Destination?.ArrTime : null);
            
            const depT = parseTime(rawDepTime) || "06:00";
            const arrT = parseTime(rawArrTime) || "08:15";

            const rawDuration = f.dur || f.duration || f.Duration;
            const durT = parseDuration(rawDuration);

            const rawStops = f.stops !== undefined ? f.stops : f.Stops;
            let stopsText = "Non-stop";
            if (rawStops === 1 || rawStops === "1" || rawStops === "1-stop") {
              stopsText = "1 Stop";
            } else if (rawStops > 1 || rawStops === "2-stops" || rawStops === "multi") {
              stopsText = `${rawStops} Stops`;
            } else if (f.layover) {
              stopsText = f.layover;
            }

            const fareVal = f.price || f.Fare?.OfferedFare || f.Fare?.PublishedFare || f.fare || f.totalFare || "3,499";
            const priceText = typeof fareVal === 'number' ? `₹${fareVal.toLocaleString('en-IN')}` : String(fareVal);

            return {
              id: f.id || f.ResultIndex || f.resultIndex || `fl-${idx}`,
              traceId: f.traceId || responseTraceId,
              resultIndex: f.resultIndex || f.ResultIndex,
              isLCC: f.isLCC !== undefined ? f.isLCC : (f.IsLCC !== undefined ? Boolean(f.IsLCC) : false),
              logo: f.logo || `https://images.kiwi.com/airlines/64/${airlineCode}.png`,
              airline: f.airline || f.AirlineName || f.airlineName || "Airline",
              code: f.flight || `${airlineCode}-${f.FlightNumber || f.flightNumber || 100 + idx}`,
              departTime: depT,
              departCity: f.from || f.origin || f.Origin || origin,
              duration: durT,
              stops: stopsText,
              arrivalTime: arrT,
              arrivalCity: f.to || f.destination || f.Destination || destination,
              price: priceText,
              oldPrice: f.oldPrice ? String(f.oldPrice) : "",
              badge: idx === 0 ? "Cheapest" : idx === 1 ? "Fastest" : "Popular",
              baggage: f.baggage || f.Baggage || f.Segments?.[0]?.[0]?.Baggage || "15 Kgs (1 piece only)",
              cabin: f.cabinBaggage || f.CabinBaggage || f.Segments?.[0]?.[0]?.CabinBaggage || "7 Kgs (1 piece only)",
              refundable: (() => {
                if (f.isRefundable !== undefined) return f.isRefundable;
                if (f.IsRefundable !== undefined) return f.IsRefundable;
                if (f.Fare?.IsRefundable !== undefined) return f.Fare?.IsRefundable;
                return true;
              })() ? "Refundable" : "Non-Refundable",
              seatsLeft: f.seatsLeft || f.SeatsLeft || f.NoOfSeatAvailable || 5,
              date: departureDate,
              raw: f
            };
          }).filter(Boolean);
        };

        const isDomesticReturnFlag = response?.data?.isDomesticReturn === true;
        setIsDomesticReturn(isDomesticReturnFlag);

        if (isDomesticReturnFlag) {
          const outList = response?.data?.outboundFlights || [];
          const inList = response?.data?.inboundFlights || [];
          
          const transformedOut = transformFlights(outList, responseTraceId);
          const transformedIn = transformFlights(inList, responseTraceId);
          
          setLiveOutboundFlights(transformedOut);
          setLiveInboundFlights(transformedIn);
          setLiveFlights([]);
          
          if (transformedOut.length > 0 || transformedIn.length > 0) {
            sessionStorage.setItem('lastFlightSearchUrl', window.location.pathname + window.location.search);
          } else {
            sessionStorage.removeItem('lastFlightSearchUrl');
          }
        } else {
          const transformed = transformFlights(rawList, responseTraceId);
          setLiveFlights(transformed);
          setLiveOutboundFlights([]);
          setLiveInboundFlights([]);

          // Dynamically adjust maxPrice slider ceiling if flight prices exceed current slider limit
          if (transformed.length > 0) {
            const maxVal = Math.max(...transformed.map(f => parseInt(String(f.price || "0").replace(/[^\d]/g, ""), 10) || 0));
            if (maxVal > 50000) {
              setMaxPrice(Math.ceil(maxVal / 10000) * 10000 + 20000);
            }
          }
          
          if (transformed.length > 0) {
            sessionStorage.setItem('lastFlightSearchUrl', window.location.pathname + window.location.search);
          } else {
            sessionStorage.removeItem('lastFlightSearchUrl');
          }
        }
      } catch (err) {
        console.warn("Live API Search error:", err.message);
        setErrorMsg('some error has occured');
        setLiveFlights([]);
        sessionStorage.removeItem('lastFlightSearchUrl');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSearch();
  }, [searchParams]);


  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const handleBookNow = (fareOption) => {
    setIsModalOpen(false);
    navigate("/flights/book", {
      state: {
        flight: selectedFlight,
        fare: fareOption,
        searchContext: {
          adults: parseInt(searchParams.get("adults") || "1", 10),
          children: parseInt(searchParams.get("children") || "0", 10),
          infants: parseInt(searchParams.get("infants") || searchParams.get("infant") || "0", 10),
          cabinClass: searchParams.get("cabinClass") || "Economy",
          tripType: searchParams.get("tripType") || "one-way",
          departureDate: searchParams.get("departureDate") || "",
          origin: searchParams.get("origin") || "DEL",
          destination: searchParams.get("destination") || "BOM"
        }
      }
    });
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between font-sans text-left">

      {/* 1. Global Header block */}
      <Header />

      {/* 2. Main Container with Search Summary and Content Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-8 w-full font-['Quicksand'] flex-grow">

        {/* Search Summary Top Card (Exact Figma Design) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <SearchSummary loading={loading} onModify={() => console.log("Modifying search...")} />
        </motion.div>

        {/* 3. Page Content Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >

          {/* Left Column: Filter sidebar */}
          {showFilters && (
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <Filters
                flights={liveFlights}
                selectedStops={selectedStops}
                setSelectedStops={setSelectedStops}
                selectedAirlines={selectedAirlines}
                setSelectedAirlines={setSelectedAirlines}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedDeparture={selectedDeparture}
                setSelectedDeparture={setSelectedDeparture}
                selectedArrival={selectedArrival}
                setSelectedArrival={setSelectedArrival}
                onReset={handleResetFilters}
              />
            </motion.div>
          )}

          {/* Right Column: Date selector + Flight lists */}
          <main className={showFilters ? "lg:col-span-9 space-y-4" : "lg:col-span-12 space-y-4"}>

            {/* Top Sort / Control row matching Image 2 */}
            <motion.div
              variants={itemVariants}
              className="w-full bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] px-[23.13px] flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-[57px] md:h-[64.773px]"
            >
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="border border-[#E0E0E0] hover:bg-gray-50 text-[#333333] font-['Quicksand'] font-semibold text-[13.5px] px-4 py-1.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs select-none"
              >
                <Eye size={14} className="text-[#333333]" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>

              <span className="font-['Quicksand'] text-[14px] font-medium text-[#666666]">
                {loading ? "Searching live flights..." : `${displayedFlights.length} flight${displayedFlights.length === 1 ? '' : 's'} found`}
              </span>

              <div className="flex items-center gap-2">
                <span className="font-['Quicksand'] text-[13px] text-[#999999] font-medium select-none">
                  Sort by:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { id: "cheapest", label: "Cheapest", icon: <Tag size={13} /> },
                    { id: "fastest", label: "Fastest", icon: <Zap size={13} /> },
                    { id: "best", label: "Best", icon: <Star size={13} /> }
                  ].map((sortOption) => {
                    const isActive = sortBy === sortOption.id;
                    return (
                      <button
                        key={sortOption.id}
                        onClick={() => setSortBy(sortOption.id)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-['Quicksand'] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isActive
                          ? "bg-[#F12B19] text-white shadow-xs"
                          : "bg-white border border-[#E0E0E0] hover:bg-gray-50 text-[#333333]"
                          }`}
                      >
                        {sortOption.icon}
                        <span>{sortOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>


            {/* Date Fare calendar selector */}
            <motion.div variants={itemVariants}>
              <FareCalendar
                currentDepartureDate={searchParams.get("departureDate") || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                origin={searchParams.get("origin") || "DEL"}
                destination={searchParams.get("destination") || "BOM"}
                cabinClass={searchParams.get("cabinClass") || "Economy"}
                onSelectDate={(newDate) => {
                  const currentParams = new URLSearchParams(searchParams);
                  currentParams.set("departureDate", newDate);
                  navigate(`/flights?${currentParams.toString()}`);
                }}
              />
            </motion.div>

            {/* Listing items */}
            <motion.div variants={containerVariants} className="space-y-4 pt-1">
              {loading ? (
                <FlightSkeleton />
              ) : errorMsg ? (
                <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3 font-satoshi">
                  <p className="text-red-500 font-bold text-base">{errorMsg}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/?tab=flights', { state: { scrollToSearch: true } })}
                      className="px-5 py-2 bg-[#F12B19] text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Search Again
                    </button>
                  </div>
                </div>
              ) : isDomesticReturn ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 pb-2 border-b">Outbound Flights</h3>
                    {displayedOutboundFlights.map((flight) => (
                      <motion.div variants={itemVariants} key={flight.id}>
                        <Card
                          flight={flight}
                          isSelectMode={true}
                          isSelected={selectedOutboundFlight?.id === flight.id}
                          onSelect={() => setSelectedOutboundFlight(flight)}
                        />
                      </motion.div>
                    ))}
                    {displayedOutboundFlights.length === 0 && (
                      <div className="py-8 text-center text-gray-500">No outbound flights found</div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800 pb-2 border-b">Return Flights</h3>
                    {displayedInboundFlights.map((flight) => (
                      <motion.div variants={itemVariants} key={flight.id}>
                        <Card
                          flight={flight}
                          isSelectMode={true}
                          isSelected={selectedInboundFlight?.id === flight.id}
                          onSelect={() => setSelectedInboundFlight(flight)}
                        />
                      </motion.div>
                    ))}
                    {displayedInboundFlights.length === 0 && (
                      <div className="py-8 text-center text-gray-500">No return flights found</div>
                    )}
                  </div>
                </div>
              ) : displayedFlights.length > 0 ? (
                displayedFlights.map((flight) => (
                  <motion.div variants={itemVariants} key={flight.id}>
                    <Card
                      flight={flight}
                      onSelect={() => {
                        setSelectedFlight(flight);
                        setIsModalOpen(true);
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3 font-satoshi">
                  <p className="text-gray-800 font-bold text-base">No flights are available for this route & date.</p>
                  <p className="text-gray-500 text-xs max-w-md">Please try modifying your origin/destination, selecting a different date, or clearing active filters.</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/?tab=flights', { state: { scrollToSearch: true } })}
                      className="px-5 py-2 bg-[#F12B19] text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Search Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Bottom pagination / show more CTA */}
            <motion.div variants={itemVariants} className="text-center pt-5">
              <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-extrabold px-7 py-3 rounded-xl text-xs transition-all shadow-xs inline-flex items-center space-x-2 active:scale-95 group">
                <span>Show More Flights</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </motion.div>

          </main>

        </motion.div>

        {/* Flight Fare Selection Modal Overlay */}
        {isModalOpen && selectedFlight && (
          <FareModal
            flight={selectedFlight}
            onClose={() => setIsModalOpen(false)}
            onContinue={(fare) => {
              setIsModalOpen(false);
              navigate("/flights/book", {
                state: {
                  flight: selectedFlight,
                  fare,
                  searchContext: {
                    adults: parseInt(searchParams.get("adults") || "1", 10),
                    children: parseInt(searchParams.get("children") || "0", 10),
                    cabinClass: searchParams.get("cabinClass") || "Economy",
                    tripType: searchParams.get("tripType") || "one-way",
                    departureDate: searchParams.get("departureDate") || "",
                    origin: searchParams.get("origin") || "DEL",
                    destination: searchParams.get("destination") || "BOM"
                  }
                }
              });
            }}
          />
        )}

      </div>

      {/* Sticky Footer for Domestic Return Selection */}
      {isDomesticReturn && selectedOutboundFlight && selectedInboundFlight && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 py-4 px-6">
          <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-gray-500 font-bold block mb-1">Outbound</span>
                <span className="font-bold text-[#1A1A1A]">{selectedOutboundFlight.price}</span>
              </div>
              <div className="text-gray-300 font-bold">+</div>
              <div>
                <span className="text-xs text-gray-500 font-bold block mb-1">Return</span>
                <span className="font-bold text-[#1A1A1A]">{selectedInboundFlight.price}</span>
              </div>
              <div className="text-gray-300 font-bold">=</div>
              <div>
                <span className="text-xs text-gray-800 font-bold block mb-1">Total Fare</span>
                <span className="font-bold text-2xl text-[#1A1A1A]">
                  ₹{(
                    (parseInt(String(selectedOutboundFlight.price).replace(/[^\d]/g, ""), 10) || 0) +
                    (parseInt(String(selectedInboundFlight.price).replace(/[^\d]/g, ""), 10) || 0)
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/flights/book", {
                  state: {
                    flights: [selectedOutboundFlight, selectedInboundFlight],
                    searchContext: {
                      adults: parseInt(searchParams.get("adults") || "1", 10),
                      children: parseInt(searchParams.get("children") || "0", 10),
                      cabinClass: searchParams.get("cabinClass") || "Economy",
                      tripType: searchParams.get("tripType") || "one-way",
                      departureDate: searchParams.get("departureDate") || "",
                      origin: searchParams.get("origin") || "DEL",
                      destination: searchParams.get("destination") || "BOM"
                    }
                  }
                });
              }}
              className="bg-[#F12B19] hover:bg-red-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-all active:scale-95 w-full md:w-auto"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* 5. Global Footer block - placed outside main container for full-width layout */}
      <Footer />
    </div>
  );
}


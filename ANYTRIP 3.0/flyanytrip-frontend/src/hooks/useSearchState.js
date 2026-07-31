/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Custom hook that manages all shared search state for the app.
 * This includes flight, tour, visa, activity, train, and PNR searches.
 * It also handles fetching airport data and running mock searches.
 */

import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { popularAirports, hotRoutes } from '../utils/airportsData';
import { 
  tourDestinations, 
  visaDestinations, 
  activityDestinations, 
  allActivities 
} from '../utils/mockData';

/**
 * Custom hook that holds all search-related state and actions.
 * Used by SearchContext to share this data across the entire app.
 *
 * @returns An object with all state values, setters, and handler functions
 */
export const useSearchState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // --- Flight search state ---
  const [activeTab, setActiveTab] = useState('flights');
  const [from, setFrom] = useState({ iata: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' });
  const [to, setTo] = useState({ iata: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' });
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [airports, setAirports] = useState(popularAirports);
  const [filteredAirports, setFilteredAirports] = useState(() => popularAirports.filter(a => hotRoutes.includes(a.iata)));
  const [showFromMenu, setShowFromMenu] = useState(false);
  const [showToMenu, setShowToMenu] = useState(false);
  const [departureDate, setDepartureDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() + 1)),
    new Date(new Date().setDate(new Date().getDate() + 4))
  ]);
  const [tripType, setTripType] = useState('one');
  const [multiCitySegments, setMultiCitySegments] = useState([
    { from: { iata: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' }, to: { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'India' }, departureDate: new Date(new Date().setDate(new Date().getDate() + 1)) },
    { from: { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'India' }, to: { iata: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', country: 'India' }, departureDate: new Date(new Date().setDate(new Date().getDate() + 4)) }
  ]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy');
  const [showTravelersMenu, setShowTravelersMenu] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 500000],
    airlines: [],
    depTime: [],
    arrTime: [],
    stops: [],
    duration: 100
  });

  // --- Other tab states (tours, visa, activity, train, pnr) ---
  const [tourDest, setTourDest] = useState('');
  const [showTourMenu, setShowTourMenu] = useState(false);
  const [visaCountry, setVisaCountry] = useState('Thailand');
  const [visaType, setVisaType] = useState('Digital Arrival Card');
  const [showVisaMenu, setShowVisaMenu] = useState(false);
  const [activityCity, setActivityCity] = useState('');
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [trainNumber, setTrainNumber] = useState('');
  const [pnrNumber, setPnrNumber] = useState('');

  // --- Calendar Fares state ---
  const [calendarFares, setCalendarFares] = useState([]);
  const [fetchingFares, setFetchingFares] = useState(false);

  // Holds any validation error message shown to the user
  const [searchError, setSearchError] = useState('');

  // UI state for modals/popups
  const [isFarePopupOpen, setIsFarePopupOpen] = useState(false);

  /**
   * Fetches the lowest fares for the month based on the current selection.
   */
  const fetchCalendarFares = async (date = departureDate) => {
    if (!from?.iata || !to?.iata) return;
    setFetchingFares(true);
    try {
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const response = await api.get('/api/flights/calendar-fare', {
        params: {
          origin: from.iata,
          destination: to.iata,
          departureDate: formattedDate,
          cabinClass: travelClass
        }
      });
      if (response.data.success) {
        setCalendarFares(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching calendar fares:", error);
    } finally {
      setFetchingFares(false);
    }
  };

  // Removed local mock fetchAirports

  const searchTimeoutRef = useRef(null);

  /**
   * Filters the airports list using the live API based on the user's typed query.
   * Debounced by 300ms to avoid spamming the API.
   * Ranks API results by exact match > startsWith > includes, and prioritizes hot routes.
   *
   * @param query - The text the user typed in the airport search box
   */
  const handleAirportSearch = (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const lowerQuery = query ? query.toLowerCase().trim() : '';

    if (!lowerQuery) {
      setFilteredAirports(popularAirports.filter(a => hotRoutes.includes(a.iata)));
      return;
    }

    // 1. INSTANT LOCAL FILTERING (Shows immediately as user types partial text)
    const localMatches = popularAirports.map(airport => {
      let score = 0;
      const code = airport.iata.toLowerCase();
      const city = airport.city.toLowerCase();
      const name = airport.name.toLowerCase();
      
      if (code === lowerQuery || city === lowerQuery) score += 100;
      else if (code.startsWith(lowerQuery) || city.startsWith(lowerQuery)) score += 50;
      else if (city.includes(lowerQuery) || name.includes(lowerQuery) || code.includes(lowerQuery)) score += 20;
      if (hotRoutes.includes(airport.iata)) score += 10;
      
      return { ...airport, score };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ score, ...rest }) => rest);

    setFilteredAirports(localMatches.slice(0, 10));

    // 2. DEBOUNCED LIVE API FETCH
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await api.get('/api/flights/locations', {
          params: { term: query }
        });
        
        if (response.data.success && response.data.data.airports) {
          const mappedAirports = response.data.data.airports.map(a => ({
            iata: a.code,
            name: a.name,
            city: a.CityName,
            country: a.CountryName
          }));

          // Merge local and API results, avoiding duplicates
          const combinedMap = new Map();
          localMatches.forEach(a => combinedMap.set(a.iata, a));
          mappedAirports.forEach(a => combinedMap.set(a.iata, a));

          // Re-rank combined results
          const rankedAirports = Array.from(combinedMap.values()).map(airport => {
            let score = 0;
            const code = airport.iata ? airport.iata.toLowerCase() : '';
            const city = airport.city ? airport.city.toLowerCase() : '';
            const name = airport.name ? airport.name.toLowerCase() : '';
            
            if (code === lowerQuery || city === lowerQuery) score += 100;
            else if (code.startsWith(lowerQuery) || city.startsWith(lowerQuery)) score += 50;
            else if (city.includes(lowerQuery) || name.includes(lowerQuery) || code.includes(lowerQuery)) score += 20;
            if (hotRoutes.includes(airport.iata)) score += 10;
            
            return { ...airport, score };
          })
          .filter(a => a.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

          setFilteredAirports(rankedAirports.map(({ score, ...rest }) => rest));
        }
      } catch (error) {
        console.error("Error fetching locations from API:", error);
      }
    }, 300);
  };

  /**
   * Sets the selected airport for either the "from" or "to" field
   * and closes the corresponding dropdown menu.
   *
   * @param type    - Either 'from' or 'to'
   * @param airport - The airport object the user clicked on
   */
  const selectAirport = (type, airport) => {
    if (type === 'from') { 
      setFrom(airport); 
      setShowFromMenu(false); 
    } else { 
      setTo(airport); 
      setShowToMenu(false); 
    }
  };

  /**
   * Swaps the "from" and "to" airports with each other.
   * Uses a temporary variable to avoid overwriting one before the other is saved.
   */
  const swapAirports = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  /**
   * Validates the search inputs for the currently active tab,
   * then simulates a search with mock data after a short delay.
   * Navigates to the results page when complete.
   */
  const handleSearch = async () => {
    setSearchError('');
    let isValid = true;

    // Validate required fields depending on which tab is active
    if (activeTab === 'flights') {
      if (tripType === 'multi') {
        if (!multiCitySegments || multiCitySegments.length < 2) isValid = false;
        multiCitySegments.forEach(seg => {
          if (!seg.from || !seg.to || !seg.departureDate) isValid = false;
        });
      } else {
        if (!from || !to) isValid = false;
        if (tripType === 'round' && (!dateRange[0] || !dateRange[1])) isValid = false;
        if (tripType === 'one' && !departureDate) isValid = false;
      }
    } else if (activeTab === 'tours') {
      if (!tourDest) isValid = false;
    } else if (activeTab === 'visa') {
      if (!visaCountry || !visaType) isValid = false;
    } else if (activeTab === 'activity') {
      if (!activityCity) isValid = false;
    } else if (activeTab === 'train') {
      if (!trainNumber || trainNumber.trim() === '') isValid = false;
    } else if (activeTab === 'pnr') {
      if (!pnrNumber || pnrNumber.trim() === '') isValid = false;
    }

    // Show an error and stop if any required field is missing
    if (!isValid) {
      setSearchError("Fill all the details first");
      return;
    }

    // Reset filters for any new search to avoid stale filter conflicts
    const initialFilters = {
      priceRange: [0, 500000],
      airlines: [],
      depTime: [],
      arrTime: [],
      stops: [],
      duration: 100
    };

    if (activeTab === 'flights') {
      setFilters(initialFilters);
      const searchData = {
        tripType,
        adults,
        children,
        infants,
        travelClass,
        filters: initialFilters
      };
      
      let redirectUrl = '';
      
      const toLocalISO = (d) => {
        if (!(d instanceof Date)) return d;
        const pad = n => n < 10 ? '0' + n : n;
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      };

      if (tripType === 'multi') {
        searchData.multiCitySegments = multiCitySegments.map(seg => ({
          ...seg,
          departureDate: toLocalISO(seg.departureDate)
        }));
        const encodedData = btoa(encodeURIComponent(JSON.stringify(searchData)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
        redirectUrl = `/flights/multi?data=${encodeURIComponent(encodedData)}`;
      } else {
        searchData.from = from;
        searchData.to = to;
        searchData.departureDate = toLocalISO(departureDate);
        if (tripType === 'round') {
          searchData.dateRange = dateRange.map(d => toLocalISO(d));
        }
        const encodedData = btoa(encodeURIComponent(JSON.stringify(searchData)).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
        redirectUrl = `/flights/${from.iata}-${to.iata}?data=${encodeURIComponent(encodedData)}`;
      }

      navigate(redirectUrl, { replace: true });
      return;
    }

    setSearching(true);
    setResults([]);
    navigate('/results'); // Instantly redirect so skeleton loads while fetching

    // Simulate a network delay of 1.2 seconds before showing mock results
    setTimeout(() => {
      let mockResults = [];
      if (activeTab === 'tours') {
        const dest = tourDest || 'Thailand';
        mockResults = [
          { id: 1, type: 'tour', name: `${dest} Quick Getaway`, duration: '3 Days / 2 Nights', price: '25,000', rating: 4.6, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop' },
          { id: 2, type: 'tour', name: `Classic ${dest} Experience`, duration: '5 Days / 4 Nights', price: '42,500', rating: 4.8, img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1000&auto=format&fit=crop' },
          { id: 3, type: 'tour', name: `Ultimate ${dest} Explorer`, duration: '8 Days / 7 Nights', price: '68,000', rating: 4.9, img: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop' }
        ];
      } else if (activeTab === 'visa') {
        mockResults = [{ id: 1, type: 'info', title: 'Visa Assistance Started', desc: `Our experts will contact you for ${visaCountry} ${visaType} Visa shortly.` }];
      } else if (activeTab === 'train') {
        mockResults = [{ id: 1, type: 'status', title: 'Train Status: On Time', desc: `Train ${trainNumber} is currently at Kanpur Central. Expected arrival: 04:30 PM.` }];
      } else if (activeTab === 'pnr') {
        mockResults = [{ id: 1, type: 'status', title: 'PNR Status: Confirmed', desc: `PNR ${pnrNumber} - Seat S4, 22. Passenger: Gaurav Thakur.` }];
      } else if (activeTab === 'activity') {
        // Filter real activity data by the chosen city
        mockResults = allActivities.filter(activity => activity.city === activityCity);
      }
      setResults(mockResults);
      setSearching(false);
      navigate('/results');
    }, 1200);
  };

  const lastFetchedQueryRef = useRef("");


  // Decode URL state and fetch flights if on flight search route
  useEffect(() => {
    // Only proceed if it's a specific flight route like /flights/DEL-LKO
    const isFlightSearchRoute = location.pathname.startsWith('/flights/') && location.pathname.length > 9;
    
    if (isFlightSearchRoute) {
      setActiveTab('flights');
      const dataParam = searchParams.get('data');
      
      if (dataParam) {
        try {
          const parsedData = JSON.parse(atob(dataParam));
          
          // Reconstruct state without triggering unnecessary re-renders
          if (parsedData.tripType) setTripType(parsedData.tripType);
          if (parsedData.adults !== undefined) setAdults(parsedData.adults);
          if (parsedData.children !== undefined) setChildren(parsedData.children);
          if (parsedData.infants !== undefined) setInfants(parsedData.infants);
          if (parsedData.travelClass) setTravelClass(parsedData.travelClass);
          if (parsedData.filters) setFilters(parsedData.filters);
          
          if (parsedData.tripType === 'multi' && parsedData.multiCitySegments) {
            setMultiCitySegments(parsedData.multiCitySegments.map(seg => ({
              ...seg,
              departureDate: new Date(seg.departureDate)
            })));
          } else {
            if (parsedData.from) setFrom(parsedData.from);
            if (parsedData.to) setTo(parsedData.to);
            if (parsedData.departureDate) setDepartureDate(new Date(parsedData.departureDate));
            if (parsedData.dateRange) setDateRange([new Date(parsedData.dateRange[0]), new Date(parsedData.dateRange[1])]);
          }
          
          // Create a "core" query string (excluding filters) to check if we need to re-fetch
          let coreQuery = '';
          if (parsedData.tripType === 'multi') {
            coreQuery = JSON.stringify({
              segments: parsedData.multiCitySegments.map(s => `${s.from.iata}-${s.to.iata}-${s.departureDate}`),
              pax: { a: parsedData.adults, c: parsedData.children, i: parsedData.infants },
              class: parsedData.travelClass,
              type: parsedData.tripType
            });
          } else {
            coreQuery = JSON.stringify({
              from: parsedData.from.iata,
              to: parsedData.to.iata,
              date: parsedData.tripType === 'one' ? parsedData.departureDate : parsedData.dateRange[0],
              ret: parsedData.tripType === 'round' ? parsedData.dateRange[1] : '',
              pax: { a: parsedData.adults, c: parsedData.children, i: parsedData.infants },
              class: parsedData.travelClass,
              type: parsedData.tripType
            });
          }

          // Skip fetching if the core query hasn't changed (e.g. only filters changed)
          if (coreQuery === lastFetchedQueryRef.current && results.length > 0) {
            console.log("Skipping API fetch - only filters changed.");
            return;
          }

          lastFetchedQueryRef.current = coreQuery;
          
          // Call API based on the parsed data
          const fetchFlights = async () => {
            setSearching(true);
            setResults([]);
            setSearchError('');
            
            try {
              let response;
              if (parsedData.tripType === 'multi') {
                response = await api.post('/api/flights/search/multicity', {
                  segments: parsedData.multiCitySegments.map(seg => ({
                    from: seg.from.iata,
                    to: seg.to.iata,
                    departureDate: seg.departureDate,
                    travelClass: parsedData.travelClass
                  })),
                  adults: parsedData.adults,
                  children: parsedData.children,
                  infants: parsedData.infants,
                  cabinClass: parsedData.travelClass
                });
              } else {
                response = await api.get('/api/flights/search', {
                  params: {
                    origin: parsedData.from.iata,
                    destination: parsedData.to.iata,
                    departureDate: parsedData.tripType === 'one' ? parsedData.departureDate : parsedData.dateRange[0],
                    returnDate: parsedData.tripType === 'round' ? parsedData.dateRange[1] : '',
                    adults: parsedData.adults,
                    children: parsedData.children,
                    infants: parsedData.infants,
                    cabinClass: parsedData.travelClass,
                    tripType: parsedData.tripType
                  }
                });
              }
              
              if (response.data.success && response.data.data && response.data.data.flights) {
                setResults(response.data.data.flights);
              } else {
                setSearchError('No flights found or error fetching data.');
              }
            } catch (error) {
              setSearchError(error.response?.data?.message || 'Error communicating with the flight API');
              console.error("Flight Search Error:", error);
            }
            setSearching(false);
            
            // Also fetch calendar fares in background if one way or round trip
            if (parsedData.tripType !== 'multi' && parsedData.from && parsedData.to) {
                fetchCalendarFares(parsedData.tripType === 'one' ? parsedData.departureDate : parsedData.dateRange[0]);
            }
          };
          
          fetchFlights();
        } catch (error) {
          console.error("Error parsing URL params:", error);
          setSearchError('Invalid search parameters in URL.');
        }
      }
    }
  }, [location.pathname, searchParams]);

  // Return all state values and handler functions for use throughout the app
  return {
    activeTab, setActiveTab,
    from, setFrom,
    to, setTo,
    searching,
    results,
    airports,
    filteredAirports,
    showFromMenu, setShowFromMenu,
    showToMenu, setShowToMenu,
    departureDate, setDepartureDate,
    dateRange, setDateRange,
    tripType, setTripType,
    multiCitySegments, setMultiCitySegments,
    adults, setAdults,
    children, setChildren,
    infants, setInfants,
    travelClass, setTravelClass,
    showTravelersMenu, setShowTravelersMenu,
    tourDest, setTourDest,
    showTourMenu, setShowTourMenu,
    tourDestinations,
    visaCountry, setVisaCountry,
    visaType, setVisaType,
    showVisaMenu, setShowVisaMenu,
    visaDestinations,
    activityCity, setActivityCity,
    showActivityMenu, setShowActivityMenu,
    activityDestinations,
    trainNumber, setTrainNumber,
    pnrNumber, setPnrNumber,
    calendarFares, fetchingFares, fetchCalendarFares,
    searchError, setSearchError,
    filters, setFilters,
    isFarePopupOpen, setIsFarePopupOpen,
    handleAirportSearch, selectAirport, swapAirports, handleSearch,
    navigate
  };
};

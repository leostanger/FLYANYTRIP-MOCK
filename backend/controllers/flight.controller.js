const adivahaService = require('../integrations/adivaha/adivaha.service');
const { apiCache, generateCacheKey } = require('../utils/cache');

const airlinesList = [
  { name: 'IndiGo', code: '6E' },
  { name: 'Air India', code: 'AI' },
  { name: 'Vistara', code: 'UK' },
  { name: 'SpiceJet', code: 'SG' },
  { name: 'Akasa Air', code: 'QP' },
  { name: 'Emirates', code: 'EK' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Etihad Airways', code: 'EY' }
];

const generateMockFlights = (origin, destination, departureDate, cabinClass = 'Economy') => {
  const flights = [];
  const startHours = [6, 9, 12, 15, 18, 21];
  
  // Decide flight duration (e.g., 2h 15m for DEL-BOM, or random between 1h30m and 8h)
  const durationMins = (origin.toUpperCase() === 'DEL' && destination.toUpperCase() === 'BOM') ? 135 
                     : (origin.toUpperCase() === 'BOM' && destination.toUpperCase() === 'DXB') ? 240
                     : Math.floor(Math.random() * 300) + 90; // 1.5h to 6.5h
                     
  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const getArrivalTime = (depHour, depMin, durMins) => {
    let arrHour = (depHour + Math.floor((depMin + durMins) / 60)) % 24;
    let arrMin = (depMin + durMins) % 60;
    return `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
  };

  const cabinClassMultiplier = cabinClass === 'Business' ? 2.8 
                            : cabinClass === 'First Class' ? 5 
                            : cabinClass === 'Premium Economy' ? 1.5 
                            : 1.0;

  const basePrice = Math.floor((durationMins * 15) * cabinClassMultiplier + 2000);

  startHours.forEach((hour, idx) => {
    const airline = airlinesList[idx % airlinesList.length];
    const stops = idx === 1 || idx === 4 ? 1 : 0; // index 1 and 4 have 1 stop, rest non-stop
    const priceValue = Math.ceil(basePrice + (idx * 450) + (stops * 1200));
    
    const depTimeStr = `${String(hour).padStart(2, '0')}:15`;
    const arrTimeStr = getArrivalTime(hour, 15, durationMins);
    
    flights.push({
      id: `mock_${airline.code}_${idx}_${departureDate}`,
      traceId: `mock_trace_${departureDate}`,
      tokenId: `mock_token_${departureDate}`,
      resultIndex: `mock_${airline.code}_${idx}`,
      type: 'flight',
      airline: airline.name,
      airlineCode: airline.code,
      flight: `${airline.code}-${100 + idx + Math.floor(Math.random() * 800)}`,
      from: origin.toUpperCase(),
      to: destination.toUpperCase(),
      time: depTimeStr,
      arrival: arrTimeStr,
      dur: formatDuration(durationMins),
      stops: stops,
      layover: stops === 1 ? `1 Stop at BLR (1h 10m)` : '',
      baggage: '15 Kgs (1 piece only)',
      cabinBaggage: '7 Kgs (1 piece only)',
      isRefundable: idx !== 3, // index 3 is non-refundable
      seatsLeft: Math.floor(Math.random() * 8) + 1,
      price: priceValue.toLocaleString('en-IN'),
      publishedPrice: priceValue.toLocaleString('en-IN'),
      class: cabinClass,
      raw: {
        ResultIndex: `mock_${airline.code}_${idx}`,
        IsRefundable: idx !== 3,
        Fare: {
          OfferedFare: priceValue,
          PublishedFare: priceValue,
          Currency: 'INR'
        },
        Segments: [
          [
            {
              Airline: { AirlineName: airline.name, AirlineCode: airline.code, FlightNumber: `${100 + idx}` },
              Origin: { Airport: { AirportCode: origin.toUpperCase() }, DepTime: `${departureDate}T${depTimeStr}:00` },
              Destination: { Airport: { AirportCode: destination.toUpperCase() }, ArrTime: `${departureDate}T${arrTimeStr}:00` },
              Duration: durationMins,
              Baggage: '15 Kgs (1 piece only)',
              CabinBaggage: '7 Kgs (1 piece only)',
              NoOfSeatAvailable: 9,
              FareClassification: { Type: cabinClass }
            }
          ]
        ]
      }
    });
  });

  return flights;
};

const generateMultiCityMockFlights = (segments, cabinClass = 'Economy') => {
  if (!segments || segments.length === 0) return [];
  const flights = [];
  const startHours = [6, 12, 18];
  
  const cabinClassMultiplier = cabinClass === 'Business' ? 2.8 
                            : cabinClass === 'First Class' ? 5 
                            : cabinClass === 'Premium Economy' ? 1.5 
                            : 1.0;

  startHours.forEach((hour, idx) => {
    const airline = airlinesList[idx % airlinesList.length];
    
    let totalDurationMins = 0;
    const mappedSegments = segments.map((seg, segIdx) => {
      const durationMins = 120 + (segIdx * 30);
      totalDurationMins += durationMins;
      const depTimeStr = `${String(hour + segIdx * 3).padStart(2, '0')}:15`;
      const depDate = seg.departureDate || new Date().toISOString().split('T')[0];
      const arrHour = (hour + segIdx * 3 + Math.floor((15 + durationMins) / 60)) % 24;
      const arrMin = (15 + durationMins) % 60;
      const arrTimeStr = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
      
      return [
        {
          Airline: { AirlineName: airline.name, AirlineCode: airline.code, FlightNumber: `${100 + idx + segIdx}` },
          Origin: { Airport: { AirportCode: seg.from?.toUpperCase() || 'DEL' }, DepTime: `${depDate}T${depTimeStr}:00` },
          Destination: { Airport: { AirportCode: seg.to?.toUpperCase() || 'BOM' }, ArrTime: `${depDate}T${arrTimeStr}:00` },
          Duration: durationMins,
          Baggage: '15 Kgs (1 piece only)',
          CabinBaggage: '7 Kgs (1 piece only)',
          NoOfSeatAvailable: 9,
          FareClassification: { Type: cabinClass }
        }
      ];
    });

    const priceValue = Math.ceil(4000 * segments.length * cabinClassMultiplier + (idx * 600));

    const firstSeg = mappedSegments[0][0];
    const lastSeg = mappedSegments[mappedSegments.length - 1][0];

    const formatDuration = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m`;
    };

    flights.push({
      id: `mock_multi_${airline.code}_${idx}`,
      traceId: `mock_trace_multi`,
      tokenId: `mock_token_multi`,
      resultIndex: `mock_multi_${airline.code}_${idx}`,
      type: 'flight',
      airline: airline.name,
      airlineCode: airline.code,
      flight: `${airline.code}-${100 + idx}`,
      from: segments[0].from?.toUpperCase() || 'DEL',
      to: segments[segments.length - 1].to?.toUpperCase() || 'BOM',
      time: firstSeg.Origin.DepTime.split('T')[1].substring(0, 5),
      arrival: lastSeg.Destination.ArrTime.split('T')[1].substring(0, 5),
      dur: formatDuration(totalDurationMins),
      stops: segments.length - 1,
      layover: `Multi-City (${segments.length} Legs)`,
      baggage: '15 Kgs (1 piece only)',
      cabinBaggage: '7 Kgs (1 piece only)',
      isRefundable: true,
      seatsLeft: 9,
      price: priceValue.toLocaleString('en-IN'),
      publishedPrice: priceValue.toLocaleString('en-IN'),
      class: cabinClass,
      raw: {
        ResultIndex: `mock_multi_${airline.code}_${idx}`,
        IsRefundable: true,
        Fare: {
          OfferedFare: priceValue,
          PublishedFare: priceValue,
          Currency: 'INR'
        },
        Segments: mappedSegments
      }
    });
  });

  return flights;
};

const searchFlights = async (req, res, next) => {
  try {
    const searchParams = { ...req.query, ...req.body }; // Support both query params and body payload
    
    // Basic validation
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: origin, destination, or departureDate',
      });
    }

    // Generate a unique cache key based on search parameters
    const cacheKey = generateCacheKey('flight_search', searchParams);

    // Check if the result exists in the cache
    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: { flights: cachedResult },
      });
    }

    // Call the real Adivaha API via our integration service
    let searchResults;
    try {
      searchResults = await adivahaService.searchFlights(searchParams);
    } catch (apiError) {
      console.error('Adivaha API failed:', apiError.message);
      return res.status(500).json({ success: false, message: 'some error has occured' });
    }

    if (!searchResults || !searchResults.flights || searchResults.flights.length === 0) {
      return res.status(200).json({
        success: true,
        source: 'api',
        data: { flights: [] }
      });
    }

    // Cache the result for subsequent similar searches
    apiCache.set(cacheKey, searchResults.flights);

    return res.status(200).json({
      success: true,
      source: 'api',
      data: { flights: searchResults.flights },
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

const searchMultiCityFlights = async (req, res, next) => {
  try {
    const searchParams = req.body; 
    
    if (!searchParams.segments || searchParams.segments.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Missing or insufficient segments for multi-city search',
      });
    }

    const cacheKey = generateCacheKey('flight_search_multicity', searchParams);

    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: { flights: cachedResult },
      });
    }

    let searchResults;
    try {
      searchResults = await adivahaService.multicityFlightSearch(searchParams);
    } catch (apiError) {
      console.error('Adivaha Multi-City API failed:', apiError.message);
      return res.status(500).json({ success: false, message: 'some error has occured' });
    }

    if (!searchResults || !searchResults.flights || searchResults.flights.length === 0) {
      return res.status(200).json({
        success: true,
        source: 'api',
        data: { flights: [] }
      });
    }

    apiCache.set(cacheKey, searchResults.flights);

    return res.status(200).json({
      success: true,
      source: 'api',
      data: { flights: searchResults.flights },
    });
  } catch (error) {
    next(error);
  }
};


const searchLocations = async (req, res, next) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ success: false, message: 'Term is required' });
    }
    
    // Check cache
    const cacheKey = generateCacheKey('locations', { term });
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', data: cached });
    }

    let locations;
    try {
      locations = await adivahaService.searchLocations(term, 10);
    } catch (apiError) {
      console.error('Adivaha Search Locations failed:', apiError.message);
      return res.status(500).json({ success: false, message: 'some error has occured' });
    }

    if (!locations || locations.ErrorCode || (locations.airports && locations.airports.length === 0)) {
      locations = { airports: [] };
    }

    apiCache.set(cacheKey, locations);

    return res.status(200).json({ success: true, source: 'api', data: locations });
  } catch (error) {
    next(error);
  }
};

const getCalendarFare = async (req, res, next) => {
  try {
    const { origin, destination, departureDate, cabinClass } = req.query;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: origin, destination, or departureDate',
      });
    }

    const cacheKey = generateCacheKey('calendar_fare', { origin, destination, departureDate, cabinClass });
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', data: cached });
    }

    let result;
    try {
      result = await adivahaService.getCalendarFare({ origin, destination, departureDate, cabinClass });
    } catch (apiError) {
      console.error('Adivaha Calendar Fare API failed/timed out:', apiError.message);
      return res.status(500).json({ success: false, message: 'some error has occured' });
    }
    
    // Check if response contains valid results - handle multiple possible response structures
    let fares = result?.responseData?.Response?.SearchResults ||
                result?.Response?.SearchResults ||
                result?.SearchResults ||
                [];

    // If still empty, try to find any array in the response
    if (!fares || fares.length === 0) {
      const respData = result?.responseData || result;
      // Try to find SearchResults nested anywhere
      if (respData && typeof respData === 'object') {
        const findSearchResults = (obj, depth = 0) => {
          if (depth > 4) return null;
          if (obj?.SearchResults && Array.isArray(obj.SearchResults)) return obj.SearchResults;
          for (const key of Object.keys(obj)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              const found = findSearchResults(obj[key], depth + 1);
              if (found) return found;
            }
          }
          return null;
        };
        fares = findSearchResults(respData) || [];
      }
    }
    if (!fares || fares.length === 0) {
      console.log('No calendar fares returned from Adivaha.');
      fares = [];
    }
    apiCache.set(cacheKey, fares);

    return res.status(200).json({
      success: true,
      source: 'api',
      data: fares
    });
  } catch (error) {
    next(error);
  }
};

const updateCalendarFareOfDay = async (req, res, next) => {
  try {
    const { origin, destination, departureDate, cabinClass } = req.query;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: origin, destination, or departureDate',
      });
    }

    const cacheKey = generateCacheKey('calendar_fare_day', { origin, destination, departureDate, cabinClass });
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', data: cached });
    }

    let result;
    try {
      result = await adivahaService.updateCalendarFareOfDay({ origin, destination, departureDate, cabinClass });
    } catch (apiError) {
      console.error('Adivaha updateCalendarFareOfDay failed:', apiError.message);
      return res.status(500).json({ success: false, message: 'some error has occured' });
    }
    
    // Try multiple response paths for DayFare
    let dayFare = result?.responseData?.Response?.DayFare ||
                  result?.Response?.DayFare ||
                  result?.DayFare ||
                  null;

    const data = { dayFare, raw: result };
    apiCache.set(cacheKey, data);

    return res.status(200).json({
      success: true,
      source: 'api',
      data
    });
  } catch (error) {
    next(error);
  }
};

const getFareRule = async (req, res, next) => {
  try {
    const { traceId, resultIndex } = req.body;
    if (!traceId || !resultIndex) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: traceId or resultIndex',
      });
    }

    const endUserIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const cacheKey = generateCacheKey('fare_rule', { traceId, resultIndex });
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', data: cached });
    }

    const rules = await adivahaService.getFareRule({ 
      TraceId: traceId, 
      ResultIndex: resultIndex,
      EndUserIp: endUserIp
    });
    apiCache.set(cacheKey, rules);

    return res.status(200).json({ success: true, source: 'api', data: rules });
  } catch (error) {
    next(error);
  }
};

const getFareQuote = async (req, res, next) => {
  try {
    const { traceId, resultIndex } = req.body;
    if (!traceId || !resultIndex) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: traceId or resultIndex',
      });
    }

    const endUserIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const cacheKey = generateCacheKey('fare_quote', { traceId, resultIndex });
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', data: cached });
    }

    const quote = await adivahaService.getFlightFareQuote({ 
      TraceId: traceId, 
      ResultIndex: resultIndex,
      EndUserIp: endUserIp
    });
    apiCache.set(cacheKey, quote);

    return res.status(200).json({ success: true, source: 'api', data: quote });
  } catch (error) {
    next(error);
  }
};

const getFlightSSR = async (req, res, next) => {
  try {
    const { traceId, resultIndex } = req.body;
    if (!traceId || !resultIndex) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: traceId or resultIndex',
      });
    }

    const endUserIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const cacheKey = generateCacheKey('flight_ssr', { traceId, resultIndex });
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, source: 'cache', data: cached });
    }

    // 1. Pre-revalidate session TraceId with Adivaha API so SSR seat map is unlocked
    try {
      await adivahaService.getFlightFareQuote({
        TraceId: traceId,
        ResultIndex: resultIndex,
        EndUserIp: endUserIp
      });
    } catch (revalErr) {
      console.warn('Adivaha pre-SSR revalidate warning:', revalErr.message);
    }

    // 2. Fetch live Adivaha API SSR (SeatDynamic, Baggage, MealDynamic)
    const ssr = await adivahaService.getFlightSSR({ 
      TraceId: traceId, 
      ResultIndex: resultIndex,
      EndUserIp: endUserIp
    });
    apiCache.set(cacheKey, ssr);

    return res.status(200).json({ success: true, source: 'api', data: ssr });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchFlights,
  searchMultiCityFlights,
  searchLocations,
  getCalendarFare,
  updateCalendarFareOfDay,
  getFareRule,
  getFareQuote,
  getFlightSSR,
};

const adivahaService = require('../integrations/adivaha/adivaha.service');
const { apiCache, generateCacheKey } = require('../utils/cache');



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

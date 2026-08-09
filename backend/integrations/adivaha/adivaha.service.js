const axios = require('axios');

/**
 * Adivaha API Integration Service
 * Base configuration and methods for interacting with Adivaha Flights API.
 */

const ADIVAHA_BASE_URL = 'https://api.adivaha.io/flights/api';
const PID = process.env.ADIVAHA_PID;
const API_KEY = process.env.ADIVAHA_API_KEY;

/**
 * Sanitize and return a valid public IP for GDS/Adivaha compliance.
 * Rejects loopback/localhost addresses and falls back to a configured default.
 */
const getValidPublicIp = (ipStr) => {
  if (!ipStr) return process.env.DEFAULT_CUSTOMER_IP || '103.24.56.78';
  const clean = String(ipStr).split(',')[0].trim();
  if (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === '::ffff:127.0.0.1' ||
    clean === 'localhost' ||
    !clean
  ) {
    return process.env.DEFAULT_CUSTOMER_IP || '103.24.56.78';
  }
  return clean;
};

const adivahaClient = axios.create({
  baseURL: ADIVAHA_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip'
  }
});

// Dynamically inject latest PID and API_KEY from process.env on every request
adivahaClient.interceptors.request.use((config) => {
  config.headers['PID'] = process.env.ADIVAHA_PID;
  config.headers['x-api-key'] = process.env.ADIVAHA_API_KEY;
  return config;
});

// Interceptor to handle Adivaha internal Token Management
adivahaClient.interceptors.response.use(
  async (response) => {
    const errorObj = response.data?.responseData?.Response?.Error ||
      response.data?.Response?.Error ||
      response.data?.Error;

    const errCode = errorObj?.ErrorCode;
    const errMsg = String(errorObj?.ErrorMessage || response.data?.status_message || '').toLowerCase();
    const isAuthError = (errCode === 6 || errCode === 401 || errMsg.includes('authentication failed') || errMsg.includes('invalid token'));

    // ErrorCode 6 means 'Invalid Token' or Auth Failed
    if (errorObj && isAuthError) {
      const originalRequest = response.config;

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log(`Adivaha Token/Auth issue detected (${errCode || errMsg}). Generating fresh token...`);
          // Call createToken to refresh the internal token state at Adivaha
          await axios.get(`${ADIVAHA_BASE_URL}/?action=createToken`, {
            params: {
              action: 'createToken',
              PID: process.env.ADIVAHA_PID,
              auth: process.env.ADIVAHA_API_KEY,
              AuthKey: process.env.ADIVAHA_API_KEY
            },
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip',
              'PID': process.env.ADIVAHA_PID,
              'x-api-key': process.env.ADIVAHA_API_KEY
            }
          });

          console.log('Token refreshed successfully. Retrying original request...');
          if (typeof originalRequest.data === 'string') {
            try {
              originalRequest.data = JSON.parse(originalRequest.data);
            } catch (e) {}
          }
          // Retry the original request
          return adivahaClient(originalRequest);
        } catch (refreshError) {
          console.error('Failed to refresh Adivaha token:', refreshError.message);
          return Promise.reject(refreshError);
        }
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AdivahaFlightService {
  static formatDate(dateStr) {
    if (!dateStr) return '';
    const str = String(dateStr).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const cleanStr = str.split('T')[0].split(' ')[0];
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Search for flight locations (Airports/Cities)
   * GET https://api.adivaha.io/flights/api/?action=flightLocations&term={term}&limit={limit}
   * @param {string} term - The search query (e.g., 'del' for Delhi)
   * @param {number} limit - Number of results to return
   */
  static async searchLocations(term, limit = 5) {
    try {
      const response = await adivahaClient.get('/', {
        params: {
          action: 'flightLocations',
          term,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Adivaha searchLocations Error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async searchFlights(searchPayload) {
    try {
      const origin = searchPayload.origin || searchPayload.from || searchPayload.From_IATACODE;
      const destination = searchPayload.destination || searchPayload.to || searchPayload.To_IATACODE;
      const departureDate = searchPayload.departureDate || searchPayload.departDate || searchPayload.departure_date || searchPayload.date;
      const returnDate = searchPayload.returnDate || searchPayload.return_date;
      const adults = searchPayload.adults || "1";
      const children = searchPayload.children || "0";
      const infants = searchPayload.infants || "0";
      const tripType = searchPayload.tripType || "oneway";

      const formatDate = (dateStr) => this.formatDate(dateStr);

      const categoryMap = {
        'Economy': 'Economy',
        'Premium Economy': 'PremiumEconomy',
        'Business': 'Business',
        'First Class': 'First'
      };

      const cleanIata = (str) => {
        if (!str) return "";
        const match = String(str).match(/[A-Z]{3}/i);
        return match ? match[0].toUpperCase() : String(str).trim().substring(0, 3).toUpperCase();
      };

      const isOneWay = !returnDate || (tripType === 'oneway' || tripType === 'one' || tripType === 'one-way' || tripType === 'one_way');

      const payload = {
        action: "flightSearch",
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        isoneway: isOneWay ? "Yes" : "No",
        From_IATACODE: cleanIata(origin),
        To_IATACODE: cleanIata(destination),
        departure_date: formatDate(departureDate),
        return_date: (tripType === 'round' || tripType === 'round-trip' || tripType === 'roundtrip') && returnDate ? formatDate(returnDate) : "",
        Flights_category: categoryMap[searchPayload.cabinClass] || "Economy"
      };

      const response = await adivahaClient.post('/', payload);

      // We normalize the adivaha flights data format to the one expected by our frontend ResultsSection
      // The frontend expects: { id, type: 'flight', airline, flight, from, to, time, arrival, dur, price, class }

      let resultsArray = response.data?.responseData?.Response?.Results ||
        response.data?.Response?.Results ||
        response.data?.Results;

      const traceId = response.data?.responseData?.Response?.TraceId ||
        response.data?.Response?.TraceId ||
        response.data?.TraceId;

      const tokenId = response.data?.responseData?.Response?.TokenId ||
        response.data?.Response?.TokenId ||
        response.data?.TokenId;

      if (resultsArray && resultsArray.length > 0) {
        let outboundRaw = [];
        let inboundRaw = [];
        let isDomesticReturn = false;

        if (Array.isArray(resultsArray[0]) && Array.isArray(resultsArray[1])) {
          isDomesticReturn = true;
          outboundRaw = resultsArray[0];
          inboundRaw = resultsArray[1];
        } else if (Array.isArray(resultsArray[0])) {
          outboundRaw = resultsArray[0];
        } else if (resultsArray[0] && typeof resultsArray[0] === 'object' && !resultsArray[0].ResultIndex && !resultsArray[0].Segments) {
          outboundRaw = Object.values(resultsArray[0]);
        } else {
          outboundRaw = resultsArray;
        }

        const mapFlights = (rawArray, prefix) => {
          return rawArray.map((f, index) => {
            const firstSegment = f.Segments?.[0]?.[0];
            const lastSegment = f.Segments?.[0]?.[f.Segments[0].length - 1];
            if (!firstSegment) return null;
            const formatTime = (dateStr) => {
              if (!dateStr) return '';
              const d = new Date(dateStr);
              if (isNaN(d.getTime())) return '';
              return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            };
            const formatDuration = (mins) => {
              if (!mins || isNaN(mins)) return '0m';
              const h = Math.floor(mins / 60);
              const m = Math.floor(mins % 60);
              if (h > 0 && m > 0) return `${h}h ${m}m`;
              if (h > 0) return `${h}h`;
              return `${m}m`;
            };
            const segments = f.Segments?.[0] || [];
            const numStops = segments.length > 0 ? segments.length - 1 : 0;
            let totalDurationMins = 0;
            let layoverStr = "";
            if (segments.length === 1) {
              totalDurationMins = segments[0].AccumulatedDuration || segments[0].Duration || 0;
            } else if (segments.length > 1) {
              let calculatedTotal = 0;
              let layoverDetails = [];
              for (let i = 0; i < segments.length; i++) {
                calculatedTotal += (segments[i].Duration || 0);
                if (i < segments.length - 1) {
                  const currentSeg = segments[i];
                  const nextSeg = segments[i + 1];
                  const arrTime = new Date(currentSeg.Destination.ArrTime);
                  const depTime = new Date(nextSeg.Origin.DepTime);
                  let layoverMins = 0;
                  if (!isNaN(arrTime.getTime()) && !isNaN(depTime.getTime())) {
                    layoverMins = Math.floor((depTime - arrTime) / (1000 * 60));
                    if (layoverMins < 0) layoverMins = 0;
                  }
                  calculatedTotal += layoverMins;
                  const layoverCity = currentSeg.Destination.Airport?.CityName || currentSeg.Destination.Airport?.AirportCode || 'Unknown';
                  if (layoverMins > 0) {
                    layoverDetails.push(`${layoverCity} (${formatDuration(layoverMins)})`);
                  } else {
                    layoverDetails.push(`${layoverCity}`);
                  }
                }
              }
              totalDurationMins = lastSegment?.AccumulatedDuration || calculatedTotal;
              if (numStops === 1) {
                layoverStr = `1 Stop at ${layoverDetails[0]}`;
              } else {
                layoverStr = `${numStops} Stops at ${layoverDetails.join(', ')}`;
              }
            }
  
            return {
              id: f.ResultIndex || `adivaha_${prefix}_${index}`,
              traceId: traceId,
              tokenId: tokenId,
              resultIndex: f.ResultIndex,
              type: 'flight',
              airline: firstSegment.Airline?.AirlineName || 'Airlines',
              airlineCode: firstSegment.Airline?.AirlineCode,
              flight: `${firstSegment.Airline?.AirlineCode}-${firstSegment.Airline?.FlightNumber}`,
              from: firstSegment.Origin?.Airport?.AirportCode || origin,
              to: lastSegment?.Destination?.Airport?.AirportCode || destination,
              time: formatTime(firstSegment.Origin?.DepTime),
              arrival: formatTime(lastSegment?.Destination?.ArrTime),
              dur: formatDuration(totalDurationMins),
              stops: numStops,
              layover: layoverStr,
              baggage: firstSegment.Baggage || f.Baggage || "15 Kgs (1 piece only)",
              cabinBaggage: firstSegment.CabinBaggage || f.CabinBaggage || "7 Kgs (1 piece only)",
              isRefundable: f.IsRefundable !== undefined ? Boolean(f.IsRefundable) : (f.Fare?.IsRefundable !== undefined ? Boolean(f.Fare?.IsRefundable) : true),
              seatsLeft: firstSegment.NoOfSeatAvailable || f.NoOfSeatAvailable || 5,
              price: Math.ceil(f.Fare?.OfferedFare || f.Fare?.PublishedFare || 0).toLocaleString('en-IN'),
              publishedPrice: Math.ceil(f.Fare?.PublishedFare || 0).toLocaleString('en-IN'),
              class: firstSegment.FareClassification?.Type || searchPayload.cabinClass || 'Economy',
              isLCC: f.IsLCC !== undefined ? Boolean(f.IsLCC) : false,
              raw: f // keep original for debug
            };
          }).filter(Boolean);
        };

        if (isDomesticReturn) {
          const outboundFlights = mapFlights(outboundRaw, 'out');
          const inboundFlights = mapFlights(inboundRaw, 'in');
          return { flights: outboundFlights, outboundFlights, inboundFlights, isDomesticReturn: true, rawAdivahaResponse: response.data };
        } else {
          const mappedFlights = mapFlights(outboundRaw, 'one');
          return { flights: mappedFlights, rawAdivahaResponse: response.data };
        }
      }

      return { flights: [], rawAdivahaResponse: response.data };
    } catch (error) {
      console.error('Adivaha searchFlights Error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async multicityFlightSearch(searchPayload) {
    try {
      const {
        adults = 1,
        children = 0,
        infants = 0,
        segments = []
      } = searchPayload;

      const formatDate = (dateStr) => this.formatDate(dateStr);

      const categoryMap = {
        'Economy': 2,
        'Premium Economy': 3,
        'Business': 4,
        'First Class': 6
      };

      const cleanIata = (str) => {
        if (!str) return "";
        const match = String(str).match(/[A-Z]{3}/i);
        return match ? match[0].toUpperCase() : String(str).trim().substring(0, 3).toUpperCase();
      };

      const mappedSegments = segments.map(seg => ({
        Origin: cleanIata(seg.from || seg.origin),
        Destination: cleanIata(seg.to || seg.destination),
        FlightCabinClass: categoryMap[seg.travelClass || 'Economy'] || 2,
        PreferredDepartureTime: formatDate(seg.departureDate),
        PreferredArrivalTime: formatDate(seg.departureDate)
      }));

      const payload = {
        action: "multicityflightSearch",
        adults: Number(adults),
        children: Number(children),
        infants: Number(infants),
        Segments: mappedSegments
      };

      const response = await adivahaClient.post('/?action=multicityflightSearch', payload);

      const errorObj = response.data?.responseData?.Response?.Error || response.data?.Response?.Error;
      if (errorObj && errorObj.ErrorMessage) {
        throw new Error(`Adivaha API Error: ${errorObj.ErrorMessage}`);
      }

      let resultsArray = response.data?.responseData?.Response?.Results ||
        response.data?.Response?.Results ||
        response.data?.Results;

      const traceId = response.data?.responseData?.Response?.TraceId ||
        response.data?.Response?.TraceId ||
        response.data?.TraceId;

      const tokenId = response.data?.responseData?.Response?.TokenId ||
        response.data?.Response?.TokenId ||
        response.data?.TokenId;

      if (resultsArray && resultsArray.length > 0) {
        if (Array.isArray(resultsArray[0])) {
          resultsArray = resultsArray[0];
        } else if (resultsArray[0] && typeof resultsArray[0] === 'object' && !resultsArray[0].ResultIndex && !resultsArray[0].Segments) {
          resultsArray = Object.values(resultsArray[0]);
        }

        const mappedFlights = resultsArray.map((f, index) => {
          let segmentsArray = f.Segments;
          if (!segmentsArray || segmentsArray.length === 0) return null;

          // Normalize to 1D array for easy access to first and last segment
          let allSegments = [];
          let is2D = Array.isArray(segmentsArray[0]);
          if (is2D) {
            segmentsArray.forEach(leg => allSegments.push(...leg));
          } else {
            allSegments = segmentsArray;
          }

          if (allSegments.length === 0) return null;

          const firstSeg = allSegments[0];
          const lastSeg = allSegments[allSegments.length - 1];

          const formatTime = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          };

          const formatDuration = (mins) => {
            if (!mins || isNaN(mins)) return '0m';
            const h = Math.floor(mins / 60);
            const m = Math.floor(mins % 60);
            if (h > 0 && m > 0) return `${h}h ${m}m`;
            if (h > 0) return `${h}h`;
            return `${m}m`;
          };

          let totalDurationMins = 0;
          let numStops = 0;
          let numLegs = 0;

          if (is2D) {
            numLegs = segmentsArray.length;
            segmentsArray.forEach((leg) => {
              numStops += (leg.length > 1 ? leg.length - 1 : 0);
              leg.forEach((seg) => {
                totalDurationMins += (seg.Duration || 0);
              });
            });
          } else {
            numLegs = segmentsArray.length;
            segmentsArray.forEach((seg) => {
              totalDurationMins += (seg.Duration || 0);
            });
            // If it's a 1D array in multicity, each segment is likely a direct leg
            numStops = 0;
          }

          return {
            id: f.ResultIndex || `adivaha_multi_${index}`,
            traceId: traceId,
            tokenId: tokenId,
            resultIndex: f.ResultIndex,
            type: 'flight',
            airline: firstSeg.Airline?.AirlineName || 'Airlines',
            airlineCode: firstSeg.Airline?.AirlineCode,
            flight: `${firstSeg.Airline?.AirlineCode}-${firstSeg.Airline?.FlightNumber}`,
            from: mappedSegments[0]?.Origin,
            to: mappedSegments[mappedSegments.length - 1]?.Destination,
            time: formatTime(firstSeg.Origin?.DepTime),
            arrival: formatTime(lastSeg.Destination?.ArrTime),
            dur: formatDuration(totalDurationMins),
            stops: numStops,
            layover: `Multi-City (${numLegs} Legs)`,
            price: Math.ceil(f.Fare?.OfferedFare || f.Fare?.PublishedFare || 0).toLocaleString('en-IN'),
            publishedPrice: Math.ceil(f.Fare?.PublishedFare || 0).toLocaleString('en-IN'),
            class: firstSeg.FareClassification?.Type || 'Economy',
            isLCC: f.IsLCC !== undefined ? Boolean(f.IsLCC) : false,
            raw: f
          };
        }).filter(Boolean);

        return { flights: mappedFlights, rawAdivahaResponse: response.data };
      }

      return { flights: [], rawAdivahaResponse: response.data };
    } catch (error) {
      console.error('Adivaha multicityFlightSearch Error:', error.response?.data || error.message);
      throw error;
    }
  }



  static async getFlightFareQuote(payload) {
    try {
      const { TraceId, ResultIndex, EndUserIp } = payload;
      const cleanTraceId = String(TraceId || '').trim().replace(/ /g, '+');
      const cleanResultIndex = String(ResultIndex || '').trim().replace(/ /g, '+');
      const apiPayload = {
        action: "fareQuote",
        ResultIndex: cleanResultIndex,
        TraceId: cleanTraceId,
        EndUserIp
      };
      const response = await adivahaClient.post('/', apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha getFlightFareQuote Error:', error.response?.data || error.message);
      throw error;
    }
  }


  /**
   * Get lowest airfare of the month
   * POST https://api.adivaha.io/flights/api/?action=GetCalendarFare
   */
  static async getCalendarFare(payload) {
    try {
      const {
        origin,
        destination,
        departureDate,
        cabinClass = "Economy"
      } = payload;

      const formatDate = (dateStr) => this.formatDate(dateStr);

      const categoryMap = {
        'Economy': 'Economy',
        'Premium Economy': 'PremiumEconomy',
        'Business': 'Business',
        'First Class': 'First'
      };

      const cleanIata = (str) => {
        if (!str) return "";
        const match = String(str).match(/[A-Z]{3}/i);
        return match ? match[0].toUpperCase() : String(str).trim().substring(0, 3).toUpperCase();
      };

      const apiPayload = {
        action: "GetCalendarFare",
        From_IATACODE: cleanIata(origin),
        To_IATACODE: cleanIata(destination),
        departure_date: formatDate(departureDate),
        flights_category: categoryMap[cabinClass] || "Economy"
      };

      const response = await adivahaClient.post(`/?action=GetCalendarFare`, apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha getCalendarFare Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get cheapest fare for a specific day (must be called after getCalendarFare)
   * POST https://api.adivaha.io/flights/api/?action=UpdateCalendarFareOfDay
   */
  static async updateCalendarFareOfDay(payload) {
    try {
      const {
        origin,
        destination,
        departureDate,
        cabinClass = "Economy"
      } = payload;

      const formatDate = (dateStr) => this.formatDate(dateStr);

      const categoryMap = {
        'Economy': 'Economy',
        'Premium Economy': 'PremiumEconomy',
        'Business': 'Business',
        'First Class': 'First'
      };

      const cleanIata = (str) => {
        if (!str) return "";
        const match = String(str).match(/[A-Z]{3}/i);
        return match ? match[0].toUpperCase() : String(str).trim().substring(0, 3).toUpperCase();
      };

      const apiPayload = {
        action: "UpdateCalendarFareOfDay",
        From_IATACODE: cleanIata(origin),
        To_IATACODE: cleanIata(destination),
        departure_date: formatDate(departureDate),
        Flights_category: categoryMap[cabinClass] || "Economy"
      };

      const response = await adivahaClient.post(`/?action=UpdateCalendarFareOfDay`, apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha updateCalendarFareOfDay Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Book a flight (LCC or Non-LCC Hold)
   * POST https://api.adivaha.io/flights/api/
   * @param {Object} bookingPayload - Data for booking
   */
  static async bookFlight(bookingPayload) {
    try {
      const {
        isLCC,
        TraceId,
        ResultIndex,
        Passengers,
        ContactDetails,
        isoneway,
        isDomestic,
        IsDomesticReturn
      } = bookingPayload;

      const cleanTraceId = String(TraceId || '').trim().replace(/ /g, '+');
      const cleanResultIndex = String(ResultIndex || '').trim().replace(/ /g, '+');

      const mode = bookingPayload.mode || process.env.ADIVAHA_MODE || "LIVE";
      const customerIp = getValidPublicIp(bookingPayload.customerIp || bookingPayload.CustomerIp);

      const apiPayload = {
        action: isLCC ? "ticketForLcc" : "flightBook",
        mode,
        TraceId: cleanTraceId,
        ResultIndex: cleanResultIndex,
        IsLCC: isLCC ? "1" : "0",
        isoneway: isoneway || "Yes",
        IsOneway: isoneway || "Yes",
        isDomestic: isDomestic || "Yes",
        IsDomestic: isDomestic || "Yes",
        IsDomesticReturn: IsDomesticReturn || "No",
        EndUserIp: customerIp,
        endUserIp: customerIp,
        customerIp: customerIp,
        Passengers,
        ContactDetails
      };

      apiPayload.IsPriceChangeAccepted = "true";
      apiPayload.isPriceChangeAccepted = "true";
      apiPayload.IsPriceChanged = "true";
      apiPayload.isPriceChanged = "true";
      apiPayload.isPriceChangeAccepted1 = 1;
      apiPayload.isPriceChangeAcceptedFlag = 1;

      const reqHeaders = customerIp ? { headers: { 'Customer-IP': customerIp } } : {};
      const response = await adivahaClient.post(`/?action=${isLCC ? 'ticketForLcc' : 'flightBook'}`, apiPayload, reqHeaders);
      return response.data;
    } catch (error) {
      console.error(`Adivaha ${bookingPayload.isLCC ? 'ticketForLcc' : 'flightBook'} Error:`, error.response?.data || error.message);
      throw error;
    }
  }


  /**
   * Issue a ticket for a Non-LCC flight (after successful hold/book)
   * POST https://api.adivaha.io/flights/api/
   * @param {Object} ticketingPayload - Data for ticketing
   */
  static async issueNonLccTicket(ticketingPayload) {
    try {
      const {
        PNR,
        BookingId,
        order_id,
        TraceId,
        isoneway,
        isDomestic,
        IsDomesticReturn,
        Passengers,
        customerIp,
        IsPriceChangeAccepted
      } = ticketingPayload;

      const mode = ticketingPayload.mode || process.env.ADIVAHA_MODE || "LIVE";

      const cleanTraceId = String(TraceId || '').trim().replace(/ /g, '+');

      const validCustomerIp = getValidPublicIp(customerIp);

      const apiPayload = {
        action: "ticket",
        mode,
        PNR,
        BookingId,
        order_id,
        TraceId: cleanTraceId,
        IsLCC: "0",
        isoneway: isoneway || "Yes",
        IsOneway: isoneway || "Yes",
        isDomestic: isDomestic || "Yes",
        IsDomestic: isDomestic || "Yes",
        IsDomesticReturn: IsDomesticReturn || "No",
        EndUserIp: validCustomerIp,
        endUserIp: validCustomerIp,
        customerIp: validCustomerIp,
        Passengers
      };

      apiPayload.IsPriceChangeAccepted = "true";
      apiPayload.isPriceChangeAccepted = "true";
      apiPayload.IsPriceChanged = "true";
      apiPayload.isPriceChanged = "true";

      const reqHeaders = validCustomerIp ? { headers: { 'Customer-IP': validCustomerIp } } : {};
      const response = await adivahaClient.post('/?action=ticket', apiPayload, reqHeaders);
      return response.data;
    } catch (error) {
      console.error('Adivaha ticket Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Special Service Requests (SSR) like meals, seats, and baggage
   * POST https://api.adivaha.io/flights/api/?action=flightSSR
   */
  static async getFlightSSR(payload) {
    try {
      const { TraceId, ResultIndex, EndUserIp, customerIp } = payload;
      return await this.getSSRDetails({
        TraceId,
        ResultIndex,
        customerIp: customerIp || EndUserIp
      });
    } catch (error) {
      console.error('Adivaha getFlightSSR Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Booking Details
   * POST https://api.adivaha.io/flights/api/?action=getBookingDetails
   */
  static async getBookingDetails(payload) {
    try {
      const cleanTraceId = String(payload.TraceId || '').trim().replace(/ /g, '+');
      const apiPayload = {
        action: "getBookingDetails",
        TraceId: cleanTraceId,
        BookingId: String(payload.BookingId),
        PNR: payload.PNR,
        EndUserIp: getValidPublicIp(payload.EndUserIp || payload.customerIp)
      };
      const response = await adivahaClient.post('/?action=getBookingDetails', apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha getBookingDetails Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get flight cancellation charges
   * POST https://api.adivaha.io/flights/api/?action=getCancellationCharges
   */
  static async getCancellationCharges(payload) {
    try {
      const apiPayload = {
        action: "getCancellationCharges",
        BookingId: String(payload.BookingId),
        RequestType: String(payload.RequestType || 1),
        EndUserIp: getValidPublicIp(payload.EndUserIp || payload.customerIp)
      };
      const response = await adivahaClient.post('/?action=getCancellationCharges', apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha getCancellationCharges Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Request booking cancellation
   * POST https://api.adivaha.io/flights/api/?action=ticketCancel
   */
  static async cancelBooking(payload) {
    try {
      const crd = payload.ChangeRequestData || payload;
      const apiPayload = {
        action: "ticketCancel",
        order_id: payload.order_id || crd.order_id || "UNKNOWN",
        ChangeRequestData: {
          BookingId: Number(crd.BookingId),
          RequestType: Number(crd.RequestType ?? 1),
          CancellationType: Number(crd.CancellationType ?? 0),
          Sectors: crd.Sectors || [],
          TicketId: crd.TicketId || [],
          Remarks: crd.Remarks || 'Customer request',
          EndUserIp: getValidPublicIp(crd.EndUserIp || crd.customerIp)
        }
      };
      const response = await adivahaClient.post('/?action=ticketCancel', apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha cancelBooking Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Check cancellation status
   * POST https://api.adivaha.io/flights/api/?action=checkChangeStatus
   */
  static async getCancellationStatus(payload) {
    try {
      const apiPayload = {
        action: "checkChangeStatus",
        ChangeRequestId: String(payload.ChangeRequestId)
      };
      const response = await adivahaClient.post('/?action=checkChangeStatus', apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha getCancellationStatus Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get wallet balance
   * GET https://api.adivaha.io/flights/api/?action=GetWalletBalance
   */
  static async getWalletBalance() {
    try {
      const response = await adivahaClient.get('/', {
        params: {
          action: 'GetWalletBalance'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Adivaha getWalletBalance Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Release or cancel hold booking
   * POST https://api.adivaha.io/flights/api/?action=ReleasePNRRequest
   */
  static async releaseHoldBooking(payload) {
    try {
      const apiPayload = {
        action: "ReleasePNRRequest",
        BookingId: String(payload.BookingId),
        order_id: payload.order_id,
        Source: Number(payload.Source || 4)
      };
      const response = await adivahaClient.post('/?action=ReleasePNRRequest', apiPayload);
      return response.data;
    } catch (error) {
      console.error('Adivaha releaseHoldBooking Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Manually trigger token creation / refresh
   * GET https://api.adivaha.io/flights/api/?action=createToken
   */
  static async createManualToken() {
    try {
      const response = await axios.get(`${ADIVAHA_BASE_URL}/?action=createToken`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip',
          'PID': process.env.ADIVAHA_PID,
          'x-api-key': process.env.ADIVAHA_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Adivaha createManualToken Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Fare Rule / Cancellation Restrictions for a flight
   */
  static async getFareRule(payload) {
    try {
      const { TraceId, ResultIndex, customerIp } = payload;
      const cleanTraceId = String(TraceId || '').trim().replace(/ /g, '+');
      const cleanResultIndex = String(ResultIndex || '').trim().replace(/ /g, '+');
      const mode = payload.mode || process.env.ADIVAHA_MODE || "LIVE";

      const apiPayload = {
        action: "fareRule",
        mode,
        TraceId: cleanTraceId,
        ResultIndex: cleanResultIndex
      };

      const reqHeaders = customerIp ? { headers: { 'Customer-IP': customerIp } } : {};
      const response = await adivahaClient.post('/?action=fareRule', apiPayload, reqHeaders);
      return response.data;
    } catch (error) {
      console.error('Adivaha getFareRule Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get SSR (Seats, Meals, Baggage) options for a flight
   */
  static async getSSRDetails(payload) {
    try {
      const { TraceId, ResultIndex, customerIp } = payload;
      const cleanTraceId = String(TraceId || '').trim().replace(/ /g, '+');
      const cleanResultIndex = String(ResultIndex || '').trim().replace(/ /g, '+');
      const mode = payload.mode || process.env.ADIVAHA_MODE || "LIVE";

      const apiPayload = {
        action: "SSR",
        mode,
        TraceId: cleanTraceId,
        ResultIndex: cleanResultIndex
      };

      const reqHeaders = customerIp ? { headers: { 'Customer-IP': customerIp } } : {};
      const response = await adivahaClient.post('/?action=SSR', apiPayload, reqHeaders);
      return response.data;
    } catch (error) {
      console.error('Adivaha getSSRDetails Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = AdivahaFlightService;

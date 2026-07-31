/**
 * Currency utility for FlyAnyTrip hotel booking.
 *
 * IMPORTANT — Currency detection strategy:
 * The Adivaha API returns hotel prices in whatever currency is configured for the
 * account (typically USD for international hotels, INR for Indian hotels).
 * We detect the currency from the API response and convert to INR for display.
 */

export const CURRENCY_SYMBOLS = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'AED ',
  SGD: 'S$', MYR: 'RM ', THB: '฿', JPY: '¥', AUD: 'A$',
  CAD: 'C$', CHF: 'CHF ', HKD: 'HK$', SAR: 'SAR ',
  QAR: 'QAR ', OMR: 'OMR ', KWD: 'KWD ', BHD: 'BHD ',
};

/** Approximate INR conversion rates (static fallback) */
const TO_INR = {
  USD: 84, EUR: 91, GBP: 107, AED: 22.9, SGD: 62,
  MYR: 18, THB: 2.3, JPY: 0.55, AUD: 55, CAD: 62,
  CHF: 94, HKD: 10.8, SAR: 22.4, QAR: 23.1, OMR: 218,
  KWD: 275, BHD: 224, INR: 1,
};

export const convertToINR = (amount, fromCurrency = 'INR') => {
  const code = (fromCurrency || 'INR').toUpperCase();
  const rate = TO_INR[code] ?? 1;
  return amount * rate;
};

export const getCurrencySymbol = (code = 'INR') =>
  CURRENCY_SYMBOLS[(code || 'INR').toUpperCase()] || `${code} `;

/** Format amount as INR (converts from source currency first) */
export const formatPrice = (amount, sourceCurrency = 'INR') => {
  const inrAmount = convertToINR(amount, sourceCurrency);
  return `₹${Math.ceil(inrAmount).toLocaleString('en-IN')}`;
};

/** Returns INR integer after conversion */
export const toINR = (amount, sourceCurrency = 'INR') =>
  Math.ceil(convertToINR(amount, sourceCurrency));

/**
 * Detect currency from Adivaha API response.
 *
 * Can receive:
 *  - The full data object:  { responseData: { currency, HotelLists: { HotelList: [...] } } }
 *  - Just responseData:     { currency, HotelLists: { HotelList: [...] } }
 *  - Just the hotel array:  [{ Currency, LowRate, ... }, ...]
 *
 * Returns a 3-letter currency code (default 'USD' for Adivaha — they typically
 * bill in USD unless you are on an INR account).
 */
export const detectCurrency = (input) => {
  if (!input) return null;

  // Case 1: full data object with nested responseData
  if (input.responseData) {
    const rd = input.responseData;
    const found = _extractFromResponseData(rd);
    if (found) return found;
  }

  // Case 2: input IS the responseData (has HotelLists or currency directly)
  if (input.HotelLists || input.currency || input.Currency || input.rateCurrencyCode) {
    const found = _extractFromResponseData(input);
    if (found) return found;
  }

  // Case 3: array of hotels
  if (Array.isArray(input) && input.length > 0) {
    const first = input[0];
    return first?.Currency || first?.currency || first?.rateCurrencyCode ||
      first?.RoomTypes?.[0]?.rates?.[0]?.currency || null;
  }

  return null;
};

function _extractFromResponseData(rd) {
  if (!rd) return null;
  // Direct currency field on responseData
  if (rd.currency && rd.currency !== 'null') return rd.currency;
  if (rd.Currency && rd.Currency !== 'null') return rd.Currency;
  if (rd.rateCurrencyCode && rd.rateCurrencyCode !== 'null') return rd.rateCurrencyCode;
  // Currency on first hotel in the list
  const list = rd.HotelLists?.HotelList || [];
  if (list.length > 0) {
    const h = list[0];
    if (h?.Currency && h.Currency !== 'null') return h.Currency;
    if (h?.currency && h.currency !== 'null') return h.currency;
    if (h?.rateCurrencyCode && h.rateCurrencyCode !== 'null') return h.rateCurrencyCode;
    if (h?.RoomTypes?.[0]?.rates?.[0]?.currency) return h.RoomTypes[0].rates[0].currency;
  }
  return null;
}

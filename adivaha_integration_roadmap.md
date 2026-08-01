# Adivaha Flight API Integration Roadmap
### FlyAnyTrip — Complete API Mapping & Status Guide
**Last Updated:** August 2026 | **Backend Port:** 5000 | **Frontend Port:** 5173

---

## Quick Reference: API Status Summary

| # | API Name | Adivaha Action | Backend Route | Status | Frontend |
|---|---|---|---|---|---|
| 1 | Create Token | `createToken` | Auto via interceptor / `GET /api/booking/token/refresh` | ✅ Working | — |
| 2 | Get Wallet Balance | `GetWalletBalance` | `GET /api/booking/balance` | ✅ Working | 💰 Header Widget |
| 3 | Flight Search (One-way/RT) | `OneWayFlightSearch` | `GET /api/flights/search` | ✅ Working | ResultPage.jsx |
| 4 | Multicity Search | `multicityflightSearch` | `POST /api/flights/multicity-search` | ✅ Working (Fixed) | Search card |
| 5 | Get Airport List | `GetAirportList` | `GET /api/flights/locations` | ✅ Working | AutoComplete |
| 6 | Revalidate Price | `RevalidateFlight` | `POST /api/booking/revalidate` | ✅ Working | Checkout |
| 7 | Fare Rule | `GetFareRule` | `POST /api/booking/fare-rule` | ✅ Working | Checkout |
| 8 | SSR (Services) | `GetBookingSSR` | `POST /api/booking/ssr` | ✅ Working | Checkout |
| 9 | Confirm Booking | `BlockTicket` | `POST /api/booking/confirm` | ✅ Working | Checkout |
| 10 | Get Booking Detail | `GetBookingDetail` | `POST /api/booking/detail` | ✅ Working | Bookings |
| 11 | Cancellation Charges | `getCancellationCharges` | `POST /api/booking/cancel-charges` | ✅ Working | Cancel Modal |
| 12 | Cancel Booking | `ticketCancel` | `POST /api/booking/cancel-request` | ✅ Working | Cancel Modal |
| 13 | Check Cancel Status | `checkChangeStatus` | `POST /api/booking/cancel-status` | ✅ Working | Bookings |
| 14 | Release Hold Booking | `ReleasePNRRequest` | `POST /api/booking/release-hold` | ✅ Working | Bookings |
| 15 | Invoice PDF | (Internal) | `GET /api/booking/invoice/:id` | ✅ Working | Email/Download |
| 16 | Send Invoice Email | (Internal SMTP) | `POST /api/booking/send-invoice-email` | ✅ Working | Auto on confirm |

---

## Detailed API Documentation

### 1. Create Token API

**Adivaha Action:** `createToken`
**HTTP Method:** GET
**Adivaha URL:** `https://api.adivaha.io/flights/api/?action=createToken`

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.createManualToken()` |
| **Service File** | `backend/integrations/adivaha/adivaha.service.js` |
| **Auto Refresh** | `backend/integrations/adivaha/adivaha.service.js` — axios interceptor (catches `ErrorCode: 6`) |
| **Manual Refresh Route** | `GET /api/booking/token/refresh` |
| **Controller Method** | `exports.createManualToken` in `booking.controller.js` |

#### Behaviour
- Token is valid 00:00 – 23:59 IST daily.
- If any API call returns `ErrorCode: 6 (Invalid Token)`, the axios interceptor at the top of `adivaha.service.js` automatically calls `createToken`, stores the new token, and **retries** the original request transparently.
- Manual refresh available at `GET http://localhost:5000/api/booking/token/refresh` for diagnostics.

#### Test Command
```bash
curl http://localhost:5000/api/booking/token/refresh
# Expected: { "success": true, "data": { "Token_Status": "SUCCESS" } }
```

---

### 2. Get Wallet Balance API

**Adivaha Action:** `GetWalletBalance`
**HTTP Method:** GET
**Adivaha URL:** `https://api.adivaha.io/flights/api/?action=GetWalletBalance`

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.getWalletBalance()` |
| **Service File** | `backend/integrations/adivaha/adivaha.service.js` (Lines ~700+) |
| **Backend Route** | `GET /api/booking/balance` |
| **Controller Method** | `exports.getWalletBalance` in `booking.controller.js` |
| **Frontend** | `MyBookings.jsx` — Wallet Balance widget in page header |

#### Response Fields
```json
{
  "Status": "success",
  "PID": "77A93722",
  "ApiKey": "69EF161DEEBA7",
  "wallet_currency": "INR",
  "wallet_balance": "0",
  "test_wallet_balance": "984380"
}
```

#### Test Command
```bash
curl http://localhost:5000/api/booking/balance
# Expected: { "success": true, "data": { "wallet_balance": "0", "test_wallet_balance": "984380" } }
```

---

### 3. Flight Search (One-way / Round-trip)

**Adivaha Action:** `OneWayFlightSearch`
**HTTP Method:** GET
**Adivaha URL:** `https://api.adivaha.io/flights/api/?action=OneWayFlightSearch`

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.searchFlights()` |
| **Service File** | `backend/integrations/adivaha/adivaha.service.js` (Lines ~111–263) |
| **Backend Route** | `GET /api/flights/search?origin=DEL&destination=BOM&departureDate=2026-08-15&adults=1&travelClass=Economy` |
| **Controller Method** | `flightController.search` in `flight.controller.js` |
| **Frontend** | `ResultPage.jsx`, `flightService.js` |

#### Cabin Class Mapping
| String Input | API Value |
|---|---|
| Economy | `'Economy'` |
| PremiumEconomy | `'PremiumEconomy'` |
| Business | `'Business'` |
| First | `'First'` |

---

### 4. Multicity Search API

**Adivaha Action:** `multicityflightSearch`
**HTTP Method:** POST
**Adivaha URL:** `https://api.adivaha.io/flights/api/?action=multicityflightSearch`

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.multicityFlightSearch()` |
| **Service File** | `backend/integrations/adivaha/adivaha.service.js` (Lines ~265–410) |
| **Backend Route** | `POST /api/flights/multicity-search` |
| **Controller Method** | `flightController.multicitySearch` in `flight.controller.js` |

#### ⚠️ Fix Applied (August 2026)
The cabin class numeric map was **shifted by +1** and has been corrected:

| Travel Class | Old (Wrong) | New (Correct per docs) |
|---|---|---|
| Economy | `3` | `2` |
| Premium Economy | `4` | `3` |
| Business | `5` | `4` |
| Premium Business | N/A | `5` |
| First Class | `6` | `6` |

---

### 5–9. Core Booking APIs (Revalidate, Fare Rule, SSR, Confirm)

All previously integrated. Located in:
- `backend/integrations/adivaha/adivaha.service.js` (Lines ~410–530)
- `backend/controllers/booking.controller.js`
- `backend/routes/booking.routes.js`

| Route | Controller Method | Description |
|---|---|---|
| `POST /api/booking/revalidate` | `revalidateFlight` | Re-check fare before payment |
| `POST /api/booking/fare-rule` | `getFareRule` | Get fare rules for a flight |
| `POST /api/booking/ssr` | `getSSR` | Get special service requests (meals, seats) |
| `POST /api/booking/confirm` | `confirmBooking` | Confirm booking (BlockTicket) + invoice + email |

---

### 11. Cancellation Charges API

**Adivaha Action:** `getCancellationCharges`
**HTTP Method:** POST

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.getCancellationCharges()` |
| **Service File** | `backend/integrations/adivaha/adivaha.service.js` |
| **Backend Route** | `POST /api/booking/cancel-charges` |
| **Controller Method** | `cancelBooking` (charges section) in `booking.controller.js` |
| **Frontend** | `MyBookings.jsx` — dynamically loaded when Cancel modal opens for real bookings |

#### Frontend Flow
1. User clicks "Cancel Booking" on a real booking card.
2. `MyBookings.jsx` useEffect fires and calls `POST /api/booking/cancel-charges`.
3. Modal shows "Fetching live charges..." spinner.
4. Real `CancellationCharge` and `RefundAmount` are displayed.
5. Modal shows "✓ Live from Adivaha" badge.

---

### 12. Cancel Booking API

**Adivaha Action:** `ticketCancel`
**HTTP Method:** POST

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.cancelBooking()` |
| **Backend Route** | `POST /api/booking/cancel-request` |
| **Controller Method** | `cancelBooking` in `booking.controller.js` |
| **Frontend** | `MyBookings.jsx` — `handleConfirmCancel()` |

#### Request Body
```json
{
  "bookingId": "FAT-XXXXXXXX",
  "remarks": "Cancellation requested by user",
  "cancellationCharge": 3000,
  "refundAmount": 7000
}
```

---

### 13. Check Cancellation Status API

**Adivaha Action:** `checkChangeStatus`
**HTTP Method:** POST

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.getCancellationStatus()` |
| **Backend Route** | `POST /api/booking/cancel-status` |
| **Controller Method** | `checkCancellationStatus` in `booking.controller.js` |
| **Frontend** | `MyBookings.jsx` — "Refresh Status" button on cancelled bookings |

#### ChangeRequestStatus Values
| Code | Meaning |
|---|---|
| 0 | NotSet |
| 1 | Unassigned |
| 2 | Assigned |
| 3 | Acknowledged |
| 4 | Completed |
| 5 | Rejected |
| 6 | Closed |
| 7 | Pending |
| 8 | Other |

---

### 14. Release Hold Booking API

**Adivaha Action:** `ReleasePNRRequest`
**HTTP Method:** POST

#### Integration Details
| Item | Path |
|---|---|
| **Service Method** | `AdivahaFlightService.releaseHoldBooking()` |
| **Service File** | `backend/integrations/adivaha/adivaha.service.js` |
| **Backend Route** | `POST /api/booking/release-hold` |
| **Controller Method** | `exports.releaseHoldBooking` in `booking.controller.js` |
| **Frontend** | `MyBookings.jsx` — "Release Hold" button on HOLD / CONFIRMED real bookings |

#### When to Use
Non-LCC flights (e.g., Air India, Emirates, Vistara) use a **hold/ticketing** two-step flow:
1. `BlockTicket` puts the booking on hold (generates a temporary PNR).
2. The user has a time window to pay and confirm ticketing.
3. If the booking is **not ticketed**, `ReleasePNRRequest` must be called to release the hold, or the airline may issue an **ADM (Agency Debit Memo)** penalty.

#### Request Body
```json
{
  "BookingId": "12345678",
  "order_id": "ORD-12345",
  "Source": 4
}
```

#### Source Values
| Value | Description |
|---|---|
| 1 | Domestic |
| 2 | International |
| 3 | Domestic + International |
| 4 | GDS (Default) |

---

## File Structure Reference

```
backend/
├── integrations/
│   └── adivaha/
│       └── adivaha.service.js        ← All Adivaha API methods
├── controllers/
│   └── booking.controller.js         ← All booking/cancel/balance/hold controllers
├── routes/
│   └── booking.routes.js             ← Route definitions for /api/booking/*
│   └── flight.routes.js              ← Route definitions for /api/flights/*
└── scratch/
    └── verify_extended_adivaha_apis.js ← Diagnostic test for balance/token/hold

frontend/
└── src/
    ├── pages/
    │   └── MyBookings.jsx            ← Main bookings page (balance widget, cancel flow, hold release)
    ├── services/
    │   ├── api.js                    ← fetchAPI base helper
    │   └── flightService.js          ← Flight API service
    └── components/
        └── flights/
            └── result/
                └── ResultPage.jsx    ← Search results page
```

---

## Environment Variables Required

```env
# backend/.env
ADIVAHA_BASE_URL=https://api.adivaha.io/flights/api
ADIVAHA_PID=77A93722
ADIVAHA_API_KEY=69EF161DEEBA7

# Optional Email SMTP (for invoice emails)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
```

---

## Verification Checklist

Run the diagnostic script to verify live API connectivity:

```bash
cd backend
node scratch/verify_extended_adivaha_apis.js
```

Expected output:
```
✅ GetWalletBalance Success: { "Status": "success", "test_wallet_balance": "984380" }
✅ createManualToken Success: { "Token_Status": "SUCCESS" }
ℹ️ releaseHoldBooking Request completed (expected API error for mock ID)
```

---

*Generated by Antigravity — FlyAnyTrip API Integration Guide*

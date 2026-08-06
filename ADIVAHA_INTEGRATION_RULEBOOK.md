# ✈️ Adivaha Flight API Master Integration Rulebook

This document contains the complete, authoritative list of all technical, operational, GDS protocol, and business logic rules for integrating the **Adivaha Flight Booking API** into the **FlyAnyTrip** platform.

---

## 📌 Table of Contents
1. [Flight Search API Rules (`action: flightSearch`)](#1-flight-search-api-rules)
2. [FareQuote & Token Consumption Rules (`action: flightFareQuote`)](#2-farequote--token-consumption-rules)
3. [Passenger Node & PaxType Rules (`Passengers[]`)](#3-passenger-node--paxtype-rules)
4. [Booking & Instant Ticketing Rules (`ticketForLcc` vs `flightBook`)](#4-booking--instant-ticketing-rules)
5. [Domestic Return vs International Return Rules (Multi-PNR)](#5-domestic-return-vs-international-return-rules)
6. [Deep Network Protocol & Character Encoding Rules](#6-deep-network-protocol--character-encoding-rules)
7. [SSR, GST & Specialized Edge-Case Rules](#7-ssr-gst--specialized-edge-case-rules)
8. [API Status Codes & Error Reference](#8-api-status-codes--error-reference)

---

## 1. 🔍 Flight Search API Rules (`action: flightSearch`)

- **Date Formatting:** Departure date (`departure_date`) and return date (`return_date`) must always be formatted in `DD-MM-YYYY` string format (e.g., `15-08-2026`).
- **Airport IATA Codes:** `From_IATACODE` and `To_IATACODE` must be 3-letter uppercase airport codes (e.g., `DEL`, `BOM`).
- **Passenger Counts:** `adults`, `children`, and `infants` must be passed matching the user's selected search count.
- **Trip Type Flag:**
  - `isoneway: "Yes"` for One-Way trips.
  - `isoneway: "No"` for Round-Trip / Multi-City trips.
- **TraceId Session Lock:** The `TraceId` returned in the search response is locked to the specific searched passenger breakdown and route session.

---

## 2. 💲 FareQuote & Token Consumption Rules (`action: flightFareQuote`)

- **Non-LCC Flights (`IsLCC: "0"`):** Calling `FareQuote` is **mandatory** for Non-LCC flights to revalidate fares and obtain an updated `ResultIndex`.
- ⛔ **LCC Flight Warning (`IsLCC: "1"`):** **NEVER call `FareQuote` on LCC flights.** LCC search tokens are single-use; calling `FareQuote` burns the token and invalidates `ticketForLcc`.
- 🔄 **ResultIndex Update Requirement:** When `FareQuote` is called for Non-LCC flights, the **new `ResultIndex` returned in `FareQuote` response MUST replace the search `ResultIndex`** before calling `flightBook`.

---

## 3. 👥 Passenger Node & PaxType Rules (`Passengers[]`)

### 🏷️ PaxType Classification
- **Adult:** `PaxType: 1` (Age 12+ years)
- **Child:** `PaxType: 2` (Age 2 to 12 years)
- **Infant:** `PaxType: 3` (Age 0 to 2 years)

### 👔 GDS-Compliant Title Mapping
- **Adult Male (`PaxType: 1`):** `"Mr"`
- **Adult Female (`PaxType: 1`):** `"Mrs"`, `"Ms"`, or `"Miss"`
- **Child Male (`PaxType: 2`):** `"Master"`
- **Child Female (`PaxType: 2`):** `"Miss"`
- **Infant Male (`PaxType: 3`):** `"Master"`
- **Infant Female (`PaxType: 3`):** `"Miss"`
*(Note: Never pass `"Mr"` for children/infants or `"Master"` for adult males).*

### 💵 Passenger Fare Node Rules (NO Division Math)
- ⛔ Passing an empty Fare object (`"Fare": {}`) is strictly prohibited.
- ⛔ Dividing the total fare by the number of passengers (`BaseFare / totalPax`) is strictly prohibited.
- ✅ The exact `Fare` / `FareBreakdown` object received from search or `FareQuote` matching the passenger's `PaxType` must be passed to each passenger's `Fare` node as-is.

### 📅 Passenger Details Formatting
- **Date of Birth (`DateOfBirth`):** Must be formatted as ISO timestamp string: `YYYY-MM-DD T00:00:00` (e.g., `1995-05-15T00:00:00`).
- **Gender:** `1` for Male, `2` for Female.
- **Lead Passenger (`IsLeadPax`):** `true` for the primary contact passenger, `false` for additional passengers.

---

## 4. 🎟️ Booking & Instant Ticketing Rules (`ticketForLcc` vs `flightBook`)

### ⚡ LCC Flights (`IsLCC: "1"`)
- Call `action: "ticketForLcc"` directly.
- Performs seat booking and ticket issuance in a single step, returning `PNR`.

### 🏢 Non-LCC Flights (`IsLCC: "0"`)
- **Step 1:** Call `action: "flightBook"`. Returns `BookingId` & `PNR` (Hold/Booked status).
- **Step 2 (Instant Ticketing):** Call `action: "ticket"` (`issueNonLccTicket`) **instantly** after `flightBook` with `PNR` and `BookingId` to issue the e-ticket immediately.

---

## 5. 🔄 Domestic Return vs International Return Rules (Multi-PNR)

- 🇮🇳 **Domestic Return (India Domestic Round-Trip):**
  - Search response contains two separate flight arrays: `resultsArray[0]` (Outbound) and `resultsArray[1]` (Inbound).
  - Outbound journey must be processed first, followed by Inbound journey.
  - Generates **two separate PNRs** (`PNR1, PNR2`).
- ✈️ **International Return:**
  - Search response contains one flight array (`resultsArray[0]`), with outbound and inbound segments inside `Segment` details.
  - Generates **one combined PNR**.

---

## 6. 🔬 Deep Network Protocol & Character Encoding Rules

- **Header Authentication:** `PID` and `x-api-key` headers are required on all HTTP requests.
- **Network Timeout:** Adivaha GDS Gateway timeout is set to 30 seconds (`30000ms`).
- **URL Space Encoding:** `ResultIndex` and `TraceId` strings containing spaces (` `) must replace spaces with `+` signs (`replace(/ /g, '+')`) to prevent Base64 padding corruption.
- **Name Character Sanitization:** `FirstName` and `LastName` must contain **ONLY alphabetic characters (`A-Z`, `a-z`) and spaces**. Special characters (`-`, `'`, `.`, `/`, `#`, `@`, numbers) are strictly prohibited.
- **Passport Expiry Margin:** For international flights (`isDomestic: "No"`), `PassportExpiry` date MUST be at least **6 months after the departure date** (`PassportExpiry >= DepartureDate + 6 months`).
- **Infant Lap-Child Rules:** Infants (`PaxType: 3`) travel on the lap of an Adult (`PaxType: 1`). Infant count cannot exceed Adult count.

---

## 7. 🧳 SSR, GST & Specialized Edge-Case Rules

- **Special Service Requests (SSR):** Selected seat codes, meals, or extra baggage codes are passed in the passenger SSR node.
- **GST Tax Invoice:** If requested, `GSTNumber` (15-character GSTIN), `GSTCompanyName`, and `GSTCompanyAddress` are passed inside `ContactDetails`.
- **Duplicate Booking Protection:** Submitting identical passenger name, flight, and departure date within 5 minutes triggers GDS duplicate booking protection.

---

## 8. 📊 API Status Codes & Error Reference

| Status Code | Meaning | Outcome |
| :--- | :--- | :--- |
| **`200` / `0`** | **SUCCESS** | PNR & E-Ticket Issued Successfully. |
| **`7605`** | **Fare Not Available / Price Change** | Airline inventory changed; user must re-search. |
| **`7606`** | **Session Expired / Token Burned** | Search token expired or reused; fresh search required. |
| **`101`** | **Invalid Payload Format** | Malformed JSON or missing required key. |
| **`102`** | **Authentication Error** | Invalid PID or API Key. |
| **`103`** | **Insufficient Wallet Balance** | Agency wallet balance depleted. |

---

### ✅ Verification Statement
All rules documented in this rulebook are fully implemented, verified, and active across the `FLYANYTRIP MILAN` codebase.

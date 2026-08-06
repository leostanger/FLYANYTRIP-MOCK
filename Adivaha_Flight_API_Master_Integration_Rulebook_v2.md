# ✈️ Adivaha Flight API Master Integration Rulebook (v2 — Updated)

This document is the complete, authoritative list of all technical, operational, GDS protocol, and business logic rules for integrating the **Adivaha Flight Booking API** into the **FlyAnyTrip** platform.

> **v2 Update Note:** This version adds 6 previously-missing sections (Authentication/Token, Autocomplete, Fare Rule, SSR, Ticket For Price Change, and Post-Booking Management) and corrects the Section 14 error-handling guidance for code `7605`. See the Change Log at the end for full details.

---

## 📌 Table of Contents
1. [Authentication, Mode & Header Rules](#1-authentication-mode--header-rules)
2. [Flight Search API Rules (`action: flightSearch`)](#2-flight-search-api-rules)
3. [Autocomplete API Rules (`action: autocomplete`)](#3-autocomplete-api-rules)
4. [FareQuote & Token Consumption Rules (`action: flightFareQuote`)](#4-farequote--token-consumption-rules)
5. [Fare Rule API Rules (`action: fareRule`)](#5-fare-rule-api-rules)
6. [Passenger Node & PaxType Rules (`Passengers[]`)](#6-passenger-node--paxtype-rules)
7. [SSR API Rules (`action: SSR`)](#7-ssr-api-rules)
8. [Booking & Instant Ticketing Rules (`ticketForLcc` vs `flightBook`)](#8-booking--instant-ticketing-rules)
9. [Ticket For Price Change Rules](#9-ticket-for-price-change-rules)
10. [Domestic Return vs International Return Rules (Multi-PNR)](#10-domestic-return-vs-international-return-rules)
11. [Post-Booking Management (Retrieve / Cancel / Release / Charges)](#11-post-booking-management)
12. [Deep Network Protocol & Character Encoding Rules](#12-deep-network-protocol--character-encoding-rules)
13. [SSR Node, GST & Specialized Edge-Case Rules](#13-ssr-node-gst--specialized-edge-case-rules)
14. [API Status Codes & Error Reference](#14-api-status-codes--error-reference)
15. [Change Log / Verification Notes](#15-change-log--verification-notes)

---

## 1. 🔐 Authentication, Mode & Header Rules

**NEW SECTION — was missing entirely in v1.**

- **Create Token (first step of integration):** Before any booking-affecting call, the integration must complete the `Create Token` step against the Adivaha auth endpoint. Do not assume static `PID` + `x-api-key` headers alone are sufficient authentication for every environment — confirm with Adivaha whether a session/auth token must be generated and refreshed, and how long it remains valid.
- **`mode` Parameter — MANDATORY on every request:** Every API call (Search, FareQuote, FareRule, SSR, Book, Ticket, Retrieve, Cancel, etc.) must include a `mode` value of either:
  - `"Test"` — sandbox/UAT calls, no real GDS transaction.
  - `"LIVE"` — real transactions. **Only usable once the application has been explicitly approved by Adivaha personnel.** Sending `LIVE` before approval will not produce valid bookings.
  - ⛔ Never hardcode `mode` — it must be an environment-driven config value so staging never accidentally fires `LIVE` transactions.
- **Required Headers (corrected/expanded list):**
  - `Content-Type: application/json`
  - `Accept-Encoding: gzip`
  - `PID: <your PID key>`
  - `x-api-key: <your API key>`
  - `Customer-IP: <end user's IPv4 address>` — **previously missing.** This must be the actual end customer's IP address as captured by FlyAnyTrip's own frontend/backend, **never** the server's own IP. It is used by Adivaha for geo/fraud-recovery and analytics, so passing the wrong IP can affect fraud scoring and possibly fare/inventory relevance.

---

## 2. 🔍 Flight Search API Rules (`action: flightSearch`)

- **Date Formatting:** Departure date (`departure_date`) and return date (`return_date`) must always be formatted in `DD-MM-YYYY` string format (e.g., `15-08-2026`).
- **Airport IATA Codes:** `From_IATACODE` and `To_IATACODE` must be 3-letter uppercase airport codes (e.g., `DEL`, `BOM`).
- **Passenger Counts:** `adults`, `children`, and `infants` must be passed matching the user's selected search count.
- **Trip Type Flag:**
  - `isoneway: "Yes"` for One-Way trips.
  - `isoneway: "No"` for Round-Trip / Multi-City trips.
- **TraceId Session Lock:** The `TraceId` returned in the search response is locked to the specific searched passenger breakdown and route session.
- **`mode` required:** See Section 1 — every search call must carry `mode: "Test"` or `mode: "LIVE"`.

---

## 3. 🔤 Autocomplete API Rules (`action: autocomplete`)

**NEW SECTION — was missing entirely in v1.**

- Used to power the airport/city search box on the FlyAnyTrip search form — returns matching airports/cities with their IATA codes.
- This is a simple GET-style lookup call and does not require `TraceId`.
- **Do not hardcode a local IATA-code list as the primary source** for the search UI; use this endpoint so airport additions/renames on the Adivaha side are reflected automatically. A local cache is fine as a fallback only, refreshed periodically.
- Always feed the *exact* IATA code returned by Autocomplete into `From_IATACODE` / `To_IATACODE` in Section 2 — do not let the frontend free-type or fuzzy-match codes independently.

---

## 4. 💲 FareQuote & Token Consumption Rules (`action: flightFareQuote`)

- **Non-LCC Flights (`IsLCC: "0"`):** Calling `FareQuote` is **mandatory** for Non-LCC flights to revalidate fares and obtain an updated `ResultIndex`.
- ⛔ **LCC Flight Warning (`IsLCC: "1"`):** **NEVER call `FareQuote` on LCC flights.** LCC search tokens are single-use; calling `FareQuote` burns the token and invalidates `ticketForLcc`.
- 🔄 **ResultIndex Update Requirement:** When `FareQuote` is called for Non-LCC flights, the **new `ResultIndex` returned in `FareQuote` response MUST replace the search `ResultIndex`** before calling `flightBook`.
- **`mode` required:** Same `mode` value used in Search must be carried through to FareQuote for the same session.

---

## 5. 📜 Fare Rule API Rules (`action: fareRule`)

**NEW SECTION — was missing entirely in v1.**

- Used to fetch fare basis code, restrictions, and penalty charges (`ReissueCharge`, `CancellationCharge`) for a specific `ResultIndex` before the user commits to booking.
- **Required inputs:** `TraceId` (from the original search response) and `ResultIndex` of the selected flight, plus `mode`.
- **UX rule:** Display fare rules / cancellation penalties to the user **before** they enter passenger details and pay — this is standard consumer-protection practice for Indian OTAs and reduces post-booking cancellation disputes.
- Fare Rule is a **read-only** call — it does not consume or burn the LCC single-use token, so it is safe to call for both LCC and Non-LCC flights.

---

## 6. 👥 Passenger Node & PaxType Rules (`Passengers[]`)

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
- **Date of Birth (`DateOfBirth`):** Must be formatted as ISO timestamp string: `YYYY-MM-DDT00:00:00` (e.g., `1995-05-15T00:00:00`).
- **Gender:** `1` for Male, `2` for Female.
- **Lead Passenger (`IsLeadPax`):** `true` for the primary contact passenger, `false` for additional passengers.
- **Type consistency note:** Confirm with Adivaha whether `PaxType`, `Gender`, and similar enum-like fields are expected as JSON strings (`"1"`) or numbers (`1`) — sample payloads in the wild show both conventions depending on the endpoint, and sending the wrong type can cause silent validation failures.

---

## 7. 🧳 SSR API Rules (`action: SSR`)

**NEW SECTION — was missing entirely in v1 (previously only referenced as an embedded passenger node in old Section 7).**

- SSR (Special Service Request — seats, meals, extra baggage) has its own dedicated fetch call, separate from simply embedding an SSR node inside the passenger object at booking time.
- **Call SSR *before* `flightBook` / `ticketForLcc`**, using the same `TraceId` + `ResultIndex`, to retrieve the airline's actual available SSR options (codes, prices, weight/description) for that specific flight and fare.
- ⛔ Do not invent or reuse SSR codes from a different flight/fare — SSR codes and prices are flight- and route-specific (they can even differ for outbound vs inbound legs on domestic returns — see Section 10).
- Once the user selects SSR options, pass the exact SSR code(s) returned by this call into the passenger-level SSR node at booking time (this part of the flow matches the old Section 7 description and remains correct).

---

## 8. 🎟️ Booking & Instant Ticketing Rules (`ticketForLcc` vs `flightBook`)

### ⚡ LCC Flights (`IsLCC: "1"`)
- Call `action: "ticketForLcc"` directly.
- Performs seat booking and ticket issuance in a single step, returning `PNR`.
- Along with `TraceId` and `ResultIndex`, the request also carries `isoneway`, `isDomestic`, and `IsDomesticReturn` flags — make sure these mirror the values used at search time, not just the LCC/Non-LCC flag.

### 🏢 Non-LCC Flights (`IsLCC: "0"`)
- **Step 1:** Call `action: "flightBook"`. Returns `BookingId` & `PNR` (Hold/Booked status).
- **Step 2 (Instant Ticketing):** Call the ticket-issuance action for Non-LCC **instantly** after `flightBook` with `PNR` and `BookingId` to issue the e-ticket immediately.
  - ⚠️ **Verify exact action name with Adivaha before go-live** — do not assume `"ticket"` is correct without confirming against current API docs, as this was not independently verifiable at review time.
- If a fare/price change is detected at this step instead of a clean success, do **not** treat it as a dead end — see Section 9, `Ticket For Price Change`.

---

## 9. 💰 Ticket For Price Change Rules

**NEW SECTION — was missing entirely in v1. This also corrects the old error-handling guidance for code `7605`.**

- If, at the moment of Non-LCC ticket issuance, the airline's price has changed since `FareQuote`, the response will indicate a price change **instead of automatically failing the booking**.
- **Correct handling:** Re-call the ticket-issuance action with an `IsPriceChangeAccepted: true` node (and the updated fare, if returned) to complete the ticket at the new price — **do not force the user back through a fresh search by default.**
- Only fall back to a full re-search when the user explicitly declines the new price, or when the price-change response itself indicates the fare/inventory is no longer available at all (as opposed to simply repriced).
- **UX rule:** Always show the user the new price and require explicit confirmation before calling this with `IsPriceChangeAccepted: true` — never silently auto-accept a price increase.

---

## 10. 🔄 Domestic Return vs International Return Rules (Multi-PNR)

- 🇮🇳 **Domestic Return (India Domestic Round-Trip):**
  - Search response contains two separate flight arrays: `resultsArray[0]` (Outbound) and `resultsArray[1]` (Inbound).
  - Outbound journey must be processed first, followed by Inbound journey.
  - Generates **two separate PNRs** (`PNR1, PNR2`).
  - Each leg has its own `TraceId`/`ResultIndex` and its own SSR options (see Section 7) — do not assume outbound SSR codes are valid for the inbound leg.
- ✈️ **International Return:**
  - Search response contains one flight array (`resultsArray[0]`), with outbound and inbound segments inside `Segment` details.
  - Generates **one combined PNR**.

---

## 11. 📂 Post-Booking Management

**NEW SECTION — was missing entirely in v1. Covers everything that happens after a PNR/ticket exists.**

### 🔎 Retrieve Booking (`action: getBookingDetails`)
- Fetches current booking/ticket status using `BookingId`, `PNR`, and/or `TraceId`.
- Use this to reconcile FlyAnyTrip's own database with the GDS source of truth — e.g., after a webhook/callback gap, or before displaying booking status to a customer support agent.
- Requires `mode` (Section 1) in the request payload.

### ❌ Cancel Booking
- Dedicated action for cancelling an existing PNR/ticket — this is **not** the same as Release Hold Booking below.
- Should generally be preceded by a **Get Cancellation Charges** call so the user is shown the exact refund/penalty amount before confirming cancellation.

### ⏸️ Release Hold Booking
- Applies specifically to **Non-LCC hold bookings** created via `flightBook` (Section 8) that were never converted to a ticket.
- If a hold is abandoned (e.g., user drops off before payment, or the price-change offer in Section 9 is declined), the hold must be explicitly released via this action rather than left to silently expire — this frees the seat inventory and avoids unnecessary GDS penalty exposure.

### 🧾 Get Cancellation Charges
- Returns the current cancellation penalty for an existing PNR, based on live fare rules — **call this immediately before** Cancel Booking, not from a cached Fare Rule (Section 5) response, since penalties can change closer to departure.

---

## 12. 🔬 Deep Network Protocol & Character Encoding Rules

- **Header Authentication:** `PID`, `x-api-key`, and `Customer-IP` headers are required on all HTTP requests (see Section 1).
- **Network Timeout:** Adivaha GDS Gateway timeout is set to 30 seconds (`30000ms`).
- **URL Space Encoding:** `ResultIndex` and `TraceId` strings containing spaces (` `) must replace spaces with `+` signs (`replace(/ /g, '+')`) to prevent Base64 padding corruption.
- **Name Character Sanitization:** `FirstName` and `LastName` must contain **ONLY alphabetic characters (`A-Z`, `a-z`) and spaces**. Special characters (`-`, `'`, `.`, `/`, `#`, `@`, numbers) are strictly prohibited.
- **Passport Expiry Margin:** For international flights (`isDomestic: "No"`), `PassportExpiry` date MUST be at least **6 months after the departure date** (`PassportExpiry >= DepartureDate + 6 months`).
- **Infant Lap-Child Rules:** Infants (`PaxType: 3`) travel on the lap of an Adult (`PaxType: 1`). Infant count cannot exceed Adult count.

---

## 13. 🧳 SSR Node, GST & Specialized Edge-Case Rules

- **SSR at booking time:** Selected seat codes, meals, or extra baggage codes (sourced from Section 7's dedicated SSR call) are passed in the passenger SSR node at `flightBook`/`ticketForLcc` time.
- **GST Tax Invoice:** If requested, `GSTNumber` (15-character GSTIN), `GSTCompanyName`, and `GSTCompanyAddress` are passed inside `ContactDetails`.
- **Duplicate Booking Protection:** Submitting identical passenger name, flight, and departure date within 5 minutes triggers GDS duplicate booking protection.

---

## 14. 📊 API Status Codes & Error Reference

| Status Code | Meaning | Outcome |
| :--- | :--- | :--- |
| **`200` / `0`** | **SUCCESS** | PNR & E-Ticket Issued Successfully. |
| **`7605`** | **Fare Not Available / Price Change** | ⚠️ **Corrected:** Do not force a fresh search by default. First attempt the `Ticket For Price Change` flow (Section 9) with `IsPriceChangeAccepted: true` after user confirmation. Only re-search if the fare/inventory is fully gone or the user declines the new price. |
| **`7606`** | **Session Expired / Token Burned** | Search token expired or reused; fresh search required. |
| **`101`** | **Invalid Payload Format** | Malformed JSON or missing required key. |
| **`102`** | **Authentication Error** | Invalid PID, API Key, or token — also check `Customer-IP` header and `mode` value (Section 1) if this appears unexpectedly. |
| **`103`** | **Insufficient Wallet Balance** | Agency wallet balance depleted. |

> ⚠️ **Verification flag:** These exact codes (`101`, `102`, `103`, `7605`, `7606`) could not be independently confirmed against Adivaha's current published error reference during this review. Confirm the authoritative, up-to-date list with your Adivaha account manager or API docs before relying on this table in production error-handling logic.

---

## 15. 📝 Change Log / Verification Notes

- **Added:** Section 1 (Authentication, Mode & Header rules — `mode` param, `Customer-IP` header, `Create Token` step).
- **Added:** Section 3 (Autocomplete API).
- **Added:** Section 5 (Fare Rule API).
- **Added:** Section 7 (SSR as a dedicated API action, not just an embedded node).
- **Added:** Section 9 (Ticket For Price Change flow).
- **Added:** Section 11 (Retrieve Booking, Cancel Booking, Release Hold Booking, Get Cancellation Charges).
- **Corrected:** Section 14, error code `7605` outcome — re-search is no longer stated as the only/default resolution.
- **Flagged, not yet independently verified:** exact Non-LCC ticket-issuance action name (Section 8), and the full status-code table (Section 14). Confirm both directly with Adivaha before treating them as final.

---

### ✅ Verification Statement
Sections 2, 4, 6, 8, 10, 12, and 13 reflect the original ruleset and remain consistent with Adivaha's publicly documented API behavior as reviewed. Sections 1, 3, 5, 7, 9, 11, and the Section 14 correction are new additions based on Adivaha's official documentation and should be reviewed by the FlyAnyTrip integration team before this version replaces the v1 rulebook in the `FLYANYTRIP MILAN` codebase.

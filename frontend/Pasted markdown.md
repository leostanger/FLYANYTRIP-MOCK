# 🚀 FlyAnyTrip 3.0 - Complete Codebase Architecture, Folder Structure & Adivaha API Integration Guide

Yeh document **FlyAnyTrip 3.0** (Frontend + Backend) ka complete reference, folder breakdown, Adivaha API integration mapping, aur feature-wise technical roadmap hai.

---

## 📌 1. Project Overview & Tech Stack 

| Module | Technology Stack | Description |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL | RESTful API server handling flights, hotels, bookings, payments, and external integrations. |
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide Icons | Responsive SPA rendering flight/hotel search, booking engine, seat maps, profile management, and invoices. |
| **Third-Party API** | Adivaha API (Travel API Provider) | Provides live GDS/LCC flight inventory, seat maps, fare rules, hotel search, room rates, and booking creation. |
| **Database** | PostgreSQL (managed via Prisma) | Stores users, travellers, flight bookings, hotel bookings, coupons, payment transactions, and audit logs. |

---

## 📂 2. Folder Structure Breakdown (Detailed)

```
ANYTRIP 3.0/
├── 📁 flyanytrip-backend/      # Node.js Express REST API Server
└── 📁 flyanytrip-frontend/     # React + Vite UI Single Page Application
```

---

### 🟢 A. Backend Folder Structure (`flyanytrip-backend/`)

```
flyanytrip-backend/
├── 📄 server.js                   # Main application entry point (Express app initialization & port listening)
├── 📄 .env                        # Environment variables (DB credentials, JWT secrets, Adivaha API keys)
├── 📄 package.json                # Backend dependencies (express, @prisma/client, axios, dotenv, nodemailer, etc.)
├── 📄 test_adivaha.js             # Utility script to test live Adivaha API responses
│
├── 📁 config/                     # Configuration files
│   └── prisma.js                  # Shared Prisma client database instance
│
├── 📁 prisma/                     # Database Schema & Migrations
│   ├── schema.prisma              # Database models (User, Booking, FlightBooking, HotelBooking, Traveller, Coupon, etc.)
│   └── migrations/                # Database migration history
│
├── 📁 integrations/               # External Third-Party API Integrations
│   └── 📁 adivaha/
│       ├── adivaha.service.js       # Core Adivaha API Flight Integration (Search, Fare Rules, Seat Map, Book, Ticket)
│       └── adivaha.hotel.service.js # Core Adivaha API Hotel Integration (Search, Details, Room Availability, Book)
│
├── 📁 controllers/                # Request Handlers (Business Logic triggers)
│   ├── flight.controller.js       # Flight search, fare rules, seat maps, revalidate API calls
│   ├── hotel.controller.js        # Hotel search, details, room availability, cancellation policy
│   ├── booking.controller.js      # Booking flow orchestrator (Flight & Hotel booking creation, status update)
│   ├── flightBooking.controller.js# Specific flight booking retrieval and management
│   ├── payment.controller.js      # Payment gateway handling (Razorpay / Stripe integration triggers)
│   ├── coupon.controller.js       # Discount coupons apply & validation
│   ├── traveller.controller.js    # Co-travellers management (CRUD for saved passengers)
│   ├── user.controller.js         # User profile update & authentication logic
│   └── userStats.controller.js    # Dashboard analytics and user stats
│
├── 📁 routes/                     # Express Router Endpoint Mappings
│   ├── flight.routes.js           # Endpoint: /api/flights/*
│   ├── hotel.routes.js            # Endpoint: /api/hotels/*
│   ├── booking.routes.js          # Endpoint: /api/bookings/*
│   ├── payment.routes.js          # Endpoint: /api/payments/*
│   ├── coupon.routes.js           # Endpoint: /api/coupons/*
│   ├── travellers.routes.js       # Endpoint: /api/travellers/*
│   └── users.routes.js            # Endpoint: /api/users/*
│
├── 📁 services/                   # Application Services & Micro-utilities
│   ├── email.service.js           # Automatic email confirmations with tickets/vouchers
│   ├── pdf.service.js             # PDF ticket and invoice generation service (puppeteer/pdfkit)
│   ├── booking.service.js         # Centralized booking database persistence
│   ├── user.service.js            # User management operations
│   └── traveller.service.js       # Traveller persistence helper
│
├── 📁 middlewares/                # Custom Express Middlewares
│   └── auth.middleware.js         # JWT Token verification & Role-based authentication
│
└── 📁 utils/                      # Helper Functions
    ├── logger.js                  # Logging utility
    └── apiResponse.js             # Standardized API JSON response formatter
```

---

### 🔵 B. Frontend Folder Structure (`flyanytrip-frontend/`)

```
flyanytrip-frontend/
├── 📄 index.html                  # HTML template entry
├── 📄 vite.config.js              # Vite build configuration & server port settings
├── 📄 tailwind.config.js          # Custom theme, colors, and layout tokens
├── 📄 package.json                # Frontend packages (React, React Router, Lucide Icons, Axios, etc.)
│
└── 📁 src/                        # Source Application Code
    ├── 📄 main.jsx                # React DOM render entry point
    ├── 📄 App.jsx                 # Main application component & Provider wrapper
    ├── 📄 index.css               # Global styles, Tailwind directives, font imports
    │
    ├── 📁 routes/                 # Routing Config
    │   └── AppRoutes.jsx          # React Router route definitions for all pages
    │
    ├── 📁 services/               # API Service Layer
    │   └── api.js                 # Axios instance configured with baseURL and Auth Interceptors
    │
    ├── 📁 context/                # React Context State Management
    │   ├── AuthContext.jsx        # Auth state (User login, logout, token persistence)
    │   └── FlightContext.jsx      # Flight search state, filters, selected flight data
    │
    ├── 📁 features/               # Modular Feature Components
    │   ├── 📁 flights/            # Flight UI components
    │   │   ├── FlightSearch.jsx   # Search widget (Origin, Destination, Dates, Passengers, Cabin class)
    │   │   ├── FlightFilters.jsx  # Price range, Stops, Airlines, Departure time filters
    │   │   ├── FlightSortBar.jsx  # Sorting by Price, Duration, Departure, Arrival
    │   │   ├── FlightModals.jsx   # Baggage rules, Fare details, Cancellation policy modals
    │   │   └── FlightDetailsTabs.jsx # Itinerary breakdown tabs
    │   │
    │   ├── 📁 hotels/             # Hotel UI components
    │   │   └── HotelSearch.jsx    # Hotel destination search bar, check-in/out dates, guest count
    │   │
    │   ├── 📁 tours/              # Tour Package Search & Listing
    │   └── 📁 visa/               # Visa Service Components
    │
    └── 📁 pages/                  # Page Level Screens
        ├── 📄 Home.jsx            # Landing page hero, search widgets, offers, popular routes
        ├── 📄 FlightHome.jsx      # Main Flights section entry
        ├── 📄 SearchResults.jsx   # Flight search result listing page
        ├── 📄 CheckoutPage.jsx    # Flight checkout (Passenger details, Addons, Seat selection, Fare review)
        ├── 📄 SeatSelection.jsx   # Interactive airplane seat layout selector
        ├── 📄 PreConfirmationPage.jsx # Pre-payment review summary
        ├── 📄 Payment.jsx         # Payment processing screen
        ├── 📄 BookingSuccess.jsx # Flight booking confirmed screen with PDF download link
        ├── 📄 BookingFailed.jsx  # Booking failure notification screen
        │
        ├── 📄 HotelHome.jsx       # Hotels section entry
        ├── 📄 HotelSearchResults.jsx # Hotel search results page with filters
        ├── 📄 HotelDetails.jsx    # Hotel gallery, amenity list, room rates selection
        ├── 📄 HotelCheckout.jsx   # Guest details & booking overview
        ├── 📄 HotelPayment.jsx    # Hotel payment gateway interface
        ├── 📄 HotelBookingSuccess.jsx # Hotel booking voucher confirmation
        │
        ├── 📄 MyProfile.jsx       # User profile details
        ├── 📄 MyBookings.jsx      # Historical flight & hotel booking list
        ├── 📄 CoTravellers.jsx    # Manage saved frequent flyers / passengers
        ├── 📄 Wallet.jsx          # User wallet balances and transaction history
        ├── 📄 TourDetails.jsx     # Tour package details page
        └── 📄 VisaServices.jsx    # Visa application assistance page
```

---

## 🔌 3. Adivaha API Integration Mapping (Kahan Par Kaise Integrated Hai)

Adivaha API integration is encapsulated in `flyanytrip-backend/integrations/adivaha/`. Backend acts as a secure proxy between Frontend and Adivaha servers.

```
[ Frontend React App ]
         │ (HTTP REST Requests)
         ▼
[ Backend Express Controllers ] (flight.controller.js / hotel.controller.js)
         │
         ▼
[ Adivaha Integration Services ] (adivaha.service.js / adivaha.hotel.service.js)
         │ (Axios API calls with Auth Credentials)
         ▼
[ External Adivaha API Endpoints ]
```

---

### 🛫 Adivaha Flight API Integration (`adivaha.service.js`)

| Action / Operation | Backend Function | Adivaha API Endpoint Called | Controller Method |
| :--- | :--- | :--- | :--- |
| **Search Flights** | `searchFlights(params)` | `POST /search/flights` or GET API endpoint | `flight.controller.js -> searchFlights` |
| **Check Fare Rules** | `getFareRules(params)` | `POST /flight/farerules` | `flight.controller.js -> getFareRules` |
| **Seat Map Layout** | `getSeatMap(params)` | `POST /flight/seatmap` | `flight.controller.js -> getSeatMap` |
| **Revalidate Fare** | `revalidateFare(params)` | `POST /flight/revalidate` | `flight.controller.js -> revalidateFlight` |
| **Book Flight (PMR)**| `bookFlight(bookingData)` | `POST /flight/book` | `booking.controller.js -> createFlightBooking` |
| **Ticket Issuance** | `issueTicket(pnr)` | `POST /flight/ticket` | `booking.controller.js -> confirmBooking` |

---

### 🏨 Adivaha Hotel API Integration (`adivaha.hotel.service.js`)

| Action / Operation | Backend Function | Adivaha API Endpoint Called | Controller Method |
| :--- | :--- | :--- | :--- |
| **Search Hotels** | `searchHotels(params)` | `POST /hotel/search` | `hotel.controller.js -> searchHotels` |
| **Hotel Details** | `getHotelDetails(id)` | `POST /hotel/details` | `hotel.controller.js -> getHotelDetails` |
| **Room Availability** | `getRoomRates(params)` | `POST /hotel/rooms` | `hotel.controller.js -> getRoomRates` |
| **Cancellation Policy**| `getCancellationPolicy(params)`| `POST /hotel/cancellation-policy` | `hotel.controller.js -> getCancellationPolicy` |
| **Book Hotel Room** | `bookHotel(bookingData)` | `POST /hotel/book` | `hotel.controller.js -> createHotelBooking` |

---

## 🧭 4. Complete User Journey Roadmap & Feature Mapping

### ✈️ A. Flight Booking Lifecycle

```
[ FlightHome.jsx / SearchWidget ]
             │ (User selects Origin, Destination, Date, Passengers)
             ▼
[ SearchResults.jsx ] ── (Calls GET /api/flights/search) ──> [ flight.controller.js ] ──> [ adivaha.service.js ]
             │
             ▼ (User selects a flight option)
[ CheckoutPage.jsx ] ── (Passenger Info + Saved Co-Travellers)
             │
             ├──> [ SeatSelection.jsx ] (Calls GET /api/flights/seatmap)
             │
             ▼
[ PreConfirmationPage.jsx ] ── (Review Fare & Applied Coupon)
             │
             ▼
[ Payment.jsx ] ── (Initiates Payment via /api/payments)
             │
             ▼
[ BookingSuccess.jsx ] ── (Calls /api/bookings/flight/confirm)
                                    │
                                    ├──> Generates PNR via Adivaha API
                                    ├──> Saves Booking Record in DB (Prisma)
                                    ├──> Generates PDF Ticket via pdf.service.js
                                    └──> Sends Email Voucher via email.service.js
```

---

### 🏨 B. Hotel Booking Lifecycle

```
[ HotelHome.jsx ] ── (Destination City, Dates, Guests)
             │
             ▼
[ HotelSearchResults.jsx ] ── (Filter by Price, Star rating, Amenities)
             │
             ▼
[ HotelDetails.jsx ] ── (View Rooms, Select Rate Plan, Check Cancellation Rules)
             │
             ▼
[ HotelCheckout.jsx ] ── (Guest details entry & Coupon application)
             │
             ▼
[ HotelPayment.jsx ] ── (Process Payment)
             │
             ▼
[ HotelBookingSuccess.jsx ] ── (Receives Booking Voucher PDF & Confirmation Email)
```

---

### 👤 C. User Profile, Co-Travellers & Management

* **User Auth & State**: Handled via `AuthContext.jsx`, routes protected by `auth.middleware.js`.
* **Co-Travellers (`CoTravellers.jsx`)**: Saved frequent flyers list linked to `User` in Prisma DB. Allows 1-click autofill during flight checkout.
* **My Bookings (`MyBookings.jsx`)**: Fetches all past and upcoming flight/hotel bookings with status (`PENDING`, `CONFIRMED`, `CANCELLED`).

---

## 🗄️ 5. Key Database Models (`prisma/schema.prisma`)

* **User**: `id`, `name`, `email`, `phone`, `password`, `role`, `createdAt`
* **Traveller**: `id`, `userId`, `firstName`, `lastName`, `dob`, `gender`, `passportNo`
* **Booking**: `id`, `userId`, `bookingType` (FLIGHT/HOTEL), `status`, `totalAmount`, `paymentStatus`
* **FlightBooking**: `id`, `bookingId`, `pnr`, `airlineCode`, `flightNumber`, `origin`, `destination`, `departureTime`, `arrivalTime`, `seatInfo`
* **HotelBooking**: `id`, `bookingId`, `hotelId`, `hotelName`, `checkIn`, `checkOut`, `roomType`, `guestCount`
* **Coupon**: `id`, `code`, `discountType`, `discountValue`, `minOrderValue`, `expiresAt`

---

## 🛠️ 6. Quick Start & Execution Commands

### 1. Backend Setup
```bash
cd flyanytrip-backend
npm install
# Set environment variables in .env (DB URL, ADIVAHA keys)
npx prisma db push
npm run dev
```

### 2. Frontend Setup
```bash
cd flyanytrip-frontend
npm install
npm run dev
```

---
*Generated for FlyAnyTrip 3.0 Architecture Documentation.*

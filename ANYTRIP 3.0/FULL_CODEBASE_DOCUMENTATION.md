# 📘 ANYTRIP 3.0 - Complete Codebase Architecture & System Documentation

This document provides a comprehensive technical breakdown of **ANYTRIP 3.0** (Frontend + Backend), covering project architecture, folder structures, database schema, API routing, Adivaha integration, and page-by-page workflows.

---

## 📌 1. Tech Stack Overview

| Tier | Component | Technology | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | UI Framework | **React 18 + Vite 6** | High-performance Single Page Application (SPA) with lazy loading and dynamic routing. |
| | Styling | **Tailwind CSS + Framer Motion** | Custom responsive UI tokens, animations, and micro-interactions. |
| | Icons & Utilities | **Lucide React, Date-fns** | Icon library and date handling. |
| **Backend** | Server Runtime | **Node.js + Express 5** | RESTful API server supporting CORS, rate limiting, and security headers via Helmet. |
| | Database & ORM | **PostgreSQL + Prisma ORM 7** | Relational data persistence for users, bookings, passenger data, and audit logs. |
| | PDF & Email | **Pdfmake + Nodemailer** | Electronic ticket generation and automated email voucher dispatch. |
| **API Provider** | Travel Engine | **Adivaha API Integration** | GDS & LCC Flight search, seat layout maps, fare revalidation, PNR creation, and Hotel search/room rate engines. |

---

## 📂 2. Full Directory Breakdown (`ANYTRIP 3.0`)

```
ANYTRIP 3.0/
├── 📄 PROJECT_ARCHITECTURE_AND_ROADMAP.md # System architecture summary
├── 📄 FULL_CODEBASE_DOCUMENTATION.md      # Full detailed technical manual
│
├── 📁 flyanytrip-backend/                 # Node.js / Express / Prisma API Backend
│   ├── 📄 server.js                       # Express app entry point, CORS & routing
│   ├── 📄 package.json                    # Backend dependencies & Prisma scripts
│   ├── 📄 vercel.json                     # Serverless Vercel deployment config
│   ├── 📄 .env                            # Environment variables (DB URL, API Keys)
│   ├── 📄 .env.example                    # Sample environment template
│   │
│   ├── 📁 config/                         # System Configurations
│   │   └── prisma.js                      # Shared Prisma Client instance
│   │
│   ├── 📁 prisma/                         # Database ORM Schema & Migrations
│   │   ├── schema.prisma                  # PostgreSQL schema definitions
│   │   └── migrations/                    # SQL migration history
│   │
│   ├── 📁 routes/                         # Express Route Definitions
│   │   ├── flight.routes.js               # /api/flights/* (Search, Fare rules, Seatmaps)
│   │   ├── hotel.routes.js                # /api/hotels/* (Search, Details, Rooms)
│   │   ├── booking.routes.js              # /api/booking/* (Create & confirm flight/hotel bookings)
│   │   ├── payment.routes.js              # /api/payment/* (Razorpay gateway triggers)
│   │   ├── coupon.routes.js               # /api/coupons/* (Apply & validate promo codes)
│   │   ├── users.routes.js                # /api/v2/users/* (Prisma user profile routes)
│   │   ├── travellers.routes.js           # /api/v2/travellers/* (Saved passengers CRUD)
│   │   ├── bookings.routes.js             # /api/v2/bookings/* (User booking history)
│   │   ├── flightBookings.routes.js       # /api/v2/flight-bookings/* (Flight booking details)
│   │   └── userStats.routes.js            # /api/v2/user-stats/* (Loyalty & statistics)
│   │
│   ├── 📁 controllers/                    # Business Logic Controllers
│   │   ├── flight.controller.js           # Flight search, revalidation, seatmaps
│   │   ├── hotel.controller.js            # Hotel search, details, room cancellation policy
│   │   ├── booking.controller.js          # Booking orchestration & PNR generation
│   │   ├── flightBooking.controller.js    # Specific flight booking query handlers
│   │   ├── payment.controller.js          # Payment transaction processing
│   │   ├── coupon.controller.js           # Coupon code verification
│   │   ├── traveller.controller.js        # Co-traveller profile management
│   │   ├── user.controller.js             # Auth & user account management
│   │   └── userStats.controller.js        # Analytics calculation handlers
│   │
│   ├── 📁 integrations/                   # Third-Party API Proxies
│   │   └── 📁 adivaha/
│   │       ├── adivaha.service.js         # Flight GDS/LCC API client
│   │       └── adivaha.hotel.service.js   # Hotel Search & Room booking client
│   │
│   ├── 📁 services/                       # Infrastructure Services
│   │   ├── email.service.js               # Nodemailer HTML ticket emails
│   │   ├── pdf.service.js                 # Pdfmake ticket document generator
│   │   ├── booking.service.js             # DB Booking record persistence helper
│   │   ├── user.service.js                # User DB helper methods
│   │   └── traveller.service.js           # Passenger DB helper methods
│   │
│   ├── 📁 middlewares/                    # Express Middlewares
│   │   └── auth.middleware.js             # JWT verification & role authorization
│   │
│   └── 📁 utils/                          # Common Helper Utilities
│       ├── apiResponse.js                 # Standardized JSON response envelope
│       └── logger.js                      # Application logging utility
│
└── 📁 flyanytrip-frontend/                # React 18 / Vite SPA Frontend
    ├── 📄 index.html                      # DOM root container & HTML head metadata
    ├── 📄 vite.config.js                  # Vite server & proxy configuration
    ├── 📄 tailwind.config.js              # Design system colors, fonts, tokens
    ├── 📄 package.json                    # Frontend dependencies & scripts
    ├── 📄 vercel.json                     # Frontend SPA rewrite rules for Vercel
    │
    └── 📁 src/                            # Source React Codebase
        ├── 📄 main.jsx                    # React root render initialization
        ├── 📄 App.jsx                     # Top-level providers wrapper
        ├── 📄 index.css                   # Global styles & Tailwind directives
        │
        ├── 📁 routes/                     # React Router Architecture
        │   └── AppRoutes.jsx              # Lazy-loaded route map & ScrollToTop reset
        │
        ├── 📁 services/                   # Frontend API Layer
        │   └── api.js                     # Axios instance configured with `VITE_API_URL`
        │
        ├── 📁 context/                    # React Context Global State
        │   ├── AuthContext.jsx            # Authentication state, login token & profile
        │   └── FlightContext.jsx          # Flight search criteria & selection state
        │
        ├── 📁 features/                   # Component Feature Modules
        │   ├── 📁 flights/                # Flight Search, Filters, SortBar, Modals
        │   ├── 📁 hotels/                 # Hotel Search Bar & Filters
        │   ├── 📁 tours/                  # Tour search cards
        │   └── 📁 visa/                   # Visa application components
        │
        └── 📁 pages/                      # Application Page Components (50+ Pages)
            ├── Home.jsx                   # Main Landing Page
            ├── FlightHome.jsx             # Flights portal entry
            ├── SearchResults.jsx          # Flight Search results listing page
            ├── CheckoutPage.jsx           # Flight passenger details & add-ons
            ├── SeatSelection.jsx          # Interactive seat map layout picker
            ├── PreConfirmationPage.jsx    # Pre-payment review summary
            ├── Payment.jsx                # Flight Payment processing page
            ├── BookingSuccess.jsx         # Flight booking confirmation & ticket download
            ├── BookingFailed.jsx          # Flight booking failure view
            │
            ├── HotelHome.jsx              # Hotels portal entry
            ├── HotelSearchResults.jsx     # Hotel listings & price filters
            ├── HotelDetails.jsx           # Hotel photos, amenities & room selector
            ├── HotelCheckout.jsx          # Hotel guest details form
            ├── HotelPayment.jsx           # Hotel payment processing
            ├── HotelBookingSuccess.jsx    # Hotel confirmation voucher page
            │
            ├── MyProfile.jsx              # User account settings
            ├── MyBookings.jsx             # User flight & hotel booking history
            ├── CoTravellers.jsx           # Frequent flyers management page
            └── Wallet.jsx                 # User balance & transactions
```

---

## 🗄️ 3. Database Schema Architecture (`prisma/schema.prisma`)

The database uses PostgreSQL managed via Prisma ORM with driver adapter support.

```mermaid
erDiagram
    users ||--o{ bookings : "makes"
    users ||--o{ co_travellers : "saves"
    users ||--o{ travellers : "manages"
    users ||--o| user_stats : "has"

    bookings ||--o| flight_bookings : "contains"
    bookings ||--o| hotel_bookings : "contains"

    flight_bookings ||--o{ flight_booking_passengers : "includes"
```

### Key Prisma Models:

1. **`users`**: Customer profiles containing `email`, `phone`, `first_name`, `last_name`, `password_hash`, and `user_type` (`B2C`/`B2B`).
2. **`bookings`**: Parent transaction record storing `booking_id`, `booking_type` (`FLIGHT`/`HOTEL`), `status` (`PENDING`, `CONFIRMED`, `CANCELLED`), `total_amount`, and `currency`.
3. **`flight_bookings`**: Flight itinerary metadata storing `pnr`, `provider_order_id`, `airline_code`, `flight_number`, `origin_airport`, `destination_airport`, `departure_date`, and `offered_fare`.
4. **`flight_booking_passengers`**: Detailed passenger records per flight storing `pax_index`, `first_name`, `last_name`, `passport_no`, `seat_number`, `meal_name`, and `baggage_weight`.
5. **`hotel_bookings`**: Hotel stay records storing `hotel_id`, `hotel_name`, `check_in`, `check_out`, `rooms`, `adults`, `children`, `rate_key`, and `provider_reference`.
6. **`co_travellers` / `travellers`**: Saved frequent flyer profiles used for single-click checkout autofill.
7. **`user_stats`**: User analytics tracking total flights, distance traveled (`total_distance_km`), total spend, and loyalty tier (`BRONZE`, `SILVER`, `GOLD`).

---

## 🔌 4. API & Adivaha Integration Matrix

The backend serves as a secure proxy between the React frontend and Adivaha Travel APIs.

```
[ React SPA Frontend ]
         │ (HTTP REST / Axios)
         ▼
[ Express API Controllers ] (flight.controller.js / hotel.controller.js)
         │
         ▼
[ Adivaha Integration Layer ] (adivaha.service.js / adivaha.hotel.service.js)
         │ (Authenticated Axios API Requests)
         ▼
[ Adivaha Travel GDS Services ]
```

### Flight API Endpoints

| Operation | Backend Endpoint | Controller Method | Adivaha Integration Call |
| :--- | :--- | :--- | :--- |
| **Search Flights** | `GET /api/flights/search` | `flight.controller.js -> searchFlights` | `adivaha.service.js -> searchFlights` |
| **Fare Rules** | `POST /api/flights/farerules` | `flight.controller.js -> getFareRules` | `adivaha.service.js -> getFareRules` |
| **Seat Map Layout** | `POST /api/flights/seatmap` | `flight.controller.js -> getSeatMap` | `adivaha.service.js -> getSeatMap` |
| **Revalidate Fare** | `POST /api/flights/revalidate` | `flight.controller.js -> revalidateFlight` | `adivaha.service.js -> revalidateFare` |
| **Create Flight Booking**| `POST /api/booking/flight` | `booking.controller.js -> createFlightBooking` | `adivaha.service.js -> bookFlight` |
| **Issue Ticket** | `POST /api/booking/confirm` | `booking.controller.js -> confirmBooking` | `adivaha.service.js -> issueTicket` |

### Hotel API Endpoints

| Operation | Backend Endpoint | Controller Method | Adivaha Integration Call |
| :--- | :--- | :--- | :--- |
| **Search Hotels** | `GET /api/hotels/search` | `hotel.controller.js -> searchHotels` | `adivaha.hotel.service.js -> searchHotels` |
| **Hotel Details** | `GET /api/hotels/:id` | `hotel.controller.js -> getHotelDetails` | `adivaha.hotel.service.js -> getHotelDetails` |
| **Room Rates** | `POST /api/hotels/rooms` | `hotel.controller.js -> getRoomRates` | `adivaha.hotel.service.js -> getRoomRates` |
| **Cancellation Policy**| `POST /api/hotels/cancellation` | `hotel.controller.js -> getCancellationPolicy` | `adivaha.hotel.service.js -> getCancellationPolicy` |
| **Book Hotel** | `POST /api/hotels/book` | `hotel.controller.js -> createHotelBooking` | `adivaha.hotel.service.js -> bookHotel` |

---

## 🗺️ 5. Complete Frontend Routes & Navigation Map

All routes in `AppRoutes.jsx` are dynamically loaded using `React.lazy()` for maximum speed and optimal bundle splitting.

### Flight Lifecycle Routes
* **`/flights`**: Flight booking landing page (`FlightHome.jsx`).
* **`/results` / `/flights/search`**: Search results with live filters and sorting (`SearchResults.jsx`).
* **`/flight-details`**: Detailed itinerary breakdown (`FlightDetails.jsx`).
* **`/checkout`**: Passenger information input & add-on selection (`CheckoutPage.jsx`).
* **`/seat-selection`**: Interactive seat map visual selector (`SeatSelection.jsx`).
* **`/pre-confirmation`**: Pre-payment order review (`PreConfirmationPage.jsx`).
* **`/payment`**: Payment processing screen (`Payment.jsx`).
* **`/booking-success`**: Ticket confirmation & PDF invoice download (`BookingSuccess.jsx`).
* **`/manage-booking`**: Retrieve existing booking by PNR/ID (`ManageBooking.jsx`).

### Hotel Lifecycle Routes
* **`/hotels`**: Hotel portal landing screen (`HotelHome.jsx`).
* **`/hotels/search`**: Hotel search results with amenity filters (`HotelSearchResults.jsx`).
* **`/hotels/:hotelId`**: Hotel details, image gallery & room selection (`HotelDetails.jsx`).
* **`/hotel-checkout`**: Guest detail entry form (`HotelCheckout.jsx`).
* **`/hotel-payment`**: Payment gateway interface (`HotelPayment.jsx`).
* **`/hotel-booking-success`**: Hotel voucher confirmation (`HotelBookingSuccess.jsx`).

### User Account & Dashboard Routes
* **`/profile` / `/dashboard/profile`**: User account profile page (`MyProfile.jsx`).
* **`/my-bookings` / `/dashboard/bookings`**: History of flight and hotel bookings (`MyBookings.jsx`).
* **`/dashboard/co-travellers`**: Saved frequent flyer profiles manager (`CoTravellers.jsx`).
* **`/dashboard/notifications`**: User alert center (`Notifications.jsx`).
* **`/dashboard/support`**: Helpdesk ticket history (`SupportTickets.jsx`).
* **`/dashboard/settings`**: Profile preference settings (`Settings.jsx`).

---

## ⚙️ 6. Environment & Quickstart Setup

### Backend `.env` Configuration
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/flyanytrip?schema=public"
JWT_SECRET="your_jwt_secret_key"
ADIVAHA_AUTH_KEY="your_adivaha_key"
ADIVAHA_API_URL="https://api.adivaha.com/v2"
FRONTEND_URL="http://localhost:5173"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="notifications@flyanytrip.com"
SMTP_PASS="your_smtp_password"
```

### Frontend `.env` Configuration
```env
VITE_API_URL="http://localhost:5000"
```

### Local Execution Commands

1. **Start Backend Server:**
   ```bash
   cd ANYTRIP\ 3.0/flyanytrip-backend
   npm install
   npx prisma db push
   npm run dev
   ```

2. **Start Frontend Client:**
   ```bash
   cd ANYTRIP\ 3.0/flyanytrip-frontend
   npm install
   npm run dev
   ```

---
*Documentation compiled for ANYTRIP 3.0 Architecture Reference.*

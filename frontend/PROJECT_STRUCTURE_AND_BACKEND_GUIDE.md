# 🚀 FlyAnyTrip UI - Project Reorganization & Backend Integration Guide

This document outlines the reorganized codebase structure, asset classification, removed files, and instructions for connecting backend APIs.

---

## 📁 New Project Folder Structure

All source files are cleanly organized under `src/`:

```
src/
├── assets/
│   ├── hero/                 # Hero section banners & wave overlays
│   ├── home/                 # Home page specific section icons & cards
│   ├── flights/              # Airline icons, flight summary & search SVGs
│   ├── hotels/               # Hotel room photos, payment logos, hotel SVGs
│   ├── holidays/             # Holiday background & package graphics
│   ├── icons/                # Shared vector icons
│   └── common/               # Main site logos, trust badges, payment icons
│
├── components/
│   ├── common/               # Shared site layout & header/footer components
│   │   ├── Navbar.jsx
│   │   ├── TopBar.jsx
│   │   ├── Footer.jsx
│   │   ├── FeatureStrip.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── Icons.jsx
│   │   └── TrustBar.jsx
│   │
│   ├── hero/                 # Hero section & primary search selector
│   │   └── HeroSection.jsx
│   │
│   ├── home/                 # Main landing page components
│   │   ├── PopularDestinations.jsx
│   │   ├── PopularFlightRoutes.jsx
│   │   ├── TopHotelDeals.jsx
│   │   ├── WhyChooseUs.jsx
│   │   ├── Testimonials.jsx
│   │   ├── FAQSection.jsx
│   │   └── AppDownloadBanner.jsx
│   │
│   ├── flights/              # Flight search, booking & checkout flow
│   │   ├── BookingCard.jsx
│   │   ├── BookingConfirmation.jsx
│   │   ├── BookingInfo.jsx
│   │   ├── BookingPage.jsx
│   │   ├── BookingPayment.jsx
│   │   ├── BookingPersonalize.jsx
│   │   ├── BookingSeat.jsx
│   │   ├── BookingSteps.jsx
│   │   ├── BookingSummary.jsx
│   │   ├── FareSummary.jsx
│   │   └── result/           # Flight search results module
│   │       ├── ResultPage.jsx
│   │       └── components/   # Filters, Fare Calendar, Flight Cards
│   │
│   ├── hotels/               # Hotel booking module
│   │   ├── HotelBookingSection.jsx
│   │   ├── HotelCard.jsx
│   │   ├── HotelRoomSelection.jsx
│   │   ├── HotelPersonalize.jsx
│   │   ├── HotelPaymentStep.jsx
│   │   ├── HotelPaymentOptions.jsx
│   │   └── HotelConfirmationPage.jsx
│   │
│   └── holidays/             # Holiday packages module
│       └── HolidayBookingCard.jsx
│
├── data/                     # Mock data files (ready to replace with APIs)
│   ├── destinations.js
│   ├── faq.js
│   ├── flights.js
│   ├── hotels.js
│   ├── packages.js
│   └── testimonials.js
│
├── pages/                    # Main route container pages
│   ├── Home.jsx              # Route: /
│   ├── HotelsPage.jsx        # Route: /hotels
│   └── HolidaysPage.jsx      # Route: /holidays
│
├── services/                 # 🔌 API Integration Services
│   ├── api.js                # Central fetch client
│   ├── flightService.js      # Flight endpoints
│   └── hotelService.js       # Hotel endpoints
│
├── App.jsx                   # Central React Router definition
├── main.jsx                  # Application entry point
└── index.css                 # Global styles & Tailwind configuration
```

---

## 🗑️ List of Removed / Cleaned Files & Folders

The following redundant design dumps and duplicate files were cleaned up:

1. **`flight section/`** (Root directory) - ❌ *Deleted* (12 raw export SVGs, unused in code).
2. **`New folder/`** (Root directory) - ❌ *Deleted* (13 raw Figma design exports).
3. **`Holiday/`** (Root directory) - ❌ *Deleted* (Relocated code to `src/components/holidays/` and `src/pages/HolidaysPage.jsx`).
4. **`src/book now hotel/`** - ❌ *Deleted* (Misnamed space folder; all 38 room photos & payment logos moved to `src/assets/hotels/`).
5. **`src/pages/HolidayPage.jsx`** - ❌ *Deleted* (Duplicate of `Home.jsx`).

---

## 🔌 How to Integrate Backend APIs

API calls are now centralized in `src/services/`.

### 1. Environment Variable Setup
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=https://api.flyanytrip.com/v1
```

### 2. Calling APIs in Components
Import services from `src/services/`:

```javascript
import { useEffect, useState } from 'react';
import { hotelService } from '../services/hotelService';

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    hotelService.searchHotels({ destination: 'Goa' })
      .then(data => setHotels(data))
      .catch(err => console.error(err));
  }, []);
};
```

---

## ✅ Verification
The project has been compiled with `npm run build` and tested successfully with zero errors!

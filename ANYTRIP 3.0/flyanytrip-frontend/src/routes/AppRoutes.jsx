import React, { Suspense, useEffect, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Plane, Building2 } from 'lucide-react';

// ── ScrollToTop ─────────────────────────────────────────────────────
// Scrolls to top on every route change so the user always starts at
// the top of the new page (prevents the "footer flash" issue).
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// ── Route-level loading fallback ─────────────────────────────────────
// Shown while a lazy-loaded page chunk is downloading. Provides clear
// visual feedback instead of a blank/frozen screen.
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-gray-50">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 rounded-2xl bg-brand-red/10 flex items-center justify-center"
    >
      <Loader2 size={32} className="text-brand-red" />
    </motion.div>
    <div className="text-center">
      <p className="font-black text-brand-black text-lg tracking-tight">Loading</p>
      <p className="text-sm text-black/40 font-medium mt-1">Please wait a moment...</p>
    </div>
    <div className="flex items-center gap-2 mt-1">
      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-brand-red/60" />
      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-brand-red/60" />
      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-brand-red/60" />
    </div>
  </div>
);

// ── Lazy-loaded pages ────────────────────────────────────────────────
// Each page is loaded on-demand via React.lazy + dynamic import.
// This reduces the initial bundle size dramatically and makes route
// transitions show a loading indicator instead of a frozen screen.

// Core
const Home = lazy(() => import('../pages/Home'));
const FlightHome = lazy(() => import('../pages/FlightHome'));
const HotelHome = lazy(() => import('../pages/HotelHome'));
const TourHome = lazy(() => import('../pages/TourHome'));
const SearchResults = lazy(() => import('../pages/SearchResults'));
const TourDetails = lazy(() => import('../pages/TourDetails'));

// Hotel Flow
const HotelSearchResults = lazy(() => import('../pages/HotelSearchResults'));
const HotelDetails = lazy(() => import('../pages/HotelDetails'));
const HotelCheckout = lazy(() => import('../pages/HotelCheckout'));
const HotelPayment = lazy(() => import('../pages/HotelPayment'));
const HotelBookingSuccess = lazy(() => import('../pages/HotelBookingSuccess'));
const HotelBookingFailed = lazy(() => import('../pages/HotelBookingFailed'));

// Flight Flow
const FlightDetails = lazy(() => import('../pages/FlightDetails'));
const BookingReview = lazy(() => import('../pages/BookingReview'));
const TravellerDetails = lazy(() => import('../pages/TravellerDetails'));
const SeatSelection = lazy(() => import('../pages/SeatSelection'));
const Addons = lazy(() => import('../pages/Addons'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const PreConfirmationPage = lazy(() => import('../pages/PreConfirmationPage'));
const FinalBookingReview = lazy(() => import('../pages/FinalBookingReview'));
const Payment = lazy(() => import('../pages/Payment'));
const BookingSuccess = lazy(() => import('../pages/BookingSuccess'));
const BookingFailed = lazy(() => import('../pages/BookingFailed'));
const TicketConfirmation = lazy(() => import('../pages/TicketConfirmation'));
const ManageBooking = lazy(() => import('../pages/ManageBooking'));
const CheckIn = lazy(() => import('../pages/CheckIn'));
const FlightStatus = lazy(() => import('../pages/FlightStatus'));
const FareCalendar = lazy(() => import('../pages/FareCalendar'));

// Public Pages
const Offers = lazy(() => import('../pages/Offers'));
const PopularDestinations = lazy(() => import('../pages/PopularDestinations'));
const Blog = lazy(() => import('../pages/Blog'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Terms = lazy(() => import('../pages/Terms'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const RefundPolicy = lazy(() => import('../pages/RefundPolicy'));

// Auth Pages
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const OtpVerification = lazy(() => import('../pages/OtpVerification'));

// User Dashboard
const MyProfile = lazy(() => import('../pages/MyProfile'));
const MyBookings = lazy(() => import('../pages/MyBookings'));
const CoTravellers = lazy(() => import('../pages/CoTravellers'));
const Notifications = lazy(() => import('../pages/Notifications'));
const SupportTickets = lazy(() => import('../pages/SupportTickets'));
const Settings = lazy(() => import('../pages/Settings'));

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightHome />} />
          <Route path="/hotels" element={<HotelHome />} />
          <Route path="/tours" element={<TourHome />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/flights/search" element={<SearchResults />} />
          <Route path="/flights/:route" element={<SearchResults />} />
          <Route path="/tours/:id" element={<TourDetails />} />

          {/* Hotel Flow Routes */}
          <Route path="/hotels/search" element={<HotelSearchResults />} />
          <Route path="/hotels/:hotelId" element={<HotelDetails />} />
          <Route path="/hotel-checkout" element={<HotelCheckout />} />
          <Route path="/hotel-payment" element={<HotelPayment />} />
          <Route path="/hotel-booking-success" element={<HotelBookingSuccess />} />
          <Route path="/hotel-booking-failed" element={<HotelBookingFailed />} />

          {/* Flight Flow Routes */}
          <Route path="/flight-details" element={<FlightDetails />} />
          <Route path="/flight-review" element={<BookingReview />} />
          <Route path="/booking-review" element={<FinalBookingReview />} />
          <Route path="/traveller-details" element={<TravellerDetails />} />
          <Route path="/seat-selection" element={<SeatSelection />} />
          <Route path="/addons" element={<Addons />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/:route" element={<CheckoutPage />} />
          <Route path="/pre-confirmation" element={<PreConfirmationPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/booking-failed" element={<BookingFailed />} />
          <Route path="/ticket-confirmation" element={<TicketConfirmation />} />
          <Route path="/manage-booking" element={<ManageBooking />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/flight-status" element={<FlightStatus />} />
          <Route path="/fare-calendar" element={<FareCalendar />} />

          {/* Public Routes */}
          <Route path="/offers" element={<Offers />} />
          <Route path="/destinations" element={<PopularDestinations />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />

          {/* User Dashboard Routes */}
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/dashboard/profile" element={<MyProfile />} />
          <Route path="/dashboard/bookings" element={<MyBookings />} />
          <Route path="/dashboard/co-travellers" element={<CoTravellers />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route path="/dashboard/support" element={<SupportTickets />} />
          <Route path="/dashboard/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;

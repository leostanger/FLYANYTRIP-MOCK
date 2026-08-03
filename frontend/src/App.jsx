import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import Home from './pages/Home';
import HotelsPage from './pages/HotelsPage';
import HolidaysPage from './pages/HolidaysPage';
import FlightsResultPage from './components/flights/result/ResultPage';
import FlightBookingPage from './components/flights/BookingPage';
import MyBookings from './pages/MyBookings';
import Support from './pages/Support';
import AboutPage from './pages/AboutPage';
import ContactUs from './pages/ContactUs';
import RefundPolicy from './pages/RefundPolicy';
import CancelBooking from './pages/CancelBooking';
import PNRStatus from './pages/PNRStatus';
import Careers from './pages/Careers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Sitemap from './pages/Sitemap';

// Tour Packages
import ToursPackages from './common/Tour package/pages/ToursPackages';
import TourPackageDetail from './common/Tour package/pages/TourPackageDetail';
import ToursTravelerDetail from './common/Tour package/pages/ToursTravelerDetail';
import ToursPersonalize from './common/Tour package/pages/ToursPersonalize';
import ReviewBooking from './common/Tour package/pages/ReviewBooking';
import FinalizePayment from './common/Tour package/pages/FinalizePayment';
import TourConfirmation from './common/Tour package/pages/TourConfirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthModal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/holidays" element={<HolidaysPage />} />
          <Route path="/flights" element={<FlightsResultPage />} />
          <Route path="/flights/book" element={<FlightBookingPage />} />
          <Route path="/flights/booking" element={<FlightBookingPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cancel-booking" element={<CancelBooking />} />
          <Route path="/pnr-status" element={<PNRStatus />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/terms-of-use" element={<TermsAndConditions />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/sitemap" element={<Sitemap />} />

          {/* Tour Packages Routes */}
          <Route path="/tour-packages" element={<ToursPackages />} />
          <Route path="/tour-packages/:id" element={<TourPackageDetail />} />
          <Route path="/tour-packages/:id/book" element={<ToursTravelerDetail />} />
          <Route path="/tour-packages/:id/book/personalize" element={<ToursPersonalize />} />
          <Route path="/tour-packages/:id/book/review" element={<ReviewBooking />} />
          <Route path="/tour-packages/:id/book/payment" element={<FinalizePayment />} />
          <Route path="/tour-packages/:id/book/confirmation" element={<TourConfirmation />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

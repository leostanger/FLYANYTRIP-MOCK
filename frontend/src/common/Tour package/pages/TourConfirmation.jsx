import React, { useState, useEffect } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import { 
  Check, Copy, Download, Mail, Navigation, PhoneCall, Star, 
  ShieldCheck, Calendar, MapPin, Users, Coffee, Clock, 
  CreditCard, FileText, HelpCircle, ArrowRight, CheckCircle2, 
  AlertCircle, Luggage, HeartHandshake, ChevronDown, CheckCircle, Smartphone, Map, Plane
} from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.js'
import tajMahalBg from '../../../assets/images/taj-mahal.jpg'

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3.5 border-b border-gray-200/80 last:border-0 text-[13px] sm:text-[14px]">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="font-bold text-gray-900 text-right">{value}</span>
  </div>
)

const CardTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2.5 sm:gap-3 mb-5">
    <div className="w-7 h-7 bg-[#ef3535] text-white rounded-lg flex items-center justify-center shrink-0">
      <Icon size={14} strokeWidth={2.25} />
    </div>
    <h3 className="font-bold text-gray-900 text-base sm:text-[17px] tracking-tight">{title}</h3>
  </div>
)

export default function TourConfirmation() {
  const { id } = useParams()
  const location = useLocation()
  const foundPackage = packages.find(p => p.id === parseInt(id))

  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 3500)
  }

  const bookingData = {
    bookingId: location.state?.bookingId || `FAT-TOUR-${Math.floor(10000 + Math.random() * 90000)}X`,
    email: location.state?.contact?.email || location.state?.email || 'traveler@email.com',
    mobile: location.state?.contact?.mobile || location.state?.mobile || '9876543210',
    packageTitle: location.state?.packageTitle || foundPackage?.title || 'Amazing Kerala Backwaters & Hill Stations',
    location: foundPackage?.location || 'Munnar, Thekkady, Alleppey',
    duration: foundPackage?.duration || '5 Days / 4 Nights',
    departureDate: location.state?.departureDate || '20 Dec 2024',
    adults: location.state?.adults || 2,
    travelers: location.state?.travelers || [{ name: 'Primary Traveler', age: 28, gender: 'male' }],
    selectedMeal: location.state?.selectedMeal || { label: 'Standard Included Meal', price: 0 },
    selectedAddOns: location.state?.selectedAddOns || [],
    insuranceSelected: location.state?.insuranceSelected || false,
    finalTotal: location.state?.finalTotal || foundPackage?.price * 2 || 34998,
    paymentMethod: location.state?.paymentMethod ? location.state.paymentMethod.toUpperCase() : 'UPI / CREDIT CARD',
    txnId: `TXN-TOUR-${Date.now().toString().slice(-8)}`
  }

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingData.bookingId)
    setCopied(true)
    triggerToast('Booking ID copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <TopBar />
      <Navbar />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn text-sm font-medium">
          <CheckCircle2 size={18} className="text-green-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Banner Container */}
      <div className="w-full mx-auto px-4 lg:px-8 pt-6">
        <div className="w-full bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] rounded-[32px] relative overflow-hidden py-16 px-4 sm:px-8 shadow-sm">
          {/* Subtle background overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" 
            style={{ backgroundImage: `url(${foundPackage?.image || tajMahalBg})` }} 
          />
          
          <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center text-center">
            <div className="w-[75px] h-[75px] rounded-full border-2 border-white/40 flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.3352 16.6666C37.0963 20.4021 36.5539 24.2857 34.7982 27.6696C33.0426 31.0536 30.18 33.7334 26.6877 35.2622C23.1954 36.791 19.2845 37.0763 15.6073 36.0706C11.9301 35.0649 8.70882 32.829 6.48063 29.7357C4.25243 26.6424 3.15204 22.8787 3.36294 19.0723C3.57384 15.2659 5.0833 11.6468 7.63958 8.8186C10.1959 5.9904 13.6445 4.12403 17.4103 3.53074C21.1761 2.93744 25.0315 3.65308 28.3335 5.55832" stroke="white" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 18.3334L20 23.3334L36.6667 6.66675" stroke="white" strokeWidth="3.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="text-[32px] sm:text-4xl font-bold text-white tracking-tight mb-2">
              Tour Package Confirmed!
            </h1>
            <p className="text-purple-200 text-base sm:text-lg mb-8 font-medium">
              Get ready for an unforgettable journey!
            </p>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] px-6 py-4 sm:px-8 sm:py-5 flex items-center gap-6 mb-6 shadow-lg shadow-black/5">
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-purple-200 uppercase tracking-widest font-semibold mb-1">Booking Reference</span>
                <span className="text-white font-mono font-bold text-xl sm:text-2xl leading-tight tracking-wider">{bookingData.bookingId}</span>
              </div>
              <button 
                onClick={handleCopyBookingId}
                className="bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer ml-2 sm:ml-4"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-sm font-semibold">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-purple-200/80 text-sm">
              Confirmation sent to <span className="font-semibold text-white">{bookingData.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="w-full mx-auto px-4 lg:px-8 py-10 flex-grow flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column (Details Cards) */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          
          {/* Card 1: Package Details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <CardTitle icon={Map} title="Package Details" />
            <div className="flex flex-col">
              <InfoRow label="Package" value={bookingData.packageTitle} />
              <InfoRow label="Destinations" value={bookingData.location.replace(/, /g, ' → ')} />
              <InfoRow label="Duration" value={bookingData.duration.replace('N', ' Nights').replace('D', ' Days').replace('/', ' / ')} />
              <InfoRow label="Departure" value={`${bookingData.departureDate} (Friday) from New Delhi`} />
              <InfoRow label="Return" value="25 Dec 2024 (Wednesday) to New Delhi" />
              <InfoRow label="Theme" value={foundPackage?.category || "Heritage & Culture"} />
            </div>
          </div>

          {/* Card 2: Traveller Details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <CardTitle icon={Users} title="Traveller Details" />
            <div className="flex flex-col">
              <InfoRow label="Lead Traveller" value={bookingData.travelers[0]?.name || "Rahul Sharma"} />
              <InfoRow label="Group Size" value={`${bookingData.adults} Adults`} />
              <InfoRow label="Meal Preference" value={bookingData.selectedMeal?.label || "Vegetarian"} />
              <InfoRow label="Tour Guide" value="English-speaking expert guide" />
              <InfoRow label="Transport" value="Private AC Tempo Traveller" />
            </div>
          </div>

          {/* Card 3: Inclusions Confirmed */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <CardTitle icon={CheckCircle2} title="Inclusions Confirmed" />
            <div className="flex flex-col">
              <InfoRow label="Hotels" value="4-star hotels in all cities" />
              <InfoRow label="Meals" value="Daily breakfast included" />
              <InfoRow label="Sightseeing" value="All monument entries included" />
              <InfoRow label="Transport" value="All inter-city travel" />
              <InfoRow label="Guide" value="English speaking expert guide" />
            </div>
          </div>

          {/* Card 4: Payment Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <CardTitle icon={CreditCard} title="Payment Summary" />
            <div className="flex flex-col">
              <InfoRow label="Package Rate" value={`₹${((bookingData.finalTotal - (bookingData.finalTotal * 0.05)) / bookingData.adults).toFixed(0)} × ${bookingData.adults} travellers`} />
              <InfoRow label="GST (5%)" value={`₹${Math.round(bookingData.finalTotal * 0.05).toLocaleString('en-IN')}`} />
              <InfoRow label="Total Paid" value={`₹${bookingData.finalTotal.toLocaleString('en-IN')}`} />
              <InfoRow label="Payment Method" value={bookingData.paymentMethod} />
              <InfoRow label="Transaction ID" value={bookingData.txnId} />
            </div>
          </div>

          {/* Card 5: Refund Status */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            {/* Custom Title for Refund Status to match Figma exactly */}
            <div className="flex items-center gap-2 mb-6">
              <Clock size={16} className="text-gray-500" strokeWidth={2} />
              <h3 className="font-bold text-gray-900 text-base sm:text-[17px] tracking-tight">Refund Status (Post-Cancellation)</h3>
            </div>
            
            {/* Stepper */}
            <div className="flex items-start mb-8 -ml-2">
              {/* Step 1 */}
              <div className="flex flex-col items-center w-24">
                <div className="w-8 h-8 rounded-full bg-[#ef3535] text-white flex items-center justify-center shrink-0 z-10 text-xs shadow-sm mb-2">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-[11px] text-center font-medium text-gray-500 leading-tight">Cancellation<br/>Requested</span>
              </div>
              
              {/* Line 1 */}
              <div className="w-6 sm:w-10 h-[1.5px] bg-gray-200 mt-4 mx-1"></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center w-24">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shrink-0 z-10 text-[13px] font-semibold mb-2">
                  2
                </div>
                <span className="text-[11px] text-center font-medium text-gray-500 leading-tight">Provider<br/>Confirmation</span>
              </div>
              
              {/* Line 2 */}
              <div className="w-6 sm:w-10 h-[1.5px] bg-gray-200 mt-4 mx-1"></div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center w-24">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shrink-0 z-10 text-[13px] font-semibold mb-2">
                  3
                </div>
                <span className="text-[11px] text-center font-medium text-gray-500 leading-tight">Refund<br/>Initiated</span>
              </div>
              
              {/* Line 3 */}
              <div className="w-6 sm:w-10 h-[1.5px] bg-gray-200 mt-4 mx-1"></div>
              
              {/* Step 4 */}
              <div className="flex flex-col items-center w-24">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center shrink-0 z-10 text-[13px] font-semibold mb-2">
                  4
                </div>
                <span className="text-[11px] text-center font-medium text-gray-500 leading-tight">Refund<br/>Credited</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="border border-gray-300/80 rounded-[12px] p-3.5">
                <span className="block text-[11px] font-medium text-gray-400 mb-0.5">Refund Amount</span>
                <span className="block font-bold text-gray-900 text-[13px]">₹0 (not requested)</span>
              </div>
              <div className="border border-gray-300/80 rounded-[12px] p-3.5">
                <span className="block text-[11px] font-medium text-gray-400 mb-0.5">Refund to</span>
                <span className="block font-bold text-gray-900 text-[13px]">Original payment method</span>
              </div>
              <div className="border border-gray-300/80 rounded-[12px] p-3.5">
                <span className="block text-[11px] font-medium text-gray-400 mb-0.5">Expected by</span>
                <span className="block font-bold text-gray-900 text-[13px]">5-7 business days</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Actions & Sidebar) */}
        <div className="w-full lg:w-80 xl:w-80 shrink-0 lg:sticky lg:top-24 space-y-6">
          
          {/* Actions Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Booking Actions</h3>
            
            <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-200">
              <Download size={16} />
              Download Itinerary
            </button>
            
            <button className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Mail size={16} />
              Email Confirmation
            </button>
            
            <button className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Calendar size={16} />
              View Day Plan
            </button>
            
            <button className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
              <PhoneCall size={16} />
              Contact Tour Manager
            </button>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
            <h3 className="font-bold text-gray-900 text-[13px] mb-3">Enjoyed FlyAnyTrip?</h3>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} className="text-yellow-400 hover:text-yellow-500 transition-colors cursor-pointer">
                  <Star size={24} fill="currentColor" strokeWidth={1.5} />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-medium">Rate your experience</p>
          </div>

          {/* Need Help Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Need help?</h3>
            <p className="text-xs text-gray-500 mb-4">Our support team is available 24/7</p>
            <button className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer">
              <PhoneCall size={16} />
              Contact Support
            </button>
          </div>

          <button className="w-full py-3.5 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer">
            <Plane size={18} strokeWidth={2} />
            Book Another Trip
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
          
        </div>

      </main>

      <Footer />
    </div>
  )
}

import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Phone, Mail, User, Users, Star, Shield, ChevronDown, Plus, Minus, ArrowRight, Info } from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.js'
import BookingStepper from '../components/booking/BookingStepper'
import PackageSummaryBar from '../components/booking/PackageSummaryBar'
import FareSummaryCard from '../components/booking/FareSummaryCard'
import TravelerForm from '../components/booking/TravelerForm'

// API base URL configured via environment or local backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Input field styles matching Figma node 7-10159
const inputClass = (err) =>
  `w-full px-4 py-3.5 border rounded-xl text-sm bg-gray-50 text-gray-800 outline-none focus:bg-white focus:ring-2 transition-all ${
    err ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-gray-400 focus:ring-gray-100'
  }`
const labelClass = 'block text-xs font-medium text-gray-700 mb-1.5'

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+60', label: '🇲🇾 +60' },
  { code: '+66', label: '🇹🇭 +66' },
]

const emptyTraveler = () => ({ title: 'Mr.', firstName: '', lastName: '', dob: '', nationality: 'Indian', passport: '', passportExpiry: '' })

export default function ToursTravelerDetail() {
  const { id = 1 } = useParams()
  const navigate = useNavigate()

  // Dynamic state loaded from backend API or local dataset fallback
  const [pkgData, setPkgData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Booking form state
  const [adults, setAdults] = useState(2)
  const [travelers, setTravelers] = useState([emptyTraveler(), emptyTraveler()])
  const [expandedExtra, setExpandedExtra] = useState({})
  const [countryCode, setCountryCode] = useState('+91')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch package details from backend or fallback to package ID 1
  useEffect(() => {
    window.scrollTo(0, 0)
    let isMounted = true

    async function fetchTourDetails() {
      try {
        const response = await fetch(`${API_BASE_URL}/tours/${id}`)
        if (response.ok) {
          const apiData = await response.json()
          if (isMounted) setPkgData(apiData)
        } else {
          throw new Error('API request failed')
        }
      } catch (err) {
        // Fallback to Golden Triangle Tour matching Figma design specs
        const fallback = packages.find(p => p.id === parseInt(id)) || packages[0]
        if (isMounted) setPkgData(fallback)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchTourDetails()
    return () => { isMounted = false }
  }, [id])

  const pkg = pkgData || packages[0]
  const isInternational = pkg?.category === 'International' || pkg?.flightsIncluded === true
  const departureDate = pkg?.departureDates?.[0]?.date || '20 Dec 2024'
  const price = pkg?.price || 22999

  // Counter logic
  const handleAdultsChange = (delta) => {
    const next = Math.max(1, adults + delta)
    setAdults(next)
    setTravelers(prev => {
      if (next > prev.length) return [...prev, ...Array(next - prev.length).fill(null).map(emptyTraveler)]
      return prev.slice(0, next)
    })
  }

  const updateTraveler = (index, field, value) => {
    setTravelers(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t))
  }

  // Validation
  const validate = () => {
    const e = {}
    if (!mobile || !/^\d{10}$/.test(mobile)) e.mobile = 'Enter a valid 10-digit mobile number'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address'
    const t = travelers[0]
    const te = {}
    if (!t.title) te.title = 'Required'
    if (!t.firstName?.trim()) te.firstName = 'Required'
    if (!t.lastName?.trim()) te.lastName = 'Required'
    if (!t.dob || !/^\d{2}-\d{2}-\d{4}$/.test(t.dob)) te.dob = 'Enter date in DD-MM-YYYY format'
    if (!t.nationality) te.nationality = 'Required'
    if (isInternational) {
      if (!t.passport?.trim()) te.passport = 'Required for international travel'
      if (!t.passportExpiry || !/^\d{2}\/\d{2}$/.test(t.passportExpiry)) {
        te.passportExpiry = 'Enter date in MM/YY format'
      }
    }
    if (Object.keys(te).length) e.traveler0 = te
    return e
  }

  // Submission handler with backend payload integration
  const handleContinue = async () => {
    setSubmitted(true)
    const valErrors = validate()
    setErrors(valErrors)

    if (Object.keys(valErrors).length === 0) {
      setSubmitting(true)

      const payload = {
        tourId: pkg.id,
        tourTitle: pkg.title,
        departureDate,
        adultsCount: adults,
        contactInfo: { countryCode, mobile, email },
        travelers,
        pricing: {
          pricePerPerson: price,
          baseSubtotal: price * adults,
          gst: Math.round(price * adults * 0.05),
          total: price * adults + Math.round(price * adults * 0.05)
        }
      }

      // Persist in sessionStorage for frontend flow continuity
      sessionStorage.setItem(`tour_booking_${pkg.id}`, JSON.stringify(payload))

      try {
        // Send payload to backend API endpoint if connected
        await fetch(`${API_BASE_URL}/tours/booking/traveler-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch (err) {
        console.warn('Backend API disconnected, proceeding with stored state:', err.message)
      } finally {
        setSubmitting(false)
        navigate(`/tour-packages/${pkg.id}/book/personalize`, { state: payload })
      }
    }
  }

  const isFormValid = useMemo(() => Object.keys(validate()).length === 0, [mobile, email, travelers, adults])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <TopBar />
      <Navbar />

      <div className="w-full px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 pt-5">
          <Link to="/" className="hover:text-red-500 no-underline text-gray-500">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/tour-packages" className="hover:text-red-500 no-underline text-gray-500">Tour Packages</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{pkg.title}</span>
          <span className="text-gray-300">/</span>
          <span className="text-red-500 font-semibold">Traveler Details</span>
        </nav>

        {/* Top Stepper Bar */}
        <BookingStepper currentStep={1} />

        {/* Package Summary Header Bar */}
        <PackageSummaryBar pkg={pkg} departureDate={departureDate} price={price} />

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pb-16">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 w-full">

            {/* Contact Information Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#D0D0D0]">
                <Phone size={17} className="text-red-500 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Mobile Number */}
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <select
                        className="h-full pl-3 pr-8 py-3.5 border border-gray-200 rounded-xl text-sm bg-gray-50 font-medium text-gray-800 outline-none focus:bg-white appearance-none"
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                      >
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-2.5 top-4 text-gray-400 pointer-events-none" />
                    </div>
                    <input
                      className={`flex-1 ${inputClass(submitted && errors.mobile)}`}
                      placeholder="98XXXXXXXX"
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                  {submitted && errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-[14px] text-gray-400" />
                    <input
                      className={`pl-10 ${inputClass(submitted && errors.email)}`}
                      placeholder="you@email.com"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  {submitted && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Number of Travelers & Lead Details Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <User size={17} className="text-red-500 shrink-0" />
                <h2 className="text-base font-bold text-gray-900">Number of Travelers</h2>
              </div>

              <hr className="border-[#D0D0D0] my-4" />

              {/* Counter Section — matches Figma: rounded square boxes, big red number, Adults label below */}
              <div className="mb-5">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleAdultsChange(-1)}
                    className="w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                  >
                    <Minus size={14} strokeWidth={2} />
                  </button>
                  <div className="text-center min-w-[2rem]">
                    <span className="text-3xl font-bold text-red-500 leading-none block">{adults}</span>
                    <span className="text-[11px] text-gray-400 font-medium block mt-1">Adults</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdultsChange(1)}
                    className="w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                  >
                    <Plus size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <hr className="border-[#D0D0D0] my-5" />

              {/* Lead Traveler Details Heading */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-base">Lead Traveler Details</h3>
              </div>

              <TravelerForm
                index={0}
                data={travelers[0]}
                onChange={(field, val) => updateTraveler(0, field, val)}
                isInternational={isInternational}
                errors={submitted ? errors.traveler0 : {}}
              />

              {/* Additional Travelers Section — appears after passport section in Figma */}
              {adults > 1 && (
                <>
                  <hr className="border-[#D0D0D0] my-5" />

                  <div className="space-y-3">
                    <span className="text-xs text-gray-400 font-medium block">
                      {adults - 1} additional traveller{adults - 1 > 1 ? 's' : ''} required
                    </span>

                    {travelers.slice(1).map((t, i) => {
                      const idx = i + 1
                      const isExpanded = expandedExtra[idx]
                      return (
                        <div key={idx} className="space-y-3">
                          <div className="border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between bg-white">
                            <span className="text-sm font-bold text-gray-800">Traveller {idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => setExpandedExtra(prev => ({ ...prev, [idx]: !isExpanded }))}
                              className="text-xs font-bold text-gray-700 hover:text-red-500 hover:underline cursor-pointer transition-colors"
                            >
                              {isExpanded ? '− Hide Details' : '+ Add Details'}
                            </button>
                          </div>
                          {isExpanded && (
                            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
                              <TravelerForm
                                index={idx}
                                data={travelers[idx]}
                                onChange={(field, val) => updateTraveler(idx, field, val)}
                                isInternational={isInternational}
                                errors={{}}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Main CTA Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100 cursor-pointer disabled:opacity-75"
            >
              {submitting ? 'Processing...' : 'Continue'}
              <ArrowRight size={18} />
            </button>
            {submitted && Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-xs text-center mt-2">Please complete all required fields above to proceed.</p>
            )}
          </div>

          {/* ── RIGHT STICKY SIDEBAR ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">

            {/* Package Thumbnail & Departure Info */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="h-44 relative">
                <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-base leading-tight">{pkg.title}</h3>
                  <p className="text-xs text-white/80 font-medium mt-0.5">{pkg.duration || '5N/6D'}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm pb-2 border-b border-[#D0D0D0]">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-bold text-gray-900">{departureDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Travellers</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdultsChange(-1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                    >
                      <Minus size={12} strokeWidth={2} />
                    </button>
                    <span className="font-bold text-gray-900 text-sm px-1">{adults}</span>
                    <button
                      type="button"
                      onClick={() => handleAdultsChange(1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                    >
                      <Plus size={12} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Summary Calculation */}
            <FareSummaryCard pkg={pkg} adults={adults} price={price} />

            {/* Guarantee / Free Cancellation Notice */}
            <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield size={16} className="text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-emerald-800 leading-snug">
                Free cancellation up to 30 days before departure.
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

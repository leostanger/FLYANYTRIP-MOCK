import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowRight, Shield } from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.js'
import BookingStepper from '../components/booking/BookingStepper'
import PackageSummaryBar from '../components/booking/PackageSummaryBar'
import FareSummaryCard from '../components/booking/FareSummaryCard'
import MealPreferenceCard, { MEAL_OPTIONS } from '../components/booking/MealPreferenceCard'
import AddOnServiceCard from '../components/booking/AddOnServiceCard'
import InsuranceCard from '../components/booking/InsuranceCard'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ToursPersonalize() {
  const { id = 1 } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve stored state or fallback
  const storedData = useMemo(() => {
    try {
      const item = sessionStorage.getItem(`tour_booking_${id}`)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }, [id])

  const bookingState = location.state || storedData || {}

  const pkg = packages.find(p => p.id === parseInt(id)) || packages[0]
  const departureDate = pkg?.departureDates?.[0]?.date || '20 Dec 2024'
  const price = pkg?.price || 22999
  const adults = bookingState.adultsCount || bookingState.adults || 2

  // Selections state
  const [selectedMeal, setSelectedMeal] = useState(MEAL_OPTIONS[0])
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [insuranceSelected, setInsuranceSelected] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  // Toggle add-on
  const handleToggleAddOn = (item) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.id === item.id)
      if (exists) return prev.filter(a => a.id !== item.id)
      return [...prev, item]
    })
  }

  // Handle CTA navigation with backend payload integration
  const handleContinue = async () => {
    setSubmitting(true)
    const payload = {
      ...bookingState,
      tourId: pkg.id,
      tourTitle: pkg.title,
      departureDate,
      adultsCount: adults,
      selectedMeal: selectedMeal ? { id: selectedMeal.id, label: selectedMeal.label, price: selectedMeal.price } : null,
      selectedAddOns: selectedAddOns.map(({ id, title, price, desc, badge }) => ({ id, title, price, desc, badge })),
      insuranceSelected,
      pricing: {
        pricePerPerson: price,
        baseSubtotal: price * adults,
        mealSubtotal: (selectedMeal?.price || 0) * adults,
        addOnsSubtotal: selectedAddOns.reduce((acc, item) => acc + item.price, 0),
        insuranceSubtotal: insuranceSelected ? 149 * adults : 0,
        gst: Math.round((price * adults + (selectedMeal?.price || 0) * adults + selectedAddOns.reduce((acc, item) => acc + item.price, 0) + (insuranceSelected ? 149 * adults : 0)) * 0.05),
        total: Math.max(0, (price * adults + (selectedMeal?.price || 0) * adults + selectedAddOns.reduce((acc, item) => acc + item.price, 0) + (insuranceSelected ? 149 * adults : 0)) * 1.05)
      }
    }

    sessionStorage.setItem(`tour_booking_${pkg.id}`, JSON.stringify(payload))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    try {
      await fetch(`${API_BASE_URL}/tours/booking/personalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
    } catch (err) {
      console.warn('Backend API disconnected, proceeding with stored state:', err.message)
    } finally {
      clearTimeout(timeoutId)
      setSubmitting(false)
      navigate(`/tour-packages/${pkg.id}/book/review`, { state: payload })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <TopBar />
      <Navbar />

      <div className="w-full px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 pt-5">
          <Link to="/" className="hover:text-red-500 no-underline text-gray-500">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/tour-packages" className="hover:text-red-500 no-underline text-gray-500">Tour Packages</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{pkg.title}</span>
          <span className="text-gray-300">/</span>
          <span className="text-red-500 font-semibold">Personalize Trip</span>
        </nav>

        {/* Stepper (Step 2 active) */}
        <BookingStepper currentStep={2} />

        {/* Package Summary Bar */}
        <PackageSummaryBar pkg={pkg} departureDate={departureDate} price={price} />

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pb-16">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 w-full space-y-6">

            {/* Meal Preference Card */}
            <MealPreferenceCard
              selectedMeal={selectedMeal}
              onSelect={meal => setSelectedMeal(meal)}
            />

            {/* Add-on Service Card */}
            <AddOnServiceCard
              selectedAddOns={selectedAddOns}
              onToggle={handleToggleAddOn}
            />

            {/* Travel Insurance Card */}
            <InsuranceCard
              isSelected={insuranceSelected}
              onToggle={() => setInsuranceSelected(prev => !prev)}
            />

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100 cursor-pointer disabled:opacity-75"
            >
              {submitting ? 'Processing...' : 'Continue'}
              <ArrowRight size={18} />
            </button>
          </div>

          {/* ── RIGHT STICKY SIDEBAR ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">

            {/* Package Thumbnail & Departure Card */}
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
                <div className="flex justify-between items-center text-sm pb-2 border-b border-gray-100">
                  <span className="text-gray-500">Departure</span>
                  <span className="font-bold text-gray-900">{departureDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Travellers</span>
                  <span className="font-bold text-gray-900">{adults} {adults === 1 ? 'Person' : 'People'}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Fare Summary */}
            <FareSummaryCard
              pkg={pkg}
              adults={adults}
              price={price}
              selectedMeal={selectedMeal}
              selectedAddOns={selectedAddOns}
              insuranceSelected={insuranceSelected}
            />

            {/* Free Cancellation Banner */}
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

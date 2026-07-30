import React, { useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Shield, Lock, Minus, Plus } from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.js'
import BookingStepper from '../components/booking/BookingStepper'
import PackageSummaryBar from '../components/booking/PackageSummaryBar'
import FareSummaryCard from '../components/booking/FareSummaryCard'

export default function ReviewBooking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const storedData = (() => {
    try {
      const item = sessionStorage.getItem(`tour_booking_${id}`)
      return item ? JSON.parse(item) : null
    } catch { return null }
  })()

  const bookingState = location.state || storedData || {}
  const pkg = packages.find(p => p.id === parseInt(id)) || packages[0]

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  const adults = bookingState.adultsCount || bookingState.adults || 2
  const selectedMeal = bookingState.selectedMeal || { label: 'No Preference', price: 0 }
  const selectedAddOns = bookingState.selectedAddOns || []
  const insuranceSelected = bookingState.insuranceSelected || false
  const insurancePrice = 149

  const firstDeparture = pkg?.departureDates?.[0]
  const departureDate = firstDeparture?.date || '20 Dec 2024'
  const price = firstDeparture?.price || pkg?.price || 22999

  const baseSubtotal = price * adults
  const mealSubtotal = selectedMeal?.price ? selectedMeal.price * adults : 0
  const addOnsSubtotal = selectedAddOns.reduce((acc, item) => acc + item.price, 0)
  const insuranceSubtotal = insuranceSelected ? insurancePrice * adults : 0
  const totalSubtotal = baseSubtotal + mealSubtotal + addOnsSubtotal + insuranceSubtotal
  const gst = Math.round(totalSubtotal * 0.05)
  const savings = pkg?.originalPrice && price ? (pkg.originalPrice - price) * adults : 10002
  const totalBeforeDiscount = totalSubtotal + gst
  const finalTotal = totalBeforeDiscount

  const handleProceedToPayment = () => {
    navigate(`/tour-packages/${pkg.id}/book/payment`, { state: bookingState })
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
          <span className="text-red-500 font-semibold">Review Booking</span>
        </nav>

        {/* Stepper — Step 3 active */}
        <BookingStepper currentStep={3} />

        <PackageSummaryBar pkg={pkg} departureDate={departureDate} price={price} />

        <div className="flex flex-col lg:flex-row gap-8 items-start pb-16">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="text-red-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900">Review Your Booking</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <span className="text-sm font-normal text-gray-400">Package</span>
                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">{pkg.title}</div>
                      <div className="text-xs font-normal text-gray-400 mt-0.5">Delhi — Agra — Jaipur</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm font-normal text-gray-400">Duration</span>
                    <span className="font-bold text-sm text-gray-900">{pkg.duration || '5N/6D'}</span>
                  </div>

                  <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                    <span className="text-sm font-normal text-gray-400">Departure</span>
                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">{departureDate}</div>
                      <div className="text-xs font-normal text-gray-400 mt-0.5">8 seats remaining</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-sm font-normal text-gray-400">Travellers</span>
                    <span className="font-bold text-sm text-gray-900">{adults} adults</span>
                  </div>

                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-normal text-gray-400">Meal</span>
                    <span className="font-bold text-sm text-gray-900">{selectedMeal.label}</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50/60 p-6 flex items-center justify-between">
                <div className="flex flex-col gap-1.5 text-xs font-normal text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-20">Base:</span>
                    <span>₹{totalSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20">GST (5%):</span>
                    <span>₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <span className="w-20 font-normal">Savings:</span>
                    <span>₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-normal text-gray-500 mb-1">Total Payable</div>
                  <div className="text-2xl font-bold text-gray-900">₹{finalTotal.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-green-800 bg-green-50/70 border border-green-200 rounded-xl p-4 shadow-2xs">
              <Shield size={16} className="text-green-600" />
              Secure payment follows. Free cancellation up to 30 days before departure. No charges until confirmed.
            </div>

            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full py-4 rounded-xl font-bold text-base bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock size={18} />
              <span>Pay ₹{finalTotal.toLocaleString('en-IN')} Securely</span>
              <Shield size={18} className="opacity-0" />
            </button>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">
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
                  <span className="text-gray-500 font-medium">Departure</span>
                  <span className="font-bold text-gray-900">{departureDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Travellers</span>
                  <div className="flex items-center gap-2">
                    <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"><Minus size={11} /></button>
                    <span className="font-bold text-gray-900 text-sm w-4 text-center">{adults}</span>
                    <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600"><Plus size={11} /></button>
                  </div>
                </div>
              </div>
            </div>

            <FareSummaryCard
              pkg={pkg}
              adults={adults}
              price={price}
              selectedMeal={selectedMeal}
              selectedAddOns={selectedAddOns}
              insuranceSelected={insuranceSelected}
            />

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

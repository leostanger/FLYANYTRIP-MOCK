import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Shield, Lock, ArrowRight, Smartphone, CreditCard, Landmark, Wallet, Check, Tag, X, QrCode, Minus, Plus } from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.js'
import BookingStepper from '../components/booking/BookingStepper'
import PackageSummaryBar from '../components/booking/PackageSummaryBar'
import FareSummaryCard from '../components/booking/FareSummaryCard'

// UPI payment logos from local assets
import gpayLogo from '../assets/gpay.svg'
import phonepeLogo from '../assets/phonepay.svg'
import paytmLogo from '../assets/paytm.svg'
import bhimLogo from '../assets/bhim.svg'
import qrCodeImage from '../assets/QR.svg'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const COUPONS = [
  { code: 'HDFC15', discount: 1500, label: 'HDFC15' },
  { code: 'FLY200', discount: 200, label: 'FLY200' },
  { code: 'FIRSTFLY', discount: 1000, label: 'FIRSTFLY' },
]

const UPI_APPS = [
  { id: 'gpay',    name: 'GPay',    logo: gpayLogo,    bgClass: 'bg-blue-50/50 hover:bg-blue-50', borderClass: 'border-blue-200' },
  { id: 'phonepe', name: 'PhonePe', logo: phonepeLogo, bgClass: 'bg-purple-50/50 hover:bg-purple-50', borderClass: 'border-purple-200' },
  { id: 'paytm',   name: 'Paytm',   logo: paytmLogo,   bgClass: 'bg-cyan-50/50 hover:bg-cyan-50', borderClass: 'border-cyan-200' },
  { id: 'bhim',    name: 'BHIM',    logo: bhimLogo,    bgClass: 'bg-orange-50/50 hover:bg-orange-50', borderClass: 'border-orange-200' },
]

const PAYMENT_TABS = [
  { id: 'upi',        label: 'UPI',                icon: <Smartphone size={20} strokeWidth={1.5} /> },
  { id: 'card',       label: 'Credit / Debit Card', icon: <CreditCard size={20} strokeWidth={1.5} /> },
  { id: 'netbanking', label: 'Net Banking',          icon: <Landmark size={20} strokeWidth={1.5} /> },
  { id: 'wallets',    label: 'Wallets',              icon: <Wallet size={20} strokeWidth={1.5} /> },
]

export default function FinalizePayment() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Try loading from sessionStorage if no location state
  const storedData = (() => {
    try {
      const item = sessionStorage.getItem(`tour_booking_${id}`)
      return item ? JSON.parse(item) : null
    } catch { return null }
  })()

  const bookingState = location.state || storedData || {}
  const pkg = packages.find(p => p.id === parseInt(id)) || packages[0]

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  // State from previous steps
  const adults        = bookingState.adultsCount || bookingState.adults || 2
  const travelers     = bookingState.travelers || []
  const mobile        = bookingState.contactInfo?.mobile || bookingState.mobile || ''
  const email         = bookingState.contactInfo?.email || bookingState.email || ''
  const countryCode   = bookingState.contactInfo?.countryCode || bookingState.countryCode || '+91'
  const selectedMeal  = bookingState.selectedMeal || { label: 'No Preference', price: 0 }
  const selectedAddOns = bookingState.selectedAddOns || []
  const insuranceSelected = bookingState.insuranceSelected || false
  const insurancePrice = 149

  // Departure & Pricing
  const firstDeparture = pkg?.departureDates?.[0]
  const departureDate  = firstDeparture?.date || '20 Dec 2024'
  const price          = firstDeparture?.price || pkg?.price || 22999

  // Fare breakdown
  const baseSubtotal     = price * adults
  const mealSubtotal     = selectedMeal?.price ? selectedMeal.price * adults : 0
  const addOnsSubtotal   = selectedAddOns.reduce((acc, item) => acc + item.price, 0)
  const insuranceSubtotal = insuranceSelected ? insurancePrice * adults : 0
  const totalSubtotal    = baseSubtotal + mealSubtotal + addOnsSubtotal + insuranceSubtotal
  const gst              = Math.round(totalSubtotal * 0.05)
  const savings          = pkg?.originalPrice && price ? (pkg.originalPrice - price) * adults : 10002

  // Coupon & Payment state
  const [couponInput, setCouponInput]       = useState('')
  const [appliedCoupon, setAppliedCoupon]   = useState(null)
  const [activeTab, setActiveTab]           = useState('upi')
  const [upiId, setUpiId]                   = useState('')
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay')
  const [cardNumber, setCardNumber]         = useState('')
  const [cardExpiry, setCardExpiry]         = useState('')
  const [cardCvv, setCardCvv]               = useState('')
  const [cardName, setCardName]             = useState('')
  const [selectedBank, setSelectedBank]     = useState('HDFC')
  const [selectedWallet, setSelectedWallet] = useState('Paytm')
  const [submitting, setSubmitting]         = useState(false)
  const [qrCodeUrl, setQrCodeUrl]           = useState(qrCodeImage)
  const [isQrLoading, setIsQrLoading]       = useState(false)

  const couponDiscount = appliedCoupon?.discount || 0
  const totalBeforeDiscount = totalSubtotal + gst
  const finalTotal = Math.max(0, totalBeforeDiscount - couponDiscount)

  const handleApplyCoupon = (code) => {
    const clean = code.trim().toUpperCase()
    if (!clean) return
    const found = COUPONS.find(c => c.code === clean)
    setAppliedCoupon(found || { code: clean, discount: 500, label: clean })
    setCouponInput('')
  }

  // Simulate dynamic QR code generation from backend based on selected UPI App and finalTotal
  useEffect(() => {
    if (activeTab === 'upi') {
      setIsQrLoading(true)
      const fetchDynamicQrCode = async () => {
        try {
          // Replace this URL with actual backend endpoint when connecting to the API
          // e.g. const res = await fetch(`${API_BASE_URL}/payment/generate-qr?app=${selectedUpiApp}&amount=${finalTotal}`)
          // const data = await res.json()
          // setQrCodeUrl(data.qrCodeUrl)
          
          // Simulating network delay for backend integration readiness
          await new Promise(resolve => setTimeout(resolve, 600))
          setQrCodeUrl(qrCodeImage)
        } catch (error) {
          console.error("Failed to fetch dynamic QR code:", error)
          setQrCodeUrl(qrCodeImage) // fallback
        } finally {
          setIsQrLoading(false)
        }
      }
      fetchDynamicQrCode()
    }
  }, [selectedUpiApp, finalTotal, activeTab])

  const handleFinalPayment = async () => {
    setSubmitting(true)
    const bookingId = `FAT-TOUR-${Math.floor(10000 + Math.random() * 90000)}X`
    const payload = {
      ...bookingState,
      packageId: pkg?.id,
      packageTitle: pkg?.title,
      departureDate,
      adults,
      travelers,
      contact: { countryCode, mobile, email },
      selectedMeal,
      selectedAddOns,
      insuranceSelected,
      appliedCoupon,
      paymentMethod: activeTab,
      paymentDetails:
        activeTab === 'upi'        ? { upiId, selectedUpiApp } :
        activeTab === 'card'       ? { cardNumber, cardExpiry, cardName } :
        activeTab === 'netbanking' ? { selectedBank } :
        { selectedWallet },
      fareBreakdown: { baseSubtotal, mealSubtotal, addOnsSubtotal, insuranceSubtotal, gst, couponDiscount, finalTotal },
      finalTotal,
      bookingId,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    try {
      await fetch(`${API_BASE_URL}/tours/booking/payment`, {
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
      navigate(`/tour-packages/${pkg.id}/book/confirmation`, { state: payload })
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
          <span className="text-red-500 font-semibold">Finalize Payment</span>
        </nav>

        {/* Stepper — Step 3 active */}
        <BookingStepper currentStep={3} />

        {/* Package Summary Bar */}
        <PackageSummaryBar pkg={pkg} departureDate={departureDate} price={price} />

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start pb-16">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 w-full space-y-5">

            {/* ─── COUPON CODE CARD ─── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs">
              {/* Input + Apply row */}
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon(couponInput)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 bg-white uppercase font-medium placeholder:normal-case transition-all"
                />
                <button
                  onClick={() => handleApplyCoupon(couponInput)}
                  className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-red-500 font-medium text-sm rounded-xl transition-all cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>

              {/* Applied Coupon Banner */}
              {appliedCoupon && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 flex items-center justify-between text-xs text-green-800 font-semibold">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 shrink-0" />
                    <span>Coupon <b>{appliedCoupon.code}</b> applied! You saved ₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-green-700 hover:text-red-500 transition-colors cursor-pointer ml-2"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Quick-apply chips — matches Figma horizontal row */}
              <div className="flex items-center gap-2 flex-wrap">
                {COUPONS.map(c => (
                  <button
                    key={c.code}
                    onClick={() => handleApplyCoupon(c.code)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      appliedCoupon?.code === c.code
                        ? 'bg-red-50 border-red-500 text-red-600 shadow-sm'
                        : 'bg-white border-dashed border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── PAYMENT METHOD CARD ─── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
              {/* Tab Bar — matches Figma exactly */}
              <div className="flex border-b border-gray-200">
                {PAYMENT_TABS.map(tab => {
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center gap-2.5 px-3 py-6 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-1 border-b-2 ${
                        isActive
                          ? 'border-red-500 text-red-500 bg-red-50/60'
                          : 'border-transparent text-gray-500 hover:text-gray-700 bg-white'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">

                {/* ── UPI TAB ── */}
                {activeTab === 'upi' && (
                  <div>
                    {/* UPI ID input */}
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-gray-700 mb-2">UPI ID *</label>
                      <div className="relative flex items-center">
                        <Smartphone size={15} className="absolute left-3.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="yourname@paytm / @upi"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-gray-50/60 transition-all"
                        />
                      </div>
                    </div>

                    {/* Popular UPI Apps — 4 cards in a row matching Figma */}
                    <p className="text-xs font-bold text-gray-700 mb-3">Popular UPI Apps</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
                      {UPI_APPS.map(app => {
                        const isSelected = selectedUpiApp === app.id
                        return (
                          <button
                            key={app.id}
                            onClick={() => setSelectedUpiApp(app.id)}
                            className={`rounded-[14px] transition-all cursor-pointer overflow-hidden ${
                              isSelected
                                ? 'ring-2 ring-red-400 shadow-md scale-[1.02]'
                                : 'shadow-sm hover:opacity-90'
                            }`}
                          >
                            <img
                              src={app.logo}
                              alt={app.name}
                              className="w-full h-auto block"
                            />
                          </button>
                        )
                      })}
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center mb-5">
                      <div className="flex-grow border-t border-gray-200" />
                      <span className="mx-4 text-xs font-semibold text-gray-400 uppercase tracking-widest shrink-0">
                        Or scan QR code
                      </span>
                      <div className="flex-grow border-t border-gray-200" />
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center pb-2">
                      <span className="text-[11px] text-gray-500 font-medium mb-3">Or scan QR code</span>
                      <div className="w-48 h-48 border border-dashed border-gray-300 rounded-2xl p-4 bg-white flex items-center justify-center relative">
                        {isQrLoading ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : null}
                        <img 
                          src={qrCodeUrl} 
                          alt="Dynamic QR Code" 
                          className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-300 ${isQrLoading ? 'opacity-30' : 'opacity-90'}`} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CARD TAB ── */}
                {activeTab === 'card' && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Card Number *</label>
                      <input
                        type="text"
                        placeholder="4532 •••• •••• ••••"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-gray-50/60"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Valid Thru (MM/YY) *</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-gray-50/60"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">CVV *</label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-gray-50/60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Name on Card *</label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-gray-50/60 uppercase"
                      />
                    </div>
                  </div>
                )}

                {/* ── NET BANKING TAB ── */}
                {activeTab === 'netbanking' && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-gray-700">Popular Banks</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['HDFC', 'ICICI', 'SBI', 'Axis Bank', 'Kotak', 'PNB'].map(bank => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            selectedBank === bank
                              ? 'bg-red-50 border-2 border-red-500 text-red-600 shadow-sm'
                              : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Or Select Other Bank</label>
                      <select
                        value={selectedBank}
                        onChange={e => setSelectedBank(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 bg-white"
                      >
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak">Kotak Mahindra Bank</option>
                        <option value="Yes Bank">Yes Bank</option>
                        <option value="IDFC">IDFC First Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ── WALLETS TAB ── */}
                {activeTab === 'wallets' && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-gray-700 mb-1">Select Wallet</span>
                    {[
                      { id: 'Paytm',      name: 'Paytm Wallet' },
                      { id: 'AmazonPay',  name: 'Amazon Pay' },
                      { id: 'Mobikwik',   name: 'MobiKwik' },
                      { id: 'Freecharge', name: 'Freecharge' },
                    ].map(wallet => (
                      <button
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedWallet === wallet.id
                            ? 'bg-red-50 border-2 border-red-500 text-red-600 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-bold text-sm">{wallet.name}</span>
                        {selectedWallet === wallet.id && <Check size={16} className="text-red-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ─── PAY BUTTON ─── */}
            <button
              type="button"
              onClick={handleFinalPayment}
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold text-base bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-100 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              <Lock size={18} />
              <span>{submitting ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')} Securely`}</span>
              <ArrowRight size={18} />
            </button>

            {/* Terms text */}
            <p className="text-[11px] text-gray-400 text-center font-medium -mt-2">
              By proceeding, you agree to our{' '}
              <a href="#terms" className="underline hover:text-red-500 transition-colors">Terms &amp; Conditions</a>
              {' '}and{' '}
              <a href="#privacy" className="underline hover:text-red-500 transition-colors">Privacy Policy</a>
            </p>
          </div>

          {/* ── RIGHT STICKY SIDEBAR ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 space-y-4">

            {/* Package thumbnail & info — matches Figma sidebar card */}
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
                {/* Travellers with counter — matches Figma */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Travellers</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => {}}
                    >
                      <Minus size={11} />
                    </button>
                    <span className="font-bold text-gray-900 text-sm w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => {}}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Fare Summary — with all breakdowns */}
            <FareSummaryCard
              pkg={pkg}
              adults={adults}
              price={price}
              selectedMeal={selectedMeal}
              selectedAddOns={selectedAddOns}
              insuranceSelected={insuranceSelected}
              appliedCoupon={appliedCoupon}
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

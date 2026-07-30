import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, Share2, FileText, MapPin, ChevronDown, ChevronUp, Plus, Minus, Star, Phone, X } from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.js'

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Heritage: 'bg-amber-500',
  Nature: 'bg-green-500',
  Adventure: 'bg-blue-500',
  International: 'bg-purple-600',
}

// ─── Star Row ────────────────────────────────────────────────────────────────
function StarRow({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= count ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Rating Bar ──────────────────────────────────────────────────────────────
function RatingBar({ label, value }) {
  return (
    <div className="flex items-center gap-3 mb-2.5 last:mb-0">
      <span className="text-[12px] text-[#6B6B6B] w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-transparent rounded-full h-1.5">
        <div className="bg-[#FFC107] h-1.5 rounded-full" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className="text-[12px] font-bold text-[#1A1A1A] w-6 text-right">{value}</span>
    </div>
  )
}

// ─── Mini Package Card (You May Also Like) ────────────────────────────────────
function MiniCard({ pkg, navigate }) {
  return (
    <div
      onClick={() => navigate(`/tour-packages/${pkg.id}`)}
      className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-300 flex-shrink-0 w-72"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
        <span className={`absolute top-2 left-2 ${CATEGORY_COLORS[pkg.category]} text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>
          {pkg.category}
        </span>
        <span className="absolute bottom-2 left-2 bg-white text-gray-900 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
          {pkg.duration}
        </span>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-gray-900 text-sm">{pkg.title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{pkg.location}</p>
        <div className="mt-2">
          <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
          <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{pkg.discount}% off</span>
          <p className="text-lg font-black text-gray-900 mt-0.5">₹{pkg.price.toLocaleString('en-IN')}</p>
        </div>
        <button className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex)
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
        <X size={32} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length) }}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
      >
        <ChevronDown size={24} className="-rotate-90" />
      </button>
      <img
        src={images[current]}
        alt={`Photo ${current + 1}`}
        className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length) }}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
      >
        <ChevronDown size={24} className="rotate-90" />
      </button>
      <div className="absolute bottom-4 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i) }}
            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TourPackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pkg = packages.find(p => p.id === parseInt(id))

  // Scroll to top on mount / package change
  useEffect(() => { window.scrollTo(0, 0) }, [id])

  // Booking sidebar state
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [selectedDate, setSelectedDate] = useState(0)
  const [liked, setLiked] = useState(false)

  // Accordion state
  const [openDays, setOpenDays] = useState({ 0: true })
  const [openFaqs, setOpenFaqs] = useState({})
  const toggleDay = i => setOpenDays(p => ({ ...p, [i]: !p[i] }))
  const toggleFaq = i => setOpenFaqs(p => ({ ...p, [i]: !p[i] }))

  // Review pagination
  const [reviewPage, setReviewPage] = useState(0)

  // Image lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const openLightbox = i => { setLightboxIndex(i); setLightboxOpen(true) }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 text-gray-400">
          <p className="text-xl font-bold">Package not found</p>
          <button onClick={() => navigate('/tour-packages')} className="mt-4 text-red-500 font-semibold hover:underline">
            ← Back to Tour Packages
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const images = pkg.images || [pkg.image, pkg.image, pkg.image, pkg.image, pkg.image]
  const rd = pkg.reviewsData || {}
  const departureDate = pkg.departureDates?.[selectedDate]
  const selectedPrice = departureDate?.price ?? pkg.price
  const totalTravellers = adults + children
  const subtotal = selectedPrice * totalTravellers
  const savings = (pkg.originalPrice - selectedPrice) * totalTravellers
  const related = packages.filter(p => p.id !== pkg.id && (p.category === pkg.category || p.destination === pkg.destination)).slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Navbar />

      {lightboxOpen && <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}

      <div className="max-w-screen-xl mx-auto px-6 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
          <Link to="/" className="hover:text-red-500 transition-colors no-underline text-gray-500">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/tour-packages" className="hover:text-red-500 transition-colors no-underline text-gray-500">Tour Packages</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{pkg.title}</span>
        </nav>

        {/* ─── Image Gallery ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-2 mb-6 rounded-2xl overflow-hidden h-[420px]">
          {/* Main image */}
          <div
            className="col-span-3 relative cursor-pointer overflow-hidden group"
            onClick={() => openLightbox(0)}
          >
            <img src={images[0]} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          {/* 2×2 grid */}
          <div className="col-span-2 grid grid-cols-2 grid-rows-2 gap-2">
            {[1, 2, 3, 4].map((imgIdx, i) => (
              <div
                key={imgIdx}
                className="relative cursor-pointer overflow-hidden group"
                onClick={() => openLightbox(imgIdx)}
              >
                <img src={images[imgIdx]} alt={`${pkg.title} view ${imgIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {/* Last cell overlays */}
                {i === 3 && (
                  <>
                    <span className={`absolute top-2 left-2 ${CATEGORY_COLORS[pkg.category]} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                      {pkg.category}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      {pkg.duration}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Title Row ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">{pkg.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin size={15} className="text-red-500 shrink-0" />
                <span className="text-sm">{pkg.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-sm font-semibold">{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StarRow count={Math.round(pkg.rating)} />
                <span className="text-sm font-bold text-gray-900">{pkg.rating}</span>
                <span className="text-sm text-gray-500">({(rd.totalReviews || pkg.reviews)?.toLocaleString('en-IN')} reviews)</span>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLiked(l => !l)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${liked ? 'bg-red-50 border-red-300 text-red-500' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
              Wishlist
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all">
              <Share2 size={16} />
              Share
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-gray-300 transition-all">
              <FileText size={16} />
              Itinerary PDF
            </button>
          </div>
        </div>

        {/* ─── Two-Column Body ────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">

            {/* 1. Overview & Highlights (Merged) */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6" style={{ fontFamily: '"Quicksand", sans-serif' }}>
              {/* Overview */}
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-[#6B6B6B] font-medium leading-relaxed text-[15px]">{pkg.overview}</p>

              {/* Highlights */}
              {pkg.highlights && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-[#1A1A1A] font-semibold leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 3. Day by Day Itinerary */}
            {pkg.itinerary && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Day by Day Itinerary</h2>
                <div className="flex flex-col divide-y divide-gray-100">
                  {pkg.itinerary.map((day, i) => (
                    <div key={i} className="py-3">
                      <button
                        onClick={() => toggleDay(i)}
                        className="w-full flex items-center gap-4 bg-transparent border-none cursor-pointer text-left p-0"
                      >
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                          {day.day}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{day.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{day.location}</p>
                        </div>
                        {openDays[i]
                          ? <ChevronUp size={18} className="text-gray-400 shrink-0" />
                          : <ChevronDown size={18} className="text-gray-400 shrink-0" />
                        }
                      </button>
                      {openDays[i] && (
                        <div className="ml-12 mt-3 animate-fadeIn">
                          <p className="text-sm text-gray-600 leading-relaxed mb-3">{day.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {day.inclusions?.map((inc, j) => (
                              <span key={j} className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                                {inc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Hotels Included */}
            {pkg.hotels && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hotels Included</h2>
                <div className="flex flex-col gap-4">
                  {pkg.hotels.map((hotel, i) => (
                    <div key={i} className="flex items-center gap-4">
                      {hotel.image ? (
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div
                        className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center bg-gray-100 text-gray-400"
                        style={{ display: hotel.image ? 'none' : 'flex' }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{hotel.name}</p>
                        <StarRow count={hotel.stars} />
                      </div>
                      <span className="text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-full shrink-0">
                        {hotel.nights} {hotel.nights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                  * Similar or better properties may be substituted based on availability while maintaining equivalent or higher star ratings.
                </p>
              </section>
            )}

            {/* 5. What's Included & Excluded */}
            {(pkg.included || pkg.excluded) && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included & Excluded</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pkg.included && (
                    <div>
                      <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-3">✓ Included</h3>
                      <div className="flex flex-col gap-2.5">
                        {pkg.included.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {pkg.excluded && (
                    <div>
                      <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3">✕ Excluded</h3>
                      <div className="flex flex-col gap-2.5">
                        {pkg.excluded.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <X size={10} className="text-red-500" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 6. Traveler Reviews */}
            {rd.breakdown && (
              <section className="bg-white rounded-[16px] shadow-sm border border-[#e5e5e5] p-[24px] mb-6" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Left: overall + bars */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-5">
                      <h2 className="text-[18px] font-bold text-[#1A1A1A]">Traveler Reviews</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[24px] font-bold text-[#1A1A1A] leading-none">{rd.overall}</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-[2px]">
                            {[1, 2, 3, 4, 5].map(i => (
                              <svg key={i} className={`w-[12px] h-[12px] ${i <= Math.round(rd.overall) ? 'text-[#FFC107]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-[11px] text-[#6B6B6B] mt-[2px] leading-none">{rd.totalReviews?.toLocaleString('en-IN')} reviews</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      {Object.entries(rd.breakdown).map(([k, v]) => (
                        <RatingBar key={k} label={k} value={v} />
                      ))}
                    </div>
                  </div>
                  {/* Right: review card */}
                  <div className="flex-1 min-w-0">
                    {rd.testimonials && rd.testimonials.length > 0 && (
                      <div className="bg-white rounded-[12px] p-[16px] border border-[#e5e5e5]">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-[34px] h-[34px] rounded-full bg-[#2B5B94] text-white flex items-center justify-center text-[13px] font-bold shrink-0">
                              {rd.testimonials[reviewPage].avatar}
                            </div>
                            <div className="flex flex-col">
                              <p className="font-bold text-[#1A1A1A] text-[13px] leading-tight">{rd.testimonials[reviewPage].name}</p>
                              <p className="text-[11px] text-[#6B6B6B] mt-[2px] leading-tight">Mumbai - Nov 2024</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-[2px]">
                            {[1, 2, 3, 4, 5].map(i => (
                              <svg key={i} className={`w-[10px] h-[10px] ${i <= rd.testimonials[reviewPage].rating ? 'text-[#FFC107]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-[14px] text-[#6B6B6B] leading-relaxed mt-2">"{rd.testimonials[reviewPage].text}"</p>
                      </div>
                    )}
                    {/* Dot pagination */}
                    {rd.testimonials && rd.testimonials.length > 1 && (
                      <div className="flex gap-[6px] mt-4 justify-center">
                        {rd.testimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setReviewPage(i)}
                            className={`w-[6px] h-[6px] rounded-full transition-colors ${i === reviewPage ? 'bg-[#999999]' : 'bg-[#e5e5e5]'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* 7. Cancellation & Refund Policy */}
            {pkg.cancellationPolicy && (
              <section className="bg-white rounded-[16px] shadow-sm border border-[#e5e5e5] p-[24px] mb-6" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-4">Cancellation & Refund Policy</h2>
                <div className="flex flex-col">
                  {pkg.cancellationPolicy.map((row, i) => (
                    <div key={i} className={`flex items-start justify-between py-[14px] gap-4 ${i !== pkg.cancellationPolicy.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
                      <div className="flex items-start gap-[10px]">
                        <svg className="w-[14px] h-[14px] text-[#6B6B6B] shrink-0 mt-[4px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[14px] font-bold text-[#1A1A1A]">{row.period}</span>
                      </div>
                      <span className="text-[13px] font-bold text-[#6B6B6B] font-mono shrink-0 text-right">{row.charge}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 bg-[#dcfce7] rounded-[8px] p-[16px] flex items-center gap-[12px]">
                  <svg className="w-[16px] h-[16px] text-[#16a34a] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-[13px] text-[#16a34a] font-medium leading-relaxed">
                    Add Travel Insurance at ₹499/person during booking for full trip cancellation protection, medical emergencies, and flight delay coverage.
                  </p>
                </div>
              </section>
            )}

            {/* 8. FAQs */}
            {pkg.faqs && (
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="flex flex-col divide-y divide-gray-100">
                  {pkg.faqs.map((faq, i) => (
                    <div key={i} className="py-3">
                      <button
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer text-left p-0 gap-4"
                      >
                        <span className="text-sm font-semibold text-gray-800">{faq.question}</span>
                        {openFaqs[i]
                          ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                          : <ChevronDown size={16} className="text-gray-400 shrink-0" />
                        }
                      </button>
                      {openFaqs[i] && (
                        <p className="text-sm text-gray-600 leading-relaxed mt-2.5 animate-fadeIn">{faq.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 9. You May Also Like */}
            {related.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">You May Also Like</h2>
                <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {related.map(p => (
                    <MiniCard key={p.id} pkg={p} navigate={navigate} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN — Sticky Sidebar */}
          <div className="lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-24 self-start">

            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-4" style={{ fontFamily: '"Quicksand", sans-serif' }}>
              {/* Price header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{pkg.discount}% off</span>
                  </div>
                  <div>
                    <span className="text-3xl font-black text-gray-900">₹{selectedPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-gray-500 ml-1">/ person</span>
                  </div>
                </div>
              </div>

              {/* Travellers */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Number of Travellers</p>
                <div className="flex gap-3">
                  {/* Adults */}
                  <div className="flex-1 border border-gray-200 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500 mb-1.5">Adults</p>
                    <div className="flex items-center justify-between">
                      <button onClick={() => setAdults(a => Math.max(1, a - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-base font-bold text-gray-900">{adults}</span>
                      <button onClick={() => setAdults(a => a + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  {/* Children */}
                  <div className="flex-1 border border-gray-200 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500 mb-1.5">Children</p>
                    <div className="flex items-center justify-between">
                      <button onClick={() => setChildren(c => Math.max(0, c - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="text-base font-bold text-gray-900">{children}</span>
                      <button onClick={() => setChildren(c => c + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Departure dates */}
              {pkg.departureDates && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Select Departure Date</p>
                  <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {pkg.departureDates.map((dep, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(i)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${selectedDate === i ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      >
                        <div>
                          <p className={`text-sm font-semibold ${selectedDate === i ? 'text-red-600' : 'text-gray-800'}`}>{dep.date}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{dep.slots} slots left</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-black ${selectedDate === i ? 'text-red-600' : 'text-gray-900'}`}>₹{dep.price.toLocaleString('en-IN')}</p>
                          {dep.tag && (
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
                              {dep.tag}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>₹{selectedPrice.toLocaleString('en-IN')} × {totalTravellers} traveller{totalTravellers > 1 ? 's' : ''}</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600 font-medium">You save</span>
                    <span className="text-green-600 font-bold">₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base text-gray-900 mt-2 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Book button */}
              <button
                onClick={() => navigate(`/tour-packages/${pkg.id}/book`)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-colors text-base"
              >
                Book This Package →
              </button>
              <div className="flex items-start gap-[8px] mt-[16px] px-2">
                <svg className="w-[14px] h-[14px] text-[#6B6B6B] shrink-0 mt-[3px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p className="text-[12px] text-[#6B6B6B] leading-[1.4]">No payment charged now, free cancellation within 24 hrs</p>
              </div>
            </div>

            {/* Info Grid Card */}
            <div className="bg-white rounded-[16px] shadow-sm border border-[#e5e5e5] p-[20px] mb-4" style={{ fontFamily: '"Quicksand", sans-serif' }}>
              <div className="grid grid-cols-2 gap-y-[24px] gap-x-[16px]">
                {[
                  { 
                    label: 'Duration', 
                    value: pkg.duration,
                    icon: (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Group Type', 
                    value: pkg.groupTypes || pkg.groupType,
                    icon: (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Destination', 
                    value: pkg.destination,
                    icon: (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Departures', 
                    value: `${pkg.departures}+ trips`,
                    icon: (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Meals', 
                    value: pkg.mealsIncluded || 'Breakfast daily',
                    icon: (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <rect x="6" y="8" width="12" height="12" rx="2" ry="2" />
                        <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Flights', 
                    value: pkg.flightsIncluded ? 'Included ✓' : 'Not included',
                    icon: (
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )
                  },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center gap-[14px]">
                    <div className="w-[42px] h-[42px] rounded-[12px] bg-[#fef2f2] flex items-center justify-center text-[#ef4444] shrink-0">
                      {icon}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[13px] text-[#6B6B6B] leading-none mb-[4px]">{label}</p>
                      <p className="text-[14px] font-bold text-[#1A1A1A] leading-none">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Help Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Need help choosing?</p>
                  <p className="text-xs text-gray-500">Our travel experts are available 24/7</p>
                </div>
              </div>
              <button className="w-full border border-red-400 text-red-500 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm mb-2">
                Talk to an Expert
              </button>
              <p className="text-xs text-center text-gray-500">
                📞 <strong>1800-000-4567</strong> · Free
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

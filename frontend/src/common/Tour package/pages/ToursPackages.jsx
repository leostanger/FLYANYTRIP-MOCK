import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Heart, ChevronDown, SlidersHorizontal } from 'lucide-react'
import Navbar from '../../../components/common/Navbar'
import TopBar from '../../../components/common/TopBar'
import Footer from '../../../components/common/Footer'
import packages from '../data/packages.json'

// ─── Constants ────────────────────────────────────────────────────────────────
const PRICE_MIN = 1000
const PRICE_MAX = 115000



// ─── Collapsible Filter Section ───────────────────────────────────────────────
function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-t border-gray-100 pt-3 pb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-2 bg-transparent border-none p-0 cursor-pointer"
      >
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  )
}

// ─── Checkbox Item ────────────────────────────────────────────────────────────
function CBItem({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer py-1 group">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
        checked ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white group-hover:border-red-400'
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {children}
    </label>
  )
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg, navigate }) {
  const [liked, setLiked] = useState(false)
  const shown = pkg.amenities.slice(0, 4)
  const extra = pkg.amenities.length - 4

  return (
    <div className="w-[364.65px] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300 shrink-0">
      {/* Image */}
      <div className="relative w-full h-[160px] overflow-hidden shrink-0">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-[#f12b19] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm tracking-wide">
          {pkg.category}
        </span>
        {/* Heart button */}
        <button
          id={`wishlist-${pkg.id}`}
          onClick={() => setLiked(l => !l)}
          aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur p-1.5 rounded-full shadow hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            className={liked ? 'text-red-500 fill-red-500' : 'text-gray-500'}
          />
        </button>
        {/* Duration badge */}
        <span className="absolute bottom-3 left-3 bg-white text-gray-900 text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
          {pkg.duration}
        </span>
      </div>

      {/* Card body */}
      <div className="p-[18px] flex flex-col flex-1" style={{ fontFamily: '"Quicksand", sans-serif' }}>
        {/* Title */}
        <h3 className="text-[18px] font-bold text-[#1a1a1a] leading-[1.2]">{pkg.title}</h3>

        {/* Location */}
        <p className="text-[13px] font-medium text-[#6B6B6B] mt-[4px] tracking-wide">{pkg.location}</p>

        {/* Stars */}
        <div className="flex items-center gap-[6px] mt-[8px]">
          <div className="flex items-center gap-[2px]">
            {[1, 2, 3, 4, 5].map(i => (
              <svg
                key={i}
                className={`w-[14px] h-[14px] ${i <= Math.round(pkg.rating) ? 'text-[#F12B19]' : 'text-[#e5e5e5]'}`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[13px] text-[#6B6B6B] font-medium leading-none mt-[2px]">{pkg.rating} ({pkg.reviews?.toLocaleString('en-IN')} reviews)</span>
        </div>

        {/* Amenity tags */}
        <div className="flex flex-wrap gap-[6px] mt-[14px]">
          {shown.map((a, i) => (
            <span 
              key={i} 
              className="flex items-center gap-[4px] text-[12px] font-semibold text-[#6B6B6B] bg-white px-[6px] py-[2px]"
              style={{
                borderRadius: '3.75px',
                border: '0.8px solid #6B6B6B'
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6B6B]">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {a}
            </span>
          ))}
          {extra > 0 && (
            <span 
              className="text-[12px] font-semibold text-[#6B6B6B] bg-white px-[6px] py-[2px] flex items-center"
              style={{
                borderRadius: '3.75px',
                border: '0.8px dashed #6B6B6B'
              }}
            >
              +{extra} more
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        <hr className="border-[#eaeaea] mt-[18px] mb-[14px] w-full" />

        {/* Pricing block */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] text-[#8c8c8c] line-through font-medium leading-none mb-[4px]">
              &#8377;{pkg.originalPrice.toLocaleString('en-IN')}
            </span>
            <span 
              className="font-bold text-[#1A1A1A] leading-none mb-[4px]"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '22px',
              }}
            >
              &#8377;{pkg.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[12.5px] text-[#6B6B6B] font-medium leading-none">per person</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[12px] font-bold text-[#1A1A1A] bg-[#f0f0f0] px-[10px] py-[5px] rounded-full mb-[8px] leading-none">
              {pkg.discount}% off
            </span>
            <span className="text-[12.5px] text-[#6B6B6B] font-medium leading-none">
              {pkg.departures} departures
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          id={`view-pkg-${pkg.id}`}
          onClick={() => navigate(`/tour-packages/${pkg.id}`)}
          className="w-full bg-[#E53935] hover:bg-[#c9312d] text-white font-bold py-[12px] rounded-[8px] transition-colors mt-[16px] text-[14.5px]"
        >
          View Package Details
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ToursPackages() {
  const navigate = useNavigate()
  const [minPrice, setMinPrice] = useState(1000)
  const [maxPrice, setMaxPrice] = useState(115000)
  const [openSections, setOpenSections] = useState({
    price: true, stars: true,
    destination: true, groupType: true
  })
  const toggleSection = (section) =>
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))

  const [starFilter, setStarFilter]             = useState([])
  const [destinationFilter, setDestinationFilter] = useState([])
  const [groupTypeFilter, setGroupTypeFilter]     = useState([])
  const [sortBy, setSortBy]                       = useState('popularity')

  const toggle = (setter, val) =>
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])

  const toggleStarFilter = (star) => toggle(setStarFilter, star)
  const toggleDestinationFilter = (dest) => toggle(setDestinationFilter, dest)
  const toggleGroupTypeFilter = (type) => toggle(setGroupTypeFilter, type)

  const resetFilters = () => {
    setMinPrice(1000)
    setMaxPrice(115000)
    setStarFilter([])
    setDestinationFilter([])
    setGroupTypeFilter([])
    setSortBy('popularity')
  }

  const resetAll = resetFilters

  const filtered = useMemo(() => {
    let r = [...packages]
    r = r.filter(p => p.price >= minPrice && p.price <= maxPrice)
    if (starFilter.length) {
      const minStar = Math.min(...starFilter)
      r = r.filter(p => (p.stars ?? 5) >= minStar)
    }
    if (destinationFilter.length) r = r.filter(p => destinationFilter.includes(p.destination))
    if (groupTypeFilter.length)   r = r.filter(p => groupTypeFilter.includes(p.groupType))
    if (sortBy === 'price')  r = [...r].sort((a, b) => a.price - b.price)
    if (sortBy === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [minPrice, maxPrice, starFilter, destinationFilter, groupTypeFilter, sortBy])

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Navbar />

      {/* Page header */}
      <div className="max-w-[1560px] mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Tour Packages &amp; Holiday Deals</h1>
        <p className="text-gray-500 text-sm mt-1">
          All-inclusive packages curated by expert travel designers. Flights + Hotels + Sightseeing + Meals.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1560px] mx-auto px-6 pb-12 flex gap-4 items-start">

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="w-[323.867px] flex-shrink-0 sticky top-4 hidden lg:block space-y-6">

          {/* FILTERS header block */}
          <div className="w-[323.867px] bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] px-[23.13px] flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-[64.773px]">
            <div className="flex items-center gap-[6px]">
              <SlidersHorizontal size={18} className="text-[#333]" />
              <span className="font-satoshi font-bold text-[18.507px] text-[#333]">Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[15.037px] font-semibold text-[#f12b19] hover:text-red-700 bg-transparent border-none cursor-pointer transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* FILTERS body card */}
          <div className="bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-[23px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            
            {/* FILTER: Price Range */}
            <div className="select-none">
              <style>{`
                .price-thumb::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 18.507px;
                  height: 18.507px;
                  border-radius: 50%;
                  background: white;
                  border: 2.313px solid #f12b19;
                  cursor: pointer;
                  pointer-events: auto;
                  box-shadow: 0px 1.157px 3.47px 0px rgba(0,0,0,0.2);
                }
                .price-thumb::-moz-range-thumb {
                  width: 18.507px;
                  height: 18.507px;
                  border: 2.313px solid #f12b19;
                  border-radius: 50%;
                  background: white;
                  cursor: pointer;
                  pointer-events: auto;
                  box-shadow: 0px 1.157px 3.47px 0px rgba(0,0,0,0.2);
                }
                .price-thumb::-webkit-slider-runnable-track {
                  background: transparent;
                }
                .price-thumb::-moz-range-track {
                  background: transparent;
                }
              `}</style>

              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer mb-4"
              >
                <span>Price Range</span>
                {!openSections.price ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                )}
              </button>

              {openSections.price && (() => {
                const PRICE_MIN = 1000;
                const PRICE_MAX = 115000;
                const minPct = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
                const maxPct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
                return (
                  <div className="px-1">
                    <div className="flex items-center justify-between mb-3 text-[14px] font-bold text-[#333]">
                      <span>₹{minPrice.toLocaleString('en-IN')}</span>
                      <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="relative h-[20px] flex items-center mb-4">
                      <div className="absolute inset-x-0 h-[4px] rounded-full bg-[#EAEAEA]" />
                      <div
                        className="absolute h-[4px] rounded-full bg-[#F12B19]"
                        style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                      />
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={1000}
                        value={minPrice}
                        onChange={(e) => {
                          const val = Math.min(parseInt(e.target.value), maxPrice - 1000);
                          setMinPrice(val);
                        }}
                        className="absolute inset-x-0 w-full h-full appearance-none bg-transparent price-thumb"
                        style={{ zIndex: minPrice > PRICE_MAX - 10000 ? 20 : 10 }}
                      />
                      <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={1000}
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Math.max(parseInt(e.target.value), minPrice + 1000);
                          setMaxPrice(val);
                        }}
                        className="absolute inset-x-0 w-full h-full appearance-none bg-transparent price-thumb"
                        style={{ zIndex: 20 }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <hr className="border-gray-100" />
            
            {/* FILTER: Star Rating */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('stars')}
                className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
              >
                <span>Star Rating</span>
                {!openSections.stars ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                )}
              </button>
              {openSections.stars && (
                <div className="space-y-4 pt-2">
                  {[5, 4, 3, 2].map((star) => (
                    <label key={star} className="flex items-center gap-3 cursor-pointer select-none group" style={{ minHeight: '22px' }}>
                      <input
                        type="checkbox"
                        checked={starFilter.includes(star)}
                        onChange={() => toggleStarFilter(star)}
                        className="hidden"
                      />
                      <div
                        className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: starFilter.includes(star) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                          background: starFilter.includes(star) ? '#F12B19' : 'white',
                          boxShadow: starFilter.includes(star) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                        }}
                      >
                        {starFilter.includes(star) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-[3px]">
                          {[...Array(star)].map((_, idx) => (
                            <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill="#6B6B6B" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[13.125px] font-['Quicksand'] font-medium text-[#6B6B6B]">
                          &amp; above
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-100" />
            
            {/* FILTER: Destination */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('destination')}
                className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
              >
                <span>Destination</span>
                {!openSections.destination ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                )}
              </button>
              {openSections.destination && (
                <div className="space-y-4 pt-2">
                  {['India', 'Bali', 'Singapore', 'Thailand'].map((dest) => (
                    <label key={dest} className="flex items-center gap-3 cursor-pointer select-none group" style={{ minHeight: '22px' }}>
                      <input
                        type="checkbox"
                        checked={destinationFilter.includes(dest)}
                        onChange={() => toggleDestinationFilter(dest)}
                        className="hidden"
                      />
                      <div
                        className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: destinationFilter.includes(dest) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                          background: destinationFilter.includes(dest) ? '#F12B19' : 'white',
                          boxShadow: destinationFilter.includes(dest) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                        }}
                      >
                        {destinationFilter.includes(dest) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[14px] font-['Quicksand'] font-medium text-[#4A4A4A]">
                        {dest}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-gray-100" />
            
            {/* FILTER: Group Type */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('groupType')}
                className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
              >
                <span>Group Type</span>
                {!openSections.groupType ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                )}
              </button>
              {openSections.groupType && (
                <div className="space-y-4 pt-2">
                  {['Family', 'Honeymoon', 'Solo', 'Friends'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer select-none group" style={{ minHeight: '22px' }}>
                      <input
                        type="checkbox"
                        checked={groupTypeFilter.includes(type)}
                        onChange={() => toggleGroupTypeFilter(type)}
                        className="hidden"
                      />
                      <div
                        className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: groupTypeFilter.includes(type) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                          background: groupTypeFilter.includes(type) ? '#F12B19' : 'white',
                          boxShadow: groupTypeFilter.includes(type) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                        }}
                      >
                        {groupTypeFilter.includes(type) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[14px] font-['Quicksand'] font-medium text-[#4A4A4A]">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </aside>

        {/* ─── RIGHT CONTENT ─── */}
        <main className="flex-1 min-w-0">

          {/* Results bar */}
          <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 rounded-[12px] px-5 py-3 shadow-sm">
            <span className="text-[14px] text-gray-500 font-medium">
              {filtered.length} package found
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-gray-500 text-[14px]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="4" x2="7" y2="20"></line>
                  <polyline points="3 8 7 4 11 8"></polyline>
                  <line x1="17" y1="20" x2="17" y2="4"></line>
                  <polyline points="21 16 17 20 13 16"></polyline>
                </svg>
                <span>Sort:</span>
              </div>
              <div className="flex items-center gap-2">
                {[
                  { k: 'popularity', l: 'Popularity' },
                  { k: 'price',      l: 'Price \u2191' },
                  { k: 'rating',     l: 'Rating' },
                ].map(({ k, l }) => (
                  <button
                    key={k}
                    id={`sort-${k}`}
                    onClick={() => setSortBy(k)}
                    className={`text-[13px] font-medium px-4 py-1.5 rounded-[8px] border transition-all ${
                      sortBy === k
                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div className="flex flex-wrap gap-5 w-full">
              {filtered.map(pkg => (
                <div key={pkg.id} className="flex flex-col h-full">
                  <PackageCard pkg={pkg} navigate={navigate} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <svg className="w-14 h-14 mb-4 opacity-25" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-base font-semibold text-gray-500">No packages found</p>
              <p className="text-sm mt-1 text-gray-400">Try adjusting your filters</p>
              <button onClick={resetAll} className="mt-4 text-sm text-red-500 font-semibold hover:underline">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}

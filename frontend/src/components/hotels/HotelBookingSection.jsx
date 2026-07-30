import { useState } from 'react'
import {
  MapPin, Star, Heart, Share2, Camera, Wifi, Waves, Utensils,
  Dumbbell, Car, Coffee, Clock, Phone, ChevronRight, ArrowLeft,
  ChevronLeft, Check, X, Flower2, ArrowRight, ShieldCheck
} from 'lucide-react'

import hotelImg1 from '../../assets/hotels/City View from Room.jpg'
import hotelImg2 from '../../assets/Hotel section/extracted_images/Hotel The Royal Krishna.jpg'
import hotelImg3 from '../../assets/hotels/Hotel-Inspired Guest Space With White Bedding And Golden Touch.jpg'
import hotelImg4 from '../../assets/hotels/India - Nahargarh Fort, in the Indian state of Rajasthan, stands on the edge of the Aravalli Hills and offers great views over the city of Jaipur_.jpg'

const HOTEL_IMAGES = [hotelImg1, hotelImg2, hotelImg3, hotelImg4, hotelImg1]

// Amenity icon mapping
function AmenityIcon({ name, size = 15 }) {
  const n = name.toLowerCase()
  if (n.includes('wifi')) return <Wifi size={size} className="text-[#F12B19]" />
  if (n.includes('pool')) return <Waves size={size} className="text-[#F12B19]" />
  if (n.includes('breakfast') || n.includes('dining') || n.includes('restaurant')) return <Utensils size={size} className="text-[#F12B19]" />
  if (n.includes('gym')) return <Dumbbell size={size} className="text-[#F12B19]" />
  if (n.includes('parking')) return <Car size={size} className="text-[#F12B19]" />
  if (n.includes('spa') || n.includes('wellness')) return <Flower2 size={size} className="text-[#F12B19]" />
  if (n.includes('bar') || n.includes('coffee')) return <Coffee size={size} className="text-[#F12B19]" />
  return <Check size={size} className="text-[#F12B19]" />
}

// Star Rating Row
function StarRow({ count = 5, filled = 5, size = 11 }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#D0D0D0] fill-[#D0D0D0]'}
        />
      ))}
    </div>
  )
}

export default function HotelBookingSection({ hotel, searchDetails, onBack, onConfirmBooking }) {
  // ── Date / Nights / Guests state ──
  const [checkinDate, setCheckinDate] = useState(searchDetails.checkin || '2026-12-20')
  const [checkoutDate, setCheckoutDate] = useState(searchDetails.checkout || '2026-12-23')
  const [nightsCount, setNightsCount] = useState(searchDetails.nights || 3)
  const [guestsCount, setGuestsCount] = useState(searchDetails.guests || 2)
  const [saved, setSaved] = useState(false)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  const calculateNights = (inDate, outDate) => {
    try {
      const d1 = new Date(inDate)
      const d2 = new Date(outDate)
      return Math.max(Math.ceil((d2 - d1) / 86400000), 1)
    } catch { return 1 }
  }

  const handleCheckinChange = (val) => {
    setCheckinDate(val)
    const co = new Date(checkoutDate)
    const ci = new Date(val)
    if (co <= ci) {
      const next = new Date(ci)
      next.setDate(next.getDate() + 1)
      const s = next.toISOString().split('T')[0]
      setCheckoutDate(s)
      setNightsCount(1)
    } else {
      setNightsCount(calculateNights(val, checkoutDate))
    }
  }

  const handleCheckoutChange = (val) => {
    setCheckoutDate(val)
    const co = new Date(val)
    const ci = new Date(checkinDate)
    if (co <= ci) {
      const prev = new Date(co)
      prev.setDate(prev.getDate() - 1)
      const s = prev.toISOString().split('T')[0]
      setCheckinDate(s)
      setNightsCount(1)
    } else {
      setNightsCount(calculateNights(checkinDate, val))
    }
  }

  const handleNightsChange = (n) => {
    if (n < 1) return
    setNightsCount(n)
    const d = new Date(checkinDate)
    d.setDate(d.getDate() + n)
    setCheckoutDate(d.toISOString().split('T')[0])
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return { dayMonth: '', weekday: '', full: '' }
    const d = new Date(dateStr)
    if (isNaN(d)) return { dayMonth: dateStr, weekday: '', full: dateStr }
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    return {
      dayMonth: `${d.getDate()} ${months[d.getMonth()]}`,
      weekday: days[d.getDay()],
      full: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }
  }

  const checkin = formatDate(checkinDate)
  const checkout = formatDate(checkoutDate)

  const ratePerNight = hotel.price || 9800
  const originalRate = hotel.originalPrice || 14000
  const taxesPerNight = hotel.taxes || 1176
  const totalBase = ratePerNight * nightsCount
  const totalFinal = totalBase + taxesPerNight * nightsCount

  const AMENITIES = [
    { label: 'Free WiFi', icon: 'wifi' },
    { label: '3 Pools', icon: 'pool' },
    { label: 'Breakfast Options', icon: 'breakfast' },
    { label: 'Gym', icon: 'gym' },
    { label: '4 Restaurants', icon: 'restaurant' },
    { label: 'Free Parking', icon: 'parking' },
  ]

  const HIGHLIGHTS = [
    'Beachfront location',
    'Multiple dining options',
    'Kids zone',
    '3 outdoor pools',
    'Spa & wellness',
    'Water sports',
  ]

  const SIMILAR_HOTELS = [
    { name: 'Taj Exotica Resort & Spa', location: 'Benaulim Beach, South Goa', price: 12400, stars: 5, img: hotelImg2 },
    { name: 'Taj Exotica Resort & Spa', location: 'Benaulim Beach, South Goa', price: 12400, stars: 5, img: hotelImg3 },
    { name: 'Taj Exotica Resort & Spa', location: 'Benaulim Beach, South Goa', price: 12400, stars: 5, img: hotelImg4 },
  ]

  const reviewCategories = [
    { label: 'Location', score: 4.8 },
    { label: 'Cleanliness', score: 4.7 },
    { label: 'Service', score: 4.8 },
    { label: 'Rooms', score: 4.6 },
    { label: 'Value', score: 4.4 },
  ]

  const handleBookNow = () => {
    onConfirmBooking({
      checkinDate,
      checkoutDate,
      nightsCount,
      guestsCount,
    })
  }

  return (
    <div className="w-full animate-fadeIn font-quicksand">

      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-[5px] mb-5 text-[13px] font-['Quicksand']">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors bg-transparent border-none cursor-pointer p-0 font-semibold">
          <ArrowLeft size={14} />
          <span>Home</span>
        </button>
        <ChevronRight size={10} className="text-[#6B6B6B]" />
        <span className="text-[#6B6B6B] font-semibold cursor-pointer hover:text-[#1A1A1A]" onClick={onBack}>Hotels</span>
        <ChevronRight size={10} className="text-[#6B6B6B]" />
        <span className="text-[#1A1A1A] font-semibold">Radisson Blu Resort</span>
      </div>

      {/* ── PHOTO GALLERY ── */}
      <div className="relative mb-5">
        <div className="grid grid-cols-[1fr_0.5fr] gap-[7.5px] h-[340px] rounded-[12px] overflow-hidden">
          {/* Large left image */}
          <div className="relative overflow-hidden rounded-l-[12px] group cursor-pointer" onClick={() => setShowAllPhotos(true)}>
            <img
              src={HOTEL_IMAGES[0]}
              alt="Hotel main"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            {/* Luxury badge */}
            <div className="absolute top-[11px] left-[11px] bg-white rounded-[6px] px-[8px] py-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
              <span className="text-[12px] font-bold text-[#1A1A1A] font-['Quicksand']">{hotel.badge || 'Luxury'}</span>
            </div>
          </div>

          {/* Right 2x2 grid */}
          <div className="grid grid-rows-2 grid-cols-2 gap-[7.5px]">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="relative overflow-hidden cursor-pointer group" onClick={() => { setActivePhoto(idx); setShowAllPhotos(true) }}>
                <img
                  src={HOTEL_IMAGES[idx % HOTEL_IMAGES.length]}
                  alt={`Hotel ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                {/* "View all photos" overlay on last image */}
                {idx === 4 && (
                  <div className="absolute inset-0 bg-black/40 flex items-end justify-end p-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowAllPhotos(true) }}
                      className="flex items-center gap-[6px] bg-white rounded-[6px] px-[12px] py-[6px] text-[12px] font-bold text-[#1A1A1A] shadow cursor-pointer border-none"
                    >
                      <Camera size={11} />
                      View all photos
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* View all photos button (bottom-right) */}
        <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-3 right-3 flex items-center gap-[6px] bg-white rounded-[6px] px-[12px] py-[6px] text-[12px] font-bold text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.15)] cursor-pointer border border-[#E2E2E2] hover:shadow-md transition-all z-10"
        >
          <Camera size={11} />
          View all photos
        </button>
      </div>

      {/* ── HOTEL HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-[5px]">
          <h1 className="text-[28px] font-extrabold text-[#1A1A1A] leading-tight font-['Quicksand']">
            {hotel.name || 'Radisson Blu Resort'}
          </h1>
          <div className="flex items-center gap-[11px] flex-wrap">
            <div className="flex items-center gap-[5px]">
              <MapPin size={12} className="text-[#6B6B6B] flex-shrink-0" />
              <span className="text-[13px] text-[#6B6B6B] font-['Quicksand'] font-medium">
                Cavelossim, South Goa, Goa
              </span>
            </div>
            <span className="text-[#D0D0D0] text-[14px]">·</span>
            <div className="flex items-center gap-[7px]">
              <StarRow count={5} filled={hotel.stars || 5} size={11} />
              <span className="text-[13px] font-bold text-[#1A1A1A] font-['Quicksand']">{hotel.rating || 4.6}</span>
              <span className="text-[13px] text-[#6B6B6B] font-['Quicksand']">({hotel.reviews || '3,120'} reviews)</span>
            </div>
          </div>
        </div>

        {/* Save + Share buttons */}
        <div className="flex items-center gap-[8px] flex-shrink-0">
          <button
            onClick={() => setSaved(!saved)}
            className={`flex items-center gap-[6px] border rounded-[8px] px-[16px] py-[8px] text-[13px] font-semibold transition-all cursor-pointer ${saved ? 'bg-red-50 border-red-200 text-[#F12B19]' : 'bg-white border-[#E2E2E2] text-[#1A1A1A]'}`}
          >
            <Heart size={13} className={saved ? 'fill-[#F12B19] text-[#F12B19]' : ''} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button className="flex items-center gap-[6px] border border-[#E2E2E2] bg-white rounded-[8px] px-[16px] py-[8px] text-[13px] font-semibold text-[#1A1A1A] cursor-pointer hover:bg-gray-50 transition-colors">
            <Share2 size={13} />
            Share
          </button>
        </div>
      </div>

      {/* ── MAIN TWO-COLUMN LAYOUT ── */}
      <div className="flex gap-[22px] items-start">

        {/* ── LEFT COLUMN: CONTENT ── */}
        <div className="flex-1 min-w-0 space-y-0">

          {/* About This Hotel */}
          <div className="bg-white rounded-[12px] border border-[#F0F0F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[20px] mb-[16px]">
            <h2 className="text-[20px] font-extrabold text-[#1A1A1A] mb-[10px] font-['Quicksand']">About This Hotel</h2>
            <p className="text-[13.5px] text-[#444] leading-[1.7] mb-[14px]">
              {hotel.longDescription || 'The Radisson Blu Resort Goa is an award-winning beachfront resort in Cavelossim, South Goa. Known for its world-class service, sprawling gardens, and direct beach access. The Radisson Blu Resort Goa is an award-winning beachfront resort in Cavelossim, South Goa. Known for its world-class service, sprawling gardens, and direct beach access. The Radisson Blu Resort Goa is an award-winning beachfront resort in Cavelossim, South Goa. Known for its world-class service, sprawling gardens, and direct beach access.'}
            </p>
            {/* Highlights 2-column grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-0">
              {(hotel.highlights || HIGHLIGHTS).map((h, i) => (
                <div key={i} className="flex items-center gap-[8px] py-[8px] border-b border-[#F5F5F5] last:border-0">
                  <div className="w-[15px] h-[15px] rounded-full bg-[#E6F4EA] flex items-center justify-center flex-shrink-0">
                    <Check size={10} strokeWidth={4} className="text-[#34A853]" />
                  </div>
                  <span className="text-[13px] font-medium text-[#333]">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Amenities */}
          <div className="bg-white rounded-[12px] border border-[#F0F0F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[20px] mb-[16px]">
            <h2 className="text-[20px] font-extrabold text-[#1A1A1A] mb-[14px] font-['Quicksand']">Hotel Amenities</h2>
            <div className="grid grid-cols-4 gap-[10px]">
              {AMENITIES.map((amenity, i) => (
                <div key={i} className="flex flex-col items-center gap-[8px] border border-[#F0F0F0] rounded-[10px] p-[12px] hover:border-[#F12B19]/30 hover:bg-[#FFF8F8] transition-all">
                  <div className="w-[30px] h-[30px] bg-[#FFF0EF] rounded-full flex items-center justify-center flex-shrink-0">
                    <AmenityIcon name={amenity.icon} size={15} />
                  </div>
                  <span className="text-[12px] font-semibold text-[#333] text-center leading-tight">{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Policies */}
          <div className="bg-white rounded-[12px] border border-[#F0F0F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[20px] mb-[16px]">
            <h2 className="text-[20px] font-extrabold text-[#1A1A1A] mb-[14px] font-['Quicksand']">Hotel Policies</h2>
            <div className="grid grid-cols-3 gap-[12px]">
              {[
                { icon: <Clock size={12} className="text-[#6B6B6B]" />, label: 'Check-in', value: '2:00 PM' },
                { icon: <Clock size={12} className="text-[#6B6B6B]" />, label: 'Check-out', value: '12:00 PM' },
                { icon: <Check size={12} className="text-[#6B6B6B]" />, label: 'Cancellation', value: 'Free cancellation up to 48 hrs' },
              ].map((policy, i) => (
                <div key={i} className="border border-[#F0F0F0] rounded-[10px] p-[12px]">
                  <div className="flex items-center gap-[5px] mb-[5px]">
                    {policy.icon}
                    <span className="text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">{policy.label}</span>
                  </div>
                  <span className="text-[14px] font-bold text-[#1A1A1A]">{policy.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Nearby */}
          <div className="bg-white rounded-[12px] border border-[#F0F0F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[20px] mb-[16px]">
            <h2 className="text-[20px] font-extrabold text-[#1A1A1A] mb-[14px] font-['Quicksand']">Location &amp; Nearby</h2>
            
            {/* Map mockup */}
            <div className="relative rounded-[12px] overflow-hidden h-[160px] mb-[16px] bg-[#f8f9fa]">
              <img src={HOTEL_IMAGES[0]} alt="Map background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <MapPin size={28} strokeWidth={2} className="text-[#F12B19] mb-1" />
                <p className="text-[14px] font-bold text-[#1A1A1A]">{hotel.name || 'Radisson Blu Resort'}</p>
                <p className="text-[12px] text-[#6B6B6B]">{hotel.location || 'Cavelossim, South Goa'}</p>
              </div>
            </div>

            {/* Nearby distances */}
            <div className="grid grid-cols-2 gap-x-[30px]">
              {/* Left Column */}
              <div className="flex flex-col">
                {(hotel.nearby?.left || [
                  { name: 'Cavelossim Beach', distance: 'On-property' },
                  { name: 'Dabolim Airport', distance: '30 km' }
                ]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-[12px] border-b border-[#F0F0F0]">
                    <span className="text-[13.5px] font-semibold text-[#1A1A1A]">{item.name}</span>
                    <span className="text-[13px] text-[#888]">{item.distance}</span>
                  </div>
                ))}
              </div>
              {/* Right Column */}
              <div className="flex flex-col">
                {(hotel.nearby?.right || [
                  { name: 'Mobor Beach', distance: '1 km' }
                ]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-[12px] border-b border-[#F0F0F0]">
                    <span className="text-[13.5px] font-semibold text-[#1A1A1A]">{item.name}</span>
                    <span className="text-[13px] text-[#888]">{item.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guest Reviews */}
          <div className="bg-white rounded-[12px] border border-[#F0F0F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[20px] mb-[16px]">
            <div className="grid grid-cols-[1fr_1fr] gap-[30px] items-start">
              
              {/* Left Column: Stats & Bars */}
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-[20px]">
                  <h2 className="text-[20px] font-extrabold text-[#1A1A1A] font-['Quicksand']">Guest Reviews</h2>
                  <div className="flex items-center gap-[10px]">
                    <span className="text-[24px] font-extrabold text-[#1A1A1A] leading-none">{hotel.rating || 4.6}</span>
                    <div className="flex flex-col gap-[2px]">
                      <StarRow count={5} filled={5} size={10} />
                      <span className="text-[11px] text-[#888] font-medium leading-none">{hotel.reviews || '3,120'} reviews</span>
                    </div>
                  </div>
                </div>

                {/* Rating bars */}
                <div className="space-y-[14px]">
                  {reviewCategories.map((cat, i) => (
                    <div key={i} className="flex items-center gap-[12px]">
                      <span className="text-[13px] text-[#666] w-[80px] flex-shrink-0">{cat.label}</span>
                      <div className="flex-1 h-[6px]">
                        <div
                          className="h-full bg-[#F4C430] rounded-full"
                          style={{ width: `${(cat.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-bold text-[#1A1A1A] w-[24px] text-right">{cat.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Review Card */}
              <div className="h-full flex items-center">
                <div className="w-full bg-white border border-[#E8E8E8] rounded-[12px] p-[20px] shadow-sm relative">
                  <div className="flex items-center gap-[12px] mb-[14px]">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#4169E1] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[15px] font-semibold">V</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1A1A1A]">Vivek Sharma</p>
                      <p className="text-[12px] text-[#888]">Mumbai · Nov 2024</p>
                    </div>
                    <div className="ml-auto self-start mt-1">
                      <StarRow count={5} filled={5} size={11} />
                    </div>
                  </div>
                  <p className="text-[13px] text-[#666] leading-[1.6] mb-[20px]">
                    "Excellent resort. The sea view from our room was breathtaking. Staff went above and beyond."
                  </p>
                  
                  {/* Carousel dots */}
                  <div className="flex items-center justify-center gap-[6px]">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className={`rounded-full transition-all ${i === 0 ? 'w-[7px] h-[7px] bg-[#999]' : 'w-[7px] h-[7px] bg-[#E2E2E2]'}`} />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Similar Hotels in Goa */}
          <div className="bg-white rounded-[12px] border border-[#F0F0F0] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-[20px]">
            <h2 className="text-[20px] font-extrabold text-[#1A1A1A] mb-[14px] font-['Quicksand']">Similar Hotels in Goa</h2>
            <div className="grid grid-cols-3 gap-[14px]">
              {SIMILAR_HOTELS.map((h, i) => (
                <div key={i} className="rounded-[10px] overflow-hidden border border-[#F0F0F0] cursor-pointer hover:shadow-md transition-all group">
                  <div className="relative h-[150px] overflow-hidden">
                    <img src={h.img} alt={h.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-400" />
                    {/* Stars on image */}
                    <div className="absolute bottom-[10px] left-[8px]">
                      <StarRow count={5} filled={5} size={12} />
                    </div>
                    {/* Badge */}
                    <div className="absolute top-[7px] right-[7px] bg-white rounded-[5px] px-[8px] py-[3px]">
                      <span className="text-[11px] font-bold text-[#1A1A1A]">Luxury</span>
                    </div>
                  </div>
                  <div className="p-[11px]">
                    <p className="text-[13px] font-bold text-[#1A1A1A] mb-[3px] truncate">{h.name}</p>
                    <div className="flex items-center gap-[4px] mb-[7px]">
                      <MapPin size={8} className="text-[#6B6B6B] flex-shrink-0" />
                      <span className="text-[11px] text-[#6B6B6B] truncate">{h.location}</span>
                    </div>
                    <p className="text-[13px] font-extrabold text-[#1A1A1A]">₹{h.price.toLocaleString('en-IN')} <span className="text-[11px] font-medium text-[#6B6B6B]">/ night</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: STICKY BOOKING CARD ── */}
        <div className="w-[285px] flex-shrink-0 sticky top-[90px] space-y-[14px]">

          {/* Main Booking Card */}
          <div className="bg-white rounded-[14px] border border-[#E2E2E2] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="p-[20px]">
              {/* Price header */}
              <div className="mb-[16px]">
                {/* Line 1: Original Price & Discount Badge */}
                <div className="flex items-center gap-[10px] mb-1">
                  <span className="text-[14px] font-['JetBrains_Mono'] font-medium text-[#8F8F8F] line-through leading-none">
                    ₹{originalRate.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[12px] font-satoshi font-bold text-[#447A55] bg-[#E8F3EA] px-[10px] py-[3px] rounded-full">
                    {Math.round((1 - ratePerNight / originalRate) * 100)}% off
                  </span>
                </div>

                {/* Line 2: Current Price & Taxes/Night on the same line */}
                <div className="flex items-baseline gap-[6px] whitespace-nowrap mt-1">
                  <span className="text-[36px] font-['JetBrains_Mono'] font-bold text-[#1A1A1A] leading-none tracking-tight">
                    ₹{ratePerNight.toLocaleString('en-IN')}
                  </span>
                  <div className="flex gap-1 text-[#6b6b6b] text-[14px] font-['Quicksand'] font-medium">
                    <span>/night</span>
                  </div>
                </div>
              </div>

              {/* Check-in / Check-out */}
              <div className="grid grid-cols-2 gap-[10px] mb-[10px]">
                <div className="relative border border-[#E2E2E2] rounded-[12px] p-[12px] bg-white cursor-pointer hover:border-[#BDBDBD] transition-colors">
                  <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B] block mb-[4px]">Check-in</span>
                  <span className="text-[16px] font-satoshi font-bold text-[#1A1A1A] leading-tight block mb-[2px]">{checkin.dayMonth}</span>
                  <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B]">{checkin.weekday}</span>
                  <input
                    type="date"
                    value={checkinDate}
                    onChange={e => handleCheckinChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <div className="relative border border-[#E2E2E2] rounded-[12px] p-[12px] bg-white cursor-pointer hover:border-[#BDBDBD] transition-colors">
                  <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B] block mb-[4px]">Check-out</span>
                  <span className="text-[16px] font-satoshi font-bold text-[#1A1A1A] leading-tight block mb-[2px]">{checkout.dayMonth}</span>
                  <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B]">{checkout.weekday}</span>
                  <input
                    type="date"
                    value={checkoutDate}
                    onChange={e => handleCheckoutChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {/* Nights + Guests */}
              <div className="grid grid-cols-2 gap-[10px] mb-[16px]">
                <div className="border border-[#E2E2E2] rounded-[12px] p-[12px] bg-white flex flex-col justify-center">
                  <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B] block mb-[8px]">Nights</span>
                  <div className="flex items-center gap-[12px]">
                    <button
                      onClick={() => handleNightsChange(nightsCount - 1)}
                      className="w-[24px] h-[24px] rounded-[6px] border border-[#E2E2E2] bg-white flex items-center justify-center text-[#1a1a1a] font-medium hover:border-[#1a1a1a] cursor-pointer transition-colors"
                    >-</button>
                    <span className="text-[16px] font-satoshi font-bold text-[#1A1A1A] w-3 text-center">{nightsCount}</span>
                    <button
                      onClick={() => handleNightsChange(nightsCount + 1)}
                      className="w-[24px] h-[24px] rounded-[6px] border border-[#E2E2E2] bg-white flex items-center justify-center text-[#1a1a1a] font-medium hover:border-[#1a1a1a] cursor-pointer transition-colors"
                    >+</button>
                  </div>
                </div>
                <div className="border border-[#E2E2E2] rounded-[12px] p-[12px] bg-white flex flex-col justify-center">
                  <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B] block mb-[8px]">Guests</span>
                  <div className="flex items-center gap-[12px]">
                    <button
                      onClick={() => setGuestsCount(g => Math.max(1, g - 1))}
                      className="w-[24px] h-[24px] rounded-[6px] border border-[#E2E2E2] bg-white flex items-center justify-center text-[#1a1a1a] font-medium hover:border-[#1a1a1a] cursor-pointer transition-colors"
                    >-</button>
                    <span className="text-[16px] font-satoshi font-bold text-[#1A1A1A] w-3 text-center">{guestsCount}</span>
                    <button
                      onClick={() => setGuestsCount(g => g + 1)}
                      className="w-[24px] h-[24px] rounded-[6px] border border-[#E2E2E2] bg-white flex items-center justify-center text-[#1a1a1a] font-medium hover:border-[#1a1a1a] cursor-pointer transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Starting from */}
              <div className="bg-[#FCF5F4] rounded-[12px] p-[16px] mb-[16px] flex flex-col items-center justify-center text-center">
                <span className="text-[13px] font-['Quicksand'] font-medium text-[#6B6B6B] block mb-[4px]">Starting from</span>
                <div className="flex items-baseline justify-center gap-[4px] mb-[4px]">
                  <span className="text-[20px] font-['JetBrains_Mono'] font-bold text-[#1A1A1A]">₹{ratePerNight.toLocaleString('en-IN')}</span>
                  <span className="text-[13px] font-['Quicksand'] font-medium text-[#6B6B6B]">/night</span>
                </div>
                <span className="text-[12px] font-['Quicksand'] font-medium text-[#6B6B6B]">3 room types available</span>
              </div>

              {/* Book Hotel button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-[#CD4C3E] hover:bg-[#b84133] active:bg-[#a6392b] text-white font-satoshi font-bold py-[14px] rounded-[12px] flex items-center justify-center gap-[6px] text-[16px] shadow-sm transition-all cursor-pointer border-none"
              >
                Book Hotel
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-[12px]">
                <ShieldCheck size={14} className="text-[#6B6B6B]" />
                <p className="text-[12px] font-['Quicksand'] text-[#6B6B6B] font-medium">
                  Select room in next step · No payment now
                </p>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-white rounded-[14px] border border-[#E2E2E2] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-[16px]">
            <p className="text-[12px] font-bold text-[#1A1A1A] mb-[8px]">Need help?</p>
            <p className="text-[11px] text-[#6B6B6B] mb-[10px] leading-[1.5]">
              Our travel specialists are available 24/7
            </p>
            <a href="tel:1800-963-4747" className="flex items-center gap-[6px] text-[12px] font-bold text-[#F12B19] no-underline hover:opacity-80 transition-opacity">
              <Phone size={12} />
              Call 1800-963-4747
            </a>
          </div>
        </div>
      </div>

      {/* ── PHOTO LIGHTBOX ── */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setShowAllPhotos(false)}>
          <button
            onClick={() => setShowAllPhotos(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer border-none transition-colors"
          >
            <X size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActivePhoto(p => Math.max(0, p - 1)) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer border-none transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <img
            src={HOTEL_IMAGES[activePhoto % HOTEL_IMAGES.length]}
            alt="Hotel"
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setActivePhoto(p => (p + 1) % HOTEL_IMAGES.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white cursor-pointer border-none transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {HOTEL_IMAGES.map((img, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setActivePhoto(i) }}
                className={`w-14 h-10 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${i === activePhoto % HOTEL_IMAGES.length ? 'border-white' : 'border-transparent opacity-60'}`}
              >
                <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { Check, Info, Calendar, MapPin, Coffee, Car, Wifi, Shield, ArrowRight, Star, Users, Clock, Sparkles, Heart } from 'lucide-react'

import icon1 from '../../assets/Hotel section/icons/building.svg'
import icon2 from '../../assets/Hotel section/icons/Icon-1.svg'
import icon3 from '../../assets/Hotel section/icons/Icon-2.svg'
import icon4 from '../../assets/Hotel section/icons/Icon.svg'

export default function HotelPersonalize({
  hotel,
  bookingDetails,
  onBack,
  onContinue
}) {
  const { checkinDate, checkoutDate, nightsCount, guestsCount } = bookingDetails

  // 1. Add-ons data
  const ADD_ONS_DATA = [
    {
      id: 'breakfast',
      name: 'Breakfast Package',
      desc: 'Continental breakfast for 2 guests — daily',
      price: 3900,
      icon: <Coffee size={18} className="text-[#E53935]" />,
      tag: 'Most Popular'
    },
    {
      id: 'airport',
      name: 'Airport Transfer (Arrival)',
      desc: 'AC cab pickup from airport to hotel',
      price: 800,
      icon: <Car size={18} className="text-[#E53935]" />
    },
    {
      id: 'early_checkin',
      name: 'Early Check-in (10:00 AM)',
      desc: 'Standard check-in is 2:00 PM — request early',
      price: 500,
      icon: <Clock size={18} className="text-[#E53935]" />
    },
    {
      id: 'late_checkout',
      name: 'Late Check-out (3:00 PM)',
      desc: 'Standard check-out is 12:00 PM — extend',
      price: 500,
      icon: <Clock size={18} className="text-[#E53935]" />
    },
    {
      id: 'decoration',
      name: 'Special Decoration',
      desc: 'Floral welcome, rose petals & candles for special occasions',
      price: 1500,
      icon: <Sparkles size={18} className="text-[#E53935]" />,
      tag: 'Romantic'
    }
  ]

  // State to track selected add-ons
  const [selectedAddOns, setSelectedAddOns] = useState([])

  const handleToggleAddOn = (addOnId) => {
    if (selectedAddOns.includes(addOnId)) {
      setSelectedAddOns(selectedAddOns.filter(id => id !== addOnId))
    } else {
      setSelectedAddOns([...selectedAddOns, addOnId])
    }
  }

  // Formatting dates for header strip
  const formatDateHeader = (dateStr) => {
    if (!dateStr) return ''
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj.getTime())) return dateStr
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`
  }

  // Calculations
  const ratePerNight = hotel.price
  const baseRoomPrice = ratePerNight * nightsCount
  const addOnsTotal = ADD_ONS_DATA
    .filter(item => selectedAddOns.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0)

  const taxRate = 0.12 // 12% GST
  const subtotal = baseRoomPrice + addOnsTotal
  const taxGST = Math.round(subtotal * taxRate)
  const finalTotalPrice = subtotal + taxGST

  const handleProceed = () => {
    const chosenAddOns = ADD_ONS_DATA.filter(item => selectedAddOns.includes(item.id))
    onContinue({
      selectedAddOns: chosenAddOns,
      addOnsTotal,
      finalTotalPrice
    })
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-6 px-4 lg:px-8 font-quicksand animate-fadeIn">
      <div className="max-w-[1300px] mx-auto space-y-6">
        
        {/* BUTTON BACK */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors cursor-pointer bg-transparent border-none"
        >
          &larr; Back to details
        </button>

        {/* ── STEP PROGRESSION BAR ── */}
        <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-6 shadow-sm font-satoshi">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            
            {/* Step 1: Room Selection */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-[#00c950] flex items-center justify-center text-white">
                <img src={icon1} alt="Room" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#00c950] uppercase tracking-wider">Step 1</span>
                <span className="text-[14px] font-bold text-[#1a1a1a] leading-tight">Room Selection</span>
              </div>
            </div>

            <div className="hidden md:block flex-grow h-[2px] bg-[#00c950] mx-4"></div>

            {/* Step 2: Fill Your Info */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-[#00c950] flex items-center justify-center text-white">
                <img src={icon2} alt="Info" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#00c950] uppercase tracking-wider">Step 2</span>
                <span className="text-[14px] font-bold text-[#1a1a1a] leading-tight">Fill Your Info</span>
              </div>
            </div>

            <div className="hidden md:block flex-grow h-[2px] bg-[#00c950] mx-4"></div>

            {/* Step 3: Personalize Trip */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-[#ff2d1a] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,45,26,0.3)]">
                <img src={icon3} alt="Personalize" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#ff2d1a] uppercase tracking-wider">Step 3</span>
                <span className="text-[14px] font-bold text-[#ff2d1a] leading-tight">Personalize Trip</span>
              </div>
            </div>

            <div className="hidden md:block flex-grow h-[2px] bg-[#d0d0d0] mx-4"></div>

            {/* Step 4: Finalize Payment */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-white border-[1.5px] border-[#d0d0d0] flex items-center justify-center">
                <img src={icon4} alt="Payment" className="w-[18px] h-[18px] opacity-40 grayscale" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#999999] uppercase tracking-wider">Step 4</span>
                <span className="text-[14px] font-bold text-[#999999] leading-tight">Finalize Payment</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── HOTEL INFO SUMMARY BAR ── */}
        <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-[75px] h-[60px] rounded-[13px] overflow-hidden flex-shrink-0 bg-gray-150">
              <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-gray-900 leading-snug">{hotel.name}</h2>
              <div className="flex gap-0.5 my-0.5">
                {[...Array(hotel.stars || 5)].map((_, i) => (
                  <Star key={i} size={10} fill="#FFB300" stroke="none" />
                ))}
              </div>
              <div className="flex items-center gap-1 text-[13px] text-[#6b6b6b] font-medium">
                <MapPin size={12} className="text-[#6b6b6b]" />
                <span>{hotel.location}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <span className="text-[14px] font-bold text-gray-900 leading-snug">
              {formatDateHeader(checkinDate)} – {formatDateHeader(checkoutDate)}
            </span>
            <span className="text-[13px] text-[#6b6b6b] font-semibold mt-0.5">
              {nightsCount} night{nightsCount > 1 ? 's' : ''} · {guestsCount} guest{guestsCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* ── TWO COLUMN DETAILS LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: ENHANCE YOUR STAY */}
          <div className="lg:col-span-8 bg-white border border-[#d0d0d0] rounded-[15px] p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Sparkles size={18} className="text-[#E53935]" />
              <h3 className="text-lg font-bold text-gray-900">Enhance Your Stay</h3>
            </div>

            <div className="space-y-4">
              {ADD_ONS_DATA.map((addon) => {
                const isSelected = selectedAddOns.includes(addon.id)
                return (
                  <div
                    key={addon.id}
                    className={`border border-[#e2e2e2] rounded-[13px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isSelected ? 'border-[#00c950]/50 bg-[#00c950]/5' : 'hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-[38px] h-[38px] rounded-[13px] bg-[#fcecec] flex items-center justify-center flex-shrink-0">
                        {addon.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13.5px] font-bold text-gray-900 leading-tight">
                            {addon.name}
                          </span>
                          {addon.tag && (
                            <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-[4px] tracking-wider leading-none ${
                              addon.tag === 'Most Popular'
                                ? 'bg-[#00c950]/20 text-[#00c950]'
                                : 'bg-[#E53935]/10 text-[#E53935]'
                            }`}>
                              {addon.tag}
                            </span>
                          )}
                        </div>
                        <span className="text-[11.5px] text-[#6b6b6b] font-medium mt-1 leading-snug">
                          {addon.desc}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                      <span className="text-[14px] font-bold text-gray-900 whitespace-nowrap">
                        +₹{addon.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAddOn(addon.id)}
                        className={`px-4 py-1.5 rounded-[13px] text-xs font-bold transition-all cursor-pointer select-none border border-solid ${
                          isSelected
                            ? 'bg-[#00c950] border-[#00c950] text-white'
                            : 'bg-white border-[#d0d0d0] text-gray-900 hover:border-gray-400'
                        }`}
                      >
                        {isSelected ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: PRICE SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] shadow-sm overflow-hidden flex flex-col">
              
              {/* Mini Hotel Image Banner */}
              <div className="relative h-[120px] bg-gray-100">
                <img src={hotel.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex flex-col text-white">
                  <span className="text-[13.5px] font-bold leading-tight">{hotel.name}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(hotel.stars || 5)].map((_, i) => (
                      <Star key={i} size={8} fill="#FFB300" stroke="none" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Room details */}
              <div className="p-4 space-y-4">
                <div className="bg-[#FFF5F4] border border-[#ffb7b1]/30 rounded-[13px] p-3 flex flex-col">
                  <span className="text-[13px] font-bold text-[#E53935] flex items-center gap-1">
                    ✓ Deluxe Sea View
                  </span>
                  <span className="text-[11.5px] text-[#6b6b6b] font-medium mt-0.5 pl-4">
                    Sea View · 1 King Bed
                  </span>
                </div>

                {/* Date & Guests rows */}
                <div className="space-y-2 text-[13px] font-semibold text-[#6b6b6b] border-b border-gray-100 pb-3">
                  <div className="flex justify-between">
                    <span>Check-in</span>
                    <span className="text-gray-900">{formatDateHeader(checkinDate)} · 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out</span>
                    <span className="text-gray-900">{formatDateHeader(checkoutDate)} · 12:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span className="text-gray-900">{guestsCount} guest{guestsCount > 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Price summary block */}
                <div className="space-y-2 text-[13px] font-semibold text-[#6b6b6b]">
                  <h4 className="font-bold text-gray-900 text-sm">Price Summary</h4>
                  
                  <div className="flex justify-between">
                    <span>₹{ratePerNight.toLocaleString('en-IN')} × {nightsCount} nights</span>
                    <span className="font-medium text-gray-950">₹{baseRoomPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Added packages */}
                  {ADD_ONS_DATA.filter(item => selectedAddOns.includes(item.id)).map(item => (
                    <div key={item.id} className="flex justify-between text-[#00c950]">
                      <span>{item.name}</span>
                      <span>+₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <span>Tax & GST (12%)</span>
                    <span className="font-medium text-gray-950">₹{taxGST.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-3 text-[16px] font-bold text-gray-950">
                    <span>Total</span>
                    <span>₹{finalTotalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Cancellation Banner */}
            <div className="bg-[#f0fdf4] border border-[#b9f8cf] rounded-[15px] p-3 flex items-center gap-2 select-none shadow-sm">
              <Check size={14} className="text-[#008236]" strokeWidth={3} />
              <span className="text-xs font-semibold text-[#008236]">Free cancellation up to 48 hrs</span>
            </div>

            {/* Action button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleProceed}
                className="w-full bg-[#E53935] hover:bg-[#d62828] text-white py-3.5 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(229,57,53,0.2)] active:scale-[0.98] transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <div className="text-center text-[11px] font-bold text-[#6B6B6B] tracking-tight">
                Select room in next step • No payment now
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Check, MapPin, Star, BedDouble, Users, Maximize, Eye, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react'
import room1 from '../../assets/Hotel section/extracted_images/Hotel The Royal Krishna.jpg'
import room2 from '../../assets/hotels/City View from Room.jpg'
import room3 from '../../assets/hotels/Hotel-Inspired Guest Space With White Bedding And Golden Touch.jpg'

import icon1 from '../../assets/Hotel section/icons/building.svg'
import icon2 from '../../assets/Hotel section/icons/Icon-1.svg'
import icon3 from '../../assets/Hotel section/icons/Icon-2.svg'
import icon4 from '../../assets/Hotel section/icons/Icon.svg'

export default function HotelRoomSelection({
  hotel,
  bookingDetails,
  onBack,
  onContinue
}) {
  const { checkinDate, checkoutDate, nightsCount, guestsCount } = bookingDetails

  const [selectedRoomId, setSelectedRoomId] = useState(null)

  const ROOMS = [
    {
      id: 'room_1',
      name: 'Superior Room',
      image: room1,
      size: '35 sqm',
      bed: '1 King Bed',
      guests: 2,
      view: 'Garden View',
      price: hotel.price || 9800,
      originalPrice: (hotel.price || 9800) + 5000,
      discount: '30% off',
      amenities: ['WiFi', 'AC', 'Mini-bar']
    },
    {
      id: 'room_2',
      name: 'Deluxe Sea View',
      image: room2,
      size: '42 sqm',
      bed: '1 King Bed',
      guests: 2,
      view: 'Sea View',
      price: (hotel.price || 9800) + 3700,
      originalPrice: (hotel.price || 9800) + 8700,
      discount: '30% off',
      amenities: ['WiFi', 'AC', 'Mini-bar']
    },
    {
      id: 'room_3',
      name: 'Premium Suite',
      image: room3,
      size: '49 sqm',
      bed: '1 King Bed + Living Room',
      guests: 2,
      view: 'Sea View',
      price: (hotel.price || 9800) + 13000,
      originalPrice: (hotel.price || 9800) + 18000,
      discount: '30% off',
      amenities: ['WiFi', 'AC', 'Jacuzzi']
    }
  ]

  const formatDateHeader = (dateStr) => {
    if (!dateStr) return ''
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj.getTime())) return dateStr
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]}`
  }

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room.id)
  }

  const handleContinue = () => {
    const selectedRoom = ROOMS.find(r => r.id === selectedRoomId)
    if (selectedRoom) {
      onContinue({ selectedRoom })
    }
  }

  const selectedRoom = ROOMS.find(r => r.id === selectedRoomId)
  const roomPrice = selectedRoom ? selectedRoom.price : 0
  const roomTotal = roomPrice * nightsCount
  const taxGST = Math.round(roomTotal * 0.12)
  const finalTotal = roomTotal + taxGST

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
              <div className="w-10 h-10 rounded-full bg-[#ff2d1a] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,45,26,0.3)]">
                <img src={icon1} alt="Room" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#ff2d1a] uppercase tracking-wider">Step 1</span>
                <span className="text-[14px] font-bold text-[#ff2d1a] leading-tight">Room Selection</span>
              </div>
            </div>

            <div className="hidden md:block flex-grow h-[2px] bg-[#d0d0d0] mx-4"></div>

            {/* Step 2: Fill Your Info */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-white border-[1.5px] border-[#d0d0d0] flex items-center justify-center">
                <img src={icon2} alt="Info" className="w-[18px] h-[18px] opacity-40 grayscale" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#999999] uppercase tracking-wider">Step 2</span>
                <span className="text-[14px] font-bold text-[#999999] leading-tight">Fill Your Info</span>
              </div>
            </div>

            <div className="hidden md:block flex-grow h-[2px] bg-[#d0d0d0] mx-4"></div>

            {/* Step 3: Personalize Trip */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-white border-[1.5px] border-[#d0d0d0] flex items-center justify-center">
                <img src={icon3} alt="Personalize" className="w-[18px] h-[18px] opacity-40 grayscale" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#999999] uppercase tracking-wider">Step 3</span>
                <span className="text-[14px] font-bold text-[#999999] leading-tight">Personalize Trip</span>
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
        <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[17px] flex flex-col sm:flex-row items-center justify-between gap-[15px] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-[75px] h-[60px] rounded-[13.375px] overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={hotel?.image || room1} alt="Hotel" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[16px] font-satoshi font-bold text-[#1a1a1a] leading-tight mb-1">{hotel?.name || "Radisson Blu Resort"}</h2>
              <div className="flex items-center gap-1 mb-1">
                <span className="flex text-[#FFA534]">
                  {[...Array(hotel?.stars || 5)].map((_, i) => (
                    <Star key={i} size={10} fill="currentColor" stroke="none" />
                  ))}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin size={12} />
                <span className="text-[14px] font-quicksand font-medium text-[#6b6b6b]">{hotel?.location || "Cavelossim, South Goa"}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-[14px] font-quicksand font-medium text-[#6b6b6b] mb-1">{formatDateHeader(checkinDate)} – {formatDateHeader(checkoutDate)}</span>
            <span className="text-[14px] font-quicksand font-medium text-[#6b6b6b]">{nightsCount} night{nightsCount > 1 ? 's' : ''} · {guestsCount} guest{guestsCount > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* ── MAIN CONTENT: TWO COLUMNS ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT COLUMN: ROOMS LIST */}
          <div className="flex-1 w-full">
            <div className="bg-white border border-[#eaeaea] rounded-[15px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[20px] font-satoshi font-bold text-[#1a1a1a]">Choose Your Room</h3>
                <span className="text-[14px] font-quicksand text-[#6b6b6b] font-medium hidden sm:inline-block">
                  {ROOMS.length} room types · {formatDateHeader(checkinDate)} – {formatDateHeader(checkoutDate)} · {guestsCount} guest{guestsCount > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {ROOMS.map(room => (
                  <div key={room.id} className="border-2 border-[#e2e2e2] rounded-[15px] p-[2px] flex flex-col md:flex-row bg-white overflow-hidden">
                    {/* Image */}
                    <div className="w-full md:w-[238px] h-[158px] flex-shrink-0 rounded-[13px] overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-[15px] flex flex-col sm:flex-row justify-between gap-[15px]">
                      {/* Room Header & Details */}
                      <div className="flex-1 flex flex-col">
                        <h4 className="text-[16px] font-satoshi font-bold text-[#1a1a1a] leading-tight mb-2">{room.name}</h4>
                        
                        <div className="flex flex-wrap items-center gap-2 text-[14px] font-quicksand font-medium text-[#6b6b6b] mb-3">
                          <div className="flex items-center gap-1"><BedDouble size={14} /> {room.bed}</div>
                          <span>·</span>
                          <div className="flex items-center gap-1"><Users size={14} /> {room.guests} guests</div>
                          <span>·</span>
                          <div className="flex items-center gap-1"><Eye size={14} /> {room.view}</div>
                          <span>·</span>
                          <span>{room.size}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {room.amenities.map((amenity, index) => (
                            <span key={index} className="bg-[#f0f0f0] text-[#6b6b6b] font-quicksand font-semibold text-[11.25px] px-[7.5px] py-[1.875px] rounded-full">
                              ✓ {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Selection */}
                      <div className="flex flex-col items-end justify-center min-w-[197px]">
                        <div className="flex items-center justify-end w-full mb-1">
                          <span className="line-through font-jetbrains font-medium text-[12px] text-[#8F8F8F]">₹{Math.floor(room.originalPrice).toLocaleString()}</span>
                          <span className="bg-[#E8F3EA] text-[#447A55] font-satoshi font-bold text-[12px] px-[10px] py-[3px] rounded-full ml-2">30% off</span>
                        </div>
                        <div className="flex items-baseline justify-end w-full gap-[6px] whitespace-nowrap mt-1">
                          <span className="font-jetbrains font-bold text-[28px] text-[#1a1a1a] leading-none tracking-tight">₹{room.price.toLocaleString()}</span>
                          <div className="flex flex-col items-start">
                            <span className="text-[12px] font-quicksand font-medium text-[#6b6b6b] leading-[14px]">/night</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectRoom(room)}
                          className={`w-full hover:bg-[#e02b1b] transition-colors text-white font-satoshi font-bold text-[15px] py-[10px] rounded-[12px] mt-3 ${selectedRoomId === room.id ? 'bg-[#1a1a1a]' : 'bg-[#F23B2B]'}`}
                        >
                          {selectedRoomId === room.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error banner if no room selected */}
            {!selectedRoom && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#FE2C1C] text-[13px] font-medium text-center py-3 rounded-[12px]">
                Please select a room to continue
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedRoom}
              className={`w-full py-4 rounded-[12px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all ${selectedRoom ? 'bg-[#FE2C1C] text-white shadow-[0_4px_12px_rgba(254,44,28,0.2)] hover:bg-[#e02012]' : 'bg-[#f5f5f5] text-gray-400 cursor-not-allowed border border-[#eaeaea]'}`}
            >
              Continue <ArrowRight size={18} />
            </button>

          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            
            {/* Selected Room / Hotel summary */}
            <div className="bg-white border border-[#eaeaea] rounded-[15px] overflow-hidden shadow-sm">
              <div className="h-[120px] relative">
                <img src={hotel.image} className="w-full h-full object-cover" alt={hotel.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <h4 className="text-white font-bold text-[14px] leading-tight mb-1">{hotel.name || "Radisson Blu Resort"}</h4>
                  <div className="flex gap-0.5">
                    {[...Array(hotel.stars || 5)].map((_, i) => (
                      <Star key={i} size={10} fill="#FFB300" stroke="none" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5">
                {!selectedRoom ? (
                  <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-[8px] py-2.5 text-center mb-5">
                    <span className="text-[12px] font-bold text-[#F57F17]">No room selected yet</span>
                  </div>
                ) : (
                  <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-[8px] py-2.5 px-3 mb-5">
                    <span className="text-[12px] font-bold text-[#2E7D32] block text-center mb-1">Room Selected</span>
                    <span className="text-[13px] font-bold text-gray-900 block text-center">{selectedRoom.name}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium">Check-in</span>
                    <span className="font-bold text-gray-900">{formatDateHeader(checkinDate)} · 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium">Check-out</span>
                    <span className="font-bold text-gray-900">{formatDateHeader(checkoutDate)} · 12:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-500 font-medium">Guests</span>
                    <span className="font-bold text-gray-900">{guestsCount} guests</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white border border-[#eaeaea] rounded-[15px] p-5 shadow-sm">
              <h4 className="text-[17px] font-satoshi font-bold text-gray-900 mb-4">Price Summary</h4>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500 font-quicksand font-medium">₹{roomPrice.toLocaleString('en-IN')} x {nightsCount} nights</span>
                  <span className="font-satoshi font-bold text-[14px] text-gray-900">₹{roomTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-gray-500 font-quicksand font-medium">Tax & GST (12%)</span>
                  <span className="font-satoshi font-bold text-[14px] text-gray-900">₹{taxGST.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="border-t border-[#eaeaea] pt-4 flex justify-between items-center mt-2">
                <span className="text-[16px] font-satoshi font-bold text-gray-900">Total</span>
                <span className="text-[22px] font-satoshi font-bold text-gray-900">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Cancellation Banner */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[12px] p-3 flex items-center gap-3">
              <ShieldCheck size={18} className="text-[#00C950]" />
              <span className="text-[12px] font-semibold text-[#166534]">Free cancellation up to 48 hrs</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

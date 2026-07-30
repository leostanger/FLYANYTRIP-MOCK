import React, { useState } from 'react'
import { ArrowLeft, User, Mail, Phone, MessageSquare, ShieldCheck, Check } from 'lucide-react'
import icon1 from '../../assets/Hotel section/icons/building.svg'
import icon2 from '../../assets/Hotel section/icons/Icon-1.svg'
import icon3 from '../../assets/Hotel section/icons/Icon-2.svg'
import icon4 from '../../assets/Hotel section/icons/Icon.svg'

export default function HotelPaymentStep({
  hotel,
  bookingDetails,
  addOns = [],
  finalPrice,
  onBack,
  onConfirmPayment // acts as onContinue to next step
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    bookingForSomeoneElse: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Pass passenger details if needed, then move to next step
    onConfirmPayment(formData)
  }

  // Format Date display (e.g., "20 Dec")
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  const basePricePerNight = hotel?.price || 9800
  const nightsCount = bookingDetails?.nightsCount || 3
  const guestsCount = bookingDetails?.guestsCount || 2
  const roomBaseTotal = basePricePerNight * nightsCount

  // Calculate Add-ons subtotal
  const addOnsTotal = addOns.reduce((sum, item) => sum + item.price, 0)
  const subtotal = roomBaseTotal + addOnsTotal
  const tax = Math.round(subtotal * 0.12)
  const calculatedTotal = subtotal + tax
  const totalPayable = finalPrice || calculatedTotal

  return (
    <div className="w-full bg-[#f5f5f5] pb-12 animate-fadeIn font-quicksand">
      <div className="max-w-[1300px] mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* ── BACK NAVIGATION BUTTON ── */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to room selection
        </button>

        {/* ── STEP PROGRESS TRACKER ── */}
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
              <div className="w-10 h-10 rounded-full bg-[#ff2d1a] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,45,26,0.3)]">
                <img src={icon2} alt="Info" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#ff2d1a] uppercase tracking-wider">Step 2</span>
                <span className="text-[14px] font-bold text-[#ff2d1a] leading-tight">Fill Your Info</span>
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

        {/* ── MAIN CONTENT ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT COLUMN: Passenger Form */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            <form onSubmit={handleSubmit} className="bg-white border border-[#d0d0d0] rounded-[15px] p-6 lg:p-[30px] shadow-sm">
              <div className="flex items-center gap-3 pb-5 border-b border-[#eaeaea] mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-[#fff5f4] flex items-center justify-center text-[#ff2d1a]">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[18.75px] font-satoshi font-bold text-[#1a1a1a] leading-tight">Primary Guest Details</h3>
                  <p className="text-[13px] font-quicksand font-medium text-[#6b6b6b]">Please enter the details of the primary guest staying at the hotel.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">First Name <span className="text-[#ff2d1a]">*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="E.g. John"
                    className="w-full h-[45px] bg-white border border-[#d0d0d0] rounded-[10px] px-4 font-quicksand text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#ff2d1a] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">Last Name <span className="text-[#ff2d1a]">*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="E.g. Doe"
                    className="w-full h-[45px] bg-white border border-[#d0d0d0] rounded-[10px] px-4 font-quicksand text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#ff2d1a] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">Email Address <span className="text-[#ff2d1a]">*</span></label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className="w-full h-[45px] bg-white border border-[#d0d0d0] rounded-[10px] pl-10 pr-4 font-quicksand text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#ff2d1a] transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">Phone Number <span className="text-[#ff2d1a]">*</span></label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full h-[45px] bg-white border border-[#d0d0d0] rounded-[10px] pl-10 pr-4 font-quicksand text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#ff2d1a] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-1.5 mb-6">
                <label className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">Special Requests (Optional)</label>
                <div className="relative">
                  <MessageSquare size={16} className="absolute left-4 top-[14px] text-[#999999]" />
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Late check-in, twin beds, high floor, etc."
                    className="w-full h-[100px] bg-white border border-[#d0d0d0] rounded-[10px] pl-10 pr-4 py-3 font-quicksand text-[14px] text-[#1a1a1a] focus:outline-none focus:border-[#ff2d1a] transition-colors resize-none"
                  ></textarea>
                </div>
                <p className="text-[11px] font-quicksand text-[#6b6b6b] mt-1">* Special requests cannot be guaranteed – but the hotel will do its best to meet your needs.</p>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="bookingForSomeoneElse"
                    checked={formData.bookingForSomeoneElse}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <div
                    className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      border: formData.bookingForSomeoneElse ? '1.16px solid #ff2d1a' : '1.16px solid #d0d0d0',
                      background: formData.bookingForSomeoneElse ? '#ff2d1a' : 'white',
                    }}
                  >
                    {formData.bookingForSomeoneElse && <Check size={12} strokeWidth={3} color="white" />}
                  </div>
                  <span className="text-[13.5px] font-quicksand font-semibold text-[#1a1a1a]">I am booking this stay for someone else</span>
                </label>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-5 border-t border-[#eaeaea]">
                <button
                  type="submit"
                  className="bg-[#ff2d1a] hover:bg-[#e62817] text-white px-8 h-[45px] rounded-[10px] font-satoshi font-bold text-[14px] transition-all cursor-pointer shadow-[0_4px_14px_rgba(255,45,26,0.25)] active:scale-95"
                >
                  Continue to Personalize
                </button>
              </div>
            </form>

            <div className="bg-[#eaf8ed] border border-[#b9f8cf] rounded-[15px] p-[15px] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d5f5de] flex items-center justify-center text-[#00c950] flex-shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-[14px] font-satoshi font-bold text-[#008236] mb-0.5">Your Information is Safe</h4>
                <p className="text-[12.5px] font-quicksand font-medium text-[#00a645] leading-snug">
                  We only use your details to manage this booking. We will never sell your information to third parties.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-[#d0d0d0] rounded-[15px] shadow-sm overflow-hidden sticky top-6">
              {/* Header image from hotel */}
              <div className="h-[160px] relative">
                <img
                  src={hotel?.image}
                  alt={hotel?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                  <h4 className="text-[18px] font-satoshi font-black text-white leading-tight mb-1">{hotel?.name || 'Luxury Hotel'}</h4>
                  <p className="text-[12px] font-quicksand font-bold text-[#e0e0e0]">{hotel?.location}</p>
                </div>
              </div>

              {/* Sidebar content details */}
              <div className="p-[20px] space-y-[15px]">
                
                <div className="bg-[#f8f9fa] border border-[#eaeaea] rounded-[10px] p-[12px]">
                  <span className="text-[11px] font-quicksand font-bold text-[#6b6b6b] uppercase tracking-wider block mb-1">Selected Room</span>
                  <span className="text-[14px] font-satoshi font-bold text-[#1a1a1a] block leading-tight">Deluxe Sea View</span>
                  <span className="text-[12px] font-quicksand font-medium text-[#6b6b6b]">1 King Bed · Sea View</span>
                </div>

                <div className="space-y-[10px] border-b border-[#eaeaea] pb-[15px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-quicksand font-bold text-[#6b6b6b]">Check-in</span>
                    <span className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">{formatDateDisplay(bookingDetails?.checkinDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-quicksand font-bold text-[#6b6b6b]">Check-out</span>
                    <span className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">{formatDateDisplay(bookingDetails?.checkoutDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-quicksand font-bold text-[#6b6b6b]">Guests</span>
                    <span className="text-[13px] font-satoshi font-bold text-[#1a1a1a]">{guestsCount} guests, {nightsCount} nights</span>
                  </div>
                </div>

                {/* Price Details */}
                <div className="space-y-[10px] border-b border-[#eaeaea] pb-[15px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-quicksand font-semibold text-[#6b6b6b]">Base Price ({nightsCount} nights)</span>
                    <span className="text-[13px] font-jetbrains font-semibold text-[#1a1a1a]">₹{roomBaseTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-quicksand font-semibold text-[#6b6b6b]">Taxes & Fees</span>
                    <span className="text-[13px] font-jetbrains font-semibold text-[#1a1a1a]">₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Sidebar Total */}
                <div className="flex justify-between items-end pt-1">
                  <span className="text-[15px] font-satoshi font-extrabold text-[#1a1a1a]">Total Estimate</span>
                  <span className="text-[22px] font-jetbrains font-black text-[#ff2d1a] leading-none">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

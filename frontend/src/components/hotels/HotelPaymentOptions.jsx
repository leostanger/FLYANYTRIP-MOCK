import React, { useState } from 'react'
import { Check, ArrowLeft, Building, FileText, Phone, User, Calendar, Users, Moon, Star, MapPin, Tag, ChevronDown, CheckCircle, Info, Lock, Ticket, QrCode } from 'lucide-react'

import gpayLogo from '../../assets/hotels/gpay.svg'
import bhimLogo from '../../assets/hotels/bhim.svg'
import phonepayLogo from '../../assets/hotels/phonepay.svg'
import paytmLogo from '../../assets/hotels/paytm.svg'

import icon1 from '../../assets/Hotel section/icons/building.svg'
import icon2 from '../../assets/Hotel section/icons/Icon-1.svg'
import icon3 from '../../assets/Hotel section/icons/Icon-2.svg'
import icon4 from '../../assets/Hotel section/icons/Icon.svg'

export default function HotelPaymentOptions({
  hotel,
  bookingDetails,
  addOns = [],
  onBack,
  onConfirmBooking
}) {
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [appliedCouponName, setAppliedCouponName] = useState('')
  const [upiId, setUpiId] = useState('')
  const [selectedApp, setSelectedApp] = useState('GPay')
  const [activeTab, setActiveTab] = useState('UPI') // UPI, CARD, BANK, WALLETS

  // Format Date display (e.g., "20 Dec")
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  const basePricePerNight = hotel.price || 12600
  const nightsCount = bookingDetails?.nightsCount || 3
  const guestsCount = bookingDetails?.guestsCount || 2
  const roomBaseTotal = basePricePerNight * nightsCount

  // Calculate Add-ons subtotal
  const addOnsTotal = addOns.reduce((sum, item) => sum + item.price, 0)
  const subtotalBeforeDiscount = roomBaseTotal + addOnsTotal

  // Calculate dynamic totals
  const subtotalAfterDiscount = Math.max(0, subtotalBeforeDiscount - appliedDiscount)
  const tax = Math.round(subtotalAfterDiscount * 0.12)
  const totalPayable = subtotalAfterDiscount + tax

  // Apply Coupon Code handler
  const handleApplyCoupon = (code) => {
    const cleanCode = code.toUpperCase().trim()
    let discount = 0
    if (cleanCode === 'HDFC15') {
      discount = Math.round(roomBaseTotal * 0.15)
    } else if (cleanCode === 'FLY200') {
      discount = 2000
    } else if (cleanCode === 'FIRSTFLY') {
      discount = 1500
    } else {
      alert('Invalid Coupon Code!')
      return
    }
    setAppliedDiscount(discount)
    setAppliedCouponName(cleanCode)
    setCouponCode(cleanCode)
  }

  const handleRemoveCoupon = () => {
    setAppliedDiscount(0)
    setAppliedCouponName('')
    setCouponCode('')
  }

  const handlePaySubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    onConfirmBooking({
      finalPrice: totalPayable,
      coupon: appliedCouponName || null,
      discount: appliedDiscount,
      paymentMethod: activeTab === 'UPI' ? `UPI (${selectedApp})` : activeTab
    })
  }

  return (
    <div className="w-full bg-[#F8F9FA] pb-12 animate-fadeIn">
      {/* ── BACK NAVIGATION BUTTON ── */}
      <div className="max-w-[1280px] mx-auto px-4 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to booking review
        </button>
      </div>

      {/* ── STEP PROGRESS TRACKER ── */}
      <div className="max-w-[1280px] mx-auto px-4 mt-6">
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
              <div className="w-10 h-10 rounded-full bg-[#00c950] flex items-center justify-center text-white">
                <img src={icon3} alt="Personalize" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#00c950] uppercase tracking-wider">Step 3</span>
                <span className="text-[14px] font-bold text-[#1a1a1a] leading-tight">Personalize Trip</span>
              </div>
            </div>

            <div className="hidden md:block flex-grow h-[2px] bg-[#00c950] mx-4"></div>

            {/* Step 4: Finalize Payment */}
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-full bg-[#ff2d1a] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(255,45,26,0.3)]">
                <img src={icon4} alt="Payment" className="w-[18px] h-[18px]" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[#ff2d1a] uppercase tracking-wider">Step 4</span>
                <span className="text-[14px] font-bold text-[#ff2d1a] leading-tight">Finalize Payment</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT: TWO COLUMNS ── */}
      <div className="max-w-[1280px] mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Coupon & Payment Methods */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Coupon Code Card */}
          <div className="bg-white border border-[#D0D0D0] rounded-[15px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="text-[#FE2C1C]" size={18} />
              <h4 className="text-sm font-black text-gray-900">Offers & Promo Codes</h4>
            </div>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g. HDFC15)"
                className="flex-grow bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#FE2C1C]"
              />
              {appliedCouponName ? (
                <button
                  onClick={handleRemoveCoupon}
                  className="bg-gray-150 hover:bg-gray-200 text-gray-700 px-5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleApplyCoupon(couponCode)}
                  className="bg-[#FFF5F4] hover:bg-[#FFE8E6] border border-[#FFDCDA] text-[#FE2C1C] px-6 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Apply
                </button>
              )}
            </div>

            {/* Popular Coupons Suggestions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['HDFC15', 'FLY200', 'FIRSTFLY'].map((promo) => (
                <button
                  key={promo}
                  onClick={() => handleApplyCoupon(promo)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded border border-dashed transition-all cursor-pointer ${
                    appliedCouponName === promo
                      ? 'border-[#FE2C1C] bg-[#FFF5F4] text-[#FE2C1C]'
                      : 'border-[#D0D0D0] bg-white text-[#6B6B6B] hover:border-gray-400'
                  }`}
                >
                  {promo} {promo === 'HDFC15' ? '(15% OFF)' : promo === 'FLY200' ? '(₹2,000 OFF)' : '(₹1,500 OFF)'}
                </button>
              ))}
            </div>

            {appliedCouponName && (
              <div className="mt-3 text-xs font-bold text-green-700 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px]">✓</span>
                Code {appliedCouponName} applied successfully! You saved ₹{appliedDiscount.toLocaleString('en-IN')}.
              </div>
            )}
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white border border-[#D0D0D0] rounded-[15px] shadow-sm overflow-hidden">
            {/* Horizontal Tabs */}
            <div className="flex border-b border-[#EAEAEA]">
              <button
                onClick={() => setActiveTab('UPI')}
                className={`flex-1 py-4 text-xs font-extrabold text-center transition-all cursor-pointer border-none ${
                  activeTab === 'UPI'
                    ? 'bg-[#FFF5F4] text-[#FE2C1C] border-b-2 border-solid border-[#FE2C1C]'
                    : 'bg-white text-gray-500 hover:text-gray-900'
                }`}
              >
                UPI
              </button>
              <button
                onClick={() => setActiveTab('CARD')}
                className={`flex-1 py-4 text-xs font-extrabold text-center transition-all cursor-pointer border-none ${
                  activeTab === 'CARD'
                    ? 'bg-[#FFF5F4] text-[#FE2C1C] border-b-2 border-solid border-[#FE2C1C]'
                    : 'bg-white text-gray-500 hover:text-gray-900'
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                onClick={() => setActiveTab('BANK')}
                className={`flex-1 py-4 text-xs font-extrabold text-center transition-all cursor-pointer border-none ${
                  activeTab === 'BANK'
                    ? 'bg-[#FFF5F4] text-[#FE2C1C] border-b-2 border-solid border-[#FE2C1C]'
                    : 'bg-white text-gray-500 hover:text-gray-900'
                }`}
              >
                Net Banking
              </button>
              <button
                onClick={() => setActiveTab('WALLETS')}
                className={`flex-1 py-4 text-xs font-extrabold text-center transition-all cursor-pointer border-none ${
                  activeTab === 'WALLETS'
                    ? 'bg-[#FFF5F4] text-[#FE2C1C] border-b-2 border-solid border-[#FE2C1C]'
                    : 'bg-white text-gray-500 hover:text-gray-900'
                }`}
              >
                Wallets
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {activeTab === 'UPI' && (
                <div className="space-y-6">
                  {/* UPI ID Input */}
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">UPI ID *</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@paytm / @upi"
                      className="w-full bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-[#FE2C1C]"
                    />
                  </div>

                  {/* Popular UPI Apps */}
                  <div className="border-t border-[#EAEAEA] pt-6">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FE2C1C]"></div>
                        <p className="text-xs font-extrabold text-gray-800 font-quicksand uppercase tracking-wider">Popular UPI Apps</p>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400 font-quicksand">Instant Pay</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {[
                        { 
                          id: 'GPay', 
                          name: 'Google Pay', 
                          logo: gpayLogo,
                          borderColor: 'border-[#4285F4]',
                          badgeBg: 'bg-[#4285F4]',
                          glowColor: 'shadow-[0_6px_22px_rgba(66,133,244,0.3)]',
                          bgActive: 'bg-[#F4F8FF]'
                        },
                        { 
                          id: 'PhonePe', 
                          name: 'PhonePe', 
                          logo: phonepayLogo,
                          borderColor: 'border-[#5F259F]',
                          badgeBg: 'bg-[#5F259F]',
                          glowColor: 'shadow-[0_6px_22px_rgba(95,37,159,0.3)]',
                          bgActive: 'bg-[#FAF5FF]'
                        },
                        { 
                          id: 'Paytm', 
                          name: 'Paytm', 
                          logo: paytmLogo,
                          borderColor: 'border-[#00BAF2]',
                          badgeBg: 'bg-[#00BAF2]',
                          glowColor: 'shadow-[0_6px_22px_rgba(0,186,242,0.3)]',
                          bgActive: 'bg-[#F0FBFF]'
                        },
                        { 
                          id: 'BHIM', 
                          name: 'BHIM UPI', 
                          logo: bhimLogo,
                          borderColor: 'border-[#FF6B00]',
                          badgeBg: 'bg-[#FF6B00]',
                          glowColor: 'shadow-[0_6px_22px_rgba(255,107,0,0.3)]',
                          bgActive: 'bg-[#FFF8F3]'
                        }
                      ].map((app) => {
                        const isSelected = selectedApp === app.id;
                        return (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setSelectedApp(app.id)}
                            className={`relative w-full cursor-pointer transition-all duration-300 rounded-[16px] overflow-hidden p-1.5 border-2 select-none ${
                              isSelected
                                ? `${app.borderColor} ${app.glowColor} ${app.bgActive} scale-[1.03] -translate-y-1`
                                : 'border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 opacity-85 hover:opacity-100'
                            }`}
                          >
                            {/* Glowing Status LED Indicator Dot */}
                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 z-20 flex items-center justify-center">
                                <span className={`w-2.5 h-2.5 ${app.badgeBg} rounded-full ring-2 ring-white shadow-sm animate-pulse`} />
                              </div>
                            )}

                            <img src={app.logo} alt={app.name} className="w-full h-auto block rounded-[11px]" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scan QR Section */}
                  <div className="border-t border-[#EAEAEA] pt-6 flex flex-col items-center">
                    <p className="text-xs font-extrabold text-[#6B6B6B] mb-3">Or scan QR code</p>
                    <div className="p-3 border-2 border-dashed border-[#D0D0D0] rounded-2xl bg-white transition-all">
                      <img 
                        key={selectedApp}
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=hotelbooking@upi&pn=HotelBooking&am=${totalPayable}&cu=INR&tn=Payment via ${selectedApp}`)}`} 
                        alt={`${selectedApp} QR Code`} 
                        className="w-[100px] h-[100px] sm:w-[116px] sm:h-[116px] object-contain animate-fadeIn" 
                      />
                    </div>
                    <p className="text-[11px] font-bold text-[#1A1A1A] mt-3 bg-gray-100 px-3 py-1.5 rounded-full">
                      Pay using <span className="text-[#FE2C1C]">{selectedApp}</span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'CARD' && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-500">Credit / Debit Card Payment option</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Expiry Date (MM/YY)"
                        className="bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      className="w-full bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'BANK' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500">Select Bank from list</p>
                  <select className="w-full bg-[#F5F5F5] border border-[#D0D0D0] rounded-xl px-4 py-3.5 text-xs font-bold focus:outline-none">
                    <option>HDFC Bank</option>
                    <option>SBI Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {activeTab === 'WALLETS' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500">Select Wallet</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'PhonePe Wallet'].map(wallet => (
                      <button key={wallet} className="p-4 border border-[#D0D0D0] rounded-xl text-xs font-bold hover:border-[#FE2C1C] transition-all bg-white cursor-pointer">
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Secure Payment CTA */}
          <button
            onClick={handlePaySubmit}
            className="w-full h-[60px] bg-[#FE2C1C] hover:bg-red-700 text-white rounded-[13px] font-black text-base flex items-center justify-center gap-3 cursor-pointer border-none shadow-lg shadow-red-200 transition-all active:scale-[0.99]"
          >
            <Lock size={18} strokeWidth={2.5} />
            Pay ₹{totalPayable.toLocaleString('en-IN')} Securely
          </button>
        </div>

        {/* RIGHT COLUMN: Sidebar Price Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#D0D0D0] rounded-[15px] shadow-sm overflow-hidden">
            {/* Header image from hotel */}
            <div className="h-[140px] relative">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest leading-none mb-1">YOUR STAY AT</span>
                <h4 className="text-base font-black text-white leading-tight">{hotel.name}</h4>
                <p className="text-[10px] text-gray-300 font-bold">{hotel.stars}★ · {hotel.location}</p>
              </div>
            </div>

            {/* Sidebar content details */}
            <div className="p-5 space-y-4">
              <div className="bg-[#FFF5F4] border border-[#FFDCDA] rounded-xl p-3 flex items-center gap-3">
                <span className="text-[#FE2C1C] font-bold text-sm">✓</span>
                <div>
                  <span className="text-xs font-extrabold text-gray-900 block leading-none mb-1">Deluxe Sea View</span>
                  <span className="text-[10px] text-gray-500 font-semibold">Sea View · 1 King Bed</span>
                </div>
              </div>

              {/* Booking Details Lists */}
              <div className="space-y-2 text-xs border-b border-[#EAEAEA] pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#6B6B6B]">Check-in</span>
                  <span className="font-extrabold text-gray-900">{formatDateDisplay(bookingDetails?.checkinDate)} · 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#6B6B6B]">Check-out</span>
                  <span className="font-extrabold text-gray-900">{formatDateDisplay(bookingDetails?.checkoutDate)} · 12:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#6B6B6B]">Guests</span>
                  <span className="font-extrabold text-gray-900">{guestsCount} guests</span>
                </div>
              </div>

              {/* Price Details Lists */}
              <div className="space-y-2 text-xs border-b border-[#EAEAEA] pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#6B6B6B]">₹{basePricePerNight.toLocaleString('en-IN')} × {nightsCount} nights</span>
                  <span className="font-extrabold text-gray-900">₹{roomBaseTotal.toLocaleString('en-IN')}</span>
                </div>
                {addOns.map((addon) => (
                  <div key={addon.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-green-700">{addon.name}</span>
                    <span className="font-extrabold text-green-700">+₹{addon.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold text-green-700">
                    <span>Coupon ({appliedCouponName})</span>
                    <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#6B6B6B]">Tax & GST (12%)</span>
                  <span className="font-extrabold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Sidebar Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-extrabold text-gray-900">Total Price</span>
                <span className="text-xl font-black text-gray-900">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

import { useState } from 'react'
import BookingCard from '../flights/BookingCard'
import heroBg from '../../assets/Home page/hero-banner copy.png'
import hotelBg from '../../assets/hotels/Hotel background image.svg'
import holidayBg from '../../assets/Holiday/Holiday background.svg'

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState('flights')

  return (
    <section className="relative w-full min-h-[600px] flex flex-col overflow-hidden bg-white">
      {/* ── Background Images (smooth cross-fade) ── */}
      <div className="absolute inset-0 z-0">
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            activeTab === 'flights' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={heroBg}
            alt="Airplane flying (Flights)"
            className="w-full h-full object-cover object-right-center"
          />
        </div>
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            activeTab === 'hotels' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={hotelBg}
            alt="Luxury hotel room (Hotels)"
            className="w-full h-full object-cover object-right-center"
          />
        </div>
        <div 
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            activeTab === 'holiday' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={holidayBg}
            alt="Tropical island resort (Holiday)"
            className="w-full h-full object-cover object-right-center"
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 lg:px-8 py-12 max-w-[1400px] mx-auto w-full">
        {/* Headline */}
        <div className="mb-6">
          <h1 className="text-[45px] font-bold text-black font-satoshi leading-tight tracking-tight">
            Your Journey Begins <span className="text-[#ff2d1a]">Here</span>
          </h1>
          <p className="mt-2 text-[15px] font-medium text-black font-quicksand">
            Flights · Hotels · Trains · Tour Packages · Holiday Deals — all in one place
          </p>
        </div>

        {/* Booking Card */}
        <div className="w-full max-w-2xl">
          <BookingCard activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </section>
  )
}

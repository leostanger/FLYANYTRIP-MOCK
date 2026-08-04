import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FlightsIcon, 
  HotelsIcon, 
  HolidayIcon, 
  SwapIcon, 
  CalendarIcon, 
  SearchIcon 
} from '../common/Icons'

const TABS = [
  { id: 'flights', label: 'Flights', Icon: FlightsIcon },
  { id: 'hotels', label: 'Hotels', Icon: HotelsIcon },
  { id: 'holiday', label: 'Holiday', Icon: HolidayIcon },
]

const TRIP_TYPES = [
  { value: 'one-way', label: 'One Way' },
  { value: 'round-trip', label: 'Round Trip' },
  { value: 'multi-city', label: 'Multi-City' },
]

const POPULAR_DESTINATIONS = [
  'Goa, India',
  'Delhi, NCR, India',
  'Mumbai, Maharashtra, India',
  'Dubai, United Arab Emirates',
  'Paris, France',
  'Singapore, Singapore',
  'London, United Kingdom',
]

// Custom DatePicker Component
function CustomDatePicker({ selectedDate, onChange, onClose, minDate }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) return new Date(selectedDate)
    return new Date()
  })

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const handlePrevMonth = (e) => {
    e.stopPropagation()
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = (e) => {
    e.stopPropagation()
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const days = []
  // Fill empty days for starting offset
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null)
  }
  // Fill actual month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const minDateObj = minDate ? new Date(minDate) : today
  minDateObj.setHours(0, 0, 0, 0)

  return (
    <div 
      className="absolute left-0 mt-2 bg-white rounded-2xl border border-gray-150 p-4 shadow-xl z-50 w-72 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Month & Nav */}
      <div className="flex items-center justify-between px-1">
        <span className="font-bold text-[#1a1a1a] text-sm font-sans">{monthName}</span>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors cursor-pointer bg-white text-xs font-bold font-sans"
          >
            &lt;
          </button>
          <button 
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors cursor-pointer bg-white text-xs font-bold font-sans"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase font-sans">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="h-6 flex items-center justify-center">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-sans">
        {days.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />

          const isSelected = selectedDate && new Date(selectedDate).toDateString() === date.toDateString()
          const isDisabled = date < minDateObj
          
          const y = date.getFullYear()
          const m = String(date.getMonth() + 1).padStart(2, '0')
          const d = String(date.getDate()).padStart(2, '0')
          const dateStr = `${y}-${m}-${d}`

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation()
                onChange(dateStr)
                onClose()
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all border-none ${
                isSelected 
                  ? 'bg-[#e53935] text-white shadow-md' 
                  : isDisabled 
                    ? 'text-gray-300 cursor-not-allowed bg-transparent' 
                    : 'text-gray-700 hover:bg-gray-100 cursor-pointer bg-transparent'
              }`}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ChevronDown component
function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function BookingCard({ activeTab = 'flights', setActiveTab }) {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState('one-way')
  const [isRotated, setIsRotated] = useState(false)
  
  // Swap Location States (Flights)
  const [fromLoc, setFromLoc] = useState({ city: 'Delhi / (DEL)', airport: 'Indira Gandhi' })
  const [toLoc, setToLoc] = useState({ city: 'Dubai / (DXB)', airport: 'Dubai International' })

  // Hotel Search States
  const [hotelDest, setHotelDest] = useState('Goa, India')
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })
  const [rooms, setRooms] = useState(1)
  const [guests, setGuests] = useState(2)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  
  // Calendar popover visibility states
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false)
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false)

  const destInputRef = useRef(null)

  const handleSwap = () => {
    const temp = { ...fromLoc }
    setFromLoc(toLoc)
    setToLoc(temp)
    setIsRotated(prev => !prev)
  }

  // Format YYYY-MM-DD date to DD/MM/YYYY and weekday name
  const formatDate = (dateStr) => {
    if (!dateStr) return { date: '', dayName: '' }
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj.getTime())) return { date: dateStr, dayName: '' }
    
    const date = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    return { date, dayName }
  }

  const handleCheckInChange = (dateStr) => {
    setCheckInDate(dateStr)
    const checkIn = new Date(dateStr)
    const checkOut = new Date(checkOutDate)
    if (checkOut <= checkIn) {
      const nextDate = new Date(checkIn)
      nextDate.setDate(checkIn.getDate() + 3) // default to 3 nights
      const y = nextDate.getFullYear()
      const m = String(nextDate.getMonth() + 1).padStart(2, '0')
      const d = String(nextDate.getDate()).padStart(2, '0')
      setCheckOutDate(`${y}-${m}-${d}`)
    }
  }

  return (
    <div
      className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.2)] border-solid rounded-[13.444px] shadow-[0px_4px_14px_rgba(0,0,0,0.15)] p-[24px] w-full max-w-[648px] relative z-10 transition-all duration-300"
    >
      {/* Tabs Section */}
      <div className="relative w-full mb-[24px]">
        <div className="flex gap-[56px] px-[19px] pt-[11px] pb-0 h-[77px] w-full select-none">
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab?.(id)}
                className="flex flex-col items-center justify-start gap-[15px] relative h-full bg-transparent border-none cursor-pointer p-0 group"
              >
                <Icon 
                  className={`w-[33.67px] h-[21.549px] transition-colors flex-shrink-0 ${
                    isActive ? 'text-[#e53935]' : 'text-[#3c3c3c] group-hover:text-[#e53935]'
                  }`} 
                />
                <span 
                  className={`text-[14.11px] transition-colors leading-none font-sans ${
                    isActive 
                      ? 'font-medium text-[#e53935]' 
                      : 'font-normal text-[#3c3c3c] group-hover:text-[#e53935]'
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#e53935] h-[4.41px] rounded-[17.638px] z-10" />
                )}
              </button>
            )
          })}
        </div>
        <div className="h-px bg-[#e8e8e8] w-full absolute bottom-0 left-0 right-0" />
      </div>

      {/* Trip Types Selector (Flights only) */}
      {activeTab === 'flights' && (
        <div className="flex gap-[20px] mb-5 items-center justify-start select-none">
          {TRIP_TYPES.map(({ value, label }) => {
            const isChecked = tripType === value
            return (
              <label 
                key={value} 
                onClick={() => setTripType(value)}
                className="flex gap-[6px] items-center px-[4px] py-[2px] rounded-[26.888px] cursor-pointer"
              >
                <div 
                  className={`w-[13.174px] h-[13.174px] rounded-full border flex items-center justify-center transition-all ${
                    isChecked ? 'border-[#e53935] border-[1.013px]' : 'border-[#252525] border-[0.672px]'
                  } bg-white relative`}
                >
                  {isChecked && (
                    <div className="w-[8.134px] h-[8.134px] rounded-full bg-[#e53935] absolute inset-[1.62px_2.06px_2.07px_1.62px]" />
                  )}
                </div>
                <span className="font-sans font-normal text-[12px] text-black leading-none">{label}</span>
              </label>
            )
          })}
        </div>
      )}

      {/* Form Fields Wrapper */}
      <div className="flex flex-col gap-[8px]">
        
        {/* Destination Field (Hotels / Holiday) or From-To (Flights) */}
        {activeTab === 'flights' ? (
          <div className="relative flex gap-[8px] items-center w-full">
            {/* From */}
            <div className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] flex-1 relative">
              <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase leading-none">From</span>
              <span className="font-satoshi font-bold text-[#1a1a1a] text-[16px] font-bold leading-normal">{fromLoc.city}</span>
              <span className="font-sans font-normal text-[#666] text-[8.08px] leading-none">{fromLoc.airport}</span>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute left-[calc(50%-16.8px)] top-[16px] bg-white border-[#e8e8e8] border-[0.672px] rounded-full w-[33.61px] h-[33.61px] flex items-center justify-center cursor-pointer hover:border-gray-400 z-10"
              style={{ transform: `rotate(${isRotated ? 180 : 0}deg)`, transition: 'transform 0.5s' }}
              aria-label="Swap locations"
            >
              <SwapIcon className="w-4 h-4 text-gray-600" />
            </button>

            {/* To */}
            <div className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[20px] py-[8px] rounded-[10.134px] flex-1 relative">
              <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase leading-none">To</span>
              <span className="font-satoshi font-bold text-[#1a1a1a] text-[16px] font-bold leading-normal">{toLoc.city}</span>
              <span className="font-sans font-normal text-[#666] text-[8.08px] leading-none">{toLoc.airport}</span>
            </div>
          </div>
        ) : activeTab === 'hotels' ? (
          <div className="relative flex flex-col gap-[8px] items-stretch w-full">
            <div 
              className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] w-full relative cursor-pointer"
              onClick={() => {
                destInputRef.current?.focus()
                setShowDestDropdown(true)
              }}
            >
              <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase leading-none">Destination</span>
              <input
                ref={destInputRef}
                type="text"
                value={hotelDest}
                onChange={(e) => setHotelDest(e.target.value)}
                onFocus={() => setShowDestDropdown(true)}
                className="text-[16px] font-bold text-[#1a1a1a] bg-transparent border-none outline-none w-full p-0 m-0 placeholder-gray-400 cursor-text font-sans"
                placeholder="Enter destination..."
              />
              
              {showDestDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowDestDropdown(false) }} />
                  <div className="absolute left-0 top-full mt-2 bg-white rounded-2xl border border-gray-150 py-2 shadow-xl z-50 w-full flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 font-sans">
                      Popular Destinations
                    </div>
                    {POPULAR_DESTINATIONS.map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setHotelDest(dest)
                          setShowDestDropdown(false)
                        }}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-none bg-transparent cursor-pointer w-full flex items-center gap-2 font-sans"
                      >
                        <HotelsIcon className="w-4 h-4 text-gray-400" />
                        <span>{dest}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] w-full">
            <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase leading-none">Destination / Holiday Packages</span>
            <span className="font-satoshi font-bold text-[#1a1a1a] text-[16px] font-bold leading-normal">Maldives</span>
            <span className="font-sans font-normal text-[#666] text-[8.08px] leading-none">Island Resorts & Tours</span>
          </div>
        )}

        {/* Departure-Return (Flights) OR Checkin-Checkout (Hotels / Holiday) */}
        {activeTab === 'flights' ? (
          <div className="flex gap-[8px] items-center relative w-full">
            <div className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] flex-1">
              <div className="flex flex-col gap-[4px] items-start leading-none">
                <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Departure</span>
                <span className="font-semibold text-[#1a1a1a] text-[16px]">{formatDate(checkInDate).date}</span>
                <span className="font-sans font-normal text-[#666] text-[8.08px]">{formatDate(checkInDate).dayName}</span>
              </div>
              <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] flex-1">
              <div className="flex flex-col gap-[4px] items-start leading-none">
                <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Return</span>
                <span className="font-semibold text-[#1a1a1a] text-[16px]">{formatDate(checkOutDate).date}</span>
                <span className="font-sans font-normal text-[#666] text-[8.08px]">{formatDate(checkOutDate).dayName}</span>
              </div>
              <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ) : activeTab === 'hotels' ? (
          <div className="flex gap-[8px] items-center relative w-full">
            {/* Check-in */}
            <div className="flex-1 relative">
              <div 
                className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => {
                  setShowCheckInCalendar(true)
                  setShowCheckOutCalendar(false)
                }}
              >
                <div className="flex flex-col gap-[4px] items-start leading-none">
                  <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Check-in</span>
                  <span className="font-semibold text-[#1a1a1a] text-[16px]">{formatDate(checkInDate).date}</span>
                  <span className="font-sans font-normal text-[#666] text-[8.08px]">{formatDate(checkInDate).dayName}</span>
                </div>
                <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {showCheckInCalendar && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowCheckInCalendar(false) }} />
                  <CustomDatePicker
                    selectedDate={checkInDate}
                    onChange={handleCheckInChange}
                    onClose={() => setShowCheckInCalendar(false)}
                  />
                </>
              )}
            </div>

            {/* Check-out */}
            <div className="flex-1 relative">
              <div 
                className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => {
                  setShowCheckOutCalendar(true)
                  setShowCheckInCalendar(false)
                }}
              >
                <div className="flex flex-col gap-[4px] items-start leading-none">
                  <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Check-out</span>
                  <span className="font-semibold text-[#1a1a1a] text-[16px]">{formatDate(checkOutDate).date}</span>
                  <span className="font-sans font-normal text-[#666] text-[8.08px]">{formatDate(checkOutDate).dayName}</span>
                </div>
                <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {showCheckOutCalendar && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowCheckOutCalendar(false) }} />
                  <CustomDatePicker
                    selectedDate={checkOutDate}
                    onChange={setCheckOutDate}
                    onClose={() => setShowCheckOutCalendar(false)}
                    minDate={checkInDate}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-[8px] items-center relative w-full">
            <div className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] flex-1">
              <div className="flex flex-col gap-[4px] items-start leading-none">
                <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Departure Date</span>
                <span className="font-semibold text-[#1a1a1a] text-[16px]">{formatDate(checkInDate).date}</span>
                <span className="font-sans font-normal text-[#666] text-[8.08px]">{formatDate(checkInDate).dayName}</span>
              </div>
              <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] flex-1">
              <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Duration</span>
              <span className="font-semibold text-[#1a1a1a] text-[16px]">7 Nights / 8 Days</span>
              <span className="font-sans font-normal text-[#666] text-[8.08px]">Flexible</span>
            </div>
          </div>
        )}

        {/* Guest/Travellers selector & Search button row */}
        <div className="flex gap-[8px] items-center relative w-full h-[76px] mt-[4px]">
          {/* Selector */}
          <div className="flex-1 relative h-full">
            {activeTab === 'hotels' ? (
              <div className="h-full relative">
                <div 
                  className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[17px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors h-full"
                  onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                >
                  <div className="flex flex-col gap-[4px] items-start leading-none">
                    <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase">Guests & Rooms</span>
                    <span className="font-semibold text-[#1a1a1a] text-[16px]">{guests} Guest{guests > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                </div>
                
                {showGuestsDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowGuestsDropdown(false) }} />
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-gray-150 p-4 shadow-xl z-50 w-64 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700 font-sans">Rooms</span>
                        <div className="flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setRooms(Math.max(1, rooms - 1)) }}
                            className="w-8 h-8 rounded-full border border-gray-250 flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors bg-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-gray-900 w-4 text-center">{rooms}</span>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setRooms(rooms + 1) }}
                            className="w-8 h-8 rounded-full border border-gray-250 flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors bg-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700 font-sans">Guests</span>
                        <div className="flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setGuests(Math.max(1, guests - 1)) }}
                            className="w-8 h-8 rounded-full border border-gray-250 flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors bg-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-gray-900 w-4 text-center">{guests}</span>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setGuests(guests + 1) }}
                            className="w-8 h-8 rounded-full border border-gray-250 flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors bg-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowGuestsDropdown(false) }}
                        className="bg-[#e53935] text-white py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer border-none"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] px-[17px] py-[8px] rounded-[10.134px] h-full justify-center">
                <span className="font-sans font-normal text-[#666] text-[10.372px] uppercase leading-none">{activeTab === 'flights' ? "Travellers & Class" : "Guests"}</span>
                <span className="font-semibold text-[#1a1a1a] text-[16px] leading-normal">{activeTab === 'flights' ? "2 Adults, Economy" : "2 Adults, Economy"}</span>
                <span className="font-sans font-normal text-[#666] text-[8.08px] leading-none">{activeTab === 'flights' ? "Economy Class" : "Economy Class"}</span>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'hotels') {
                navigate(`/hotels?dest=${encodeURIComponent(hotelDest)}&checkin=${checkInDate}&checkout=${checkOutDate}&rooms=${rooms}&guests=${guests}`)
              } else {
                console.log('Search clicked for:', activeTab)
              }
            }}
            className="flex-1 flex items-center justify-center gap-[10px] bg-[#e53935] hover:bg-red-700 text-white rounded-[16px] font-semibold border-none cursor-pointer h-full px-[20px] transition-colors shadow-sm"
          >
            <SearchIcon className="w-5 h-5 text-white" />
            <span className="font-sans font-semibold text-[16px] text-white leading-none">Search</span>
          </button>
        </div>

      </div>
    </div>
  )
}

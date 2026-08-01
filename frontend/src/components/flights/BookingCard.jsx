import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import flightService from '../../services/flightService'
import {
  FlightsIcon,
  HotelsIcon,
  HolidayIcon,
  SwapIcon,
  CalendarIcon,
  SearchIcon
} from '../common/Icons'

// Helper to parse date string YYYY-MM-DD or DD/MM/YYYY into local Date object without timezone shift
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date()
  const str = String(dateStr).trim()
  if (str.includes('-')) {
    const parts = str.split('-')
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10) - 1
      const d = parseInt(parts[2], 10)
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d)
    }
  }
  if (str.includes('/')) {
    const parts = str.split('/')
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10)
      const m = parseInt(parts[1], 10) - 1
      const y = parseInt(parts[2], 10)
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m, d)
    }
  }
  const parsed = new Date(str)
  return !isNaN(parsed.getTime()) ? parsed : new Date()
}

const TABS = [
  { id: 'flights', label: 'Flights', Icon: FlightsIcon, iconWidth: '37.04px', iconHeight: '20.636px', width: '55.56px' },
  { id: 'hotels', label: 'Hotels', Icon: HotelsIcon, iconWidth: '33.67px', iconHeight: '21.549px', width: '44px' },
  { id: 'holiday', label: 'Holiday', Icon: HolidayIcon, iconWidth: '41.751px', iconHeight: '28.283px', width: '53px' },
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

const POPULAR_AIRPORTS = [
  // Major Domestic Airports (India)
  { city: 'Delhi / (DEL)', airport: 'Indira Gandhi Intl Airport', code: 'DEL', country: 'India' },
  { city: 'Mumbai / (BOM)', airport: 'Chhatrapati Shivaji Intl Airport', code: 'BOM', country: 'India' },
  { city: 'Bangalore / (BLR)', airport: 'Kempegowda Intl Airport', code: 'BLR', country: 'India' },
  { city: 'Goa (Dabolim) / (GOI)', airport: 'Dabolim Airport', code: 'GOI', country: 'India' },
  { city: 'Goa (Mopa) / (GOX)', airport: 'Manohar Intl Airport', code: 'GOX', country: 'India' },
  { city: 'Hyderabad / (HYD)', airport: 'Rajiv Gandhi Intl Airport', code: 'HYD', country: 'India' },
  { city: 'Chennai / (MAA)', airport: 'Chennai Intl Airport', code: 'MAA', country: 'India' },
  { city: 'Kolkata / (CCU)', airport: 'Netaji Subhash Chandra Bose Intl', code: 'CCU', country: 'India' },
  { city: 'Ahmedabad / (AMD)', airport: 'Sardar Vallabhbhai Patel Intl', code: 'AMD', country: 'India' },
  { city: 'Jaipur / (JAI)', airport: 'Jaipur Intl Airport', code: 'JAI', country: 'India' },
  { city: 'Kochi / (COK)', airport: 'Cochin Intl Airport', code: 'COK', country: 'India' },
  { city: 'Pune / (PNQ)', airport: 'Pune Airport', code: 'PNQ', country: 'India' },
  { city: 'Lucknow / (LKO)', airport: 'Chaudhary Charan Singh Intl', code: 'LKO', country: 'India' },
  { city: 'Chandigarh / (IXC)', airport: 'Chandigarh Intl Airport', code: 'IXC', country: 'India' },
  { city: 'Varanasi / (VNS)', airport: 'Lal Bahadur Shastri Intl', code: 'VNS', country: 'India' },
  { city: 'Amritsar / (ATQ)', airport: 'Sri Guru Ram Dass Jee Intl', code: 'ATQ', country: 'India' },
  { city: 'Srinagar / (SXR)', airport: 'Sheikh ul-Alam Intl Airport', code: 'SXR', country: 'India' },
  { city: 'Guwahati / (GAU)', airport: 'Lokpriya Gopinath Bordoloi Intl', code: 'GAU', country: 'India' },
  { city: 'Bhubaneswar / (BBI)', airport: 'Biju Patnaik Intl Airport', code: 'BBI', country: 'India' },
  { city: 'Indore / (IDR)', airport: 'Devi Ahilya Bai Holkar Airport', code: 'IDR', country: 'India' },
  { city: 'Bagdogra / (IXB)', airport: 'Bagdogra Airport', code: 'IXB', country: 'India' },
  { city: 'Patna / (PAT)', airport: 'Jay Prakash Narayan Airport', code: 'PAT', country: 'India' },
  { city: 'Thiruvananthapuram / (TRV)', airport: 'Trivandrum Intl Airport', code: 'TRV', country: 'India' },
  { city: 'Coimbatore / (CJB)', airport: 'Coimbatore Intl Airport', code: 'CJB', country: 'India' },
  { city: 'Calicut / (CCJ)', airport: 'Calicut Intl Airport', code: 'CCJ', country: 'India' },

  // Major International Airports (Middle East & Gulf)
  { city: 'Dubai / (DXB)', airport: 'Dubai International Airport', code: 'DXB', country: 'United Arab Emirates' },
  { city: 'Abu Dhabi / (AUH)', airport: 'Zayed International Airport', code: 'AUH', country: 'United Arab Emirates' },
  { city: 'Sharjah / (SHJ)', airport: 'Sharjah International Airport', code: 'SHJ', country: 'United Arab Emirates' },
  { city: 'Doha / (DOH)', airport: 'Hamad International Airport', code: 'DOH', country: 'Qatar' },
  { city: 'Riyadh / (RUH)', airport: 'King Khalid Intl Airport', code: 'RUH', country: 'Saudi Arabia' },
  { city: 'Jeddah / (JED)', airport: 'King Abdulaziz Intl Airport', code: 'JED', country: 'Saudi Arabia' },
  { city: 'Muscat / (MCT)', airport: 'Muscat International Airport', code: 'MCT', country: 'Oman' },
  { city: 'Bahrain / (BAH)', airport: 'Bahrain International Airport', code: 'BAH', country: 'Bahrain' },
  { city: 'Kuwait / (KWI)', airport: 'Kuwait International Airport', code: 'KWI', country: 'Kuwait' },

  // Major International Airports (Southeast Asia & Asia)
  { city: 'Singapore / (SIN)', airport: 'Changi Airport', code: 'SIN', country: 'Singapore' },
  { city: 'Bangkok (Suvarnabhumi) / (BKK)', airport: 'Suvarnabhumi Airport', code: 'BKK', country: 'Thailand' },
  { city: 'Bangkok (Don Mueang) / (DMK)', airport: 'Don Mueang Intl Airport', code: 'DMK', country: 'Thailand' },
  { city: 'Phuket / (HKT)', airport: 'Phuket International Airport', code: 'HKT', country: 'Thailand' },
  { city: 'Kuala Lumpur / (KUL)', airport: 'Kuala Lumpur Intl Airport', code: 'KUL', country: 'Malaysia' },
  { city: 'Bali (Denpasar) / (DPS)', airport: 'Ngurah Rai Intl Airport', code: 'DPS', country: 'Indonesia' },
  { city: 'Tokyo (Narita) / (NRT)', airport: 'Narita International Airport', code: 'NRT', country: 'Japan' },
  { city: 'Tokyo (Haneda) / (HND)', airport: 'Tokyo Haneda Airport', code: 'HND', country: 'Japan' },
  { city: 'Seoul (Incheon) / (ICN)', airport: 'Incheon International Airport', code: 'ICN', country: 'South Korea' },
  { city: 'Kathmandu / (KTM)', airport: 'Tribhuvan International Airport', code: 'KTM', country: 'Nepal' },
  { city: 'Male / (MLE)', airport: 'Velana International Airport', code: 'MLE', country: 'Maldives' },
  { city: 'Colombo / (CMB)', airport: 'Bandaranaike Intl Airport', code: 'CMB', country: 'Sri Lanka' },

  // Major International Airports (Europe & Americas)
  { city: 'London (Heathrow) / (LHR)', airport: 'Heathrow Airport', code: 'LHR', country: 'United Kingdom' },
  { city: 'Paris (Charles de Gaulle) / (CDG)', airport: 'Charles de Gaulle Airport', code: 'CDG', country: 'France' },
  { city: 'Frankfurt / (FRA)', airport: 'Frankfurt Airport', code: 'FRA', country: 'Germany' },
  { city: 'Zurich / (ZRH)', airport: 'Zurich Airport', code: 'ZRH', country: 'Switzerland' },
  { city: 'Amsterdam / (AMS)', airport: 'Amsterdam Airport Schiphol', code: 'AMS', country: 'Netherlands' },
  { city: 'Milan / (MXP)', airport: 'Malpensa Airport', code: 'MXP', country: 'Italy' },
  { city: 'Rome / (FCO)', airport: 'Leonardo da Vinci–Fiumicino', code: 'FCO', country: 'Italy' },
  { city: 'Istanbul / (IST)', airport: 'Istanbul Airport', code: 'IST', country: 'Turkey' },
  { city: 'New York (JFK) / (JFK)', airport: 'John F. Kennedy Intl Airport', code: 'JFK', country: 'United States' },
  { city: 'Los Angeles / (LAX)', airport: 'Los Angeles Intl Airport', code: 'LAX', country: 'United States' },
  { city: 'Toronto / (YYZ)', airport: 'Toronto Pearson Intl Airport', code: 'YYZ', country: 'Canada' },
  { city: 'Sydney / (SYD)', airport: 'Sydney Kingsford Smith Airport', code: 'SYD', country: 'Australia' }
]

// Airport Picker Modal Component with Live Adivaha Search
function AirportPickerModal({ title, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [apiAirports, setApiAirports] = useState([])
  const [isSearchingApi, setIsSearchingApi] = useState(false)

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setApiAirports([])
      setIsSearchingApi(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true)
      try {
        const res = await flightService.searchLocations(searchTerm.trim())
        let list = []
        if (Array.isArray(res?.data?.airports)) list = res.data.airports
        else if (Array.isArray(res?.airports)) list = res.airports
        else if (Array.isArray(res?.data)) list = res.data
        else if (Array.isArray(res?.responseData?.airports)) list = res.responseData.airports
        else if (Array.isArray(res)) list = res

        if (list.length > 0) {
          const formatted = list.map((item) => {
            const cityName = item.CityName || item.city_name || item.name || item.code || ''
            const airportName = item.name || item.airport_name || item.fullname || 'Airport'
            const code = item.code || item.CityCode || item.iata || ''
            const country = item.CountryName || item.country_name || item.country || ''
            return {
              city: `${cityName} / (${code})`,
              airport: airportName,
              code: code,
              country: country
            }
          }).filter(x => x.code)
          setApiAirports(formatted)
        } else {
          setApiAirports([])
        }
      } catch (err) {
        console.warn('Adivaha location search error:', err)
      } finally {
        setIsSearchingApi(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredLocal = POPULAR_AIRPORTS.filter(
    (item) =>
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.airport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayedAirports = apiAirports.length > 0 ? apiAirports : filteredLocal

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div
        className="absolute left-0 top-full mt-3 xl:top-0 xl:mt-0 xl:left-[calc(100%+16px)] z-50 w-full xl:w-[380px] h-full backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.95)] rounded-[13.444px] border border-[#e8e8e8] shadow-[0px_4px_14px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col justify-between animate-in fade-in slide-in-from-left-2 duration-200 text-left font-satoshi"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e8e8] bg-white/40 shrink-0">
          <div>
            <h3 className="font-satoshi font-bold text-[#1a1a1a] text-[16px] leading-tight m-0">{title}</h3>
            <p className="font-satoshi font-normal text-[#666] text-[11px] m-0">Search city or select airport</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold text-xs border-none cursor-pointer transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5 border-b border-[#e8e8e8] bg-white/60 shrink-0">
          <div className="relative flex items-center">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city, airport or code..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e8e8] rounded-[10px] font-satoshi font-medium text-[13px] text-[#1a1a1a] outline-none focus:border-[#e53935] focus:ring-1 focus:ring-red-100 transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* Airport List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {isSearchingApi ? (
            <div className="py-6 text-center font-satoshi text-gray-400 text-xs flex items-center justify-center gap-2">
              <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
              Searching Adivaha API...
            </div>
          ) : displayedAirports.length > 0 ? (
            displayedAirports.map((item, index) => (
              <button
                key={item.code || index}
                type="button"
                onClick={() => {
                  onSelect(item)
                  onClose()
                }}
                className="w-full p-2.5 rounded-[10px] text-left hover:bg-[#FCECEC]/60 border border-transparent hover:border-[#e53935]/20 bg-transparent cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-gray-100 group-hover:bg-[#FCECEC] text-gray-600 group-hover:text-[#e53935] flex items-center justify-center font-bold text-xs transition-colors shrink-0 font-satoshi">
                    ✈
                  </div>
                  <div>
                    <span className="font-satoshi font-bold text-[13px] text-[#1a1a1a] block group-hover:text-[#e53935] transition-colors">{item.city}</span>
                    <span className="font-satoshi font-normal text-[10px] text-[#666]">{item.airport} · {item.country}</span>
                  </div>
                </div>
                <span className="font-satoshi font-extrabold text-[10px] px-2 py-0.5 rounded-[5px] bg-gray-100 group-hover:bg-[#e53935] group-hover:text-white text-[#3c3c3c] transition-all">
                  {item.code}
                </span>
              </button>
            ))
          ) : (
            <div className="py-6 text-center font-satoshi text-gray-400 text-xs">
              No airports found matching "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Custom DatePicker Component with Live API Prices
function CustomDatePicker({ selectedDate, onChange, onClose, minDate, title = "Select Date", origin = "DEL", destination = "DXB" }) {
  const [currentMonth, setCurrentMonth] = useState(() => parseLocalDate(selectedDate))

  const [faresMap, setFaresMap] = useState({})
  const [loadingFares, setLoadingFares] = useState(false)

  const validMonthDate = !isNaN(currentMonth.getTime()) ? currentMonth : new Date()
  const year = validMonthDate.getFullYear()
  const month = validMonthDate.getMonth()

  useEffect(() => {
    let isMounted = true
    const fetchFares = async () => {
      setLoadingFares(true)
      try {
        const yearVal = currentMonth.getFullYear()
        const monthVal = String(currentMonth.getMonth() + 1).padStart(2, '0')
        const reqDate = `${yearVal}-${monthVal}-01`

        const res = await flightService.getCalendarFare({
          origin: origin || 'DEL',
          destination: destination || 'DXB',
          departureDate: reqDate,
          cabinClass: 'Economy'
        })

        if (isMounted && res?.data) {
          const map = {}
          const items = Array.isArray(res.data) ? res.data : (res.data?.SearchResults || [])
          if (Array.isArray(items)) {
            items.forEach(item => {
              if (!item) return
              const d = item.DepartureDate || item.date || item.Date
              const p = item.Fare || item.price || item.SingleAdult || item.Price
              if (d && p) {
                const cleanD = String(d).split('T')[0].split(' ')[0]
                const dObj = parseLocalDate(cleanD)
                const y = dObj.getFullYear()
                const m = String(dObj.getMonth() + 1).padStart(2, '0')
                const dayVal = String(dObj.getDate()).padStart(2, '0')
                const dateKey = `${y}-${m}-${dayVal}`
                map[dateKey] = p
              }
            })
          }
          setFaresMap(map)
        }
      } catch (err) {
        console.warn('Calendar fare fetch notice:', err)
      } finally {
        if (isMounted) setLoadingFares(false)
      }
    }
    fetchFares()
    return () => { isMounted = false }
  }, [currentMonth, origin, destination, selectedDate])

  const handlePrevMonth = (e) => {
    e.stopPropagation()
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = (e) => {
    e.stopPropagation()
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const monthName = validMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const days = []
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const minDateObj = (() => {
    const d = parseLocalDate(minDate)
    d.setHours(0, 0, 0, 0)
    return d
  })()

  // Helper to generate dynamic fallback price tag
  const getFareForDate = (dateStr, dayNum) => {
    if (faresMap[dateStr]) {
      const p = Number(String(faresMap[dateStr]).replace(/[^\d.]/g, ''))
      if (!isNaN(p) && p > 0) {
        return `₹${p >= 1000 ? (p / 1000).toFixed(1) + 'k' : p}`
      }
    }
    // No API data found for this date, do not show any mock price
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div
        className="absolute left-0 top-full mt-3 xl:top-0 xl:mt-0 xl:left-[calc(100%+16px)] z-50 w-full xl:w-[380px] h-full backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.95)] rounded-[13.444px] border border-[#e8e8e8] shadow-[0px_4px_14px_rgba(0,0,0,0.15)] p-5 flex flex-col justify-between animate-in fade-in slide-in-from-left-2 duration-200 text-left font-satoshi overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#e8e8e8] shrink-0">
          <div>
            <span className="font-satoshi font-bold text-[#1a1a1a] text-[16px] block">{title}</span>
            <span className="font-satoshi font-normal text-[#666] text-[11px]">Live fares for {origin} → {destination}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 font-bold text-xs border-none cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {/* Month & Nav */}
        <div className="flex items-center justify-between px-1 shrink-0">
          <span className="font-satoshi font-bold text-[#1a1a1a] text-[14px]">{monthName}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors cursor-pointer bg-white text-xs font-bold font-satoshi"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors cursor-pointer bg-white text-xs font-bold font-satoshi"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 text-center text-[11px] font-bold text-gray-400 font-satoshi shrink-0">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-center font-satoshi flex-1 items-center">
          {days.map((d, index) => {
            if (!d) return <div key={`empty-${index}`} />

            const isPast = d < minDateObj
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const dayNum = String(d.getDate()).padStart(2, '0')
            const dateStr = `${y}-${m}-${dayNum}`

            const isSelected = selectedDate === dateStr
            const fareLabel = getFareForDate(dateStr, d.getDate())

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(dateStr)
                  onClose()
                }}
                className={`h-10 w-full rounded-xl py-1 flex flex-col items-center justify-center transition-all ${isSelected
                    ? 'bg-[#e53935] text-white shadow-md'
                    : isPast
                      ? 'text-gray-300 cursor-not-allowed border-none bg-transparent'
                      : 'text-gray-700 hover:bg-[#FCECEC] hover:text-[#e53935] cursor-pointer border-none bg-transparent'
                  }`}
              >
                <span className="text-[12px] font-bold leading-none">{d.getDate()}</span>
                {!isPast && (
                  <span className={`text-[9px] font-extrabold mt-0.5 leading-none ${isSelected ? 'text-white/90' : 'text-emerald-600 font-sans'
                    }`}>
                    {fareLabel}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// Travellers & Cabin Class Modal
function TravellersClassModal({ adults, setAdults, children, setChildren, cabinClass, setCabinClass, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div
        className="absolute left-0 top-full mt-3 xl:top-0 xl:mt-0 xl:left-[calc(100%+16px)] z-50 w-full xl:w-[380px] h-full backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.95)] rounded-[13.444px] border border-[#e8e8e8] shadow-[0px_4px_14px_rgba(0,0,0,0.15)] p-5 flex flex-col justify-between animate-in fade-in slide-in-from-left-2 duration-200 text-left font-satoshi overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#e8e8e8] shrink-0">
          <div>
            <h3 className="font-satoshi font-bold text-[#1a1a1a] text-[16px] leading-tight m-0">Travellers & Class</h3>
            <p className="font-satoshi font-normal text-[#666] text-[11px] m-0">Choose passengers and seating class</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 font-bold text-xs border-none cursor-pointer transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Adults */}
        <div className="flex items-center justify-between shrink-0 py-1">
          <div>
            <span className="font-satoshi font-bold text-[#1a1a1a] text-[13px] block">Adults</span>
            <span className="font-satoshi font-normal text-[#666] text-[10px]">12+ years</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-7 h-7 rounded-full border border-[#e8e8e8] flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] bg-white cursor-pointer transition-colors text-xs"
            >
              -
            </button>
            <span className="font-satoshi font-bold text-[#1a1a1a] text-[13px] w-4 text-center">{adults}</span>
            <button
              type="button"
              onClick={() => setAdults(adults + 1)}
              className="w-7 h-7 rounded-full border border-[#e8e8e8] flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] bg-white cursor-pointer transition-colors text-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between shrink-0 py-1">
          <div>
            <span className="font-satoshi font-bold text-[#1a1a1a] text-[13px] block">Children</span>
            <span className="font-satoshi font-normal text-[#666] text-[10px]">2-12 years</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="w-7 h-7 rounded-full border border-[#e8e8e8] flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] bg-white cursor-pointer transition-colors text-xs"
            >
              -
            </button>
            <span className="font-satoshi font-bold text-[#1a1a1a] text-[13px] w-4 text-center">{children}</span>
            <button
              type="button"
              onClick={() => setChildren(children + 1)}
              className="w-7 h-7 rounded-full border border-[#e8e8e8] flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] bg-white cursor-pointer transition-colors text-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Cabin Class */}
        <div className="border-t border-[#e8e8e8] pt-3 flex flex-col gap-2 shrink-0">
          <span className="font-satoshi font-bold text-[10px] text-[#666] uppercase tracking-wider">Cabin Class</span>
          <div className="grid grid-cols-2 gap-2">
            {['Economy', 'Premium Economy', 'Business', 'First Class'].map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setCabinClass(cls)}
                className={`py-2 px-2.5 rounded-[10px] font-satoshi font-bold text-[11px] transition-all border cursor-pointer ${cabinClass === cls
                    ? 'bg-[#FCECEC] border-[#e53935] text-[#e53935] shadow-xs'
                    : 'bg-white border-[#e8e8e8] text-[#3c3c3c] hover:bg-gray-50'
                  }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="bg-[#e53935] hover:bg-red-700 text-white py-2.5 rounded-[10px] font-satoshi font-bold text-[13px] transition-colors cursor-pointer border-none shadow-sm shrink-0"
        >
          Apply Selection
        </button>
      </div>
    </>
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
  const [searchParams, setSearchParams] = useSearchParams()
  const [tripType, setTripType] = useState('one-way')
  const [isRotated, setIsRotated] = useState(false)

  // Swap Location States (Flights)
  const [fromLoc, setFromLoc] = useState({ city: 'Delhi / (DEL)', airport: 'Indira Gandhi Intl', code: 'DEL' })
  const [toLoc, setToLoc] = useState({ city: 'Mumbai / (BOM)', airport: 'Chhatrapati Shivaji Intl', code: 'BOM' })
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  // Multi-City Legs State
  const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()
  const tomorrowStr = (() => { const d = new Date(Date.now() + 24*60*60*1000); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()
  const [multiCityLegs, setMultiCityLegs] = useState([
    { from: { city: 'Delhi / (DEL)', airport: 'Indira Gandhi Intl', code: 'DEL' }, to: { city: 'Mumbai / (BOM)', airport: 'Chhatrapati Shivaji Intl', code: 'BOM' }, date: todayStr },
    { from: { city: 'Mumbai / (BOM)', airport: 'Chhatrapati Shivaji Intl', code: 'BOM' }, to: { city: 'Dubai / (DXB)', airport: 'Dubai International Airport', code: 'DXB' }, date: tomorrowStr },
  ])
  // which leg is showing a picker: { legIdx, field: 'from'|'to'|'date' } | null
  const [activeLegPicker, setActiveLegPicker] = useState(null)

  const updateLeg = (legIdx, field, value) => {
    setMultiCityLegs(prev => prev.map((leg, i) => i === legIdx ? { ...leg, [field]: value } : leg))
  }

  const addLeg = () => {
    if (multiCityLegs.length >= 6) return
    const last = multiCityLegs[multiCityLegs.length - 1]
    const nextDate = (() => { const d = new Date(last.date || todayStr); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()
    setMultiCityLegs(prev => [...prev, { from: last.to, to: { city: '', airport: '', code: '' }, date: nextDate }])
  }

  const removeLeg = (legIdx) => {
    if (multiCityLegs.length <= 2) return
    setMultiCityLegs(prev => prev.filter((_, i) => i !== legIdx))
  }

  const defaultDepDate = todayStr
  const defaultRetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const [flightDepDate, setFlightDepDate] = useState(defaultDepDate)
  const [flightRetDate, setFlightRetDate] = useState(defaultRetDate)
  const [showFlightDepCalendar, setShowFlightDepCalendar] = useState(false)
  const [showFlightRetCalendar, setShowFlightRetCalendar] = useState(false)

  // Flight Travellers & Class States
  const [flightAdults, setFlightAdults] = useState(1)
  const [flightChildren, setFlightChildren] = useState(0)
  const [flightInfants, setFlightInfants] = useState(0)
  const [flightCabinClass, setFlightCabinClass] = useState('Economy')
  const [showFlightTravellersDropdown, setShowFlightTravellersDropdown] = useState(false)

  // Hotel Search States
  const [hotelDest, setHotelDest] = useState('Goa, India')
  const [showDestDropdown, setShowDestDropdown] = useState(false)
  const [checkInDate, setCheckInDate] = useState('2026-04-10')
  const [checkOutDate, setCheckOutDate] = useState('2026-04-17')
  const [rooms, setRooms] = useState(1)
  const [guests, setGuests] = useState(2)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)

  // Holiday Search States
  const [holidayDest, setHolidayDest] = useState('Delhi')
  const [showHolidayDestDropdown, setShowHolidayDestDropdown] = useState(false)
  const [holidayBudget, setHolidayBudget] = useState('₹ 50,000')
  const [holidayStartDate, setHolidayStartDate] = useState('2026-04-10')
  const [holidayEndDate, setHolidayEndDate] = useState('2026-04-17')
  const [holidayTravelers, setHolidayTravelers] = useState(2)
  const [showHolidayStartDateCalendar, setShowHolidayStartDateCalendar] = useState(false)
  const [showHolidayEndDateCalendar, setShowHolidayEndDateCalendar] = useState(false)
  const [showHolidayTravelersDropdown, setShowHolidayTravelersDropdown] = useState(false)

  // Calendar popover visibility states
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false)
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false)

  const destInputRef = useRef(null)
  const holidayDestInputRef = useRef(null)

  const handleSwap = () => {
    const temp = { ...fromLoc }
    setFromLoc(toLoc)
    setToLoc(temp)
    setIsRotated(prev => !prev)
  }

  // Format YYYY-MM-DD date to DD/MM/YYYY and weekday name
  const formatDate = (dateStr) => {
    if (!dateStr) return { date: '', dayName: '' }
    const dateObj = parseLocalDate(dateStr)
    if (isNaN(dateObj.getTime())) return { date: String(dateStr), dayName: '' }

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
      id="search-booking-card"
      className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.8)] border border-[rgba(255,255,255,0.2)] border-solid rounded-[13.444px] shadow-[0px_4px_14px_rgba(0,0,0,0.15)] p-[24px] w-full max-w-[648px] relative z-10 transition-all duration-300"
    >
      {/* Tabs Section */}
      <div className="flex gap-[56px] px-[19px] h-[77px] items-start w-full select-none">
        {TABS.map(({ id, label, Icon, iconWidth, iconHeight, width }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab?.(id)
                if (window.location.pathname === '/') {
                  setSearchParams({ tab: id })
                }
              }}
              className="flex flex-col items-center pt-[11px] relative h-full bg-transparent border-none cursor-pointer p-0 group"
              style={{ width }}
            >
              <Icon
                className={`transition-colors ${isActive ? 'text-[#e53935]' : 'text-[#3c3c3c] group-hover:text-[#e53935]'
                  }`}
                style={{ width: iconWidth, height: iconHeight }}
              />
              <span
                className={`text-[14.11px] mt-[12px] transition-colors leading-none font-sans ${isActive
                  ? 'font-medium text-[#e53935]'
                  : 'font-normal text-[#3c3c3c] group-hover:text-[#e53935]'
                  }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#e53935] h-[4.41px] rounded-[17.638px]" />
              )}
            </button>
          )
        })}
      </div>
      <div className="h-px bg-[#e8e8e8] w-full mb-[24px]" />

      {/* Trip Types Selector (Flights only) */}
      {activeTab === 'flights' && (
        <div className="flex gap-[24px] mb-5 items-center justify-start select-none">
          {TRIP_TYPES.map(({ value, label }) => {
            const isChecked = tripType === value
            return (
              <label
                key={value}
                onClick={() => setTripType(value)}
                className={`flex gap-[8px] items-center px-[12px] py-[4px] rounded-[26.888px] cursor-pointer transition-all ${isChecked ? 'bg-[#FCECEC] bg-opacity-50 backdrop-blur-[2.9px]' : ''
                  }`}
              >
                <div
                  className={`w-[16px] h-[16px] rounded-full border flex items-center justify-center transition-all shrink-0 ${isChecked ? 'border-[#e53935] border-[1.5px]' : 'border-[#252525] border-[1px]'
                    } bg-white`}
                >
                  {isChecked && (
                    <div className="w-[8px] h-[8px] rounded-full bg-[#e53935]" />
                  )}
                </div>
                <span className="font-['Poppins:Medium'] font-medium text-[17px] text-black leading-none">{label}</span>
              </label>
            )
          })}
        </div>
      )}

      {/* Form Fields Wrapper */}
      <div className="flex flex-col gap-[8px]">

        {/* Destination Field (Hotels / Holiday) or From-To (Flights) */}
        {activeTab === 'flights' ? (
          tripType === 'multi-city' ? (
            /* ── Multi-City Legs UI ── */
            <div className="flex flex-col gap-[10px] w-full">
              {multiCityLegs.map((leg, legIdx) => (
                <div key={legIdx} className="relative flex flex-col gap-[6px] bg-white/60 border border-[#e8e8e8] rounded-[12px] p-[12px]">
                  {/* Leg header */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-satoshi font-bold text-[11px] text-[#e53935] uppercase tracking-wider">
                      ✈ Flight {legIdx + 1}
                    </span>
                    {multiCityLegs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeLeg(legIdx)}
                        className="text-[10px] font-bold text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 px-2 py-0.5 rounded-full border-none cursor-pointer transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* From / To row */}
                  <div className="flex gap-[8px] items-center">
                    {/* From / To Wrapper */}
                    <div className="relative flex flex-1 gap-[8px] items-center">
                      {/* From */}
                      <div
                        className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1px] flex flex-col gap-[2px] items-start px-[12px] py-[7px] rounded-[10px] flex-1 cursor-pointer hover:border-[#e53935]/40 transition-colors"
                        onClick={() => setActiveLegPicker({ legIdx, field: 'from' })}
                      >
                        <span className="font-satoshi font-normal text-[#666] text-[11px] leading-none">From</span>
                        <span className="font-satoshi font-bold text-[#1a1a1a] text-[15px] leading-tight font-sans">
                          {leg.from.code ? leg.from.city : <span className="text-gray-400 font-normal text-[13px]">Select city</span>}
                        </span>
                        {leg.from.code && <span className="font-satoshi font-normal text-[#666] text-[10px] leading-none font-sans">{leg.from.airport}</span>}
                      </div>

                      {/* Swap mini-button */}
                      <button
                        type="button"
                        onClick={() => { const tmp = leg.from; updateLeg(legIdx, 'from', leg.to); updateLeg(legIdx, 'to', tmp) }}
                        className="absolute left-[calc(50%-13px)] top-[12px] bg-white border-[#e8e8e8] border rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer hover:border-gray-400 z-10 shrink-0"
                        aria-label="Swap"
                      >
                        <SwapIcon className="w-[11px] h-[9px] text-[#e53935]" />
                      </button>

                      {/* To */}
                      <div
                        className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1px] flex flex-col gap-[2px] items-start px-[12px] py-[7px] rounded-[10px] flex-1 cursor-pointer hover:border-[#e53935]/40 transition-colors"
                        onClick={() => setActiveLegPicker({ legIdx, field: 'to' })}
                      >
                        <span className="font-satoshi font-normal text-[#666] text-[11px] leading-none">To</span>
                        <span className="font-satoshi font-bold text-[#1a1a1a] text-[15px] leading-tight font-sans">
                          {leg.to.code ? leg.to.city : <span className="text-gray-400 font-normal text-[13px]">Select city</span>}
                        </span>
                        {leg.to.code && <span className="font-satoshi font-normal text-[#666] text-[10px] leading-none font-sans">{leg.to.airport}</span>}
                      </div>
                    </div>

                    {/* Date */}
                    <div
                      className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1px] flex flex-col gap-[2px] items-start px-[12px] py-[7px] rounded-[10px] cursor-pointer hover:border-[#e53935]/40 transition-colors shrink-0"
                      onClick={() => setActiveLegPicker({ legIdx, field: 'date' })}
                    >
                      <span className="font-satoshi font-normal text-[#666] text-[11px] leading-none">Date</span>
                      <span className="font-satoshi font-bold text-[#1a1a1a] text-[15px] font-sans">{formatDate(leg.date).date}</span>
                      <span className="font-satoshi font-normal text-[#666] text-[10px] leading-none">{formatDate(leg.date).dayName}</span>
                    </div>
                  </div>

                  {/* Leg Airport Pickers */}
                  {activeLegPicker?.legIdx === legIdx && activeLegPicker?.field === 'from' && (
                    <AirportPickerModal
                      title={`Flight ${legIdx + 1} — Departure City`}
                      onSelect={(airport) => { updateLeg(legIdx, 'from', airport); setActiveLegPicker(null) }}
                      onClose={() => setActiveLegPicker(null)}
                    />
                  )}
                  {activeLegPicker?.legIdx === legIdx && activeLegPicker?.field === 'to' && (
                    <AirportPickerModal
                      title={`Flight ${legIdx + 1} — Arrival City`}
                      onSelect={(airport) => { updateLeg(legIdx, 'to', airport); setActiveLegPicker(null) }}
                      onClose={() => setActiveLegPicker(null)}
                    />
                  )}
                  {activeLegPicker?.legIdx === legIdx && activeLegPicker?.field === 'date' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveLegPicker(null)} />
                      <CustomDatePicker
                        title={`Flight ${legIdx + 1} — Departure Date`}
                        selectedDate={leg.date}
                        onChange={(dateStr) => { updateLeg(legIdx, 'date', dateStr); setActiveLegPicker(null) }}
                        onClose={() => setActiveLegPicker(null)}
                        minDate={legIdx > 0 ? multiCityLegs[legIdx - 1].date : undefined}
                      />
                    </>
                  )}
                </div>
              ))}

              {/* Add City Button */}
              {multiCityLegs.length < 6 && (
                <button
                  type="button"
                  onClick={addLeg}
                  className="flex items-center gap-2 text-[#e53935] font-satoshi font-bold text-[13px] bg-[#FCECEC] hover:bg-red-100 border border-[#e53935]/30 rounded-[10px] px-4 py-2.5 cursor-pointer transition-all self-start"
                >
                  <span className="text-[18px] leading-none">+</span>
                  Add City
                  <span className="text-[10px] text-[#e53935]/60 font-normal ml-1">({multiCityLegs.length}/6)</span>
                </button>
              )}
            </div>
          ) : (
            /* ── One-Way / Round-Trip From-To ── */
            <div className="relative flex gap-[8px] items-center w-full">
              {/* From */}
              <div
                className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] flex-1 cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => {
                  setShowFromDropdown(true)
                  setShowToDropdown(false)
                  setShowFlightDepCalendar(false)
                  setShowFlightRetCalendar(false)
                  setShowFlightTravellersDropdown(false)
                }}
              >
                <span className="font-satoshi font-normal text-[#666] text-[12px] leading-none">From</span>
                <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px] leading-normal font-sans">{fromLoc.city}</span>
                <span className="font-satoshi font-normal text-[#666] text-[10px] leading-none font-sans">{fromLoc.airport}</span>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="absolute left-[calc(50%-16.8px)] top-[16px] bg-white border-[#e8e8e8] border-[0.672px] rounded-full w-[33.61px] h-[33.61px] flex items-center justify-center cursor-pointer hover:border-gray-400 z-10"
                style={{ transform: `rotate(${isRotated ? 180 : 0}deg)`, transition: 'transform 0.5s' }}
                aria-label="Swap locations"
              >
                <SwapIcon className="w-[13.3px] h-[11.2px] text-[#e53935]" />
              </button>

              {/* To */}
              <div
                className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[20px] py-[8px] rounded-[10.134px] flex-1 cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => {
                  setShowToDropdown(true)
                  setShowFromDropdown(false)
                  setShowFlightDepCalendar(false)
                  setShowFlightRetCalendar(false)
                  setShowFlightTravellersDropdown(false)
                }}
              >
                <span className="font-satoshi font-normal text-[#666] text-[12px] leading-none">To</span>
                <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px] leading-normal font-sans">{toLoc.city}</span>
                <span className="font-satoshi font-normal text-[#666] text-[10px] leading-none font-sans">{toLoc.airport}</span>
              </div>
            </div>
          )
        ) : activeTab === 'hotels' ? (
          <div className="relative flex flex-col gap-[8px] items-stretch w-full">
            <div
              className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] w-full relative cursor-pointer"
              onClick={() => {
                destInputRef.current?.focus()
                setShowDestDropdown(true)
              }}
            >
              <span className="font-satoshi font-normal text-[#666] text-[12px] leading-none">Destination</span>
              <input
                ref={destInputRef}
                type="text"
                value={hotelDest}
                onChange={(e) => setHotelDest(e.target.value)}
                onFocus={() => setShowDestDropdown(true)}
                className="text-[18px] font-satoshi font-bold text-[#1a1a1a] bg-transparent border-none outline-none w-full p-0 m-0 placeholder-gray-400 cursor-text"
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
          <div className="relative flex gap-[8px] items-center w-full">
            {/* Destination */}
            <div
              className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] flex-1 relative cursor-pointer"
              onClick={() => {
                holidayDestInputRef.current?.focus()
                setShowHolidayDestDropdown(true)
              }}
            >
              <span className="font-satoshi font-normal text-[#666] text-[12px] leading-none">Destination</span>
              <input
                ref={holidayDestInputRef}
                type="text"
                value={holidayDest}
                onChange={(e) => setHolidayDest(e.target.value)}
                onFocus={() => setShowHolidayDestDropdown(true)}
                className="text-[18px] font-satoshi font-bold text-[#1a1a1a] bg-transparent border-none outline-none w-full p-0 m-0 placeholder-gray-400 cursor-text"
                placeholder="Enter destination..."
              />

              {showHolidayDestDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowHolidayDestDropdown(false) }} />
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
                          setHolidayDest(dest)
                          setShowHolidayDestDropdown(false)
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

            {/* Budget */}
            <div className="backdrop-blur-[5.7px] bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] items-start px-[16px] py-[8px] rounded-[10.134px] flex-1">
              <span className="font-satoshi font-normal text-[#666] text-[12px] leading-none">Budget</span>
              <input
                type="text"
                value={holidayBudget}
                onChange={(e) => setHolidayBudget(e.target.value)}
                className="text-[18px] font-satoshi font-bold text-[#1a1a1a] bg-transparent border-none outline-none w-full p-0 m-0 placeholder-gray-400 cursor-text"
                placeholder="Enter budget..."
              />
            </div>
          </div>
        )}

        {/* Departure-Return (Flights) OR Checkin-Checkout (Hotels / Holiday) */}
        {activeTab === 'flights' ? (
          tripType !== 'multi-city' ? (
            <div className="flex gap-[8px] items-center relative w-full font-sans text-left">
              {/* Departure Date */}
              <div className="flex-1">
                <div
                  className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => {
                    setShowFlightDepCalendar(true)
                    setShowFlightRetCalendar(false)
                    setShowFromDropdown(false)
                    setShowToDropdown(false)
                    setShowFlightTravellersDropdown(false)
                  }}
                >
                  <div className="flex flex-col gap-[4px] items-start leading-none font-sans">
                    <span className="font-satoshi font-normal text-[#666] text-[12px]">Departure</span>
                    <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{formatDate(flightDepDate).date}</span>
                    <span className="font-satoshi font-normal text-[#666] text-[10px]">{formatDate(flightDepDate).dayName}</span>
                  </div>
                  <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                    <CalendarIcon className="w-[25.7px] h-[24.1px] text-[#AFAFAF]" />
                  </div>
                </div>
              </div>

              {/* Return Date */}
              <div className="flex-1">
                <div
                  className={`bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] transition-colors ${tripType === 'one-way' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'
                    }`}
                  onClick={() => {
                    if (tripType !== 'one-way') {
                      setShowFlightRetCalendar(true)
                      setShowFlightDepCalendar(false)
                      setShowFromDropdown(false)
                      setShowToDropdown(false)
                      setShowFlightTravellersDropdown(false)
                    }
                  }}
                >
                  <div className="flex flex-col gap-[4px] items-start leading-none font-sans">
                    <span className="font-satoshi font-normal text-[#666] text-[12px]">Return</span>
                    <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">
                      {tripType === 'one-way' ? 'Select Date' : formatDate(flightRetDate).date}
                    </span>
                    <span className="font-satoshi font-normal text-[#666] text-[10px]">
                      {tripType === 'one-way' ? 'Save more on round trips' : formatDate(flightRetDate).dayName}
                    </span>
                  </div>
                  <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                    <CalendarIcon className="w-[25.7px] h-[24.1px] text-[#AFAFAF]" />
                  </div>
                </div>
              </div>
            </div>
          ) : null
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
                  <span className="font-satoshi font-normal text-[#666] text-[12px]">Check-in</span>
                  <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{formatDate(checkInDate).date}</span>
                  <span className="font-satoshi font-normal text-[#666] text-[10px]">{formatDate(checkInDate).dayName}</span>
                </div>
                <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                  <CalendarIcon className="w-[25.7px] h-[24.1px] text-[#AFAFAF]" />
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
                  <span className="font-satoshi font-normal text-[#666] text-[12px]">Check-out</span>
                  <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{formatDate(checkOutDate).date}</span>
                  <span className="font-satoshi font-normal text-[#666] text-[10px]">{formatDate(checkOutDate).dayName}</span>
                </div>
                <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                  <CalendarIcon className="w-[25.7px] h-[24.1px] text-[#AFAFAF]" />
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
            {/* Start Date */}
            <div className="flex-1 relative">
              <div
                className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => {
                  setShowHolidayStartDateCalendar(true)
                  setShowHolidayEndDateCalendar(false)
                }}
              >
                <div className="flex flex-col gap-[4px] items-start leading-none">
                  <span className="font-satoshi font-normal text-[#666] text-[12px]">Start Date</span>
                  <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{formatDate(holidayStartDate).date}</span>
                  <span className="font-satoshi font-normal text-[#666] text-[10px]">{formatDate(holidayStartDate).dayName}</span>
                </div>
                <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                  <CalendarIcon className="w-[25.7px] h-[24.1px] text-[#AFAFAF]" />
                </div>
              </div>

              {showHolidayStartDateCalendar && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowHolidayStartDateCalendar(false) }} />
                  <CustomDatePicker
                    selectedDate={holidayStartDate}
                    onChange={(dateStr) => {
                      setHolidayStartDate(dateStr)
                      const start = new Date(dateStr)
                      const end = new Date(holidayEndDate)
                      if (end <= start) {
                        const nextDate = new Date(start)
                        nextDate.setDate(start.getDate() + 7) // default to 7 nights for holiday packages
                        const y = nextDate.getFullYear()
                        const m = String(nextDate.getMonth() + 1).padStart(2, '0')
                        const d = String(nextDate.getDate()).padStart(2, '0')
                        setHolidayEndDate(`${y}-${m}-${d}`)
                      }
                    }}
                    onClose={() => setShowHolidayStartDateCalendar(false)}
                  />
                </>
              )}
            </div>

            {/* End Date */}
            <div className="flex-1 relative">
              <div
                className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[16px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors"
                onClick={() => {
                  setShowHolidayEndDateCalendar(true)
                  setShowHolidayStartDateCalendar(false)
                }}
              >
                <div className="flex flex-col gap-[4px] items-start leading-none">
                  <span className="font-satoshi font-normal text-[#666] text-[12px]">End Date</span>
                  <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{formatDate(holidayEndDate).date}</span>
                  <span className="font-satoshi font-normal text-[#666] text-[10px]">{formatDate(holidayEndDate).dayName}</span>
                </div>
                <div className="w-[32.47px] h-[32.47px] flex items-center justify-center">
                  <CalendarIcon className="w-[25.7px] h-[24.1px] text-[#AFAFAF]" />
                </div>
              </div>

              {showHolidayEndDateCalendar && (
                <>
                  <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowHolidayEndDateCalendar(false) }} />
                  <CustomDatePicker
                    selectedDate={holidayEndDate}
                    onChange={setHolidayEndDate}
                    onClose={() => setShowHolidayEndDateCalendar(false)}
                    minDate={holidayStartDate}
                  />
                </>
              )}
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
                    <span className="font-satoshi font-normal text-[#666] text-[12px]">Guests & Rooms</span>
                    <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{guests} Guest{guests > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}</span>
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
            ) : activeTab === 'holiday' ? (
              <div className="h-full relative">
                <div
                  className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex items-center justify-between px-[17px] py-[8px] rounded-[10.134px] cursor-pointer hover:border-gray-300 transition-colors h-full"
                  onClick={() => setShowHolidayTravelersDropdown(!showHolidayTravelersDropdown)}
                >
                  <div className="flex flex-col gap-[4px] items-start leading-none">
                    <span className="font-satoshi font-normal text-[#666] text-[12px]">Travelers</span>
                    <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px]">{holidayTravelers} Adult{holidayTravelers > 1 ? 's' : ''}</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                </div>

                {showHolidayTravelersDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowHolidayTravelersDropdown(false) }} />
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-gray-150 p-4 shadow-xl z-50 w-64 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700 font-sans">Travelers</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setHolidayTravelers(Math.max(1, holidayTravelers - 1)) }}
                            className="w-8 h-8 rounded-full border border-gray-250 flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors bg-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-gray-900 w-4 text-center">{holidayTravelers}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setHolidayTravelers(holidayTravelers + 1) }}
                            className="w-8 h-8 rounded-full border border-gray-250 flex items-center justify-center font-bold text-gray-600 hover:border-[#e53935] hover:text-[#e53935] transition-colors bg-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setShowHolidayTravelersDropdown(false) }}
                        className="bg-[#e53935] text-white py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer border-none"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                className="bg-[rgba(255,255,255,0.75)] border-[#e8e8e8] border-[1.013px] border-solid flex flex-col gap-[4px] px-[17px] py-[8px] rounded-[10.134px] h-full justify-center cursor-pointer hover:border-gray-300 transition-colors text-left"
                onClick={() => {
                  setShowFlightTravellersDropdown(true)
                  setShowFromDropdown(false)
                  setShowToDropdown(false)
                  setShowFlightDepCalendar(false)
                  setShowFlightRetCalendar(false)
                }}
              >
                <span className="font-satoshi font-normal text-[#666] text-[12px] leading-none">Travellers & Class</span>
                <span className="font-satoshi font-bold text-[#1a1a1a] text-[18px] leading-normal font-sans">
                  {flightAdults + flightChildren + flightInfants} Traveller{flightAdults + flightChildren + flightInfants > 1 ? 's' : ''}, {flightCabinClass}
                </span>
                <span className="font-satoshi font-normal text-[#666] text-[10px] leading-none font-sans">
                  {flightAdults} Adult{flightAdults > 1 ? 's' : ''}{flightChildren > 0 ? `, ${flightChildren} Child` : ''} · {flightCabinClass}
                </span>
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              if (activeTab === 'hotels') {
                navigate(`/hotels?dest=${encodeURIComponent(hotelDest)}&checkin=${checkInDate}&checkout=${checkOutDate}&rooms=${rooms}&guests=${guests}`)
              } else if (activeTab === 'holiday') {
                console.log('Search clicked for holiday:', { holidayDest, holidayBudget, holidayStartDate, holidayEndDate, holidayTravelers })
                navigate(`/holidays?dest=${encodeURIComponent(holidayDest)}&budget=${encodeURIComponent(holidayBudget)}&start=${holidayStartDate}&end=${holidayEndDate}&travelers=${holidayTravelers}`)
              } else if (tripType === 'multi-city') {
                // Validate all legs have from + to
                const invalid = multiCityLegs.find(leg => !leg.from.code || !leg.to.code)
                if (invalid) {
                  alert('Please select departure and arrival city for all flights.')
                  return
                }
                const segments = multiCityLegs.map(leg => ({
                  from: leg.from.code,
                  to: leg.to.code,
                  departureDate: leg.date,
                  travelClass: flightCabinClass
                }))
                navigate(`/flights?tripType=multi-city&segments=${encodeURIComponent(JSON.stringify(segments))}&adults=${flightAdults}&children=${flightChildren}&cabinClass=${encodeURIComponent(flightCabinClass)}`)
              } else {
                const origin = fromLoc.code || 'DEL';
                const destination = toLoc.code || 'BOM';
                if (origin === destination) {
                  alert('Origin and destination airport cannot be the same.');
                  return;
                }
                navigate(`/flights?origin=${origin}&destination=${destination}&departureDate=${flightDepDate}&returnDate=${flightRetDate}&adults=${flightAdults}&children=${flightChildren}&cabinClass=${encodeURIComponent(flightCabinClass)}&tripType=${tripType}`);
              }
            }}
            className="flex-1 flex items-center justify-center gap-[10px] bg-[#e53935] hover:bg-red-700 text-white rounded-[16px] font-semibold border-none cursor-pointer h-full px-[20px] transition-colors shadow-sm"
          >
            <SearchIcon className="w-[20px] h-[20px] text-white" />
            <span className="font-sans font-semibold text-[16px] text-white leading-none">Search</span>
          </button>
        </div>

      </div>

      {/* Outer BookingCard Level Right Side Modals */}
      {showFromDropdown && (
        <AirportPickerModal
          title="Select Departure Airport"
          onSelect={setFromLoc}
          onClose={() => setShowFromDropdown(false)}
        />
      )}

      {showToDropdown && (
        <AirportPickerModal
          title="Select Destination Airport"
          onSelect={setToLoc}
          onClose={() => setShowToDropdown(false)}
        />
      )}

      {showFlightDepCalendar && (
        <CustomDatePicker
          title="Select Departure Date"
          origin={fromLoc?.code || 'DEL'}
          destination={toLoc?.code || 'BOM'}
          selectedDate={flightDepDate}
          onChange={(dateStr) => {
            setFlightDepDate(dateStr)
            const dep = new Date(dateStr)
            const ret = new Date(flightRetDate)
            if (!isNaN(dep.getTime()) && !isNaN(ret.getTime()) && ret <= dep) {
              const nextDate = new Date(dep)
              nextDate.setDate(dep.getDate() + 7)
              const y = nextDate.getFullYear()
              const m = String(nextDate.getMonth() + 1).padStart(2, '0')
              const d = String(nextDate.getDate()).padStart(2, '0')
              setFlightRetDate(`${y}-${m}-${d}`)
            }
          }}
          onClose={() => setShowFlightDepCalendar(false)}
        />
      )}

      {showFlightRetCalendar && tripType !== 'one-way' && (
        <CustomDatePicker
          title="Select Return Date"
          origin={toLoc?.code || 'BOM'}
          destination={fromLoc?.code || 'DEL'}
          selectedDate={flightRetDate}
          onChange={setFlightRetDate}
          onClose={() => setShowFlightRetCalendar(false)}
          minDate={flightDepDate}
        />
      )}

      {showFlightTravellersDropdown && (
        <TravellersClassModal
          adults={flightAdults}
          setAdults={setFlightAdults}
          children={flightChildren}
          setChildren={setFlightChildren}
          cabinClass={flightCabinClass}
          setCabinClass={setFlightCabinClass}
          onClose={() => setShowFlightTravellersDropdown(false)}
        />
      )}
    </div>
  )
}

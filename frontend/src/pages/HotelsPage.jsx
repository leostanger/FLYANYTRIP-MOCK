import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import TopBar from '../components/common/TopBar'
import Footer from '../components/common/Footer'
import BookingCard from '../components/flights/BookingCard'
import HotelBookingSection from '../components/hotels/HotelBookingSection'
import HotelRoomSelection from '../components/hotels/HotelRoomSelection'
import HotelPersonalize from '../components/hotels/HotelPersonalize'
import HotelPaymentStep from '../components/hotels/HotelPaymentStep'
import HotelPaymentOptions from '../components/hotels/HotelPaymentOptions'
import HotelConfirmationPage from '../components/hotels/HotelConfirmationPage'
import hotelImage1 from '../assets/hotels/City View from Room.jpg'
import hotelImage2 from '../assets/Hotel section/extracted_images/Hotel The Royal Krishna.jpg'
import hotelImage3 from '../assets/hotels/Hotel-Inspired Guest Space With White Bedding And Golden Touch.jpg'
import hotelImage4 from '../assets/hotels/India - Nahargarh Fort, in the Indian state of Rajasthan, stands on the edge of the Aravalli Hills and offers great views over the city of Jaipur_.jpg'
import hotelImage5 from '../assets/Hotel section/Udaipur’s Royal Legacy & Spirituality_ A Journey Through Time.jpg'
import {
  MapPin,
  Calendar,
  Search,
  Building,
  Star,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Map,
  Grid,
  ListFilter,
  Check,
  X,
  Compass,
  ArrowUpDown,
  Flame,
  Award,
  Sparkles,
  DollarSign,
  Coffee,
  Bookmark,
  ShieldCheck,
  CalendarDays,
  Wifi,
  Waves,
  Flower2,
  GlassWater,
  Palmtree,
  Dumbbell,
  Utensils,
  Tv
} from 'lucide-react'

// Figma Enriched Hotel Data
const HOTELS_DATA = [
  {
    id: 1,
    name: 'Radisson Blu Goa',
    location: 'Cavelossim · Goa',
    locality: 'Colva',
    rating: 4.8,
    stars: 5,
    reviews: '3,120',
    price: 9800,
    originalPrice: 14000,
    discount: 30,
    taxes: 1176,
    badge: 'Luxury',
    image: hotelImage1,
    amenities: ['Free WiFi', 'Swiming Pool', 'Spa', 'Beach', 'Bar'],
    description: 'A luxury beachfront retreat offering elegant rooms, premium amenities, and easy access to Cavelossim Beach. Perfect for family vacation...',
    popularity: 95,
    type: 'Resort'
  },
  {
    id: 2,
    name: 'Hilton Goa Resort',
    location: 'Cavelossim · Goa',
    locality: 'Colva',
    rating: 4.6,
    stars: 5,
    reviews: '3,120',
    price: 12600,
    originalPrice: 14000,
    discount: 10,
    taxes: 1176,
    badge: 'Luxury',
    image: hotelImage2,
    amenities: ['Free WiFi', 'Swiming Pool', 'Spa', 'Beach', 'Bar'],
    description: 'A luxury beachfront retreat offering elegant rooms, premium amenities, and easy access to Cavelossim Beach. Perfect for family vacations, romantic get...',
    popularity: 90,
    type: 'Resort'
  },
  {
    id: 3,
    name: 'The Park Calangute',
    location: 'Calangute · Goa',
    locality: 'Calangute',
    rating: 4.4,
    stars: 5,
    reviews: '650',
    price: 8075,
    originalPrice: 9500,
    discount: 15,
    taxes: 835,
    badge: 'Boutique',
    image: hotelImage3,
    amenities: ['Free WiFi', 'Swiming Pool', 'Gym', 'Garden', 'Restaurant'],
    description: 'Chic boutique hotel blending contemporary style with Goan charm, situated close to Calangute Beach. Ideal for solo travelers and couples.',
    popularity: 85,
    type: 'Hotel'
  },
  {
    id: 4,
    name: 'Casa De Goa',
    location: 'Anjuna · Goa',
    locality: 'Anjuna',
    rating: 4.2,
    stars: 5,
    reviews: '1,450',
    price: 2560,
    originalPrice: 3200,
    discount: 20,
    taxes: 256,
    badge: 'Budget',
    image: hotelImage4,
    amenities: ['Free WiFi', 'Bar', 'Terrace', 'Free Parking', 'Cafe'],
    description: 'Cozy budget stays featuring vibrant decor, great local vibes, and a central location near Anjuna Beach and the flea market.',
    popularity: 75,
    type: 'Hotel'
  },
  {
    id: 5,
    name: 'Green Leaf Eco Resort',
    location: 'Arpora · Goa',
    locality: 'Baga',
    rating: 4.5,
    stars: 5,
    reviews: '670',
    price: 7020,
    originalPrice: 7800,
    discount: 10,
    taxes: 702,
    badge: 'Eco-Friendly',
    image: hotelImage5,
    amenities: ['Free WiFi', 'Swiming Pool', 'Yoga', 'Garden', 'Organic Cafe'],
    description: 'Sustainable resort nestled in nature with organic dining, wellness activities, and a tranquil ambiance for mindful travelers.',
    popularity: 80,
    type: 'Resort'
  },
  {
    id: 6,
    name: 'Taj Palace Delhi',
    location: 'Chanakyapuri · New Delhi',
    locality: 'Delhi',
    rating: 4.9,
    stars: 5,
    reviews: '2,100',
    price: 15500,
    originalPrice: 22000,
    discount: 30,
    taxes: 1860,
    badge: 'Luxury',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80',
    amenities: ['Free WiFi', 'Swiming Pool', 'Spa', 'Fine Dining', 'Gym'],
    description: 'An iconic landmark in the heart of Delhi, offering peerless hospitality, ultra-luxury accommodation, and award-winning dining options.',
    popularity: 98,
    type: 'Hotel'
  }
]

export default function HotelsPage() {
  const [searchParams] = useSearchParams()

  // Search parameters state (parsed from query string or default values)
  const dest = searchParams.get('dest') ? decodeURIComponent(searchParams.get('dest')) : 'Goa, India'
  const checkin = searchParams.get('checkin') || '2026-12-20'
  const checkout = searchParams.get('checkout') || '2026-12-23'
  const rooms = parseInt(searchParams.get('rooms') || '1')
  const guests = parseInt(searchParams.get('guests') || '2')

  // Calculate nights
  const [nights, setNights] = useState(3)
  useEffect(() => {
    try {
      const d1 = new Date(checkin)
      const d2 = new Date(checkout)
      const diffTime = Math.abs(d2 - d1)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (!isNaN(diffDays)) setNights(diffDays || 1)
    } catch (e) {
      setNights(3)
    }
  }, [checkin, checkout])

  // Format dates for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return ''
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj.getTime())) return dateStr
    return dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }
  const formattedDates = `${formatDateDisplay(checkin)} – ${formatDateDisplay(checkout)}`

  // Interactive controls
  const [showModify, setShowModify] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [sortBy, setSortBy] = useState('popularity') // popularity, priceAsc, priceDesc, rating
  const [bookingConfirmed, setBookingConfirmed] = useState(null) // Holds hotel object if booked
  const [bookingHotel, setBookingHotel] = useState(null)
  const [bookingStep, setBookingStep] = useState('details') // 'details', 'room-selection', 'info', 'personalize', 'payment-options'
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [extraAddOns, setExtraAddOns] = useState([])

  // Scroll to top when transitioning between steps or opening a hotel
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [bookingStep, bookingHotel])

  // Accordion collapsibles for filters
  const [collapsed, setCollapsed] = useState({
    price: false,
    stars: false,
    amenities: false,
    property: false,
    locality: false
  })

  // Filter conditions state
  const [minPrice, setMinPrice] = useState(1000)
  const [maxPrice, setMaxPrice] = useState(20000)
  const [starRatings, setStarRatings] = useState([5]) // checked star ratings: default to 5-star
  const [amenitySearch, setAmenitySearch] = useState('')
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState(['Free WiFi']) // default to Free WiFi checked
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedLocalities, setSelectedLocalities] = useState([])

  // Toggle collapsibles
  const toggleCollapse = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Handle Favorites toggle
  const toggleFavorite = (hotelId) => {
    setFavorites(prev =>
      prev.includes(hotelId) ? prev.filter(id => id !== hotelId) : [...prev, hotelId]
    )
  }

  // Handle checkboxes
  const handleStarCheckbox = (starsVal) => {
    setStarRatings(prev =>
      prev.includes(starsVal) ? prev.filter(s => s !== starsVal) : [...prev, starsVal]
    )
  }

  const handleAmenityCheckbox = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleTypeCheckbox = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleLocalityCheckbox = (locality) => {
    setSelectedLocalities(prev =>
      prev.includes(locality) ? prev.filter(l => l !== locality) : [...prev, locality]
    )
  }

  // Reset all filters
  const handleResetFilters = () => {
    setMinPrice(1000)
    setMaxPrice(20000)

    setStarRatings([5])
    setSelectedAmenities(['Free WiFi'])
    setSelectedTypes([])
    setSelectedLocalities([])
    setAmenitySearch('')
  }

  // Filtering Logic
  const filteredHotels = HOTELS_DATA.filter(hotel => {
    // 1. Destination / Locality text filter
    const destLower = dest.toLowerCase()
    const matchesDest =
      hotel.name.toLowerCase().includes(destLower) ||
      hotel.location.toLowerCase().includes(destLower) ||
      hotel.locality.toLowerCase().includes(destLower) ||
      (destLower.includes('goa') && hotel.location.toLowerCase().includes('goa')) ||
      (destLower.includes('delhi') && hotel.location.toLowerCase().includes('delhi'))

    if (!matchesDest) return false

    // 2. Price filter
    if (hotel.price < minPrice || hotel.price > maxPrice) return false

    // 3. Star Rating filter
    if (starRatings.length > 0) {
      if (!starRatings.includes(hotel.stars)) return false
    }

    // 4. Amenities filter
    if (selectedAmenities.length > 0) {
      const hasAllSelected = selectedAmenities.every(amenity =>
        hotel.amenities.some(ha => ha.toLowerCase() === amenity.toLowerCase())
      )
      if (!hasAllSelected) return false
    }

    // 5. Property Type filter
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(hotel.type)) return false
    }

    // 6. Locality filter
    if (selectedLocalities.length > 0) {
      if (!selectedLocalities.includes(hotel.locality)) return false
    }

    return true
  }).sort((a, b) => {
    if (sortBy === 'popularity') {
      return b.popularity - a.popularity
    } else if (sortBy === 'priceAsc') {
      return a.price - b.price
    } else if (sortBy === 'priceDesc') {
      return b.price - a.price
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    return 0
  })

  // Predefined lists for checkboxes
  const ALL_AMENITIES = ['Free WiFi', 'Swiming Pool', 'Spa', 'Bar', 'Garden', 'Gym', 'Free Parking', 'Restaurant', 'Yoga', 'Terrace', 'Cafe']
  const filteredAmenitiesList = ALL_AMENITIES.filter(amenity =>
    amenity.toLowerCase().includes(amenitySearch.toLowerCase())
  )

  const LOCALITIES = [
    { value: 'Calangute', label: 'Calangute' },
    { value: 'Baga', label: 'Baga' },
    { value: 'Anjuna', label: 'Anjuna' },
    { value: 'Colva', label: 'Colva (Cavelossim)' }
  ]

  const PROPERTY_TYPES = ['Hotel', 'Resort', 'Hostel', 'Villa']

  const formatAmenityLabel = (label) => {
    if (label.toLowerCase() === 'free wifi') return 'WiFi';
    if (label.toLowerCase() === 'swiming pool') return 'Pool';
    return label;
  }

  const getAmenityIcon = (amenity) => {
    const name = amenity.toLowerCase();
    if (name.includes('wifi')) return <Wifi size={11} className="text-[#6B6B6B]" />;
    if (name.includes('pool') || name.includes('swiming')) return <Waves size={11} className="text-[#6B6B6B]" />;
    if (name.includes('spa')) return <Flower2 size={11} className="text-[#6B6B6B]" />;
    if (name.includes('bar')) return <GlassWater size={11} className="text-[#6B6B6B]" />;
    if (name.includes('beach')) return <Palmtree size={11} className="text-[#6B6B6B]" />;
    if (name.includes('gym')) return <Dumbbell size={11} className="text-[#6B6B6B]" />;
    if (name.includes('restaurant')) return <Utensils size={11} className="text-[#6B6B6B]" />;
    if (name.includes('tv')) return <Tv size={11} className="text-[#6B6B6B]" />;
    return <Sparkles size={11} className="text-[#6B6B6B]" />;
  }

  return (
    <div className="font-quicksand flex flex-col min-h-screen bg-[#F8F9FA]">
      <TopBar />
      <Navbar />

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 lg:px-8 py-6">
        {bookingHotel ? (
          bookingStep === 'payment-options' ? (
            <HotelPaymentOptions
              hotel={bookingHotel}
              bookingDetails={currentBookingDetails}
              addOns={extraAddOns}
              onBack={() => setBookingStep('personalize')}
              onConfirmBooking={(paymentDetails) => {
                setBookingConfirmed({
                  ...bookingHotel,
                  finalPrice: paymentDetails.finalPrice,
                  addOns: extraAddOns,
                  bookingDetails: currentBookingDetails,
                  coupon: paymentDetails.coupon,
                  paymentMethod: paymentDetails.paymentMethod
                })
                setBookingHotel(null)
                setBookingStep('details')
              }}
            />
          ) : bookingStep === 'personalize' ? (
            <HotelPersonalize
              hotel={bookingHotel}
              bookingDetails={currentBookingDetails}
              onBack={() => setBookingStep('info')}
              onContinue={(personalizationData) => {
                setExtraAddOns(personalizationData.selectedAddOns)
                setBookingStep('payment-options')
              }}
            />
          ) : bookingStep === 'info' ? (
            <HotelPaymentStep
              hotel={bookingHotel}
              bookingDetails={currentBookingDetails}
              addOns={extraAddOns}
              onBack={() => setBookingStep('room-selection')}
              onConfirmPayment={() => {
                setBookingStep('personalize')
              }}
            />
          ) : bookingStep === 'room-selection' ? (
            <HotelRoomSelection
              hotel={bookingHotel}
              bookingDetails={currentBookingDetails}
              onBack={() => setBookingStep('details')}
              onContinue={(roomData) => {
                setSelectedRoom(roomData.selectedRoom)
                setBookingStep('info')
              }}
            />
          ) : (
            <HotelBookingSection
              hotel={bookingHotel}
              searchDetails={{
                checkin,
                checkout,
                rooms,
                guests,
                nights
              }}
              onBack={() => setBookingHotel(null)}
              onConfirmBooking={(bookingData) => {
                setCurrentBookingDetails({
                  checkinDate: bookingData.checkinDate,
                  checkoutDate: bookingData.checkoutDate,
                  nightsCount: bookingData.nightsCount,
                  guestsCount: bookingData.guestsCount
                })
                setBookingStep('room-selection')
              }}
            />
          )
        ) : (
          <>

        {/* ── 1. SEARCH SUMMARY BAR ── */}
        <div className="bg-white border border-[#d0d0d0] rounded-[15px] p-[15.8px] flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.01)] gap-4 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-[15px] font-medium py-3 md:py-0">
            {/* Destination */}
            <div className="flex items-center gap-[5.625px]">
              <MapPin size={14} className="text-[#FE2C1C] flex-shrink-0" />
              <span className="font-['Quicksand'] font-bold text-[#1a1a1a] text-[18px] leading-none">{dest}</span>
            </div>

            <span className="hidden md:inline w-[1px] h-[15px] bg-[#d0d0d0]"></span>

            {/* Dates & Nights */}
            <div className="flex items-center">
              <span className="font-['Quicksand'] font-medium text-[#6b6b6b] text-[14px] leading-[18.75px]">{formattedDates} · {nights} night{nights > 1 ? 's' : ''}</span>
            </div>

            <span className="hidden md:inline w-[1px] h-[15px] bg-[#d0d0d0]"></span>

            {/* Rooms/Guests */}
            <div className="flex items-center">
              <span className="font-['Quicksand'] font-medium text-[#6b6b6b] text-[14px] leading-[18.75px]">{rooms} Room{rooms > 1 ? 's' : ''} · {guests} Guest{guests > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-[7.5px] h-[35.35px]">
            <button className="flex items-center gap-[7.5px] bg-[#f5f5f5] border border-[#d0d0d0] rounded-[9.375px] px-[12.05px] py-[8.3px] h-full text-[13.125px] font-['Quicksand'] font-medium text-[#6b6b6b] transition-all cursor-pointer">
              <MapPin size={13} className="text-[#6b6b6b]" />
              Map View
            </button>
            <button
              onClick={() => setShowModify(!showModify)}
              className={`flex items-center gap-[5.625px] border border-[#d0d0d0] rounded-[9.375px] px-[15.8px] py-[8.3px] h-full text-[13.125px] font-['Quicksand'] font-semibold text-[#f12a27] transition-all cursor-pointer ${
                showModify
                  ? 'bg-red-50 shadow-[0_2px_8px_rgba(254,44,28,0.1)]'
                  : 'bg-white'
              }`}
            >
              <Search size={12} className="text-[#f12a27]" />
              Modify
            </button>
          </div>
        </div>

        {/* Collapsible search card */}
        {showModify && (
          <div className="mt-4 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-fadeIn relative z-40 max-w-4xl mx-auto p-2">
            <BookingCard activeTab="hotels" setActiveTab={() => { }} />
            <button
              onClick={() => setShowModify(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors border-none cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {/* ── 2. FILTER & SORT ROW ── */}
        <div className="mt-6 flex gap-[18.75px] items-center">
          {showFilters && (
            <div className="w-[323.867px] flex-shrink-0 bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] px-[23.13px] flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] h-[64.773px] hidden lg:flex">
              <div className="flex items-center gap-[6px]">
                <SlidersHorizontal size={18} className="text-[#333]" />
                <span className="font-satoshi font-bold text-[18.507px] text-[#333]">Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[15.037px] font-semibold text-[#f12b19] hover:text-red-700 bg-transparent border-none cursor-pointer transition-colors"
              >
                Reset All
              </button>
            </div>
          )}

          <div
            className="flex-grow flex items-center justify-between flex-wrap gap-y-3 p-[12px]"
            style={{
              background: 'white',
              border: '0.8px solid #e2e2e2',
              borderRadius: '15px',
              minHeight: '57px',
            }}
          >
            {/* LEFT: Hide Filters pill + properties count */}
            <div className="flex items-center gap-[12px]">
              {/* Filter pill — inner rounded container with #D0D0D0 border */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-[7.5px] cursor-pointer transition-colors"
                style={{
                  background: 'white',
                  border: '1.0px solid #D0D0D0',
                  borderRadius: '9.375px',
                  padding: '7.5px 13.125px',
                  color: '#1A1A1A',
                  fontSize: '13.125px',
                  fontWeight: 600,
                  height: '35.35px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {/* Properties count */}
              <span className="text-[13.125px] font-['Quicksand'] font-medium text-[#6B6B6B]">
                {filteredHotels.length} propert{filteredHotels.length === 1 ? 'y' : 'ies'} found
              </span>
            </div>

            {/* RIGHT: Sort controls */}
            <div className="flex items-center gap-[7.5px]">
              <span className="text-[13.125px] font-['Quicksand'] font-medium text-[#6B6B6B]">Sort:</span>

              <button
                onClick={() => setSortBy('popularity')}
                className="cursor-pointer transition-all animate-none"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9.375px',
                  fontSize: '13.125px',
                  fontWeight: 600,
                  border: sortBy === 'popularity' ? '1px solid #1A1A1A' : '1px solid #D0D0D0',
                  background: sortBy === 'popularity' ? '#1A1A1A' : 'white',
                  color: sortBy === 'popularity' ? 'white' : '#6B6B6B',
                  height: '35.35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Popularity
              </button>

              <button
                onClick={() => setSortBy(sortBy === 'priceAsc' ? 'priceDesc' : 'priceAsc')}
                className="flex items-center gap-1 cursor-pointer transition-all"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9.375px',
                  fontSize: '13.125px',
                  fontWeight: 600,
                  border: (sortBy === 'priceAsc' || sortBy === 'priceDesc') ? '1px solid #1A1A1A' : '1px solid #D0D0D0',
                  background: (sortBy === 'priceAsc' || sortBy === 'priceDesc') ? '#1A1A1A' : 'white',
                  color: (sortBy === 'priceAsc' || sortBy === 'priceDesc') ? 'white' : '#6B6B6B',
                  height: '35.35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Price {sortBy === 'priceAsc' ? '↑' : sortBy === 'priceDesc' ? '↓' : ''}
              </button>

              <button
                onClick={() => setSortBy('rating')}
                className="cursor-pointer transition-all"
                style={{
                  padding: '8px 16px',
                  borderRadius: '9.375px',
                  fontSize: '13.125px',
                  fontWeight: 600,
                  border: sortBy === 'rating' ? '1px solid #1A1A1A' : '1px solid #D0D0D0',
                  background: sortBy === 'rating' ? '#1A1A1A' : 'white',
                  color: sortBy === 'rating' ? 'white' : '#6B6B6B',
                  height: '35.35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Rating
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. LAYOUT MAIN BODY ── */}
        <div className="mt-4 flex gap-6 items-start">

          {/* ── 2.A LEFT COLUMN: FILTERS SIDEBAR ── */}
          {showFilters && (
            <aside className="w-[323.867px] flex-shrink-0 bg-white border border-[#eaeaea] border-[1.157px] rounded-[13.88px] p-[23px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6 sticky top-[90px] max-h-[calc(100vh-120px)] overflow-y-auto hidden lg:block">

              {/* FILTER: Price Range — fully working interactive slider */}
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

                {/* Header with collapse */}
                <button
                  onClick={() => toggleCollapse('price')}
                  className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer mb-4"
                >
                  <span>Price Range</span>
                  {collapsed.price ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  )}
                </button>

                {!collapsed.price && (() => {
                  const PRICE_MIN = 1000;
                  const PRICE_MAX = 20000;
                  const minPct = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
                  const maxPct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
                  return (
                    <div className="px-1">
                      {/* Price labels */}
                      <div className="flex items-center justify-between mb-3 text-[14px] font-bold text-[#333]">
                        <span>₹{minPrice.toLocaleString('en-IN')}</span>
                        <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Dual-handle slider track */}
                      <div className="relative h-[20px] flex items-center mb-4">
                        {/* Background track */}
                        <div className="absolute inset-x-0 h-[4px] rounded-full bg-[#EAEAEA]" />
                        {/* Active range track */}
                        <div
                          className="absolute h-[4px] rounded-full bg-[#F12B19]"
                          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                        />
                        {/* Min thumb */}
                        <input
                          type="range"
                          min={PRICE_MIN}
                          max={PRICE_MAX}
                          step={500}
                          value={minPrice}
                          onChange={(e) => {
                            const val = Math.min(parseInt(e.target.value), maxPrice - 500);
                            setMinPrice(val);
                          }}
                          className="absolute inset-x-0 w-full h-full appearance-none bg-transparent price-thumb"
                          style={{ zIndex: minPrice > PRICE_MAX - 2000 ? 20 : 10 }}
                        />
                        {/* Max thumb */}
                        <input
                          type="range"
                          min={PRICE_MIN}
                          max={PRICE_MAX}
                          step={500}
                          value={maxPrice}
                          onChange={(e) => {
                            const val = Math.max(parseInt(e.target.value), minPrice + 500);
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
              {/* FILTER: Star Rating — matches Figma Stops.svg design */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleCollapse('stars')}
                  className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
                >
                  <span>Star Rating</span>
                  {collapsed.stars ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  )}
                </button>
                {!collapsed.stars && (
                  <div className="space-y-4 pt-2">
                    {[5, 4, 3, 2].map((starsVal) => (
                      <label
                        key={starsVal}
                        className="flex items-center gap-3 cursor-pointer select-none group"
                        style={{ minHeight: '22px' }}
                      >
                        <input
                          type="checkbox"
                          checked={starRatings.includes(starsVal)}
                          onChange={() => handleStarCheckbox(starsVal)}
                          className="hidden"
                        />
                        {/* Rounded-rect checkbox — exact Figma style */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: starRatings.includes(starsVal) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                            background: starRatings.includes(starsVal) ? '#F12B19' : 'white',
                            boxShadow: starRatings.includes(starsVal) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                          }}
                        >
                          {starRatings.includes(starsVal) && (
                            <Check size={14} strokeWidth={3} color="white" />
                          )}
                        </div>
                        {/* Stars and text */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-[3px]">
                            {[...Array(starsVal)].map((_, idx) => (
                              <svg
                                key={idx}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="#6B6B6B"
                                stroke="none"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-[13px] text-[#6B6B6B] font-normal">& above</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* FILTER: Amenities — matches Figma Airlines.svg design */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleCollapse('amenities')}
                  className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
                >
                  <span>Amenities</span>
                  {collapsed.amenities ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  )}
                </button>
                {!collapsed.amenities && (
                  <div className="space-y-0 pt-1">
                    {/* Search box — Figma Airlines.svg grey card style */}
                    <div
                      className="flex items-center gap-2 mb-3"
                      style={{
                        background: '#F8F9FA',
                        border: '1.16px solid #EAEAEA',
                        borderRadius: '6.36px',
                        padding: '10px 12px',
                      }}
                    >
                      {/* Grey search icon matching SVG #999999 */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search Amenities"
                        value={amenitySearch}
                        onChange={(e) => setAmenitySearch(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-800 placeholder-gray-400"
                      />
                    </div>

                    {/* Checkbox list — show 5 by default, expand on View All */}
                    <div className="space-y-0">
                      {(showAllAmenities ? filteredAmenitiesList : filteredAmenitiesList.slice(0, 5)).map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-3 cursor-pointer select-none group"
                          style={{
                            padding: '9px 0',
                            borderBottom: '1px solid #F5F5F5',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityCheckbox(amenity)}
                            className="hidden"
                          />
                          {/* Rounded-rect checkbox — Figma Airlines.svg rx=4.04 style */}
                          <div
                            className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              border: selectedAmenities.includes(amenity) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                              background: selectedAmenities.includes(amenity) ? '#F12B19' : 'white',
                              boxShadow: selectedAmenities.includes(amenity) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                            }}
                          >
                            {selectedAmenities.includes(amenity) && (
                              <Check size={11} strokeWidth={3} color="white" />
                            )}
                          </div>
                          <span className="text-[13px] text-[#333333] font-normal leading-tight">{amenity}</span>
                        </label>
                      ))}
                      {filteredAmenitiesList.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-3">No matching amenities</div>
                      )}
                    </div>

                    {/* View All / View Less toggle */}
                    {filteredAmenitiesList.length > 5 && (
                      <button
                        onClick={() => setShowAllAmenities(prev => !prev)}
                        className="flex items-center gap-1 mt-1 border-none bg-transparent cursor-pointer p-0"
                        style={{ color: '#F12B19', fontSize: '13px', fontWeight: 600 }}
                      >
                        {showAllAmenities ? 'View Less' : 'View All'}
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="#F12B19" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          style={{ transform: showAllAmenities ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* FILTER: Property Type — Figma Airlines.svg style */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleCollapse('property')}
                  className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
                >
                  <span>Property Type</span>
                  {collapsed.property ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  )}
                </button>
                {!collapsed.property && (
                  <div className="space-y-0 pt-1">
                    {PROPERTY_TYPES.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-3 cursor-pointer select-none group"
                        style={{ padding: '9px 0', borderBottom: '1px solid #F5F5F5' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeCheckbox(type)}
                          className="hidden"
                        />
                        <div
                          className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: selectedTypes.includes(type) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                            background: selectedTypes.includes(type) ? '#F12B19' : 'white',
                            boxShadow: selectedTypes.includes(type) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                          }}
                        >
                          {selectedTypes.includes(type) && (
                            <Check size={11} strokeWidth={3} color="white" />
                          )}
                        </div>
                        <span className="text-[13px] text-[#333333] font-normal">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              {/* FILTER: Area / Locality — matches Figma Area.svg */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleCollapse('locality')}
                  className="w-full flex items-center justify-between font-satoshi font-bold text-[17.35px] text-[#333] border-none bg-transparent text-left cursor-pointer"
                >
                  <span>Area / Locality</span>
                  {collapsed.locality ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                  )}
                </button>
                {!collapsed.locality && (
                  <div className="space-y-0 pt-1">
                    {LOCALITIES.map((loc) => (
                      <label
                        key={loc.value}
                        className="flex items-center gap-3 cursor-pointer select-none group"
                        style={{ padding: '9px 0', borderBottom: '1px solid #F5F5F5' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocalities.includes(loc.value)}
                          onChange={() => handleLocalityCheckbox(loc.value)}
                          className="hidden"
                        />
                        {/* Rounded-rect checkbox — Figma Area.svg rx=4.04833 style */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center transition-all duration-150"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: selectedLocalities.includes(loc.value) ? '1.16px solid #F12B19' : '1.16px solid #CCCCCC',
                            background: selectedLocalities.includes(loc.value) ? '#F12B19' : 'white',
                            boxShadow: selectedLocalities.includes(loc.value) ? '0 1px 3px rgba(241,43,25,0.25)' : 'none',
                          }}
                        >
                          {selectedLocalities.includes(loc.value) && (
                            <Check size={11} strokeWidth={3} color="white" />
                          )}
                        </div>
                        <span className="text-[13px] text-[#333333] font-normal">{loc.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* ── 2.B RIGHT COLUMN: SEARCH RESULTS LIST ── */}
          {/* ── 2.B RIGHT COLUMN: SEARCH RESULTS LIST ── */}
          <section className="flex-1 flex flex-col gap-5">

            {/* List of cards */}
            <div className="space-y-5">
              {filteredHotels.map((hotel) => {
                const isFavorite = favorites.includes(hotel.id)
                return (
                  <div
                    key={hotel.id}
                    className="bg-white border border-[#e2e2e2] border-[0.8px] rounded-[15px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.06)] flex flex-col md:flex-row h-auto md:h-[218px] transition-all duration-300 group hover:translate-y-[-1px] relative"
                  >
                    {/* Left: Image block */}
                    <div className="w-full md:w-[406px] h-52 md:h-full relative overflow-hidden flex-shrink-0">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />

                      <div className="absolute bg-[#1a1a1a] h-[18.738px] left-[14.35px] rounded-full top-[15.71px] flex items-center justify-center px-[7.5px]" data-name="Badge">
                        <span className="font-['Quicksand'] font-bold text-[11.25px] text-white leading-none">
                          {hotel.badge}
                        </span>
                      </div>

                      {/* Favorite button — matches Container3.svg (size 26.25px, border #d0d0d0) */}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavorite(hotel.id) }}
                        className="absolute top-[11.71px] right-[11.71px] w-[26.25px] h-[26.25px] rounded-full bg-white border border-[#d0d0d0] flex items-center justify-center hover:bg-white text-gray-600 transition-all active:scale-90 cursor-pointer"
                      >
                        <Heart
                          size={12}
                          className={`transition-colors duration-200 ${isFavorite ? 'fill-[#FE2C1C] text-[#FE2C1C] stroke-[#FE2C1C]' : 'fill-none text-[#6B6B6B]'}`}
                        />
                      </button>
                    </div>

                    {/* Middle: Details block */}
                    <div className="flex-grow p-[20px] flex flex-col justify-between overflow-hidden">
                      <div className="flex-grow flex flex-col justify-start">
                        <div className="flex items-start justify-between">
                          <h4 className="text-[17.35px] font-satoshi font-bold text-[#1a1a1a] leading-snug tracking-tight hover:text-[#FE2C1C] transition-colors cursor-pointer">
                            {hotel.name}
                          </h4>
                        </div>

                        {/* Location details — matches Figma (pin & text in grey #6b6b6b) */}
                        <div className="flex items-center text-[13.125px] font-['Quicksand'] font-medium text-[#6b6b6b] mt-0.5 mb-1.5">
                          <MapPin size={12} className="text-[#6b6b6b] mr-1 flex-shrink-0" />
                          <span>{hotel.location}</span>
                        </div>

                        {/* Stars — matches Figma red stars and grey reviews */}
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={`${i < hotel.stars ? 'text-[#E53935] fill-[#E53935]' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[11.25px] font-bold text-[#949494]">
                            ({hotel.reviews} reviews)
                          </span>
                        </div>

                        {/* Amenities pills */}
                        <div className="flex flex-wrap gap-[5px] mb-2.5">
                          {hotel.amenities.map(amenity => (
                            <span
                              key={amenity}
                              className="text-[11.25px] font-['Quicksand'] font-semibold text-[#6b6b6b] bg-transparent border border-[#d0d0d0] border-[0.8px] rounded-full px-[8.3px] py-[2.675px] h-[21px] flex items-center gap-1"
                            >
                              {getAmenityIcon(amenity)}
                              {formatAmenityLabel(amenity)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[14px] text-[#6b6b6b] leading-[1.5] font-['Quicksand'] font-medium line-clamp-2">
                        {hotel.description}
                      </p>
                    </div>

                    {/* Right: Pricing and Action CTA */}
                    <div className="w-full md:w-[244.137px] p-[20px] border-t md:border-t-0 md:border-l border-[#e2e2e2] flex flex-col justify-center gap-[20px] bg-white flex-shrink-0">
                      <div className="flex flex-col text-center">
                        {/* Line 1: Original Price & Discount Badge */}
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-[11.25px] font-['JetBrains_Mono'] font-medium text-[#6b6b6b] line-through leading-[15px]">
                            ₹{hotel.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold text-[#2E7D32] bg-[#EAFAF1] px-2 py-0.5 rounded-[5px]">
                            {hotel.discount}% off
                          </span>
                        </div>

                        {/* Line 2: Current Price & Taxes/Night on the same line */}
                        <div className="flex items-baseline justify-center gap-1.5 whitespace-nowrap">
                          <span className="text-[24px] font-['JetBrains_Mono'] font-bold text-[#1a1a1a] leading-[26.25px] tracking-tight">
                            ₹{hotel.price.toLocaleString()}
                          </span>
                          <div className="flex gap-1 text-[#6b6b6b] text-[11.25px] font-['Quicksand'] font-medium leading-[15px]">
                            <span>/night</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-[6px] w-[204px] md:w-full mx-auto">
                        <button
                          onClick={() => setBookingHotel(hotel)}
                          className="w-full flex items-center justify-center text-white transition-all border-none cursor-pointer active:scale-[0.98] hover:opacity-95"
                          style={{
                            background: '#e53935',
                            padding: '8px 37px',
                            borderRadius: '13.375px',
                            fontSize: '13.125px',
                            fontWeight: 700,
                            fontFamily: 'Quicksand',
                            height: '35px',
                          }}
                        >
                          Book Now
                        </button>
                        <button
                          className="w-full flex items-center justify-center bg-white hover:bg-gray-50 border border-[#d0d0d0] border-[0.8px] text-[#6b6b6b] transition-colors cursor-pointer active:scale-[0.98]"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '13.375px',
                            fontSize: '11.25px',
                            fontWeight: 600,
                            fontFamily: 'Quicksand',
                            height: '31px',
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* No results placeholder */}
              {filteredHotels.length === 0 && (
                <div className="bg-white border border-[#D0D0D0] rounded-[15px] p-12 text-center shadow-sm flex flex-col items-center justify-center gap-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#FE2C1C] mb-2">
                    <Compass size={32} className="animate-spin-slow" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">No properties found</h4>
                  <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                    We couldn't find any hotels matching your current filter criteria. Try updating your max price or clearing some filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-[#FE2C1C] hover:bg-red-650 text-white rounded-xl px-5 py-2.5 text-xs font-bold transition-colors border-none cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
          </>
        )}
      </main>

      <Footer />

      {bookingConfirmed && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#f5f5f5] animate-in fade-in duration-300">
          <HotelConfirmationPage booking={bookingConfirmed} onClose={() => setBookingConfirmed(null)} />
        </div>
      )}
    </div>
  )
}


import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Info } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoImage from '../../assets/icons/Group 7412.svg'

import iconFlights from '../../assets/icons/Vector-2.svg'
import iconHotels from '../../assets/icons/Vector-1.svg'
import iconTourPackages from '../../assets/icons/Icon-1.svg'
import iconHolidays from '../../assets/icons/Holiday.png'
import iconMyBookings from '../../assets/icons/Icon-2.svg'
import iconSupport from '../../assets/icons/Icon.svg'
import iconChevronDown from '../../assets/icons/Icon-3.svg'
import iconUser from '../../assets/icons/Vector.svg'

const MAIN_LINKS = [
  { path: '/flights', label: 'Flights', icon: iconFlights, iconClass: 'w-[20px] h-[20px] object-contain' },
  { path: '/hotels', label: 'Hotels', icon: iconHotels, iconClass: 'w-[18px] h-[18px] object-contain' },
  { path: '/tour-packages', label: 'Tour Packages', icon: iconTourPackages, hasDropdown: true, iconClass: 'w-[16px] h-[16px] object-contain' },
  { path: '/holidays', label: 'Holidays', icon: iconHolidays, hasDropdown: true, iconClass: 'w-[22px] h-[22px] object-contain', iconStyle: { mixBlendMode: 'multiply' } },
]

const SECONDARY_LINKS = [
  { path: '/about', label: 'About Us', isLucide: true, icon: Info, iconClass: 'w-[18px] h-[18px]' },
  { path: '/my-bookings', label: 'My Bookings', icon: iconMyBookings, iconClass: 'w-[18px] h-[18px] object-contain' },
  { path: '/support', label: 'Support', icon: iconSupport, iconClass: 'w-[18px] h-[18px] object-contain' },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, openAuthModal, logout } = useAuth()

  useEffect(() => {
    if (location.pathname === '/flights' && location.search) {
      sessionStorage.setItem('lastFlightSearchUrl', location.pathname + location.search)
    } else if (location.pathname === '/hotels' && location.search) {
      sessionStorage.setItem('lastHotelSearchUrl', location.pathname + location.search)
    } else if (location.pathname === '/holidays' && location.search) {
      sessionStorage.setItem('lastHolidaySearchUrl', location.pathname + location.search)
    }
  }, [location])

  const getNavLinkUrl = (path, label) => {
    if (label === 'Flights') {
      const saved = sessionStorage.getItem('lastFlightSearchUrl')
      return saved ? saved : '/?tab=flights'
    }
    if (label === 'Hotels') {
      const saved = sessionStorage.getItem('lastHotelSearchUrl')
      return saved ? saved : '/?tab=hotels'
    }
    if (label === 'Holidays') {
      const saved = sessionStorage.getItem('lastHolidaySearchUrl')
      return saved ? saved : '/?tab=holiday'
    }
    return path
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 xl:px-8 flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center no-underline shrink-0">
            <img src={logoImage} alt="FlyAnyTrip Logo" className="h-9 xl:h-10 object-contain" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 lg:gap-1 h-full">
            {MAIN_LINKS.map(({ path, label, icon, hasDropdown, iconClass, iconStyle }) => {
              const queryParams = new URLSearchParams(location.search)
              const activeTabQuery = queryParams.get('tab')
              
              let isActive = false
              if (location.pathname === '/') {
                if (label === 'Flights' && activeTabQuery === 'flights') isActive = true
                if (label === 'Hotels' && activeTabQuery === 'hotels') isActive = true
                if (label === 'Holidays' && activeTabQuery === 'holiday') isActive = true
              } else {
                if (label === 'Flights' && (location.pathname === '/flights' || location.pathname.startsWith('/flights/'))) isActive = true
                if (label === 'Hotels' && location.pathname.startsWith('/hotels')) isActive = true
                if (label === 'Holidays' && location.pathname.startsWith('/holidays')) isActive = true
                if (label === 'Tour Packages' && location.pathname.startsWith('/tour-packages')) isActive = true
              }

              return (
                <Link
                  key={path}
                  to={getNavLinkUrl(path, label)}
                  state={{ scrollToSearch: true }}
                  className={`text-[13px] lg:text-[14px] xl:text-[15px] font-satoshi font-medium transition-all no-underline flex items-center gap-[4px] px-[6px] lg:px-[8px] xl:px-[12px] h-full relative whitespace-nowrap shrink-0 nav-link ${isActive
                      ? 'text-[#ef3535]'
                      : 'text-[#3c3c3c] hover:text-[#ef3535]'
                    }`}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`${iconClass || "w-[18px] h-[18px] object-contain"} shrink-0 nav-icon`}
                    style={iconStyle || {}}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                  {hasDropdown && (
                    <img
                      src={iconChevronDown}
                      alt="dropdown"
                      className={`w-3.5 h-3.5 ml-0.5 opacity-60 nav-icon shrink-0`}
                    />
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-[8px] right-[8px] xl:left-[12px] xl:right-[12px] bg-[#ef3535] h-[4px] rounded-t-[4px]" />
                  )}
                </Link>
              );
            })}

            <div className="h-[18px] w-px bg-gray-300 mx-1.5 lg:mx-2 xl:mx-3 shrink-0"></div>

            {SECONDARY_LINKS.map(({ path, label, icon, isLucide, iconClass }) => {
              const isActive = location.pathname === path;
              const IconComp = isLucide ? icon : null;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`text-[13px] lg:text-[14px] xl:text-[15px] font-satoshi font-medium transition-all no-underline flex items-center gap-[4px] px-[6px] lg:px-[8px] xl:px-[12px] h-full relative whitespace-nowrap shrink-0 nav-link ${isActive
                      ? 'text-[#ef3535]'
                      : 'text-[#3c3c3c] hover:text-[#ef3535]'
                    }`}
                >
                  {isLucide ? (
                    <IconComp className={`${iconClass || "w-[18px] h-[18px]"} shrink-0 ${isActive ? 'text-[#ef3535]' : 'text-[#3c3c3c]'}`} />
                  ) : (
                    <img
                      src={icon}
                      alt={label}
                      className={`${iconClass || "w-[18px] h-[18px] object-contain"} shrink-0 nav-icon ${isActive ? 'nav-icon-active' : ''}`}
                    />
                  )}
                  <span className="whitespace-nowrap">{label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-[8px] right-[8px] xl:left-[12px] xl:right-[12px] bg-[#ef3535] h-[4px] rounded-t-[4px]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-2.5 xl:gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-[13px] lg:text-[14px] xl:text-[15px] font-satoshi font-bold text-gray-800 whitespace-nowrap">
                  Hi, {user.name || 'Traveler'}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-gray-500 hover:text-[#ef3535] px-3 py-1.5 border border-gray-200 rounded-lg transition-colors cursor-pointer bg-white whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-[#ef3535] text-white px-[12px] lg:px-[16px] xl:px-[22px] py-[8px] lg:py-[10px] rounded-[10px] text-[13px] lg:text-[14px] xl:text-[16px] font-satoshi font-semibold hover:bg-red-600 transition-colors no-underline leading-none flex items-center justify-center h-[38px] lg:h-[42px] xl:h-[46px] cursor-pointer border-none whitespace-nowrap"
                >
                  Sign Up Free
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-[#3c3c3c] text-[13px] lg:text-[14px] xl:text-[16px] font-satoshi font-medium px-[12px] lg:px-[16px] xl:px-[22px] py-[8px] lg:py-[10px] border border-gray-300 rounded-[10px] flex items-center gap-1.5 lg:gap-2 hover:bg-gray-50 transition-colors no-underline leading-none h-[38px] lg:h-[42px] xl:h-[46px] cursor-pointer bg-white whitespace-nowrap"
                >
                  <img src={iconUser} alt="User" className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] object-contain opacity-80 shrink-0" />
                  <span className="whitespace-nowrap">Login</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gray-800 transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-800 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-800 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
            {[...MAIN_LINKS, ...SECONDARY_LINKS].map(({ path, label, icon, isLucide, iconClass }) => {
              const IconComp = isLucide ? icon : null;
              return (
                <Link
                  key={path}
                  to={getNavLinkUrl(path, label)}
                  state={{ scrollToSearch: true }}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium no-underline flex items-center gap-2.5 text-gray-600 hover:text-[#ef3535] whitespace-nowrap`}
                >
                  {isLucide ? (
                    <IconComp className="w-[18px] h-[18px] shrink-0 text-gray-600" />
                  ) : (
                    <img src={icon} alt={label} className="w-[18px] h-[18px] object-contain shrink-0" />
                  )}
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-gray-100 flex gap-3">
              {user ? (
                <div className="flex-1 flex justify-between items-center py-2">
                  <span className="text-sm font-bold text-gray-800">Hi, {user.name}</span>
                  <button onClick={logout} className="text-xs text-red-500 font-semibold border-none bg-transparent cursor-pointer">Logout</button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); openAuthModal('signup'); }}
                    className="flex-1 bg-[#ef3535] text-white text-center px-4 py-2.5 rounded-md text-sm font-semibold border-none cursor-pointer whitespace-nowrap"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); openAuthModal('login'); }}
                    className="flex-1 text-center text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium border border-gray-300 bg-white cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <img src={iconUser} alt="User" className="w-[18px] h-[18px] object-contain opacity-70 shrink-0" />
                    <span>Login</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

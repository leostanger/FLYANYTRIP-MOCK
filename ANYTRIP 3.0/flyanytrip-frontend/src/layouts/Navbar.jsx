/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Sticky top navigation bar. On the home page, the search tab buttons
 * are hidden while the search card is in view, then smoothly slide in
 * once the user scrolls past it. On all other pages, tabs are always shown.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, UserCircle2, Plane, Building2, Compass, FileText, Mail, Phone, ArrowRight, X, ShieldCheck, CheckCircle2, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSearchContext } from '../context/SearchContext';

// All tab identifiers used across the app
const TABS = [
  { id: 'flights', label: 'Flights', icon: Plane },
  { id: 'hotels', label: 'Hotels', icon: Building2 },
  { id: 'tours', label: 'Packages', icon: Compass },
  { id: 'visa', label: 'Visa', icon: FileText }
];

/**
 * Unified Auth Modal for both Personal (B2C) and Business (B2B) accounts.
 */
const AuthModal = ({ isOpen, onClose, type = 'personal' }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState('signup'); // 'login' or 'signup'
  
  if (!isOpen) return null;
  const isBusiness = type === 'business';

  const handleContinue = async () => {
    if (!inputValue.trim()) {
      setError('Please enter your details');
      return;
    }
    if (authMode === 'login' && !password.trim()) {
      setError('Please enter your password');
      return;
    }
    setError('');
    
    const isEmail = inputValue.includes('@');
    
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inputValue)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      const mobileRegex = /^[0-9]{10}$/;
      const cleanInput = inputValue.replace(/\D/g, '');
      if (!mobileRegex.test(cleanInput)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate a brief loading animation for better UX/trust building
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Categorize input based on whether it looks like an email
    const loginData = isBusiness 
      ? { 
          email: isEmail ? inputValue : '', 
          agentId: !isEmail ? inputValue : '', 
          type: 'business',
          name: isEmail ? inputValue.split('@')[0] : 'Agent User'
        }
      : { 
          email: isEmail ? inputValue : '', 
          mobile: !isEmail ? inputValue : '', 
          type: 'personal',
          name: isEmail ? inputValue.split('@')[0] : 'Guest User'
        };
      
    login(loginData);
    setIsLoading(false);
    onClose();
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-[1100] overflow-y-auto no-scrollbar">
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Animated Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-black/40 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-[40px] shadow-[0_20px_80px_-10px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden z-10"
        >
          {/* Animated Background Gradients inside modal for premium feel */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className={`absolute -top-[20%] -right-[20%] w-[70%] h-[70%] rounded-full blur-3xl ${isBusiness ? 'bg-amber-400' : 'bg-brand-red'}`}
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.05, 0.1, 0.05],
                rotate: [0, -90, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className={`absolute -bottom-[20%] -left-[20%] w-[70%] h-[70%] rounded-full blur-3xl ${isBusiness ? 'bg-amber-600' : 'bg-rose-500'}`}
            />
          </div>

          {/* Close Button */}
          <div className="absolute top-6 right-6 z-20">
            <button onClick={onClose} className="p-2 bg-white/50 backdrop-blur-sm hover:bg-black/5 rounded-full transition-all duration-300 group">
              <X size={20} className="text-brand-black/50 group-hover:text-brand-black group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          <div className="relative p-10 pt-12 z-10">
            {/* Header */}
            <div className="mb-10 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                className={`w-24 h-24 ${isBusiness ? 'bg-gradient-to-tr from-amber-500/20 to-amber-300/10 text-amber-500 shadow-amber-500/20' : 'bg-gradient-to-tr from-brand-red/20 to-rose-400/10 text-brand-red shadow-brand-red/20'} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl relative overflow-hidden`}
              >
                {/* Shine effect */}
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
                {isBusiness ? <ShieldCheck size={48} strokeWidth={1.5} /> : <UserCircle2 size={48} strokeWidth={1.5} />}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                {isBusiness ? (
                  <h2 className="text-3xl font-black text-brand-black mb-2 tracking-tight">Agent Portal</h2>
                ) : (
                  <div className="flex bg-black/5 p-1 rounded-2xl w-full max-w-[240px] mx-auto mt-2">
                    <button onClick={() => { setAuthMode('login'); setError(''); }} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'login' ? 'bg-white shadow-md text-brand-red' : 'text-brand-black/40 hover:text-brand-black'}`}>Login</button>
                    <button onClick={() => { setAuthMode('signup'); setError(''); }} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${authMode === 'signup' ? 'bg-white shadow-md text-brand-red' : 'text-brand-black/40 hover:text-brand-black'}`}>Sign Up</button>
                  </div>
                )}
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-brand-black/50 font-bold uppercase text-[11px] tracking-widest"
              >
                {isBusiness ? 'Exclusive B2B Access' : (authMode === 'login' ? 'Sign in to continue' : 'Create a new account')}
              </motion.p>
            </div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="relative group">
                <label className={`text-[11px] font-black uppercase tracking-widest mb-2 block ml-1 transition-colors duration-300 ${isFocused ? (isBusiness ? 'text-amber-600' : 'text-brand-red') : 'text-brand-black/40'}`}>
                  {isBusiness ? 'Agent ID or Registered Email' : 'Mobile Number or Email ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setError(''); }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your details"
                    className={`w-full h-16 bg-black/[0.03] border-2 focus:bg-white rounded-2xl px-6 outline-none transition-all duration-300 font-bold text-brand-black placeholder:text-brand-black/20 ${
                      isFocused 
                        ? (isBusiness ? 'border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.1)]' : 'border-brand-red shadow-[0_0_0_4px_rgba(230,30,42,0.1)]') 
                        : 'border-transparent hover:border-black/10'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <motion.div 
                      animate={{ 
                        backgroundColor: isFocused ? (isBusiness ? 'rgba(245,158,11,0.1)' : 'rgba(230,30,42,0.1)') : 'rgba(0,0,0,0.05)',
                        color: isFocused ? (isBusiness ? 'rgb(245,158,11)' : 'rgb(230,30,42)') : 'rgba(0,0,0,0.2)'
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                      <Mail size={16} />
                    </motion.div>
                    {isBusiness ? (
                      <motion.div 
                        animate={{ 
                          backgroundColor: isFocused ? 'rgba(245,158,11,0.1)' : 'rgba(0,0,0,0.05)',
                          color: isFocused ? 'rgb(245,158,11)' : 'rgba(0,0,0,0.2)'
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <ShieldCheck size={16} />
                      </motion.div>
                    ) : (
                      <motion.div 
                        animate={{ 
                          backgroundColor: isFocused ? 'rgba(230,30,42,0.1)' : 'rgba(0,0,0,0.05)',
                          color: isFocused ? 'rgb(230,30,42)' : 'rgba(0,0,0,0.2)'
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                      >
                        <Phone size={16} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {authMode === 'login' && (
                <div className="relative group">
                  <label className={`text-[11px] font-black uppercase tracking-widest mb-2 block ml-1 transition-colors duration-300 ${isPasswordFocused ? (isBusiness ? 'text-amber-600' : 'text-brand-red') : 'text-brand-black/40'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      placeholder="Enter your password"
                      className={`w-full h-16 bg-black/[0.03] border-2 focus:bg-white rounded-2xl px-6 outline-none transition-all duration-300 font-bold text-brand-black placeholder:text-brand-black/20 ${
                        isPasswordFocused 
                          ? (isBusiness ? 'border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.1)]' : 'border-brand-red shadow-[0_0_0_4px_rgba(230,30,42,0.1)]') 
                          : 'border-transparent hover:border-black/10'
                      }`}
                    />
                  </div>
                </div>
              )}

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="text-brand-red text-[11px] font-bold ml-1"
                >
                  {error}
                </motion.p>
              )}

              <motion.button 
                onClick={handleContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={`w-full h-16 ${isBusiness ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-brand-black hover:bg-brand-red shadow-black/20'} text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden`}
              >
                {/* Shine effect on button */}
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    Continue
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-6"
              >
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/5"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-[10px] font-black uppercase tracking-widest text-brand-black/30 flex items-center gap-2">
                      <ShieldCheck size={14} className={isBusiness ? 'text-amber-500' : 'text-brand-red'} />
                      {isBusiness ? 'Bank-Grade Security' : 'Secure & Encrypted'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-green-500" />
                    Verified Profiles
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-green-500" />
                    {isBusiness ? 'Priority Support' : 'Instant Booking'}
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/**
 * The main navigation bar component.
 * Shows the logo, optional search tabs, and action buttons (bookings, account).
 * Uses IntersectionObserver to detect when the hero search card scrolls out of view.
 *
 * @param activeTab    - The currently selected search tab ID
 * @param setActiveTab - Function to change the active tab
 */
const Navbar = ({ activeTab, setActiveTab }) => {
  // Controls whether the tab row is shown inside the navbar
  const { user, logout } = useAuth();
  const { isFarePopupOpen } = useSearchContext();
  const navigate = useNavigate();
  const [showNavTabs, setShowNavTabs] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isB2CModalOpen, setIsB2CModalOpen] = useState(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Hide navbar when scrolling down past 80px, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // On results page always show nav tabs
    if (!isHome) {
      setShowNavTabs(true);
      return;
    }

    // On home page, watch the search-card tabs sentinel element
    const sentinel = document.getElementById('search-tabs');
    if (!sentinel) {
      setShowNavTabs(false);
      return;
    }

    // IntersectionObserver watches if the sentinel is visible on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is NOT intersecting → it has scrolled out of view → show nav tabs
        setShowNavTabs(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-64px 0px 0px 0px',
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  return (
    <>
      <nav className={`${isHome ? `sticky transition-all duration-300 ${isVisible ? 'top-0' : '-top-[80px]'}` : `sticky transition-all duration-500 ${isVisible && !isFarePopupOpen ? 'top-0' : '-top-[100px] opacity-0 pointer-events-none'}`} z-[1100] h-[80px] bg-white/70 backdrop-blur-2xl border-b border-black/5`}>
        <div className="max-w-[1400px] w-full mx-auto px-8 grid grid-cols-3 h-full items-center">

          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link to="/" className="group flex items-center">
              <div className="relative">
                <img src="/logos/logo.png" alt="FlyAnyTrip" className="h-11 w-auto cursor-pointer relative z-10" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/160x40/f8f9fa/a8a29e?text=FlyAnyTrip'; }} />
                <div className="absolute -inset-3 bg-brand-red/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>
          </div>

          {/* Center: Nav Tabs */}
          <div className="flex justify-center items-stretch h-full">
            <AnimatePresence>
              {showNavTabs && (
                <motion.div
                  className="flex gap-10 h-full"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      className={`relative h-full flex items-center gap-2.5 text-base font-black tracking-tight uppercase transition-all duration-500 group ${activeTab === tab.id
                          ? 'text-brand-red'
                          : 'text-brand-black/40 hover:text-brand-black'
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (tab.id === 'visa') {
                          window.open('https://askvisa.in', '_blank');
                          return;
                        }
                        setActiveTab(tab.id);
                        // Navigate to the corresponding route so the page content updates
                        const routeMap = { flights: '/flights', hotels: '/hotels', tours: '/tours' };
                        navigate(routeMap[tab.id] || '/');
                      }}
                    >
                      <tab.icon size={18} className={`transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110 opacity-50 group-hover:opacity-100'}`} />
                      {tab.label}
                      {/* Animated indicator under the active tab */}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-brand-red rounded-t-full shadow-[0_-4px_12px_rgba(230,30,42,0.3)]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center justify-end gap-8">
            {user && (
              <Link 
                to="/my-bookings"
                className="flex items-center gap-2.5 text-base font-black uppercase tracking-tight cursor-pointer text-brand-black/50 hover:text-brand-red transition-all duration-300 group"
              >
                <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                <span>Bookings</span>
              </Link>
            )}

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="w-10 h-10 rounded-full bg-black/5 hover:bg-brand-red/10 flex items-center justify-center text-brand-black/60 hover:text-brand-red transition-all relative group"
                >
                  <Bell size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border border-white" />
                </button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden z-50 p-4"
                      >
                        <div className="flex items-center justify-between mb-4 px-2">
                          <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-black">Notifications</h3>
                          <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest bg-brand-red/10 px-2 py-1 rounded-full">2 New</span>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 rounded-2xl bg-brand-red/5 hover:bg-brand-red/10 transition-colors cursor-pointer border border-brand-red/10">
                            <h4 className="text-[12px] font-black text-brand-black mb-1">Flight Price Alert</h4>
                            <p className="text-[11px] text-brand-black/60 leading-tight">Prices for Mumbai to Dubai have dropped by 15%.</p>
                            <span className="text-[9px] font-bold text-brand-red uppercase tracking-widest mt-2 block">Just now</span>
                          </div>
                          <div className="p-3 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer">
                            <h4 className="text-[12px] font-black text-brand-black mb-1">Complete your profile</h4>
                            <p className="text-[11px] text-brand-black/60 leading-tight">Add your passport details for faster international bookings.</p>
                            <span className="text-[9px] font-bold text-brand-black/40 uppercase tracking-widest mt-2 block">2 hours ago</span>
                          </div>
                        </div>
                        <Link to="/dashboard/notifications" onClick={() => setIsNotificationOpen(false)} className="block mt-4 text-center text-[11px] font-black text-brand-red uppercase tracking-widest hover:underline">
                          View All
                        </Link>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="relative">
              {user ? (
                <div
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-3 pl-4 pr-1 py-1 rounded-full bg-brand-red/5 hover:bg-brand-red/10 border border-brand-red/10 transition-all duration-500 cursor-pointer shadow-sm group"
                >
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-[14px] font-black text-brand-black leading-none mb-0.5">
                    {user.name || 'Traveler'}
                    </span>
                    <span className="text-[9px] font-bold text-brand-red uppercase tracking-widest leading-none">My Profile</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-black text-sm shadow-md shadow-brand-red/20 group-hover:scale-105 transition-transform">
                    {user.initials}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-3 pl-5 pr-1 py-1 rounded-full bg-brand-black text-white hover:bg-brand-red transition-all duration-500 cursor-pointer shadow-lg hover:shadow-brand-red/20 group"
                >
                  <span className="text-[14px] font-black uppercase tracking-widest">Account</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <UserCircle2 size={22} className="text-white" />
                  </div>
                </div>
              )}

              <AnimatePresence>
                {isAccountMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsAccountMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden z-50 p-3"
                    >
                      <div className="space-y-1">
                        {user ? (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-red/[0.03] text-brand-black group transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-brand-red/5 text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors">
                                <UserCircle2 size={24} />
                              </div>
                              <div className="text-left">
                                <div className="text-[14px] font-black tracking-tight leading-none mb-1">My Profile</div>
                                <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">View & Edit Details</div>
                              </div>
                            </Link>
                            <Link
                              to="/my-bookings"
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-red/[0.03] text-brand-black group transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-brand-red/5 text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors">
                                <CreditCard size={24} />
                              </div>
                              <div className="text-left">
                                <div className="text-[14px] font-black tracking-tight leading-none mb-1">My Bookings</div>
                                <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Travel History</div>
                              </div>
                            </Link>
                            <div className="h-px bg-black/5 mx-4" />
                            <button
                              onClick={() => {
                                logout();
                                setIsAccountMenuOpen(false);
                                navigate('/');
                              }}
                              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-red/[0.03] text-brand-black group transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-black/5 text-brand-black/40 flex items-center justify-center group-hover:bg-brand-black group-hover:text-white transition-colors">
                                <X size={24} />
                              </div>
                              <div className="text-left">
                                <div className="text-[14px] font-black tracking-tight leading-none mb-1">Sign Out</div>
                                <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Logout of Account</div>
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                setIsB2CModalOpen(true);
                              }}
                              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-red/[0.03] text-brand-black group transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-brand-red/5 text-brand-red flex items-center justify-center group-hover:bg-brand-red group-hover:text-white transition-colors">
                                <UserCircle2 size={24} />
                              </div>
                              <div className="text-left">
                                <div className="text-[14px] font-black tracking-tight leading-none mb-1">Personal Account</div>
                                <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Login / Signup</div>
                              </div>
                            </button>

                            <div className="h-px bg-black/5 mx-4" />

                            <button
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                setIsB2BModalOpen(true);
                              }}
                              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-amber-500/[0.03] text-brand-black group transition-all"
                            >
                              <div className="w-12 h-12 rounded-xl bg-amber-500/5 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <ShieldCheck size={24} />
                              </div>
                              <div className="text-left">
                                <div className="text-[14px] font-black tracking-tight leading-none mb-1">Business/Trade Account</div>
                                <div className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest">Agent Portal Login</div>
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modals */}
      <AnimatePresence>
        {isB2CModalOpen && (
          <AuthModal isOpen={isB2CModalOpen} onClose={() => setIsB2CModalOpen(false)} type="personal" />
        )}
        {isB2BModalOpen && (
          <AuthModal isOpen={isB2BModalOpen} onClose={() => setIsB2BModalOpen(false)} type="business" />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

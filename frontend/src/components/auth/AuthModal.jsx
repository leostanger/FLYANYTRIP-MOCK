import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check, ArrowRight, ShieldCheck, Briefcase, User, Smartphone, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/icons/Group 7412.svg';

const loginBgImg = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login } = useAuth();

  const [accountType, setAccountType] = useState('PERSONAL'); // 'PERSONAL' | 'BUSINESS'
  const [loginMethod, setLoginMethod] = useState('MOBILE'); // 'MOBILE' | 'EMAIL'
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Step management: 'INPUT' | 'OTP'
  const [step, setStep] = useState('INPUT');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState('');

  const otpInputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('INPUT');
      setError('');
      setMobileNumber('');
      setEmail('');
      setPassword('');
      setFullName('');
      setOtp(['', '', '', '']);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e) => {
    e?.preventDefault();
    setError('');

    if (loginMethod === 'MOBILE') {
      if (!mobileNumber || mobileNumber.trim().length < 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
    } else {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
    }

    setStep('OTP');
    setTimer(30);
    setIsResendDisabled(true);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError('Please enter the complete 4-digit OTP code');
      return;
    }

    login({
      name: fullName || (loginMethod === 'MOBILE' ? `User ${mobileNumber.slice(-4)}` : email.split('@')[0]),
      phone: mobileNumber ? `${countryCode} ${mobileNumber}` : '+91 9876543210',
      email: email || 'user@flyanytrip.com',
      accountType,
    });
  };

  const handleGoogleLogin = () => {
    login({
      name: 'Alex Johnson',
      email: 'alex.johnson@gmail.com',
      phone: '+91 9876543210',
      accountType,
    });
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Click outside backdrop overlay */}
      <div className="fixed inset-0 z-0" onClick={closeAuthModal} />

      {/* Main MMT Style Modal Window */}
      <div className="relative z-10 w-full max-w-[880px] bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col md:flex-row border border-white/20 animate-scaleIn my-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100/80 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer border-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LEFT PANEL: Brand Image Only ── */}
        <div className="w-full md:w-[380px] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden flex-shrink-0 min-h-[350px] md:min-h-[520px]">
          {/* Background Image of Airplane Wing at Sunset */}
          <img
            src={loginBgImg}
            alt="Airplane Sunset View"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 z-[1]" />

          {/* Logo Only */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="FlyAnyTrip" className="h-10 object-contain filter invert brightness-200 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form & Login Flow ── */}
        <div className="flex-1 bg-white p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Login / Sign Up Switch Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {step === 'OTP' ? 'Verify OTP Code' : authMode === 'login' ? 'Login to FlyAnyTrip' : 'Create an Account'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-light mt-0.5">
                  {step === 'OTP'
                    ? `OTP sent to ${loginMethod === 'MOBILE' ? `${countryCode} ${mobileNumber}` : email}`
                    : 'Enter your details to proceed with your booking'}
                </p>
              </div>

              {step === 'INPUT' && (
                <div className="text-xs font-medium text-gray-500">
                  {authMode === 'login' ? (
                    <span>
                      New?{' '}
                      <button
                        onClick={() => setAuthMode('signup')}
                        className="text-[#ef3535] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </span>
                  ) : (
                    <span>
                      Have an account?{' '}
                      <button
                        onClick={() => setAuthMode('login')}
                        className="text-[#ef3535] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Login
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium animate-fadeIn">
                {error}
              </div>
            )}

            {/* ── STEP 1: INPUT FORM ── */}
            {step === 'INPUT' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ef3535] focus:ring-2 focus:ring-red-100 outline-none text-sm font-medium transition-all"
                      required
                    />
                  </div>
                )}

                {/* Mobile / Email Login Method Selector */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                      {loginMethod === 'MOBILE' ? 'Mobile Number' : 'Email Address'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod(loginMethod === 'MOBILE' ? 'EMAIL' : 'MOBILE');
                        setError('');
                      }}
                      className="text-xs font-semibold text-[#ef3535] hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      Use {loginMethod === 'MOBILE' ? 'Email Address' : 'Mobile Number'}
                    </button>
                  </div>

                  {loginMethod === 'MOBILE' ? (
                    <div className="flex gap-2">
                      {/* Country Code Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="h-[46px] px-3 rounded-xl border border-gray-300 bg-gray-50 text-sm font-bold text-gray-700 flex items-center gap-1.5 hover:bg-gray-100 transition-colors cursor-pointer border-none"
                        >
                          <span>{COUNTRY_CODES.find((c) => c.code === countryCode)?.flag}</span>
                          <span>{countryCode}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        </button>

                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto py-1">
                            {COUNTRY_CODES.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCountryCode(c.code);
                                  setShowCountryDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-red-50 flex items-center justify-between transition-colors border-none bg-transparent cursor-pointer"
                              >
                                <span>{c.flag} {c.country}</span>
                                <span className="font-bold text-gray-500">{c.code}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Mobile Input */}
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="flex-1 h-[46px] px-4 rounded-xl border border-gray-300 focus:border-[#ef3535] focus:ring-2 focus:ring-red-100 outline-none text-sm font-medium transition-all"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[46px] px-4 rounded-xl border border-gray-300 focus:border-[#ef3535] focus:ring-2 focus:ring-red-100 outline-none text-sm font-medium transition-all"
                      autoFocus
                    />
                  )}
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="w-full h-[48px] bg-[#ef3535] hover:bg-red-600 text-white font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer border-none mt-4"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <span className="relative bg-white px-3 text-xs text-gray-400 uppercase font-bold tracking-wider">
                    Or Continue With
                  </span>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full h-[46px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-xs"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP VERIFICATION ── */}
            {step === 'OTP' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-3 my-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpInputRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-black rounded-xl border-2 border-gray-300 focus:border-[#ef3535] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                  <button
                    type="button"
                    onClick={() => setStep('INPUT')}
                    className="text-gray-600 hover:text-[#ef3535] underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Change {loginMethod === 'MOBILE' ? 'number' : 'email'}
                  </button>

                  <button
                    type="button"
                    disabled={isResendDisabled}
                    onClick={() => {
                      setTimer(30);
                      setIsResendDisabled(true);
                    }}
                    className={`${isResendDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#ef3535] font-bold hover:underline cursor-pointer'
                      } bg-transparent border-none p-0`}
                  >
                    {isResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full h-[48px] bg-[#ef3535] hover:bg-red-600 text-white font-extrabold text-sm tracking-wider uppercase rounded-xl transition-all duration-200 shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span>Verify & Login</span>
                  <Check className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Terms */}
          <p className="text-[11px] text-gray-400 text-center leading-relaxed mt-6 font-light">
            By proceeding, you agree to FlyAnyTrip's{' '}
            <a href="/terms" className="text-gray-600 underline">Terms of Service</a> &{' '}
            <a href="/privacy" className="text-gray-600 underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, MapPin, 
  CheckCircle2, Shield, UserCircle2, Check, ArrowRight, Activity, Plane, FileText, Utensils, Train, Globe, Briefcase,
  Map, Navigation, PlaneTakeoff, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const InputField = ({ icon: Icon, label, value, onChange, type = "text", placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group z-10">
      <div className="flex justify-between items-end mb-2">
        <label className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isFocused ? 'text-brand-red' : 'text-brand-black/50'}`}>
          {label}
        </label>
        {isFocused && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} 
            className="text-[8px] font-bold uppercase tracking-wider text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full"
          >
            Editing
          </motion.span>
        )}
      </div>
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r from-brand-red to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isFocused ? '!opacity-30' : ''}`} />
        <div className={`relative bg-white/80 backdrop-blur-xl border-2 rounded-2xl flex items-center transition-all duration-300 ${
            isFocused 
              ? 'border-brand-red shadow-[0_8px_30px_rgba(230,30,42,0.15)] scale-[1.02] z-20' 
              : 'border-white hover:border-brand-red/30 hover:bg-white'
          }`}>
          <div className="pl-5 pr-3 text-brand-black/40">
            <motion.div 
              animate={{ 
                color: isFocused ? 'rgb(230,30,42)' : 'rgba(0,0,0,0.3)',
                scale: isFocused ? 1.1 : 1
              }}
              className="transition-colors duration-300"
            >
              <Icon size={20} strokeWidth={isFocused ? 2.5 : 2} />
            </motion.div>
          </div>
          <input 
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full h-14 bg-transparent outline-none font-bold text-brand-black placeholder:text-brand-black/20 text-[15px] pr-5"
          />
        </div>
      </div>
    </div>
  );
};

const SelectField = ({ icon: Icon, label, value, onChange, options, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group z-10">
      <div className="flex justify-between items-end mb-2">
        <label className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isFocused ? 'text-brand-red' : 'text-brand-black/50'}`}>
          {label}
        </label>
        {isFocused && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} 
            className="text-[8px] font-bold uppercase tracking-wider text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full"
          >
            Selecting
          </motion.span>
        )}
      </div>
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${isFocused ? '!opacity-30' : ''}`} />
        <div className={`relative bg-white/80 backdrop-blur-xl border-2 rounded-2xl flex items-center transition-all duration-300 ${
            isFocused 
              ? 'border-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.15)] scale-[1.02] z-20' 
              : 'border-white hover:border-blue-500/30 hover:bg-white'
          }`}>
          <div className="pl-5 pr-3 text-brand-black/40">
            <motion.div 
              animate={{ 
                color: isFocused ? 'rgb(59,130,246)' : 'rgba(0,0,0,0.3)',
                scale: isFocused ? 1.1 : 1
              }}
              className="transition-colors duration-300"
            >
              <Icon size={20} strokeWidth={isFocused ? 2.5 : 2} />
            </motion.div>
          </div>
          <select 
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-14 bg-transparent outline-none font-bold text-brand-black appearance-none text-[15px] pr-10 cursor-pointer"
          >
            {placeholder && <option value="" disabled className="text-brand-black/40">{placeholder}</option>}
            {options.map((opt, i) => (
              <option key={i} value={typeof opt === 'object' ? opt.value : opt} className="font-medium">{typeof opt === 'object' ? opt.label : opt}</option>
            ))}
          </select>
          <div className="absolute right-5 pointer-events-none text-brand-black/40">
            <motion.svg 
              animate={{ rotate: isFocused ? 180 : 0, color: isFocused ? 'rgb(59,130,246)' : 'rgba(0,0,0,0.4)' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </motion.svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const { user, updateProfile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    nationality: user?.nationality || '',
    mealPreference: user?.mealPreference || '',
    trainBerthPreference: user?.trainBerthPreference || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    passportNo: user?.passportNo || '',
    passportExpiry: user?.passportExpiry || '',
    issuingCountry: user?.issuingCountry || '',
    airline: user?.airline || '',
    frequentFlyerNo: user?.frequentFlyerNo || '',
    gstin: user?.gstin || ''
  });

  // Calculate profile completion
  useEffect(() => {
    let completed = 0;
    const totalFields = Object.keys(formData).length;
    Object.values(formData).forEach(val => {
      if (val && val.trim() !== '') completed++;
    });
    setCompletionPercentage(Math.round((completed / totalFields) * 100));
  }, [formData]);

  const handleSave = async () => {
    setFormError('');
    
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setFormError('Please enter a valid email address');
        return;
      }
    }
    
    if (formData.mobile) {
      const mobileRegex = /^[0-9]{10}$/;
      const cleanMobile = formData.mobile.replace(/\D/g, '');
      if (!mobileRegex.test(cleanMobile)) {
        setFormError('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    setIsSaving(true);
    // Simulate network request for premium feel
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateProfile(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <DashboardLayout 
      title="Personal Profile" 
      subtitle="Manage your identity and travel preferences"
      icon={User}
    >
      {/* Success Popup - Redesigned */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6 relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-green-500/20" />
                <Check size={40} strokeWidth={3} />
              </motion.div>
              <h4 className="text-2xl font-black text-brand-black tracking-tight mb-2">Profile Updated</h4>
              <p className="text-[12px] font-bold text-brand-black/50 uppercase tracking-widest leading-relaxed">
                Your personal details have been securely saved
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl"
      >
        {/* Profile Completion Banner */}
        <motion.div variants={itemVariants} className="mb-12 relative overflow-hidden rounded-[40px] bg-brand-black p-10 md:p-12 shadow-2xl shadow-brand-black/20 border border-white/10 group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-red/30 to-purple-600/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Profile Analytics</span>
              </motion.div>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Profile Status</h3>
              <p className="text-white/60 font-bold uppercase text-[12px] tracking-widest max-w-sm leading-relaxed">
                Complete your profile to unlock faster bookings and personalized offers
              </p>
            </div>
            
            <div className="flex items-center gap-8 bg-white/5 p-6 rounded-[32px] backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90 overflow-visible">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <motion.circle 
                    cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className="text-brand-red drop-shadow-[0_0_12px_rgba(230,30,42,0.6)]"
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - completionPercentage / 100) }}
                    transition={{ duration: 2, ease: "easeOut", type: "spring", bounce: 0.4 }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-white">{completionPercentage}%</span>
                </div>
              </div>
              <div className="pr-4 whitespace-nowrap">
                <div className="text-[11px] font-black uppercase tracking-widest text-brand-red mb-1">Completion Level</div>
                <div className="text-2xl font-bold text-white tracking-tight leading-none">{completionPercentage === 100 ? 'All Set!' : 'Keep Going'}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Travel Statistics - NEW */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Flights Taken", value: "12", icon: PlaneTakeoff, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Countries Visited", value: "5", icon: Map, color: "text-green-500", bg: "bg-green-500/10" },
            { label: "Miles Flown", value: "24.5k", icon: Navigation, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Reward Points", value: "8,450", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center justify-center text-center">
              <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <h5 className="text-2xl font-black text-brand-black mb-1">{stat.value}</h5>
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-black/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Form Sections */}
        <div className="space-y-10">
          
          {/* Basic Info Card */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-red/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-brand-red/10 transition-colors duration-1000" />
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-red text-white flex items-center justify-center shadow-[0_8px_20px_rgba(230,30,42,0.3)]">
                <User size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xl font-black text-brand-black tracking-tight">Basic Information</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">Core identity details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
              <InputField icon={User} label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter your legal name" />
              <InputField icon={Calendar} label="Date of Birth" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} type="date" />
              <SelectField 
                icon={UserCircle2} 
                label="Gender" 
                value={formData.gender} 
                onChange={e => setFormData({...formData, gender: e.target.value})} 
                options={['Male', 'Female', 'Other']}
                placeholder="Select Gender"
              />
              <SelectField 
                icon={Globe} 
                label="Nationality" 
                value={formData.nationality} 
                onChange={e => setFormData({...formData, nationality: e.target.value})} 
                options={['Indian', 'American', 'British', 'Canadian', 'Australian', 'Other']}
                placeholder="Select Nationality"
              />
            </div>
          </motion.div>

          {/* Business Details Card (Only for Business Accounts) */}
          {user?.type === 'business' && (
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-1000" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(245,158,11,0.3)]">
                  <Briefcase size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-black tracking-tight">Business Details</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">Corporate information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                <InputField icon={Briefcase} label="GSTIN Number" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} placeholder="Enter your 15-digit GSTIN" />
              </div>
            </motion.div>
          )}

          {/* Preferences Card (Hidden for Business Accounts) */}
          {user?.type !== 'business' && (
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-1000" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(249,115,22,0.3)]">
                  <Utensils size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-black tracking-tight">Travel Preferences</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">Customized experiences</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                <SelectField 
                  icon={Utensils} 
                  label="Meal Preference" 
                  value={formData.mealPreference} 
                  onChange={e => setFormData({...formData, mealPreference: e.target.value})} 
                  options={['Any', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Halal', 'Kosher']}
                  placeholder="Select Meal Preference"
                />
                <SelectField 
                  icon={Train} 
                  label="Train Berth Preference" 
                  value={formData.trainBerthPreference} 
                  onChange={e => setFormData({...formData, trainBerthPreference: e.target.value})} 
                  options={['Any', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper']}
                  placeholder="Select Berth Preference"
                />
              </div>
            </motion.div>
          )}

          {/* Contact Info Card */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000" />
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(59,130,246,0.3)]">
                <Phone size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xl font-black text-brand-black tracking-tight">Contact Details</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">Reachability</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
              <InputField icon={Mail} label="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="name@example.com" />
              <InputField icon={Phone} label="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} type="tel" placeholder="+1 (555) 000-0000" />
            </div>
          </motion.div>

          {/* Address Card */}
          <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-green-500/10 transition-colors duration-1000" />
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-xl font-black text-brand-black tracking-tight">Location Information</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">Residential details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
              <div className="md:col-span-2">
                <InputField icon={MapPin} label="Full Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street address, apartment, suite" />
              </div>
              <InputField icon={MapPin} label="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City name" />
              <InputField icon={MapPin} label="State / Province" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="State name" />
            </div>
          </motion.div>

          {/* Passport Details Card (Hidden for Business Accounts) */}
          {user?.type !== 'business' && (
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-1000" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(168,85,247,0.3)]">
                  <FileText size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-black tracking-tight">Passport Details</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">International travel</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                <InputField icon={FileText} label="Passport No." value={formData.passportNo} onChange={e => setFormData({...formData, passportNo: e.target.value})} placeholder="Enter passport number" />
                <InputField icon={Calendar} label="Expiry Date" value={formData.passportExpiry} onChange={e => setFormData({...formData, passportExpiry: e.target.value})} type="date" />
                <div className="md:col-span-2">
                  <SelectField 
                    icon={Globe} 
                    label="Issuing Country" 
                    value={formData.issuingCountry} 
                    onChange={e => setFormData({...formData, issuingCountry: e.target.value})} 
                    options={['India', 'USA', 'UK', 'Canada', 'Australia', 'Other']}
                    placeholder="Select Issuing Country"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Frequent Flyer Card (Hidden for Business Accounts) */}
          {user?.type !== 'business' && (
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-3xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-1000" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(99,102,241,0.3)]">
                  <Plane size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-black tracking-tight">Frequent Flyer Details</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40">Loyalty programs</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                <SelectField 
                  icon={Plane} 
                  label="Airline" 
                  value={formData.airline} 
                  onChange={e => setFormData({...formData, airline: e.target.value})} 
                  options={['Air India', 'IndiGo', 'Vistara', 'Emirates', 'Qatar Airways', 'Other']}
                  placeholder="Select Airline"
                />
                <InputField icon={Activity} label="Frequent Flyer Number" value={formData.frequentFlyerNo} onChange={e => setFormData({...formData, frequentFlyerNo: e.target.value})} placeholder="Enter membership number" />
              </div>
            </motion.div>
          )}

        </div>

        {/* Action Button */}
        <motion.div variants={itemVariants} className="mt-10 flex flex-col items-end">
          {formError && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-brand-red text-[13px] font-bold mb-4 bg-brand-red/10 px-4 py-2 rounded-xl"
            >
              {formError}
            </motion.p>
          )}
          <motion.button 
            onClick={handleSave}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative h-16 px-10 bg-brand-black hover:bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl shadow-black/20 transition-all duration-500 flex items-center gap-4 overflow-hidden"
          >
            <motion.div 
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            {isSaving ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                Save Changes
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Security & Trust Badges */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-10 border-t border-black/5">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-black/[0.03] text-brand-black/40 flex items-center justify-center group-hover:bg-brand-red/10 group-hover:text-brand-red transition-all duration-300">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-black">256-bit Secure</h3>
              <p className="text-[10px] font-bold text-brand-black/40">Data Encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-black/[0.03] text-brand-black/40 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all duration-300">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-black">Verified Identity</h3>
              <p className="text-[10px] font-bold text-brand-black/40">Trusted Traveler</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-black/[0.03] text-brand-black/40 flex items-center justify-center group-hover:bg-green-500/10 group-hover:text-green-500 transition-all duration-300">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-black">Active Monitoring</h3>
              <p className="text-[10px] font-bold text-brand-black/40">Account Protection</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
};

export default MyProfile;


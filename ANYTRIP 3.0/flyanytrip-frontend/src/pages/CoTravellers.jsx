import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, ArrowLeft, Check, User, Calendar, 
  Globe, Utensils, Train, FileText, Phone, Mail, Plane, Activity,
  ChevronDown
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';


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

const InputField = ({ label, value, onChange, type = "text", placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group w-full">
      <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors duration-300 ${isFocused ? 'text-brand-red' : 'text-brand-black/40'}`}>
        {label}
      </label>
      <div className="relative">
        <input 
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full h-12 bg-black/[0.02] focus:bg-white border-2 rounded-xl px-4 outline-none transition-all duration-300 font-bold text-brand-black placeholder:text-brand-black/20 ${
            isFocused 
              ? 'border-brand-red shadow-[0_0_0_4px_rgba(230,30,42,0.1)]' 
              : 'border-transparent hover:border-black/5'
          }`}
        />
      </div>
    </div>
  );
};

const SelectField = ({ label, value, onChange, options, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group w-full">
      <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors duration-300 ${isFocused ? 'text-brand-red' : 'text-brand-black/40'}`}>
        {label}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-12 bg-black/[0.02] focus:bg-white border-2 rounded-xl px-4 pr-10 outline-none transition-all duration-300 font-bold text-brand-black appearance-none ${
            isFocused 
              ? 'border-brand-red shadow-[0_0_0_4px_rgba(230,30,42,0.1)]' 
              : 'border-transparent hover:border-black/5'
          }`}
        >
          {placeholder && <option value="" disabled className="text-brand-black/40">{placeholder}</option>}
          {options.map((opt, i) => (
            <option key={i} value={typeof opt === 'object' ? opt.value : opt}>{typeof opt === 'object' ? opt.label : opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-brand-black/40">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

const PhoneField = ({ label, value, onChange, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group w-full">
      <label className={`text-[10px] font-black uppercase tracking-widest mb-2 block transition-colors duration-300 ${isFocused ? 'text-brand-red' : 'text-brand-black/40'}`}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative w-24">
          <select className="w-full h-12 bg-black/[0.02] border-2 border-transparent hover:border-black/5 rounded-xl px-2 appearance-none outline-none font-bold text-brand-black text-center">
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-brand-black/40">
            <ChevronDown size={14} />
          </div>
        </div>
        <input 
          type="tel"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`flex-1 h-12 bg-black/[0.02] focus:bg-white border-2 rounded-xl px-4 outline-none transition-all duration-300 font-bold text-brand-black placeholder:text-brand-black/20 ${
            isFocused 
              ? 'border-brand-red shadow-[0_0_0_4px_rgba(230,30,42,0.1)]' 
              : 'border-transparent hover:border-black/5'
          }`}
        />
      </div>
    </div>
  );
};

const CoTravellers = () => {
  const { user } = useAuth();
  const isBusiness = user?.type === 'business';
  const label = isBusiness ? 'Traveller' : 'Co-Traveller';
  const labelPlural = isBusiness ? 'Travellers' : 'Co-Travellers';

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  // List of saved co-travellers
  const [coTravellers, setCoTravellers] = useState([
    { 
      id: 1, 
      firstName: 'Emma',
      lastName: 'Watson',
      gender: 'Female',
      dob: '',
      nationality: '',
      relationship: 'Friend',
      mealPreference: '',
      trainBerthPreference: '',
      passportNo: '',
      passportExpiry: '',
      issuingCountry: '',
      mobile: '',
      email: '',
      airline: '',
      frequentFlyerNo: ''
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nationality: '',
    relationship: '',
    mealPreference: '',
    trainBerthPreference: '',
    passportNo: '',
    passportExpiry: '',
    issuingCountry: '',
    mobile: '',
    email: '',
    airline: '',
    frequentFlyerNo: ''
  });

  const relationships = isBusiness 
    ? ['Employee', 'Manager', 'Director', 'Consultant', 'Contractor', 'Client', 'Other']
    : ['Spouse', 'Child', 'Sibling', 'GrandParent', 'Friend', 'Parent', 'Colleague', 'Relative', 'Parent In law', 'Other'];


  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (editingId) {
      setCoTravellers(coTravellers.map(ct => ct.id === editingId ? { ...formData, id: editingId } : ct));
    } else {
      setCoTravellers([...coTravellers, { ...formData, id: Date.now() }]);
    }
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsAdding(false);
      setEditingId(null);
      // Reset form
      setFormData({
        firstName: '', lastName: '', gender: '', dob: '', nationality: '', relationship: '', mealPreference: '', trainBerthPreference: '', passportNo: '', passportExpiry: '', issuingCountry: '', mobile: '', email: '', airline: '', frequentFlyerNo: ''
      });
    }, 2000);
  };

  const handleEdit = (traveller) => {
    setFormData({ ...traveller });
    setEditingId(traveller.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      firstName: '', lastName: '', gender: '', dob: '', nationality: '', relationship: '', mealPreference: '', trainBerthPreference: '', passportNo: '', passportExpiry: '', issuingCountry: '', mobile: '', email: '', airline: '', frequentFlyerNo: ''
    });
  };

  return (
    <DashboardLayout 
      title={labelPlural} 
      subtitle={isBusiness ? "Manage your team and employees" : "Manage your family, friends, and colleagues"}
      icon={Users}
    >
      {/* Success Popup */}
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
              <h4 className="text-2xl font-black text-brand-black tracking-tight mb-2">Saved Successfully</h4>
              <p className="text-[12px] font-bold text-brand-black/50 uppercase tracking-widest leading-relaxed">
                {label} details have been updated
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
        
        <AnimatePresence mode="wait">
          {!isAdding ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full bg-brand-red/5 hover:bg-brand-red hover:text-white border-2 border-brand-red/20 border-dashed rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 text-brand-red transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-red/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Add New {label}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 mt-1">Faster checkout for future bookings</p>
                </div>
              </button>

              {coTravellers.map(ct => (
                <div key={ct.id} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm flex items-center justify-between group hover:border-brand-red/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red font-black text-xl flex items-center justify-center uppercase">
                      {ct.firstName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-black">{ct.firstName} {ct.lastName}</h4>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-brand-black/40 mt-1">{ct.relationship} • {ct.gender}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEdit(ct)}
                    className="text-[11px] font-black uppercase tracking-widest text-brand-red opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-brand-red/5 rounded-lg hover:bg-brand-red hover:text-white"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5"
            >
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCancel}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-brand-black transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-black text-brand-black tracking-tight">
                    {editingId ? `Edit ${label}` : `Add New ${label}`}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCancel}
                    className="px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] bg-black/5 text-brand-black/60 hover:bg-black/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[100px]"
                  >
                    {isSaving ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : 'Save'}
                  </button>
                </div>
              </div>

              <div className="space-y-10">
                {/* General Information */}
                <div>
                  <h3 className="text-[13px] font-black text-brand-black mb-6">General Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="First & Middle Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    <InputField label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    
                    <SelectField 
                      label="Gender" 
                      value={formData.gender} 
                      onChange={e => setFormData({...formData, gender: e.target.value})} 
                      options={['Male', 'Female', 'Other']}
                      placeholder="Select"
                    />
                    <InputField label="Date of Birth" type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                    <SelectField 
                      label="Nationality" 
                      value={formData.nationality} 
                      onChange={e => setFormData({...formData, nationality: e.target.value})} 
                      options={['Indian', 'American', 'British', 'Canadian', 'Australian', 'Other']}
                      placeholder="Select"
                    />
                  </div>

                  <div className="mt-6 bg-black/[0.02] p-6 rounded-2xl border border-black/5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-black/40 mb-4 block">
                      {isBusiness ? 'Designation / Relationship' : 'Relationship With Traveller'}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {relationships.map(rel => (
                        <button
                          key={rel}
                          onClick={() => setFormData({...formData, relationship: rel})}
                          className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${
                            formData.relationship === rel 
                              ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                              : 'bg-white border border-black/10 text-brand-black/60 hover:border-brand-black/20 hover:text-brand-black'
                          }`}
                        >
                          {rel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-[11px] text-brand-black/50 mb-4">This helps to give us personalised travel recommendations when travelling</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField 
                        label="Meal Preference" 
                        value={formData.mealPreference} 
                        onChange={e => setFormData({...formData, mealPreference: e.target.value})} 
                        options={['Any', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Halal', 'Kosher']}
                        placeholder="Select"
                      />
                      <SelectField 
                        label="Train Berth Preference" 
                        value={formData.trainBerthPreference} 
                        onChange={e => setFormData({...formData, trainBerthPreference: e.target.value})} 
                        options={['Any', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper']}
                        placeholder="Select"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-black/5" />

                {/* Passport Details */}
                <div>
                  <h3 className="text-[13px] font-black text-brand-black mb-6">Passport Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Passport No." value={formData.passportNo} onChange={e => setFormData({...formData, passportNo: e.target.value})} />
                    <InputField label="Expiry Date" type="date" value={formData.passportExpiry} onChange={e => setFormData({...formData, passportExpiry: e.target.value})} />
                    <SelectField 
                      label="Issuing Country" 
                      value={formData.issuingCountry} 
                      onChange={e => setFormData({...formData, issuingCountry: e.target.value})} 
                      options={['India', 'USA', 'UK', 'Canada', 'Australia', 'Other']}
                      placeholder="Select"
                    />
                  </div>
                </div>

                <hr className="border-black/5" />

                {/* Contact Info */}
                <div>
                  <h3 className="text-[13px] font-black text-brand-black mb-2">Add contact information to receive booking details & other alerts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <PhoneField label="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                    <InputField label="Email ID" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" />
                  </div>
                </div>

                <hr className="border-black/5" />

                {/* Frequent Flyer */}
                <div>
                  <h3 className="text-[13px] font-black text-brand-black mb-6">Frequent Flyer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField 
                      label="Airline" 
                      value={formData.airline} 
                      onChange={e => setFormData({...formData, airline: e.target.value})} 
                      options={['Air India', 'IndiGo', 'Vistara', 'Emirates', 'Qatar Airways', 'Other']}
                      placeholder="Select"
                    />
                    <InputField label="Frequent Flyer Number" value={formData.frequentFlyerNo} onChange={e => setFormData({...formData, frequentFlyerNo: e.target.value})} />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </DashboardLayout>
  );
};

export default CoTravellers;

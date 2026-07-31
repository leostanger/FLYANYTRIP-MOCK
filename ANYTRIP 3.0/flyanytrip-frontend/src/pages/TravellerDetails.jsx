import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Phone, ArrowRight, ArrowLeft, Info, AlertTriangle, ShieldCheck, Check, Lock, ChevronDown, MapPin } from 'lucide-react';

const TravellerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, fareQuote } = location.state || {};
  
  const [tripSecure, setTripSecure] = useState('yes');
  const [hasGST, setHasGST] = useState(false);

  // Form State
  const [travellers, setTravellers] = useState([
    { type: 'adult', title: 'Mr', firstName: '', lastName: '', gender: 'Male', dob: '', email: '', phone: '' }
  ]);

  if (!flight) return null;

  const handleAddTraveller = () => {
    setTravellers([...travellers, { type: 'adult', title: 'Mr', firstName: '', lastName: '', gender: 'Male', dob: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newTravellers = [...travellers];
    newTravellers[index][field] = value;
    setTravellers(newTravellers);
  };

  const handleContinue = () => {
    // Basic Validation
    const isValid = travellers.every((t, idx) => t.firstName && t.lastName && (idx === 0 ? (t.email && t.phone) : true));
    if (!isValid) {
      alert('Please fill in all required fields for all travellers.');
      return;
    }
    navigate('/seat-selection', { state: { flight, fareQuote, travellers } });
  };

  return (
    <div className="min-h-screen bg-black/[0.02] py-12">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">✓</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Review</span>
          </div>
          <div className="flex-1 h-[2px] bg-brand-red mx-4" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">2</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Traveller</span>
          </div>
          <div className="flex-1 h-[2px] bg-black/10 mx-4" />
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-black/20 text-brand-black flex items-center justify-center font-bold">3</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Seats</span>
          </div>
          <div className="flex-1 h-[2px] bg-black/10 mx-4" />
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-black/20 text-brand-black flex items-center justify-center font-bold">4</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            {/* Traveller Form Cards */}
            {travellers.map((traveller, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h2 className="text-xl font-extrabold text-brand-black uppercase tracking-tight">
                      {traveller.type} {index + 1}
                    </h2>
                  </div>
                  {index > 0 && (
                    <button 
                      onClick={() => setTravellers(travellers.filter((_, i) => i !== index))}
                      className="text-xs font-bold text-brand-red hover:underline"
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">Title</label>
                    <select 
                      value={traveller.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl py-3 px-4 text-brand-black font-semibold focus:outline-none focus:border-brand-red transition-all"
                    >
                      <option>Mr</option>
                      <option>Ms</option>
                      <option>Mrs</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">First Name</label>
                      <input 
                        type="text"
                        value={traveller.firstName}
                        onChange={(e) => handleInputChange(index, 'firstName', e.target.value)}
                        placeholder="Enter First Name"
                        className="w-full bg-black/[0.02] border border-black/10 rounded-xl py-3 px-4 text-brand-black font-semibold focus:outline-none focus:border-brand-red transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">Last Name</label>
                      <input 
                        type="text"
                        value={traveller.lastName}
                        onChange={(e) => handleInputChange(index, 'lastName', e.target.value)}
                        placeholder="Enter Last Name"
                        className="w-full bg-black/[0.02] border border-black/10 rounded-xl py-3 px-4 text-brand-black font-semibold focus:outline-none focus:border-brand-red transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">Gender</label>
                    <div className="flex gap-2">
                      {['Male', 'Female'].map(g => (
                        <button 
                          key={g}
                          onClick={() => handleInputChange(index, 'gender', g)}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${traveller.gender === g ? 'bg-brand-black text-white' : 'bg-black/[0.02] text-brand-black/40 hover:bg-black/5'}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">Date of Birth</label>
                    <input 
                      type="date"
                      value={traveller.dob}
                      onChange={(e) => handleInputChange(index, 'dob', e.target.value)}
                      className="w-full bg-black/[0.02] border border-black/10 rounded-xl py-3 px-4 text-brand-black font-semibold focus:outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                </div>

                {index === 0 && (
                  <div className="mt-8 pt-8 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30" size={18} />
                        <input 
                          type="email"
                          value={traveller.email}
                          onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-black/[0.02] border border-black/10 rounded-xl py-3 pl-12 pr-4 text-brand-black font-semibold focus:outline-none focus:border-brand-red transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-black/40 uppercase mb-2">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30" size={18} />
                        <input 
                          type="tel"
                          value={traveller.phone}
                          onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                          placeholder="10 digit mobile number"
                          className="w-full bg-black/[0.02] border border-black/10 rounded-xl py-3 pl-12 pr-4 text-brand-black font-semibold focus:outline-none focus:border-brand-red transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button 
              onClick={handleAddTraveller}
              className="w-full py-4 border-2 border-dashed border-black/10 rounded-3xl text-brand-black/40 font-black uppercase tracking-widest hover:border-brand-red hover:text-brand-red hover:bg-brand-red/5 transition-all"
            >
              + Add Another Traveller
            </button>

            <div className="flex justify-between items-center mt-8">
              <button onClick={() => navigate(-1)} className="px-6 py-4 font-bold text-brand-black/60 hover:text-brand-black transition-colors flex items-center gap-2">
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                onClick={handleContinue}
                className="px-12 py-4 bg-brand-black text-white rounded-xl font-bold transition-all hover:bg-brand-red hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                Continue to Seats <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Sidebar - Fare Summary */}
          <div className="w-full lg:w-[350px] shrink-0 sticky top-24">
             <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-lg">
                <h3 className="text-xl font-black text-brand-black mb-6">Fare Summary</h3>
                <div className="space-y-4 mb-6 pb-6 border-b border-black/5 text-sm font-bold text-brand-black/60">
                   <div className="flex justify-between">
                      <span>Base Fare</span>
                      <span className="text-brand-black">₹{flight.price}</span>
                   </div>
                   <div className="flex justify-between">
                      <span>Travellers</span>
                      <span className="text-brand-black">{travellers.length} Adult</span>
                   </div>
                   <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span className="text-brand-black">₹0</span>
                   </div>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Total Amount</div>
                      <div className="text-3xl font-black text-brand-black tracking-tighter">
                        ₹{(parseInt(String(flight.price).replace(/,/g, '')) * travellers.length).toLocaleString('en-IN')}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TravellerDetails;

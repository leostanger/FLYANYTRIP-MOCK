import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Coffee, Luggage, ShieldCheck, Check } from 'lucide-react';

const Addons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, fareQuote, travellers, ssrData, ssrSelections } = location.state || {};
  
  // selectedMeals[idx] = { name: 'Standard Meal', price: 450 }
  const existingMeals = ssrSelections?.meals || [];
  const [selectedMeals, setSelectedMeals] = useState(
    Array(travellers?.length || 1).fill(null).map((_, i) => existingMeals[i] || null)
  );
  
  const [selectedBaggage, setSelectedBaggage] = useState(ssrSelections?.baggage || []);
  const [selectedTravellerIndex, setSelectedTravellerIndex] = useState(0);

  if (!flight) return null;

  const handleAddMeal = (mealOption) => {
    const newMeals = [...selectedMeals];
    // Toggle meal if it's already selected
    if (newMeals[selectedTravellerIndex]?.name === mealOption.name) {
      newMeals[selectedTravellerIndex] = null;
    } else {
      newMeals[selectedTravellerIndex] = mealOption;
      
      // Auto-advance to next passenger without a meal
      const nextEmptyIdx = newMeals.findIndex(m => m === null);
      if (nextEmptyIdx !== -1) {
        setSelectedTravellerIndex(nextEmptyIdx);
      }
    }
    setSelectedMeals(newMeals);
  };

  const handleRemoveMeal = (idx) => {
    const newMeals = [...selectedMeals];
    newMeals[idx] = null;
    setSelectedMeals(newMeals);
  };

  const totalMealPrice = selectedMeals.reduce((acc, meal) => acc + (meal?.price || 0), 0);
  const totalBaggagePrice = selectedBaggage.reduce((acc, b) => acc + (b?.price || 0), 0);
  
  const handleContinue = () => {
    navigate('/booking-review', { 
      state: { 
        flight, 
        fareQuote, 
        travellers, 
        ssrSelections: {
          ...ssrSelections,
          meals: selectedMeals, // array of length `travellers.length` (can contain nulls)
          baggage: selectedBaggage
        }
      } 
    });
  };

  return (
    <div className="min-h-screen bg-black/[0.02] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">✓</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Review</span>
          </div>
          <div className="flex-1 h-[2px] bg-brand-red mx-4" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">✓</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Traveller</span>
          </div>
          <div className="flex-1 h-[2px] bg-brand-red mx-4" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">✓</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Seats</span>
          </div>
          <div className="flex-1 h-[2px] bg-brand-red mx-4" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">4</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Add-ons</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Addons Content */}
          <div className="flex-1 w-full">
            <h1 className="text-4xl font-extrabold text-brand-black mb-4 tracking-tight">Enhance your journey</h1>
            <p className="text-brand-black/50 font-medium mb-12">Add extra comfort and security to your flight. Select a passenger on the right to assign meals.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Meal Addon */}
              <div className="bg-white rounded-3xl p-8 border border-brand-red/20 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">Selecting For P{selectedTravellerIndex + 1}</div>
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <Coffee size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-2">In-flight Meal</h3>
                <p className="text-brand-black/60 text-sm mb-6 leading-relaxed">
                  {ssrData?.Meal?.[0]?.length > 0 ? "Choose from available meals for your flight." : "Choose from our curated menu of delicious hot meals and beverages."}
                </p>
                
                {(() => {
                  const currentMeal = selectedMeals[selectedTravellerIndex];
                  const mealOption = ssrData?.Meal?.[0]?.[0] || { name: 'Standard Meal', price: 450 };
                  const isAdded = currentMeal?.name === mealOption.name;

                  return (
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-black text-brand-black text-xl">₹ {mealOption.Price || mealOption.price}</span>
                      <button 
                        onClick={() => handleAddMeal({ name: mealOption.name || mealOption.Code || 'Standard Meal', price: mealOption.Price || mealOption.price })}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${isAdded ? 'bg-green-500 text-white' : 'bg-black/5 text-brand-black hover:bg-brand-red hover:text-white'}`}
                      >
                        {isAdded ? 'Remove' : '+ Add Meal'}
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Excess Baggage (Not passenger-wise yet) */}
              <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Luggage size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-2">Excess Baggage</h3>
                <p className="text-brand-black/60 text-sm mb-6 leading-relaxed">
                   {ssrData?.Baggage?.[0]?.length > 0 ? "Select extra baggage weight for your journey." : "Need more space? Pre-book extra baggage and save up to 20%."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-black text-brand-black text-xl">₹ {ssrData?.Baggage?.[0]?.[0]?.Price || 1200}</span>
                  <button 
                    onClick={() => setSelectedBaggage([...selectedBaggage, ssrData?.Baggage?.[0]?.[0] || { weight: '5KG', price: 1200 }])}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedBaggage.length > 0 ? 'bg-green-500 text-white' : 'bg-black/5 text-brand-black hover:bg-brand-red hover:text-white'}`}
                  >
                    {selectedBaggage.length > 0 ? `Added (${selectedBaggage.length})` : '+ Add 5KG'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-12">
              <button onClick={() => navigate(-1)} className="px-6 py-4 font-bold text-brand-black/60 hover:text-brand-black transition-colors flex items-center gap-2">
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </div>

          {/* Selection Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0 sticky top-24">
             <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-xl">
                <h3 className="text-xl font-black text-brand-black mb-8">Select Passenger</h3>
                <div className="space-y-4 mb-8">
                   {travellers.map((t, idx) => {
                     const isSelected = selectedTravellerIndex === idx;
                     const hasMeal = selectedMeals[idx] !== null;

                     return (
                       <button 
                         key={idx} 
                         onClick={() => setSelectedTravellerIndex(idx)}
                         className={`w-full text-left p-4 rounded-2xl border transition-all 
                           ${isSelected ? 'border-brand-red bg-brand-red/5' : 'border-black/5 bg-black/[0.02] hover:bg-black/5'}
                           ${hasMeal && !isSelected ? 'border-green-100 bg-green-50/30' : ''}`}
                       >
                          <div className="flex justify-between items-center">
                             <div className={`text-sm font-bold ${isSelected ? 'text-brand-red' : 'text-brand-black/60'}`}>
                                Passenger {idx + 1}: {t.firstName} {t.lastName}
                             </div>
                             {hasMeal ? (
                               <div className="text-sm font-black text-green-600 truncate max-w-[120px] text-right">
                                 {selectedMeals[idx].name}
                               </div>
                             ) : (
                               <div className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-brand-red animate-pulse' : 'text-brand-black/30'}`}>
                                 No Meal
                               </div>
                             )}
                          </div>
                       </button>
                     );
                   })}
                </div>

                <div className="bg-black/5 h-[1px] mb-8" />

                <div className="flex justify-between items-end mb-10">
                   <div>
                      <div className="text-[10px] font-black text-brand-black/30 uppercase tracking-widest mb-1">Total Addons Price</div>
                      <div className="text-3xl font-black text-brand-black tracking-tighter">₹{totalMealPrice + totalBaggagePrice}</div>
                   </div>
                </div>

                <button 
                  onClick={handleContinue} 
                  className="w-full bg-brand-black text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-brand-black/20 hover:bg-brand-red hover:shadow-brand-red/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Review & Pay <ArrowRight size={20} />
                </button>
             </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default Addons;

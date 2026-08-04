/**
 * ============================================================================
 * PATH: frontend/src/components/flights/BookingPersonalize.jsx
 * DESCRIPTION: Per-passenger meal preference, extra baggage add-ons, and
 *              travel insurance selector (Step 3).
 * ============================================================================
 */

import React, { useState, useEffect } from "react";
import {
  Utensils, Luggage, Zap, Wifi, ShieldCheck, Check, User, ChevronDown, ChevronUp
} from "lucide-react";

/* --- Default Fallback Meals --- */
const DEFAULT_MEALS = [
  { id: "veg",    label: "Vegetarian", desc: "Rice, Dal, Roti, Sabzi",      price: 299, emoji: "🥗", tag: "Popular",    tagColor: "bg-emerald-100 text-emerald-700", borderSelected: "border-emerald-500" },
  { id: "nonveg", label: "Non-Veg",   desc: "Chicken curry, Rice, Naan",   price: 349, emoji: "🍗", tag: "Chef's Pick", tagColor: "bg-amber-100 text-amber-700",   borderSelected: "border-amber-500"   },
  { id: "vegan",  label: "Vegan",     desc: "No dairy, plant-based",       price: 329, emoji: "🌱", tag: null,          tagColor: "",                              borderSelected: "border-emerald-400" },
  { id: "jain",   label: "Jain",      desc: "No root vegetables",          price: 299, emoji: "🙏", tag: null,          tagColor: "",                              borderSelected: "border-orange-400"  },
  { id: "none",   label: "No Meal",   desc: "Skip in-flight meal",         price: 0,   emoji: "✕",  tag: "Free",        tagColor: "bg-gray-100 text-gray-500",     borderSelected: "border-gray-400"    }
];

/* --- Default Fallback Addons --- */
const DEFAULT_ADDONS = [
  { id: "bag_15",   label: "Extra Baggage — 15 kg", price: 799,  desc: "Add 1 check-in bag (15 kg)",            badge: null         },
  { id: "bag_30",   label: "Extra Baggage — 30 kg", price: 1399, desc: "Add 2 check-in bags (30 kg)",           badge: "Best Value" },
  { id: "priority", label: "Priority Boarding",     price: 299,  desc: "Board first, best overhead bin space",  badge: "Popular"    },
  { id: "wifi",     label: "In-flight Wi-Fi",       price: 499,  desc: "Stay connected during the flight",      badge: null         }
];

export default function BookingPersonalize({ flight, passengers = [], onContinue, onAddonsUpdate }) {
  const [paxMeals, setPaxMeals] = useState(() => {
    const init = {};
    (passengers.length > 0 ? passengers : [{}]).forEach((_, idx) => { init[idx] = "none"; });
    return init;
  });
  const [activePaxIdx, setActivePaxIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isInsuranceAdded, setIsInsuranceAdded] = useState(false);
  const [mealsList, setMealsList] = useState(DEFAULT_MEALS);
  const [addonsList, setAddonsList] = useState(DEFAULT_ADDONS);
  const [isLiveSsr, setIsLiveSsr] = useState(false);

  useEffect(() => {
    const tId = flight?.traceId || flight?.raw?.traceId;
    const rIdx = flight?.resultIndex || flight?.raw?.resultIndex || flight?.id;
    if (tId && rIdx) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      fetch(`${baseUrl}/flights/ssr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traceId: tId, resultIndex: rIdx })
      })
        .then(r => r.json())
        .then(data => {
          const ssrRes = data?.data?.responseData?.Response || data?.data?.Response;
          if (!ssrRes) return;
          let updatedMeals = [...DEFAULT_MEALS];
          let updatedAddons = [...DEFAULT_ADDONS];
          let hasLive = false;
          if (Array.isArray(ssrRes.MealDynamic) && ssrRes.MealDynamic.length > 0) {
            const apiMeals = Array.isArray(ssrRes.MealDynamic[0]) ? ssrRes.MealDynamic[0] : ssrRes.MealDynamic;
            if (apiMeals.length > 0) {
              hasLive = true;
              const mapped = apiMeals.map((m, i) => ({
                id: m.Code || `meal_${i}`, label: m.AirlineDescription || m.Code || `Option ${i + 1}`,
                desc: m.Origin && m.Destination ? `${m.Origin} → ${m.Destination}` : "Pre-order meal",
                price: m.Price || 0, emoji: m.Price === 0 ? "✕" : (i % 2 === 0 ? "🥗" : "🍗"),
                tag: m.Price === 0 ? "Free" : "Live", tagColor: m.Price === 0 ? "bg-gray-100 text-gray-500" : "bg-[#FFF1F2] text-[#F12B19]",
                borderSelected: "border-[#F12B19]"
              }));
              if (mapped.length > 0) updatedMeals = mapped;
            }
          }
          if (Array.isArray(ssrRes.Baggage) && ssrRes.Baggage.length > 0) {
            const apiBag = Array.isArray(ssrRes.Baggage[0]) ? ssrRes.Baggage[0] : ssrRes.Baggage;
            if (apiBag.length > 0) {
              hasLive = true;
              const mapped = apiBag.filter(b => b.Weight > 0 || b.Price > 0).map((b, i) => ({
                id: b.Code || `bag_${b.Weight}_${i}`, label: `Extra Baggage — ${b.Weight || 15} kg`,
                price: b.Price || 799, desc: `Add ${b.Weight || 15} kg check-in baggage`, badge: i === 0 ? "Popular" : i === 1 ? "Best Value" : "Extra"
              }));
              if (mapped.length > 0) updatedAddons = [...mapped, DEFAULT_ADDONS[2], DEFAULT_ADDONS[3]];
            }
          }
          setMealsList(updatedMeals);
          setAddonsList(updatedAddons);
          setIsLiveSsr(hasLive);
        })
        .catch(e => console.warn("SSR notice:", e.message));
    }
  }, [flight]);

  const totalMealCost = (meals) => Object.values(meals).reduce((s, id) => s + (mealsList.find(m => m.id === id)?.price || 0), 0);
  const addonsCost = (addons, ins) => addons.reduce((s, id) => s + (addonsList.find(a => a.id === id)?.price || 0), 0) + (ins ? 149 : 0);

  const pushUpdate = (meals, addons, ins) => {
    if (!onAddonsUpdate) return;
    const mc = totalMealCost(meals);
    const primaryMeal = Object.values(meals).find(m => m !== "none") || "none";

    const mealSelections = Object.keys(meals).map(idxKey => {
      const idx = parseInt(idxKey, 10);
      const mealId = meals[idx];
      const mealObj = mealsList.find(m => m.id === mealId);
      return {
        paxIdx: idx,
        name: mealObj ? mealObj.label : "No Meal",
        price: mealObj ? mealObj.price : 0
      };
    });

    const baggageSelections = [];
    addons.forEach((id) => {
      if (id.startsWith("bag_")) {
        const addonObj = addonsList.find(a => a.id === id);
        let weight = "15 kg";
        if (id.includes("_30")) weight = "30 kg";
        else if (id.includes("_15")) weight = "15 kg";
        else if (id.includes("_")) {
          const parts = id.split("_");
          if (parts[1] && !isNaN(parts[1])) {
            weight = `${parts[1]} kg`;
          }
        }
        baggageSelections.push({
          paxIdx: 0,
          weight: weight,
          price: addonObj ? addonObj.price : 0
        });
      }
    });

    onAddonsUpdate(prev => ({
      ...prev,
      meal: primaryMeal,
      paxMeals: meals,
      mealSelections,
      baggageSelections,
      mealPrice: mc,
      addons,
      insurance: ins,
      totalAdditional: (prev.seatPrice || 0) + mc + addonsCost(addons, ins)
    }));
  };

  const handleMealSelect = (idx, id) => {
    const updated = { ...paxMeals, [idx]: id };
    setPaxMeals(updated);
    pushUpdate(updated, selectedAddons, isInsuranceAdded);
  };

  const handleAddonClick = (id) => {
    const updated = selectedAddons.includes(id) ? selectedAddons.filter(a => a !== id) : [...selectedAddons, id];
    setSelectedAddons(updated);
    pushUpdate(paxMeals, updated, isInsuranceAdded);
  };

  const handleInsuranceClick = () => {
    const updated = !isInsuranceAdded;
    setIsInsuranceAdded(updated);
    pushUpdate(paxMeals, selectedAddons, updated);
  };

  const paxList = passengers.length > 0 ? passengers : [{ id: 1, title: "Mr.", firstName: "", type: "Adult" }];
  const mealCount = Object.values(paxMeals).filter(m => m !== "none").length;
  const mealTotal = totalMealCost(paxMeals);

  const addonIcons = { bag_15: <Luggage size={18} className="text-[#F12B19]" />, bag_30: <Luggage size={18} className="text-[#F12B19]" />, priority: <Zap size={18} className="text-[#F12B19]" />, wifi: <Wifi size={18} className="text-[#F12B19]" /> };

  return (
    <div className="space-y-5 font-['Quicksand'] text-left select-none">

      {/* 1. PER-PASSENGER MEAL PREFERENCE */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Header */}
        <div className="p-5 md:p-6 pb-4 flex items-center justify-between border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] flex items-center justify-center flex-shrink-0">
              <Utensils size={18} className="text-[#F12B19]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A] leading-tight">Meal Preference</h3>
                <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${isLiveSsr ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                  {isLiveSsr ? "🟢 Live Meals" : "Standard Meals"}
                </span>
              </div>
              <p className="font-['Quicksand'] text-[12px] text-[#999999] font-medium">Select individually per passenger &bull; Served on board</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-bold text-[#F12B19] bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-[#FDE8E8]">
              {mealCount > 0 ? `${mealCount} meal${mealCount > 1 ? "s" : ""} selected` : "No meals"}
            </span>
            {mealTotal > 0 && <span className="text-[11px] font-bold text-emerald-600">+₹{mealTotal.toLocaleString("en-IN")}</span>}
          </div>
        </div>

        {/* Per-Passenger Accordion */}
        <div className="divide-y divide-[#f5f5f5]">
          {paxList.map((pax, idx) => {
            const mealId = paxMeals[idx] ?? "none";
            const mealObj = mealsList.find(m => m.id === mealId);
            const isOpen = activePaxIdx === idx;
            const paxName = pax.firstName ? `${pax.title || ""} ${pax.firstName} ${pax.lastName || ""}`.trim() : `Passenger ${idx + 1}`;

            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => setActivePaxIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFF1F2] text-[#F12B19] flex items-center justify-center flex-shrink-0">
                      <User size={14} />
                    </div>
                    <div className="text-left">
                      <span className="font-['Satoshi'] font-bold text-[13.5px] text-[#1A1A1A]">{paxName}</span>
                      <span className="ml-2 text-[11px] font-semibold text-[#999] bg-gray-100 px-2 py-0.5 rounded-full">{pax.type || "Adult"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {mealId !== "none" ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} strokeWidth={3} />
                        {mealObj?.emoji} {mealObj?.label}{mealObj?.price > 0 ? ` (+₹${mealObj.price})` : ""}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#999] font-medium">No meal</span>
                    )}
                    {isOpen ? <ChevronUp size={15} className="text-[#999]" /> : <ChevronDown size={15} className="text-[#999]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 bg-[#FAFAFA]">
                    <p className="text-[11.5px] text-[#999] font-medium mb-3">
                      Choose a meal for <span className="font-bold text-[#1A1A1A]">{paxName}</span>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                      {mealsList.map(meal => {
                        const isSel = mealId === meal.id;
                        return (
                          <button
                            key={meal.id}
                            type="button"
                            onClick={() => handleMealSelect(idx, meal.id)}
                            className={`relative rounded-xl p-3.5 text-left cursor-pointer transition-all flex flex-col gap-1.5 border-[1.5px] ${isSel ? `${meal.borderSelected || "border-[#F12B19]"} bg-[#FFFBFB] shadow-sm` : "border-[#EAEAEA] bg-white hover:border-gray-300"}`}
                          >
                            {isSel && (
                              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#F12B19] flex items-center justify-center">
                                <Check size={9} strokeWidth={3} className="text-white" />
                              </div>
                            )}
                            <div className="text-[22px] leading-none">{meal.emoji}</div>
                            <div>
                              <span className="font-['Satoshi'] font-bold text-[12.5px] text-[#1A1A1A] leading-tight block">{meal.label}</span>
                              <span className="font-['Quicksand'] text-[10px] text-[#999] font-medium block mt-0.5 leading-tight">{meal.desc}</span>
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-1 border-t border-[#F5F5F5]">
                              <span className="font-['Satoshi'] font-bold text-[12px] text-[#1A1A1A]">{meal.price === 0 ? "Free" : `₹${meal.price.toLocaleString("en-IN")}`}</span>
                              {meal.tag && <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded ${meal.tagColor}`}>{meal.tag}</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {mealCount > 0 && (
          <div className="px-5 py-3 bg-[#F8FFF9] border-t border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-emerald-700 font-semibold">
              <Check size={14} strokeWidth={2.5} className="text-emerald-500" />
              {mealCount} meal{mealCount > 1 ? "s" : ""} across {paxList.length} passenger{paxList.length > 1 ? "s" : ""}
            </div>
            {mealTotal > 0 && <span className="font-['Satoshi'] font-bold text-[13px] text-emerald-700">Total: +₹{mealTotal.toLocaleString("en-IN")}</span>}
          </div>
        )}
      </div>

      {/* 2. ADD-ON SERVICES */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] flex items-center justify-center flex-shrink-0"><Luggage size={18} className="text-[#F12B19]" /></div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A] leading-tight">Add-on Services</h3>
              <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border ${isLiveSsr ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {isLiveSsr ? "🟢 Live Baggage" : "Standard Add-ons"}
              </span>
            </div>
            <p className="font-['Quicksand'] text-[12px] text-[#999] font-medium">Enhance your flight experience</p>
          </div>
        </div>
        <div className="space-y-3">
          {addonsList.map(addon => {
            const isAdded = selectedAddons.includes(addon.id);
            return (
              <div key={addon.id} className={`border rounded-xl p-4 flex items-center justify-between gap-4 transition-all ${isAdded ? "border-emerald-200 bg-emerald-50/20" : "border-[#EAEAEA] bg-white"}`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] flex items-center justify-center flex-shrink-0">{addonIcons[addon.id] || addon.icon || <Luggage size={18} className="text-[#F12B19]" />}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Satoshi'] font-bold text-[13.5px] text-[#1A1A1A]">{addon.label}</span>
                      {addon.badge && <span className="text-[9px] font-bold uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{addon.badge}</span>}
                    </div>
                    <p className="font-['Quicksand'] text-[11.5px] text-[#999] font-medium mt-0.5">{addon.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-['Satoshi'] font-bold text-[15px] text-[#1A1A1A]">+₹{addon.price.toLocaleString("en-IN")}</span>
                  <button type="button" onClick={() => handleAddonClick(addon.id)}
                    className={`font-['Quicksand'] font-bold text-[12px] px-4 py-2 rounded-lg transition-all cursor-pointer min-w-[72px] text-center ${isAdded ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "border border-[#F12B19] text-[#F12B19] hover:bg-[#FFF1F2]"}`}>
                    {isAdded ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TRAVEL INSURANCE */}
      <div className="w-full bg-white border border-[#eaeaea] rounded-[13.88px] p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0"><ShieldCheck size={20} className="text-emerald-600" /></div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-['Satoshi'] font-bold text-[14.5px] text-[#1A1A1A]">Travel Insurance</span>
                <span className="bg-emerald-100 text-emerald-700 text-[9.5px] font-bold uppercase px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="font-['Quicksand'] text-[11.5px] text-[#999] font-medium">₹5L coverage &middot; Trip cancellation &middot; Medical &middot; Baggage loss</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-['Satoshi'] font-bold text-[17px] text-[#1A1A1A]">₹149</span>
            <button type="button" onClick={handleInsuranceClick}
              className={`font-['Quicksand'] font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all cursor-pointer ${isInsuranceAdded ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-[#F12B19] hover:bg-red-700 text-white"}`}>
              {isInsuranceAdded ? "✓ Added" : "+ Add"}
            </button>
          </div>
        </div>
      </div>

      {/* Continue CTA */}
      <button type="button" onClick={onContinue}
        className="w-full bg-[#F12B19] hover:bg-red-700 text-white font-['Quicksand'] font-bold text-[15px] py-3.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-2">
        <span>Proceed to Payment</span>
        <span className="text-base leading-none">&rarr;</span>
      </button>

    </div>
  );
}

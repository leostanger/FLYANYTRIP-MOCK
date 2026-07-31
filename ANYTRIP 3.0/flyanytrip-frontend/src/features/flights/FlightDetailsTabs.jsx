import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Luggage, ShieldAlert, Clock, Info, Loader2 } from 'lucide-react';
import api from '../../services/api';

const FlightDetailsTabs = ({ flight, traceId, resultIndex }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [fareRules, setFareRules] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'rules' && !fareRules) {
      fetchFareRules();
    }
  }, [activeTab]);

  const fetchFareRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/flights/fare-rule', {
        traceId,
        resultIndex,
        tokenId: flight.tokenId
      });
      
      if (response.data.success) {
        setFareRules(response.data.data);
      } else {
        setError('Failed to load fare rules');
      }
    } catch (err) {
      console.error('Error fetching fare rules:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'details', label: 'Flight Details', icon: <Plane size={14} /> },
    { id: 'rules', label: 'Fare Rules', icon: <ShieldAlert size={14} /> },
    { id: 'baggage', label: 'Baggage', icon: <Luggage size={14} /> },
  ];

  const segments = flight.raw?.Segments?.[0] || [];

  return (
    <div className="bg-white border-t border-black/5">
      {/* Tab Headers */}
      <div className="flex border-b border-black/5 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-[13px] font-bold transition-all relative ${
              activeTab === tab.id ? 'text-brand-red' : 'text-brand-black/40 hover:text-brand-black'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {segments.map((seg, idx) => (
                <div key={`segment-${idx}-${seg.Airline?.FlightNumber || 'seg'}`} className="relative">
                  <div className="flex gap-8">
                    {/* Time & Points */}
                    <div className="flex flex-col gap-12 py-2">
                      <div className="text-right">
                        <div className="text-lg font-black text-brand-black">{new Date(seg.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-[11px] font-bold text-brand-black/40">{new Date(seg.Origin.DepTime).toLocaleDateString([], { day: '2-digit', month: 'short' })}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-brand-black">{new Date(seg.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-[11px] font-bold text-brand-black/40">{new Date(seg.Destination.ArrTime).toLocaleDateString([], { day: '2-digit', month: 'short' })}</div>
                      </div>
                    </div>

                    {/* Timeline Graphic */}
                    <div className="flex flex-col items-center py-2">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-red bg-white" />
                      <div className="flex-1 w-[2px] bg-dashed-line my-1" />
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-12">
                      <div>
                        <div className="text-base font-bold text-brand-black">{seg.Origin.Airport.CityName} ({seg.Origin.Airport.AirportCode})</div>
                        <div className="text-[12px] font-medium text-brand-black/60">
                          {seg.Origin.Airport.AirportName}, Terminal {seg.Origin.Airport.Terminal || 'T1'}
                        </div>
                      </div>

                      <div>
                        <div className="text-base font-bold text-brand-black">{seg.Destination.Airport.CityName} ({seg.Destination.Airport.AirportCode})</div>
                        <div className="text-[12px] font-medium text-brand-black/60">
                          {seg.Destination.Airport.AirportName}, Terminal {seg.Destination.Airport.Terminal || 'T1'}
                        </div>
                      </div>
                    </div>

                    {/* Flight Info Box */}
                    <div className="w-64 bg-black/[0.02] rounded-2xl p-4 self-center">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-black/5">
                          <img 
                            src={`/assets/airlines/${seg.Airline.AirlineCode}.png`} 
                            alt={seg.Airline.AirlineName}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/24'; }}
                          />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-brand-black">{seg.Airline.AirlineName}</div>
                          <div className="text-[10px] font-bold text-brand-black/40 uppercase">{seg.Airline.AirlineCode} {seg.Airline.FlightNumber}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-brand-black/40">Duration</span>
                          <span className="text-brand-black">{Math.floor(seg.Duration/60)}h {seg.Duration%60}m</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-brand-black/40">Class</span>
                          <span className="text-brand-black">{seg.CabinClass || 'Economy'}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-brand-black/40">Aircraft</span>
                          <span className="text-brand-black">{seg.Craft || 'Boeing 737'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layover Info */}
                  {idx < segments.length - 1 && (
                    <div className="my-6 ml-24 mr-6 bg-amber-50 rounded-xl px-4 py-2 flex items-center gap-3 border border-amber-100">
                      <Clock size={14} className="text-amber-600" />
                      <span className="text-[12px] font-bold text-amber-700">
                        {(() => {
                          const arr = new Date(seg.Destination.ArrTime);
                          const dep = new Date(segments[idx + 1].Origin.DepTime);
                          const diff = Math.floor((dep - arr) / (1000 * 60));
                          return `Layover in ${seg.Destination.Airport.CityName} for ${Math.floor(diff/60)}h ${diff%60}m`;
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin text-brand-red mb-4" size={32} />
                  <div className="text-[13px] font-bold text-brand-black/40 uppercase tracking-widest">Fetching Fare Rules...</div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3">
                  <Info size={18} />
                  {error}
                  <button onClick={fetchFareRules} className="ml-auto underline">Retry</button>
                </div>
              ) : fareRules ? (
                <div className="space-y-6">
                   {(() => {
                      const rules = fareRules?.responseData?.Response?.FareRules || fareRules?.Response?.FareRules || fareRules?.FareRules || [];
                      if (rules.length === 0) return <div className="text-center py-8 text-brand-black/40 font-bold">No specific fare rules available for this flight.</div>;
                      
                      return rules.map((rule, idx) => (
                        <div key={idx} className="border border-black/5 rounded-2xl overflow-hidden bg-white">
                           <div className="bg-black/[0.02] px-6 py-4 border-b border-black/5 flex justify-between items-center">
                              <h4 className="text-[14px] font-black text-brand-black uppercase tracking-tight">
                                {rule.Origin} → {rule.Destination}
                              </h4>
                              <span className="text-[11px] font-bold text-brand-black/40 uppercase tracking-widest">{rule.Airline || flight.airline}</span>
                           </div>
                           <div className="p-6">
                              <div 
                                className="text-[13px] font-medium text-brand-black/70 leading-relaxed max-h-[300px] overflow-y-auto pr-4 custom-scrollbar"
                                dangerouslySetInnerHTML={{ __html: rule.FareRuleDetail || 'No detailed rules provided.' }}
                              />
                           </div>
                        </div>
                      ));
                   })()}

                   <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                      <div className="flex items-center gap-3 mb-3">
                         <ShieldAlert size={18} className="text-amber-600" />
                         <span className="text-[14px] font-black text-amber-800">Important Policy Summary</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-amber-900/60">Cancellation</span>
                            <span className="text-amber-900">Refundable (Fee applies)</span>
                         </div>
                         <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-amber-900/60">Date Change</span>
                            <span className="text-amber-900">Allowed (Fee + Fare Diff)</span>
                         </div>
                         <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-amber-900/60">No Show</span>
                            <span className="text-amber-900">Non-Refundable</span>
                         </div>
                         <div className="flex justify-between text-[12px] font-bold">
                            <span className="text-amber-900/60">Service Fee</span>
                            <span className="text-amber-900">₹300 (Flyanytrip)</span>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="text-center py-12 text-brand-black/40 font-bold">
                   Select the Fare Rules tab to fetch latest policies.
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'baggage' && (
            <motion.div
              key="baggage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex items-start gap-4 p-6 rounded-2xl border border-black/5 bg-white shadow-sm">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Luggage size={24} />
                 </div>
                 <div>
                    <div className="text-[11px] font-black text-brand-black/40 uppercase tracking-widest mb-1">Check-in Baggage</div>
                    <div className="text-xl font-black text-brand-black mb-1">{flight.raw?.Fare?.Baggage || '15 KGS'}</div>
                    <div className="text-[12px] font-bold text-brand-black/60">(per adult)</div>
                 </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl border border-black/5 bg-white shadow-sm">
                 <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Plane size={24} className="rotate-45" />
                 </div>
                 <div>
                    <div className="text-[11px] font-black text-brand-black/40 uppercase tracking-widest mb-1">Cabin Baggage</div>
                    <div className="text-xl font-black text-brand-black mb-1">7 KGS</div>
                    <div className="text-[12px] font-bold text-brand-black/60">(per adult)</div>
                 </div>
              </div>
              
              <div className="md:col-span-2 flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-[12px] font-bold text-amber-700">
                 <Info size={16} />
                 Extra baggage charges may apply as per airline policy.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlightDetailsTabs;

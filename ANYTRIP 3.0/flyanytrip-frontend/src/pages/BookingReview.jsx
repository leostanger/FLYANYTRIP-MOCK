import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plane, Calendar, Clock, CheckCircle2, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import api from '../services/api';

const BookingReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight } = location.state || {};

  const [fareQuote, setFareQuote] = useState(null);
  const [fareRule, setFareRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!flight) {
      navigate('/');
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [quoteRes, ruleRes] = await Promise.all([
          api.post('/api/flights/fare-quote', { traceId: flight.traceId, resultIndex: flight.resultIndex }),
          api.post('/api/flights/fare-rule', { traceId: flight.traceId, resultIndex: flight.resultIndex })
        ]);

        if (quoteRes.data.success) {
          const quoteData = quoteRes.data.data?.Response?.Results || quoteRes.data.data?.responseData?.Response?.Results;
          setFareQuote(quoteData);
        }
        if (ruleRes.data.success) {
          const ruleData = ruleRes.data.data?.Response?.FareRules || ruleRes.data.data?.responseData?.Response?.FareRules;
          setFareRule(ruleData);
        }
      } catch (err) {
        console.error("Error fetching fare details:", err);
        setError("Failed to fetch latest fare rules and quote.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [flight, navigate]);

  if (!flight) return null;

  const fareData = fareQuote?.Fare || flight.raw?.Fare || {};
  const publishedFare = fareData.PublishedFare || parseInt(String(flight.price).replace(/,/g, ''));
  const baseFare = fareData.BaseFare || 0;
  const tax = fareData.Tax || 0;
  const otherCharges = fareData.OtherCharges || 0;
  const discount = fareData.Discount || 0;

  const formatPrice = (p) => Math.ceil(p || 0).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-black/[0.02] py-12">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold shadow-lg shadow-brand-red/30">1</div>
            <span className="text-xs font-bold text-brand-black uppercase tracking-widest">Review</span>
          </div>
          <div className="flex-1 h-[2px] bg-black/10 mx-4" />
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-10 h-10 rounded-full bg-white border-2 border-black/20 text-brand-black flex items-center justify-center font-bold">2</div>
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

        <h1 className="text-4xl font-extrabold text-brand-black mb-8 tracking-tight">Review Your Flight</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content - Boarding Pass Style */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            <div className="flex flex-col drop-shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
              {/* Boarding Pass Top / Flight Details */}
              <div className="bg-white rounded-t-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-red/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-black text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2">
                      <Plane size={14} /> E-TICKET
                    </div>
                  </div>
                  {flight.airline && (
                    <div className="text-right">
                      <div className="font-black text-brand-black text-xl tracking-tight">{flight.airline}</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center relative z-10">
                  {/* Origin */}
                  <div className="text-left w-1/3">
                    <div className="text-5xl font-black text-brand-black tracking-tighter mb-1">{flight.from}</div>
                    <div className="text-sm font-bold text-brand-black/50 uppercase tracking-widest">{flight.time?.split(' ')[0] || flight.time}</div>
                    <div className="text-xs font-semibold text-brand-black/40 mt-3 flex items-center gap-1.5"><Calendar size={12} /> {flight.time}</div>
                  </div>

                  {/* Flight Path */}
                  <div className="flex flex-col items-center justify-center flex-1 mx-4 relative">
                    <div className="text-[10px] font-black text-brand-black/40 uppercase tracking-widest mb-2 bg-black/5 px-3 py-1 rounded-full">
                      {flight.dur} • {flight.layover || 'DIRECT'}
                    </div>
                    <div className="w-full flex items-center relative">
                      <div className="w-3 h-3 rounded-full border-2 border-brand-red bg-white z-10"></div>
                      <div className="flex-1 h-[2px] bg-gradient-to-r from-brand-red/20 via-brand-red to-brand-red/20"></div>
                      <Plane size={24} className="text-brand-red absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 bg-white px-1" />
                      <div className="w-3 h-3 rounded-full border-2 border-brand-black bg-white z-10"></div>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="text-right w-1/3">
                    <div className="text-5xl font-black text-brand-black tracking-tighter mb-1">{flight.to}</div>
                    <div className="text-sm font-bold text-brand-black/50 uppercase tracking-widest">{flight.arrival?.split(' ')[0] || flight.arrival}</div>
                    <div className="text-xs font-semibold text-brand-black/40 mt-3 flex items-center justify-end gap-1.5"><Calendar size={12} /> {flight.arrival}</div>
                  </div>
                </div>
              </div>

              {/* Boarding Pass Divider with Cutouts */}
              <div className="bg-white relative h-8 flex items-center justify-between">
                <div className="w-6 h-8 bg-[#f8f9fa] rounded-r-full absolute left-0 shadow-inner"></div>
                <div className="flex-1 border-t-2 border-dashed border-black/10 mx-6"></div>
                <div className="w-6 h-8 bg-[#f8f9fa] rounded-l-full absolute right-0 shadow-inner"></div>
              </div>

              {/* Boarding Pass Bottom / Baggage & Extras */}
              <div className="bg-white rounded-b-3xl p-8 relative flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-brand-black/40 uppercase tracking-widest mb-3">Included Baggage</h4>
                  <div className="flex items-center gap-6">
                    {(() => {
                      const displaySegments = fareQuote?.Segments || flight.raw?.Segments;
                      const firstSegDetails = displaySegments?.[0]?.[0];
                      if (firstSegDetails?.Baggage) {
                        return (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-brand-black"><CheckCircle2 size={18} /></div>
                              <div>
                                <div className="text-xs text-brand-black/50 font-semibold">Check-in</div>
                                <div className="font-bold text-brand-black">{firstSegDetails.Baggage}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-brand-black"><CheckCircle2 size={18} /></div>
                              <div>
                                <div className="text-xs text-brand-black/50 font-semibold">Cabin</div>
                                <div className="font-bold text-brand-black">{firstSegDetails.CabinBaggage || '7kg'}</div>
                              </div>
                            </div>
                          </>
                        );
                      }
                      return (
                        <div className="text-sm font-bold text-brand-black">Standard Allowance included</div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Decorative Barcode */}
                <div className="hidden md:flex flex-col items-end opacity-20">
                  <div className="h-10 w-32 border-l-4 border-r-2 border-brand-black flex justify-between">
                    <div className="w-1 bg-brand-black h-full mx-1"></div>
                    <div className="w-2 bg-brand-black h-full mx-0.5"></div>
                    <div className="w-0.5 bg-brand-black h-full mx-1"></div>
                    <div className="w-1.5 bg-brand-black h-full mx-1"></div>
                    <div className="w-1 bg-brand-black h-full mx-0.5"></div>
                    <div className="w-3 bg-brand-black h-full mx-1"></div>
                  </div>
                  <div className="text-[8px] tracking-[0.3em] font-mono mt-1 font-bold text-brand-black">FN-893021X</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Sleek Glassmorphism Fare Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:sticky top-24">
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/10 rounded-[2rem] pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-brand-black tracking-tight">Fare Summary</h3>
                  <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                
                {loading ? (
                  <div className="animate-pulse space-y-5 mb-8">
                    <div className="h-4 bg-black/5 rounded w-full"></div>
                    <div className="h-4 bg-black/5 rounded w-full"></div>
                    <div className="h-4 bg-black/5 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5 mb-8 text-sm font-bold text-brand-black/60">
                    <div className="flex justify-between items-center group">
                      <span className="group-hover:text-brand-black transition-colors">Base Fare</span>
                      <span className="text-brand-black font-black text-base">₹{formatPrice(baseFare)}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="group-hover:text-brand-black transition-colors">Taxes & Surcharges</span>
                      <span className="text-brand-black font-black text-base">₹{formatPrice(tax + otherCharges)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-xl">
                        <span>Special Discount</span>
                        <span className="font-black">- ₹{formatPrice(discount)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent mb-8"></div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-xs font-bold text-brand-black/40 uppercase tracking-widest mb-1">Total Payable</div>
                    <div className="text-4xl font-black text-brand-black tracking-tighter">₹{formatPrice(publishedFare)}</div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/traveller-details', { state: { flight, fareQuote } })}
                  disabled={loading}
                  className={`w-full h-16 rounded-2xl font-extrabold text-lg transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden ${loading ? 'bg-black/5 text-black/30 cursor-not-allowed' : 'bg-brand-black text-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {loading ? 'Fetching Fares...' : 'Proceed to Booking'} 
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fare Rules - Full Width */}
        <div className="mt-8">
          {fareRule && (
            <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Info size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-black">Fare Rules</h3>
              </div>
              <div className="text-base text-brand-black/80 space-y-6">
                {Array.isArray(fareRule) ? fareRule
                  .filter(rule => {
                    const detail = rule.FareRuleDetail || '';
                    return !detail.toLowerCase().includes('refer above');
                  })
                  .map((rule, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/5">
                      <div className="text-lg font-bold text-brand-black">{rule.Origin} - {rule.Destination}</div>
                      <div className="text-sm font-bold text-brand-black/60 bg-black/5 px-3 py-1 rounded-lg">Airline: {rule.Airline}</div>
                    </div>
                    <div 
                      dangerouslySetInnerHTML={{ __html: rule.FareRuleDetail }} 
                      className="fare-rule-html text-xs md:text-sm text-brand-black/80 leading-relaxed whitespace-pre-wrap font-mono bg-[#f8f9fa] p-4 rounded-xl border border-black/5 max-h-[500px] overflow-y-auto" 
                    />
                  </div>
                )) : (
                  <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm">
                    <div 
                      dangerouslySetInnerHTML={{ __html: fareRule.FareRuleDetail || JSON.stringify(fareRule, null, 2) }} 
                      className="fare-rule-html text-xs md:text-sm text-brand-black/80 leading-relaxed whitespace-pre-wrap font-mono bg-[#f8f9fa] p-4 rounded-xl border border-black/5 max-h-[500px] overflow-y-auto" 
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {loading && !fareRule && (
            <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm animate-pulse">
              <div className="h-6 bg-black/10 rounded w-1/3 mb-4"></div>
              <div className="h-20 bg-black/5 rounded w-full"></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingReview;

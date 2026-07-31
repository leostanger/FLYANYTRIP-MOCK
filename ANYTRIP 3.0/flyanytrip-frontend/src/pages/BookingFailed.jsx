import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, AlertTriangle, RefreshCw, Home, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = location.state || {};

  return (
    <div className="min-h-screen bg-[#FFF5F5] py-20 px-6">
      <div className="max-w-[600px] mx-auto">
        
        <div className="bg-white rounded-[40px] p-12 border border-red-100 shadow-2xl text-center relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <XCircle size={48} strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-4xl font-black text-brand-black mb-4 tracking-tight">Booking Failed</h1>
          <p className="text-brand-black/50 font-medium mb-8 text-lg">
            We're sorry, but we couldn't confirm your booking. {error || "Your payment was processed, but the airline rejected the seat request."}
          </p>

          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 mb-8 text-left">
             <div className="flex gap-4">
                <AlertTriangle className="text-red-500 shrink-0" size={24} />
                <div>
                   <h4 className="font-black text-red-900 mb-1 uppercase tracking-tight text-sm">Next Steps:</h4>
                   <p className="text-red-800/70 text-sm font-bold">
                      If your money was deducted, don't worry. It will be automatically refunded within 5-7 business days. 
                      You can also try booking another flight.
                   </p>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/results')}
              className="w-full bg-brand-red text-white h-16 rounded-3xl font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
              <RefreshCw size={20} /> Try New Search
            </button>
            <div className="flex gap-4">
               <button 
                 onClick={() => navigate('/')}
                 className="flex-1 bg-white text-brand-black border border-black/10 h-16 rounded-3xl font-black uppercase tracking-widest transition-all hover:bg-black/[0.02] active:scale-95 flex items-center justify-center gap-3"
               >
                 <Home size={20} /> Home
               </button>
               <button 
                 className="flex-1 bg-brand-black text-white h-16 rounded-3xl font-black uppercase tracking-widest transition-all hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
               >
                 <PhoneCall size={20} /> Support
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingFailed;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, Phone, Building2 } from 'lucide-react';

const HotelBookingFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || 'Your hotel booking could not be completed.';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-2xl text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6"
          >
            <XCircle size={48} className="text-red-500" />
          </motion.div>

          <h1 className="text-2xl font-black text-brand-black mb-2">Booking Failed</h1>
          <p className="text-sm text-black/50 font-medium mb-6 leading-relaxed">{error}</p>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">What to do next?</p>
            <ul className="text-xs text-amber-700 space-y-1.5 font-medium">
              <li>• No money has been deducted from your account</li>
              <li>• Try booking again with the same or different room</li>
              <li>• Contact our support if the problem persists</li>
            </ul>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-2)}
              className="w-full bg-brand-red text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-red/25 hover:bg-red-700 transition-colors"
            >
              <RefreshCw size={18} /> Try Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/hotels')}
              className="w-full bg-white border border-black/10 text-brand-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:border-brand-red/30 transition-colors"
            >
              <Building2 size={18} /> Search Hotels Again
            </motion.button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-sm text-black/40 font-bold hover:text-brand-black transition-colors flex items-center justify-center gap-2 py-2"
            >
              <Home size={14} /> Back to Home
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-black/5 flex items-center justify-center gap-2 text-xs text-black/30">
            <Phone size={12} />
            <span>Need help? Call <span className="font-bold text-black/50">+91-XXXX-XXXXXX</span></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HotelBookingFailed;

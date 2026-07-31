import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, Tag, AlertCircle, Calendar, X } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const Notifications = () => {
  const [selectedNotif, setSelectedNotif] = useState(null);

  const notifications = [
    {
      id: 1,
      title: 'Flight Delayed',
      message: 'Your flight B123456 from Mumbai to Dubai has been delayed by 30 minutes.',
      time: '2 hours ago',
      type: 'alert',
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/5'
    },
    {
      id: 2,
      title: 'Exclusive Offer!',
      message: 'Get up to 20% off on your next hotel booking in Dubai. Use code DUBAI20.',
      time: '5 hours ago',
      type: 'promo',
      icon: Tag,
      color: 'text-brand-red',
      bg: 'bg-brand-red/5'
    },
    {
      id: 3,
      title: 'Booking Confirmed',
      message: 'Your booking B123456 has been successfully confirmed. Have a great trip!',
      time: '1 day ago',
      type: 'info',
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/5'
    }
  ];

  return (
    <DashboardLayout 
      title="Notifications" 
      subtitle="Stay updated with your travel alerts"
      icon={Bell}
    >
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} onClick={() => setSelectedNotif(notif)} className="cursor-pointer p-6 bg-black/[0.02] border border-black/5 rounded-[32px] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
            <div className="flex gap-6">
              <div className={`w-14 h-14 rounded-2xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110`}>
                <notif.icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h3 className="text-[15px] font-black text-brand-black tracking-tight">{notif.title}</h3>
                  <div className="flex items-center gap-1.5 text-brand-black/30">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{notif.time}</span>
                  </div>
                </div>
                <p className="text-[13px] font-bold text-brand-black/50 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-black/[0.03] rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell size={32} className="text-brand-black/20" />
            </div>
            <h3 className="text-xl font-black text-brand-black mb-2">No notifications</h3>
            <p className="text-brand-black/40 font-bold text-sm">We'll notify you when something important happens.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedNotif && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotif(null)}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-lg w-full z-10 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedNotif(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/5 hover:bg-brand-red/10 hover:text-brand-red rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>

              <div className={`w-20 h-20 rounded-[24px] ${selectedNotif.bg} ${selectedNotif.color} flex items-center justify-center mb-8`}>
                <selectedNotif.icon size={36} />
              </div>
              
              <div className="flex items-center gap-2 text-brand-black/40 mb-3">
                <Calendar size={14} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{selectedNotif.time}</span>
              </div>
              
              <h2 className="text-2xl font-black text-brand-black mb-4 tracking-tight">{selectedNotif.title}</h2>
              <p className="text-[15px] font-medium text-brand-black/60 leading-relaxed mb-10">
                {selectedNotif.message}
              </p>

              <button 
                onClick={() => setSelectedNotif(null)}
                className="w-full h-14 bg-brand-black hover:bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl shadow-black/20 transition-all duration-300"
              >
                Acknowledge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Notifications;


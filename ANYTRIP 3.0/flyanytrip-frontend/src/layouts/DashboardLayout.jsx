import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Shield, Bell, CheckCircle2, 
  LogOut, ChevronRight, Camera, Users, Plane
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title, subtitle, icon: TitleIcon }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User, path: '/profile' },
    { id: 'bookings', label: 'My Bookings', icon: CheckCircle2, path: '/my-bookings' },
    { id: 'cotravellers', label: user?.type === 'business' ? 'Travellers' : 'Co-Travellers', icon: Users, path: '/dashboard/co-travellers' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
    { id: 'security', label: 'Security', icon: Shield, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden pt-32 pb-20 px-4 md:px-8">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-red/10 blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none mix-blend-multiply" />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 relative z-10">
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-red/10 to-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-6 group/avatar">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-red to-[#D4101A] text-white flex items-center justify-center text-3xl font-black shadow-[0_10px_40px_rgba(230,30,42,0.3)] uppercase relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 blur-md rounded-full translate-y-full group-hover/avatar:translate-y-0 transition-transform duration-500 z-20" />
                  {avatarUrl ? (
                    <motion.img 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                      src={avatarUrl} alt="Profile" 
                      className="w-full h-full object-cover relative z-10" 
                    />
                  ) : (
                    <span className="relative z-10 flex items-center justify-center"><Plane size={40} strokeWidth={2.5} className="transform -rotate-12" /></span>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-black hover:text-brand-red hover:scale-110 transition-all duration-300 border border-black/5 z-30"
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <h2 className="text-xl font-black text-brand-black mb-1 tracking-tight">
                {user?.name || 'Traveler'}
              </h2>
              <div className="px-3 py-1 bg-brand-red/10 rounded-full inline-flex items-center mt-2">
                <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest">
                  {user?.type === 'business' ? 'Business Partner' : 'Personal Account'}
                </span>
              </div>
            </div>

            <div className="mt-10 space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                      isActive 
                      ? 'bg-brand-black text-white shadow-xl shadow-brand-black/20' 
                      : 'text-brand-black/60 hover:bg-black/5 hover:text-brand-black'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={18} className={isActive ? 'text-white' : 'text-brand-black/40 group-hover:text-brand-black transition-colors'} />
                      <span className="text-[12px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-black/5">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-brand-red bg-brand-red/5 hover:bg-brand-red hover:text-white transition-all duration-300 group"
              >
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[12px] font-black uppercase tracking-widest">Secure Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-brand-black tracking-tight mb-3">{title}</h1>
                <p className="text-brand-black/40 font-bold text-[11px] md:text-[12px] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand-red" />
                  {subtitle}
                </p>
              </div>
              {TitleIcon && (
                <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-brand-red/10 to-orange-500/10 rounded-full items-center justify-center text-brand-red shadow-[0_0_20px_rgba(230,30,42,0.1)]">
                  <TitleIcon size={28} />
                </div>
              )}
            </div>

            {children}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;

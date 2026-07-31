import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Smartphone, Mail, Eye, X, Laptop, Check } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

const Settings = () => {
  const [activeModal, setActiveModal] = useState(null); // 'password', '2fa', 'sessions'
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [securityScore, setSecurityScore] = useState(60);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro', location: 'Mumbai, India', time: 'Active now', current: true },
    { id: 2, device: 'iPhone 13', location: 'Delhi, India', time: 'Last active 2 hours ago', current: false }
  ]);

  useEffect(() => {
    let score = 40; // Base score
    if (twoFactorEnabled) score += 30;
    if (passwordUpdated) score += 30;
    setSecurityScore(score);
  }, [twoFactorEnabled, passwordUpdated]);

  const securityItems = [
    {
      id: 'password',
      title: 'Password',
      desc: passwordUpdated ? 'Password updated recently' : 'Update your login password regularly for better security',
      icon: Key,
      action: passwordUpdated ? 'Update Again' : 'Change Password',
      status: passwordUpdated ? 'text-green-500' : 'text-brand-red'
    },
    {
      id: '2fa',
      title: 'Two-Factor Authentication',
      desc: twoFactorEnabled ? '2FA is currently enabled for your account' : 'Add an extra layer of security to your account',
      icon: Smartphone,
      action: twoFactorEnabled ? 'Disable' : 'Enable',
      status: twoFactorEnabled ? 'text-green-500' : 'text-brand-red'
    },
    {
      id: 'sessions',
      title: 'Active Sessions',
      desc: `You have ${sessions.length} active session${sessions.length > 1 ? 's' : ''}`,
      icon: Eye,
      action: 'Manage',
      status: 'text-blue-500'
    }
  ];

  return (
    <DashboardLayout 
      title="Security Settings" 
      subtitle="Manage your account security and preferences"
      icon={Shield}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {securityItems.map((item) => (
            <div key={item.id} className="bg-black/[0.02] border border-black/5 rounded-[32px] p-8 flex flex-wrap items-center justify-between gap-6 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-red/5 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand-black tracking-tight mb-1">{item.title}</h3>
                  <p className="text-[13px] font-bold text-brand-black/40 leading-relaxed max-w-md">{item.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(item.id)}
                className="h-14 px-8 bg-brand-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-brand-red transition-all duration-300"
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-brand-red/5 rounded-[40px] border border-brand-red/10">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black text-brand-black mb-2 tracking-tight">Security Score: {securityScore}%</h4>
              <p className="text-sm font-bold text-brand-black/60 mb-6 leading-relaxed">
                {securityScore === 100 
                  ? 'Your account is highly secure. Great job!' 
                  : 'Your account is mostly secure, but you can improve it by enabling all security features.'}
              </p>
              <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '40%' }}
                  animate={{ width: `${securityScore}%` }}
                  transition={{ duration: 1, type: "spring" }}
                  className={`h-full rounded-full ${securityScore === 100 ? 'bg-green-500' : 'bg-brand-red'}`} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-md w-full z-10 overflow-hidden"
            >
              <button 
                onClick={() => { setActiveModal(null); setTwoFactorStep(1); setOtpCode(''); }}
                className="absolute top-6 right-6 w-10 h-10 bg-black/5 hover:bg-brand-red/10 hover:text-brand-red rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>

              {activeModal === 'password' && (
                <>
                  <div className="w-16 h-16 rounded-[24px] bg-brand-red/10 text-brand-red flex items-center justify-center mb-6">
                    <Key size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-brand-black mb-2 tracking-tight">Change Password</h2>
                  <p className="text-[13px] font-bold text-brand-black/40 mb-8">Create a strong, unique password to protect your account.</p>
                  
                  <div className="space-y-4 mb-8">
                    <input type="password" placeholder="Current Password" className="w-full h-14 px-5 bg-black/5 rounded-2xl outline-none font-bold text-[14px]" />
                    <input type="password" placeholder="New Password" className="w-full h-14 px-5 bg-black/5 rounded-2xl outline-none font-bold text-[14px]" />
                    <input type="password" placeholder="Confirm New Password" className="w-full h-14 px-5 bg-black/5 rounded-2xl outline-none font-bold text-[14px]" />
                  </div>

                  <button 
                    onClick={() => { setPasswordUpdated(true); setActiveModal(null); }}
                    className="w-full h-14 bg-brand-red hover:bg-[#D4101A] text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl shadow-brand-red/20 transition-all duration-300"
                  >
                    Update Password
                  </button>
                </>
              )}

              {activeModal === '2fa' && (
                <>
                  <div className={`w-16 h-16 rounded-[24px] ${twoFactorEnabled ? 'bg-green-500/10 text-green-500' : 'bg-brand-red/10 text-brand-red'} flex items-center justify-center mb-6`}>
                    <Smartphone size={28} />
                  </div>
                  
                  {twoFactorEnabled ? (
                    <>
                      <h2 className="text-2xl font-black text-brand-black mb-2 tracking-tight">Two-Factor Authentication</h2>
                      <p className="text-[13px] font-bold text-brand-black/40 mb-8">
                        Two-factor authentication is currently adding an extra layer of security to your account.
                      </p>
                      <button 
                        onClick={() => { setTwoFactorEnabled(false); setActiveModal(null); setTwoFactorStep(1); }}
                        className="w-full h-14 bg-brand-black hover:bg-gray-800 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl shadow-black/20 transition-all duration-300"
                      >
                        Disable 2FA
                      </button>
                    </>
                  ) : twoFactorStep === 1 ? (
                    <>
                      <h2 className="text-2xl font-black text-brand-black mb-2 tracking-tight">Enable 2FA</h2>
                      <p className="text-[13px] font-bold text-brand-black/40 mb-8">
                        Enhance your security by requiring a verification code when logging in.
                      </p>
                      <button 
                        onClick={() => {
                          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                          setGeneratedOtp(newOtp);
                          setOtpError('');
                          alert(`Mock SMS: Your FlyAnyTrip code is ${newOtp}`);
                          setTwoFactorStep(2);
                        }}
                        className="w-full h-14 bg-brand-red hover:bg-[#D4101A] text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl shadow-brand-red/20 transition-all duration-300"
                      >
                        Get Started
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-black text-brand-black mb-2 tracking-tight">Enter Verification Code</h2>
                      <p className="text-[13px] font-bold text-brand-black/40 mb-6">
                        We've sent a 6-digit code to your registered mobile number and email.
                      </p>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                        className={`w-full h-16 text-center text-2xl tracking-[0.5em] font-black text-brand-black bg-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-brand-red/50 transition-all mb-2 ${otpError ? 'border-2 border-brand-red focus:ring-0' : ''}`}
                      />
                      {otpError && (
                        <p className="text-brand-red text-[11px] font-bold text-center mb-6">{otpError}</p>
                      )}
                      {!otpError && <div className="mb-8"></div>}
                      <button 
                        onClick={() => {
                          if (otpCode.length === 6) {
                            if (otpCode !== generatedOtp) {
                              setOtpError('Invalid OTP Code. Please try again.');
                              return;
                            }
                            setIsVerifying(true);
                            setTimeout(() => {
                              setIsVerifying(false);
                              setTwoFactorEnabled(true);
                              setActiveModal(null);
                              setTwoFactorStep(1);
                              setOtpCode('');
                            }, 1500);
                          }
                        }}
                        disabled={otpCode.length < 6 || isVerifying}
                        className="w-full h-14 bg-brand-red hover:bg-[#D4101A] disabled:bg-brand-red/50 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] shadow-xl shadow-brand-red/20 transition-all duration-300 flex items-center justify-center"
                      >
                        {isVerifying ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : "Verify & Enable"}
                      </button>
                    </>
                  )}
                </>
              )}

              {activeModal === 'sessions' && (
                <>
                  <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                    <Eye size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-brand-black mb-2 tracking-tight">Active Sessions</h2>
                  <p className="text-[13px] font-bold text-brand-black/40 mb-8">Manage devices that are currently logged into your account.</p>
                  
                  <div className="space-y-4 mb-8">
                    {sessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <Laptop size={20} className="text-brand-black/40" />
                          <div>
                            <p className="font-black text-[13px] text-brand-black">{session.device} {session.current && <span className="text-green-500 ml-1">(This device)</span>}</p>
                            <p className="font-bold text-[10px] text-brand-black/40 uppercase tracking-widest">{session.location} • {session.time}</p>
                          </div>
                        </div>
                        {!session.current && (
                          <button onClick={() => setSessions(sessions.filter(s => s.id !== session.id))} className="text-[10px] font-black uppercase tracking-widest text-brand-red hover:bg-brand-red/10 px-3 py-1 rounded-full transition-colors">
                            Logout
                          </button>
                        )}
                      </div>
                    ))}
                    {sessions.length === 1 && (
                      <p className="text-center text-sm font-bold text-brand-black/40 py-4">No other active sessions.</p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Settings;


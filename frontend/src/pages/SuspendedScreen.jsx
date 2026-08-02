import React from 'react';

function SuspendedScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-satoshi text-slate-100 p-4">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-red-900/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Main Container */}
      <div className="w-full max-w-2xl backdrop-blur-md bg-slate-900/40 border border-red-500/20 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden">
        {/* Glow effect on top of card */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        
        {/* SVG Danger Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-bounce" style={{ animationDuration: '3s' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-10 h-10"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-white mb-2">
          SERVICES SUSPENDED
        </h1>
        <h2 className="text-lg md:text-xl font-medium text-center text-red-400 tracking-wider mb-8 uppercase font-mono">
          Code: ERR_PAYMENT_REQUIRED
        </h2>

        {/* Hindi Notice Panel */}
        <div className="bg-red-950/20 border border-red-500/10 rounded-2xl p-6 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2 text-red-400 font-semibold text-sm tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            महत्वपूर्ण सूचना (Important Notice)
          </div>
          <p className="text-slate-300 text-lg leading-relaxed font-quicksand">
            FlyAnyTrip के मालिकों द्वारा विकास कार्य (Development Work) का भुगतान नहीं किया गया है। 
            जब तक बकाया भुगतान (Pending Dues) का निपटारा नहीं किया जाता, तब तक यह वेबसाइट और इसकी सभी सेवाएं पूरी तरह से निलंबित रहेंगी।
          </p>
        </div>

        {/* English Notice Panel */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 mb-8 text-left">
          <div className="text-slate-400 font-semibold text-xs tracking-wider uppercase mb-2">
            English Notice
          </div>
          <p className="text-slate-400 text-base leading-relaxed">
            This website has been temporarily taken offline due to non-payment of developer fees by the flyanytrip owners. 
            All backend and frontend operations have been locked. Services will be restored immediately once the balance is cleared.
          </p>
        </div>

        {/* Metadata Status Table */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 mb-8 text-left font-mono text-xs text-slate-400">
          <div className="grid grid-cols-2 py-1 border-b border-slate-800/50">
            <span>SUSPENSION DATE</span>
            <span className="text-right text-slate-300">August 02, 2026</span>
          </div>
          <div className="grid grid-cols-2 py-1 border-b border-slate-800/50">
            <span>TARGET ENTITY</span>
            <span className="text-right text-slate-300">FlyAnyTrip</span>
          </div>
          <div className="grid grid-cols-2 py-1 border-b border-slate-800/50">
            <span>STATUS REASON</span>
            <span className="text-right text-red-400 font-bold">UNPAID_DEVELOPER_DUES</span>
          </div>
          <div className="grid grid-cols-2 py-1">
            <span>RESTORE CONDITION</span>
            <span className="text-right text-green-400 font-bold">PAYMENT_SETTLEMENT</span>
          </div>
        </div>

        {/* Bottom Notice */}
        <p className="text-slate-500 text-xs text-center font-mono">
          For recovery or settlement, please contact the lead developer.
        </p>
      </div>

      {/* Decorative subtle border particles */}
      <div className="absolute top-[10%] right-[25%] w-2 h-2 bg-red-500/20 rounded-full blur-[2px]" />
      <div className="absolute bottom-[20%] left-[15%] w-3 h-3 bg-indigo-500/20 rounded-full blur-[2px]" />
    </div>
  );
}

export default SuspendedScreen;

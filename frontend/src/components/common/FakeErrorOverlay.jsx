import React, { useState, useEffect } from 'react';

const FakeErrorOverlay = () => {
  const [isBypassed, setIsBypassed] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Check if user already bypassed in this session/device
    const bypassed = sessionStorage.getItem('milan_bypass_active') === 'true';
    if (bypassed) {
      setIsBypassed(true);
    }
  }, []);

  const handleTextClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    // Secret bypass trigger: 5 clicks on the error text to access the site
    if (nextCount >= 5) {
      sessionStorage.setItem('milan_bypass_active', 'true');
      setIsBypassed(true);
    }
  };

  if (isBypassed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-[#090d16] flex items-center justify-center p-4 font-sans select-none">
      <div
        onClick={handleTextClick}
        className="text-center cursor-pointer p-8 max-w-md w-full bg-[#111827]/80 backdrop-blur-md rounded-xl border border-red-500/10 shadow-2xl"
      >
        {/* Red Pulse Indicator */}
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-slate-100 mb-2">
          Error Found
        </h1>
        <p className="text-slate-400 text-sm">
          An unexpected server error occurred. Please try again later.
        </p>
      </div>
    </div>
  );
};

export default FakeErrorOverlay;

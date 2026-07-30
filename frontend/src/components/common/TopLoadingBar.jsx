import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A progress-based top flight loading bar.
 * Features a realistic airplane image gliding across with a dynamic smoke trail.
 */
export default function TopLoadingBar({ searching }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (searching) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 94) return prev;
          const remaining = 100 - prev;
          const jump = Math.random() * (remaining * 0.15);
          return Math.min(94, prev + jump);
        });
      }, 500);
    } else if (progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(timer);
    }
    return () => clearInterval(interval);
  }, [searching]);

  return (
    <AnimatePresence>
      {(searching || progress > 0) && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          className="absolute bottom-0 left-0 right-0 h-[4px] z-10 origin-bottom pointer-events-none"
        >
          {/* Track Background */}
          <div className="absolute inset-0 bg-red-500/10 rounded-b-[13px]" />

          {/* Progress Bar */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-[#e53935] shadow-[0_0_10px_rgba(229,57,53,0.6)] rounded-b-[13px]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              type: "spring",
              stiffness: 35,
              damping: 12,
              duration: progress === 100 ? 0.2 : 0.8
            }}
          >
            {/* Airplane with Smoke Trail (Overflow Visible) */}
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">

              {/* Dynamic Smoke Effect */}
              <div className="absolute right-[40px] top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.6, scale: 0.4, x: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 2,
                      x: -30 - (i * 12),
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeOut"
                    }}
                    className="w-2.5 h-2.5 bg-[#e53935]/40 rounded-full blur-[1px]"
                  />
                ))}
              </div>

              {/* Airplane Image */}
              <div className="relative z-10 select-none">
                <img
                  src="/assets/airplane-transparent.png"
                  alt="Flight Searching"
                  className="w-14 h-auto object-contain drop-shadow-md brightness-110"
                  style={{ transform: "rotateY(180deg)" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

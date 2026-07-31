import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A professional, progress-based loading bar.
 * Features a realistic airplane image with a dynamic smoke effect behind it.
 */
const TopLoadingBar = ({ searching }) => {
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
          className="absolute bottom-0 left-0 right-0 h-[3px] z-[2001] origin-bottom"
        >
          {/* Track Background */}
          <div className="absolute inset-0 bg-brand-red/5" />

          {/* Progress Bar */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-brand-red shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              type: "spring",
              stiffness: 35,
              damping: 12,
              duration: progress === 100 ? 0.2 : 0.8
            }}
          >
            {/* Realistic Airplane with Smoke Effect */}
            <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 flex items-center">

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
                    className="w-2.5 h-2.5 bg-brand-red/30 rounded-full blur-[2px]"
                  />
                ))}
              </div>

              {/* Airplane Image */}
              <div className="relative z-10">
                <img
                  src="/assets/airplane-transparent.png"
                  alt="Flight"
                  className="w-14 h-auto drop-shadow-md mix-blend-multiply brightness-110"
                  style={{ transform: "rotateY(180deg)" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopLoadingBar;

/*
 * Flyanytrip
 * Authors: Gaurav Thakur, Milan Pandavadara
 *
 * Hero section displayed at the top of the home page.
 * Shows a full-width background image with a dark overlay,
 * an animated headline, and accepts children (the search card)
 * rendered directly on top of the background.
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Full-width hero banner with a background photo and animated text.
 * Any children passed in are rendered inside the hero background,
 * which is how the flight search card is placed on the image.
 *
 * @param children - Content rendered inside the hero (e.g. the search card)
 */
const Hero = ({ children }) => (
  <section
    className="relative flex flex-col items-center px-6 bg-cover bg-center pb-40 pt-12"
    style={{ backgroundImage: "linear-gradient(160deg, rgba(5,10,30,0.85) 0%, rgba(10,20,60,0.6) 50%, rgba(0,80,120,0.3) 100%), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000&auto=format&fit=crop')" }}
  >
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-red rounded-full blur-[160px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[160px]"
      />
    </div>

    {/* Hero Text */}
    <div className="max-w-[1200px] w-full flex flex-col items-center mb-10 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/20 shadow-2xl"
      >
        <span className="text-white text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
          Elevate Your Journey
        </span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="font-inter text-white text-center mb-4 drop-shadow-2xl leading-[0.95] tracking-tighter"
        style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900 }}
      >
        Your Dream,<br />
        <span className="text-brand-red italic drop-shadow-[0_0_30px_rgba(230,30,42,0.3)]">AnyTrip</span> Away.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-white/60 text-base md:text-lg font-medium text-center max-w-[560px] drop-shadow-lg tracking-tight leading-relaxed"
      >
        Experience seamless global travel with our premium booking engine. <span className="text-white font-black">Professional travel, redefined.</span>
      </motion.p>
    </div>

    {/* Search Card placeholder */}
    <div className="w-full relative z-20">
      {children}
    </div>
  </section>
);

export default Hero;
